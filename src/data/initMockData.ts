import { substances } from './substances';
import { saveEntry, setStreak, dateStr } from './storage';

export function initializeMockData() {
  const key = 'quitmantra_initialized';
  if (localStorage.getItem(key)) return;

  substances.forEach(substance => {
    // Set streak
    setStreak(substance.slug, 21, dateStr(21));

    // Generate 21 days of mock data for each tracker
    substance.trackers.forEach(tracker => {
      for (let day = 0; day < 21; day++) {
        const date = dateStr(20 - day);
        const values = tracker.mockGenerator(day);
        saveEntry(substance.slug, tracker.id, date, { date, values, notes: values.notes || '' });
      }
    });
  });

  localStorage.setItem(key, 'true');
}
