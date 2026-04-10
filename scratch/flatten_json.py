import json

def flatten_dict(d, parent_key='', sep='.'):
    items = []
    for k, v in d.items():
        new_key = f"{parent_key}{sep}{k}" if parent_key else k
        if isinstance(v, dict):
            items.extend(flatten_dict(v, new_key, sep=sep).items())
        else:
            items.append((new_key, v))
    return dict(items)

if __name__ == "__main__":
    with open("substances_full_keys.json", "r", encoding="utf-8") as f:
        data = json.load(f)
    
    flattened = flatten_dict(data)
    
    with open("flattened_substances.json", "w", encoding="utf-8") as f:
        json.dump(flattened, f, indent=2, ensure_ascii=False)
    
    print(f"Flattened {len(flattened)} keys")
