const fs = require('fs');

const content = fs.readFileSync('src/data/substances.ts', 'utf8');

const substances = [
  { slug: 'vaping', name: 'Vaping', descriptor: 'E-cigarettes & pods', icon: 'vape', accentVar: '--substance-vaping', withdrawalSymptom: 'Oral Fixation & Headaches', aiFocus: 'constant access interruption', psychology: 'fast-feedback and constant availability' },
  { slug: 'chewing-tobacco', name: 'Chewing Tobacco', descriptor: 'Dip & snus', icon: 'leaf', accentVar: '--substance-chewing-tobacco', withdrawalSymptom: 'Oral cravings & Agitation', aiFocus: 'oral habit replacement', psychology: 'oral fixation and steady nicotine flow' },
  { slug: 'cocaine', name: 'Cocaine', descriptor: 'Powder & crack', icon: 'sparkles', accentVar: '--substance-cocaine', withdrawalSymptom: 'Crash cycles & Impulsivity', aiFocus: 'impulse interruption and crash support', psychology: 'impulsivity, crash cycles, and relapse spikes' },
  { slug: 'methamphetamine', name: 'Methamphetamine', descriptor: 'Crystal meth', icon: 'zap', accentVar: '--substance-methamphetamine', withdrawalSymptom: 'Anhedonia & Exhaustion', aiFocus: 'dopamine repair and energy management', psychology: 'dopamine repair and severe anhedonia' }
];

let output = '';
const rn = (min, max) => Math.round((min + Math.random() * (max - min)) * 10) / 10;
const ri = (min, max) => Math.floor(min + Math.random() * (max - min + 1));
const pick = (arr) => arr[ri(0, arr.length - 1)];

substances.forEach(sub => {
  output += `  {
    slug: '${sub.slug}',
    name: '${sub.name}',
    descriptor: '${sub.descriptor}',
    icon: '${sub.icon}',
    accentVar: '${sub.accentVar}',
    trackers: [
      {
        id: 'cravings', name: 'Craving Intensity', chartType: 'line', yAxisLabel: 'Cravings',
        insight: 'Unique insights based on ${sub.psychology}.',
        fields: [
          { key: 'count', label: 'Number of cravings today', type: 'slider', min: 0, max: 15, step: 1 },
          { key: 'peakIntensity', label: 'Peak intensity', type: 'slider', min: 1, max: 10, step: 1, showIf: { field: 'count', value: 0, op: '!==' } },
          { key: 'trigger', label: 'Primary trigger', type: 'chips', options: ['Stress', 'Social', 'Habit', 'Boredom', 'Other'], showIf: { field: 'count', value: 0, op: '!==' } },
          { key: 'notes', label: 'Notes', type: 'textarea' },
        ],
        mockGenerator: (day) => ({
          count: Math.max(0, ri(11 - Math.floor(day * 0.45), 13 - Math.floor(day * 0.5))),
          peakIntensity: Math.max(1, ri(8 - Math.floor(day * 0.3), 10 - Math.floor(day * 0.35))),
          trigger: pick(['Stress', 'Social', 'Habit']),
          notes: '',
        }),
      },
      {
        id: 'withdrawal', name: 'Withdrawal Symptoms', chartType: 'stacked-bar', yAxisLabel: 'Burden',
        insight: '${sub.withdrawalSymptom} is the primary focus of early recovery.',
        fields: [
          { key: 'primary', label: '${sub.withdrawalSymptom.split(' & ')[0]}', type: 'chips', options: ['None', 'Mild', 'Moderate', 'Severe'] },
          { key: 'anxiety', label: 'Anxiety level', type: 'slider', min: 1, max: 10, step: 1 },
          { key: 'notes', label: 'Notes', type: 'textarea' },
        ],
        mockGenerator: (day) => ({
          primary: day < 3 ? pick(['Moderate', 'Severe']) : day < 7 ? pick(['Mild', 'Moderate']) : 'None',
          anxiety: Math.max(1, ri(8 - Math.floor(day * 0.4), 10 - Math.floor(day * 0.45))),
          notes: '',
        }),
      }
    ],
    calculator: {
      title: 'Usage Impact',
      inputs: [
        { key: 'frequency', label: 'Frequency per week', type: 'slider', min: 0, max: 50, step: 1, defaultValue: 7 },
        { key: 'cost', label: 'Cost per use', type: 'slider', min: 10, max: 1000, step: 10, defaultValue: 50 },
      ],
      compute: (inputs) => {
        const weekly = inputs.frequency * inputs.cost;
        const monthly = weekly * 4.3;
        const yearly = monthly * 12;
        return [
          { label: 'Weekly spend', value: \`$\${Math.round(weekly)}\` },
          { label: 'Yearly spend', value: \`$\${Math.round(yearly)}\` },
        ];
      },
      note: "Financial recovery runs parallel to physical recovery.",
    },
    activities: [
      {
        id: '${sub.slug}-breathing', name: 'Urge Surfing Breathing', duration: '3 min', type: 'breathing',
        description: 'Breathe through ${sub.slug} cravings using guided parasympathetic activation.',
      }
    ],
    articles: [
      { id: 'a1', title: 'Why Quit ${sub.name}?', tag: 'Awareness', content: 'Focusing on ${sub.psychology} and the impact of ${sub.slug}.' },
      { id: 'a2', title: '${sub.name} Withdrawal Timeline', tag: 'Detox', content: 'Preparing for ${sub.withdrawalSymptom} during early abstinence.' }
    ],
    communityPosts: [],
    achievements: []
  },\n`;
});

const insertIndex = content.lastIndexOf('];');
if (insertIndex > -1) {
  const newContent = content.slice(0, insertIndex) + output + content.slice(insertIndex);
  fs.writeFileSync('src/data/substances.ts', newContent);
  console.log('Appended 4 items successfully.');
} else {
  console.log('Could not find ];');
}
