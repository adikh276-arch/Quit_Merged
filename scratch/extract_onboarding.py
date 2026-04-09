
import json
import os

def main():
    triggers = {
        'alcohol': ['Stress', 'Social events', 'Evenings', 'Boredom', 'Loneliness', 'Celebrations'],
        'tobacco': ['Morning routine', 'After meals', 'Stress', 'Social smoking', 'Driving', 'Coffee'],
        'opioids': ['Physical pain', 'Emotional pain', 'Stress', 'Certain people', 'Locations', 'Boredom'],
        'cannabis': ['Evening routine', 'Boredom', 'Stress', 'Social pressure', 'Sleep issues', 'Anxiety'],
        'stimulants': ['Work pressure', 'Nightlife', 'Social settings', 'Depression', 'Fatigue', 'Deadlines'],
        'benzodiazepines': ['Anxiety', 'Panic attacks', 'Insomnia', 'Social situations', 'Stress', 'Travel'],
        'kratom': ['Morning routine', 'Pain', 'Low energy', 'Anxiety', 'Online forums', 'Boredom'],
        'mdma': ['Festivals', 'Clubs', 'Social pressure', 'Depression', 'FOMO', 'Music events'],
    }
    motivations = ['Better health', 'Family & relationships', 'Financial freedom', 'Mental clarity', 'Self-respect', 'Career goals']
    
    path = 'src/i18n/locales/en.json'
    with open(path, 'r', encoding='utf-8') as f:
        en = json.load(f)
        
    for slug, tg in triggers.items():
        for i, val in enumerate(tg):
            en[f"substances.{slug}.triggers.{i}"] = val
            
    for i, m in enumerate(motivations):
        en[f"app.onboarding.motivations.{i}"] = m
        
    with open(path, 'w', encoding='utf-8') as f:
        json.dump(en, f, ensure_ascii=False, indent=2)
    print("Updated en.json with triggers and motivations")

if __name__ == "__main__":
    main()
