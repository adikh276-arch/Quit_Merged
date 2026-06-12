const fs = require('fs');
let content = fs.readFileSync('src/data/substances.ts', 'utf-8');

const replacements = {
  alcohol: "    calculator: {\n" +
"      title: 'Units & Health Impact',\n" +
"      inputs: [\n" +
"        { key: 'drinksPerDay', label: 'Drinks per day', type: 'slider', min: 0, max: 20, step: 1, defaultValue: 4 },\n" +
"        { key: 'drinkingDays', label: 'Drinking days per week', type: 'slider', min: 0, max: 7, step: 1, defaultValue: 5 },\n" +
"        { key: 'costPerDrink', label: 'Cost per drink ', type: 'slider', min: 50, max: 1000, step: 50, defaultValue: 200 },\n" +
"      ],\n" +
"      compute: (inputs) => {\n" +
"        const weeklyUnits = inputs.drinksPerDay * inputs.drinkingDays;\n" +
"        const weeklySpend = inputs.costPerDrink * inputs.drinksPerDay * inputs.drinkingDays;\n" +
"        const monthlySpend = weeklySpend * 4.345;\n" +
"        const yearlySpend = monthlySpend * 12;\n" +
"        return [\n" +
"          { label: 'Weekly units', value: weeklyUnits + ' units', color: weeklyUnits > 14 ? 'destructive' : 'primary' },\n" +
"          { label: 'Safe limit', value: '14 units/week' },\n" +
"          { label: 'Weekly spend', value: Math.round(weeklySpend).toLocaleString() },\n" +
"          { label: 'Monthly spend', value: Math.round(monthlySpend).toLocaleString() },\n" +
"          { label: 'Yearly spend', value: Math.round(yearlySpend).toLocaleString() },\n" +
"          { label: 'Liver risk', value: weeklyUnits > 35 ? 'High' : weeklyUnits > 14 ? 'Moderate' : 'Low', color: weeklyUnits > 35 ? 'destructive' : weeklyUnits > 14 ? 'accent' : 'primary' },\n" +
"        ];\n" +
"      },\n" +
"      note: 'Your liver begins regenerating within 72 hours of stopping.',\n" +
"    },",

  tobacco: "    calculator: {\n" +
"      title: 'Cigarette Cost & Health Impact',\n" +
"      inputs: [\n" +
"        { key: 'cigarettesPerDay', label: 'Cigarettes per day', type: 'slider', min: 1, max: 60, step: 1, defaultValue: 15 },\n" +
"        { key: 'costPerPack', label: 'Cost per pack ', type: 'slider', min: 50, max: 1000, step: 10, defaultValue: 280 },\n" +
"        { key: 'yearsSmoked', label: 'Years smoked', type: 'slider', min: 1, max: 50, step: 1, defaultValue: 8 },\n" +
"      ],\n" +
"      compute: (inputs) => {\n" +
"        const daily = (inputs.cigarettesPerDay / 20) * inputs.costPerPack;\n" +
"        const monthly = daily * 30.416;\n" +
"        const yearly = daily * 365;\n" +
"        const total = yearly * inputs.yearsSmoked;\n" +
"        return [\n" +
"          { label: 'Daily spend', value: Math.round(daily).toLocaleString() },\n" +
"          { label: 'Monthly spend', value: Math.round(monthly).toLocaleString() },\n" +
"          { label: 'Yearly spend', value: Math.round(yearly).toLocaleString() },\n" +
"          { label: 'Total spent', value: Math.round(total).toLocaleString() },\n" +
"          { label: 'Carcinogens per cigarette', value: '69 known' },\n" +
"          { label: '10-year benefit', value: '72% lower lung cancer risk' },\n" +
"        ];\n" +
"      },\n" +
"      note: 'Heart rate drops to normal 20 minutes after your last cigarette.',\n" +
"    },",

  opioids: "    calculator: {\n" +
"      title: 'MME & Overdose Risk',\n" +
"      inputs: [\n" +
"        { key: 'opioidType', label: 'Primary opioid', type: 'dropdown', options: [\n" +
"          { label: 'Morphine', value: 1 },\n" +
"          { label: 'Hydrocodone', value: 1 },\n" +
"          { label: 'Oxycodone', value: 1.5 },\n" +
"          { label: 'Codeine', value: 0.15 },\n" +
"          { label: 'Tramadol', value: 0.1 },\n" +
"          { label: 'Fentanyl (mcg/hr)', value: 2.4 }\n" +
"        ], defaultValue: 1 },\n" +
"        { key: 'dailyDose', label: 'Daily dose (mg or mcg/hr)', type: 'slider', min: 0, max: 500, step: 5, defaultValue: 40 },\n" +
"        { key: 'bupDose', label: 'Buprenorphine dose (mg/day)', type: 'slider', min: 0, max: 32, step: 2, defaultValue: 8 },\n" +
"      ],\n" +
"      compute: (inputs) => {\n" +
"        const mme = inputs.dailyDose * inputs.opioidType;\n" +
"        return [\n" +
"          { label: 'Daily MME', value: Math.round(mme) + ' MME' },\n" +
"          { label: 'Overdose risk', value: mme > 90 ? 'High' : mme > 50 ? 'Elevated' : 'Moderate', color: mme > 90 ? 'destructive' : mme > 50 ? 'accent' : 'primary' },\n" +
"          { label: 'Buprenorphine equivalent', value: 'Buprenorphine blocks other opioids' },\n" +
"          { label: 'Naloxone note', value: 'Available free at government health centres' },\n" +
"        ];\n" +
"      }\n" +
"    },",

  cannabis: "    calculator: {\n" +
"      title: 'Usage Cost & Recovery',\n" +
"      inputs: [\n" +
"        { key: 'gramsPerWeek', label: 'Grams per week', type: 'slider', min: 1, max: 30, step: 1, defaultValue: 7 },\n" +
"        { key: 'costPerGram', label: 'Cost per gram ', type: 'slider', min: 100, max: 2000, step: 50, defaultValue: 500 },\n" +
"      ],\n" +
"      compute: (inputs) => {\n" +
"        const weekly = inputs.gramsPerWeek * inputs.costPerGram;\n" +
"        const monthly = weekly * 4.345;\n" +
"        const yearly = monthly * 12;\n" +
"        return [\n" +
"          { label: 'Weekly spend', value: Math.round(weekly).toLocaleString() },\n" +
"          { label: 'Monthly spend', value: Math.round(monthly).toLocaleString() },\n" +
"          { label: 'Yearly spend', value: Math.round(yearly).toLocaleString() },\n" +
"          { label: 'THC clearance', value: 'Heavy users: 30-90 days' },\n" +
"          { label: 'Cognitive recovery', value: '2-4 weeks for most functions' },\n" +
"        ];\n" +
"      },\n" +
"      note: 'Cannabis hyperemesis stops within days of complete cessation.',\n" +
"    },",

  stimulants: "    calculator: {\n" +
"      title: 'Cardiovascular Risk & Cost',\n" +
"      inputs: [\n" +
"        { key: 'gramsPerUse', label: 'Grams per use', type: 'slider', min: 0.1, max: 5, step: 0.1, defaultValue: 0.5 },\n" +
"        { key: 'timesPerWeek', label: 'Times per week', type: 'slider', min: 1, max: 14, step: 1, defaultValue: 3 },\n" +
"        { key: 'costPerGram', label: 'Cost per gram ', type: 'slider', min: 1000, max: 20000, step: 500, defaultValue: 5000 },\n" +
"      ],\n" +
"      compute: (inputs) => {\n" +
"        const weekly = inputs.gramsPerUse * inputs.timesPerWeek * inputs.costPerGram;\n" +
"        const monthly = weekly * 4.345;\n" +
"        const yearly = monthly * 12;\n" +
"        return [\n" +
"          { label: 'Weekly spend', value: Math.round(weekly).toLocaleString() },\n" +
"          { label: 'Monthly spend', value: Math.round(monthly).toLocaleString() },\n" +
"          { label: 'Yearly spend', value: Math.round(yearly).toLocaleString() },\n" +
"          { label: 'Cardiovascular risk', value: 'Cocaine triples heart attack risk for 60 min after each use', color: 'destructive' },\n" +
"          { label: 'Heart rate recovery', value: ' ~40 BPM within 21 days' },\n" +
"        ];\n" +
"      },\n" +
"      note: 'Dopamine receptors begin to upregulate after 14 days of abstinence.',\n" +
"    },",

  benzodiazepines: "    calculator: {\n" +
"      title: 'Taper Schedule & Equivalents',\n" +
"      inputs: [\n" +
"        { key: 'currentDose', label: 'Current daily dose (mg)', type: 'slider', min: 0.5, max: 20, step: 0.5, defaultValue: 4 },\n" +
"        { key: 'taperWeeks', label: 'Target weeks to complete', type: 'slider', min: 4, max: 26, step: 1, defaultValue: 12 },\n" +
"      ],\n" +
"      compute: (inputs) => {\n" +
"        const weeklyReduction = inputs.currentDose / inputs.taperWeeks;\n" +
"        const rate = (weeklyReduction / inputs.currentDose) * 100;\n" +
"        return [\n" +
"          { label: 'Weekly reduction', value: weeklyReduction.toFixed(2) + ' mg' },\n" +
"          { label: 'Taper rate', value: rate.toFixed(1) + '%/week', color: rate > 15 ? 'destructive' : rate > 10 ? 'accent' : 'primary' },\n" +
"          { label: 'Safety', value: rate > 15 ? 'Medical review needed' : rate > 10 ? 'Slightly fast' : 'Safe range' },\n" +
"          { label: 'Disclaimer', value: 'Your doctor must approve all taper changes' },\n" +
"        ];\n" +
"      },\n" +
"      note: 'Never stop benzodiazepines abruptly due to seizure risk.',\n" +
"    },",

  kratom: "    calculator: {\n" +
"      title: 'Usage Cost & Dependence',\n" +
"      inputs: [\n" +
"        { key: 'gramsPerDay', label: 'Grams per day', type: 'slider', min: 1, max: 50, step: 1, defaultValue: 15 },\n" +
"        { key: 'costPerKg', label: 'Cost per kg ', type: 'slider', min: 1000, max: 10000, step: 500, defaultValue: 3000 },\n" +
"      ],\n" +
"      compute: (inputs) => {\n" +
"        const daily = (inputs.gramsPerDay / 1000) * inputs.costPerKg;\n" +
"        const monthly = daily * 30.416;\n" +
"        const yearly = daily * 365;\n" +
"        return [\n" +
"          { label: 'Daily cost', value: Math.round(daily).toLocaleString() },\n" +
"          { label: 'Monthly cost', value: Math.round(monthly).toLocaleString() },\n" +
"          { label: 'Yearly cost', value: Math.round(yearly).toLocaleString() },\n" +
"          { label: 'Opioid receptor binding', value: 'Mitragynine binds mu-opioid receptors' },\n" +
"        ];\n" +
"      },\n" +
"      note: 'Withdrawal mimics mild opioid withdrawal and lasts 3-7 days.',\n" +
"    },",

  mdma: "    calculator: {\n" +
"      title: 'Neurotoxicity Risk & Recovery',\n" +
"      inputs: [\n" +
"        { key: 'dosePerSession', label: 'Average dose (mg)', type: 'slider', min: 50, max: 500, step: 25, defaultValue: 150 },\n" +
"        { key: 'sessionsPerMonth', label: 'Sessions per month', type: 'slider', min: 1, max: 8, step: 1, defaultValue: 2 },\n" +
"        { key: 'yearsOfUse', label: 'Years of use', type: 'slider', min: 1, max: 20, step: 1, defaultValue: 3 },\n" +
"      ],\n" +
"      compute: (inputs) => {\n" +
"        const risk = inputs.dosePerSession > 150 && inputs.sessionsPerMonth > 1 ? 'High' : inputs.sessionsPerMonth > 2 ? 'Moderate' : 'Low';\n" +
"        return [\n" +
"          { label: 'Neurotoxicity risk', value: risk, color: risk === 'High' ? 'destructive' : risk === 'Moderate' ? 'accent' : 'primary' },\n" +
"          { label: 'Recovery timeline', value: Math.round(inputs.yearsOfUse * 3) + ' months estimated' },\n" +
"          { label: 'Key note', value: 'Heavy use (>150mg, >monthly) causes lasting serotonin changes. Recovery is possible.' },\n" +
"        ];\n" +
"      },\n" +
"      note: 'The 3-month rule is recommended to prevent serotonin depletion.',\n" +
"    }"
};

const lines = content.split('\n');
let newLines = [];
let i = 0;
while (i < lines.length) {
  if (lines[i].includes('calculator: {')) {
    // find which substance we are in by looking back up to 200 lines for 'slug:'
    let slug = '';
    for(let j=i; j>=Math.max(0, i-200); j--) {
      const match = lines[j].match(/slug:\s*'([^']+)'/);
      if (match) { slug = match[1]; break; }
    }
    
    // skip until the calculator object ends
    let depth = 0;
    let started = false;
    let j = i;
    while (j < lines.length) {
      const line = lines[j];
      depth += (line.match(/\{/g) || []).length;
      depth -= (line.match(/\}/g) || []).length;
      started = true;
      if (started && depth === 0) {
        // we reached the end of calculator object
        break;
      }
      j++;
    }
    
    if (slug && replacements[slug]) {
       newLines.push(replacements[slug]);
    } else {
       // if not found, just push original (shouldn't happen)
       for(let k=i; k<=j; k++) newLines.push(lines[k]);
    }
    
    i = j + 1; // skip the lines we replaced
  } else {
    newLines.push(lines[i]);
    i++;
  }
}

fs.writeFileSync('src/data/substances.ts', newLines.join('\n'));
