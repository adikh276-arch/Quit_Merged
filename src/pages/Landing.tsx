import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { substances } from '@/data/substances';
import { getStreak } from '@/data/storage';
import { Shield } from 'lucide-react';

const SubstanceCard = ({ substance, index }: { substance: typeof substances[0]; index: number }) => {
  const navigate = useNavigate();
  const streak = getStreak(substance.slug);

  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.4 }}
      onClick={() => navigate(`/${substance.slug}`)}
      className="flex flex-col items-start gap-2 rounded-xl border border-border bg-card p-4 text-left transition-all hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
      style={{ borderLeftWidth: 4, borderLeftColor: `hsl(var(${substance.accentVar}))` }}
    >
      <div className="flex w-full items-center justify-between">
        <span className="text-2xl">{substance.icon}</span>
        {streak.days > 0 && (
          <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
            {streak.days}d
          </span>
        )}
      </div>
      <div>
        <h3 className="font-display text-base font-semibold text-foreground">{substance.name}</h3>
        <p className="text-xs text-muted-foreground">{substance.descriptor}</p>
      </div>
    </motion.button>
  );
};

const Landing = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-lg px-4 pb-8 pt-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center"
        >
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5">
            <Shield className="h-4 w-4 text-primary" />
            <span className="text-xs font-medium text-primary">Private & Secure</span>
          </div>
          <h1 className="font-display text-4xl tracking-tight text-foreground">
            QuitMantra
          </h1>
          <p className="mt-2 text-base text-muted-foreground">
            Your recovery, tracked with clarity.
          </p>
        </motion.div>

        {/* Substance Grid */}
        <div className="grid grid-cols-2 gap-3">
          {substances.map((substance, i) => (
            <SubstanceCard key={substance.slug} substance={substance} index={i} />
          ))}
        </div>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-8 text-center text-xs text-muted-foreground"
        >
          🔒 All data stays on your device. Nothing is shared.
        </motion.p>
      </div>
    </div>
  );
};

export default Landing;
