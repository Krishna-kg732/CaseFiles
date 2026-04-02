const WORDS_PER_MINUTE = 200;

/**
 * Estimate reading time from markdown body content.
 * Returns a human-readable string like "5 min read".
 */
export function getReadingTime(body: string): string {
  const text = body
    // strip frontmatter
    .replace(/^---[\s\S]*?---/, '')
    // strip HTML tags
    .replace(/<[^>]*>/g, '')
    // strip markdown formatting
    .replace(/[#*`~\[\]()>_]/g, '')
    .trim();

  const wordCount = text.split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(wordCount / WORDS_PER_MINUTE));

  return `${minutes} min read`;
}
