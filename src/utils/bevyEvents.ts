export interface BevyEvent {
  title: string;
  startDate: string;
  endDate: string;
  url: string;
  imageUrl: string;
  descriptionShort: string;
  eventTypeTitle: string;
  isFree: boolean;
  formattedDate: string;
}

export const BEVY_CHAPTER_ID = 3520;
export const BEVY_UPCOMING_API_URL =
  `https://gdg.community.dev/api/event_slim/for_chapter/${BEVY_CHAPTER_ID}/` +
  '?page_size=4&status=Live&include_cohosted_events=true&visible_on_parent_chapter_only=true' +
  '&order=start_date&fields=title,start_date,end_date,event_type_title,cropped_picture_url,url,description_short,chapter_id&page=1';

export function formatBevyEventDate(startIso: string, endIso?: string): string {
  const start = new Date(startIso);
  if (Number.isNaN(start.getTime())) return '';

  const tz = 'Europe/Madrid';
  const dayMonthFmt = new Intl.DateTimeFormat('es-ES', {
    day: 'numeric',
    month: 'short',
    timeZone: tz,
  });
  const timeFmt = new Intl.DateTimeFormat('es-ES', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: tz,
  });
  const isoDayFmt = new Intl.DateTimeFormat('en-CA', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    timeZone: tz,
  });

  const startDay = dayMonthFmt.format(start);
  const startTime = timeFmt.format(start);

  if (endIso) {
    const end = new Date(endIso);
    if (!Number.isNaN(end.getTime()) && isoDayFmt.format(start) !== isoDayFmt.format(end)) {
      const endDay = dayMonthFmt.format(end);
      return `${startDay} – ${endDay} · ${startTime} h`;
    }
  }

  return `${startDay} · ${startTime} h`;
}

export async function fetchUpcomingBevyEvents(): Promise<BevyEvent[]> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 6000);

  try {
    const res = await fetch(BEVY_UPCOMING_API_URL, {
      headers: { Accept: 'application/json' },
      signal: controller.signal,
    });
    if (!res.ok) return [];

    const payload = await res.json();
    const results = Array.isArray(payload?.results) ? payload.results : [];
    const now = Date.now();

    return results
      .filter((ev: any) => {
        if (!ev || !ev.title || !ev.url) return false;
        const endTs = Date.parse(ev.end_date || ev.start_date || '');
        return !Number.isNaN(endTs) && endTs > now;
      })
      .sort((a: any, b: any) => Date.parse(a.start_date || '') - Date.parse(b.start_date || ''))
      .map((ev: any) => {
        const typeStr = String(ev.event_type_title || '').trim();
        const isFree = /free|grat/i.test(typeStr);
        return {
          title: String(ev.title).trim(),
          startDate: String(ev.start_date || ''),
          endDate: String(ev.end_date || ev.start_date || ''),
          url: String(ev.url).trim(),
          imageUrl: String(ev.cropped_picture_url || '').trim(),
          descriptionShort: String(ev.description_short || '').trim(),
          eventTypeTitle: typeStr,
          isFree,
          formattedDate: formatBevyEventDate(ev.start_date, ev.end_date),
        };
      });
  } catch {
    return [];
  } finally {
    clearTimeout(timer);
  }
}
