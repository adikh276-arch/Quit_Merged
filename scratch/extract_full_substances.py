import re
import json

def extract_full_substances(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Find the substances array
    match = re.search(r'const substances: SubstanceConfig\[\] = \[(.*)\];', content, re.DOTALL)
    if not match: return {}

    substances_raw = match.group(1)
    
    # Split by slugs and parse each block
    entries = re.split(r'\{\s*slug:\s*', substances_raw)
    
    substances_data = {}
    
    for entry in entries[1:]:
        slug_match = re.match(r"['\"]([^'\"]+)['\"]", entry)
        if not slug_match: continue
        slug = slug_match.group(1)
        substances_data[slug] = {}
        
        # Substance name and descriptor
        name_match = re.search(r"name:\s*['\"]([^'\"]+)['\"]", entry)
        if name_match: substances_data[slug]["name"] = name_match.group(1)
        
        desc_match = re.search(r"descriptor:\s*['\"]([^'\"]+)['\"]", entry)
        if desc_match: substances_data[slug]["descriptor"] = desc_match.group(1)

        # Trackers
        trackers_match = re.search(r'trackers:\s*\[(.*?)\]\s*,\s*(?:calculator|activities):', entry, re.DOTALL)
        if trackers_match:
            trackers_raw = trackers_match.group(1)
            substances_data[slug]['trackers'] = {}
            # Find tracker objects
            t_blocks = re.split(r'\{\s*id:\s*', trackers_raw)
            for t_block in t_blocks[1:]:
                tid_match = re.match(r"['\"]([^'\"]+)['\"]", t_block)
                if not tid_match: continue
                tid = tid_match.group(1)
                substances_data[slug]['trackers'][tid] = {}
                
                tname_match = re.search(r"name:\s*['\"]([^'\"]+)['\"]", t_block)
                if tname_match: substances_data[slug]['trackers'][tid]["name"] = tname_match.group(1)
                
                insight_match = re.search(r"insight:\s*['\"]([^'\"]+)['\"]", t_block)
                if insight_match: substances_data[slug]['trackers'][tid]["insight"] = insight_match.group(1)
                
                ylabel_match = re.search(r"yAxisLabel:\s*['\"]([^'\"]+)['\"]", t_block)
                if ylabel_match: substances_data[slug]['trackers'][tid]["yAxisLabel"] = ylabel_match.group(1)

                # Fields
                fields_match = re.search(r'fields:\s*\[(.*?)\]', t_block, re.DOTALL)
                if fields_match:
                    substances_data[slug]['trackers'][tid]['fields'] = {}
                    f_raw = fields_match.group(1)
                    f_blocks = re.split(r'\{\s*key:\s*', f_raw)
                    for f_block in f_blocks[1:]:
                        fkey_match = re.match(r"['\"]([^'\"]+)['\"]", f_block)
                        if not fkey_match: continue
                        fkey = fkey_match.group(1)
                        substances_data[slug]['trackers'][tid]['fields'][fkey] = {}
                        
                        flabel_match = re.search(r"label:\s*['\"]([^'\"]+)['\"]", f_block)
                        if flabel_match: substances_data[slug]['trackers'][tid]['fields'][fkey]["label"] = flabel_match.group(1)
                        
                        # Options
                        opts_match = re.search(r'options:\s*\[(.*?)\]', f_block, re.DOTALL)
                        if opts_match:
                            opts = re.findall(r"['\"]([^'\"]+)['\"]", opts_match.group(1))
                            substances_data[slug]['trackers'][tid]['fields'][fkey]["options"] = { str(i): opt for i, opt in enumerate(opts) }

        # Calculator
        calc_match = re.search(r'calculator:\s*\{(.*?)\}\s*,\s*(?:activities|articles):', entry, re.DOTALL)
        if calc_match:
            calc_raw = calc_match.group(1)
            substances_data[slug]['calculator'] = { "inputs": {}, "results": {} }
            
            title_match = re.search(r"title:\s*['\"]([^'\"]+)['\"]", calc_raw)
            if title_match: substances_data[slug]['calculator']['title'] = title_match.group(1)
            
            note_match = re.search(r"note:\s*['\"]([^'\"]+)['\"]", calc_raw)
            if note_match: substances_data[slug]['calculator']['note'] = note_match.group(1)

            inputs_match = re.search(r'inputs:\s*\[(.*?)\]', calc_raw, re.DOTALL)
            if inputs_match:
                i_raw = inputs_match.group(1)
                i_blocks = re.split(r'\{\s*key:\s*', i_raw)
                for i_block in i_blocks[1:]:
                    ikey_match = re.match(r"['\"]([^'\"]+)['\"]", i_block)
                    if not ikey_match: continue
                    ikey = ikey_match.group(1)
                    substances_data[slug]['calculator']['inputs'][ikey] = {}
                    ilabel_match = re.search(r"label:\s*['\"]([^'\"]+)['\"]", i_block)
                    if ilabel_match: substances_data[slug]['calculator']['inputs'][ikey]["label"] = ilabel_match.group(1)

            compute_return = re.search(r'return\s*\[(.*?)\]', calc_raw, re.DOTALL)
            if compute_return:
                res_labels = re.findall(r"label:\s*['\"]([^'\"]+)['\"]", compute_return.group(1))
                for i, label in enumerate(res_labels):
                    substances_data[slug]['calculator']['results'][str(i)] = { "label": label }

        # Activities
        act_match = re.search(r'activities:\s*\[(.*?)\]\s*,\s*articles:', entry, re.DOTALL)
        if act_match:
            act_raw = act_match.group(1)
            substances_data[slug]['activities'] = {}
            act_blocks = re.split(r'\{\s*id:\s*', act_raw)
            for act_block in act_blocks[1:]:
                aid_match = re.match(r"['\"]([^'\"]+)['\"]", act_block)
                if not aid_match: continue
                aid = aid_match.group(1)
                substances_data[slug]['activities'][aid] = {}
                
                aname_match = re.search(r"name:\s*['\"]([^'\"]+)['\"]", act_block)
                if aname_match: substances_data[slug]['activities'][aid]["name"] = aname_match.group(1)
                
                adesc_match = re.search(r"description:\s*['\"]([^'\"]+)['\"]", act_block)
                if adesc_match: substances_data[slug]['activities'][aid]["description"] = adesc_match.group(1)

                # Phases
                ph_match = re.search(r'phases:\s*\[(.*?)\]', act_block, re.DOTALL)
                if ph_match:
                    substances_data[slug]['activities'][aid]["phases"] = {}
                    p_entries = re.findall(r"text:\s*['\"]([^'\"]+)['\"]", ph_match.group(1))
                    for i, t in enumerate(p_entries): substances_data[slug]['activities'][aid]["phases"][str(i)] = { "text": t }

                # Body Zones
                bz_match = re.search(r'bodyZones:\s*\[(.*?)\]', act_block, re.DOTALL)
                if bz_match:
                    substances_data[slug]['activities'][aid]["bodyZones"] = {}
                    z_raw = bz_match.group(1)
                    z_entries = re.findall(r"name:\s*['\"]([^'\"]+)['\"],\s*emoji:.*?prompt:\s*['\"]([^'\"]+)['\"]", z_raw, re.DOTALL)
                    for i, (zn, zp) in enumerate(z_entries): substances_data[slug]['activities'][aid]["bodyZones"][str(i)] = { "name": zn, "prompt": zp }

                # Questions
                q_match = re.search(r'questions:\s*\[(.*?)\]', act_block, re.DOTALL)
                if q_match:
                    substances_data[slug]['activities'][aid]["questions"] = {}
                    qs_raw = q_match.group(1)
                    q_entries = re.split(r'\{\s*question:\s*', qs_raw)
                    for i, qe in enumerate(q_entries[1:]):
                        qt_match = re.match(r"['\"]([^'\"]+)['\"]", qe)
                        if not qt_match: continue
                        substances_data[slug]['activities'][aid]["questions"][str(i)] = { "question": qt_match.group(1) }
                        ex_match = re.search(r"explanation:\s*['\"]([^'\"]+)['\"]", qe)
                        if ex_match: substances_data[slug]['activities'][aid]["questions"][str(i)]["explanation"] = ex_match.group(1)
                        oo_match = re.search(r'options:\s*\[(.*?)\]', qe, re.DOTALL)
                        if oo_match:
                            opts = re.findall(r"['\"]([^'\"]+)['\"]", oo_match.group(1))
                            substances_data[slug]['activities'][aid]["questions"][str(i)]["options"] = { str(k): o for k, o in enumerate(opts) }

                # Affirmations
                af_match = re.search(r'affirmations:\s*\[(.*?)\]', act_block, re.DOTALL)
                if af_match:
                    affs = re.findall(r"['\"]([^'\"]+)['\"]", af_match.group(1))
                    substances_data[slug]['activities'][aid]["affirmations"] = { str(i): t for i, t in enumerate(affs) }

                # Sorting
                sc_match = re.search(r'sortCategories:\s*\[(.*?)\]', act_block, re.DOTALL)
                if sc_match:
                    cats = re.findall(r"['\"]([^'\"]+)['\"]", sc_match.group(1))
                    substances_data[slug]['activities'][aid]["sortCategories"] = { str(i): t for i, t in enumerate(cats) }
                si_match = re.search(r'sortItems:\s*\[(.*?)\]', act_block, re.DOTALL)
                if si_match:
                    items = re.findall(r"text:\s*['\"]([^'\"]+)['\"]", si_match.group(1))
                    substances_data[slug]['activities'][aid]["sortItems"] = { str(i): { "text": t } for i, t in enumerate(items) }

                # Journal Fields
                jf_match = re.search(r'fields:\s*\[(.*?)\]', act_block, re.DOTALL)
                if jf_match:
                    substances_data[slug]['activities'][aid]["fields"] = {}
                    f_raw = jf_match.group(1)
                    f_entries = re.split(r'\{\s*key:\s*', f_raw)
                    for f_entry in f_entries[1:]:
                        fk_match = re.match(r"['\"]([^'\"]+)['\"]", f_entry)
                        if not fk_match: continue
                        fk = fk_match.group(1)
                        substances_data[slug]['activities'][aid]["fields"][fk] = {}
                        fl_match = re.search(r"label:\s*['\"]([^'\"]+)['\"]", f_entry)
                        if fl_match: substances_data[slug]['activities'][aid]["fields"][fk]["label"] = fl_match.group(1)
                        fp_match = re.search(r"placeholder:\s*['\"]([^'\"]+)['\"]", f_entry)
                        if fp_match: substances_data[slug]['activities'][aid]["fields"][fk]["placeholder"] = fp_match.group(1)
                        fo_match = re.search(r'options:\s*\[(.*?)\]', f_entry, re.DOTALL)
                        if fo_match:
                            opts = re.findall(r"['\"]([^'\"]+)['\"]", fo_match.group(1))
                            substances_data[slug]['activities'][aid]["fields"][fk]["options"] = { str(k): o for k, o in enumerate(opts) }

                # Items
                cl_match = re.search(r'items:\s*\[(.*?)\]', act_block, re.DOTALL)
                if cl_match:
                    substances_data[slug]['activities'][aid]["items"] = {}
                    i_raw = cl_match.group(1)
                    i_entries = re.findall(r"title:\s*['\"]([^'\"]+)['\"],\s*content:\s*['\"]([^'\"]+)['\"]", i_raw, re.DOTALL)
                    for i, (it, ic) in enumerate(i_entries): substances_data[slug]['activities'][aid]["items"][str(i)] = { "title": it, "content": ic }

                # Scenes
                sn_match = re.search(r'scenes:\s*\[(.*?)\]', act_block, re.DOTALL)
                if sn_match:
                    substances_data[slug]['activities'][aid]["scenes"] = {}
                    s_raw = sn_match.group(1)
                    txs = re.findall(r"text:\s*['\"]([^'\"]+)['\"]", s_raw)
                    for i, t in enumerate(txs): substances_data[slug]['activities'][aid]["scenes"][str(i)] = { "text": t }

        # Articles (Titles and Tags only for now, Content is too big)
        art_match = re.search(r'articles:\s*\[(.*?)\]\s*,\s*communityPosts:', entry, re.DOTALL)
        if art_match:
            substances_data[slug]['articles'] = {}
            a_raw = art_match.group(1)
            a_blocks = re.split(r'\{\s*id:\s*', a_raw)
            for a_block in a_blocks[1:]:
                aid_match = re.match(r"['\"]([^'\"]+)['\"]", a_block)
                if not aid_match: continue
                aid = aid_match.group(1)
                substances_data[slug]['articles'][aid] = {}
                at_match = re.search(r"title:\s*['\"]([^'\"]+)['\"]", a_block)
                if at_match: substances_data[slug]['articles'][aid]["title"] = at_match.group(1)
                atg_match = re.search(r"tag:\s*['\"]([^'\"]+)['\"]", a_block)
                if atg_match: substances_data[slug]['articles'][aid]["tag"] = atg_match.group(1)
                # Content key should exist even if we don't extract the full text here
                substances_data[slug]['articles'][aid]["content"] = "TO_BE_EXTRACTED"

    return substances_data

if __name__ == "__main__":
    data = extract_full_substances("src/data/substances.ts")
    output = { "quit": { "substances": data } }
    with open("substances_full_keys.json", "w", encoding="utf-8") as f:
        json.dump(output, f, indent=2, ensure_ascii=False)
