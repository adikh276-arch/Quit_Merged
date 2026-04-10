import json

def sync_translations(lang_file, extracted_file, output_missing):
    with open(lang_file, 'r', encoding='utf-8') as f:
        lang_data = json.load(f)
    
    with open(extracted_file, 'r', encoding='utf-8') as f:
        extracted_data = json.load(f)
    
    missing = {}
    for k, v in extracted_data.items():
        if k not in lang_data or lang_data[k] == "" or "TOBE_TRANSLATED" in lang_data[k]:
            missing[k] = v
    
    with open(output_missing, 'w', encoding='utf-8') as f:
        json.dump(missing, f, indent=2, ensure_ascii=False)
    
    return len(missing)

if __name__ == "__main__":
    missing_en = sync_translations("src/i18n/locales/en.json", "flattened_substances.json", "missing_en.json")
    missing_ar = sync_translations("src/i18n/locales/ar.json", "flattened_substances.json", "missing_ar.json")
    
    print(f"Missing keys in EN: {missing_en}")
    print(f"Missing keys in AR: {missing_ar}")
