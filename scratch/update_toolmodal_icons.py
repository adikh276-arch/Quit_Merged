import re

with open('src/components/ToolModal.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Add imports
lucide_import = "import { X, ChevronRight, ArrowUp, Lock, Check, Play, Pause } from 'lucide-react';"
new_lucide_import = "import { X, ChevronRight, ArrowUp, Lock, Check, Play, Pause, Trophy, Sparkles, Heart, BookmarkCheck, Bookmark, Target, Zap } from 'lucide-react';"
dynamic_import = "import { DynamicIcon } from './DynamicIcon';"

if lucide_import in content:
    content = content.replace(lucide_import, new_lucide_import + "\n" + dynamic_import)

# Replace scene emoji in visualization
# <span className="text-6xl">{scene?.emoji || '🌟'}</span>
content = content.replace('<span className="text-6xl">{scene?.emoji || \'🌟\'}</span>', '<DynamicIcon name={scene?.emoji || "sparkle"} className="h-16 w-16 text-primary" />')

# Replace tap game success trophy
# <div className="text-6xl mb-4">🏆</div>
content = content.replace('<div className="text-6xl mb-4">🏆</div>', '<div className="flex justify-center mb-4"><Trophy className="h-16 w-16 text-yellow-500" /></div>')

# Replace tap game button emoji
# <span className="text-3xl text-primary-foreground">👊</span>
content = content.replace('<span className="text-3xl text-primary-foreground">👊</span>', '<Zap className="h-10 w-10 text-primary-foreground fill-primary-foreground" />')

# Replace affirmation emojis
# <span className="text-4xl mb-4">{affSaved.has(affIndex) ? '💛' : '✨'}</span>
content = content.replace("<span className=\"text-4xl mb-4\">{affSaved.has(affIndex) ? '💛' : '✨'}</span>", '<div className="flex justify-center mb-4">{affSaved.has(affIndex) ? <Heart className="h-10 w-10 text-primary fill-primary" /> : <Sparkles className="h-10 w-10 text-primary/40" />}</div>')

# Replace affirmation button text emojis
# affSaved.has(affIndex) ? `💛 ${t('quit.app.activities.affirmation.saved', 'Saved')}` : `🤍 ${t('quit.app.activities.affirmation.save', 'Save')}`
content = content.replace("affSaved.has(affIndex) ? `💛 ${t('quit.app.activities.affirmation.saved', 'Saved')}` : `🤍 ${t('quit.app.activities.affirmation.save', 'Save')}`", "affSaved.has(affIndex) ? <span className=\"flex items-center gap-2\"><BookmarkCheck className=\"h-4 w-4\" /> {t('quit.app.activities.affirmation.saved')}</span> : <span className=\"flex items-center gap-2\"><Bookmark className=\"h-4 w-4\" /> {t('quit.app.activities.affirmation.save')}</span>")

# Replace body scan complete emoji
# <div className="text-5xl mb-4">🧘</div>
content = content.replace('<div className="text-5xl mb-4">🧘</div>', '<div className="flex justify-center mb-4"><Target className="h-16 w-16 text-primary" /></div>')

# Replace body scan zone emojis (mapping grid)
# <span className="text-2xl">{zone.emoji}</span>
content = content.replace('<span className="text-2xl">{zone.emoji}</span>', '<div className="flex justify-center mb-1"><DynamicIcon name={zone.emoji} className="h-6 w-6 text-primary" /></div>')

# Replace body scan zone emoji (active scanning)
# <span className="text-5xl">{zone.emoji}</span>
content = content.replace('<span className="text-5xl">{zone.emoji}</span>', '<div className="flex justify-center mb-1"><DynamicIcon name={zone.emoji} className="h-12 w-12 text-primary" /></div>')

# Clean up journal success text if it had an emoji in code (it didn't seem to have it in the view_file, but just in case)
content = content.replace("📝 {t('quit.app.activities.journal.captured'", "{t('quit.app.activities.journal.captured'")

with open('src/components/ToolModal.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
