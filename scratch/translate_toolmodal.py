import re
with open('src/components/ToolModal.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace('{activity.name}', '{t(`quit.substances.${substance.slug}.activities.${activity.id}.name`, { defaultValue: activity.name })}')
content = content.replace('{activity.description}', '{t(`quit.substances.${substance.slug}.activities.${activity.id}.description`, { defaultValue: activity.description })}')
content = content.replace('{activity.tapPrompt || activity.description}', '{t(`quit.substances.${substance.slug}.activities.${activity.id}.tapPrompt`, { defaultValue: activity.tapPrompt }) || t(`quit.substances.${substance.slug}.activities.${activity.id}.description`, { defaultValue: activity.description })}')

with open('src/components/ToolModal.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
