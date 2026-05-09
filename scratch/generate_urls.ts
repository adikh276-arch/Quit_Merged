import { substances } from '../src/data/substances';

const baseUrl = 'https://platform.mantracare.com/quit';

substances.forEach(s => {
  console.log(`\n### ${s.name} Module`);
  console.log(`${baseUrl}/${s.slug}`);
  console.log(`${baseUrl}/${s.slug}/onboarding/0`);
  
  s.trackers.forEach(t => {
    console.log(`${baseUrl}/${s.slug}/tracker/${t.id}`);
  });
  
  console.log(`${baseUrl}/${s.slug}/tool/assessment`);
  console.log(`${baseUrl}/${s.slug}/tool/calculator`);
  
  s.activities.forEach(a => {
    console.log(`${baseUrl}/${s.slug}/tool/activities/${a.id}`);
  });
  
  s.articles.forEach(art => {
    console.log(`${baseUrl}/${s.slug}/tool/learn/${art.id}`);
  });
});
