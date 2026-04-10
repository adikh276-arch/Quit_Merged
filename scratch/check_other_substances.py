import json

with open("src/i18n/locales/en.json", "r", encoding="utf-8") as f:
    data = json.load(f)

known_slugs = ["alcohol", "tobacco", "opioids", "cannabis", "stimulants", "benzodiazepines", "kratom", "mdma"]

other_keys = []
for k in data.keys():
    if k.startswith("quit.substances."):
        slug = k.split(".")[2]
        if slug not in known_slugs:
            other_keys.append(k)

print(f"Found {len(other_keys)} keys with unknown slugs")
for k in other_keys[:20]:
    print(k)
