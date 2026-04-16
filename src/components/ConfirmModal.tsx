import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}

export const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message }: Props) => {
  const { t } = useTranslation();

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-sm rounded-[32px] bg-card p-6 shadow-2xl border border-border/50 text-center"
          >
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10 text-destructive mb-6">
              <AlertCircle className="h-7 w-7" />
            </div>
            
            <h3 className="text-xl font-bold text-foreground font-display">{title}</h3>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
              {message}
            </p>

            <div className="mt-8 grid grid-cols-2 gap-3">
              <button
                onClick={onClose}
                className="rounded-2xl bg-muted py-3.5 text-sm font-bold text-muted-foreground hover:bg-muted/80 transition-colors"
              >
                {t('quit.app.cancel', 'Cancel')}
              </button>
              <button
                onClick={() => {
                  onConfirm();
                  onClose();
                }}
                className="rounded-2xl bg-destructive py-3.5 text-sm font-bold text-destructive-foreground hover:bg-destructive/90 transition-colors shadow-lg shadow-destructive/20"
              >
                {t('quit.app.confirm', 'Yes, Reset')}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
