/**
 * Client-side airport directory. The API only knows IATA codes (e.g. "CDG"), so this lets people
 * search by country or city name and translates their choice into the code the server expects.
 */
export interface Airport {
  code: string
  name: string
  city: string
  country: string
  /** Extra search terms: Hebrew names, common abbreviations, alternative spellings. */
  aliases?: string[]
}

const ISRAEL = ['ישראל']
const USA = ['USA', 'US', 'United States of America', 'America', 'ארצות הברית', 'ארה"ב', 'אמריקה']
const UK = ['UK', 'England', 'Britain', 'Great Britain', 'בריטניה', 'אנגליה']

export const AIRPORTS: Airport[] = [
  { code: 'TLV', name: 'Ben Gurion', city: 'Tel Aviv', country: 'Israel', aliases: [...ISRAEL, 'תל אביב', 'נתב"ג', 'בן גוריון'] },
  { code: 'ETH', name: 'Eilat', city: 'Eilat', country: 'Israel', aliases: [...ISRAEL, 'אילת'] },
  { code: 'ETM', name: 'Ramon', city: 'Eilat', country: 'Israel', aliases: [...ISRAEL, 'אילת', 'רמון'] },
  { code: 'HFA', name: 'Haifa', city: 'Haifa', country: 'Israel', aliases: [...ISRAEL, 'חיפה'] },

  { code: 'JFK', name: 'John F. Kennedy', city: 'New York', country: 'United States', aliases: [...USA, 'NYC', 'ניו יורק'] },
  { code: 'EWR', name: 'Newark Liberty', city: 'New York', country: 'United States', aliases: [...USA, 'NYC', 'Newark', 'ניו יורק', 'ניוארק'] },
  { code: 'LAX', name: 'Los Angeles International', city: 'Los Angeles', country: 'United States', aliases: [...USA, 'LA', 'לוס אנג\'לס'] },
  { code: 'MIA', name: 'Miami International', city: 'Miami', country: 'United States', aliases: [...USA, 'מיאמי'] },
  { code: 'ORD', name: "O'Hare", city: 'Chicago', country: 'United States', aliases: [...USA, 'שיקגו'] },
  { code: 'SFO', name: 'San Francisco International', city: 'San Francisco', country: 'United States', aliases: [...USA, 'סן פרנסיסקו'] },
  { code: 'BOS', name: 'Logan', city: 'Boston', country: 'United States', aliases: [...USA, 'בוסטון'] },
  { code: 'YYZ', name: 'Pearson', city: 'Toronto', country: 'Canada', aliases: ['קנדה', 'טורונטו'] },

  { code: 'LHR', name: 'Heathrow', city: 'London', country: 'United Kingdom', aliases: [...UK, 'לונדון', 'הית\'רו'] },
  { code: 'LGW', name: 'Gatwick', city: 'London', country: 'United Kingdom', aliases: [...UK, 'לונדון', 'גטוויק'] },
  { code: 'MAN', name: 'Manchester', city: 'Manchester', country: 'United Kingdom', aliases: [...UK, 'מנצ\'סטר'] },
  { code: 'CDG', name: 'Charles de Gaulle', city: 'Paris', country: 'France', aliases: ['צרפת', 'פריז'] },
  { code: 'ORY', name: 'Orly', city: 'Paris', country: 'France', aliases: ['צרפת', 'פריז'] },
  { code: 'NCE', name: "Côte d'Azur", city: 'Nice', country: 'France', aliases: ['צרפת', 'ניס'] },
  { code: 'FCO', name: 'Fiumicino', city: 'Rome', country: 'Italy', aliases: ['Roma', 'איטליה', 'רומא'] },
  { code: 'MXP', name: 'Malpensa', city: 'Milan', country: 'Italy', aliases: ['Milano', 'איטליה', 'מילאנו'] },
  { code: 'MAD', name: 'Barajas', city: 'Madrid', country: 'Spain', aliases: ['ספרד', 'מדריד'] },
  { code: 'BCN', name: 'El Prat', city: 'Barcelona', country: 'Spain', aliases: ['ספרד', 'ברצלונה'] },
  { code: 'LIS', name: 'Humberto Delgado', city: 'Lisbon', country: 'Portugal', aliases: ['Lisboa', 'פורטוגל', 'ליסבון'] },
  { code: 'AMS', name: 'Schiphol', city: 'Amsterdam', country: 'Netherlands', aliases: ['Holland', 'הולנד', 'אמסטרדם'] },
  { code: 'BRU', name: 'Brussels', city: 'Brussels', country: 'Belgium', aliases: ['בלגיה', 'בריסל'] },
  { code: 'FRA', name: 'Frankfurt', city: 'Frankfurt', country: 'Germany', aliases: ['Deutschland', 'גרמניה', 'פרנקפורט'] },
  { code: 'MUC', name: 'Franz Josef Strauss', city: 'Munich', country: 'Germany', aliases: ['München', 'Deutschland', 'גרמניה', 'מינכן'] },
  { code: 'BER', name: 'Brandenburg', city: 'Berlin', country: 'Germany', aliases: ['Deutschland', 'גרמניה', 'ברלין'] },
  { code: 'ZRH', name: 'Zurich', city: 'Zurich', country: 'Switzerland', aliases: ['Zürich', 'שווייץ', 'ציריך'] },
  { code: 'VIE', name: 'Vienna International', city: 'Vienna', country: 'Austria', aliases: ['Wien', 'אוסטריה', 'וינה'] },
  { code: 'PRG', name: 'Václav Havel', city: 'Prague', country: 'Czech Republic', aliases: ['Czechia', 'צ\'כיה', 'פראג'] },
  { code: 'BUD', name: 'Ferenc Liszt', city: 'Budapest', country: 'Hungary', aliases: ['הונגריה', 'בודפשט'] },
  { code: 'WAW', name: 'Chopin', city: 'Warsaw', country: 'Poland', aliases: ['פולין', 'ורשה'] },
  { code: 'ATH', name: 'Eleftherios Venizelos', city: 'Athens', country: 'Greece', aliases: ['יוון', 'אתונה'] },
  { code: 'LCA', name: 'Larnaca', city: 'Larnaca', country: 'Cyprus', aliases: ['קפריסין', 'לרנקה'] },
  { code: 'IST', name: 'Istanbul', city: 'Istanbul', country: 'Turkey', aliases: ['Türkiye', 'טורקיה', 'איסטנבול'] },
  { code: 'DXB', name: 'Dubai International', city: 'Dubai', country: 'United Arab Emirates', aliases: ['UAE', 'Emirates', 'איחוד האמירויות', 'דובאי'] },
  { code: 'BKK', name: 'Suvarnabhumi', city: 'Bangkok', country: 'Thailand', aliases: ['תאילנד', 'בנגקוק'] },
  { code: 'NRT', name: 'Narita', city: 'Tokyo', country: 'Japan', aliases: ['יפן', 'טוקיו'] },
  { code: 'DEL', name: 'Indira Gandhi', city: 'New Delhi', country: 'India', aliases: ['Delhi', 'הודו', 'דלהי'] },
]

