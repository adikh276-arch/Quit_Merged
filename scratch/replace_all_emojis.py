import re

with open('src/data/substances.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Define a mapping for common emojis to icon keys
mapping = {
    '🍺': 'beer',
    '🍷': 'wine',
    '🍸': 'wine',
    '🚬': 'cigarette',
    '💊': 'pill',
    '🌿': 'leaf',
    '⚡': 'zap',
    '🧬': 'natural',
    '💉': 'pill', # opioids/meds
    '🧘': 'meditation',
    '🏆': 'trophy',
    '🎉': 'party',
    '✨': 'sparkle',
    '💪': 'muscles',
    '🧠': 'brain',
    '❤️': 'heart',
    '🫁': 'lung',
    '🫃': 'stomach',
    '💨': 'wind',
    '🌬️': 'wind',
    '🌱': 'sprout',
    '🏔️': 'mountain',
    '🤝': 'heart', # Support/Community
    '💰': 'calculator', 
    '🚲': 'activity',
    '📈': 'natural',
    '📉': 'grey',
    '🌈': 'mood',
    '🌟': 'energy',
    '🌑': 'grey',
    '🌘': 'natural',
    '🌗': 'natural',
    '🌖': 'natural',
    '🌕': 'natural',
    '👊': 'fist',
    '🎭': 'mood',
    '📅': 'day',
    '⌚': 'hour',
    '🍼': 'natural',
    '🛌': 'sleep',
    '🔥': 'zap',
    '✅': 'check',
    '⭐': 'energy',
    '🌳': 'natural',
}

# Iterate and replace
for emoji, key in mapping.items():
    content = content.replace(f"'{emoji}'", f"'{key}'")
    content = content.replace(f'"{emoji}"', f'"{key}"')

# Some might be without quotes in comments or keys (rare in this JS file but good to be safe)
# but we only care about values in the object.

with open('src/data/substances.ts', 'w', encoding='utf-8') as f:
    f.write(content)
