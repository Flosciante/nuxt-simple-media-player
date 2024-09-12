export function formatDuration (seconds: number): string {
  const roundedSeconds = Math.floor(seconds)
  const minutes: number = Math.floor(roundedSeconds / 60)
  const remainingSeconds: number = (roundedSeconds % 60)
  const formattedSeconds = remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds

  return `${minutes}:${formattedSeconds}`
}
