const fs = require('fs');

const content = fs.readFileSync('src/data/substances.ts', 'utf8');

const output = `
  {
    slug: 'vaping', name: 'Vaping', descriptor: 'E-cigarettes & pods', icon: 'vape', accentVar: '--substance-vaping',
    trackers: [
      {
        id: 'cravings', name: 'Craving Intensity', chartType: 'line', yAxisLabel: 'Cravings',
        fields: [
          { key: 'count', label: 'Cravings today', type: 'slider', min: 0, max: 20, step: 1 },
          { key: 'notes', label: 'Notes', type: 'textarea' }
        ],
        mockGenerator: (day) => { return { count: 3, notes: '' }; }
      },
      {
        id: 'withdrawal', name: 'Withdrawal Symptoms', chartType: 'stacked-bar', yAxisLabel: 'Severity',
        fields: [
          { key: 'headache', label: 'Headache', type: 'slider', min: 1, max: 10, step: 1 },
          { key: 'irritability', label: 'Irritability', type: 'slider', min: 1, max: 10, step: 1 }
        ],
        mockGenerator: (day) => { return { headache: 2, irritability: 4 }; }
      },
      {
        id: 'triggers', name: 'Trigger Log', chartType: 'bar', yAxisLabel: 'Triggers',
        fields: [
          { key: 'type', label: 'Primary Trigger', type: 'chips', options: ['Stress', 'Boredom', 'Social', 'Waking Up'] }
        ],
        mockGenerator: (day) => { return { type: 'Stress' }; }
      },
      {
        id: 'financial', name: 'Money Saved', chartType: 'line', yAxisLabel: '$ Saved',
        fields: [
          { key: 'saved', label: 'Amount saved today', type: 'number' }
        ],
        mockGenerator: (day) => { return { saved: 5 }; }
      },
      {
        id: 'sleep', name: 'Sleep Quality', chartType: 'line', yAxisLabel: 'Quality',
        fields: [
          { key: 'hours', label: 'Hours slept', type: 'slider', min: 0, max: 12, step: 1 },
          { key: 'quality', label: 'Quality', type: 'chips', options: ['Poor', 'Fair', 'Good', 'Excellent'] }
        ],
        mockGenerator: (day) => { return { hours: 7, quality: 'Good' }; }
      }
    ],
    calculator: {
      title: 'Usage Impact',
      inputs: [
        { key: 'frequency', label: 'Frequency per week', type: 'slider', min: 0, max: 50, step: 1, defaultValue: 7 },
        { key: 'cost', label: 'Cost per use', type: 'slider', min: 10, max: 1000, step: 10, defaultValue: 50 }
      ],
      compute: (inputs) => {
        const weekly = inputs.frequency * inputs.cost;
        const monthly = weekly * 4.3;
        const yearly = monthly * 12;
        return [
          { label: 'Weekly spend', value: \`$\${Math.round(weekly)}\` },
          { label: 'Yearly spend', value: \`$\${Math.round(yearly)}\` }
        ];
      },
      note: "Financial recovery runs parallel to physical recovery."
    },
    activities: [
      { id: 'vap-1', name: 'Urge Surfing Breathing', duration: '3 min', type: 'breathing', description: 'Breathe through the immediate urge to vape.' },
      { id: 'vap-2', name: 'Hand-Mouth Replacement', duration: '5 min', type: 'action', description: 'Practice keeping your hands busy with a substitute object.' },
      { id: 'vap-3', name: 'Trigger Mapping', duration: '10 min', type: 'journaling', description: 'Identify the specific environments where you automatically vape.' },
      { id: 'vap-4', name: 'Dopamine Reset Walk', duration: '15 min', type: 'exercise', description: 'A quick walk to naturally boost dopamine without nicotine.' }
    ],
    articles: [
      { id: 'v1', title: 'Why Vaping Feels Impossible to Quit', tag: 'Awareness', content: 'Vaping is designed for constant access. Unlike cigarettes, there is no end to a vape. It creates a continuous loop of nicotine delivery.' },
      { id: 'v2', title: 'The 3-Day Nicotine Detox', tag: 'Detox', content: 'The first 72 hours are the hardest as your body clears the physical nicotine. Expect headaches and irritability.' },
      { id: 'v3', title: 'Managing the Hand-to-Mouth Habit', tag: 'Behavioral', content: 'You are fighting two addictions: the nicotine and the physical motion. Replace the physical motion with water, gum, or fidget tools.' },
      { id: 'v4', title: 'Brain Fog and Vaping', tag: 'Symptoms', content: 'Nicotine is a stimulant. When you stop, your brain feels slow and foggy. This is temporary and usually clears in a week.' },
      { id: 'v5', title: 'The Cost of Convenience', tag: 'Financial', content: 'Vaping seems cheap initially, but the constant use adds up. Calculate your true weekly spend to build motivation.' },
      { id: 'v6', title: 'How to Survive Social Settings', tag: 'Triggers', content: 'When others are vaping, step away, chew gum, and remind yourself why you quit. The urge will pass.' },
      { id: 'v7', title: 'Rebuilding Dopamine Baseline', tag: 'Science', content: 'Vaping spikes dopamine constantly. Quitting resets your baseline, allowing you to enjoy normal things again.' },
      { id: 'v8', title: 'Oral Fixation Strategies', tag: 'Behavioral', content: 'Use toothpicks, sunflower seeds, or ice chips to satisfy the urge to have something in your mouth.' },
      { id: 'v9', title: 'Sleep Disruptions in Week 1', tag: 'Symptoms', content: 'Your sleep will be disrupted. Use melatonin and maintain strict sleep hygiene.' },
      { id: 'v10', title: 'Long-term Lung Recovery', tag: 'Health', content: 'Your lungs begin repairing themselves within weeks. You will notice better breathing and less coughing.' }
    ],
    communityPosts: [],
    achievements: []
  },
  {
    slug: 'chewing-tobacco', name: 'Chewing Tobacco', descriptor: 'Dip & snus', icon: 'leaf', accentVar: '--substance-chewing-tobacco',
    trackers: [
      {
        id: 'cravings', name: 'Craving Intensity', chartType: 'line', yAxisLabel: 'Cravings',
        fields: [
          { key: 'count', label: 'Cravings today', type: 'slider', min: 0, max: 20, step: 1 },
          { key: 'notes', label: 'Notes', type: 'textarea' }
        ],
        mockGenerator: (day) => { return { count: 4, notes: '' }; }
      },
      {
        id: 'oral-health', name: 'Oral Health', chartType: 'bar', yAxisLabel: 'Healing',
        fields: [
          { key: 'soreness', label: 'Gum soreness', type: 'slider', min: 1, max: 10, step: 1 }
        ],
        mockGenerator: (day) => { return { soreness: 3 }; }
      },
      {
        id: 'mood', name: 'Agitation Levels', chartType: 'line', yAxisLabel: 'Agitation',
        fields: [
          { key: 'agitation', label: 'Agitation level', type: 'slider', min: 1, max: 10, step: 1 }
        ],
        mockGenerator: (day) => { return { agitation: 5 }; }
      },
      {
        id: 'alternatives', name: 'Alternatives Used', chartType: 'bar', yAxisLabel: 'Count',
        fields: [
          { key: 'seeds', label: 'Seeds/Gum used', type: 'slider', min: 0, max: 10, step: 1 }
        ],
        mockGenerator: (day) => { return { seeds: 2 }; }
      },
      {
        id: 'sleep', name: 'Sleep Quality', chartType: 'line', yAxisLabel: 'Quality',
        fields: [
          { key: 'hours', label: 'Hours slept', type: 'slider', min: 0, max: 12, step: 1 }
        ],
        mockGenerator: (day) => { return { hours: 6 }; }
      }
    ],
    calculator: {
      title: 'Usage Impact',
      inputs: [
        { key: 'frequency', label: 'Cans per week', type: 'slider', min: 0, max: 20, step: 1, defaultValue: 3 },
        { key: 'cost', label: 'Cost per can', type: 'slider', min: 1, max: 50, step: 1, defaultValue: 8 }
      ],
      compute: (inputs) => {
        const weekly = inputs.frequency * inputs.cost;
        const monthly = weekly * 4.3;
        const yearly = monthly * 12;
        return [
          { label: 'Weekly spend', value: \`$\${Math.round(weekly)}\` },
          { label: 'Yearly spend', value: \`$\${Math.round(yearly)}\` }
        ];
      },
      note: "Financial recovery runs parallel to physical recovery."
    },
    activities: [
      { id: 'ct-1', name: 'Gum Massage', duration: '2 min', type: 'action', description: 'Soothe your gums using a soft brush or clean finger.' },
      { id: 'ct-2', name: 'Seed Cracking Drill', duration: '10 min', type: 'action', description: 'Eat sunflower seeds to keep your mouth busy.' },
      { id: 'ct-3', name: 'Frustration Release', duration: '5 min', type: 'exercise', description: 'Intense short workout to burn off nicotine withdrawal agitation.' },
      { id: 'ct-4', name: 'Ritual Redesign', duration: '15 min', type: 'journaling', description: 'Write down new habits to replace your dipping rituals.' }
    ],
    articles: [
      { id: 'ct1', title: 'The Hidden Dangers of Dip', tag: 'Awareness', content: 'Chewing tobacco carries severe risks of mouth and throat cancers. Acknowledging this is step one.' },
      { id: 'ct2', title: 'Managing the Lip Burn Craving', tag: 'Behavioral', content: 'Many users miss the physical sensation. Try mint leaves, ginger root, or specialized nicotine-free alternatives.' },
      { id: 'ct3', title: 'Nicotine Detox Timeline', tag: 'Detox', content: 'Dip delivers massive amounts of nicotine. Expect strong physical withdrawal for the first 5 days.' },
      { id: 'ct4', title: 'Gum and Teeth Healing', tag: 'Health', content: 'Your gums will start healing within days of quitting. You may notice increased sensitivity initially.' },
      { id: 'ct5', title: 'Breaking the Ritual', tag: 'Behavioral', content: 'The tap of the can, the pinch, the spit bottle. You must break these rituals by changing your routines.' },
      { id: 'ct6', title: 'Dealing with Extreme Irritability', tag: 'Symptoms', content: 'High nicotine withdrawal causes severe mood swings. Warn your family and practice extreme patience.' },
      { id: 'ct7', title: 'Alternative Oral Fixations', tag: 'Strategies', content: 'Sunflower seeds, beef jerky, and gum are your best friends right now.' },
      { id: 'ct8', title: 'The 10-Minute Craving Rule', tag: 'Strategies', content: 'When a craving hits, wait 10 minutes. The physical intensity will subside.' },
      { id: 'ct9', title: 'Digestive Changes', tag: 'Symptoms', content: 'Quitting dip can cause digestive issues. Drink plenty of water and eat high-fiber foods.' },
      { id: 'ct10', title: 'Celebrating the Clean Mouth', tag: 'Growth', content: 'Focus on the benefits: clean teeth, fresh breath, and no more spit bottles.' }
    ],
    communityPosts: [],
    achievements: []
  },
  {
    slug: 'cocaine', name: 'Cocaine', descriptor: 'Powder & crack', icon: 'sparkles', accentVar: '--substance-cocaine',
    trackers: [
      {
        id: 'cravings', name: 'Craving Spikes', chartType: 'line', yAxisLabel: 'Intensity',
        fields: [
          { key: 'peak', label: 'Peak intensity', type: 'slider', min: 1, max: 10, step: 1 },
          { key: 'notes', label: 'Notes', type: 'textarea' }
        ],
        mockGenerator: (day) => { return { peak: 6, notes: '' }; }
      },
      {
        id: 'mood', name: 'Depression/Anhedonia', chartType: 'line', yAxisLabel: 'Severity',
        fields: [
          { key: 'depression', label: 'Depression level', type: 'slider', min: 1, max: 10, step: 1 }
        ],
        mockGenerator: (day) => { return { depression: 4 }; }
      },
      {
        id: 'energy', name: 'Energy Levels', chartType: 'bar', yAxisLabel: 'Energy',
        fields: [
          { key: 'energy', label: 'Energy level', type: 'slider', min: 1, max: 10, step: 1 }
        ],
        mockGenerator: (day) => { return { energy: 3 }; }
      },
      {
        id: 'alcohol', name: 'Alcohol Intake', chartType: 'bar', yAxisLabel: 'Drinks',
        fields: [
          { key: 'drinks', label: 'Drinks today (Trigger warning)', type: 'slider', min: 0, max: 10, step: 1 }
        ],
        mockGenerator: (day) => { return { drinks: 1 }; }
      },
      {
        id: 'sleep', name: 'Sleep Restoration', chartType: 'line', yAxisLabel: 'Hours',
        fields: [
          { key: 'hours', label: 'Hours slept', type: 'slider', min: 0, max: 12, step: 1 }
        ],
        mockGenerator: (day) => { return { hours: 8 }; }
      }
    ],
    calculator: {
      title: 'Usage Impact',
      inputs: [
        { key: 'frequency', label: 'Grams per week', type: 'slider', min: 0, max: 50, step: 1, defaultValue: 2 },
        { key: 'cost', label: 'Cost per gram', type: 'slider', min: 10, max: 1000, step: 10, defaultValue: 80 }
      ],
      compute: (inputs) => {
        const weekly = inputs.frequency * inputs.cost;
        const monthly = weekly * 4.3;
        const yearly = monthly * 12;
        return [
          { label: 'Weekly spend', value: \`$\${Math.round(weekly)}\` },
          { label: 'Yearly spend', value: \`$\${Math.round(yearly)}\` }
        ];
      },
      note: "Financial recovery runs parallel to physical recovery."
    },
    activities: [
      { id: 'c-1', name: 'Play the Tape Forward', duration: '5 min', type: 'journaling', description: 'Write out exactly what will happen if you use right now.' },
      { id: 'c-2', name: 'High-Intensity Output', duration: '20 min', type: 'exercise', description: 'Sprint or do HIIT to manage intense physical agitation.' },
      { id: 'c-3', name: 'Financial Audit', duration: '15 min', type: 'action', description: 'Calculate exactly how much money you have saved.' },
      { id: 'c-4', name: 'Trigger Disruption', duration: '3 min', type: 'breathing', description: 'A grounding exercise for sudden, intense impulses.' }
    ],
    articles: [
      { id: 'c1', title: 'Surviving the Crash', tag: 'Detox', content: 'The initial crash involves severe exhaustion, depression, and anhedonia. Rest is your priority.' },
      { id: 'c2', title: 'The Illusion of Confidence', tag: 'Psychology', content: 'Cocaine provides artificial confidence. Recovery is about building real self-esteem.' },
      { id: 'c3', title: 'Managing Financial Wreckage', tag: 'Financial', content: 'Cocaine is expensive. Acknowledging the financial damage is often a key motivator for staying clean.' },
      { id: 'c4', title: 'The Paranoia and Anxiety Fade', tag: 'Symptoms', content: 'The intense paranoia and anxiety will gradually fade over the first month.' },
      { id: 'c5', title: 'Cutting Ties with Triggers', tag: 'Social', content: 'You must delete numbers, block dealers, and avoid friends who use. There is no middle ground.' },
      { id: 'c6', title: 'The Post-Acute Withdrawal Syndrome', tag: 'Science', content: 'PAWS can last for months. You will have random days of depression and intense cravings.' },
      { id: 'c7', title: 'Rebuilding Dopamine Receptors', tag: 'Science', content: 'Your brain needs time to heal. Normal activities won\'t feel fun at first. Give it time.' },
      { id: 'c8', title: 'Handling Alcohol Triggers', tag: 'Triggers', content: 'Alcohol is the #1 trigger for cocaine relapse. Many must quit both simultaneously.' },
      { id: 'c9', title: 'Impulse Control Strategies', tag: 'Behavioral', content: 'Cocaine cravings hit like a freight train. Use the "Play the Tape Forward" technique.' },
      { id: 'c10', title: 'Cardiovascular Healing', tag: 'Health', content: 'Your heart has been under immense strain. Normalizing your blood pressure and heart rate is a huge victory.' }
    ],
    communityPosts: [],
    achievements: []
  },
  {
    slug: 'methamphetamine', name: 'Methamphetamine', descriptor: 'Crystal meth', icon: 'zap', accentVar: '--substance-methamphetamine',
    trackers: [
      {
        id: 'cravings', name: 'Craving Intensity', chartType: 'line', yAxisLabel: 'Cravings',
        fields: [
          { key: 'intensity', label: 'Craving intensity', type: 'slider', min: 1, max: 10, step: 1 },
          { key: 'notes', label: 'Notes', type: 'textarea' }
        ],
        mockGenerator: (day) => { return { intensity: 5, notes: '' }; }
      },
      {
        id: 'fatigue', name: 'Fatigue Levels', chartType: 'line', yAxisLabel: 'Fatigue',
        fields: [
          { key: 'exhaustion', label: 'Exhaustion level', type: 'slider', min: 1, max: 10, step: 1 }
        ],
        mockGenerator: (day) => { return { exhaustion: 8 }; }
      },
      {
        id: 'anhedonia', name: 'Anhedonia Monitor', chartType: 'line', yAxisLabel: 'Numbness',
        fields: [
          { key: 'numbness', label: 'Inability to feel pleasure', type: 'slider', min: 1, max: 10, step: 1 }
        ],
        mockGenerator: (day) => { return { numbness: 7 }; }
      },
      {
        id: 'nutrition', name: 'Nutrition Log', chartType: 'bar', yAxisLabel: 'Meals',
        fields: [
          { key: 'meals', label: 'Proper meals eaten', type: 'slider', min: 0, max: 5, step: 1 }
        ],
        mockGenerator: (day) => { return { meals: 2 }; }
      },
      {
        id: 'sleep', name: 'Sleep Recovery', chartType: 'line', yAxisLabel: 'Hours',
        fields: [
          { key: 'hours', label: 'Hours slept', type: 'slider', min: 0, max: 20, step: 1 }
        ],
        mockGenerator: (day) => { return { hours: 10 }; }
      }
    ],
    calculator: {
      title: 'Usage Impact',
      inputs: [
        { key: 'frequency', label: 'Uses per week', type: 'slider', min: 0, max: 50, step: 1, defaultValue: 3 },
        { key: 'cost', label: 'Cost per use', type: 'slider', min: 10, max: 1000, step: 10, defaultValue: 40 }
      ],
      compute: (inputs) => {
        const weekly = inputs.frequency * inputs.cost;
        const monthly = weekly * 4.3;
        const yearly = monthly * 12;
        return [
          { label: 'Weekly spend', value: \`$\${Math.round(weekly)}\` },
          { label: 'Yearly spend', value: \`$\${Math.round(yearly)}\` }
        ];
      },
      note: "Financial recovery runs parallel to physical recovery."
    },
    activities: [
      { id: 'm-1', name: 'Basic Nutrition Check', duration: '5 min', type: 'action', description: 'Ensure you have eaten protein and drank a glass of water.' },
      { id: 'm-2', name: 'Rest Validation', duration: '3 min', type: 'journaling', description: 'Remind yourself that resting is productive healing.' },
      { id: 'm-3', name: 'Gentle Movement', duration: '10 min', type: 'exercise', description: 'Light stretching or walking to rebuild physical stamina.' },
      { id: 'm-4', name: 'Reality Grounding', duration: '5 min', type: 'breathing', description: 'A grounding exercise for paranoia or anxiety.' }
    ],
    articles: [
      { id: 'm1', title: 'The Great Sleep Catch-Up', tag: 'Detox', content: 'In the first week, you may sleep for 12-18 hours a day. Let your body do this. It is healing.' },
      { id: 'm2', title: 'Severe Anhedonia Explained', tag: 'Science', content: 'Nothing feels good. This is because your dopamine reserves are entirely depleted. It is chemical, not personal.' },
      { id: 'm3', title: 'Managing Meth Psychosis', tag: 'Symptoms', content: 'Paranoia and auditory hallucinations can linger. Seek medical help if they do not subside.' },
      { id: 'm4', title: 'Rebuilding Nutrition', tag: 'Health', content: 'Your body is severely malnourished. Focus on protein, healthy fats, and hydration.' },
      { id: 'm5', title: 'The 6-Month Brain Healing Mark', tag: 'Growth', content: 'Brain scans show significant healing of dopamine transporters at 6-14 months clean.' },
      { id: 'm6', title: 'Dealing with Extreme Fatigue', tag: 'Symptoms', content: 'You will feel tired for months. Do not mistake this for laziness. It is recovery.' },
      { id: 'm7', title: 'Avoiding Stimulant Substitutes', tag: 'Behavioral', content: 'Do not replace meth with extreme energy drink consumption. It stresses your heart.' },
      { id: 'm8', title: 'Reconnecting with Emotions', tag: 'Psychology', content: 'As the numbness fades, intense emotions will return. This is normal but overwhelming.' },
      { id: 'm9', title: 'Dental and Skin Healing', tag: 'Health', content: 'Schedule a dentist appointment. Begin a basic skincare routine to repair the physical damage.' },
      { id: 'm10', title: 'Finding New Sources of Joy', tag: 'Growth', content: 'You must actively seek out new, healthy activities to slowly train your brain to enjoy normal life again.' }
    ],
    communityPosts: [],
    achievements: []
  }
`;

const startIdx1 = content.indexOf("{ slug: 'vaping'");
const startIdx2 = content.indexOf("{ \\n    slug: 'vaping'");
const startIdx3 = content.indexOf("slug: 'vaping'");
let actualStart = startIdx1 > -1 ? startIdx1 : (startIdx2 > -1 ? startIdx2 : startIdx3);

if (actualStart > -1) {
  let braceIdx = content.lastIndexOf('{', actualStart);
  if (braceIdx === -1) braceIdx = actualStart;
  
  const endIdx = content.lastIndexOf('];');
  if (endIdx > -1) {
    const newContent = content.slice(0, braceIdx) + output + content.slice(endIdx);
    fs.writeFileSync('src/data/substances.ts', newContent);
    console.log('Expanded 4 items successfully.');
  } else {
    console.log('Could not find end of array');
  }
} else {
  console.log('Could not find vaping start index');
}
