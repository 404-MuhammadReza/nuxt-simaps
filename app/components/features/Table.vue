<script setup>
import IconSort from '~/assets/icons/general/sort.svg?component';
import IconArrowRight from '~/assets/icons/arrow/right.svg?component';

const props = defineProps({
  entity: { type: String, required: true },
  data: { type: Array, required: true },
  query: { type: String, default: '' },
  disabled: { type: Boolean, default: false }
})

const { isMobile } = useDevice()
const tableMap = computed(() => {
  let mapping
  switch(props.entity) {
    case 'employee': mapping = {
      template: '1fr 2fr 2fr 1rem',
      columns: [
        { key: 'employee_id', label: 'Employee ID', align: 'left', type: 'text' },
        { key: 'name', label: 'Name', align: 'left', type: 'text' },
        { key: 'position', label: 'Position', align: 'left', type: 'text' }
      ]
    }; break
    case 'hospital': mapping = {
      template: '1fr 2fr 1rem',
      columns: [
        { key: 'name', label: 'Hospital', align: 'left', type: 'text' },
        { key: 'address', label: 'Address', align: 'left', type: 'text' }
      ]
    }; break
    case 'user': mapping = {
      template: '1.25fr 1fr 1.5fr 0.5fr 1rem',
      columns: [
        { key: 'name', label: 'Name', align: 'left', type: 'text' },
        { key: 'email', label: 'Email', align: 'left', type: 'text' },
        { key: 'microsoft_id', label: 'Microsoft ID', align: 'left', type: 'text' },
        { key: 'role', label: 'Role', align: 'left', type: 'json' }
      ]
    }; break
    case 'usage': mapping = {
      template: '2.5fr 1fr 1fr 1fr 1fr 1fr 1rem',
      columns: [
        { key: 'feature', label: 'Feature', align: 'left', type: 'text' },
        { key: 'today', label: 'Today', align: 'center', type: 'text' },
        { key: 'week', label: 'This Week', align: 'center', type: 'text' },
        { key: 'month', label: 'This Month', align: 'center', type: 'text' },
        { key: 'six_months', label: 'Last 6 Months', align: 'center', type: 'text' },
        { key: 'year', label: 'This Year', align: 'center', type: 'text' }
      ]
    }; break
    case 'usageDetails': mapping = {
      template: '1fr 2fr 0.75fr 1rem',
      columns: [
        { key: 'user_name', label: 'User', align: 'left', type: 'text' },
        { key: 'action', label: 'Action', align: 'left', type: 'text' },
        { key: 'timestamp', label: 'Timestamp', align: 'center', type: 'date' }
      ]
    }; break
    default: mapping = { columns: [], template: '' }; break
  }

  if (isMobile.value) {
    mapping.columns = mapping.columns.filter(col =>
      ['name', 'hospital', 'feature', 'today', 'user_name', 'action'].includes(col.key)
    )

    const columnCount = mapping.columns.length
    mapping.template = '1fr '.repeat(columnCount) + '1rem'
  }

  if (props.disabled) {
    mapping.template = mapping.template.replace(/\s*1rem$/, '')
  }

  return mapping
})

const sort = ref({ key: '', order: 'asc' })
const handleSort = (key) => {
  if (sort.value.key === key) {
    sort.value.order = sort.value.order === 'asc' ? 'desc' : 'asc'
  } else {
    sort.value.key = key
    sort.value.order = 'asc'
  }
}

const tableData = computed(() => {
  let result = [...props.data]

  if (props.query) {
    const lowerQuery = props.query.toLowerCase()
    result = result.filter(row => {
      return tableMap.value.columns.some(col => {
        const cellValue = row[col.key]
        if (cellValue == null) return false
        return String(cellValue).toLowerCase().includes(lowerQuery)
      })
    })
  }

  if (sort.value.key) {
    result.sort((a, b) => {
      const valA = a[sort.value.key] ?? ''
      const valB = b[sort.value.key] ?? ''

      if (typeof valA === 'number' && typeof valB === 'number') {
        return sort.value.order === 'asc' ? valA - valB : valB - valA
      }

      const strA = String(valA).toLowerCase()
      const strB = String(valB).toLowerCase()

      if (strA < strB) return sort.value.order === 'asc' ? -1 : 1
      if (strA > strB) return sort.value.order === 'asc' ? 1 : -1
      return 0
    })
  }

  return result
})

const handleRowClick = (row) => {
  if (props.disabled) return
  emit('row-click', row)
}

