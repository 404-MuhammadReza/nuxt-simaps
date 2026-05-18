
import { formatPayload, formatForm } from "~/utils/formatHelper"
import { useCustomFetch } from "~/composables/useCustomFetch"
import { useAppStore } from "~/stores/useAppStore"

export const useAPI = () => {
  const appStore = useAppStore()
  const { setNotification } = appStore

  const loading = ref(false)
  const badRequest = ref([])

  const fetchAddress = async (payload) => {
    const response = await useCustomFetch(`/api/geocoding/address`, {
      method: 'POST',
      body: payload
    })

    return response
  }

  const fetchLogs = (feature, action) => {
    useCustomFetch(`/api/logs`, {
      method: 'POST',
      body: { feature, action }
    })
  }

  // Get user/employee/hospital/usage data
  const fetchData = async (entity) => {
    const response = await useCustomFetch(`/api/${entity}`)
    return response || []
  }

  // Get usage details
  const fetchUsage = async (payload) => {
    const response = await useCustomFetch('/api/admin/logs/details', {
      params: payload,
      notifyError: true
    })

    return response || []
  }

  // Submit create/update data
  const fetchSubmit = async (entity, data) => {
    loading.value = true
    badRequest.value = []

    const form = formatForm(data, 'draft_picture')
    const remove = data.remove_picture || false
    const payload = formatPayload(data)

    const target = `${entity}s`
    const url = payload.id
      ? `/api/admin/${target}/${payload.id}`
      : `/api/admin/${target}`

    try {
      const dataResponse = await useCustomFetch(url, {
        method: payload.id ? 'PUT' : 'POST',
        body: payload,
        withErr: true
      })

      const id = payload.id || dataResponse.id
      const pictureResponse = await fetchPicture(entity, form, remove, id)
      console.log("🚀 ~ fetchSubmit ~ pictureResponse:", pictureResponse)


      await refreshNuxtData(target)
      if (pictureResponse) {

        setNotification('success', 'Successfully saved data')
      }

      return pictureResponse.id ? pictureResponse : dataResponse
    } catch (error) {
      if (Array.isArray(error)) badRequest.value = error
      else setNotification('danger', error)

      return null
    } finally { loading.value = false }
  }

  // Upload or delete picture for employee
  const fetchPicture = async (entity, form, remove, id) => {
    if (entity !== 'employee' || (!form && !remove)) return true
    const url = `/api/admin/employees/${id}/picture`

    try {
      const response = await useCustomFetch(url, {
        method: remove ? 'DELETE' : 'PUT',
        body: remove ? undefined : form,
        withErr: true
      })

      return response
    } catch {
      const action = remove ? 'remove' : 'upload'
      setNotification('warning', `Successfully saved data, but failed to ${action} picture`)
      return false
    }
  }

  const result = ref(null)
  const report = ref(null)
  const resetResult = () => {
    result.value = null
    report.value = null
  }

  // Download Excel template for bulk create
  const fetchTemplate = async (entity) => {
    const target = `${entity}s`
    const url = `/api/admin/${target}/many/template`
    const response = await useCustomFetch(url, {
      method: 'GET',
      responseType: 'blob',
      notifyError: true
    })
    if (response) {
      setNotification('success', 'Successfully downloaded template')
      download(response, `${target}-template`, 'xlsx')
    }
  }

  // Upload Excel file for bulk create
  const fetchExcel = async (entity, excel) => {
    loading.value = true
    const target = `${entity}s`
    const form = formatForm(excel)

    try {
      const response = await useCustomFetch(`/api/admin/${target}/many`, {
        method: 'POST',
        body: form,
        withErr: true
      })

      if (!response) {
        setNotification('danger', 'Failed to import data')
        loading.value = false
        return
      }

      await refreshNuxtData(target)
      const total = response?.total_processed || 0
      const success = response?.success_count || 0

      if (total === success) {
        const message = `Successfully added ${success} ${target}`
        setNotification('success', message)
        result.value = { status: 'success', title: 'Upload Successfully', message }
      } else if (success > 0) {
        const message = `Successfully added ${success} out of ${total} ${target}`
        setNotification('warning', message)
        result.value = { status: 'warning', title: 'Upload Completed with Errors', message }
      } else {
        const message = `Failed to add ${total} ${target}`
        setNotification('danger', message)
        result.value = { status: 'danger', title: 'Upload Failed', message }
      }

      report.value = response
      return true
    } catch (error) {
      setNotification('danger', error)
      return false
    } finally { loading.value = false }
  }

  // Delete employee/hospital data
  const fetchDelete = async (entity, id) => {
    loading.value = true
    const target = `${entity}s`
    const url = `/api/admin/${target}/${id}`
    const response = await useCustomFetch(url, {
      method: 'DELETE',
      notify: true
    })

    if (response) await refreshNuxtData(target)
    loading.value = false

    return response
  }

  // Export employee/hospital data to Excel
  const fetchExport = async (entity) => {
    loading.value = true
    const target = `${entity}s`
    const url = `/api/admin/${target}/export`
    const response = await useCustomFetch(url, {
      method: 'GET',
      responseType: 'blob',
      notifyError: true
    })

    if (response) {
      setNotification('success', 'Successfully export data')
      download(response, target, 'xlsx')
    } else setNotification('danger', 'Failed to export data')
    loading.value = false
  }

  const fetchReport = async (entity) => {
    if (!report.value) return

    const target = `${entity}s`
    const url = `/api/admin/${target}/many/report`
    const response = await useCustomFetch(url, {
      method: 'POST',
      body: report.value,
      notifyError: true
    })

    if (response) {
      setNotification('success', 'Successfully downloaded report')
      download(response, `${entity}-report`, 'xlsx')
    }
  }

  return {
    loading, result, badRequest, fetchLogs, fetchAddress, fetchData,
    fetchUsage, fetchSubmit, fetchDelete, fetchExport, fetchExcel, fetchTemplate, resetResult, fetchReport
  }
}

// Helper function to trigger file download in browser
const download = (url, filename, extension) => {
  const dummy = window.URL.createObjectURL(url)
  const link = document.createElement('a')

  link.href = dummy
  link.setAttribute('download', `${filename}.${extension}`)

  link.click()
  window.URL.revokeObjectURL(dummy)
}
