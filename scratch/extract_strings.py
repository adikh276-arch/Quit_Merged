import re
import json

with open('src/data/substances.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Match fixed strings in values
vals = re.findall(r"value:\s*['\"]([^'\"$]*)['\"]", content)
# Match notes
notes = re.findall(r"note:\s*['\"]([^'\"]*)['\"]", content)

unique_strings = list(set([s for s in vals + notes if s and not s.startswith('${')]))
print(json.dumps(unique_strings, indent=2))
