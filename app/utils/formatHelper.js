const excludedKeys = [ 'created_at', 'updated_at', 'deleted_at', 'picture_url', 'draft_picture', 'remove_picture' ]
const excludedCoordkeys = ['coordinate', 'coordinate_primary', 'coordinate_secondary']

export const formatCamelCase = (text) => {
  if (!text) return '-'

  return String(text).split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
}

export const formatPayload = (data) => {
  const payload = JSON.parse(JSON.stringify(data))

  excludedKeys.forEach(key => { delete payload[key] })
  excludedCoordkeys.forEach(key => {
    if (payload[key]) {
      const lat = parseFloat(payload[key].lat)
      const lng = parseFloat(payload[key].lng)

      if (isNaN(lat) || isNaN(lng)) delete payload[key]
      else { payload[key].lat = lat; payload[key].lng = lng }
    }
  })

  return payload
}

export const formatForm = (data, key) => {
  const fileData = data[key] !== undefined ? data[key] : data
  if (!fileData) return null

  const form = new FormData()
  form.append('file', fileData)
  return form
}
