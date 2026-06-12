/**
 * expand_all_substances.cjs
 * Replaces the stub definitions for vaping, chewing-tobacco, cocaine, and
 * methamphetamine with full production-quality content matching the 8 original substances.
 *
 * Run from project root: node scratch/expand_all_substances.cjs
 */
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/data/substances.ts');
let content = fs.readFileSync(filePath, 'utf8');

// ─────────────────────────────────────────────────────────────
// FULL SUBSTANCE DEFINITIONS
// ─────────────────────────────────────────────────────────────

const NEW_SUBSTANCES = `
  // ===== VAPING =====
  {
    slug: 'vaping',
    name: 'Vaping',
    descriptor: 'E-cigarettes & pods',
    icon: 'vape',
    accentVar: '--substance-vaping',
    trackers: [
      {
        id: 'vape-log', name: 'Vaping Sessions', chartType: 'bar', yAxisLabel: 'Sessions',
        insight: 'Each session you skip is your lungs clearing particulate matter and your nicotine receptors down-regulating.',
        fields: [
          { key: 'vaped', label: 'Did you vape today?', type: 'single-select', options: ['Yes', 'No'] },
          { key: 'sessions', label: 'Sessions today', type: 'slider', min: 0, max: 30, step: 1, showIf: { field: 'vaped', value: 'Yes' } },
          { key: 'device', label: 'Device type', type: 'chips', options: ['Pod/Juul', 'Disposable', 'Box Mod', 'Other'], showIf: { field: 'vaped', value: 'Yes' } },
          { key: 'nicotine', label: 'Nicotine mg/ml', type: 'chips', options: ['0mg', '3mg', '6mg', '12mg', '20mg+'], showIf: { field: 'vaped', value: 'Yes' } },
          { key: 'trigger', label: 'Primary trigger', type: 'chips', options: ['Stress', 'Boredom', 'Social', 'Habit', 'After meal', 'Morning'], showIf: { field: 'vaped', value: 'Yes' } },
          { key: 'notes', label: 'Notes', type: 'textarea' },
        ],
        mockGenerator: (day) => ({
          vaped: day < 12 ? 'Yes' : 'No',
          sessions: day < 7 ? Math.max(0, 20 - day * 2) : day < 12 ? Math.max(0, 8 - day) : 0,
          device: day < 12 ? 'Pod/Juul' : 'No',
          nicotine: '20mg+',
          trigger: ['Stress', 'Boredom', 'Habit', 'After meal'][day % 4],
          notes: '',
        }),
      },
      {
        id: 'cravings', name: 'Craving Intensity', chartType: 'line', yAxisLabel: 'Cravings',
        insight: 'Nicotine cravings peak at 3 minutes and pass. Tracking them proves you can outlast every single one.',
        fields: [
          { key: 'count', label: 'Number of cravings today', type: 'slider', min: 0, max: 20, step: 1 },
          { key: 'peakIntensity', label: 'Peak intensity (1-10)', type: 'slider', min: 1, max: 10, step: 1, showIf: { field: 'count', value: 0, op: '!==' } },
          { key: 'trigger', label: 'Primary trigger', type: 'chips', options: ['Morning routine', 'After meals', 'Stress', 'Boredom', 'Social', 'Screen time'], showIf: { field: 'count', value: 0, op: '!==' } },
          { key: 'coping', label: 'Coping used', type: 'chips', options: ['Breathing', 'Water', 'Walk', 'Gum', 'Distraction', 'Waited it out'], multiSelect: true, showIf: { field: 'count', value: 0, op: '!==' } },
          { key: 'resisted', label: 'Did you resist?', type: 'single-select', options: ['Yes', 'Partially', 'No'], showIf: { field: 'count', value: 0, op: '!==' } },
          { key: 'notes', label: 'Notes', type: 'textarea' },
        ],
        mockGenerator: (day) => ({
          count: Math.max(0, Math.round(15 - day * 0.5)),
          peakIntensity: Math.max(1, Math.round(9 - day * 0.3)),
          trigger: ['Morning routine', 'After meals', 'Stress', 'Boredom'][day % 4],
          coping: ['Breathing'],
          resisted: day > 10 ? 'Yes' : day > 5 ? 'Partially' : 'No',
          notes: '',
        }),
      },
      {
        id: 'withdrawal', name: 'Withdrawal Symptoms', chartType: 'stacked-bar', yAxisLabel: 'Severity',
        insight: 'Headaches and irritability are your body evicting nicotine. Every symptom is proof of healing.',
        fields: [
          { key: 'headache', label: 'Headache', type: 'chips', options: ['None', 'Mild', 'Moderate', 'Severe'] },
          { key: 'irritability', label: 'Irritability', type: 'chips', options: ['None', 'Mild', 'Moderate', 'Severe'] },
          { key: 'anxiety', label: 'Anxiety', type: 'chips', options: ['None', 'Mild', 'Moderate', 'Severe'] },
          { key: 'brainFog', label: 'Brain fog', type: 'chips', options: ['None', 'Mild', 'Moderate', 'Severe'] },
          { key: 'hunger', label: 'Increased hunger', type: 'chips', options: ['None', 'Mild', 'Moderate', 'Severe'] },
          { key: 'notes', label: 'Notes', type: 'textarea' },
        ],
        mockGenerator: (day) => {
          const sev = (d) => d < 3 ? 'Severe' : d < 7 ? 'Moderate' : d < 14 ? 'Mild' : 'None';
          return { headache: sev(day), irritability: sev(day), anxiety: sev(day), brainFog: sev(day), hunger: day < 10 ? 'Moderate' : 'Mild', notes: '' };
        },
      },
      {
        id: 'lung-healing', name: 'Lung Healing', chartType: 'line', yAxisLabel: 'Score',
        insight: 'After 72 hours, your cilia begin recovering. After 2 weeks, lung capacity measurably improves.',
        fields: [
          { key: 'breathingClarity', label: 'Breathing clarity (1-10)', type: 'slider', min: 1, max: 10, step: 1 },
          { key: 'morningCough', label: 'Morning cough', type: 'chips', options: ['None', 'Mild', 'Moderate', 'Severe'] },
          { key: 'chestTightness', label: 'Chest tightness', type: 'chips', options: ['None', 'Mild', 'Moderate', 'Severe'] },
          { key: 'notes', label: 'Notes', type: 'textarea' },
        ],
        mockGenerator: (day) => ({
          breathingClarity: Math.min(10, Math.round(3 + day * 0.25)),
          morningCough: day < 5 ? 'Moderate' : day < 14 ? 'Mild' : 'None',
          chestTightness: day < 3 ? 'Moderate' : day < 10 ? 'Mild' : 'None',
          notes: '',
        }),
      },
      {
        id: 'mood-sleep', name: 'Mood & Sleep', chartType: 'area', yAxisLabel: 'Score',
        insight: 'Nicotine disrupts sleep architecture. By week 3, REM cycles normalise and you wake feeling rested.',
        fields: [
          { key: 'mood', label: 'Mood today', type: 'icon-picker', options: ['Happy', 'Calm', 'Neutral', 'Anxious', 'Sad', 'Angry'] },
          { key: 'energy', label: 'Energy level (1-10)', type: 'slider', min: 1, max: 10, step: 1 },
          { key: 'sleepHours', label: 'Hours slept', type: 'slider', min: 0, max: 12, step: 0.5 },
          { key: 'sleepQuality', label: 'Sleep quality', type: 'chips', options: ['Poor', 'Fair', 'Good', 'Excellent'] },
          { key: 'notes', label: 'Notes', type: 'textarea' },
        ],
        mockGenerator: (day) => ({
          mood: day > 14 ? 'Calm' : day > 7 ? 'Neutral' : 'Anxious',
          energy: Math.min(10, Math.round(4 + day * 0.22)),
          sleepHours: Math.min(9, +(4.5 + day * 0.18).toFixed(1)),
          sleepQuality: day > 14 ? 'Good' : day > 7 ? 'Fair' : 'Poor',
          notes: '',
        }),
      },
      {
        id: 'financial', name: 'Money Saved', chartType: 'area', yAxisLabel: '$ Saved',
        insight: 'A 20mg pod-a-day habit costs over $1,800/year. Every day you save is compound freedom.',
        fields: [
          { key: 'boughtToday', label: 'Did you buy pods/refills today?', type: 'single-select', options: ['Yes', 'No'] },
          { key: 'spent', label: 'Amount spent', type: 'number', showIf: { field: 'boughtToday', value: 'Yes' } },
          { key: 'baselineDailySpend', label: 'Your usual daily spend', type: 'number' },
          { key: 'notes', label: 'Notes', type: 'textarea' },
        ],
        mockGenerator: (day) => ({
          boughtToday: day < 5 ? 'Yes' : 'No',
          spent: day < 5 ? 7 : 0,
          baselineDailySpend: 7,
          notes: '',
        }),
      },
    ],
    calculator: {
      title: 'Nicotine Exposure & Savings',
      inputs: [
        { key: 'podsPerDay', label: 'Pods/cartridges per day', type: 'slider', min: 0, max: 5, step: 0.5, defaultValue: 1 },
        { key: 'costPerPod', label: 'Cost per pod ($)', type: 'slider', min: 3, max: 30, step: 1, defaultValue: 7 },
        { key: 'nicotineMg', label: 'Nicotine mg/ml', type: 'slider', min: 0, max: 50, step: 1, defaultValue: 20 },
      ],
      compute: (inputs) => {
        const dailyNicotine = inputs.podsPerDay * inputs.nicotineMg * 0.7;
        const weekly = inputs.podsPerDay * inputs.costPerPod * 7;
        const yearly = weekly * 52;
        const recoveryDays = inputs.nicotineMg > 20 ? 21 : inputs.nicotineMg > 10 ? 14 : 10;
        return [
          { label: 'Daily nicotine absorbed', value: `~${Math.round(dailyNicotine)}mg`, color: dailyNicotine > 20 ? 'destructive' : 'accent' },
          { label: 'Weekly spend', value: `$${Math.round(weekly)}` },
          { label: 'Yearly spend', value: `$${Math.round(yearly)}`, color: 'destructive' },
          { label: 'Cravings normalise by', value: `Day ${recoveryDays}` },
          { label: '1-year savings if quit', value: `$${Math.round(yearly)}`, color: 'primary' },
        ];
      },
      note: 'Within 20 minutes of quitting your blood pressure and heart rate drop. Within 12 hours carbon monoxide levels normalise.',
    },
    activities: [
      {
        id: 'vaping-quiz', name: 'Nicotine Science Quiz', duration: '3 min', type: 'quiz',
        description: 'How much do you really know about what vaping does to your body?',
        questions: [
          { question: 'How quickly does nicotine reach the brain after vaping?', options: ['30 seconds', '10 seconds', '2 minutes', '5 minutes'], correctIndex: 1, explanation: 'Nicotine reaches the brain in under 10 seconds via the lungs — faster than almost any other delivery route. This speed is part of what makes it so addictive.' },
          { question: 'What is the main chemical causing EVALI (vaping lung disease)?', options: ['Nicotine', 'Propylene glycol', 'Vitamin E acetate', 'Diacetyl'], correctIndex: 2, explanation: 'Vitamin E acetate, used to thicken vaping liquids, has been directly linked to EVALI — a serious inflammatory lung condition. It\'s invisible in the aerosol but coats lung tissue.' },
          { question: 'How long does a typical nicotine craving last at its peak?', options: ['3-5 minutes', '20 minutes', '1 hour', 'All day'], correctIndex: 0, explanation: 'The peak intensity of a nicotine craving lasts just 3-5 minutes. Every craving you outlast proves you can beat all of them.' },
          { question: 'When does lung cilia function begin recovering after quitting?', options: ['1 month', '1 week', '72 hours', '6 months'], correctIndex: 2, explanation: 'Cilia — the tiny hair-like structures that clear debris from your airways — begin recovering within 72 hours of quitting. This is why some people cough more initially.' },
        ],
      },
      {
        id: 'vaping-breathing', name: '4-7-8 Craving Reset', duration: '3 min', type: 'breathing',
        description: 'A breathing pattern clinically proven to activate the parasympathetic nervous system and reduce craving intensity.',
        phases: [
          { time: 4, text: 'Breathe in slowly through your nose for 4 counts' },
          { time: 7, text: 'Hold the breath for 7 counts — let your body absorb oxygen' },
          { time: 8, text: 'Exhale completely through your mouth for 8 counts' },
          { time: 4, text: 'Breathe in slowly through your nose for 4 counts' },
          { time: 7, text: 'Hold the breath for 7 counts' },
          { time: 8, text: 'Exhale completely — feel the craving deflating with each breath' },
          { time: 4, text: 'One more time — in for 4' },
          { time: 7, text: 'Hold for 7' },
          { time: 8, text: 'Out for 8. The craving has peaked. It is passing now.' },
        ],
      },
      {
        id: 'hand-habit-affirmations', name: 'Hand Habit Swap Cards', duration: '3 min', type: 'affirmation',
        description: 'Vaping is two habits: nicotine and the hand-to-mouth motion. Swipe through replacements for the physical ritual.',
        affirmations: [
          'Pick up a pen and click it slowly 10 times. This is your hands doing their job.',
          'Hold a cold glass of water. Feel the weight. Take a sip. This is grounding.',
          'Squeeze a stress ball five times. Your hands needed something to do. Give them this.',
          'Touch your fingertips together one by one, counting each contact. Present and in control.',
          'Do 10 finger stretches. Your hands have better things to do than reach for a device.',
          'Breathe in with your hands on your belly. Feel it rise and fall. This is enough.',
          'Write one sentence — anything — with a pen. The act of writing rewires the hand-mouth loop.',
        ],
      },
      {
        id: 'lung-recovery-visualization', name: 'Lung Recovery Journey', duration: '5 min', type: 'visualization',
        description: 'A guided journey through your lungs healing in real time — day by day.',
        scenes: [
          { text: 'Day 1: Your cilia are stunned — they have been bathed in aerosol for so long. But they are alive. And they are beginning to stir.', emoji: 'natural', duration: 10 },
          { text: '72 hours: Carbon monoxide has left your bloodstream. Oxygen delivery to every cell has improved measurably. Your lungs are breathing cleaner air.', emoji: 'energy', duration: 10 },
          { text: 'Week 2: Cilia are sweeping out accumulated particulate. The morning cough is those tiny defenders doing their job — cleaning the airways you neglected.', emoji: 'natural', duration: 10 },
          { text: 'Month 1: Lung capacity is measurably increasing. Stairs feel easier. Deep breaths reach further. Your body remembers how to breathe.', emoji: 'mood', duration: 10 },
          { text: 'Month 3+: Inflammation is resolving. The risk of respiratory infection is falling. You have given your lungs a future they did not have with vaping.', emoji: 'energy', duration: 12 },
        ],
      },
    ],
    articles: [
      { id: 'a1', title: 'Why Vaping Feels Impossible to Quit', tag: 'Awareness & Readiness', content: 'Your Goal: Understand exactly why vaping has such powerful hold over behaviour — so you can stop blaming willpower and start addressing the actual mechanism.\\n\\nThe Design Problem\\n\\nVaping was engineered for compulsive use in ways that cigarettes were not. A cigarette ends. A vape does not. The device is always available, always charged, always in your pocket. There is no natural stopping point built into the experience. This is not an accident — it is a design feature.\\n\\nThe Nicotine Delivery Problem\\n\\nModern pod systems deliver nicotine to the brain in under 10 seconds. The speed of delivery is one of the most powerful drivers of addiction: the faster the reward, the stronger the conditioning. Pod devices using nicotine salts can deliver 50-60mg of nicotine per ml — several times higher than traditional cigarettes. Your brain has been receiving very large doses, very quickly, many times per day.\\n\\nThe result is a highly sensitive nicotine dependency. When you try to stop, the gap between your current baseline and zero is enormous. This is not weakness. This is chemistry.\\n\\nThe Two Habits You Are Actually Quitting\\n\\nVaping creates two separate habits that need to be addressed independently. The first is the nicotine dependency — a physiological adaptation that drives physical cravings. The second is the hand-to-mouth behavioural ritual — reaching for the device when stressed, bored, after eating, during transitions. These two habits reinforce each other. Address only the nicotine and the behavioural ritual persists. Address only the behaviour and the physical cravings remain.\\n\\nWhat This Means for You\\n\\nSuccessful vaping cessation requires a plan that addresses both simultaneously: managing the physiological withdrawal (with or without NRT) and deliberately replacing the behavioural rituals. The most effective approaches treat it as two overlapping problems, not one.\\n\\nYour Next Steps\\n\\nWrite down your top three vaping rituals — the specific moments when you automatically reach for the device. These are your highest-risk windows.\\n\\nFor each ritual, identify one physical replacement action (water, gum, breathing, hand movement). The replacement does not need to feel as good — it just needs to occupy the same physical space.\\n\\nSpeak to a doctor or pharmacist about nicotine replacement therapy. NRT doubles quit success rates. It is not cheating — it is reducing the difficulty of a genuinely difficult process.' },
      { id: 'a2', title: 'The Signs of a Vaping Problem', tag: 'Awareness & Readiness', content: 'Your Goal: Recognise the specific patterns that indicate your vaping has crossed from habit into dependency — so you can respond to it honestly.\\n\\nWhy It is Easy to Minimise\\n\\nVaping is socially normalised in ways that make dependency harder to recognise. It produces no smoke, no smell that lingers, no yellow fingers. The very invisibility of the habit makes it easier to underestimate.\\n\\nThe Signs Worth Taking Seriously\\n\\nYou vape more than you intended. You planned to use it occasionally. Now it is all day, every day, across every transition. You have tried to cut down repeatedly. Each attempt has lasted hours, not weeks. You feel anxious, irritable, or foggy without it. These are withdrawal symptoms — not personality traits.\\n\\nYou vape in places or situations you would have previously considered off-limits. The device has gradually colonised more and more of your day. You feel like you cannot concentrate, relax, or enjoy anything without it. This is nicotine dependency redefining your baseline of normal.\\n\\nThe DSM-5 Criteria\\n\\nThe DSM-5 identifies 11 clinical criteria for Substance Use Disorder. Nicotine dependency meets most of them: use in larger amounts than intended, persistent desire to cut down, craving, continued use despite knowing it causes harm, tolerance (needing more for the same effect), withdrawal. Most heavy vapers meet 4-6 criteria without ever thinking of themselves as addicted.\\n\\nYour Next Steps\\n\\nTake the DSM-5 self-assessment in this app. Get an honest clinical picture of where you currently stand.\\n\\nWrite down the three criteria from this article that resonate most with your own experience. Name them specifically.\\n\\nSpeak to your GP about nicotine dependency. There is no shame in bringing this to a medical professional.' },
      { id: 'a3', title: 'Mapping Your Vaping Triggers', tag: 'Awareness & Readiness', content: 'Your Goal: Build a personalised map of the specific situations, emotions, and environments that reliably activate your urge to vape — so you can prepare for them rather than react to them.\\n\\nWhy Triggers Matter More Than Willpower\\n\\nMost vaping relapses do not happen because someone decided to vape again. They happen because someone walked into a trigger without a plan. Research is consistent: trigger awareness is one of the highest-leverage interventions in early nicotine cessation.\\n\\nThe Four Trigger Categories\\n\\nRoutine triggers: the predictable moments in your day that have become automatically linked to vaping. Morning coffee. After meals. Finishing a task. Before bed. These are association-based — your brain has Pavlov-linked the situation to the behaviour.\\n\\nEmotional triggers: the feelings that reliably send you to the device. Stress is the most common. But boredom, loneliness, frustration, even happiness and celebration can all be triggers depending on your history.\\n\\nSocial triggers: situations where others vape, where vaping is expected, or where the social discomfort of not vaping feels high. These are particularly powerful in the first weeks.\\n\\nEnvironmental triggers: physical locations, smells, or objects that your brain associates with vaping. Your car. Your bedroom. A friend\'s flat. Certain apps on your phone.\\n\\nBuilding Your Trigger Map\\n\\nFor the next 48 hours, every time you notice an urge to vape, write: the time, what you were doing, how you were feeling, and the intensity from 1-10. After two days you will see 3-5 recurring clusters. Once you see them, you can build specific plans for each.\\n\\nYour Next Steps\\n\\nIdentify your single highest-risk time of day and plan specifically for it. If it is morning with coffee, change the coffee location, switch to tea, or have a planned replacement ready.\\n\\nFor each social trigger, prepare one honest, low-effort response. Knowing what you will say removes the split-second panic that leads to vaping.\\n\\nRemove vaping apps, block vaping stores from your maps, and delete dealer contacts from your phone this week.' },
      { id: 'a4', title: 'The Lies We Tell to Keep Vaping', tag: 'Awareness & Readiness', content: 'Your Goal: Recognise the specific rationalisations your mind uses to justify continued vaping — because the same brain shaped by nicotine is the one evaluating whether you have a problem.\\n\\nThe Smartest Thing Addiction Does\\n\\nNicotine dependency does not announce itself. It generates convincing reasons why right now is not the right time to stop, why this situation is special, why the rules apply to everyone except you in this exact circumstance. This is not a character flaw. It is a brain protecting a behaviour it has learned to value.\\n\\nThe Most Common Vaping Rationalisations\\n\\n"It is not as bad as cigarettes." This is technically true in some respects and dangerously misleading in others. Vaping delivers nicotine — the same dependency-causing compound. And the long-term effects of vaping aerosols are still being documented.\\n\\n"I only do it when I am stressed." Stress is now a permanent feature of life. If stress is the condition for vaping, vaping is permanent. The "only when stressed" rule is almost never a rule.\\n\\n"I can stop whenever I want." This is the most common. And the best test of it is to stop for two weeks. If that thought creates anxiety, the belief is not accurate.\\n\\n"I need it to concentrate / relax / socialise." These feel true because nicotine dependency has made them partly true. Your brain has genuinely outsourced these functions to nicotine. But this is the dependency speaking, not an accurate description of your capabilities.\\n\\nHow to Work With These Thoughts\\n\\nThe goal is not to argue with the thought. Nicotine thoughts are faster than conscious reasoning. The goal is to name what you are hearing: "That is the dependency talking. I notice it. I am not required to follow it."\\n\\nYour Next Steps\\n\\nWrite down the two rationalisations you use most often. Seeing them on paper weakens them.\\n\\nFor each one, write one honest counter-statement — not an argument, just the truth.\\n\\nShare these with someone you trust. Rationalisations lose most of their power when spoken aloud.' },
      { id: 'a5', title: 'The 72-Hour Nicotine Detox', tag: 'Detox & Early Healing', content: 'Your Goal: Understand what is happening in your body during the first 72 hours after quitting vaping — and know exactly what to expect so you can move through it with preparation instead of panic.\\n\\nThe First 20 Minutes\\n\\nTwenty minutes after your last vape, your blood pressure and heart rate begin dropping toward normal. This is not a metaphor. These are measurable physiological changes happening in your body right now.\\n\\nHours 2-12\\n\\nCarbon monoxide — a gas produced in combustion-based vaping — begins clearing from your bloodstream. Your blood oxygen levels improve. You may not feel this immediately. Your body is working quietly in the background.\\n\\nHours 12-24\\n\\nNicotine levels in your blood are dropping significantly. This is when the first serious withdrawal symptoms appear for most people: irritability, restlessness, difficulty concentrating, increased appetite. These are not signs that something is going wrong. These are signs that your body is recalibrating — adjusting to the absence of a chemical it had come to rely on.\\n\\nHours 24-72\\n\\nNicotine has mostly cleared your bloodstream. This is often the peak of physical withdrawal intensity. Headaches, anxiety, sleep disruption, and intense cravings are all common. The physical intensity of nicotine withdrawal is real — but it is time-limited. The worst of the physical symptoms for most people resolves within 72 hours.\\n\\nWhat Actually Helps\\n\\nHydration reduces headache intensity. Frequent small meals stabilise blood sugar, which drops with nicotine cessation. Cold water, ice, or gum can reduce the oral aspect of craving. Planned activity prevents the worst of the restlessness from becoming unbearable.\\n\\nYour Next Steps\\n\\nPlan your 72-hour window specifically. Clear your calendar of optional obligations if you can. Stock up on practical supplies: water, healthy snacks, gum, something to do with your hands.\\n\\nTell one person what you are doing and ask them to check in. Accountability during the 72-hour window is one of the single most effective things you can add.\\n\\nIf the withdrawal feels medically serious — severe anxiety, heart irregularities, extreme agitation — contact a doctor. NRT can significantly reduce physical withdrawal severity.' },
      { id: 'a6', title: 'How to Urge Surf Nicotine Cravings', tag: 'Detox & Early Healing', content: 'Your Goal: Learn to move through a nicotine craving without acting on it, using the technique of urge surfing — and build the neural pathway of "I can feel this without giving in.\"\\n\\nWhat a Craving Actually Is\\n\\nA craving is not a command. Here is what the neuroscience shows: nicotine cravings are waves of neurochemical activity that peak and subside within 3-5 minutes. They feel permanent and escalating. They are not. They crest and fall — every single time.\\n\\nUrge surfing was developed by psychologist Alan Marlatt as a technique for exactly this: observing the craving rather than fighting it or giving in to it. The surfer does not fight the wave. They ride it.\\n\\nThe Technique\\n\\nStep 1 — Name it: "I am having a craving for nicotine right now." This one sentence activates your prefrontal cortex and creates distance between you and the urge.\\n\\nStep 2 — Locate it: Where do you feel it in your body? A tension in the chest? Restlessness in your hands? An ache in the back of the throat? Locating it makes it specific and observable rather than overwhelming.\\n\\nStep 3 — Watch it: Observe the sensation with curiosity. It will intensify briefly. Let it. You are watching, not fighting.\\n\\nStep 4 — Breathe through it: Slow, deliberate breaths activate your parasympathetic nervous system and directly reduce craving intensity. In for 4, hold for 4, out for 6.\\n\\nStep 5 — Ride it out: The craving will peak and begin to soften within 5 minutes. Every craving you surf this way builds the neural pathway that makes the next one easier.\\n\\nYour Next Steps\\n\\nPractise urge surfing with the next craving you experience, even if it is small. Small practice builds big capability.\\n\\nKeep a brief craving log: intensity at start, duration, intensity at end. You will quickly see your ability to ride them improving.\\n\\nDownload a MBSR or MBRP app to deepen your mindfulness-based relapse prevention skills.' },
      { id: 'a7', title: 'Managing Withdrawal Symptoms', tag: 'Detox & Early Healing', content: 'Your Goal: Know exactly what withdrawal symptoms to expect from nicotine cessation, understand why each one is happening, and have practical tools for each.\\n\\nWhy Withdrawal Happens\\n\\nYour brain has adapted to the regular presence of nicotine. Nicotine activates acetylcholine receptors — and over time, the brain responds by growing more of them. When nicotine is removed, this larger-than-normal receptor population is suddenly unstimulated. Withdrawal symptoms are the nervous system rebalancing itself.\\n\\nCommon Symptoms and What Helps\\n\\nHeadaches: caused by blood vessel changes as nicotine (which constricts blood vessels) is removed. Hydration, rest, and over-the-counter pain relief help. They typically resolve within 3-5 days.\\n\\nIrritability and anxiety: your brain is recalibrating its baseline. Exercise is the most effective tool — physical activity releases endorphins that directly counteract withdrawal-related anxiety. Even a 15-minute walk significantly reduces acute irritability.\\n\\nBrain fog: nicotine temporarily improves attention by stimulating acetylcholine pathways. Without it, concentration suffers briefly. This resolves completely within 1-2 weeks as your brain restores its natural pathways. Do not let temporary fog convince you it is permanent.\\n\\nIncreased appetite: nicotine suppresses appetite. Without it, your appetite returns to normal — which can feel like increase. Structured meals and planned snacks (especially protein-rich) prevent this from becoming a significant issue.\\n\\nSleep disruption: nicotine affects sleep architecture. Many people experience vivid dreams, lighter sleep, or difficulty falling asleep in the first 1-2 weeks. A consistent sleep schedule, dark environment, and avoiding screens before bed are your most effective tools.\\n\\nYour Next Steps\\n\\nMake a list of the symptoms you are most likely to experience based on your history. Prepare practical responses for each one before they arrive.\\n\\nExercise once daily during the first two weeks, even briefly. This is the single most effective non-pharmacological withdrawal tool available.\\n\\nIf withdrawal is severe, speak to your doctor about prescription cessation support. Varenicline (Champix/Chantix) reduces withdrawal severity significantly.' },
      { id: 'a8', title: 'Rebuilding Your Dopamine System', tag: 'Detox & Early Healing', content: 'Your Goal: Understand what nicotine did to your brain\'s reward system — and how to rebuild it deliberately.\\n\\nWhat Nicotine Did to Your Dopamine System\\n\\nNicotine stimulates dopamine release in the brain\'s reward circuit. With repeated use, the brain adapts by reducing its own natural dopamine production and sensitivity — a process called down-regulation. This is why, over time, you need more nicotine to feel normal and why everything else feels slightly flat by comparison.\\n\\nThe Withdrawal Window\\n\\nIn the first 2-4 weeks after quitting vaping, many people experience a period where ordinary pleasures feel muted. Activities that used to be enjoyable feel flat. This is called anhedonia — temporary dopamine system dampening. It is not permanent. It is the brain re-sensitising its reward pathways.\\n\\nWhat Actually Restores Dopamine Sensitivity\\n\\nPhysical exercise is the most powerful tool available. Aerobic exercise stimulates dopamine, serotonin, and norepinephrine — the same systems that nicotine was hijacking. And unlike nicotine, exercise builds capacity rather than depleting it.\\n\\nNovelty and learning: your brain releases dopamine in response to new experiences and mastered challenges. Deliberately seek out small new experiences — a different route, a new recipe, a skill you have wanted to learn. Each one is a micro-dose of natural dopamine.\\n\\nSocial connection: human connection stimulates oxytocin and dopamine. Time with people who matter is not just emotionally useful — it is pharmacologically relevant.\\n\\nYour Next Steps\\n\\nSchedule one form of physical activity every day for the next two weeks. It does not need to be intense — it needs to be consistent.\\n\\nIdentify one genuinely new experience you can have this week. New context, new skill, new conversation. The novelty itself is therapeutic.\\n\\nBe patient with the flatness. Most people report that natural reward sensitivity fully returns by week 4-6 of cessation.' },
      { id: 'a9', title: 'Handling Social Pressure to Vape', tag: 'Detox & Early Healing', content: 'Your Goal: Build a repertoire of confident, low-effort responses for social situations where you will face pressure to vape — so you are never caught unprepared.\\n\\nWhy Social Pressure is One of the Highest-Risk Triggers\\n\\nIn social settings involving vaping, three forces combine simultaneously: the presence of the substance itself (environmental cue), the social normalisation of the behaviour (permission), and the anxiety of saying no (emotional trigger). This combination is uniquely powerful.\\n\\nPrepared responses remove the split-second panic that leads to giving in.\\n\\nResponses That Work\\n\\n"No thanks, I\'ve quit." Simple, confident, finished. No explanation required.\\n\\n"I\'m good" while reaching for your drink. The action signals the conversation is over.\\n\\n"I\'m done with that" with a smile. Cheerful brevity.\\n\\n"My [lungs/throat/doctor] can\'t handle it anymore." Medicalising the reason removes the social debate.\\n\\n"I\'m testing how long I can go." Framing it as a challenge often gets respect rather than pressure.\\n\\nHandling Persistent Pressure\\n\\nMost people who push once will not push twice if your first response is calm and final. The magic phrase is a single, firm repetition: "I\'m good, honestly." After that, change the subject. If someone continues beyond that, they are the problem, not you.\\n\\nYour Next Steps\\n\\nPick two responses from above that feel natural in your voice and memorise them.\\n\\nMentally rehearse two scenarios where you might be offered a vape. Walk through exactly what you say and what you do next.\\n\\nIf certain social groups or environments represent unavoidable high-risk situations, consider reducing exposure for the first 30 days.' },
      { id: 'a10', title: 'How to Ditch Perfectionism in Recovery', tag: 'Recovery & Growth', content: 'Your Goal: Release the expectation that your quit attempt has to be perfect — and understand why perfectionism is one of the most reliable pathways back to vaping.\\n\\nThe Abstinence Violation Effect\\n\\nOne of the most documented patterns in nicotine cessation is what clinicians call the abstinence violation effect. After one slip — one drag, one pod — all-or-nothing thinking kicks in: "I\'ve already failed. I might as well continue." A single slip becomes a full relapse. This is not inevitable. It is a cognitive pattern that can be interrupted.\\n\\nWhat Recovery Actually Looks Like\\n\\nMost people who successfully quit nicotine permanently make multiple attempts. Each attempt — including the ones that did not last — builds understanding of triggers, withdrawal patterns, and what specifically makes the next attempt more likely to succeed. Imperfect attempts are data, not failure.\\n\\nBuilding Self-Compassion\\n\\nSelf-compassion is not an excuse or lowering standards. Research consistently shows that self-compassion correlates with better recovery outcomes. It reduces shame — and shame is one of the most reliable drivers of continued use. The question after a difficult moment is not "What is wrong with me?" It is "What happened, and what does my plan need to adjust?"\\n\\nYour Next Steps\\n\\nIf you slip, use the 15-minute rule: wait 15 minutes before your next decision. Most slips do not become relapses unless you let the narrative "I\'ve already failed" take hold.\\n\\nWrite down three things that have gone well in this quit attempt, even if it feels fragile. Consistency of attention to progress matters.\\n\\nSet a "good enough" standard: 3 days clean is better than 0. Celebrate proportionally.' },
      { id: 'a11', title: 'Building a Vape-Free Identity', tag: 'Recovery & Growth', content: 'Your Goal: Begin constructing a sense of yourself that is not organised around vaping — because identity change is one of the most powerful long-term predictors of sustained cessation.\\n\\nThe Identity Problem\\n\\nFor many people who vape heavily, the behaviour is woven into their sense of self — how they handle stress, how they socialise, what they do after meals, who they are during work breaks. Quitting removes a central organising behaviour. The gap that creates is real and needs to be deliberately filled.\\n\\nBecoming a Non-Smoker\\n\\nResearch on nicotine cessation consistently shows that people who identify as "a non-smoker" — rather than "a smoker trying to quit" — have significantly better long-term outcomes. Identity language is not just motivational. It changes how the brain processes decisions. "I don\'t vape" is psychologically different from "I\'m trying not to vape."\\n\\nBuilding the New Identity\\n\\nEvery choice you make that aligns with a vape-free identity reinforces it. Choosing water over reaching for the device. Walking instead of vaping after lunch. Saying "I don\'t vape anymore" instead of "I\'m trying to quit." These are small identity votes — and they compound.\\n\\nYour Next Steps\\n\\nWrite one paragraph describing who you are six months into being vape-free. Include what you do in the mornings, how you handle stress, how you feel physically. Read it once a day for a week.\\n\\nFind one community — online or in person — of people who have quit nicotine successfully. Surrounding yourself with people who have the identity you are building accelerates the process.\\n\\nChange one environmental cue this week: where you sit during breaks, what app you open when reaching for your phone. Small environmental redesign removes automatic vaping associations.' },
      { id: 'a12', title: 'How to Get Help for Nicotine Addiction', tag: 'Recovery & Growth', content: 'Your Goal: Know exactly what professional help looks like for nicotine dependency, how to access it, and why using it doubles your success rate.\\n\\nWhy Professional Support Doubles Your Odds\\n\\nNicotine replacement therapy (NRT), prescription medications, and behavioural counselling each independently improve cessation outcomes. Combined, they work even better. The evidence is unambiguous: people who use professional support to quit nicotine are significantly more likely to succeed than those who go cold turkey alone.\\n\\nTypes of Support\\n\\nNicotine replacement therapy (patches, gum, lozenges, inhalers): provides nicotine without the aerosol, managing physiological withdrawal while the behavioural habit is addressed. Available over-the-counter. Most effective when combined with counselling.\\n\\nVarenicline (Champix/Chantix): a prescription medication that partially blocks nicotine receptors and reduces cravings and withdrawal symptoms. Clinical trials show it is the most effective single pharmacological intervention for nicotine cessation.\\n\\nBupropion: an antidepressant with documented efficacy in nicotine cessation, particularly where mood-related triggers are significant.\\n\\nCessation counselling: structured behavioural support addressing trigger management, relapse prevention, and motivation. Available through your GP, NHS Stop Smoking Service, or private therapists.\\n\\nIn a Crisis\\n\\nIf withdrawal is causing severe anxiety, panic, or thoughts of self-harm, contact a healthcare provider or mental health crisis line immediately.\\n\\nUK: NHS Stop Smoking helpline: 0300 123 1044. FRANK: 0300 123 6600.\\nUS: SAMHSA National Helpline: 1-800-662-4357.\\n\\nYour Next Steps\\n\\nBook an appointment with your GP this week and tell them you want to quit vaping. Ask about NRT and prescription options.\\n\\nSearch for your local NHS Stop Smoking Service (UK) or state quitline (US). Both offer free, evidence-based support.\\n\\nDownload the NHS Quit Smoking app or Smoke Free app. Digital support tools used alongside other interventions improve outcomes further.' },
    ],
    communityPosts: [],
    achievements: [],
  },

  // ===== CHEWING TOBACCO =====
  {
    slug: 'chewing-tobacco',
    name: 'Chewing Tobacco',
    descriptor: 'Dip & snus',
    icon: 'leaf',
    accentVar: '--substance-chewing-tobacco',
    trackers: [
      {
        id: 'dip-log', name: 'Dip/Snus Use', chartType: 'bar', yAxisLabel: 'Sessions',
        insight: 'A single can of dip delivers as much nicotine as 60 cigarettes. Every pinch skipped is a meaningful reduction.',
        fields: [
          { key: 'used', label: 'Did you use tobacco today?', type: 'single-select', options: ['Yes', 'No'] },
          { key: 'pinches', label: 'Pinches/portions today', type: 'slider', min: 0, max: 20, step: 1, showIf: { field: 'used', value: 'Yes' } },
          { key: 'type', label: 'Type used', type: 'chips', options: ['Loose dip', 'Snus pouches', 'Chew', 'Snuff'], showIf: { field: 'used', value: 'Yes' } },
          { key: 'trigger', label: 'Primary trigger', type: 'chips', options: ['Habit', 'Driving', 'Sports/Work', 'Stress', 'Boredom', 'Social'], showIf: { field: 'used', value: 'Yes' } },
          { key: 'notes', label: 'Notes', type: 'textarea' },
        ],
        mockGenerator: (day) => ({
          used: day < 14 ? 'Yes' : 'No',
          pinches: day < 7 ? Math.max(0, 10 - day) : day < 14 ? Math.max(0, 4 - (day - 7)) : 0,
          type: 'Loose dip',
          trigger: ['Habit', 'Driving', 'Stress', 'Boredom'][day % 4],
          notes: '',
        }),
      },
      {
        id: 'cravings', name: 'Craving Intensity', chartType: 'line', yAxisLabel: 'Cravings',
        insight: 'Dip cravings are often oral-physical as much as nicotine-based. Tracking both dimensions helps you target the right coping tool.',
        fields: [
          { key: 'count', label: 'Number of cravings today', type: 'slider', min: 0, max: 20, step: 1 },
          { key: 'peakIntensity', label: 'Peak intensity (1-10)', type: 'slider', min: 1, max: 10, step: 1, showIf: { field: 'count', value: 0, op: '!==' } },
          { key: 'oralUrge', label: 'Oral fixation strength (1-10)', type: 'slider', min: 1, max: 10, step: 1, showIf: { field: 'count', value: 0, op: '!==' } },
          { key: 'trigger', label: 'Trigger', type: 'chips', options: ['Driving', 'Work/Sport', 'Boredom', 'Stress', 'After meals', 'Social'], showIf: { field: 'count', value: 0, op: '!==' } },
          { key: 'coping', label: 'Coping used', type: 'chips', options: ['Seeds', 'Gum', 'Toothpick', 'Mint', 'Breathing', 'Waited it out'], multiSelect: true, showIf: { field: 'count', value: 0, op: '!==' } },
          { key: 'resisted', label: 'Did you resist?', type: 'single-select', options: ['Yes', 'Partially', 'No'], showIf: { field: 'count', value: 0, op: '!==' } },
          { key: 'notes', label: 'Notes', type: 'textarea' },
        ],
        mockGenerator: (day) => ({
          count: Math.max(0, Math.round(12 - day * 0.4)),
          peakIntensity: Math.max(1, Math.round(8 - day * 0.25)),
          oralUrge: Math.max(1, Math.round(9 - day * 0.28)),
          trigger: ['Driving', 'Boredom', 'Stress', 'After meals'][day % 4],
          coping: ['Seeds'],
          resisted: day > 10 ? 'Yes' : 'Partially',
          notes: '',
        }),
      },
      {
        id: 'oral-health', name: 'Oral Health Monitor', chartType: 'area', yAxisLabel: 'Score',
        insight: 'Your gum tissue has an excellent blood supply and heals rapidly. Soreness in the first week is expected — and temporary.',
        fields: [
          { key: 'gumSoreness', label: 'Gum soreness', type: 'chips', options: ['None', 'Mild', 'Moderate', 'Severe'] },
          { key: 'mouthSores', label: 'Mouth sores present', type: 'single-select', options: ['None', '1-2', '3-5', '5+'] },
          { key: 'tasteSensitivity', label: 'Taste returning', type: 'chips', options: ['No change', 'Slight', 'Notable', 'Significantly better'] },
          { key: 'saliva', label: 'Excess saliva / dry mouth', type: 'chips', options: ['None', 'Some saliva', 'Dry mouth', 'Both'] },
          { key: 'notes', label: 'Notes', type: 'textarea' },
        ],
        mockGenerator: (day) => ({
          gumSoreness: day < 5 ? 'Moderate' : day < 10 ? 'Mild' : 'None',
          mouthSores: day < 3 ? '1-2' : 'None',
          tasteSensitivity: day < 7 ? 'No change' : day < 14 ? 'Slight' : 'Notable',
          saliva: day < 5 ? 'Some saliva' : 'None',
          notes: '',
        }),
      },
      {
        id: 'mood', name: 'Agitation & Mood', chartType: 'line', yAxisLabel: 'Level',
        insight: 'Dip delivers extremely high doses of nicotine — withdrawal agitation is proportionally intense. Intense exercise is your best tool.',
        fields: [
          { key: 'agitation', label: 'Agitation level (1-10)', type: 'slider', min: 1, max: 10, step: 1 },
          { key: 'irritability', label: 'Irritability (1-10)', type: 'slider', min: 1, max: 10, step: 1 },
          { key: 'mood', label: 'Overall mood', type: 'icon-picker', options: ['Happy', 'Calm', 'Neutral', 'Anxious', 'Sad', 'Angry'] },
          { key: 'notes', label: 'Notes', type: 'textarea' },
        ],
        mockGenerator: (day) => ({
          agitation: Math.max(1, Math.round(9 - day * 0.35)),
          irritability: Math.max(1, Math.round(8 - day * 0.3)),
          mood: day > 14 ? 'Calm' : day > 7 ? 'Neutral' : 'Anxious',
          notes: '',
        }),
      },
      {
        id: 'alternatives', name: 'Replacement Tactics', chartType: 'bar', yAxisLabel: 'Uses',
        insight: 'Every time you reach for an alternative instead of dip, you are rewiring the oral habit loop. This gets easier every day.',
        fields: [
          { key: 'seeds', label: 'Seeds used', type: 'slider', min: 0, max: 10, step: 1 },
          { key: 'gum', label: 'Pieces of gum', type: 'slider', min: 0, max: 15, step: 1 },
          { key: 'toothpick', label: 'Toothpick/mint', type: 'slider', min: 0, max: 10, step: 1 },
          { key: 'nicotineFreePouch', label: 'Nicotine-free pouches', type: 'slider', min: 0, max: 10, step: 1 },
          { key: 'notes', label: 'Notes', type: 'textarea' },
        ],
        mockGenerator: (day) => ({
          seeds: Math.min(10, Math.round(2 + day * 0.2)),
          gum: Math.min(10, Math.round(1 + day * 0.15)),
          toothpick: Math.round(day * 0.1),
          nicotineFreePouch: 0,
          notes: '',
        }),
      },
      {
        id: 'financial', name: 'Financial Savings', chartType: 'area', yAxisLabel: '$ Saved',
        insight: 'A 3-can-a-week habit costs over $1,200 per year. That is the compounding reward of quitting.',
        fields: [
          { key: 'boughtToday', label: 'Did you buy tobacco today?', type: 'single-select', options: ['Yes', 'No'] },
          { key: 'spent', label: 'Amount spent', type: 'number', showIf: { field: 'boughtToday', value: 'Yes' } },
          { key: 'baselineDaily', label: 'Your usual daily cost', type: 'number' },
          { key: 'notes', label: 'Notes', type: 'textarea' },
        ],
        mockGenerator: (day) => ({
          boughtToday: day < 7 ? 'Yes' : 'No',
          spent: day < 7 ? 3 : 0,
          baselineDaily: 3.5,
          notes: '',
        }),
      },
    ],
    calculator: {
      title: 'Nicotine Exposure & Health Risk',
      inputs: [
        { key: 'cansPerWeek', label: 'Cans/tins per week', type: 'slider', min: 0, max: 20, step: 1, defaultValue: 3 },
        { key: 'costPerCan', label: 'Cost per can ($)', type: 'slider', min: 3, max: 30, step: 1, defaultValue: 8 },
        { key: 'yearsOfUse', label: 'Years of use', type: 'slider', min: 1, max: 40, step: 1, defaultValue: 5 },
      ],
      compute: (inputs) => {
        const yearly = inputs.cansPerWeek * inputs.costPerCan * 52;
        const nicotinePerCan = 144;
        const weeklyNicotine = inputs.cansPerWeek * nicotinePerCan;
        const riskLevel = inputs.cansPerWeek > 5 || inputs.yearsOfUse > 10 ? 'High' : inputs.cansPerWeek > 2 ? 'Moderate' : 'Low';
        const gumHealingDays = 14;
        return [
          { label: 'Weekly nicotine (mg)', value: `~${Math.round(weeklyNicotine)}mg`, color: weeklyNicotine > 400 ? 'destructive' : 'accent' },
          { label: 'Yearly spend', value: `$${Math.round(yearly)}`, color: 'destructive' },
          { label: 'Oral cancer risk tier', value: riskLevel, color: riskLevel === 'High' ? 'destructive' : riskLevel === 'Moderate' ? 'accent' : 'primary' },
          { label: 'Gum healing starts', value: `Day ${gumHealingDays}` },
          { label: '1-year savings if quit', value: `$${Math.round(yearly)}`, color: 'primary' },
        ];
      },
      note: 'Oral tissue has an excellent blood supply. Healing begins within 2 weeks of quitting and continues for months.',
    },
    activities: [
      {
        id: 'dip-quiz', name: 'Chewing Tobacco Science Quiz', duration: '3 min', type: 'quiz',
        description: 'What do you actually know about what dip does to your body?',
        questions: [
          { question: 'How much nicotine does one can of dip typically contain?', options: ['Same as 5 cigarettes', 'Same as 20 cigarettes', 'Same as 60 cigarettes', 'Same as 100 cigarettes'], correctIndex: 2, explanation: 'A single can of dip delivers the nicotine equivalent of approximately 60 cigarettes. This is why dip withdrawal is often more intense than cigarette withdrawal.' },
          { question: 'When does gum tissue begin healing after quitting dip?', options: ['Immediately', 'After 2 weeks', 'After 3 months', 'After 1 year'], correctIndex: 1, explanation: 'The gums have excellent blood supply. Significant healing begins within 2 weeks, with ongoing improvement over months. Some lesions resolve completely within 6 weeks of quitting.' },
          { question: 'What is the #1 cancer risk from long-term dip use?', options: ['Lung cancer', 'Stomach cancer', 'Oral cancer', 'Throat cancer'], correctIndex: 2, explanation: 'Oral cancer (mouth, cheek, gum, lip) is the primary cancer risk from smokeless tobacco. Long-term users have a 4-6x higher risk than non-users. Quitting reduces this risk over time.' },
          { question: 'How long does the acute nicotine withdrawal from dip typically last?', options: ['24 hours', '3-5 days', '2-3 weeks', '3 months'], correctIndex: 1, explanation: 'The acute physical withdrawal from dip nicotine peaks at 24-48 hours and largely resolves within 3-5 days. Psychological cravings and oral habits persist longer and require separate attention.' },
        ],
      },
      {
        id: 'oral-bodyscan', name: 'Mouth Healing Body Scan', duration: '4 min', type: 'body-scan',
        description: 'A guided check-in with the parts of your mouth and body actively healing right now.',
        bodyZones: [
          { name: 'Gums', emoji: 'natural', prompt: 'Run your tongue gently across your gums. The tissue is rebuilding. Blood vessels that were constricted by nicotine are reopening. The soreness you feel is healing in progress.' },
          { name: 'Jaw', emoji: 'natural', prompt: 'Relax your jaw completely. Let it drop. You have been tensing these muscles around the habit for years. Right now, they can rest. Notice the release.' },
          { name: 'Throat', emoji: 'natural', prompt: 'Swallow slowly. Your throat is no longer coated in tobacco residue. Mucous membranes are clearing. Taste is beginning to sharpen.' },
          { name: 'Lungs', emoji: 'energy', prompt: 'Take a deep breath. Smokeless tobacco still affects lung health through swallowed compounds. Your lungs are receiving fewer toxins every day you are clean.' },
          { name: 'Heart', emoji: 'energy', prompt: 'Feel your chest. Your blood pressure is normalising. The nicotine-induced constriction of blood vessels is reversing. Your cardiovascular system is quieter.' },
        ],
      },
      {
        id: 'ritual-deconstruction', name: 'Ritual Replacement Cards', duration: '3 min', type: 'affirmation',
        description: 'Dipping is as much ritual as nicotine — the tap, the pinch, the placement. Swipe through new rituals to replace the old ones.',
        affirmations: [
          'When I get in the car, I reach for my water bottle — not the can. The drive is the same. The habit is different.',
          'When I finish a task, I take three deep breaths — not a pinch. The reward is the pause, not the product.',
          'When I feel bored, I pop a seed in my mouth. The oral sensation is real. The nicotine is not needed.',
          'The tap-tap-pinch ritual is gone. In its place: open the app, log how I feel, close the app. Done.',
          'My hands know what to do without dip. They remember. I am reminding them.',
          'The break I am taking does not require tobacco. The break is enough. I am enough in it.',
          'I can sit with the urge for three minutes. I have done it before. I am doing it now.',
        ],
      },
      {
        id: 'box-breathing', name: 'Box Breathing for Agitation', duration: '4 min', type: 'breathing',
        description: 'High-dose nicotine withdrawal creates intense agitation. Box breathing resets your nervous system in under 4 minutes.',
        phases: [
          { time: 4, text: 'Breathe in through your nose — 1, 2, 3, 4' },
          { time: 4, text: 'Hold — 1, 2, 3, 4. Feel your chest full.' },
          { time: 4, text: 'Breathe out through your mouth — 1, 2, 3, 4. Release the agitation.' },
          { time: 4, text: 'Hold empty — 1, 2, 3, 4. Stillness.' },
          { time: 4, text: 'Breathe in — 1, 2, 3, 4. You are in control of this.' },
          { time: 4, text: 'Hold — 1, 2, 3, 4.' },
          { time: 4, text: 'Breathe out — 1, 2, 3, 4. Slower. Calmer.' },
          { time: 4, text: 'Hold — 1, 2, 3, 4. The agitation is less than it was 2 minutes ago.' },
          { time: 4, text: 'One more round. In — 1, 2, 3, 4.' },
          { time: 4, text: 'Hold — 1, 2, 3, 4.' },
          { time: 4, text: 'Out — 1, 2, 3, 4.' },
          { time: 4, text: 'Hold — 1, 2, 3, 4. Done. You made it through the wave.' },
        ],
      },
    ],
    articles: [
      { id: 'a1', title: 'Why Quit Chewing Tobacco?', tag: 'Awareness & Readiness', content: 'Your Goal: Discover a clear, personal reason for starting this journey — one that comes from inside you, not from fear or external pressure.\\n\\nThe Underestimated Addiction\\n\\nChewing tobacco is one of the least publicly discussed and most underestimated forms of nicotine dependency. Unlike smoking, there is no visible smoke, no smell that fills rooms, no social stigma that motivates change. This invisibility makes it easier to continue — and harder to take seriously as a problem.\\n\\nBut the biology is unambiguous. A single can of dip delivers as much nicotine as 60 cigarettes. The nicotine is absorbed through mucous membranes with a slower but longer-lasting profile than smoking, creating a sustained dependency that is often described by quitters as harder to break than cigarettes.\\n\\nWhy People Quit\\n\\nThe reasons are as varied as the people who quit. Some are motivated by oral health: noticing white patches (leukoplakia) in the mouth, bleeding gums, or the taste of blood. Some receive medical warnings from dentists or doctors. Some are motivated by the financial cost — a moderate habit costs over $1,000 per year. Some see a family member diagnosed with oral cancer. Some simply decide, on a specific day, that they have given enough of their life to this thing.\\n\\nAny one of these reasons is valid. What matters is that the reason is genuinely yours — not borrowed from someone else, not performance, but real.\\n\\nFinding Your Why\\n\\nThe research on motivation and recovery is consistent: when the reason for change is genuinely your own, the prefrontal cortex — the planning, values-reasoning part of your brain — activates. This is what translates motivation into sustained behaviour change. External pressure starts the engine; internal motivation keeps it running.\\n\\nYour Next Steps\\n\\nWrite down your top three reasons for quitting in a place you will see daily. The physical act of writing is not ceremonial — it creates cognitive commitment.\\n\\nComplete the Five Whys exercise: ask "why do I want to quit?" then ask "why does that matter?" five times in sequence. The fifth answer is usually where your real motivation lives.\\n\\nMake a dentist appointment this week. Seeing your oral health assessed by a professional creates concrete, personal stakes that abstract reasons cannot.' },
      { id: 'a2', title: 'The Signs of a Dipping Problem', tag: 'Awareness & Readiness', content: 'Your Goal: Recognise the specific patterns that indicate your dip habit has moved from choice to dependency.\\n\\nThe Diagnostic Gap\\n\\nSmokeless tobacco dependency is clinically the same as any other nicotine dependency — it meets the DSM-5 criteria for Substance Use Disorder. But because the cultural conversation around addiction focuses on substances with visible social impact, many heavy dippers do not think of themselves as addicted. They think of it as a habit, a ritual, something athletes and blue-collar workers do.\\n\\nThe clinical picture does not care about the cultural framing. The Signs Worth Taking Seriously:\\n\\nYou dip more than you planned. A "one-pinch-after-work" habit became all-day use. You have tried to cut down and found it surprisingly difficult. You feel noticeably worse — irritable, foggy, anxious — within a few hours without dip. You plan your day around access to dip. You use in situations you previously would not have — during meals, around children, in contexts where you feel some shame about it.\\n\\nTolerance is a defining marker: if you need more dip to get the same effect, or have moved to stronger products, your body has physiologically adapted.\\n\\nWhy This Matters\\n\\nThe clinical recognition that this is dependency, not just a preference, is important for two reasons. First, it means that quitting is genuinely difficult — the difficulty is real and physiological, not a sign of weakness. Second, it means that professional support is appropriate and evidence-based, not excessive.\\n\\nYour Next Steps\\n\\nTake the DSM-5 assessment in this app. See where you actually fall on the clinical criteria.\\n\\nTell your dentist about your dipping habit if you have not. Dental professionals are skilled at supporting cessation and can monitor your oral health during the process.\\n\\nWrite down the three signs from this article that match your own experience most closely.' },
      { id: 'a3', title: 'Mapping Your Dip Triggers', tag: 'Awareness & Readiness', content: 'Your Goal: Build a personalised map of when, where, and why you reach for dip — because precision beats willpower every time.\\n\\nThe Ritual Nature of Dipping\\n\\nChewing tobacco use is often more ritualised than smoking. The tap on the can. The pinch. The placement. The spit bottle. These physical sequences are conditioned responses — deeply encoded behavioural programs that activate automatically in specific contexts. This is why quitting dip requires addressing the physical ritual as much as the nicotine.\\n\\nCommon Trigger Clusters\\n\\nDriving: for many dippers, the car is the strongest trigger — a private space with habitual association to dipping. Removing the tobacco from the car and replacing it with seeds or gum is one of the most effective single interventions.\\n\\nSports and physical work: dipping has strong cultural associations with baseball, construction, farming, and manual labour. The identity association ("this is what people like me do") is itself a powerful trigger.\\n\\nBoredom and long tasks: dip provides oral stimulation during monotonous work. Understanding this means finding legitimate oral replacements for these windows.\\n\\nAfter meals: the post-meal dip is among the most habitual. It is less about nicotine and more about the ritual. Breaking this one by inserting a deliberate replacement immediately after eating is highly effective.\\n\\nBuilding Your Trigger Map\\n\\nFor 48 hours, every time you notice an urge, note: where you are, what you are doing, what you feel, and the intensity from 1-10. You will see 3-5 clear patterns emerge.\\n\\nYour Next Steps\\n\\nIdentify your single highest-risk trigger and design a specific alternative for it this week.\\n\\nIf driving is a major trigger, remove all tobacco from your vehicle and replace it with your chosen alternative before you next drive.\\n\\nTell one person who spends time with you about your quit attempt. Social accountability is one of the most consistent predictors of success.' },
      { id: 'a4', title: 'Breaking the Physical Ritual', tag: 'Awareness & Readiness', content: 'Your Goal: Understand how the physical ritual of dipping operates as a separate habit from nicotine dependency — and learn to dismantle it deliberately.\\n\\nTwo Dependencies, Not One\\n\\nMost people who quit dip focus entirely on the nicotine. But the physical ritual — the tap, the pinch, the placement, the feel of the product in the mouth, even the spit — is a separate conditioned habit that persists even after nicotine withdrawal resolves. Many quitters who make it through the first week of physical withdrawal relapse to the ritual, not the nicotine.\\n\\nThe Habit Loop\\n\\nEvery dip follows the same structure: cue (the trigger) → routine (the ritual) → reward (the nicotine + oral satisfaction). To break the habit, you need to keep the cue and the reward structure but replace the routine. This is what replacement products — seeds, toothpicks, nicotine-free pouches, herbal dip — are actually doing. They are preserving the habit loop while removing the harmful substance.\\n\\nThe Dissociation Strategy\\n\\nOne powerful approach is deliberate dissociation: every time you notice the pull toward the dipping ritual, narrate it explicitly. "My brain is running the dipping program. I notice the tap-pinch-place sequence wants to happen. I am choosing not to run it." This narration engages the prefrontal cortex and interrupts the automatic execution of the habit.\\n\\nYour Next Steps\\n\\nIdentify which part of the dipping ritual is strongest for you — the placement, the spit, the hold — and design a specific replacement for that element.\\n\\nUse nicotine-free herbal snuff or pouches as a bridge product during the first two weeks. Many quitters report that having a replacement that preserves the physical routine dramatically reduces relapse risk.\\n\\nTap the table three times with your finger before you would have tapped the can. Redirect the specific motor pattern to a neutral action.' },
      { id: 'a5', title: 'The Dip Nicotine Detox Timeline', tag: 'Detox & Early Healing', content: 'Your Goal: Know exactly what is happening in your body during the nicotine detox from chewing tobacco — so you can prepare, normalise, and move through it.\\n\\nWhy Dip Withdrawal Is Different\\n\\nChewing tobacco delivers nicotine with a different pharmacokinetic profile than smoking. It is absorbed more slowly but at very high doses, and the sustained blood nicotine levels mean that withdrawal, when it comes, is intense. Many heavy dippers report that their withdrawal was more severe than friends who quit smoking — and the clinical evidence supports this.\\n\\nThe Timeline\\n\\nHours 1-6: Blood nicotine levels begin dropping. The first signs of withdrawal begin for many heavy users: irritability, restlessness, a persistent oral craving. Many people reach for the can within hours without realising why.\\n\\nHours 12-24: Nicotine levels have dropped significantly. Withdrawal symptoms peak in intensity for most people: agitation, irritability, difficulty concentrating, intense oral cravings, anxiety, and headaches. This is the hardest window. Having a plan for this period specifically is essential.\\n\\nDays 2-5: The acute physical nicotine withdrawal largely resolves. Many people feel a turning point around day 3-5 where the physical intensity diminishes significantly. Oral cravings persist because the behavioural habit remains active, but the physiological drive is substantially reduced.\\n\\nWeeks 2-4: Psychological cravings and situational triggers remain active. This is where most relapses occur — not in the acute withdrawal, but in the weeks after when vigilance drops and a trigger situation is encountered without a plan.\\n\\nWhat Helps\\n\\nPhysical activity is the single most effective non-pharmacological tool during acute withdrawal. A 20-minute walk or intense exercise reduces acute irritability and craving intensity measurably.\\n\\nYour Next Steps\\n\\nPlan your detox period: tell people around you what to expect and ask for patience. Reduce optional stressors for the first 5 days.\\n\\nHave physical replacement products ready before your quit day. Starting without alternatives in place is one of the most common avoidable failure points.\\n\\nIf withdrawal agitation is severe, speak to your doctor about NRT options. Nicotine patches provide steady blood levels that reduce peak withdrawal intensity while you address the behavioural habit.' },
      { id: 'a6', title: 'Oral Health: What Happens When You Quit', tag: 'Detox & Early Healing', content: 'Your Goal: Understand the specific oral health changes that happen after quitting dip — and what a realistic healing timeline looks like.\\n\\nWhat Dip Does to Your Mouth\\n\\nChewing tobacco contains over 28 known carcinogens that come into direct contact with oral tissue every time you dip. The sustained contact with these compounds causes several specific changes: leukoplakia (white patches), gingival recession, increased risk of tooth decay, and elevated oral cancer risk. Heavy long-term users can also develop fibrosis — thickening and stiffening of the mucosal tissue.\\n\\nThe Healing Timeline\\n\\nDay 1-7: The gums may be sore as they begin rehydrating and rebuilding tissue that had adapted to the constant presence of tobacco. Some people experience increased saliva production as the mouth normalises. White patches (if present) typically begin softening.\\n\\nWeeks 2-4: Gum tissue is actively healing. Blood supply improves as nicotine-induced vasoconstriction resolves. Taste sensitivity begins returning — many quitters are surprised by how much flavour they had lost.\\n\\nMonth 1-3: Leukoplakia often significantly resolves. Dentists can assess whether patches have completely resolved or require further monitoring. Gum recession may or may not be reversible depending on severity.\\n\\nLong-Term: Oral cancer risk decreases over years of abstinence, though it does not return to baseline for many years with long-term use. This makes early cessation critical.\\n\\nYour Next Steps\\n\\nBook a dental appointment specifically to have your oral health assessed now. Getting a baseline is motivating and medically important.\\n\\nAsk your dentist about leukoplakia screening. Early identification and monitoring matters.\\n\\nStart basic oral hygiene immediately: twice-daily brushing, daily flossing, alcohol-free mouthwash. Your healing gums need gentle, consistent care.' },
      { id: 'a7', title: 'Managing Extreme Irritability', tag: 'Detox & Early Healing', content: 'Your Goal: Understand why dip withdrawal creates intense irritability and agitation — and build a toolkit for managing it without returning to tobacco.\\n\\nWhy Dip Withdrawal Agitation Is So Intense\\n\\nNicotine from chewing tobacco is absorbed at high doses over a sustained period. When this high baseline is removed, the nervous system is suddenly understimulated. The brain\'s dopamine and serotonin systems are disrupted. The result is withdrawal agitation that is often described by quitters as among the worst emotional experiences they have had.\\n\\nThis is biology, not weakness. The people around you need to know this — and so do you.\\n\\nTools That Work\\n\\nPhysical exercise: intense physical activity is the most effective acute intervention for nicotine withdrawal agitation. The mechanism is direct — exercise increases dopamine and endorphin levels, partially compensating for the nicotine-driven neurochemical drop. A 20-minute run or HIIT session can take severe agitation to manageable within 30 minutes.\\n\\nCold water: cold immersion — even a cold shower — activates the vagus nerve and parasympathetic nervous system, rapidly reducing agitation. This is not a cliché; it is physiology.\\n\\nVent appropriately: tell someone close to you what is happening. Having a witness to the difficulty reduces shame and provides accountability. Ask them not to offer tobacco as a solution.\\n\\nStructure: unstructured time is agitation\'s best environment. Filling the first week with activity — planned tasks, exercise, social engagements — dramatically reduces the time available for agitation to build.\\n\\nYour Next Steps\\n\\nWarn the people you live with about what to expect from you in the first week. Ask for patience and tell them specifically what would help.\\n\\nPlan one physical activity for each of the first seven days. Put it in your calendar. Treat it as a medical appointment.\\n\\nIf agitation is severe enough to affect your safety, work, or relationships, speak to your doctor. Short-term pharmacological support is appropriate.' },
      { id: 'a8', title: 'Alternative Oral Fixations That Work', tag: 'Detox & Early Healing', content: 'Your Goal: Build a practical toolkit of oral replacements that satisfy the physical habit of dipping without nicotine — and understand why this matters as much as managing withdrawal.\\n\\nThe Two-Addiction Problem\\n\\nChewing tobacco creates two simultaneous dependencies that need to be addressed: nicotine dependency and the oral-physical habit. Many quitters handle the nicotine through patches or willpower but fail to address the oral habit — then relapse when a situational trigger activates the physical craving with no substitute in place.\\n\\nOral Replacement Options\\n\\nSunflower seeds in the shell: the most popular replacement for many former dippers. The shelling action, the placement in the mouth, and the mild flavour release address the physical routine effectively. They are also absorbed slowly, giving extended oral engagement.\\n\\nToothpicks and mint sticks: simple, discrete, and effective for mild oral cravings. Cinnamon toothpicks provide additional flavour stimulation.\\n\\nNicotine-free herbal dip (Smokey Mountain, Black Buffalo): preserves the complete physical ritual including texture and spit, removing only the nicotine and carcinogens. Clinical evidence suggests this category significantly reduces relapse risk in the first month.\\n\\nGum: the mechanics are different from dipping but provides oral stimulation. Sugar-free gum avoids the blood sugar spike that can increase cravings.\\n\\nFresh vegetables and fibrous food: carrots, celery, and similar foods provide extended chewing engagement during meals or as snacks.\\n\\nThe Replacement Protocol\\n\\nHave your chosen replacement physically present in the same location your dip used to be — the same pocket, the same car cupholder, the same desk drawer. Accessibility at the moment of craving is everything.\\n\\nYour Next Steps\\n\\nBuy your primary oral replacement before your quit date. Starting day one without alternatives in place is one of the most common failure points.\\n\\nTest two or three options and find what works best for your specific triggers. The driving replacement might be different from the after-meal replacement.\\n\\nTell the people around you that you are using replacements and to treat them as medical aids, not weakness.' },
      { id: 'a9', title: 'Staying Clean Long-Term', tag: 'Recovery & Growth', content: 'Your Goal: Build the practices and mindset that make staying free from dip genuinely sustainable — not just an ongoing white-knuckle effort.\\n\\nThe Long Tail of Dip Cravings\\n\\nNicotine cravings from chewing tobacco can recur for months after the acute withdrawal resolves. This is not a sign that recovery is failing — it is normal neurology. The brain retains associations between cues and cravings long after the physical dependency resolves. A baseball game, a construction site smell, a long drive — these contextual cues can activate a craving even a year into abstinence.\\n\\nWhat Makes Long-Term Recovery Different\\n\\nEarly recovery is largely about surviving acute withdrawal and building initial trigger management. Long-term recovery is about gradually reducing the power of those cues through consistent non-use — a process called extinction — while building a life where dip genuinely has less and less appeal.\\n\\nThe people who stay clean long-term share several practices: they remain alert to complacency, they maintain at least one accountability relationship, they continue using replacement products for longer than they think necessary, and they treat high-risk situations as rehearsed events rather than improvised tests.\\n\\nThe Complacency Window\\n\\nOne of the most common relapse patterns in long-term smokeless tobacco cessation is what researchers call the "all clear" error: after months of success, a person decides they can have one at a special occasion, or they can handle being around it, or the habits are far enough behind them that a test is safe. This reasoning is usually not accurate. The cue-to-craving association persists significantly longer than the conscious awareness of craving does.\\n\\nYour Next Steps\\n\\nCommit to your oral replacement habits for at least 6 months, not weeks. The goal is complete extinction of the cue-craving association.\\n\\nIdentify your highest relapse risk situation — the one place or activity most associated with dipping — and have a specific plan for it every time.\\n\\nTell at least one person about your ongoing abstinence. Naming it creates accountability without requiring a support group.' },
      { id: 'a10', title: 'Building a New Relationship with Stress', tag: 'Recovery & Growth', content: 'Your Goal: Develop genuine coping tools for the stress that dip used to manage — so that stress is no longer a direct path back to tobacco.\\n\\nWhy Dip and Stress Are Linked\\n\\nFor many heavy dippers, the substance served as a consistent stress management tool. It provided a reliable, rapid-acting chemical response to stress — a 10-minute nicotine dose that genuinely reduced cortisol levels temporarily and created a sense of calm. This was not imaginary. Nicotine does reduce acute stress symptoms.\\n\\nThe problem: it also builds dependency, making the baseline stress level without nicotine higher than it would otherwise be. You were managing stress you were partly causing.\\n\\nBuilding Real Stress Management\\n\\nPhysical exercise is the most evidence-based stress management intervention available without a prescription. 20-30 minutes of moderate aerobic exercise reduces cortisol, increases endorphins, and provides the regulatory state that nicotine was artificially creating — without dependency.\\n\\nBreathing techniques activate the parasympathetic nervous system within minutes. Box breathing (4-4-4-4) specifically reduces cortisol measurably in controlled studies.\\n\\nCognitive reframing: stress responses are partly based on how we appraise situations. Learning to ask "Is this threat real?" "Is this within my control?" "What is actually required here?" reduces the intensity of the stress response before it reaches the threshold that triggers dip craving.\\n\\nSocial support: human connection is one of the most powerful stress buffers available. The research is consistent: people with strong social support have lower cortisol levels and faster recovery from stressors.\\n\\nYour Next Steps\\n\\nIdentify your current stress management toolkit. If dip was the primary tool, this is a genuine gap that needs filling — not a moral problem.\\n\\nChoose one new stress tool to practise daily for two weeks. Pick something accessible: 10-minute walks, a breathing app, or daily brief check-ins with someone you trust.\\n\\nNotice when stress appears and pause before reaching for any substance — including food or caffeine. The pause itself is building the circuit break you need.' },
      { id: 'a11', title: 'Relationships and Quitting Dip', tag: 'Recovery & Growth', content: 'Your Goal: Understand how your dipping habit affected your relationships and how to navigate the social dimension of quitting.\\n\\nThe Social Landscape of Dipping\\n\\nChewing tobacco is often deeply embedded in social identity — in athletic teams, in working cultures, in friendships built around shared use. Quitting can feel like leaving a community or departing from a shared identity. This is a real tension, not an excuse.\\n\\nNavigating Your Social Circle\\n\\nSome relationships in your life will fully support your quit. Others will be neutral. Some — particularly those where dipping is a shared activity or part of the group identity — may subtly or actively resist your change. Recognising this in advance allows you to prepare rather than be surprised.\\n\\nFor the first 30 days, reducing exposure to contexts where dip is actively present is not avoidance — it is strategy. Your willpower is a limited resource. Don\'t spend it on preventable exposure.\\n\\nHaving a Clear Position\\n\\nThe most effective social strategy for quitting is a clear, confident, and repeated statement of your position: "I\'m done with dip." Not "I\'m trying to quit." Not "I\'m taking a break." The identity statement is more powerful than the temporal one, because it removes the door to negotiation.\\n\\nWhen others push back — as they sometimes do — you don\'t owe them an explanation. "It\'s not for me anymore" is sufficient.\\n\\nYour Next Steps\\n\\nTell the three people you spend the most time with that you are quitting dip. Ask for their support in one specific way each.\\n\\nIf your social circle is heavily tied to dipping culture, identify at least one relationship or activity outside that context to invest in. You are building social capital in a new direction.\\n\\nIf relationships become a pressure source rather than a support source, speak to a counsellor or your doctor. The social dimension of tobacco cessation is a legitimate clinical concern.' },
      { id: 'a12', title: 'Getting Professional Help for Tobacco Addiction', tag: 'Recovery & Growth', content: 'Your Goal: Know exactly what professional support looks like for smokeless tobacco cessation — and understand why using it significantly improves your chances.\\n\\nWhy Professional Support Matters\\n\\nThe quit-alone-with-willpower approach to nicotine cessation is the least effective approach available. Research consistently shows that professional support — pharmacological, behavioural, or both — significantly improves cessation outcomes. For smokeless tobacco specifically, the research is clear: NRT and behavioural counselling together produce substantially better results than either alone.\\n\\nTypes of Support\\n\\nNicotine replacement therapy (NRT): patches are particularly effective for dip cessation because they provide a steady, lower blood nicotine level that reduces withdrawal intensity without perpetuating the oral habit. Nicotine gum provides some oral engagement. Both are available over-the-counter.\\n\\nPrescription medication: Varenicline (Champix/Chantix) and bupropion are both supported by clinical evidence for smokeless tobacco cessation specifically. Your GP can prescribe them and provide guidance on timing.\\n\\nDental monitoring: your dentist is a key professional partner during cessation. They can monitor oral tissue healing, identify any lesions that need investigation, and provide evidence-based motivation.\\n\\nCessation counselling: brief structured counselling (even 5-10 minutes per session with a trained professional) significantly improves outcomes. Ask your GP about referral to a cessation service.\\n\\nIn a Crisis\\n\\nIf withdrawal is causing severe psychological symptoms, or if you have oral lesions that have not resolved, seek medical attention.\\n\\nUK: NHS Stop Smoking Service: 0300 123 1044. FRANK: 0300 123 6600.\\nUS: SAMHSA National Helpline: 1-800-662-4357.\\n\\nYour Next Steps\\n\\nBook an appointment with your GP this week. Tell them about your dipping history and ask about cessation support options.\\n\\nMake a dental appointment. Your oral health needs professional monitoring during this process.\\n\\nSearch for your local NHS Stop Smoking Service or state tobacco quitline. Both offer free professional support that significantly improves your odds.' },
    ],
    communityPosts: [],
    achievements: [],
  },

  // ===== COCAINE =====
  {
    slug: 'cocaine',
    name: 'Cocaine',
    descriptor: 'Powder & crack',
    icon: 'sparkles',
    accentVar: '--substance-cocaine',
    trackers: [
      {
        id: 'use-log', name: 'Use Log', chartType: 'bar', yAxisLabel: 'Uses',
        insight: 'Each day without cocaine gives your cardiovascular system time to heal from the intense strain the drug places on your heart and arteries.',
        fields: [
          { key: 'used', label: 'Did you use cocaine today?', type: 'single-select', options: ['Yes', 'No'] },
          { key: 'amount', label: 'Estimated amount (grams)', type: 'slider', min: 0, max: 10, step: 0.1, showIf: { field: 'used', value: 'Yes' } },
          { key: 'method', label: 'Method', type: 'chips', options: ['Insufflated', 'Smoked (crack)', 'IV', 'Other'], showIf: { field: 'used', value: 'Yes' } },
          { key: 'trigger', label: 'Trigger', type: 'chips', options: ['Social/Party', 'Alcohol', 'Stress', 'Boredom', 'Compulsion', 'Emotional pain'], showIf: { field: 'used', value: 'Yes' } },
          { key: 'notes', label: 'Notes', type: 'textarea' },
        ],
        mockGenerator: (day) => ({
          used: day < 10 ? (day % 3 === 0 ? 'Yes' : 'No') : 'No',
          amount: day < 10 && day % 3 === 0 ? +(2 - day * 0.15).toFixed(1) : 0,
          method: 'Insufflated',
          trigger: ['Social/Party', 'Alcohol', 'Stress', 'Boredom'][day % 4],
          notes: '',
        }),
      },
      {
        id: 'cravings', name: 'Craving Spikes', chartType: 'line', yAxisLabel: 'Intensity',
        insight: 'Cocaine cravings are among the most intense of any substance — but they are also fast. Most peak and pass within 20 minutes if you do not feed them.',
        fields: [
          { key: 'count', label: 'Number of cravings today', type: 'slider', min: 0, max: 15, step: 1 },
          { key: 'peakIntensity', label: 'Peak intensity (1-10)', type: 'slider', min: 1, max: 10, step: 1, showIf: { field: 'count', value: 0, op: '!==' } },
          { key: 'trigger', label: 'Trigger', type: 'chips', options: ['Alcohol', 'Social event', 'Boredom', 'Financial stress', 'Specific people', 'Emotional pain'], showIf: { field: 'count', value: 0, op: '!==' } },
          { key: 'coping', label: 'Coping used', type: 'chips', options: ['Exercise', 'Called someone', 'Breathing', 'Removed myself', 'Grounding', 'Waited it out'], multiSelect: true, showIf: { field: 'count', value: 0, op: '!==' } },
          { key: 'resisted', label: 'Did you resist?', type: 'single-select', options: ['Yes', 'Partially', 'No'], showIf: { field: 'count', value: 0, op: '!==' } },
          { key: 'notes', label: 'Notes', type: 'textarea' },
        ],
        mockGenerator: (day) => ({
          count: Math.max(0, Math.round(10 - day * 0.35)),
          peakIntensity: Math.max(1, Math.round(9 - day * 0.28)),
          trigger: ['Alcohol', 'Social event', 'Boredom', 'Financial stress'][day % 4],
          coping: ['Exercise'],
          resisted: day > 12 ? 'Yes' : day > 5 ? 'Partially' : 'No',
          notes: '',
        }),
      },
      {
        id: 'mood-depression', name: 'Mood & Anhedonia', chartType: 'area', yAxisLabel: 'Score',
        insight: 'Post-cocaine depression is chemical, not character. Your dopamine system is rebuilding itself. The flatness will lift.',
        fields: [
          { key: 'mood', label: 'Overall mood', type: 'icon-picker', options: ['Happy', 'Calm', 'Neutral', 'Anxious', 'Sad', 'Angry'] },
          { key: 'depression', label: 'Depression level (1-10)', type: 'slider', min: 1, max: 10, step: 1 },
          { key: 'anhedonia', label: 'Inability to feel pleasure (1-10)', type: 'slider', min: 1, max: 10, step: 1 },
          { key: 'anxiety', label: 'Anxiety level (1-10)', type: 'slider', min: 1, max: 10, step: 1 },
          { key: 'paranoia', label: 'Paranoia today', type: 'chips', options: ['None', 'Mild', 'Moderate', 'Severe'] },
          { key: 'notes', label: 'Notes', type: 'textarea' },
        ],
        mockGenerator: (day) => ({
          mood: day > 14 ? 'Neutral' : day > 7 ? 'Sad' : 'Sad',
          depression: Math.max(1, Math.round(8 - day * 0.3)),
          anhedonia: Math.max(1, Math.round(9 - day * 0.32)),
          anxiety: Math.max(1, Math.round(7 - day * 0.25)),
          paranoia: day < 3 ? 'Moderate' : day < 7 ? 'Mild' : 'None',
          notes: '',
        }),
      },
      {
        id: 'cardiovascular', name: 'Cardiovascular Health', chartType: 'line', yAxisLabel: 'BPM',
        insight: 'Your resting heart rate is the most direct measurable sign of cardiovascular recovery. Watch it trend toward normal over the coming weeks.',
        fields: [
          { key: 'restingHR', label: 'Resting heart rate (BPM)', type: 'slider', min: 40, max: 130, step: 1 },
          { key: 'chestDiscomfort', label: 'Chest discomfort', type: 'chips', options: ['None', 'Mild', 'Moderate', 'Seek medical help'] },
          { key: 'bloodPressure', label: 'Blood pressure reading', type: 'chips', options: ['Not measured', 'Normal', 'Elevated', 'High'] },
          { key: 'notes', label: 'Notes', type: 'textarea' },
        ],
        mockGenerator: (day) => ({
          restingHR: Math.max(60, Math.round(90 - day * 1.2)),
          chestDiscomfort: day < 3 ? 'Mild' : 'None',
          bloodPressure: day < 5 ? 'Elevated' : 'Normal',
          notes: '',
        }),
      },
      {
        id: 'sleep-restoration', name: 'Sleep Restoration', chartType: 'area', yAxisLabel: 'Score',
        insight: 'Cocaine severely disrupts sleep architecture. Each sober night gives your nervous system more time to rebuild natural sleep rhythms.',
        fields: [
          { key: 'hoursSlept', label: 'Hours slept', type: 'slider', min: 0, max: 14, step: 0.5 },
          { key: 'sleepQuality', label: 'Sleep quality', type: 'chips', options: ['Very poor', 'Poor', 'Fair', 'Good', 'Excellent'] },
          { key: 'racingThoughts', label: 'Racing thoughts at night', type: 'chips', options: ['None', 'Some', 'Significant', 'Severe'] },
          { key: 'nightmares', label: 'Nightmares', type: 'single-select', options: ['None', 'Mild', 'Vivid'] },
          { key: 'notes', label: 'Notes', type: 'textarea' },
        ],
        mockGenerator: (day) => ({
          hoursSlept: Math.min(9, +(3 + day * 0.22).toFixed(1)),
          sleepQuality: day > 14 ? 'Fair' : day > 7 ? 'Poor' : 'Very poor',
          racingThoughts: day < 5 ? 'Significant' : day < 14 ? 'Some' : 'None',
          nightmares: day < 7 ? 'Vivid' : day < 14 ? 'Mild' : 'None',
          notes: '',
        }),
      },
      {
        id: 'financial', name: 'Financial Recovery', chartType: 'bar', yAxisLabel: '$ Saved',
        insight: 'Cocaine habits commonly cost $500–$2,000+ per month. Making the financial damage visible is one of the most motivating tools in recovery.',
        fields: [
          { key: 'usedToday', label: 'Did you spend on cocaine today?', type: 'single-select', options: ['Yes', 'No'] },
          { key: 'spent', label: 'Amount spent', type: 'number', showIf: { field: 'usedToday', value: 'Yes' } },
          { key: 'baselineDaily', label: 'Usual daily spend (baseline)', type: 'number' },
          { key: 'notes', label: 'Notes', type: 'textarea' },
        ],
        mockGenerator: (day) => ({
          usedToday: day < 10 && day % 3 === 0 ? 'Yes' : 'No',
          spent: day < 10 && day % 3 === 0 ? 150 : 0,
          baselineDaily: 100,
          notes: '',
        }),
      },
    ],
    calculator: {
      title: 'Financial & Cardiovascular Impact',
      inputs: [
        { key: 'gramsPerWeek', label: 'Grams per week', type: 'slider', min: 0, max: 30, step: 0.5, defaultValue: 2 },
        { key: 'costPerGram', label: 'Cost per gram ($)', type: 'slider', min: 20, max: 300, step: 5, defaultValue: 80 },
        { key: 'yearsOfUse', label: 'Years of regular use', type: 'slider', min: 1, max: 20, step: 1, defaultValue: 3 },
      ],
      compute: (inputs) => {
        const weekly = inputs.gramsPerWeek * inputs.costPerGram;
        const yearly = weekly * 52;
        const totalSpent = yearly * inputs.yearsOfUse;
        const cvRisk = inputs.gramsPerWeek > 5 || inputs.yearsOfUse > 5 ? 'High' : inputs.gramsPerWeek > 2 ? 'Moderate' : 'Low-Moderate';
        const recoveryWeeks = Math.round(inputs.yearsOfUse * 2 + inputs.gramsPerWeek * 1.5);
        return [
          { label: 'Weekly spend', value: `$${Math.round(weekly)}` },
          { label: 'Yearly spend', value: `$${Math.round(yearly)}`, color: 'destructive' },
          { label: 'Estimated total spent', value: `$${Math.round(totalSpent).toLocaleString()}`, color: 'destructive' },
          { label: 'Cardiovascular risk', value: cvRisk, color: cvRisk === 'High' ? 'destructive' : 'accent' },
          { label: 'Significant recovery at', value: `~${recoveryWeeks} weeks clean` },
          { label: '1-year savings if quit', value: `$${Math.round(yearly).toLocaleString()}`, color: 'primary' },
        ];
      },
      note: 'Cocaine causes acute cardiovascular events at any dose. The risk of heart attack and stroke is elevated for 24+ hours after each use — even in young, healthy users.',
    },
    activities: [
      {
        id: 'cocaine-quiz', name: 'Cocaine & the Brain Quiz', duration: '3 min', type: 'quiz',
        description: 'What does cocaine actually do to your brain and body? Test your understanding.',
        questions: [
          { question: 'How does cocaine primarily cause its euphoric effect?', options: ['Releases serotonin', 'Blocks dopamine reuptake', 'Increases GABA', 'Stimulates adrenaline only'], correctIndex: 1, explanation: 'Cocaine blocks the dopamine transporter, preventing dopamine reuptake and flooding the synapse with dopamine. This creates 3-5x normal dopamine levels — the source of the intense but short-lived euphoria.' },
          { question: 'What is PAWS in cocaine recovery?', options: ['Post-Acute Withdrawal Syndrome', 'Physical Abstinence Warning Signal', 'Prolonged Anxiety Withdrawal Symptom', 'Post-Addiction Wellness Stage'], correctIndex: 0, explanation: 'Post-Acute Withdrawal Syndrome (PAWS) refers to waves of depression, anxiety, and craving that can recur for months after the acute withdrawal. It is caused by the slow normalisation of dopamine system function.' },
          { question: 'What is the #1 trigger for cocaine relapse?', options: ['Stress', 'Boredom', 'Alcohol', 'Social media'], correctIndex: 2, explanation: 'Alcohol is consistently identified as the single most common relapse trigger for cocaine users. Alcohol lowers inhibitions and activates the brain regions associated with cocaine use. Many successful cocaine recoveries require addressing both simultaneously.' },
          { question: 'When does cocaine dopamine system recovery become measurable?', options: ['1 week', '30-90 days', '1 year', '5 years'], correctIndex: 1, explanation: 'PET scan studies show measurable dopamine system recovery beginning at 30-90 days of abstinence, with ongoing improvement through 12-18 months. Complete recovery is possible for most users.' },
        ],
      },
      {
        id: 'tape-forward', name: 'Play the Tape Forward', duration: '5 min', type: 'visualization',
        description: 'A powerful cognitive tool for acute cravings: visualise the full sequence of using right now — not just the high, but what follows.',
        scenes: [
          { text: 'The craving is here. It feels like certainty — like using is inevitable and the best possible option. This is the dopamine prediction error speaking. It is not telling the truth about what comes next.', emoji: 'natural', duration: 12 },
          { text: 'The use: the first line. The brief, intense rush. Your heart rate climbing. The feeling of capability and confidence — all of it borrowed from your future self.', emoji: 'energy', duration: 10 },
          { text: 'The compulsion: within 20 minutes, the high is fading and the craving for more is already larger than the one you just satisfied. This is how cocaine works. One is never one.', emoji: 'natural', duration: 10 },
          { text: 'The crash: hours later, the dopamine floor has dropped further than it was before you used. Depression, paranoia, self-loathing. Your body paying back the loan with interest.', emoji: 'mood', duration: 10 },
          { text: 'The alternative: you chose not to use. The craving passes — it always does. You go to sleep tonight with your brain a little more healed than yesterday. Tomorrow starts from a better place.', emoji: 'energy', duration: 12 },
        ],
      },
      {
        id: 'dopamine-recovery', name: 'Dopamine Healing Journey', duration: '5 min', type: 'visualization',
        description: 'A guided journey through your brain\'s dopamine system recovering — from depletion to restoration.',
        scenes: [
          { text: 'Day 1-3: Your dopamine receptors are dramatically depleted. Nothing feels good. The flatness is severe. This is cocaine anhedonia — the neurological cost of the artificial high. It is temporary.', emoji: 'natural', duration: 12 },
          { text: 'Week 1-2: Your brain is beginning to produce dopamine naturally again. The production is slow and cautious — like a factory restarting after a power cut. Basic pleasures may start returning faintly.', emoji: 'energy', duration: 10 },
          { text: 'Month 1: PET scans show measurable receptor recovery beginning. Exercise is the single most powerful accelerant of this process — it stimulates dopamine production directly.', emoji: 'natural', duration: 10 },
          { text: 'Month 3: Significant recovery. Normal activities — food, music, connection — are becoming genuinely enjoyable again. Your baseline is rising. Natural rewards are returning to full sensitivity.', emoji: 'mood', duration: 10 },
          { text: 'Month 6-12: Brain imaging shows near-complete dopamine system recovery for most users. The capacity for pleasure you have now is real, sustained, and yours. No debt attached.', emoji: 'energy', duration: 12 },
        ],
      },
      {
        id: 'crisis-grounding', name: '5-4-3-2-1 Crisis Grounding', duration: '3 min', type: 'breathing',
        description: 'For acute craving moments: a sensory grounding technique that brings your nervous system back to the present and out of the craving state.',
        phases: [
          { time: 12, text: 'Look around and name FIVE things you can see. Say each one in your head slowly. The ceiling. Your hand. A window. A chair. The floor. You are here. Not there.' },
          { time: 10, text: 'Notice FOUR things you can physically feel. The chair under you. Your feet on the floor. The temperature of the air. Your breath in your chest.' },
          { time: 10, text: 'Listen for THREE things you can hear. Traffic. Your own breath. A distant sound. Each thing you name is proof that you are in the present moment.' },
          { time: 8, text: 'Notice TWO things you can smell. Or two things you remember the smell of. Bring them clearly to mind.' },
          { time: 8, text: 'Notice ONE thing you can taste. The taste in your mouth right now. Take a sip of water if you have it.' },
          { time: 12, text: 'Take three slow breaths. In for 4 counts, hold for 2, out for 6. The craving is a wave. You are on the shore. It does not have to reach you.' },
        ],
      },
    ],
    articles: [
      { id: 'a1', title: 'Why Quit Cocaine?', tag: 'Awareness & Readiness', content: 'Your Goal: Find a clear, personal reason for beginning this journey — one that is genuinely yours.\\n\\nLet\'s Get Honest\\n\\nPeople come to cocaine recovery from many different places. Some have lost significant amounts of money. Some have lost relationships. Some have had a health scare. Some simply woke up one morning and decided they had had enough. None of these is more valid than any other.\\n\\nWhat the research consistently shows is that the reason for quitting matters — not its severity, but its authenticity. When your reason belongs to you and not to someone else\'s fear or pressure, the prefrontal cortex activates. This is the part of your brain that connects your values to your decisions and creates sustained motivation.\\n\\nThe Biology of Why Cocaine Is Hard to Quit\\n\\nCocaine produces 3-5 times the normal dopamine levels in the brain\'s reward circuit — and it does it in seconds. The brain interprets this as the most valuable thing that has ever happened, and it builds extremely strong associations between cocaine and the people, places, emotions, and situations around it. These associations drive craving, often outside conscious awareness.\\n\\nUnderstanding this is not an excuse. It is a map. And you cannot navigate without a map.\\n\\nMaking the Stakes Real\\n\\nTake a moment to name what cocaine has cost you. Financial: how much has this habit taken from your present and your future? Relational: who has it moved you away from? Physical: what is happening to your heart, your nose, your sleep, your mental health? Identity: when did you last feel like the version of yourself you actually want to be?\\n\\nYour Next Steps\\n\\nWrite your top three reasons for quitting in one place and read them every morning this week.\\n\\nComplete the Five Whys exercise: start with "I want to quit cocaine" and ask "why does that matter" five times in sequence. The fifth answer is usually the real one.\\n\\nShare your reason with one person who will hold you to it.' },
      { id: 'a2', title: 'The Signs of a Cocaine Problem', tag: 'Awareness & Readiness', content: 'Your Goal: Honestly assess whether your cocaine use has moved from recreational to dependency.\\n\\nWhy This Is Difficult\\n\\nCocaine dependency is particularly prone to minimisation. The drug is expensive, which creates a class-based perception that heavy users are in control of their choices. The social settings where cocaine circulates are often sophisticated — parties, professional environments, creative circles — which creates a normalisation that makes dependency hard to name.\\n\\nBut the clinical criteria do not care about the social context.\\n\\nThe Signs Worth Facing\\n\\nLoss of control: you use more than you planned, every time. You have promised yourself limits that evaporated on the night. You have tried to stop and found the pull unexpectedly powerful.\\n\\nContinued use despite consequences: despite awareness of the financial damage, the health risks, the effect on your relationships, or the next-day psychological crash, you continue. The gap between knowing and stopping is where dependency lives.\\n\\nOrganising life around cocaine: a growing amount of mental energy goes toward obtaining it, planning for it, recovering from it. When a substance occupies this much cognitive real estate, it is directing your life whether you call it addiction or not.\\n\\nPhysiological signs: tolerance (needing more for the same effect), the "comedown" depression that follows use, sleep disruption, paranoia during or after use — these are all markers of physiological dependence.\\n\\nYour Next Steps\\n\\nTake the DSM-5 assessment in this app and see where you actually fall.\\n\\nWrite down the three signs from this article that match your experience most closely.\\n\\nIf you have experienced cardiovascular symptoms — chest pain, irregular heartbeat, shortness of breath after use — see a doctor this week. These are medical emergencies in waiting.' },
      { id: 'a3', title: 'Mapping Your Cocaine Triggers', tag: 'Awareness & Readiness', content: 'Your Goal: Build a clear map of the specific people, places, emotions, and situations that activate cocaine cravings — because awareness precedes choice.\\n\\nWhy Trigger Mapping Matters More for Cocaine\\n\\nCocaine creates some of the strongest conditioned cue associations of any substance. Because use often occurred in specific social contexts, with specific people, at specific times, the brain wires these contexts as cocaine-predicting cues. Encountering them — even years after cessation — can trigger cravings that feel almost overwhelming.\\n\\nMost relapses happen not because someone decided to use, but because they found themselves in a trigger environment without a prepared response.\\n\\nThe Core Cocaine Triggers\\n\\nAlcohol: the single most common trigger for cocaine relapse. Alcohol disinhibits and activates the dopamine system in ways that make cocaine craving dramatically more intense. Many successful cocaine recoveries require addressing alcohol simultaneously.\\n\\nSpecific people: friends, dealers, or social contacts associated with cocaine use are powerful triggers. The research is clear: early in recovery, contact with using acquaintances significantly elevates relapse risk.\\n\\nSpecific places: venues, houses, or areas associated with past use. The spatial context itself — the layout, the smell, the lighting — can activate cocaine craving through conditioned association.\\n\\nFinancial emotions: paradoxically, both having money and financial stress can trigger cocaine craving. Having money creates access; financial stress creates emotional pain that cocaine temporarily relieves.\\n\\nBuilding Your Map\\n\\nFor the next week, every time a craving occurs, note: where you were, who you were with, how you were feeling, and the intensity from 1-10. You will see clear patterns in 3-5 days.\\n\\nYour Next Steps\\n\\nDelete all dealer contacts and blocking apps today. This is not optional in early recovery.\\n\\nIdentify the three highest-risk people in your social network and decide in advance how you will manage contact with them in the first 90 days.\\n\\nIf you drink alcohol, make a serious plan for how you will manage alcohol in the context of cocaine recovery. Many clinicians recommend addressing both simultaneously.' },
      { id: 'a4', title: 'Surviving the Cocaine Crash', tag: 'Detox & Early Healing', content: 'Your Goal: Understand what the cocaine crash is, why it happens, and how to move through it without using.\\n\\nWhat the Crash Is\\n\\nThe cocaine crash is the period of severe psychological and physical discomfort that follows a heavy use episode. It is caused by the dramatic depletion of dopamine reserves that cocaine produces. When the drug wears off, dopamine levels drop far below the normal baseline — often lower than they were before you used. The result is a combination of profound exhaustion, depression, irritability, and craving.\\n\\nThe crash is not optional. Every use episode has a crash waiting on the other side. This is the price the brain charges for the artificial high.\\n\\nCommon Crash Experiences\\n\\nSevere fatigue: the stimulant effect is gone. The nervous system is depleted. The body needs rest desperately.\\n\\nDepression and anhedonia: nothing feels good. The dopamine system is at its floor. This is chemical, not existential — it resolves as dopamine levels normalise.\\n\\nParanoia and anxiety: these are particularly common with crack cocaine and high doses. They result from the norepinephrine system being dysregulated.\\n\\nIntense craving: paradoxically, the crash often produces the strongest cravings, because the brain is now below its normal baseline and urgently seeking dopamine restoration.\\n\\nManaging the Crash\\n\\nRest without apology. Your body is doing real biological work. Sleep is productive.\\n\\nEat — even if you have no appetite. Blood sugar stabilisation reduces the severity of psychological crash symptoms.\\n\\nDo not be alone if you can avoid it. The combination of craving and depression is most dangerous in isolation.\\n\\nDo not drink alcohol. It will not help the crash and will significantly elevate cocaine craving.\\n\\nYour Next Steps\\n\\nHave a crash plan written before your next vulnerable period: where you will go, who you will call, what you will do.\\n\\nIf crash depression is severe — thoughts of self-harm, inability to function — seek immediate medical or mental health support. The crash can have genuine medical severity.\\n\\nRegard every crash you get through without using as a successful step toward full recovery.' },
      { id: 'a5', title: 'How to Resist the Cocaine Craving', tag: 'Detox & Early Healing', content: 'Your Goal: Build a toolkit of evidence-based techniques for surviving cocaine cravings without acting on them.\\n\\nThe Nature of Cocaine Cravings\\n\\nCocaine cravings are among the most intense of any substance — they can feel like a physical compulsion, not just a desire. The dopamine system that cocaine hijacked is now generating signals of extreme urgency for the drug. These signals feel like truth. They are not.\\n\\nThe craving is a wave. It will peak and pass without your action. The window is typically 15-30 minutes. Your job is to not give it permission to become more.\\n\\nThe Play the Tape Forward Technique\\n\\nThis is the most effective cognitive tool for acute cocaine cravings. When the craving appears, force your brain to run the full scenario — not just the desired first part, but the complete sequence:\\n\\nThe high. How it actually feels in reality, including the anxiety, the paranoia, the compulsion for more.\\nThe hours afterward: the escalating need, the financial damage, the phone calls.\\nThe crash: the depression, the self-loathing, the fatigue, the lost day or days.\\nThe next morning: how you feel about yourself, about the people around you, about your recovery.\\n\\nThen run the alternative tape: you did not use. The craving passed. You wake up tomorrow one day further along.\\n\\nPhysical Interruption\\n\\nIntense physical exercise is the most powerful acute intervention for cocaine craving. The mechanism is direct: cardiovascular exercise produces dopamine and endorphins that partially compensate for the craving state. A 20-minute run can take a severe craving to manageable.\\n\\nCall someone. The act of making human contact interrupts the craving loop. The person does not need to know what is happening — you just need to be in genuine connection.\\n\\nYour Next Steps\\n\\nWrite your "play the tape forward" script — your specific, honest version — and save it in your phone. Read it when a craving appears.\\n\\nIdentify one person you can call any time a craving becomes acute. Tell them in advance that you might call.\\n\\nPlan your physical exercise for tomorrow. The craving that arrives unprepared is the most dangerous one.' },
      { id: 'a6', title: 'Cocaine and Alcohol: Addressing Both', tag: 'Detox & Early Healing', content: 'Your Goal: Understand the cocaine-alcohol connection and make an informed decision about how to handle alcohol in your recovery.\\n\\nThe Most Important Trigger\\n\\nAlcohol is consistently identified in research as the single most common trigger for cocaine relapse. The reasons are multiple and compounding.\\n\\nBiologically: alcohol and cocaine are often used together, creating a combined metabolite (cocaethylene) that the brain comes to associate with the cocaine experience. Alcohol also directly reduces the inhibitory control of the prefrontal cortex — the exact system that keeps cocaine decisions in check.\\n\\nEnvironmentally: the places and social contexts where alcohol is consumed are often the same ones associated with cocaine use. Being in those environments reactivates the cocaine cue network.\\n\\nBehaviourally: alcohol disinhibits. "I\'ll just have one drink" becomes the gateway to "I\'ll just make one call."\\n\\nWhat This Means for Your Recovery\\n\\nThis is the question you need to answer honestly: can you successfully recover from cocaine while continuing to drink? The clinical evidence suggests that for most regular cocaine users, this is extremely difficult in early recovery. The risk of alcohol triggering cocaine use in the first 90 days is very high.\\n\\nMany clinicians recommend complete abstinence from alcohol for at least 90 days of cocaine recovery, with careful reassessment thereafter.\\n\\nThis is not a judgment about alcohol itself. It is a practical strategy for protecting your cocaine recovery.\\n\\nYour Next Steps\\n\\nMake a clear decision about alcohol in your recovery — not a vague intention, but a specific plan.\\n\\nIf you decide to drink, identify the specific guardrails: when, how much, in what contexts, with whom, and what your plan is when the cocaine craving appears.\\n\\nIf you decide to abstain from alcohol during early recovery, tell the people around you so they can support the decision rather than inadvertently undermine it.' },
      { id: 'a7', title: 'Post-Acute Withdrawal: What It Is and How to Manage It', tag: 'Detox & Early Healing', content: 'Your Goal: Understand Post-Acute Withdrawal Syndrome (PAWS) in cocaine recovery — so that unexpected difficult days do not become relapses.\\n\\nWhat Is PAWS?\\n\\nPost-Acute Withdrawal Syndrome refers to waves of psychological symptoms that occur after the acute withdrawal period has resolved. For cocaine, PAWS typically involves sudden returns of depression, anxiety, intense craving, difficulty concentrating, and emotional volatility — often with no apparent trigger.\\n\\nThese episodes are caused by the slow normalisation of dopamine system function. The brain\'s reward circuit is not a light switch — it is a complex system that recalibrates over months. During this recalibration, there are good weeks and suddenly bad days. This is normal and does not mean recovery is failing.\\n\\nWhen PAWS Typically Occurs\\n\\nMost cocaine users experience their first PAWS episode within 1-3 weeks of cessation. Further episodes can occur for 3-6 months, decreasing in frequency and intensity over time. They are often associated with anniversaries, specific triggers, stress, poor sleep, or even positive events that activate the reward system.\\n\\nManaging PAWS\\n\\nKnow that it is coming. The single most important protection against a PAWS episode becoming a relapse is knowing the episode for what it is: temporary neurological recalibration, not a sign that sobriety is failing.\\n\\nContact your support system immediately. PAWS is the most dangerous period of recovery for isolation. Being with others — or speaking to them — is the most effective acute intervention.\\n\\nDo not make major decisions during a PAWS episode. The brain\'s decision-making capacity is temporarily impaired. Delay any significant choices until the episode passes.\\n\\nYour Next Steps\\n\\nWarn yourself in advance: write a note you can read during a PAWS episode. Include: "This is PAWS. It is temporary. It will pass. Do not use. Call [name]."\\n\\nIdentify two people who know about your recovery and who you can contact during unexpected difficult days.\\n\\nSpeak to a doctor or counsellor about PAWS management. Some pharmacological supports can reduce PAWS severity.' },
      { id: 'a8', title: 'Rebuilding Dopamine Naturally', tag: 'Detox & Early Healing', content: 'Your Goal: Understand how to deliberately rebuild your dopamine system after cocaine use — and take concrete actions to accelerate the process.\\n\\nWhat Cocaine Did to Your Reward System\\n\\nCocaine produces its euphoria by blocking the dopamine transporter, flooding the synapse with dopamine at 3-5 times normal levels. With repeated use, the brain responds by reducing the number and sensitivity of dopamine receptors — down-regulation. This is why each use feels less intense over time and why everything else feels flat.\\n\\nIn the absence of cocaine, this down-regulated dopamine system means that normal life rewards — food, social connection, achievement, music — feel genuinely muted. This is not a character failing. It is a measurable neurological state that resolves with time and the right behaviours.\\n\\nThe Most Powerful Rebuilders\\n\\nAerobic exercise is the most documented and effective tool for dopamine system recovery. Clinical studies show that 30-45 minutes of moderate to vigorous aerobic exercise produces dopamine, increases dopamine receptor density, and improves mood and cognitive function measurably. Start with what you can manage and build from there.\\n\\nNovelty and challenge: dopamine is released not just by reward but by the anticipation of reward and the engagement with novel stimuli. Learning a new skill, exploring a new place, or taking on a meaningful challenge — these all stimulate dopamine production through natural pathways.\\n\\nSocial connection: human bonding stimulates oxytocin and dopamine simultaneously. Spending time with people who matter to you is not just emotionally useful — it is pharmacologically relevant to your recovery.\\n\\nSunlight and sleep: both are necessary for proper dopamine regulation. Morning sunlight exposure and consistent sleep timing are among the lowest-effort, highest-impact things you can do.\\n\\nYour Next Steps\\n\\nSchedule aerobic exercise at least 3 times per week for the next 30 days. Put it in your calendar and treat it as a medical appointment.\\n\\nIdentify one genuinely new experience you can pursue this month — something that will engage your attention and provide natural reward.\\n\\nProtect your sleep. Go to bed at the same time for the next two weeks. The dopamine system is heavily regulated by circadian rhythm.' },
      { id: 'a9', title: 'Cutting Social Ties That Lead Back to Cocaine', tag: 'Detox & Early Healing', content: 'Your Goal: Make clear-eyed decisions about the people, places, and social contexts that pose the highest relapse risk — and act on those decisions.\\n\\nWhy This Is the Hardest Part\\n\\nFor many people in cocaine recovery, the hardest part is not the withdrawal — it is the social restructuring. Cocaine use is deeply social. The people you used with, the venues you frequented, the social identity built around those scenes — these represent real relationships, real community, real belonging.\\n\\nQuitting cocaine often means restructuring your social world in ways that feel like loss. This is a genuine loss. Acknowledging it honestly, rather than minimising it, is important. So is understanding that the alternative — maintaining those connections without changing your behaviour — is one of the most reliable paths to relapse.\\n\\nThe Research on Social Exposure\\n\\nThe evidence is unambiguous: continued contact with using peers in early recovery dramatically elevates relapse risk. The research suggests that social network changes — specifically, reducing ties to using peers and building ties to sober or recovery-supporting people — is one of the strongest predictors of long-term cocaine abstinence.\\n\\nPractical Steps That Work\\n\\nDelete dealer contacts immediately. Not "for now" — permanently. The 30-second friction of looking up a new contact is a meaningful barrier in acute craving states.\\n\\nBlock, not just mute. Blocking on all platforms creates genuine distance. Muting means the connection is one tap away.\\n\\nTell close friends you are recovering. You do not owe everyone an explanation. But the people you are close to deserve honesty, and their support changes the probability of your success.\\n\\nInvest in replacement social contexts: sober sports teams, creative communities, professional development groups, recovery communities. You are not just removing — you are building.\\n\\nYour Next Steps\\n\\nDelete dealer contacts and using peer contacts today. Do it now.\\n\\nIdentify three social contexts outside your using network to explore in the next 30 days.\\n\\nTell one person who does not use that you are in recovery. This single act is one of the most consequential things you can do.' },
      { id: 'a10', title: 'How to Ditch Perfectionism in Recovery', tag: 'Recovery & Growth', content: 'Your Goal: Release the belief that recovery has to be perfect and understand why perfectionism is one of the most reliable routes back to cocaine.\\n\\nThe All-Or-Nothing Trap\\n\\nCocaine recovery has unusually high stakes for perfectionist thinking. Because the consequences of cocaine use are often dramatic, many people in recovery set impossibly rigid standards — and then, when reality falls short of perfection, the abstinence violation effect kicks in: "I\'ve already failed. I might as well continue."\\n\\nThis cognitive pattern converts single slips into full relapses. It is not inevitable. It is a recognisable, interruptible mental pattern.\\n\\nWhat Recovery Actually Looks Like\\n\\nThe clinical literature on cocaine recovery is consistent: most people who achieve long-term abstinence had multiple attempts. Each previous attempt — including the ones that did not last — contributed to the understanding, motivation, and skill that made long-term recovery eventually possible. Recovery is a process of iterative learning, not a performance of perfection.\\n\\nBuilding Self-Compassion\\n\\nResearch on recovery consistently shows that self-compassion — treating yourself with the same clarity and kindness you would extend to a friend — is positively associated with better long-term outcomes. The mechanism is direct: self-compassion reduces shame, and shame is one of the most reliable emotional triggers for cocaine use.\\n\\nThe question after a difficult moment in recovery is not "What is wrong with me?" It is "What happened, and what does my plan need to learn from this?"\\n\\nYour Next Steps\\n\\nWrite down the specific perfectionist thought patterns that show up in your recovery. Name them so you can recognise them when they appear.\\n\\nPractise the self-compassion response after one difficult moment this week: acknowledge it, normalise it as part of the process, and ask what you need.\\n\\nSet a "good enough" standard: 30 days clean is not less than 90 days clean. Progress is the measure, not performance.' },
      { id: 'a11', title: 'Building a Life That Makes Sobriety Worth It', tag: 'Recovery & Growth', content: 'Your Goal: Begin constructing a life that is so genuinely engaging and meaningful that cocaine no longer represents a trade worth making.\\n\\nThe Vacancy Problem\\n\\nCocaine often served multiple functions: social lubricant, stress relief, source of confidence, structure to evenings, a shared identity with a community. When you stop, these functions need to be filled by something else. If they are not, the vacancy is cocaine-shaped — and the brain knows it.\\n\\nThe question is not just how to stop using cocaine. It is what you are building in its place.\\n\\nRecovery Capital\\n\\nThe clinical concept of "recovery capital" refers to the resources, relationships, and meaning that make sustained sobriety worth the effort. People who sustain long-term cocaine recovery are not primarily defined by strong willpower. They are defined by having a life they genuinely want to be present for — a job that matters, relationships that nourish, activities that engage, a sense of identity that does not require cocaine to maintain.\\n\\nBuilding this is the actual work of long-term recovery.\\n\\nRebuilding Reward\\n\\nThe post-cocaine dopamine system is temporarily muted. Activities that should feel good feel flat. The temptation is to interpret this as permanent — as confirmation that life without cocaine is genuinely grey. It is not permanent. It is temporary neurological recalibration that resolves with time and with the deliberate pursuit of natural rewards.\\n\\nExercise, creative engagement, meaningful work, genuine human connection — these all stimulate the same dopamine pathways that cocaine was hijacking. They build reward capacity rather than depleting it.\\n\\nYour Next Steps\\n\\nWrite one paragraph describing the life you want to be living in 12 months. Be specific: who you are with, what you are doing, how you feel.\\n\\nIdentify one activity this week that has nothing to do with cocaine recovery. Show up to it even if it does not feel rewarding immediately.\\n\\nConsider what community or social context could support the life you are building. You are not just removing cocaine — you are moving toward something.' },
      { id: 'a12', title: 'Getting Professional Help for Cocaine Addiction', tag: 'Recovery & Growth', content: 'Your Goal: Know what professional support looks like for cocaine addiction and why using it changes your odds significantly.\\n\\nWhy Professional Help Matters\\n\\nCocaine addiction has serious medical dimensions — cardiovascular effects that require monitoring, mental health co-morbidities that require treatment, and a withdrawal and PAWS profile that benefits significantly from professional management. Attempting recovery without any professional support leaves these dimensions unaddressed.\\n\\nThe evidence is consistent: people who engage professional support for cocaine addiction have significantly better outcomes than those who do not.\\n\\nTypes of Support\\n\\nYour GP is the first contact for most people. They can assess your cardiovascular health, screen for co-morbid mental health conditions (depression, anxiety, ADHD — all common in cocaine users), and make appropriate referrals.\\n\\nAddiction specialist or psychiatrist: for moderate to severe cocaine dependency, specialist assessment provides access to evidence-based interventions including trauma-informed therapy, pharmacological support for PAWS, and intensive structured treatment if required.\\n\\nCBT and motivational interviewing: both have substantial clinical evidence for cocaine addiction. CBT specifically helps address the thought patterns and trigger management that are central to cocaine recovery.\\n\\nPeer support: NA (Narcotics Anonymous) and SMART Recovery both provide community-based support with consistent evidence of efficacy for long-term cocaine abstinence.\\n\\nIn a Crisis\\n\\nIf you are experiencing a cardiovascular event (chest pain, irregular heartbeat), severe psychological crisis, or thoughts of self-harm — call emergency services immediately. Cocaine-related cardiovascular events are medical emergencies.\\n\\nUK: FRANK helpline: 0300 123 6600. NHS addiction services: speak to your GP.\\nUS: SAMHSA National Helpline: 1-800-662-4357 (free, confidential, 24/7).\\n\\nYour Next Steps\\n\\nMake a GP appointment this week to have your cardiovascular health assessed. Tell them about your cocaine use history.\\n\\nResearch what addiction services are available in your area. Most countries have free or subsidised support — the barrier is usually awareness.\\n\\nAttend one NA or SMART Recovery meeting as an observer. You do not need to speak. You just need to see that recovery from cocaine is possible — because it is.' },
    ],
    communityPosts: [],
    achievements: [],
  },

  // ===== METHAMPHETAMINE =====
  {
    slug: 'methamphetamine',
    name: 'Methamphetamine',
    descriptor: 'Crystal meth',
    icon: 'zap',
    accentVar: '--substance-methamphetamine',
    trackers: [
      {
        id: 'use-log', name: 'Use Log', chartType: 'bar', yAxisLabel: 'Days',
        insight: 'Each day without meth allows your dopamine transporters to begin recovering. Brain imaging shows measurable healing beginning at 30 days.',
        fields: [
          { key: 'used', label: 'Did you use meth today?', type: 'single-select', options: ['Yes', 'No'] },
          { key: 'method', label: 'Method', type: 'chips', options: ['Smoked', 'Snorted', 'IV', 'Other'], showIf: { field: 'used', value: 'Yes' } },
          { key: 'trigger', label: 'Trigger', type: 'chips', options: ['Compulsion', 'Social', 'Emotional pain', 'Boredom', 'Stress', 'Availability'], showIf: { field: 'used', value: 'Yes' } },
          { key: 'notes', label: 'Notes', type: 'textarea' },
        ],
        mockGenerator: (day) => ({
          used: day < 7 ? (day < 3 ? 'Yes' : 'No') : 'No',
          method: 'Smoked',
          trigger: ['Compulsion', 'Emotional pain', 'Boredom'][day % 3],
          notes: '',
        }),
      },
      {
        id: 'cravings', name: 'Craving Intensity', chartType: 'line', yAxisLabel: 'Intensity',
        insight: 'Meth cravings can be more persistent than most substances. Your brain is learning a new normal. Track every craving you outlast — each one is a win.',
        fields: [
          { key: 'intensity', label: 'Craving intensity (1-10)', type: 'slider', min: 1, max: 10, step: 1 },
          { key: 'duration', label: 'Duration (minutes)', type: 'slider', min: 0, max: 60, step: 5 },
          { key: 'trigger', label: 'Trigger', type: 'chips', options: ['Emotional pain', 'Boredom', 'Sleep deprivation', 'Specific people/places', 'Compulsion', 'Other'] },
          { key: 'psychoticSymptoms', label: 'Any perceptual disturbances?', type: 'chips', options: ['None', 'Mild', 'Moderate — contact doctor'] },
          { key: 'coping', label: 'Coping used', type: 'chips', options: ['Sleep/rest', 'Ate a meal', 'Called someone', 'Exercise', 'Breathing', 'Waited it out'], multiSelect: true },
          { key: 'resisted', label: 'Did you resist?', type: 'single-select', options: ['Yes', 'Partially', 'No'] },
          { key: 'notes', label: 'Notes', type: 'textarea' },
        ],
        mockGenerator: (day) => ({
          intensity: Math.max(1, Math.round(9 - day * 0.3)),
          duration: Math.max(0, Math.round(30 - day)),
          trigger: ['Emotional pain', 'Boredom', 'Compulsion'][day % 3],
          psychoticSymptoms: day < 5 ? 'Mild' : 'None',
          coping: ['Sleep/rest'],
          resisted: day > 7 ? 'Yes' : 'Partially',
          notes: '',
        }),
      },
      {
        id: 'fatigue-sleep', name: 'Fatigue & Sleep', chartType: 'area', yAxisLabel: 'Score',
        insight: 'Meth-induced sleep deprivation runs deep. The hypersomnia (excessive sleep) in early recovery is your nervous system running a critical repair process. Let it.',
        fields: [
          { key: 'hoursSlept', label: 'Hours slept last night', type: 'slider', min: 0, max: 20, step: 0.5 },
          { key: 'exhaustion', label: 'Exhaustion level (1-10)', type: 'slider', min: 1, max: 10, step: 1 },
          { key: 'sleepType', label: 'Sleep type', type: 'chips', options: ['Hypersomnia (sleeping too much)', 'Insomnia', 'Normal', 'Fragmented'] },
          { key: 'dreamQuality', label: 'Dream quality', type: 'chips', options: ['Peaceful', 'Vivid', 'Nightmares', 'No dreams recalled'] },
          { key: 'notes', label: 'Notes', type: 'textarea' },
        ],
        mockGenerator: (day) => ({
          hoursSlept: day < 7 ? Math.min(18, 16 - day * 0.5) : Math.min(10, 8 + (14 - day) * 0.2),
          exhaustion: Math.max(1, Math.round(10 - day * 0.28)),
          sleepType: day < 7 ? 'Hypersomnia (sleeping too much)' : day < 14 ? 'Fragmented' : 'Normal',
          dreamQuality: day < 7 ? 'Vivid' : day < 14 ? 'Nightmares' : 'Peaceful',
          notes: '',
        }),
      },
      {
        id: 'anhedonia', name: 'Anhedonia Monitor', chartType: 'line', yAxisLabel: 'Level',
        insight: 'The inability to feel pleasure after meth is chemical depletion — not your permanent emotional landscape. It resolves. Most users report meaningful improvement by week 4-8.',
        fields: [
          { key: 'pleasureCapacity', label: 'Ability to feel pleasure (1-10)', type: 'slider', min: 1, max: 10, step: 1 },
          { key: 'motivation', label: 'Motivation level (1-10)', type: 'slider', min: 1, max: 10, step: 1 },
          { key: 'emotionalRange', label: 'Emotional range', type: 'chips', options: ['Completely flat', 'Mostly flat', 'Some feelings', 'More normal'] },
          { key: 'depression', label: 'Depression level (1-10)', type: 'slider', min: 1, max: 10, step: 1 },
          { key: 'notes', label: 'Notes', type: 'textarea' },
        ],
        mockGenerator: (day) => ({
          pleasureCapacity: Math.min(9, Math.round(1 + day * 0.28)),
          motivation: Math.min(9, Math.round(1 + day * 0.25)),
          emotionalRange: day < 7 ? 'Completely flat' : day < 14 ? 'Mostly flat' : day < 21 ? 'Some feelings' : 'More normal',
          depression: Math.max(1, Math.round(9 - day * 0.3)),
          notes: '',
        }),
      },
      {
        id: 'nutrition', name: 'Nutrition & Hydration', chartType: 'bar', yAxisLabel: 'Meals',
        insight: 'Meth severely suppresses appetite. Rebuilding consistent nutrition is one of the most important things you can do for brain healing — neurons require glucose and protein to repair.',
        fields: [
          { key: 'meals', label: 'Full meals eaten today', type: 'slider', min: 0, max: 5, step: 1 },
          { key: 'waterGlasses', label: 'Glasses of water', type: 'slider', min: 0, max: 15, step: 1 },
          { key: 'appetite', label: 'Appetite level', type: 'chips', options: ['None', 'Very low', 'Low', 'Normal', 'Increased'] },
          { key: 'supplements', label: 'Supplements taken', type: 'chips', options: ['None', 'Multivitamin', 'Magnesium', 'B vitamins', 'Protein'], multiSelect: true },
          { key: 'notes', label: 'Notes', type: 'textarea' },
        ],
        mockGenerator: (day) => ({
          meals: Math.min(3, Math.round(day * 0.1 + 1)),
          waterGlasses: Math.min(8, Math.round(day * 0.2 + 2)),
          appetite: day < 7 ? 'Very low' : day < 14 ? 'Low' : 'Normal',
          supplements: day > 7 ? ['Multivitamin'] : ['None'],
          notes: '',
        }),
      },
      {
        id: 'mental-clarity', name: 'Mental Clarity', chartType: 'line', yAxisLabel: 'Score',
        insight: 'Brain fog, paranoia, and cognitive difficulty after meth are measurably improving from day 30 onward. Tracking your clarity shows you the trajectory is upward.',
        fields: [
          { key: 'focus', label: 'Focus and concentration (1-10)', type: 'slider', min: 1, max: 10, step: 1 },
          { key: 'paranoia', label: 'Paranoia level', type: 'chips', options: ['None', 'Mild', 'Moderate', 'Severe — seek help'] },
          { key: 'cognitiveClarity', label: 'Cognitive clarity', type: 'chips', options: ['Severely foggy', 'Very foggy', 'Some fog', 'Clear'] },
          { key: 'emotionalStability', label: 'Emotional stability (1-10)', type: 'slider', min: 1, max: 10, step: 1 },
          { key: 'notes', label: 'Notes', type: 'textarea' },
        ],
        mockGenerator: (day) => ({
          focus: Math.min(9, Math.round(2 + day * 0.25)),
          paranoia: day < 5 ? 'Moderate' : day < 14 ? 'Mild' : 'None',
          cognitiveClarity: day < 7 ? 'Very foggy' : day < 14 ? 'Some fog' : 'Clear',
          emotionalStability: Math.min(9, Math.round(1 + day * 0.28)),
          notes: '',
        }),
      },
    ],
    calculator: {
      title: 'Brain Recovery Timeline',
      inputs: [
        { key: 'useFrequency', label: 'Average uses per week', type: 'slider', min: 1, max: 14, step: 1, defaultValue: 4 },
        { key: 'yearsOfUse', label: 'Years of regular use', type: 'slider', min: 1, max: 20, step: 1, defaultValue: 3 },
        { key: 'costPerUse', label: 'Cost per use ($)', type: 'slider', min: 10, max: 200, step: 5, defaultValue: 40 },
      ],
      compute: (inputs) => {
        const weekly = inputs.useFrequency * inputs.costPerUse;
        const yearly = weekly * 52;
        const pawsDuration = Math.round(inputs.yearsOfUse * 1.5 + inputs.useFrequency * 1.2);
        const cognitiveRecovery = Math.round(inputs.yearsOfUse * 2 + 3);
        const dopamineRecovery = inputs.yearsOfUse > 5 ? '12-18 months' : inputs.yearsOfUse > 2 ? '6-12 months' : '3-6 months';
        return [
          { label: 'Weekly spend', value: `$${Math.round(weekly)}` },
          { label: 'Yearly spend', value: `$${Math.round(yearly)}`, color: 'destructive' },
          { label: 'PAWS duration estimate', value: `~${pawsDuration} weeks`, color: 'accent' },
          { label: 'Cognitive recovery milestone', value: `~Month ${cognitiveRecovery}` },
          { label: 'Dopamine system recovery', value: dopamineRecovery },
          { label: '1-year savings if quit', value: `$${Math.round(yearly).toLocaleString()}`, color: 'primary' },
        ];
      },
      note: 'Brain imaging studies show measurable dopamine transporter recovery beginning at 30 days of abstinence, with continued improvement through 12-18 months.',
    },
    activities: [
      {
        id: 'meth-quiz', name: 'Methamphetamine & the Brain Quiz', duration: '3 min', type: 'quiz',
        description: 'What does meth actually do to your brain — and what does recovery look like scientifically?',
        questions: [
          { question: 'How much dopamine does methamphetamine release compared to natural rewards?', options: ['2x', '5x', '10x', '25x'], correctIndex: 1, explanation: 'Methamphetamine causes dopamine release approximately 5 times higher than natural rewards like food or sex. This catastrophic overstimulation is why natural pleasures feel hollow afterward — and why recovery of normal hedonic capacity takes months.' },
          { question: 'What does brain imaging show at 30 days of meth abstinence?', options: ['No change yet', 'Measurable dopamine transporter recovery', 'Complete recovery', 'Permanent damage only'], correctIndex: 1, explanation: 'PET scan studies by Dr. Nora Volkow and others show measurable dopamine transporter recovery beginning at 30 days of abstinence. Recovery continues through 12-18 months. The brain\'s plasticity is working in your favour.' },
          { question: 'What is the most effective tool for meth craving management?', options: ['Caffeine', 'Aerobic exercise', 'Meditation only', 'Cold showers only'], correctIndex: 1, explanation: 'Aerobic exercise is the most consistently evidence-backed intervention for meth cravings. It stimulates dopamine production through natural pathways, directly addressing the depletion that drives craving. Regular exercise during recovery has been shown to reduce relapse rates significantly.' },
          { question: 'How long can meth-induced psychosis symptoms persist after stopping?', options: ['24 hours', '1 week', 'Several weeks to months', 'They never resolve'], correctIndex: 2, explanation: 'Meth psychosis — including paranoia, auditory hallucinations, and delusional thinking — can persist for weeks to months after cessation, particularly in heavy long-term users. Medical supervision and sometimes antipsychotic medication are appropriate during this period.' },
        ],
      },
      {
        id: 'dopamine-healing', name: 'Dopamine Healing Visualization', duration: '6 min', type: 'visualization',
        description: 'A guided journey through your brain\'s recovery — from dopamine depletion to restoration.',
        scenes: [
          { text: 'Day 1-3: The crash. Your dopamine reserves are critically depleted. Everything is flat, grey, exhausted. You may sleep for 12-18 hours. This is not weakness. This is your brain running emergency restoration protocols.', emoji: 'natural', duration: 14 },
          { text: 'Day 7-14: Your brain is beginning to produce dopamine again. It is cautious and slow — a factory restarting after a catastrophic failure. Basic things may start to return. A moment of hunger. A brief interest. A flicker of something.', emoji: 'energy', duration: 12 },
          { text: 'Day 30: Brain imaging shows measurable recovery beginning. Dopamine transporters are rebuilding. Scientists can see this on PET scans. Your brain is healing — even when you cannot feel it yet.', emoji: 'natural', duration: 12 },
          { text: 'Month 3: The anhedonia is lifting. Foods taste something. Music reaches you. Moments of genuine comfort occur. These are your natural dopamine pathways reclaiming their territory from the meth pathways.', emoji: 'mood', duration: 12 },
          { text: 'Month 6-12: Significant recovery documented. The capacity for joy, for connection, for ambition that you thought meth had destroyed is returning. It was always there. It was waiting.', emoji: 'energy', duration: 14 },
        ],
      },
      {
        id: 'reality-grounding', name: 'Reality Grounding Body Scan', duration: '4 min', type: 'body-scan',
        description: 'For moments of paranoia, confusion, or feeling disconnected — a grounding practice that anchors you in present reality.',
        bodyZones: [
          { name: 'Mind', emoji: 'brain', prompt: 'Notice what is in your mind right now. Do not judge it. Just observe. You are not your thoughts. You are the one noticing the thoughts. That observer is intact and is you.' },
          { name: 'Muscles', emoji: 'natural', prompt: 'Tense your fists for 3 seconds, then release. Feel the difference. Your muscles are real. You are real. The sensation is proof of your presence in this moment.' },
          { name: 'Gut', emoji: 'natural', prompt: 'Place your hand on your abdomen. Breathe into it. Your digestive system is rebuilding its function. The hunger you may be feeling is your body asking for fuel to continue healing.' },
          { name: 'Skin', emoji: 'energy', prompt: 'Feel the temperature of the air on your skin. Run your fingers across the back of your hand. Your skin is repairing itself — the circulation that meth disrupted is normalising, slowly.' },
        ],
      },
      {
        id: 'rest-permission', name: 'Rest Permission Cards', duration: '3 min', type: 'affirmation',
        description: 'Meth recovery requires massive amounts of rest. Many people in early recovery feel guilty about how much they sleep. These truths give you permission.',
        affirmations: [
          'Sleeping 12 hours is not laziness. It is your nervous system running a repair process that requires every available resource.',
          'Your brain is doing the most important work it has done in years right now. It needs stillness, nutrition, and sleep to do it.',
          'Rest is not giving up. Rest is fuel for the healing that is already happening.',
          'Every hour of quality sleep rebuilds the neural pathways that meth depleted. You are not wasting time. You are healing.',
          'Being tired is not weakness. It is the honest physical cost of what your body is recovering from.',
          'Doing nothing today is sometimes the most productive thing you can do in recovery.',
          'You do not need to be useful right now. You need to heal. Those are not the same thing.',
        ],
      },
    ],
    articles: [
      { id: 'a1', title: 'Why Quit Methamphetamine?', tag: 'Awareness & Readiness', content: 'Your Goal: Find a clear, personal reason for beginning this recovery — one that belongs to you and not to someone else\'s fear.\\n\\nThe Nature of Meth Dependency\\n\\nMethamphetamine creates one of the most powerful dependencies of any substance. It releases approximately 5 times the dopamine of natural rewards. With repeated use, the brain adapts by dramatically reducing its own dopamine production and receptor density. The result is a baseline experience of flatness, exhaustion, and depression in the absence of the drug — and an increasingly desperate need for meth just to feel normal.\\n\\nThis is not a character failing. It is a predictable neurological consequence of a drug that was designed to be maximally rewarding.\\n\\nWhy People Quit\\n\\nThe reasons people quit meth are as varied as they are. Some are motivated by a medical scare — a tooth that can no longer be ignored, a heart event, a psychotic episode that frightened them. Some see themselves in a mirror and do not recognise who they have become. Some lose a relationship, a job, a home. Some simply experience a moment of clarity in which the full picture comes into view.\\n\\nAny reason that is genuinely yours is enough. What the research consistently shows is that the source of the motivation — internal versus external — matters more than the severity of the reason.\\n\\nMaking the Stakes Real\\n\\nTake honest inventory of what meth has cost you. Write it down. Financial: the monthly spend, the debt, the opportunities foregone. Physical: your weight, your teeth, your sleep, your cardiovascular health. Relational: who has distanced themselves? Who have you distanced yourself from? Identity: what did you used to care about that you no longer do?\\n\\nThis is not self-punishment. It is making the stakes concrete enough to fuel the work ahead.\\n\\nYour Next Steps\\n\\nWrite your top three reasons for quitting somewhere you will see them every day.\\n\\nComplete the Five Whys exercise in writing. Ask "why do I want to quit?" then ask "why does that matter?" five times in a row. The fifth answer is usually the real one.\\n\\nShare your reason with one person who will hold you accountable to it.' },
      { id: 'a2', title: 'The Signs of a Meth Problem', tag: 'Awareness & Readiness', content: 'Your Goal: Honestly assess whether your meth use has crossed from recreational into dependency.\\n\\nWhy Meth Dependency Is Particularly Hard to Self-Assess\\n\\nMethamphetamine use impairs the prefrontal cortex — the part of the brain responsible for self-reflection, planning, and evaluating consequences. The very capacity you need to assess your situation is one of the capacities most damaged by the drug. This is not an excuse. It is a reason to take outside perspectives seriously.\\n\\nThe Signs Worth Facing\\n\\nLoss of control: you no longer control how much you use or when. Use episodes that were supposed to be occasional have become constant. You have tried to stop and experienced the pull as unexpectedly powerful.\\n\\nOrganising life around meth: a growing proportion of your time, energy, and money goes toward obtaining, using, and recovering from meth. Other things — work, relationships, health, interests — have contracted.\\n\\nContinued use despite consequences: you continue to use despite knowing what it is doing to your health, your finances, your relationships, your mental state. The gap between knowing and stopping is where dependency lives.\\n\\nPhysiological signs: tolerance (needing more for the same effect), the intense crash and hypersomnia that follow a use episode, cognitive difficulties (memory, concentration, decision-making), and significant mood dysregulation between uses.\\n\\nThe Severity Spectrum\\n\\nMeth dependency exists on a spectrum. Some people are in the early stages — where the dependency is real but consequences are still largely recoverable. Some are further along — where medical, social, and financial consequences are severe. Wherever you are on that spectrum, recovery is possible.\\n\\nYour Next Steps\\n\\nTake the DSM-5 self-assessment in this app. See the clinical picture honestly.\\n\\nSpeak to your GP this week. Tell them about your meth use. They can assess your current physical health, identify urgent concerns, and connect you with appropriate support.\\n\\nWrite down the three signs from this article that match your experience most closely.' },
      { id: 'a3', title: 'Mapping Your Meth Triggers', tag: 'Awareness & Readiness', content: 'Your Goal: Build a clear, specific map of the situations, people, and emotions that activate your meth craving — so you can prepare for them rather than be ambushed.\\n\\nWhy Meth Cravings Feel Different\\n\\nMethamphetamine creates some of the strongest conditioned cue associations in addiction medicine. The drug\'s enormous dopamine impact means the brain builds extremely strong links between meth and the contexts in which it was used. These links activate automatically — before your conscious mind has a chance to intervene.\\n\\nThis is why meth cravings can feel like compulsions rather than desires. Understanding that these are conditioned responses — not irresistible drives — is the beginning of being able to work with them.\\n\\nCommon Meth Trigger Categories\\n\\nSpecific people: using partners, dealers, and social contacts who are still actively using are among the highest-risk triggers. Contact with these individuals in early recovery dramatically elevates relapse risk.\\n\\nEmotional pain: meth is often used as an emotional escape. Depression, shame, loneliness, grief, and anxiety are all high-risk emotional triggers, particularly because meth provides such rapid and dramatic (if temporary) relief.\\n\\nSensory cues: smells, locations, sounds, or other sensory experiences associated with past use can activate craving before you are consciously aware of the association.\\n\\nSleep deprivation and fatigue: ironic but consistent — being tired is itself a significant meth trigger, because meth was used to override fatigue. Managing sleep in recovery is partly trigger management.\\n\\nBuilding Your Map\\n\\nFor the next week, every time you notice a craving, note: where you are, who you are with, how you are feeling, and the intensity from 1-10. After 5-7 days you will see clear patterns.\\n\\nYour Next Steps\\n\\nIdentify and contact the three people who represent the highest relapse risk if you maintain contact. Make a deliberate decision about how to manage each relationship.\\n\\nDelete dealer contacts and block using peers on all platforms this week.\\n\\nFor your single highest-risk emotional trigger, identify one coping action you can take that is specific and realistic.' },
      { id: 'a4', title: 'The Meth Crash and Hypersomnia', tag: 'Detox & Early Healing', content: 'Your Goal: Understand the meth crash and early recovery hypersomnia — so you can give your body what it actually needs without shame or panic.\\n\\nWhat the Crash Is\\n\\nWhen a meth use episode ends, the brain is confronted with a catastrophic dopamine deficit. The drug has flooded the system with dopamine at 5x normal levels; when it clears, the natural baseline is far below normal. The result is the crash: profound fatigue, severe depression, anhedonia (inability to feel pleasure), and often the most powerful craving of the use episode.\\n\\nThe crash is not a failure state. It is the predictable and physiologically necessary consequence of the meth cycle. Every use episode produces one.\\n\\nThe Sleep Phase\\n\\nFor many meth users in early recovery, the first 1-2 weeks involves sleeping for extraordinarily long periods — 12-18 hours per day is not unusual. This hypersomnia is the nervous system\'s response to weeks, months, or years of sleep deprivation driven by meth use.\\n\\nThis sleep is genuinely restorative. Your brain is performing critical maintenance during sleep: clearing metabolic waste through the glymphatic system, consolidating what remains of memory function, and allowing the dopamine system to begin very early-stage recalibration.\\n\\nDo not fight the sleep. Do not set an alarm unless you absolutely must. Do not feel guilty for sleeping. This is some of the most productive time of your early recovery.\\n\\nWhat to Do When You Are Awake\\n\\nEat. Even if you have no appetite, eat small amounts regularly. Blood glucose stability is important for neurological function and reduces psychological crash severity.\\n\\nHydrate. Meth causes significant dehydration. Drinking water consistently is one of the simplest and most beneficial things you can do.\\n\\nDo not be alone if you can avoid it. The combination of crash depression and craving is most dangerous in isolation.\\n\\nYour Next Steps\\n\\nPlan your first week of recovery specifically. Where will you be? Who will be around you? What will you eat?\\n\\nTell the people around you that you will be sleeping a lot and that this is expected and healthy.\\n\\nIf you experience severe psychiatric symptoms during the crash — paranoia, auditory hallucinations, thoughts of self-harm — seek immediate medical attention.' },
      { id: 'a5', title: 'Understanding Meth-Induced Anhedonia', tag: 'Detox & Early Healing', content: 'Your Goal: Understand why nothing feels good after quitting meth — and build evidence-based confidence that this state is temporary and that you will feel pleasure again.\\n\\nWhat Anhedonia Is\\n\\nAnhedonia means the inability to feel pleasure from activities that would normally be pleasurable. In meth recovery, it is one of the most common and most distressing experiences. Food has no taste. Music does not move you. People who used to matter feel distant. Achievements feel hollow.\\n\\nThis state is the direct result of dopamine system depletion and down-regulation caused by meth use.\\n\\nThe Science\\n\\nMethamphetamine causes such massive dopamine release that the brain responds by dramatically reducing both its own dopamine production and the sensitivity of its dopamine receptors — down-regulation. In the absence of meth, the system is running at a fraction of normal capacity. The result is a neurological state in which normal rewards are genuinely, measurably insufficient to produce the expected response.\\n\\nThis is not permanent. This is not your emotional future. This is a temporary neurological state that resolves as the dopamine system rebuilds.\\n\\nThe Recovery Timeline\\n\\nPET scan studies show measurable recovery beginning at 30 days. Most people report meaningful improvement in hedonic capacity between weeks 4-8. By month 3-6, many report that natural pleasures are returning in a way that is qualitatively different from the artificially flooded state meth created — subtler, but genuine and sustainable.\\n\\nAccelerating Recovery\\n\\nAerobic exercise is the most powerful tool for accelerating dopamine system recovery. It stimulates dopamine production through natural pathways and increases receptor density. Even walking counts. Start where you can.\\n\\nNutrition: the dopamine neurotransmitter is synthesised from the amino acid tyrosine. Foods rich in protein (meat, eggs, legumes, dairy) support neurotransmitter production.\\n\\nYour Next Steps\\n\\nRemember this article on days when nothing feels good. Read it as evidence that the state is understood, named, and temporary.\\n\\nStart walking once daily, even briefly. The dopamine benefit begins immediately, even at low intensity.\\n\\nBe patient with the flatness. The brain you have right now is not the brain you will have at month 6.' },
      { id: 'a6', title: 'Managing Meth Psychosis', tag: 'Detox & Early Healing', content: 'Your Goal: Understand meth-induced psychotic symptoms — and know exactly when and how to seek help.\\n\\nWhat Meth Psychosis Is\\n\\nMethamphetamine psychosis refers to a cluster of psychiatric symptoms that can be triggered by meth use and can persist for weeks to months after cessation. Symptoms include paranoia (the belief that others want to harm you, are watching you, or talking about you), auditory hallucinations (hearing voices or sounds that are not there), visual disturbances, and delusional thinking.\\n\\nThese symptoms are caused by the massive disruption to dopamine signalling that meth creates. The dopamine system is so dysregulated that it begins generating false signals that the brain interprets as real perceptions.\\n\\nWho Experiences It\\n\\nNot everyone who uses meth experiences psychosis, but the risk increases significantly with heavy, long-term use, sleep deprivation, and high doses. People who experienced psychosis during use are at risk for recurring psychotic symptoms in early recovery, even without further use.\\n\\nWhat to Do\\n\\nIf symptoms are mild and decreasing: rest, nutrition, hydration, avoiding stimulants, and time are the primary tools. Symptoms often resolve significantly within 1-4 weeks of cessation.\\n\\nIf symptoms are moderate or increasing: see a doctor. Antipsychotic medications can be highly effective at managing meth psychosis and allow recovery to proceed more safely and comfortably.\\n\\nIf symptoms are severe — extreme paranoia, inability to distinguish reality, significant distress, or any thoughts of harming yourself or others — this is a psychiatric emergency. Contact emergency services or go to the nearest emergency department immediately.\\n\\nYour Next Steps\\n\\nTell one person in your life about any psychotic symptoms you have experienced or are experiencing. You should not manage this alone.\\n\\nSpeak to your GP or a psychiatrist about your history. They can assess your current risk and provide appropriate support.\\n\\nIf you are not sure whether what you are experiencing is psychosis or normal recovery symptoms, err on the side of seeking a medical opinion. There is no downside to being assessed.' },
      { id: 'a7', title: 'Nutrition and Meth Recovery', tag: 'Detox & Early Healing', content: 'Your Goal: Understand the specific nutritional requirements of meth recovery — and build consistent, simple eating habits that support brain healing.\\n\\nWhat Meth Does to Nutrition\\n\\nMethamphetamine suppresses appetite through multiple mechanisms: it increases metabolism, constricts blood vessels, and suppresses hunger signals in the brain. Long-term users often experience severe weight loss, malnutrition, and deficiencies in key vitamins and minerals. This malnutrition is itself a barrier to recovery — the brain requires adequate nutrition to produce neurotransmitters, repair cellular damage, and support cognitive function.\\n\\nThe Rebuilding Priorities\\n\\nProtein: dopamine, serotonin, and norepinephrine are all synthesised from amino acids found in protein. Adequate protein intake is literally raw material for neurotransmitter production. Eggs, meat, fish, legumes, and dairy are all good sources. Aim for protein at every meal.\\n\\nB vitamins: critical for neurological function and energy metabolism. B12, B6, and folate are particularly important. A daily B-complex supplement is an inexpensive and effective addition to recovery nutrition.\\n\\nMagnesium: meth use depletes magnesium, which is involved in hundreds of enzymatic reactions and is critical for sleep quality. Dark leafy greens, nuts, and seeds are good sources; magnesium glycinate supplements are well-tolerated.\\n\\nAntioxidants: meth generates significant oxidative stress in the brain. Fruits, vegetables, and green tea provide antioxidants that support cellular recovery.\\n\\nThe Eating Challenge in Early Recovery\\n\\nMany people in early meth recovery have essentially no appetite. Do not wait for hunger. Eat small, scheduled amounts even when you do not want to. Set an alarm if necessary. Your brain needs fuel whether or not it is signalling hunger correctly.\\n\\nYour Next Steps\\n\\nEat breakfast every morning, even if it is small. One egg, a piece of fruit, a handful of nuts. Start here.\\n\\nBuy a basic multivitamin and B-complex today. This is low cost and directly supports recovery.\\n\\nDrink water consistently throughout the day. Dehydration significantly worsens cognitive function and mood in recovery.' },
      { id: 'a8', title: 'Sleep and Recovery from Meth', tag: 'Detox & Early Healing', content: 'Your Goal: Understand the critical role of sleep in meth recovery and build sustainable sleep habits that support brain healing.\\n\\nWhat Meth Did to Your Sleep\\n\\nMethamphetamine profoundly disrupts sleep in multiple ways. It suppresses sleep need, allowing users to stay awake for days. It disrupts circadian rhythm. It reduces REM sleep — the deep, restorative sleep phase critical for memory consolidation and emotional processing. Long-term meth use creates structural changes to sleep architecture that take months to normalise.\\n\\nThe Recovery Sleep Pattern\\n\\nEarly recovery: hypersomnia. Many people sleep 12-18 hours daily in the first 1-2 weeks. This is the brain running emergency restoration. Allow it.\\n\\nWeeks 2-4: sleep normalises somewhat but is often fragmented, with vivid or disturbing dreams and early waking. This is normal and temporary.\\n\\nMonths 1-3: sleep architecture gradually improves. REM sleep returns. Most people report significantly better sleep quality by month 2-3.\\n\\nBuilding Healthy Sleep\\n\\nConsistent sleep and wake times: the single most powerful intervention for circadian rhythm normalisation. Even if you cannot sleep, lie down at the same time. Even if you slept all day, get up at the same time.\\n\\nDark, cool environment: sleep onset requires a drop in core body temperature. A cool, dark room accelerates this process.\\n\\nNo stimulants after 1pm: caffeine has a half-life of 5-6 hours. Coffee at 3pm means half that caffeine is still active at 8pm.\\n\\nLow light in the evening: bright screens suppress melatonin, the hormone that initiates sleep. Dimming your environment after 9pm can meaningfully improve sleep onset.\\n\\nYour Next Steps\\n\\nSet one consistent wake time and maintain it for the next two weeks regardless of how you slept.\\n\\nCreate a 30-minute pre-sleep routine: low light, no screens, a warm shower, or reading. The routine itself becomes a sleep cue.\\n\\nIf sleep is severely disrupted after the first month, speak to your doctor. Short-term sleep support can break the pattern and allow recovery to proceed.' },
      { id: 'a9', title: 'Rebuilding Your Identity After Meth', tag: 'Recovery & Growth', content: 'Your Goal: Begin constructing a sense of self that is not organised around meth — because identity is one of the most powerful long-term predictors of sustained recovery.\\n\\nWho Were You Before?\\n\\nFor most heavy meth users, the drug gradually colonised their identity. Social connections, daily rhythms, financial decisions, self-concept — all of these became organised around meth use. When the drug is removed, what remains is often a partial self, uncertain of who it is without the drug to structure around.\\n\\nThis is one of the most disorienting aspects of early recovery. It is also one of the most important to address.\\n\\nThe Identity Rebuilding Process\\n\\nIdentity is not a static thing you either have or do not have. It is constructed through repeated choices, relationships, activities, and the stories you tell about yourself. You are building a new identity every day in recovery — through every meal you eat, every hour you sleep, every craving you outlast, every connection you make.\\n\\nThe question to ask yourself is not "Who am I now?" — that question is too big. The question to ask is: "What do I actually value? What kind of person do I want to become? What would that person do today?"\\n\\nSmall consistent choices in the direction of the person you want to be compound into identity over time.\\n\\nWhat Former Meth Users Report\\n\\nPeople who sustain long-term meth recovery consistently describe a period — often between months 3-9 — where a new, genuine sense of self begins to emerge. It is quieter than the meth identity. More sustainable. More real. They describe caring about things again, feeling pride in small accomplishments, and finding that who they are without the drug is someone they actually respect.\\n\\nYour Next Steps\\n\\nWrite a paragraph describing who you want to be in 12 months. Be specific about values, not just activities.\\n\\nIdentify one daily practice — exercise, journaling, cooking, a creative skill — that is a small expression of the person you are becoming.\\n\\nTell someone you trust who you are working to become. Saying it aloud makes it more real.' },
      { id: 'a10', title: 'Overcoming Shame in Meth Recovery', tag: 'Recovery & Growth', content: 'Your Goal: Understand how shame operates in meth recovery and learn to use self-compassion as a genuine recovery tool — not a luxury.\\n\\nWhy Shame Is Particularly Intense in Meth Recovery\\n\\nMethamphetamine causes changes that are visible in a way that many other substances do not. The weight loss. The skin. The teeth. The paranoid behaviour. The decisions made during use. Many people in meth recovery carry not just the internal shame of what they have done but awareness of what others have seen.\\n\\nShame is one of the most powerful relapse triggers in addiction recovery. The mechanism is direct: shame creates emotional pain, emotional pain activates the desire for relief, and for people in meth recovery, meth was the most reliable source of relief available.\\n\\nSelf-Compassion as a Recovery Tool\\n\\nSelf-compassion is not making excuses or lowering standards. What the research shows: self-compassion — treating yourself with the same kindness and understanding you would extend to a friend in difficulty — is positively correlated with recovery outcomes across substance categories. It reduces shame, which reduces the emotional triggers that lead back to meth.\\n\\nSelf-compassion does not mean pretending the damage was not real. It means acknowledging the damage clearly while also acknowledging that you are a human being who became dependent on a substance designed to be maximally addictive, and that you are now doing the difficult work of recovery.\\n\\nPractising Self-Compassion\\n\\nAfter a difficult moment, the self-compassion practice has three components: acknowledge the difficulty honestly ("This is hard"), normalise it ("This is part of recovery and part of being human"), and offer kindness ("What do I need right now?").\\n\\nYour Next Steps\\n\\nWrite down the three shame narratives you carry most heavily about your meth use. Seeing them on paper creates distance.\\n\\nFor each one, write one honest, compassionate counter-statement — not denial, but perspective. "This happened because I was dependent on a powerful drug. I am now in recovery from it."\\n\\nShare what you are carrying with a therapist, counsellor, or support group. Shame loses most of its power when witnessed with compassion.' },
      { id: 'a11', title: 'Rebuilding Relationships After Meth', tag: 'Recovery & Growth', content: 'Your Goal: Understand how meth affected your relationships and begin the deliberate process of repair and rebuilding.\\n\\nWhat Meth Did to Your Relationships\\n\\nMeth use does not affect relationships in the abstract — it affects them through specific behaviours: the lies told to obtain money, the paranoid accusations directed at loved ones, the unpredictability, the unavailability, the financial damage. People who cared about you experienced these things directly.\\n\\nRepair requires acknowledging this specifically. "I\'m sorry I was difficult" is less useful than "I understand that I accused you of things that were not true and that must have been frightening."\\n\\nThe Three Phases of Relationship Repair\\n\\nPhase 1 — Stabilise yourself first: the first 60-90 days of recovery are about establishing your own stability. Attempting deep relationship repair before you have some foundation tends to backfire. People who have been hurt by your meth use need to see consistency before they can begin to trust.\\n\\nPhase 2 — Specific acknowledgement: repair begins with honest, specific acknowledgement of what happened and its impact. This is not a single conversation — it is an ongoing willingness to hear how your behaviour affected people.\\n\\nPhase 3 — Consistent behaviour over time: the currency of trust in relationship repair is not words. It is predictable, consistent behaviour over months. People who have experienced the meth cycle are rightfully watchful for inconsistency.\\n\\nRelationships That Cannot Be Repaired\\n\\nSome relationships may not be repairable, or may not be safe to pursue. Some people in your life before recovery were active using partners or enablers. Some have experienced too much damage to rebuild trust.\\n\\nRecovery sometimes involves accepting this grief alongside the more hopeful work of building new connections.\\n\\nYour Next Steps\\n\\nList three relationships that were most affected by your meth use. For each one, write one honest sentence about the specific impact.\\n\\nChoose one relationship to invest in actively this month and make one concrete gesture toward it.\\n\\nIf family relationships were severely affected, consider family counselling. A professional context can create safety for conversations that are too charged to happen without support.' },
      { id: 'a12', title: 'Getting Professional Help for Meth Addiction', tag: 'Recovery & Growth', content: 'Your Goal: Know exactly what professional support looks like for meth addiction and why accessing it significantly improves your odds.\\n\\nWhy Meth Recovery Benefits Particularly from Professional Support\\n\\nMethamphetamine recovery has specific medical dimensions that benefit from professional management: the psychiatric monitoring required for meth psychosis, the cardiovascular assessment needed given meth\'s cardiac effects, the nutritional assessment given the malnutrition that commonly accompanies heavy use, and the psychological support required for the severity of anhedonia and depression that characterise early recovery.\\n\\nAttempting to navigate all of this without professional guidance leaves significant risks unmanaged.\\n\\nTypes of Support\\n\\nGP/family doctor: first contact for most people. Can assess physical health, identify urgent medical concerns, screen for co-morbid mental health conditions, and make appropriate referrals.\\n\\nPsychiatrist: for significant meth psychosis, severe depression, or co-morbid mental health conditions that require specialist management. Antipsychotic and antidepressant medications can significantly improve the experience of early recovery.\\n\\nCBT therapist specialising in addiction: Cognitive Behavioural Therapy has the strongest evidence base of any therapeutic approach for stimulant use disorder. CBT specifically addresses the trigger management, thought patterns, and emotional regulation skills central to meth recovery.\\n\\nResidential rehabilitation: for severe dependency where the home environment is not safe or supportive, residential rehab provides structured immersive support during the critical early recovery period.\\n\\nNA/Crystal Meth Anonymous (CMA)/SMART Recovery: peer support provides ongoing connection, accountability, and the understanding that comes from shared experience.\\n\\nIn a Crisis\\n\\nIf you are experiencing psychiatric symptoms, cardiovascular symptoms, or thoughts of self-harm — contact emergency services or go to your nearest emergency department immediately.\\n\\nUK: FRANK: 0300 123 6600. Change Grow Live: 0300 555 6789.\\nUS: SAMHSA National Helpline: 1-800-662-4357 (free, confidential, 24/7). Crystal Meth Anonymous: www.crystalmeth.org.\\n\\nYour Next Steps\\n\\nBook a GP appointment this week. Tell them about your meth use history and ask for a comprehensive health assessment.\\n\\nResearch what specialist addiction services are available in your area. Most countries have free or subsidised options — the barrier is usually awareness.\\n\\nAttend one CMA, NA, or SMART Recovery meeting. You do not need to speak. You need to see that recovery from meth is real, common, and achievable.' },
    ],
    communityPosts: [],
    achievements: [],
  }
`;

