const fs = require('fs');
const path = require('path');

const dir = 'src/pages/substance';
const comps = [
  {
    name: 'SubstanceLayout.tsx',
    content: `import { useParams, Outlet, useNavigate } from 'react-router-dom';
import { substances } from '@/data/substances';
import { ArrowLeft, MessageSquare, Activity, Calendar, ShieldAlert } from 'lucide-react';

export const SubstanceLayout = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const substance = substances.find(s => s.slug === slug);

  if (!substance) return <div className="p-8 text-center">Substance not found</div>;

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-500 pb-20">
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b px-4 py-3 flex items-center justify-between">
        <button onClick={() => navigate('/')} className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
          <ArrowLeft className="w-5 h-5" /> Back
        </button>
        <h1 className="font-display font-bold" style={{ color: \`hsl(var(\${substance.accentVar}))\` }}>
          {substance.name} Recovery
        </h1>
        <div className="w-8" />
      </header>

      <main className="max-w-md mx-auto p-4 space-y-6">
        <Outlet context={{ substance }} />
      </main>

      <nav className="fixed bottom-0 w-full max-w-md left-1/2 -translate-x-1/2 bg-card border-t flex justify-around p-3 pb-6 z-50 rounded-t-2xl shadow-lg">
        <button onClick={() => navigate(\`/\${slug}\`)} className="flex flex-col items-center gap-1 text-muted-foreground hover:text-foreground"><Activity className="w-5 h-5" /><span className="text-[10px]">Home</span></button>
        <button onClick={() => navigate(\`/\${slug}/timeline\`)} className="flex flex-col items-center gap-1 text-muted-foreground hover:text-foreground"><Calendar className="w-5 h-5" /><span className="text-[10px]">Timeline</span></button>
        <button onClick={() => navigate(\`/\${slug}/cravings\`)} className="flex flex-col items-center gap-1 text-muted-foreground hover:text-foreground"><ShieldAlert className="w-5 h-5" /><span className="text-[10px]">Track</span></button>
        <button onClick={() => navigate(\`/\${slug}/ai\`)} className="flex flex-col items-center gap-1 text-muted-foreground hover:text-foreground"><MessageSquare className="w-5 h-5" /><span className="text-[10px]">AI Support</span></button>
      </nav>
    </div>
  );
};
`
  },
  {
    name: 'RecoveryHome.tsx',
    content: `import { useOutletContext, useNavigate } from 'react-router-dom';
import { SubstanceConfig } from '@/data/types';
import { Flame, ShieldAlert, HeartPulse } from 'lucide-react';

export const RecoveryHome = () => {
  const { substance } = useOutletContext<{ substance: SubstanceConfig }>();
  const navigate = useNavigate();

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="p-6 rounded-3xl bg-card border shadow-sm text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ background: \`linear-gradient(135deg, hsl(var(\${substance.accentVar})) 0%, transparent 100%)\` }} />
        <Flame className="w-12 h-12 mx-auto mb-3" style={{ color: \`hsl(var(\${substance.accentVar}))\` }} />
        <h2 className="text-4xl font-display font-bold">14 Days</h2>
        <p className="text-sm text-muted-foreground mt-1">Current Streak</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <button onClick={() => navigate('cravings')} className="p-4 rounded-2xl bg-card border shadow-sm hover:shadow-md transition-all text-left">
          <ShieldAlert className="w-6 h-6 mb-2 text-rose-500" />
          <h3 className="font-semibold">Log Craving</h3>
          <p className="text-xs text-muted-foreground mt-1">Record a trigger or urge</p>
        </button>
        <button onClick={() => navigate('withdrawal')} className="p-4 rounded-2xl bg-card border shadow-sm hover:shadow-md transition-all text-left">
          <HeartPulse className="w-6 h-6 mb-2 text-indigo-500" />
          <h3 className="font-semibold">Withdrawal</h3>
          <p className="text-xs text-muted-foreground mt-1">Track physical symptoms</p>
        </button>
      </div>

      <div className="p-5 rounded-3xl bg-secondary border border-border/50">
        <h3 className="font-semibold mb-2">Recovery Insight</h3>
        <p className="text-sm text-muted-foreground">
          {substance.trackers.find(t => t.id === 'cravings')?.insight || "Keep going! Your body is actively healing."}
        </p>
      </div>
    </div>
  );
};
`
  },
  {
    name: 'RecoveryTimeline.tsx',
    content: `import { useOutletContext } from 'react-router-dom';
import { SubstanceConfig } from '@/data/types';

export const RecoveryTimeline = () => {
  const { substance } = useOutletContext<{ substance: SubstanceConfig }>();

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h2 className="text-2xl font-display font-bold">Recovery Timeline</h2>
      <p className="text-sm text-muted-foreground">Biological recovery phases for {substance.name}</p>
      
      <div className="space-y-4 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent">
        {[1, 3, 7, 14, 30].map((day, i) => (
          <div key={day} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
            <div className="flex items-center justify-center w-10 h-10 rounded-full border bg-background shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow" style={{ borderColor: \`hsl(var(\${substance.accentVar}))\` }}>
              <span className="text-xs font-bold">{day}d</span>
            </div>
            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-2xl border bg-card shadow-sm">
              <h3 className="font-bold text-sm mb-1">Phase {i + 1}</h3>
              <p className="text-xs text-muted-foreground">Acute withdrawal begins stabilizing. Physical healing accelerates.</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
`
  },
  {
    name: 'CravingTracker.tsx',
    content: `import { useOutletContext } from 'react-router-dom';
import { SubstanceConfig } from '@/data/types';
import { AlertCircle } from 'lucide-react';

export const CravingTracker = () => {
  const { substance } = useOutletContext<{ substance: SubstanceConfig }>();

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h2 className="text-2xl font-display font-bold">Log a Craving</h2>
      <div className="p-6 rounded-3xl bg-card border shadow-sm space-y-5">
        <div>
          <label className="text-sm font-semibold mb-2 block">Intensity</label>
          <input type="range" min="1" max="10" defaultValue="5" className="w-full" style={{ '--slider-accent': \`hsl(var(\${substance.accentVar}))\` } as any} />
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>Mild</span><span>Overwhelming</span>
          </div>
        </div>
        <div>
          <label className="text-sm font-semibold mb-2 block">Trigger</label>
          <div className="flex flex-wrap gap-2">
            {['Stress', 'Social', 'Boredom', 'Habit', 'Routine'].map(t => (
              <button key={t} className="px-3 py-1.5 rounded-full border text-xs bg-secondary hover:bg-secondary/80">{t}</button>
            ))}
          </div>
        </div>
        <button className="w-full py-3 rounded-xl font-bold text-white shadow-md transition-transform active:scale-95" style={{ background: \`hsl(var(\${substance.accentVar}))\` }}>
          Save Log
        </button>
      </div>
      
      <div className="flex items-start gap-3 p-4 rounded-2xl bg-destructive/10 text-destructive border border-destructive/20">
        <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
        <div className="text-sm">
          <p className="font-semibold">Relapse flow</p>
          <p className="mt-1 opacity-90">If you slipped up, you can log a partial relapse here with compassion.</p>
        </div>
      </div>
    </div>
  );
};
`
  },
  {
    name: 'WithdrawalAssistant.tsx',
    content: `import { useOutletContext } from 'react-router-dom';
import { SubstanceConfig } from '@/data/types';
import { HeartPulse } from 'lucide-react';

export const WithdrawalAssistant = () => {
  const { substance } = useOutletContext<{ substance: SubstanceConfig }>();

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h2 className="text-2xl font-display font-bold flex items-center gap-2">
        <HeartPulse className="text-indigo-500" /> Withdrawal Status
      </h2>
      <p className="text-sm text-muted-foreground">Track and manage your physical recovery.</p>
      
      <div className="space-y-4">
        {substance.trackers.find(t => t.id === 'withdrawal')?.fields.slice(0, 3).map((f) => (
          <div key={f.key} className="p-4 rounded-2xl bg-card border shadow-sm">
            <h3 className="font-semibold text-sm mb-3">{f.label}</h3>
            <div className="flex gap-2">
              {['None', 'Mild', 'Moderate', 'Severe'].map(lvl => (
                <button key={lvl} className="flex-1 py-1.5 rounded-lg border text-xs text-center hover:bg-secondary transition-colors">
                  {lvl}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
      
      <div className="p-5 rounded-3xl bg-secondary border border-border/50 text-sm text-muted-foreground">
        Withdrawal is a sign that your body is recalibrating to its natural baseline. It is temporary.
      </div>
    </div>
  );
};
`
  },
  {
    name: 'AIRecoveryCompanion.tsx',
    content: `import { useOutletContext } from 'react-router-dom';
import { SubstanceConfig } from '@/data/types';
import { Sparkles, Send } from 'lucide-react';

export const AIRecoveryCompanion = () => {
  const { substance } = useOutletContext<{ substance: SubstanceConfig }>();

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div className="flex gap-3">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
            <Sparkles className="w-4 h-4 text-primary" />
          </div>
          <div className="bg-card border p-3 rounded-2xl rounded-tl-sm text-sm shadow-sm">
            I'm your AI companion for {substance.name} recovery. I'm here to help with {substance.trackers[1]?.insight || 'managing cravings and triggers'}. How are you feeling today?
          </div>
        </div>
      </div>
      
      <div className="p-4 border-t bg-background">
        <div className="flex items-center gap-2 p-1 pl-4 rounded-full border bg-card focus-within:ring-1 focus-within:ring-primary shadow-sm">
          <input type="text" placeholder="I'm having a strong craving..." className="flex-1 bg-transparent text-sm outline-none" />
          <button className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center shrink-0">
            <Send className="w-4 h-4 ml-[-2px]" />
          </button>
        </div>
      </div>
    </div>
  );
};
`
  }
];

comps.forEach(c => {
  fs.writeFileSync(path.join(dir, c.name), c.content);
});
console.log('Successfully generated substance components');
