<template>
  <div>
    <table>
      <thead>
        <tr>
          <th v-for="header in headerGroups[0].headers" :key="header.id">
            {{ header.column.columnDef.header }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in table.getRowModel().rows" :key="row.id">
          <td v-for="cell in row.getVisibleCells()" :key="cell.id">
            {{ cell.getValue() }}
          </td>
        </tr>
      </tbody>
    </table>
    <div v-if="loading">Загрузка...</div>
    <div v-if="error">{{ error }}</div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useTable, createTable } from '@tanstack/vue-table';

const data = ref([]);
const loading = ref(false);
const error = ref(null);

const columns = [
  { accessorKey: 'inn', header: 'ИНН' },
  { accessorKey: 'sumcurfinyear', header: 'Сумма текущий год' },
  { accessorKey: 'sumsecondyearplper', header: 'Сумма второй год' },
  { accessorKey: 'strcode', header: 'Код строки' },
  { accessorKey: 'id', header: 'ID' },
  { accessorKey: 'sumfirstyearplper', header: 'Сумма первый год' },
  { accessorKey: 'finyear', header: 'Фин год' },
];

const table = useTable({
  data,
  columns,
});

const headerGroups = table.getHeaderGroups();

async function fetchData() {
  loading.value = true;
  error.value = null;
  try {
    const response = await fetch('http://localhost:7778/enquiry/api/v1/your-endpoint');
    if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
    const json = await response.json();
    data.value = json;
  } catch (e) {
    error.value = e.message;
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  fetchData();
});
</script>
