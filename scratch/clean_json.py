import json

def clean_json(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    # Python dicts maintain order since 3.7, but sorting keys is better for consistency
    sorted_data = dict(sorted(data.items()))
    
    with open(file_path, 'w', encoding='utf-8') as f:
        json.dump(sorted_data, f, indent=2, ensure_ascii=False)

if __name__ == "__main__":
    clean_json("src/i18n/locales/en.json")
    clean_json("src/i18n/locales/ar.json")
    print("Files cleaned and sorted.")
