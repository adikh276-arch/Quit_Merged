import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft, Calendar, Target, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { SubstanceConfig } from '@/data/types';
import { setStreak } from '@/data/storage';
import SubstanceIcon from './SubstanceIcon';

const heroGradients: Record<string, string> = {
  alcohol: 'from-red-600 via-rose-500 to-red-700',
  tobacco: 'from-amber-600 via-orange-500 to-amber-700',
  opioids: 'from-purple-600 via-violet-500 to-purple-700',
  cannabis: 'from-emerald-600 via-green-500 to-emerald-700',
  stimulants: 'from-yellow-500 via-amber-500 to-yellow-600',
  benzodiazepines: 'from-blue-600 via-indigo-500 to-blue-700',
  kratom: 'from-teal-600 via-cyan-500 to-teal-700',
  mdma: 'from-pink-600 via-fuchsia-500 to-pink-700',
};

const triggersBySubstance: Record<string, string[]> = {
  alcohol: ['Stress', 'Social events', 'Evenings', 'Boredom', 'Loneliness', 'Celebrations'],
  tobacco: ['Morning routine', 'After meals', 'Stress', 'Social smoking', 'Driving', 'Coffee'],
  opioids: ['Physical pain', 'Emotional pain', 'Stress', 'Certain people', 'Locations', 'Boredom'],
  cannabis: ['Evening routine', 'Boredom', 'Stress', 'Social pressure', 'Sleep issues', 'Anxiety'],
  stimulants: ['Work pressure', 'Nightlife', 'Social settings', 'Depression', 'Fatigue', 'Deadlines'],
  benzodiazepines: ['Anxiety', 'Panic attacks', 'Insomnia', 'Social situations', 'Stress', 'Travel'],
  kratom: ['Morning routine', 'Pain', 'Low energy', 'Anxiety', 'Online forums', 'Boredom'],
  mdma: ['Festivals', 'Clubs', 'Social pressure', 'Depression', 'FOMO', 'Music events'],
};

const motivations = ['Better health', 'Family & relationships', 'Financial freedom', 'Mental clarity', 'Self-respect', 'Career goals'];

interface Props {
  substance: SubstanceConfig;
  onComplete: () => void;
}