// ─────────────────────────────────────────────────────────────
// SPLICE INTO substances.ts
// ─────────────────────────────────────────────────────────────

// Find the start of the vaping block
const vapingMarker = "// ===== VAPING =====";
const oldVapingMarker = "slug: 'vaping'";

let startIdx = content.indexOf(vapingMarker);
if (startIdx === -1) {
  // Try to find via slug
  startIdx = content.indexOf(oldVapingMarker);
  if (startIdx === -1) {
    console.error('Could not find vaping block start');
    process.exit(1);
  }
  // Walk back to find the opening {
  let braceIdx = content.lastIndexOf('{', startIdx);
  startIdx = braceIdx;
} else {
  // Walk back to find the comment line start
  let lineStart = content.lastIndexOf('\n', startIdx);
  startIdx = lineStart + 1;
}

// Find the closing of the methamphetamine block (last communityPosts and achievements before ];)
const closingPattern = "achievements: []\n  }";
const altClosingPattern = "achievements: []\r\n  }";

// Find last methamphetamine block end — search for the last occurrence of achievements: []
let endIdx = -1;
let searchFrom = startIdx;
while (true) {
  let found = content.indexOf("achievements: []", searchFrom);
  if (found === -1) break;
  endIdx = found;
  searchFrom = found + 1;
}

