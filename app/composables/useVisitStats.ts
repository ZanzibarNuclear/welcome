type VisitStatsCookie = {
  daysVisited?: number
  firstVisitDate?: string
  lastVisitDate?: string
}

const VISITOR_COOKIE_NAME = 'aa_visitor_id'
const VISIT_STATS_COOKIE_NAME = 'aa_visit_stats'
const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 400

const cookieOptions = {
  maxAge: COOKIE_MAX_AGE_SECONDS,
  path: '/',
  sameSite: 'lax' as const
}

function getLocalDateKey(date = new Date()) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

function createVisitorId() {
  if (globalThis.crypto?.randomUUID) {
    return globalThis.crypto.randomUUID()
  }

  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (character) => {
    const random = Math.floor(Math.random() * 16)
    const value = character === 'x' ? random : (random & 0x3) | 0x8

    return value.toString(16)
  })
}

function normalizeVisitStats(value: VisitStatsCookie | null | undefined): Required<VisitStatsCookie> {
  const rawDaysVisited = value?.daysVisited
  const daysVisited = Number.isFinite(rawDaysVisited)
    ? Math.max(0, Math.trunc(rawDaysVisited ?? 0))
    : 0

  return {
    daysVisited,
    firstVisitDate: value?.firstVisitDate || '',
    lastVisitDate: value?.lastVisitDate || ''
  }
}

export function useVisitStats() {
  const visitorIdCookie = useCookie<string | null>(VISITOR_COOKIE_NAME, cookieOptions)
  const visitStatsCookie = useCookie<VisitStatsCookie | null>(VISIT_STATS_COOKIE_NAME, cookieOptions)

  const initialStats = normalizeVisitStats(visitStatsCookie.value)

  const visitorId = useState('visit-stats:visitor-id', () => visitorIdCookie.value || '')
  const daysVisited = useState('visit-stats:days-visited', () => initialStats.daysVisited)
  const firstVisitDate = useState('visit-stats:first-visit-date', () => initialStats.firstVisitDate)
  const lastVisitDate = useState('visit-stats:last-visit-date', () => initialStats.lastVisitDate)
  const today = useState('visit-stats:today', () => getLocalDateKey())

  const hasVisitedBefore = computed(() => Boolean(visitorId.value && lastVisitDate.value))
  const isReturningVisitor = computed(() => daysVisited.value > 1)

  function syncState(nextStats: Required<VisitStatsCookie>) {
    daysVisited.value = nextStats.daysVisited
    firstVisitDate.value = nextStats.firstVisitDate
    lastVisitDate.value = nextStats.lastVisitDate
  }

  function recordToday() {
    today.value = getLocalDateKey()

    if (!visitorIdCookie.value) {
      visitorIdCookie.value = createVisitorId()
    }

    visitorId.value = visitorIdCookie.value || ''

    const currentStats = normalizeVisitStats(visitStatsCookie.value)

    if (currentStats.lastVisitDate === today.value) {
      syncState(currentStats)
      return
    }

    const nextStats = {
      daysVisited: currentStats.daysVisited + 1,
      firstVisitDate: currentStats.firstVisitDate || today.value,
      lastVisitDate: today.value
    }

    visitStatsCookie.value = nextStats
    syncState(nextStats)
  }

  return {
    visitorId,
    daysVisited,
    firstVisitDate,
    lastVisitDate,
    today,
    hasVisitedBefore,
    isReturningVisitor,
    recordToday
  }
}
