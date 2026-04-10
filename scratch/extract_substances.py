import re
import json
import os

def extract_substances(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Find the substances array
    match = re.search(r'const substances: SubstanceConfig\[\] = \[(.*)\];', content, re.DOTALL)
    if not match:
        print("Could not find substances array")
        return {}

    substances_raw = match.group(1)
    
    # This is a very complex file to parse with regex perfectly because of nested objects.
    # However, since I just need the strings, I can use a simpler approach:
    # Split by slugs and parse each block.
    
    substances_data = {}
    
    # Split by entries like { slug: '...'
    entries = re.split(r'\{\s*slug:\s*', substances_raw)
    
    for entry in entries[1:]: # Skip first empty split
        slug_match = re.match(r"['\"]([^'\"]+)['\"]", entry)
        if not slug_match: continue
        slug = slug_match.group(1)
        substances_data[slug] = {}
        
        # Extract trackers
        trackers_match = re.search(r'trackers:\s*\[(.*?)\]\s*,\s*calculator:', entry, re.DOTALL)
        if not trackers_match:
            # Try finding until activities
            trackers_match = re.search(r'trackers:\s*\[(.*?)\]\s*,\s*activities:', entry, re.DOTALL)
        
        if trackers_match:
            trackers_raw = trackers_match.group(1)
            # Find tracker name and fields
            # id: '...', name: '...'
            tracker_entries = re.findall(r"id:\s*['\"]([^'\"]+)['\"],\s*name:\s*['\"]([^'\"]+)['\"]", trackers_raw)
            substances_data[slug]['trackers'] = {}
            for t_id, t_name in tracker_entries:
                substances_data[slug]['trackers'][t_id] = { "name": t_name, "fields": {} }
                # Extract fields for this tracker - this is getting hard with regex.
                # Let's try to find fields: [...] for this tracker
                # We need to find the block for this tracker specifically.
                t_block_match = re.search(fr"id:\s*['\"]{t_id}['\"].*?fields:\s*\[(.*?)\]", trackers_raw, re.DOTALL)
                if t_block_match:
                    fields_raw = t_block_match.group(1)
                    field_entries = re.findall(r"key:\s*['\"]([^'\"]+)['\"],\s*label:\s*['\"]([^'\"]+)['\"]", fields_raw)
                    for f_key, f_label in field_entries:
                        substances_data[slug]['trackers'][t_id]['fields'][f_key] = { "label": f_label }
                        # Check for options
                        opt_match = re.search(fr"key:\s*['\"]{f_key}['\"].*?options:\s*\[(.*?)\]", fields_raw, re.DOTALL)
                        if opt_match:
                            opts = re.findall(r"['\"]([^'\"]+)['\"]", opt_match.group(1))
                            substances_data[slug]['trackers'][t_id]['fields'][f_key]["options"] = { str(i): opt for i, opt in enumerate(opts) }

        # Extract Calculator
        calc_match = re.search(r'calculator:\s*\{(.*?)\}\s*,\s*(?:activities|articles):', entry, re.DOTALL)
        if calc_match:
            calc_raw = calc_match.group(1)
            substances_data[slug]['calculator'] = { "inputs": {}, "results": {} }
            
            title_match = re.search(r"title:\s*['\"]([^'\"]+)['\"]", calc_raw)
            if title_match:
                substances_data[slug]['calculator']['title'] = title_match.group(1)
            
            inputs_match = re.search(r'inputs:\s*\[(.*?)\]', calc_raw, re.DOTALL)
            if inputs_match:
                input_entries = re.findall(r"key:\s*['\"]([^'\"]+)['\"],\s*label:\s*['\"]([^'\"]+)['\"]", inputs_match.group(1))
                for i_key, i_label in input_entries:
                    substances_data[slug]['calculator']['inputs'][i_key] = { "label": i_label }
            
            # results labels from compute function
            # compute: (inputs) => { ... return [ { label: '...', value: '...' }, ... ] }
            results_match = re.findall(r"label:\s*['\"]([^'\"]+)['\"]", calc_raw)
            # Filter results labels - usually after compute
            # Actually, title is often first, then inputs, then compute.
            # So labels after compute are likely results.
            # A better way: find the return [...] block
            compute_return = re.search(r'return\s*\[(.*?)\]', calc_raw, re.DOTALL)
            if compute_return:
                res_labels = re.findall(r"label:\s*['\"]([^'\"]+)['\"]", compute_return.group(1))
                for i, label in enumerate(res_labels):
                    substances_data[slug]['calculator']['results'][str(i)] = { "label": label }

        # Extract Activities
        act_match = re.search(r'activities:\s*\[(.*?)\]\s*,\s*articles:', entry, re.DOTALL)
        if act_match:
            act_raw = act_match.group(1)
            substances_data[slug]['activities'] = {}
            # Split by activity objects
            # Each activity starts with { id: '...'
            act_blocks = re.split(r'\{\s*id:\s*', act_raw)
            for act_block in act_blocks[1:]:
                a_id_match = re.match(r"['\"]([^'\"]+)['\"]", act_block)
                if not a_id_match: continue
                a_id = a_id_match.group(1)
                substances_data[slug]['activities'][a_id] = {}
                
                # Name
                name_match = re.search(r"name:\s*['\"]([^'\"]+)['\"]", act_block)
                if name_match: substances_data[slug]['activities'][a_id]["name"] = name_match.group(1)
                
                # Description
                desc_match = re.search(r"description:\s*['\"]([^'\"]+)['\"]", act_block)
                if desc_match: substances_data[slug]['activities'][a_id]["description"] = desc_match.group(1)

                # Tap Prompt
                tp_match = re.search(r"tapPrompt:\s*['\"]([^'\"]+)['\"]", act_block)
                if tp_match: substances_data[slug]['activities'][a_id]["tapPrompt"] = tp_match.group(1)

                # Quiz Questions
                q_match = re.search(r'questions:\s*\[(.*?)\]\s*,\s*\n', act_block, re.DOTALL)
                if q_match:
                    substances_data[slug]['activities'][a_id]["questions"] = {}
                    qs_raw = q_match.group(1)
                    q_entries = re.split(r'\{\s*question:\s*', qs_raw)
                    for i, q_entry in enumerate(q_entries[1:]):
                        substances_data[slug]['activities'][a_id]["questions"][str(i)] = {}
                        q_text_match = re.match(r"['\"]([^'\"]+)['\"]", q_entry)
                        if q_text_match: substances_data[slug]['activities'][a_id]["questions"][str(i)]["question"] = q_text_match.group(1)
                        
                        exp_match = re.search(r"explanation:\s*['\"]([^'\"]+)['\"]", q_entry)
                        if exp_match: substances_data[slug]['activities'][a_id]["questions"][str(i)]["explanation"] = exp_match.group(1)
                        
                        opt_match = re.search(r'options:\s*\[(.*?)\]', q_entry, re.DOTALL)
                        if opt_match:
                            opts = re.findall(r"['\"]([^'\"]+)['\"]", opt_match.group(1))
                            substances_data[slug]['activities'][a_id]["questions"][str(i)]["options"] = { str(k): opt for k, opt in enumerate(opts) }

                # Visualization Scenes
                s_match = re.search(r'scenes:\s*\[(.*?)\]', act_block, re.DOTALL)
                if s_match:
                    substances_data[slug]['activities'][a_id]["scenes"] = {}
                    ss_raw = s_match.group(1)
                    texts = re.findall(r"text:\s*['\"]([^'\"]+)['\"]", ss_raw)
                    for i, text in enumerate(texts):
                        substances_data[slug]['activities'][a_id]["scenes"][str(i)] = { "text": text }

                # Affirmations
                af_match = re.search(r'affirmations:\s*\[(.*?)\]', act_block, re.DOTALL)
                if af_match:
                    substances_data[slug]['activities'][a_id]["affirmations"] = {}
                    affs = re.findall(r"['\"]([^'\"]+)['\"]", af_match.group(1))
                    for i, text in enumerate(affs):
                        substances_data[slug]['activities'][a_id]["affirmations"][str(i)] = text

                # Body Zones
                bz_match = re.search(r'bodyZones:\s*\[(.*?)\]', act_block, re.DOTALL)
                if bz_match:
                    substances_data[slug]['activities'][a_id]["bodyZones"] = {}
                    zones_raw = bz_match.group(1)
                    z_entries = re.findall(r"name:\s*['\"]([^'\"]+)['\"],\s*emoji:.*?prompt:\s*['\"]([^'\"]+)['\"]", zones_raw, re.DOTALL)
                    for i, (z_name, z_prompt) in enumerate(z_entries):
                        substances_data[slug]['activities'][a_id]["bodyZones"][str(i)] = { "name": z_name, "prompt": z_prompt }

                # Sorting Items & Categories
                sc_match = re.search(r'sortCategories:\s*\[(.*?)\]', act_block, re.DOTALL)
                if sc_match:
                    cats = re.findall(r"['\"]([^'\"]+)['\"]", sc_match.group(1))
                    substances_data[slug]['activities'][a_id]["sortCategories"] = { str(i): cat for i, cat in enumerate(cats) }
                
                si_match = re.search(r'sortItems:\s*\[(.*?)\]', act_block, re.DOTALL)
                if si_match:
                    substances_data[slug]['activities'][a_id]["sortItems"] = {}
                    items = re.findall(r"text:\s*['\"]([^'\"]+)['\"]", si_match.group(1))
                    for i, text in enumerate(items):
                        substances_data[slug]['activities'][a_id]["sortItems"][str(i)] = { "text": text }

                # Journal Fields
                jf_match = re.search(r'fields:\s*\[(.*?)\]', act_block, re.DOTALL)
                if jf_match:
                    substances_data[slug]['activities'][a_id]["fields"] = {}
                    fields_raw = jf_match.group(1)
                    f_entries = re.findall(r"key:\s*['\"]([^'\"]+)['\"],\s*label:\s*['\"]([^'\"]+)['\"]", fields_raw)
                    for f_key, f_label in f_entries:
                        substances_data[slug]['activities'][a_id]["fields"][f_key] = { "label": f_label }
                        # Placeholder
                        ph_match = re.search(fr"key:\s*['\"]{f_key}['\"].*?placeholder:\s*['\"]([^'\"]+)['\"]", fields_raw, re.DOTALL)
                        if ph_match: substances_data[slug]['activities'][a_id]["fields"][f_key]["placeholder"] = ph_match.group(1)
                        # Options
                        opts_match = re.search(fr"key:\s*['\"]{f_key}['\"].*?options:\s*\[(.*?)\]", fields_raw, re.DOTALL)
                        if opts_match:
                            opts = re.findall(r"['\"]([^'\"]+)['\"]", opts_match.group(1))
                            substances_data[slug]['activities'][a_id]["fields"][f_key]["options"] = { str(i): opt for i, opt in enumerate(opts) }

                # Checklist Items
                cl_match = re.search(r'items:\s*\[(.*?)\]', act_block, re.DOTALL)
                if cl_match:
                    substances_data[slug]['activities'][a_id]["items"] = {}
                    items_raw = cl_match.group(1)
                    # title: '...', content: '...'
                    c_entries = re.findall(r"title:\s*['\"]([^'\"]+)['\"],\s*content:\s*['\"]([^'\"]+)['\"]", items_raw, re.DOTALL)
                    for i, (c_title, c_content) in enumerate(c_entries):
                        substances_data[slug]['activities'][a_id]["items"][str(i)] = { "title": c_title, "content": c_content }

                # Breathing Phases
                bp_match = re.search(r'phases:\s*\[(.*?)\]', act_block, re.DOTALL)
                if bp_match:
                    substances_data[slug]['activities'][a_id]["phases"] = {}
                    phases_raw = bp_match.group(1)
                    p_entries = re.findall(r"text:\s*['\"]([^'\"]+)['\"]", phases_raw)
                    for i, text in enumerate(p_entries):
                        substances_data[slug]['activities'][a_id]["phases"][str(i)] = { "text": text }

        # Extract Articles
        art_match = re.search(r'articles:\s*\[(.*?)\]\s*,\s*communityPosts:', entry, re.DOTALL)
        if art_match:
            substances_data[slug]['articles'] = {}
            arts_raw = art_match.group(1)
            art_blocks = re.split(r'\{\s*id:\s*', arts_raw)
            for art_block in art_blocks[1:]:
                art_id_match = re.match(r"['\"]([^'\"]+)['\"]", art_block)
                if not art_id_match: continue
                art_id = art_id_match.group(1)
                substances_data[slug]['articles'][art_id] = {}
                
                t_match = re.search(r"title:\s*['\"]([^'\"]+)['\"]", art_block)
                if t_match: substances_data[slug]['articles'][art_id]["title"] = t_match.group(1)
                
                tag_match = re.search(r"tag:\s*['\"]([^'\"]+)['\"]", art_block)
                if tag_match: substances_data[slug]['articles'][art_id]["tag"] = tag_match.group(1)
                
                # Content is very long, maybe just skip or take it as is.
                # Actually, I need the content keys too.
                c_match = re.search(r"content:\s*['\"](.*?)['\"]\s*", art_block, re.DOTALL)
                if c_match: substances_data[slug]['articles'][art_id]["content"] = c_match.group(1)

    return substances_data

if __name__ == "__main__":
    data = extract_substances("src/data/substances.ts")
    # Wrap in quit.substances
    output = { "quit": { "substances": data } }
    
    with open("substances_i18n.json", "w", encoding="utf-8") as f:
        json.dump(output, f, indent=2, ensure_ascii=False)
    
    print(f"Extracted {len(data)} substances to substances_i18n.json")