const SubstanceOnboarding = ({ substance, onComplete }: Props) => {
  const [step, setStep] = useState(0);
  const [quitOption, setQuitOption] = useState<string | null>(null);
  const [customDate, setCustomDate] = useState('');
  const [motivation, setMotivation] = useState<string | null>(null);
  const [triggers, setTriggers] = useState<string[]>([]);

  const gradient = heroGradients[substance.slug] || 'from-primary to-primary/80';
  const substanceTriggers = triggersBySubstance[substance.slug] || triggersBySubstance.alcohol;

  const getQuitDaysAgo = (): number => {
    if (quitOption === 'today') return 0;
    if (quitOption === 'yesterday') return 1;
    if (quitOption === '3days') return 3;
    if (quitOption === 'week') return 7;
    if (quitOption === 'custom' && customDate) {
      const diff = Math.floor((Date.now() - new Date(customDate).getTime()) / 86400000);
      return Math.max(0, diff);
    }
    return 0;
  };

  const handleComplete = () => {
    const daysAgo = getQuitDaysAgo();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - daysAgo);
    const startStr = startDate.toISOString().split('T')[0];
    setStreak(substance.slug, daysAgo, startStr);
    localStorage.setItem(`quitmantra_onboarded_${substance.slug}`, 'true');
    localStorage.setItem(`quitmantra_motivation_${substance.slug}`, motivation || '');
    localStorage.setItem(`quitmantra_triggers_${substance.slug}`, JSON.stringify(triggers));
    onComplete();
  };

  const canNext = () => {
    if (step === 0) return !!quitOption && (quitOption !== 'custom' || !!customDate);
    if (step === 1) return !!motivation;
    if (step === 2) return triggers.length > 0;
    return true;
  };

  const steps = [
    { icon: Calendar, title: 'Quit Date', subtitle: `When did you stop using ${substance.name.toLowerCase()}?` },
    { icon: Target, title: 'Your Why', subtitle: 'What motivates your recovery?' },
    { icon: AlertTriangle, title: 'Know Your Triggers', subtitle: 'Select the ones that apply to you' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/30 flex flex-col">
      <div className="mx-auto max-w-lg w-full px-5 pb-16 pt-8 flex-1 flex flex-col">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className={`mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br ${gradient} shadow-xl`}>
            <SubstanceIcon slug={substance.slug} className="h-10 w-10 text-white" />
          </div>
          <h1 className="font-display text-3xl text-foreground">{substance.name}</h1>
          <p className="text-sm text-muted-foreground mt-1.5">{substance.descriptor}</p>
        </motion.div>

        {/* Progress dots */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {steps.map((_, i) => (
            <div key={i} className={`h-2 rounded-full transition-all duration-500 ${
              i === step ? 'w-8 bg-primary' : i < step ? 'w-2 bg-primary/60' : 'w-2 bg-muted'
            }`} />
          ))}
        </div>

        {/* Step Content */}
        <div className="flex-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center gap-3 mb-6">
                {(() => { const StepIcon = steps[step].icon; return <StepIcon className="h-5 w-5 text-primary" />; })()}
                <div>
                  <h2 className="font-display text-xl text-foreground">{steps[step].title}</h2>
                  <p className="text-sm text-muted-foreground">{steps[step].subtitle}</p>
                </div>
              </div>

              {step === 0 && (
                <div className="space-y-3">
                  {[
                    { id: 'today', label: 'Today', desc: 'Starting fresh right now' },
                    { id: 'yesterday', label: 'Yesterday', desc: '1 day clean' },
                    { id: '3days', label: '3 days ago', desc: 'Already in recovery' },
                    { id: 'week', label: 'A week ago', desc: '7 days strong' },
                    { id: 'custom', label: 'Pick a date', desc: 'Choose your exact quit date' },
                  ].map(opt => (
                    <button
                      key={opt.id}
                      onClick={() => setQuitOption(opt.id)}
                      className={`w-full flex items-center gap-4 rounded-2xl border-2 p-4 text-left transition-all ${
                        quitOption === opt.id
                          ? 'border-primary bg-primary/5 shadow-md'
                          : 'border-border/60 bg-card hover:border-primary/30'
                      }`}
                    >
                      <div className={`h-5 w-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                        quitOption === opt.id ? 'border-primary bg-primary' : 'border-muted-foreground/30'
                      }`}>
                        {quitOption === opt.id && <CheckCircle2 className="h-3.5 w-3.5 text-primary-foreground" />}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-foreground">{opt.label}</p>
                        <p className="text-xs text-muted-foreground">{opt.desc}</p>
                      </div>
                    </button>
                  ))}
                  {quitOption === 'custom' && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                      <input
                        type="date"
                        value={customDate}
                        max={new Date().toISOString().split('T')[0]}
                        onChange={e => setCustomDate(e.target.value)}
                        className="w-full rounded-2xl border-2 border-border/60 bg-background px-4 py-3.5 text-sm font-medium focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10"
                      />
                    </motion.div>
                  )}
                </div>
              )}

              {step === 1 && (
                <div className="grid grid-cols-2 gap-3">
                  {motivations.map(m => (
                    <button
                      key={m}
                      onClick={() => setMotivation(m)}
                      className={`rounded-2xl border-2 p-4 text-left transition-all ${
                        motivation === m
                          ? 'border-primary bg-primary/5 shadow-md'
                          : 'border-border/60 bg-card hover:border-primary/30'
                      }`}
                    >
                      <p className="text-sm font-bold text-foreground">{m}</p>
                    </button>
                  ))}
                </div>
              )}

              {step === 2 && (
                <div className="flex flex-wrap gap-2.5">
                  {substanceTriggers.map(t => {
                    const selected = triggers.includes(t);
                    return (
                      <button
                        key={t}
                        onClick={() => setTriggers(prev => selected ? prev.filter(x => x !== t) : [...prev, t])}
                        className={`rounded-xl border-2 px-4 py-2.5 text-sm font-semibold transition-all ${
                          selected
                            ? 'border-primary bg-primary text-primary-foreground shadow-md'
                            : 'border-border/60 bg-card text-foreground hover:border-primary/30'
                        }`}
                      >
                        {t}
                      </button>
                    );
                  })}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <div className="flex items-center gap-3 mt-8">
          {step > 0 && (
            <button
              onClick={() => setStep(s => s - 1)}
              className="flex items-center gap-1.5 rounded-2xl border-2 border-border/60 px-5 py-3.5 text-sm font-bold text-muted-foreground hover:text-foreground hover:border-border transition-colors"
            >
              <ArrowLeft className="h-4 w-4" /> Back
            </button>
          )}
          <button
            onClick={() => step < 2 ? setStep(s => s + 1) : handleComplete()}
            disabled={!canNext()}
            className={`flex-1 flex items-center justify-center gap-2 rounded-2xl py-3.5 text-sm font-bold text-white transition-all shadow-lg ${
              canNext()
                ? 'bg-primary hover:opacity-90 shadow-primary/25'
                : 'bg-muted text-muted-foreground shadow-none cursor-not-allowed'
            }`}
          >
            {step < 2 ? (
              <>Continue <ArrowRight className="h-4 w-4" /></>
            ) : (
              <>Start Tracking <CheckCircle2 className="h-4 w-4" /></>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubstanceOnboarding;
