import json

# Manual translations for the 21 keys (excluding garbage)
ar_translations = {
    "quit.substances.cannabis.activities.vivid-dream-journal.fields.dream.label": "بماذا حلمت؟",
    "quit.substances.cannabis.activities.vivid-dream-journal.fields.dream.placeholder": "صف كل التفاصيل التي تتذكرها - الألوان، الأشخاص، المشاعر...",
    "quit.substances.cannabis.activities.vivid-dream-journal.fields.intensity.label": "شدة الحلم",
    "quit.substances.cannabis.activities.vivid-dream-journal.fields.emotion.label": "العاطفة السائدة في الحلم",
    "quit.substances.stimulants.activities.pleasure-relearn.fields.pleasureMoment.label": "هل شعرت بأي شيء جيد ولو قليلاً اليوم؟",
    "quit.substances.stimulants.activities.pleasure-relearn.fields.pleasureMoment.placeholder": "دش دافئ، رسالة مضحكة، أشعة الشمس على وجهك...",
    "quit.substances.stimulants.activities.pleasure-relearn.fields.intensity.label": "ما مقدار المتعة؟ (حتى 1 يحتسب)",
    "quit.substances.stimulants.activities.pleasure-relearn.fields.compare.label": "مقارنة بالأسبوع الماضي، هل المتعة...",
    "quit.substances.benzodiazepines.activities.gaba-breathing.phases.1.text": "احبس نفسك بلطف لعدتين. بدون إجهاد.",
    "quit.substances.benzodiazepines.activities.gaba-breathing.phases.2.text": "ازفر من خلال شفاه مضمومة لـ 8 عدات. الزفير الطويل هو المفتاح — إنه يحفز العصب المبهم.",
    "quit.substances.benzodiazepines.activities.gaba-breathing.phases.3.text": "توقف قليلاً لعدتين. دع جسمك يستقر قبل النفس التالي.",
    "quit.substances.kratom.activities.root-cause.fields.originalReason.label": "ما الذي كنت تعالجه في الأصل باستخدام الكراتوم؟",
    "quit.substances.kratom.activities.root-cause.fields.originalReason.placeholder": "ألم مزمن؟ قلق اجتماعي؟ طاقة منخفضة؟ اكتئاب؟",
    "quit.substances.kratom.activities.root-cause.fields.currentState.label": "هل هذه المشكلة الأصلية أفضل أم أسوأ أم كما هي بدون الكراتوم؟",
    "quit.substances.kratom.activities.root-cause.fields.currentState.placeholder": "كن محدداً بشأن ما تشعر به حالياً بدون الكراتوم وجوانب التحسن أو التراجع.",
    "quit.substances.kratom.activities.root-cause.fields.alternative.label": "شيء واحد يمكنك القيام به اليوم لمعالجة ذلك السبب الجذري",
    "quit.substances.kratom.activities.root-cause.fields.alternative.placeholder": "حدد موعداً مع طبيب، جرب روتيناً للتمدد، اتصل بمعالج..."
}

en_translations = {
    "quit.substances.cannabis.activities.vivid-dream-journal.fields.dream.label": "What did you dream about?",
    "quit.substances.cannabis.activities.vivid-dream-journal.fields.dream.placeholder": "Describe every detail you remember — colors, people, emotions...",
    "quit.substances.cannabis.activities.vivid-dream-journal.fields.intensity.label": "Dream intensity",
    "quit.substances.cannabis.activities.vivid-dream-journal.fields.emotion.label": "Dominant emotion in the dream",
    "quit.substances.stimulants.activities.pleasure-relearn.fields.pleasureMoment.label": "Did anything feel even slightly good today?",
    "quit.substances.stimulants.activities.pleasure-relearn.fields.pleasureMoment.placeholder": "A warm shower, a funny text, sunshine on your face...",
    "quit.substances.stimulants.activities.pleasure-relearn.fields.intensity.label": "How much pleasure? (even 1 counts)",
    "quit.substances.stimulants.activities.pleasure-relearn.fields.compare.label": "Compared to last week, is pleasure...",
    "quit.substances.benzodiazepines.activities.gaba-breathing.phases.1.text": "Hold gently for 2 counts. No strain.",
    "quit.substances.benzodiazepines.activities.gaba-breathing.phases.2.text": "Exhale through pursed lips for 8 counts. The long exhale is the key — it stimulates your vagus nerve.",
    "quit.substances.benzodiazepines.activities.gaba-breathing.phases.3.text": "Pause for 2 counts. Let your body settle before the next breath.",
    "quit.substances.kratom.activities.root-cause.fields.originalReason.label": "What were you originally treating with kratom?",
    "quit.substances.kratom.activities.root-cause.fields.originalReason.placeholder": "Chronic pain? Social anxiety? Low energy? Depression?",
    "quit.substances.kratom.activities.root-cause.fields.currentState.label": "Is that original issue better, worse, or the same without kratom?",
    "quit.substances.kratom.activities.root-cause.fields.currentState.placeholder": "Be specific about what changed in your condition since stopping.",
    "quit.substances.kratom.activities.root-cause.fields.alternative.label": "One thing you can do TODAY to address that root cause",
    "quit.substances.kratom.activities.root-cause.fields.alternative.placeholder": "Schedule a doctor visit, try a stretch routine, call a therapist..."
}

def apply_updates(file_path, updates):
    with open(file_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    data.update(updates)
    
    with open(file_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

if __name__ == "__main__":
    apply_updates("src/i18n/locales/en.json", en_translations)
    apply_updates("src/i18n/locales/ar.json", ar_translations)
    print("Updates applied successfully.")
