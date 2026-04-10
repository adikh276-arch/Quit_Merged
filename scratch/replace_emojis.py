import re

with open('src/data/substances.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace body zone emojis
content = content.replace("name: 'Liver', emoji: '🫁'", "name: 'Liver', emoji: 'liver'")
content = content.replace("name: 'Brain', emoji: '🧠'", "name: 'Brain', emoji: 'brain'")
content = content.replace("name: 'Heart', emoji: '❤️'", "name: 'Heart', emoji: 'heart'")
content = content.replace("name: 'Stomach', emoji: '🫃'", "name: 'Stomach', emoji: 'stomach'")
content = content.replace("name: 'Skin', emoji: '✨'", "name: 'Skin', emoji: 'skin'")

content = content.replace("name: 'Head & Mind', emoji: '🧠'", "name: 'Head & Mind', emoji: 'head-mind'")
content = content.replace("name: 'Gut & Core', emoji: '🤰'", "name: 'Gut & Core', emoji: 'gut-core'")
content = content.replace("name: 'Muscles & Joints', emoji: '💪'", "name: 'Muscles & Joints', emoji: 'muscles-joints'")
content = content.replace("name: 'Skin & Nerves', emoji: '✨'", "name: 'Skin & Nerves', emoji: 'skin-nerves'")
content = content.replace("name: 'Chest & Heart', emoji: '❤️'", "name: 'Chest & Heart', emoji: 'chest-heart'")

content = content.replace("name: 'Head', emoji: '🧠'", "name: 'Head', emoji: 'head'")
content = content.replace("name: 'Eyes & Vision', emoji: '👀'", "name: 'Eyes & Vision', emoji: 'eyes-vision'")
content = content.replace("name: 'Muscles', emoji: '💪'", "name: 'Muscles', emoji: 'muscles'")
# Stomach was already handled for general cases but might be specific here
content = content.replace("name: 'Nervous System', emoji: '⚡'", "name: 'Nervous System', emoji: 'nervous-system'")

# Replace visualization scene emojis
content = content.replace("emoji: '💨'", "emoji: 'wind'")
content = content.replace("emoji: '🌬️'", "emoji: 'wind'")
content = content.replace("emoji: '🌱'", "emoji: 'sprout'")
content = content.replace("emoji: '🫁'", "emoji: 'lung'")
content = content.replace("emoji: '🏔️'", "emoji: 'mountain'")
content = content.replace("emoji: '🎉'", "emoji: 'party'")

content = content.replace("emoji: '🌑'", "emoji: 'grey'")
content = content.replace("emoji: '🌘'", "emoji: 'natural'")
content = content.replace("emoji: '🌗'", "emoji: 'natural'")
content = content.replace("emoji: '🌖'", "emoji: 'natural'")
content = content.replace("emoji: '🌕'", "emoji: 'natural'")

# MDMA scenes
content = content.replace("emoji: '📉'", "emoji: 'grey'")
content = content.replace("emoji: '🧬'", "emoji: 'natural'")
content = content.replace("emoji: '🌈'", "emoji: 'mood'")
content = content.replace("emoji: '🌟'", "emoji: 'energy'")

with open('src/data/substances.ts', 'w', encoding='utf-8') as f:
    f.write(content)