const emit = defineEmits(['update-length', 'row-click'])
watch(tableData, (newData) => {
  emit('update-length', newData.length)
}, { immediate: true })
</script>

<template>
  <div class="table-wrapper">
    <div class="head">
      <div v-for="(column, index) in tableMap.columns" :key="index" class="column" :class="column.align">
        <div class="item" @click="handleSort(column.key)">
          <IconSort :icon="IconSort" class="icon-sort" />
          <span>{{ column.label }}</span>
        </div>
      </div>
    </div>
    <div v-if="tableData.length > 0" class="body">
      <div v-for="(row, rowIndex) in tableData" :key="rowIndex" class="row" @click="handleRowClick(row)">
        <div v-for="(column, colIndex) in tableMap.columns" :key="colIndex" class="column" :class="column.align">
          <div class="item" :class="column.type">
            <span v-if="column.type === 'date'">{{ formatTimestamp(row[column.key]) }}</span>
            <span v-else-if="column.type === 'json'">{{ formatCamelCase(row[column.key]) }}</span>
            <span v-else>{{ row[column.key] }}</span>
          </div>
        </div>
        <IconArrowRight v-if="!disabled" class="icon-arrow" />
      </div>
    </div>
    <div v-else class="body empty">
      <span>No data available</span>
    </div>
  </div>
</template>

<style scoped>
.table-wrapper {
  width: 100%;
  overflow: hidden;
}

.table-wrapper .head,
.table-wrapper .body .row {
  width: 100%;

  display: grid;
  grid-template-columns: v-bind('tableMap.template');
  align-items: center;
  gap: var(--size-m);
}

.table-wrapper .head {
  position: sticky;
  top: 0; z-index: 1;

  padding: var(--size-m) var(--size-xxl);
  border-bottom: 1px solid var(--grey-200);
}

.table-wrapper .head .column,
.table-wrapper .body .row .column {
  display: flex;
  align-items: center;
  overflow: hidden;
}

.table-wrapper .head .column.left,
.table-wrapper .body .row .column.left {
  justify-content: start;
}

.table-wrapper .head .column.center,
.table-wrapper .body .row .column.center {
  justify-content: center;
}

.table-wrapper .head .column .item {
  width: fit-content;

  display: flex;
  align-items: center;
  gap: var(--size-xxs);
  overflow: hidden;

  cursor: pointer;
}

.table-wrapper .head .column .item .icon-sort {
  width: var(--size-m);
  height: var(--size-m);

  color: var(--grey-200);
  transition: color var(--transition-normal) var(--transition-smooth);
}

.table-wrapper .head .column .item:hover .icon-sort {
  color: var(--primary-100);
}

.table-wrapper .head .column .item span {
  font-family: var(--font-primary);
  font-size: var(--size-m);
  font-weight: var(--font-semi-bold);

  color: var(--black);
}

.table-wrapper .body {
  width: 100%;
  max-height: 450px;

  display: flex;
  flex-direction: column;

  gap: var(--size-xs);
  padding: var(--size-xs);

  overflow-y: auto;
  scrollbar-width: thin;

  background-color: var(--grey-50);
  scrollbar-color: var(--grey-200) transparent;
}

.table-wrapper .body .row {
  width: 100%;

  cursor: pointer;
  padding: var(--size-m);
  border-radius: var(--size-xs);

  background-color: var(--white);
  border: 1px solid var(--grey-200);

  transition: transform var(--transition-fast) var(--transition-smooth),
              box-shadow var(--transition-fast) var(--transition-smooth);
}

.table-wrapper .body .row:hover {
  transform: scale(1.01);
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
}

.table-wrapper .body .row .column .item {
  width: fit-content;

  display: flex;
  align-items: center;
  gap: var(--size-xxs);
  overflow: hidden;
}

.table-wrapper .body .row .column span {
  display: block;

  font-family: var(--font-primary);
  font-size: var(--size-m);
  font-weight: var(--font-regular);

  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;

  color: var(--black);
}

.table-wrapper .body .row .icon-arrow {
  width: var(--size-l);
  height: var(--size-l);

  stroke-width: 1.5px;
  justify-self: end;

  color: var(--grey-200);
  transition: color var(--transition-normal) var(--transition-smooth);
}

.table-wrapper .body .row:hover .icon-arrow {
  color: var(--primary-100);
}

.table-wrapper .body.empty {
  justify-content: center;
  align-items: center;

  padding: var(--size-m);
}

.table-wrapper .body.empty span {
  font-family: var(--font-primary);
  font-size: var(--size-m);
  font-weight: var(--font-regular);

  color: var(--grey-300);
}
</style>
