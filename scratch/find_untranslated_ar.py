import json
import re

def is_english(text):
    # Heuristic: contains English letters but no Arabic letters
    if not isinstance(text, str): return False
    has_english = bool(re.search(r'[a-zA-Z]', text))
    has_arabic = bool(re.search(r'[\u0600-\u06FF]', text))
    return has_english and not has_arabic

def find_untranslated(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    untranslated = {}
    for k, v in data.items():
        if is_english(v):
            # Special case for keys that might be English on purpose (none in this app except maybe IDs?)
            if "quit.substances" in k:
                untranslated[k] = v
    
    return untranslated

if __name__ == "__main__":
    untranslated = find_untranslated("src/i18n/locales/ar.json")
    print(f"Found {len(untranslated)} untranslated strings in ar.json")
    
    with open("untranslated_ar.json", "w", encoding="utf-8") as f:
        json.dump(untranslated, f, indent=2, ensure_ascii=False)
    
    # Print first 5
    for k in list(untranslated.keys())[:10]:
        print(f"{k}: {untranslated[k]}")
