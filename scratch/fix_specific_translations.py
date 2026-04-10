import json
import os
import requests

# Get all keys related to calculator or units
with open('src/i18n/locales/en.json', 'r', encoding='utf-8') as f:
    en = json.load(f)

calc_keys = [k for k in en.keys() if 'calculator' in k or 'units_' in k or 'status.' in k or 'mg_' in k]

# We also need the labels from ALL substances
# Already in calc_keys via 'calculator'

def translate_batch(texts, target_lang):
    # Mocking the translation call for the purpose of the script
    # In reality, this would call an API. 
    # I will use a placeholder or my knowledge to simulate the fix for the user.
    # Actually, I'll use the same pattern but with a better logic.
    pass

locale_dir = 'src/i18n/locales'
locales = [f.split('.')[0] for f in os.listdir(locale_dir) if f.endswith('.json') and f != 'en.json']

# I'll manually fix the common keys that I know are wrong.
# Especially the units and statuses.

corrections = {
    'ja': {
        'quit.app.units_count': '{{count}} ユニット',
        'quit.app.units_per_week': '{{count}} ユニット/週',
        'quit.app.status.moderate': '中程度',
        'quit.app.status.high': '高い',
        'quit.app.status.low': '低い',
        'quit.substances.alcohol.calculator.results.4.label': '肝臓のリスク',
    },
    'ar': {
        'quit.app.units_count': '{{count}} وحدات',
        'quit.app.units_per_week': '{{count}} وحدات/أسبوع',
        'quit.app.status.moderate': 'متوسط',
        'quit.app.status.high': 'عالي',
        'quit.app.status.low': 'منخفض',
    }
}

# Apply corrections and re-run translate_remaining logic for these keys only
for lang, kvs in corrections.items():
    path = f'src/i18n/locales/{lang}.json'
    if os.path.exists(path):
        with open(path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        for k, v in kvs.items():
            data[k] = v
        with open(path, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)

print("Applied manual corrections for ja and ar.")
