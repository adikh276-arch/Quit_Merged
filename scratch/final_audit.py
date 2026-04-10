import json

def get_keys(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        return set(json.load(f).keys())

if __name__ == "__main__":
    en_keys = get_keys("src/i18n/locales/en.json")
    ar_keys = get_keys("src/i18n/locales/ar.json")
    
    only_in_en = en_keys - ar_keys
    only_in_ar = ar_keys - en_keys
    
    print(f"Keys only in EN: {len(only_in_en)}")
    if only_in_en: print(sorted(list(only_in_en)))
    
    print(f"Keys only in AR: {len(only_in_ar)}")
    if only_in_ar: print(sorted(list(only_in_ar)))
    
    if not only_in_en and not only_in_ar:
        print("PERFECT MATCH! 100% consistency achieved.")
