import type { APIRoute } from 'astro';
import { getAllCases } from '@lib/cases';
import { SEVERITY_HEX } from '@lib/severity';

export const prerender = false;

export const GET: APIRoute = async ({ params }) => {
  const slug = params.slug?.replace('.png', '') ?? '';
  const cases = await getAllCases();
  const caseEntry = cases.find((c) => c.slug === slug);

  if (!caseEntry) {
    return new Response('Case not found', { status: 404 });
  }

  const { title, caseNumber, severity, systems, summary } = caseEntry.data;
  const severityColor = SEVERITY_HEX[severity];

  // Build SVG as a simple OG image (no Satori dependency for now — portable SVG approach)
  const svg = `
    <svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#fdf8f0" />
          <stop offset="100%" style="stop-color:#f4ddb2" />
        </linearGradient>
      </defs>

      <!-- Background -->
      <rect width="1200" height="630" fill="url(#bg)" />

      <!-- Top border line -->
      <rect x="0" y="0" width="1200" height="4" fill="${severityColor}" />

      <!-- Case number -->
      <text x="60" y="80" font-family="monospace" font-size="18" fill="#6b5e4f" letter-spacing="3">
        CASE FILE #${caseNumber}
      </text>

      <!-- Title -->
      <text x="60" y="180" font-family="Georgia, serif" font-size="48" font-weight="bold" fill="#1a1410">
        ${title.length > 35 ? `${title.slice(0, 35)}...` : title}
      </text>

      <!-- Summary -->
      <text x="60" y="240" font-family="sans-serif" font-size="22" fill="#6b5e4f">
        ${summary.length > 80 ? `${summary.slice(0, 80)}...` : summary}
      </text>

      <!-- Severity stamp -->
      <rect x="60" y="320" width="120" height="50" rx="4" fill="none" stroke="${severityColor}" stroke-width="3" transform="rotate(-3, 120, 345)" />
      <text x="90" y="353" font-family="monospace" font-size="24" font-weight="bold" fill="${severityColor}" transform="rotate(-3, 120, 345)">
        ${severity}
      </text>

      <!-- Systems -->
      ${systems
        .slice(0, 4)
        .map(
          (sys, i) => `
        <rect x="${220 + i * 160}" y="325" width="140" height="36" rx="4" fill="#1a1410" fill-opacity="0.06" />
        <text x="${290 + i * 160}" y="349" font-family="monospace" font-size="14" fill="#6b5e4f" text-anchor="middle">
          ${sys.length > 16 ? `${sys.slice(0, 16)}…` : sys}
        </text>
      `,
        )
        .join('')}

      <!-- Bottom bar -->
      <rect x="0" y="580" width="1200" height="50" fill="#1a1410" fill-opacity="0.05" />
      <text x="60" y="612" font-family="monospace" font-size="16" fill="#6b5e4f">
        casefiles.dev
      </text>
      <text x="1140" y="612" font-family="Georgia, serif" font-size="16" fill="#6b5e4f" text-anchor="end">
        CaseFiles
      </text>
    </svg>
  `;

  // Return SVG as image (browsers and social crawlers handle SVG OG images)
  return new Response(svg, {
    status: 200,
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800',
    },
  });
};
