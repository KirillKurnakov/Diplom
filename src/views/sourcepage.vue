<template>
  <div class="p-4">
    <h1 class="text-2xl font-bold mb-4">Мои данные</h1>

    <!-- Загрузка -->
    <div v-if="loading">Загрузка...</div>

    <!-- Ошибка -->
    <div v-else-if="error" class="text-red-500">{{ error }}</div>

    <!-- Таблица с данными -->
    <div v-else-if="rows.length">
      <table class="min-w-full border border-gray-300 mb-4">
        <thead>
          <tr class="bg-gray-100">
            <th class="border px-2 py-1">ID</th>
            <th class="border px-2 py-1">ИНН</th>
            <th class="border px-2 py-1">Сумма текущий год</th>
            <th class="border px-2 py-1">Сумма второй год</th>
            <th class="border px-2 py-1">Код строки</th>
            <th class="border px-2 py-1">Сумма первый год</th>
            <th class="border px-2 py-1">Финансовый год</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in paginatedRows" :key="item.id">
            <td class="border px-2 py-1">{{ item.id }}</td>
            <td class="border px-2 py-1">{{ item.inn }}</td>
            <td class="border px-2 py-1">{{ item.sumcurfinyear }}</td>
            <td class="border px-2 py-1">{{ item.sumsecondyearplper }}</td>
            <td class="border px-2 py-1">{{ item.strcode }}</td>
            <td class="border px-2 py-1">{{ item.sumfirstyearplper }}</td>
            <td class="border px-2 py-1">{{ item.finyear }}</td>
          </tr>
        </tbody>
      </table>

      <!-- Пагинация -->
      <div class="flex space-x-2 items-center">
        <button
          class="px-2 py-1 border rounded"
          :disabled="currentPage === 1"
          @click="currentPage--"
        >
          Назад
        </button>

        <span>Страница {{ currentPage }} из {{ totalPages }}</span>

        <button
          class="px-2 py-1 border rounded"
          :disabled="currentPage === totalPages"
          @click="currentPage++"
        >
          Вперед
        </button>
      </div>
    </div>

    <!-- Нет данных -->
    <div v-else>Нет данных</div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from "vue";

export default {
  name: "MyTablePage",
  setup() {
    const rows = ref([]);
    const loading = ref(false);
    const error = ref(null);

    // Пагинация
    const currentPage = ref(1);
    const pageSize = 10;

    const totalPages = computed(() => Math.ceil(rows.value.length / pageSize));

    const paginatedRows = computed(() => {
      const start = (currentPage.value - 1) * pageSize;
      return rows.value.slice(start, start + pageSize);
    });

    const fetchData = async () => {
      loading.value = true;
      error.value = null;

      try {
        const res = await fetch("http://localhost:7778/enquiry/api/v1/getpfhd");
        if (!res.ok) throw new Error(`Ошибка HTTP: ${res.status}`);

        const data = await res.json();
        if (Array.isArray(data)) {
          rows.value = data;
        } else {
          throw new Error("API вернул данные не в виде массива");
        }
      } catch (e) {
        error.value = e.message;
      } finally {
        loading.value = false;
      }
    };

    onMounted(fetchData);

    return {
      rows,
      loading,
      error,
      currentPage,
      totalPages,
      paginatedRows,
    };
  },
};
</script>

<style scoped>
table {
  border-collapse: collapse;
}
th, td {
  text-align: center;
}
button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>