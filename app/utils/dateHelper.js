import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTime)
export const formatLastUpdate = (dateString) => {
  if (!dateString) return '-'
  return `Last update ${dayjs(dateString).fromNow()}`
}

export const formatTimestamp = (dateString) => {
  if (!dateString) return '-'
  return dayjs(dateString).format('DD MMM YYYY, HH:mm')
}

export const formatRange = () => {
  const start_date = dayjs().subtract(1, 'year')
  const end_date = dayjs()

  return {
    start_date: start_date.format('YYYY-MM-DD'),
    end_date: end_date.format('YYYY-MM-DD')
  }
}