if (endIdx === -1) {
  console.error('Could not find end of last substance block');
  process.exit(1);
}

// Move past the closing } and any whitespace/newlines
endIdx = content.indexOf('}', endIdx + "achievements: []".length);
if (endIdx === -1) {
  console.error('Could not find closing brace');
  process.exit(1);
}
endIdx += 1; // past the }

// Now build the new content
const before = content.slice(0, startIdx).trimEnd() + '\n';
const after = '\n' + content.slice(endIdx).replace(/^\n+/, '');

const newContent = before + NEW_SUBSTANCES.trimStart() + after;

fs.writeFileSync(filePath, newContent);
console.log(`Done. New file size: ${Buffer.byteLength(newContent)} bytes`);
console.log(`Old file size: ${Buffer.byteLength(content)} bytes`);

// Count articles per substance
const slugs = ['vaping', 'chewing-tobacco', 'cocaine', 'methamphetamine'];
for (const slug of slugs) {
  const slugStart = newContent.indexOf(`slug: '${slug}'`);
  const slugEnd = newContent.indexOf(`slug: '`, slugStart + 10);
  const chunk = newContent.substring(slugStart, slugEnd > 0 ? slugEnd : slugStart + 150000);
  const articleCount = (chunk.match(/"id": 'a\d+'/g) || chunk.match(/id: 'a\d+'/g) || []).length;
  const trackerCount = (chunk.match(/chartType:/g) || []).length;
  const activityCount = (chunk.match(/type: '(quiz|visualization|breathing|affirmation|body-scan)'/g) || []).length;
  console.log(`${slug}: trackers=${trackerCount}, activities=${activityCount}, articles=${articleCount}`);
}