const byCode = new Map(AIRPORTS.map((a) => [a.code, a]))

export const findAirport = (code: string | null | undefined) => (code ? byCode.get(code.toUpperCase()) : undefined)

/** "Paris – Charles de Gaulle (CDG)"; falls back to the bare code for airports not in the directory. */
export const airportLabel = (code: string) => {
  const airport = findAirport(code)
  return airport ? `${airport.city} – ${airport.name} (${airport.code})` : code
}

/** Case- and accent-insensitive form used for matching ("Zürich" → "zurich"). */
const normalize = (s: string) =>
  s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim()

/** Airports matching a country, city, airport name or code, best matches first. */
export function searchAirports(query: string, limit = 8): Airport[] {
  const q = normalize(query)
  if (!q) return []

  const scored: { airport: Airport; score: number }[] = []
  for (const airport of AIRPORTS) {
    const code = normalize(airport.code)
    const names = [airport.city, airport.country, airport.name, ...(airport.aliases ?? [])].map(normalize)

    let score = 0
    if (code === q) score = 100
    else if (names.some((n) => n === q)) score = 80
    else if (names.some((n) => n.startsWith(q))) score = 60
    else if (code.startsWith(q)) score = 50
    else if (names.some((n) => n.split(/[\s-]+/).some((word) => word.startsWith(q)))) score = 40
    else if (q.length >= 3 && names.some((n) => n.includes(q))) score = 20

    if (score > 0) scored.push({ airport, score })
  }

  return scored
    .sort((a, b) => b.score - a.score || a.airport.city.localeCompare(b.airport.city))
    .slice(0, limit)
    .map((s) => s.airport)
}

export type AirportResolution =
  | { kind: 'empty' }
  | { kind: 'code'; code: string }
  | { kind: 'ambiguous'; options: Airport[] }
  | { kind: 'unknown' }

/**
 * Turns free text into a single airport code, for when someone types and presses Enter without
 * picking from the list. A typed 3-letter code is passed through even if it isn't in the directory,
 * so flights an admin creates for other airports remain searchable.
 */
export function resolveAirport(text: string): AirportResolution {
  const trimmed = text.trim()
  if (!trimmed) return { kind: 'empty' }

  const codeInLabel = trimmed.match(/\(([A-Za-z]{3})\)$/)
  if (codeInLabel) return { kind: 'code', code: codeInLabel[1].toUpperCase() }

  if (findAirport(trimmed)) return { kind: 'code', code: trimmed.toUpperCase() }

  const matches = searchAirports(trimmed, 20)
  if (matches.length === 1) return { kind: 'code', code: matches[0].code }
  if (matches.length > 1) return { kind: 'ambiguous', options: matches }

  if (/^[A-Za-z]{3}$/.test(trimmed)) return { kind: 'code', code: trimmed.toUpperCase() }
  return { kind: 'unknown' }
}
