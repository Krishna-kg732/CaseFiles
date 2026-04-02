import { persistentAtom } from '@nanostores/persistent';

/**
 * Track which case slugs the user has opened/read.
 * Used to show "CASE READ" stamp overlay on cards.
 */
export const readCases = persistentAtom<string[]>('read-cases', [], {
  encode: JSON.stringify,
  decode: JSON.parse,
});

/**
 * Track which case slugs are bookmarked.
 * Shows a bookmark ribbon on index cards.
 */
export const bookmarkedCases = persistentAtom<string[]>('bookmarks', [], {
  encode: JSON.stringify,
  decode: JSON.parse,
});

/**
 * Currently active filters for the index page.
 */
export const activeFilter = persistentAtom<{
  domain: string | null;
  severity: string | null;
  status: string | null;
}>(
  'active-filter',
  { domain: null, severity: null, status: null },
  { encode: JSON.stringify, decode: JSON.parse },
);

/**
 * User preference for dossier view vs grid view.
 */
export const prefersDossierView = persistentAtom<boolean>(
  'dossier-view',
  false,
  { encode: JSON.stringify, decode: JSON.parse },
);

// ─── Helper functions ─────────────────────────────────

export function markCaseAsRead(slug: string): void {
  const current = readCases.get();
  if (!current.includes(slug)) {
    readCases.set([...current, slug]);
  }
}

export function toggleBookmark(slug: string): void {
  const current = bookmarkedCases.get();
  if (current.includes(slug)) {
    bookmarkedCases.set(current.filter((s) => s !== slug));
  } else {
    bookmarkedCases.set([...current, slug]);
  }
}

export function isBookmarked(slug: string): boolean {
  return bookmarkedCases.get().includes(slug);
}

export function isCaseRead(slug: string): boolean {
  return readCases.get().includes(slug);
}
