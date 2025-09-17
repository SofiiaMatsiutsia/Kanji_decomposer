
import { WaniKaniCollection, KanjiDetail, WaniKaniSubject, Radical } from '../types';

const WANIKANI_API_TOKEN = '2741ad3d-28b2-49b3-a102-866be002fecd';
const WANIKANI_API_BASE_URL = 'https://api.wanikani.com/v2';

async function fetchWaniKani<T,>(endpoint: string): Promise<T> {
  const response = await fetch(`${WANIKANI_API_BASE_URL}/${endpoint}`, {
    headers: {
      'Authorization': `Bearer ${WANIKANI_API_TOKEN}`,
      'WaniKani-Revision': '20170710',
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`WaniKani API error: ${errorData.error || response.statusText}`);
  }

  return response.json();
}

const getPrimaryMeaning = (subject: WaniKaniSubject): string => {
  const primaryMeaning = subject.data.meanings.find(m => m.primary);
  return primaryMeaning ? primaryMeaning.meaning : 'Meaning not found';
};

export async function getKanjiAndRadicals(kanjiCharacters: string[]): Promise<KanjiDetail[]> {
  if (kanjiCharacters.length === 0) {
    return [];
  }

  // 1. Fetch all kanji subjects in one go
  const kanjiSlugs = kanjiCharacters.join(',');
  const kanjiCollection = await fetchWaniKani<WaniKaniCollection>(`subjects?types=kanji&slugs=${kanjiSlugs}`);
  
  if (!kanjiCollection.data || kanjiCollection.data.length === 0) {
      return [];
  }

  // 2. Collect all unique radical IDs from the fetched kanji
  const allRadicalIds = new Set<number>();
  kanjiCollection.data.forEach(kanji => {
    kanji.data.component_subject_ids?.forEach(id => allRadicalIds.add(id));
  });

  if (allRadicalIds.size === 0) {
      // Handle cases where kanji might not have component radicals listed
       return kanjiCollection.data.map(kanji => ({
        id: kanji.id,
        character: kanji.data.slug,
        meaning: getPrimaryMeaning(kanji),
        radicals: [],
      }));
  }

  // 3. Fetch all required radical subjects in one go
  const radicalIds = Array.from(allRadicalIds).join(',');
  const radicalCollection = await fetchWaniKani<WaniKaniCollection>(`subjects?ids=${radicalIds}`);
  
  const radicalsMap = new Map<number, Radical>();
  radicalCollection.data.forEach(radical => {
      radicalsMap.set(radical.id, {
        id: radical.id,
        character: radical.data.characters,
        meaning: getPrimaryMeaning(radical),
      });
  });

  // 4. Map the radicals back to their parent kanji
  const kanjiDetails = kanjiCollection.data.map(kanji => {
    const kanjiRadicals = kanji.data.component_subject_ids
      ?.map(id => radicalsMap.get(id))
      .filter((r): r is Radical => r !== undefined) || [];

    return {
      id: kanji.id,
      character: kanji.data.slug,
      meaning: getPrimaryMeaning(kanji),
      radicals: kanjiRadicals,
    };
  });

  return kanjiDetails;
}
