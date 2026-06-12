const fs = require('fs');
const path = require('path');

const substances = [
  { slug: 'alcohol', name: 'Alcohol', descriptor: 'Beer, wine & spirits', icon: 'wine', accentVar: '--substance-alcohol', withdrawalSymptom: 'Tremors & Seizure Risk', aiFocus: 'social triggers', psychology: 'sleep, liver, mood, and social triggers' },
  { slug: 'smoking', name: 'Smoking', descriptor: 'Cigarettes & cigars', icon: 'cigarette', accentVar: '--substance-smoking', withdrawalSymptom: 'Irritability & Restlessness', aiFocus: 'urges and habit interruption', psychology: 'fast-feedback and habit-loop based' },
  { slug: 'vaping', name: 'Vaping', descriptor: 'E-cigarettes & pods', icon: 'vape', accentVar: '--substance-vaping', withdrawalSymptom: 'Oral Fixation & Headaches', aiFocus: 'constant access interruption', psychology: 'fast-feedback and constant availability' },
  { slug: 'chewing-tobacco', name: 'Chewing Tobacco', descriptor: 'Dip & snus', icon: 'leaf', accentVar: '--substance-chewing-tobacco', withdrawalSymptom: 'Oral cravings & Agitation', aiFocus: 'oral habit replacement', psychology: 'oral fixation and steady nicotine flow' },
  { slug: 'cannabis', name: 'Cannabis', descriptor: 'Flower, edibles & concentrates', icon: 'leaf', accentVar: '--substance-cannabis', withdrawalSymptom: 'Vivid Dreams & Derealization', aiFocus: 'motivation and sleep', psychology: 'motivation, sleep, brain fog, derealization' },
  { slug: 'opioids', name: 'Opioids', descriptor: 'Painkillers & heroin', icon: 'pill', accentVar: '--substance-opioids', withdrawalSymptom: 'Severe physical sickness', aiFocus: 'stabilization and harm reduction', psychology: 'medically serious and stabilization-focused' },
  { slug: 'benzodiazepines', name: 'Benzodiazepines', descriptor: 'Xanax, Valium & Klonopin', icon: 'pill', accentVar: '--substance-benzodiazepines', withdrawalSymptom: 'Dangerous withdrawal & seizures', aiFocus: 'reassurance and safety', psychology: 'slow, safe, and medically cautious taper' },
  { slug: 'cocaine', name: 'Cocaine', descriptor: 'Powder & crack', icon: 'sparkles', accentVar: '--substance-cocaine', withdrawalSymptom: 'Crash cycles & Impulsivity', aiFocus: 'impulse interruption and crash support', psychology: 'impulsivity, crash cycles, and relapse spikes' },
  { slug: 'methamphetamine', name: 'Methamphetamine', descriptor: 'Crystal meth', icon: 'zap', accentVar: '--substance-methamphetamine', withdrawalSymptom: 'Anhedonia & Exhaustion', aiFocus: 'dopamine repair and energy management', psychology: 'dopamine repair and severe anhedonia' },
  { slug: 'prescription-stimulants', name: 'Prescription Stimulants', descriptor: 'Adderall, Ritalin & Vyvanse', icon: 'pill', accentVar: '--substance-prescription-stimulants', withdrawalSymptom: 'Lethargy & Brain Fog', aiFocus: 'productivity identity and focus', psychology: 'unlinking productivity from medication' },
  { slug: 'mdma', name: 'MDMA', descriptor: 'Ecstasy & molly', icon: 'heart', accentVar: '--substance-mdma', withdrawalSymptom: 'Serotonin depletion & Depression', aiFocus: 'emotional recovery and serotonin repair', psychology: 'serotonin depletion and emotional recovery' },
  { slug: 'kratom', name: 'Kratom', descriptor: 'Powder & extracts', icon: 'leaf', accentVar: '--substance-kratom', withdrawalSymptom: 'Atypical opioid withdrawal', aiFocus: 'tapering and herbal dependency', psychology: 'herbal dependency and unique withdrawal' },
];

let output = `import { SubstanceConfig } from './types';\n\n`;

output += `const rn = (min: number, max: number) => Math.round((min + Math.random() * (max - min)) * 10) / 10;\n`;
output += `const ri = (min: number, max: number) => Math.floor(min + Math.random() * (max - min + 1));\n`;
output += `const pick = <T>(arr: T[]): T => arr[ri(0, arr.length - 1)];\n\n`;

output += `export const substances: SubstanceConfig[] = [\n`;

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

output += `];\n`;

fs.writeFileSync('src/data/substances.ts', output);
console.log('Successfully generated src/data/substances.ts');
