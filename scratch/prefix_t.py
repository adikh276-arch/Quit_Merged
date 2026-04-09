
import os
import re

def prefix_translations(directory):
    # Regex to find t('key') or t("key") or t(`key`)
    # Matches t('...', t("...", t(`...`
    # We look for the start of the string inside the parenthesis
    pattern = re.compile(r"t\(\s*(['\"`])")

    for root, _, files in os.walk(directory):
        if 'node_modules' in root or '.git' in root:
            continue
            
        for file in files:
            if file.endswith(('.tsx', '.ts')):
                path = os.path.join(root, file)
                with open(path, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                # We need to be careful with template literals like t(`substances.${slug}`)
                # The regex should only target the opening of the string
                # We want: t('app.back') -> t('quit.app.back')
                # Replacement using regex backreference
                new_content = pattern.sub(r"t(\1quit.", content)
                
                # Avoid double prefixing t('quit.quit.app')
                new_content = new_content.replace("t('quit.quit.", "t('quit.")
                new_content = new_content.replace('t("quit.quit.', 't("quit.')
                new_content = new_content.replace('t(`quit.quit.', 't(`quit.')

                if content != new_content:
                    with open(path, 'w', encoding='utf-8') as f:
                        f.write(new_content)
                    print(f"Updated {path}")

if __name__ == "__main__":
    prefix_translations('src')
