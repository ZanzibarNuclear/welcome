export default defineNuxtPlugin(() => {
  const { recordToday } = useVisitStats()

  recordToday()
})
