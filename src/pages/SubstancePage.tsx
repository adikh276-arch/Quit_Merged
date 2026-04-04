import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ClipboardList, Calculator, Dumbbell, BookOpen, Users, Trophy } from 'lucide-react';
import { getSubstance } from '@/data/substances';
import { getStreak, getEntries } from '@/data/storage';
import { useState } from 'react';
import TrackerDetail from '@/components/TrackerDetail';
import ToolModal from '@/components/ToolModal';
import { LineChart, Line, ResponsiveContainer } from 'recharts';

const SubstancePage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const substance = getSubstance(slug || '');
  const [activeTracker, setActiveTracker] = useState<string | null>(null);
  const [activeTool, setActiveTool] = useState<string | null>(null);

  if (!substance) {
    navigate('/');
    return null;
  }

  const streak = getStreak(substance.slug);
  const accentColor = `hsl(var(${substance.accentVar}))`;

  // Compute recovery score (simplified)
  const recoveryScore = Math.min(100, Math.round(50 + streak.days * 2.3));

  // Get stat chips
  const getStatChips = () => {
    const entries = getEntries(substance.slug, substance.trackers[0].id, 21);
    const firstVal = entries[0]?.values?.[Object.keys(entries[0]?.values || {})[0]] || 0;
    const lastVal = entries[entries.length - 1]?.values?.[Object.keys(entries[entries.length - 1]?.values || {})[0]] || 0;
    const reduction = firstVal > 0 ? Math.round((1 - Number(lastVal) / Number(firstVal)) * 100) : 0;

    return [
      `↓ ${Math.abs(reduction)}% ${substance.trackers[0].name.split(' ')[0].toLowerCase()}`,
      `${streak.days} day streak`,
      `↑ Recovery ${recoveryScore}%`,
    ];
  };

  const statChips = getStatChips();
  const activeTrackerConfig = substance.trackers.find(t => t.id === activeTracker);

  const tools = [
    { id: 'assessment', name: 'DSM-5 Assessment', icon: ClipboardList },
    { id: 'calculator', name: 'Calculate', icon: Calculator },
    { id: 'activities', name: 'Activities', icon: Dumbbell },
    { id: 'learn', name: 'Learn', icon: BookOpen },
    { id: 'community', name: 'Community', icon: Users },
    { id: 'achievements', name: 'Achievements', icon: Trophy },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Banner */}
      {substance.banner && (
        <div className={`px-4 py-2 text-center text-xs font-medium ${
          substance.banner.type === 'warning' ? 'bg-accent/15 text-accent' :
          substance.banner.type === 'danger' ? 'bg-destructive/15 text-destructive' :
          'bg-primary/10 text-primary'
        }`}>
          {substance.banner.text}
        </div>
      )}

      <div className="mx-auto max-w-lg px-4 pb-8">
        {/* Back button */}
        <button onClick={() => navigate('/')} className="flex items-center gap-1.5 py-4 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back
        </button>

        {/* Hero Widget */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl p-6 text-primary-foreground"
          style={{ background: `linear-gradient(135deg, ${accentColor}, ${accentColor}dd)` }}
        >
          <div className="flex items-start justify-between">
            <div>
              <span className="text-3xl">{substance.icon}</span>
              <h1 className="mt-1 font-display text-2xl">{substance.name}</h1>
            </div>
            <div className="text-right">
              <AnimatedNumber value={streak.days} className="text-4xl font-bold" />
              <p className="text-xs opacity-80">days clean</p>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-3">
            <div className="flex-1">
              <div className="mb-1 flex justify-between text-xs opacity-80">
                <span>Recovery Score</span>
                <span>{recoveryScore}%</span>
              </div>
              <div className="h-2 rounded-full bg-white/20">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${recoveryScore}%` }}
                  transition={{ duration: 1, delay: 0.3 }}
                  className="h-2 rounded-full bg-white/80"
                />
              </div>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {statChips.map((chip, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + i * 0.1 }}
                className="rounded-full bg-white/15 px-3 py-1 text-xs font-medium backdrop-blur-sm"
              >
                {chip}
              </motion.span>
            ))}
          </div>

          <p className="mt-3 text-xs opacity-60">
            Started {streak.startDate ? new Date(streak.startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'recently'}
          </p>
        </motion.div>

        {/* Tracker Grid */}
        <h2 className="mb-3 mt-6 font-display text-lg text-foreground">Trackers</h2>
        <div className="grid grid-cols-2 gap-3">
          {substance.trackers.map((tracker, i) => {
            const entries = getEntries(substance.slug, tracker.id, 7);
            const sparkData = entries.map(e => {
              const firstKey = Object.keys(e.values).find(k => typeof e.values[k] === 'number');
              return { v: firstKey ? Number(e.values[firstKey]) : 0 };
            });
            const todayEntry = entries.find(e => e.date === new Date().toISOString().split('T')[0]);

            return (
              <motion.button
                key={tracker.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.05 }}
                onClick={() => setActiveTracker(tracker.id)}
                className="flex flex-col gap-1 rounded-xl border border-border bg-card p-3 text-left transition-all hover:shadow-md active:scale-[0.97]"
              >
                <p className="text-xs font-semibold text-foreground">{tracker.name}</p>
                {todayEntry && (
                  <p className="text-xs text-primary font-medium">
                    ✓ Logged
                  </p>
                )}
                <div className="h-8 w-full">
                  {sparkData.length > 1 && (
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={sparkData}>
                        <Line type="monotone" dataKey="v" stroke={accentColor} strokeWidth={1.5} dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Tools Grid */}
        <h2 className="mb-3 mt-6 font-display text-lg text-foreground">Tools</h2>
        <div className="grid grid-cols-3 gap-3">
          {tools.map((tool, i) => (
            <motion.button
              key={tool.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.05 }}
              onClick={() => setActiveTool(tool.id)}
              className="flex flex-col items-center gap-2 rounded-xl border border-border bg-card p-4 text-center transition-all hover:shadow-md active:scale-[0.97]"
            >
              <tool.icon className="h-5 w-5 text-muted-foreground" />
              <span className="text-xs font-medium text-foreground">{tool.name}</span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Tracker Detail Modal */}
      {activeTrackerConfig && (
        <TrackerDetail
          tracker={activeTrackerConfig}
          substance={substance}
          onClose={() => setActiveTracker(null)}
        />
      )}

      {/* Tool Modal */}
      {activeTool && (
        <ToolModal
          toolId={activeTool}
          substance={substance}
          onClose={() => setActiveTool(null)}
        />
      )}
    </div>
  );
};

const AnimatedNumber = ({ value, className }: { value: number; className?: string }) => {
  return (
    <motion.span
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={className}
    >
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {value}
      </motion.span>
    </motion.span>
  );
};

export default SubstancePage;
