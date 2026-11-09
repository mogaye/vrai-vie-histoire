import { BookItem } from '../data/booksData.ts';

export function filterBooksByQuery(items: BookItem[], query: string): BookItem[] {
  if (!query || query.trim() === '') return items;
  const normalized = query.toLowerCase().trim();
  return items.filter(item => 
    item.title.toLowerCase().includes(normalized) ||
    item.author.toLowerCase().includes(normalized) ||
    item.genre.toLowerCase().includes(normalized) ||
    item.year.toLowerCase().includes(normalized) ||
    item.description.toLowerCase().includes(normalized) ||
    (item.pages && item.pages.toLowerCase().includes(normalized))
  );
}

export function filterBooksByCategory(
  items: BookItem[],
  categoryFilter: string
): BookItem[] {
  if (!categoryFilter || categoryFilter === 'all') return items;
  return items.filter(item => {
    const genreLower = item.genre.toLowerCase();
    if (categoryFilter === 'afrique') return genreLower.includes('afrique');
    if (categoryFilter === 'europe') return genreLower.includes('europe');
    if (categoryFilter === 'asie') return genreLower.includes('asie');
    if (categoryFilter === 'ameriques') return genreLower.includes('amérique');
    if (categoryFilter === 'monde') return genreLower.includes('monde');
    return true;
  });
}

export function filterBooksByPart(
  items: BookItem[],
  partFilter: 'all' | '1' | '2'
): BookItem[] {
  if (partFilter === 'all') return items;
  return items.filter(item => {
    if (partFilter === '1') return item.pages?.includes('Partie 1');
    if (partFilter === '2') return item.pages?.includes('Partie 2');
    return true;
  });
}

export function formatBookMeta(item: BookItem): string {
  const parts: string[] = [];
  if (item.author) parts.push(item.author);
  if (item.year) parts.push(item.year);
  if (item.pages) parts.push(item.pages);
  return parts.join(' · ');
}
