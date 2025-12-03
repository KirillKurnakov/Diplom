<template>
  <div class="header">
        <header>
            <div class="navigation">
            <nav>
                <router-link to="/main">Главная</router-link>
                <router-link to="/main/sourcepage">ПФХД</router-link>
                <router-link to="/main/fkform">737 форма</router-link>
                <router-link to="/main/protocols">Протоколы</router-link>
                <router-link to="/dashboard">Дашборды</router-link>
            </nav>
            </div>
        </header>
    </div>
  <div class="min-h-screen flex flex-col items-center justify-start py-10 bg-gray-50">
    <h1 class="text-3xl font-bold mb-6">Протоколы бюджетной комиссии</h1>

    <div v-if="loading">Загрузка...</div>
    <div v-else-if="error" class="text-red-500">{{ error }}</div>

    <div v-else-if="rows.length" class="shadow-xl bg-white p-4 rounded-xl">

      <table>
        <thead>
          <!-- Заголовки -->
          <tr class="bg-gray-200">
            <th
              v-for="col in columns"
              :key="col.field"
              class="cell cursor-pointer select-none"
              @click="sortBy(col.field)"
            >
              {{ col.label }}
              <span v-if="sortField === col.field">
                <span v-if="sortOrder === 'asc'">▲</span>
                <span v-else>▼</span>
              </span>
            </th>
          </tr>

          <!-- Фильтры -->
          <tr>
            <th v-for="col in columns" :key="col.field" class="filterstable">
              <input
                v-model="filters[col.field]"
                type="text"
                placeholder="Фильтр..."
                class="w-full p-1 border rounded"
                @input="resetPage"
              />
            </th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="item in paginatedRows" :key="item.id">
            <td class="cell">{{ item.inn }}</td>
            <td class="cell">{{ item.report_date }}</td>
            <td class="cell">{{ item.year_finance }}</td>
            <td class="cell">{{ item.kbk }}</td>
            <td class="cell">{{ item.subsidyictype }}</td>
            <td class="cell">{{ item.finance }}</td>
            <td class="cell">{{ item.taxes }}</td>
            <td class="cell">{{ item.finance_without_tax }}</td>
          </tr>
        </tbody>
      </table>

      <!-- Пагинация -->
      <div class="pagination">
        <button class="" :disabled="currentPage === 1" @click="currentPage--">Назад</button>
        <span class="font-medium">Страница {{ currentPage }} из {{ totalPages }}</span>
        <button class="" :disabled="currentPage === totalPages" @click="currentPage++">Вперед</button>
      </div>
    </div>

    <div v-else>Нет данных</div>
  </div>
  <div class="footer">
        <footer>
            
        </footer>
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

    const currentPage = ref(1);
    const pageSize = 10;

    const columns = [
      { field: "inn", label: "ИНН" },
      { field: "report_date", label: "Отчетная дата" },
      { field: "year_finance", label: "Год финансирования" },
      { field: "kbk", label: "КБК" },
      { field: "subsidyictype", label: "Код субсидии" },
      { field: "finance", label: "Финансиирование" },
      { field: "taxes", label: "Налоги" },
      { field: "finance_without_tax", label: "Финансирование без налогов" },
    ];

    // ---------- ФИЛЬТРЫ ----------
    const filters = ref({});
    columns.forEach(col => (filters.value[col.field] = ""));

    const resetPage = () => {
      currentPage.value = 1;
    };

    const filteredRows = computed(() => {
      return rows.value.filter(row => {
        return Object.keys(filters.value).every(key => {
          const filterText = filters.value[key].toLowerCase();
          if (!filterText) return true;
          return String(row[key]).toLowerCase().includes(filterText);
        });
      });
    });

    // ---------- СОРТИРОВКА ----------
    const sortField = ref(null);
    const sortOrder = ref("asc");

    const sortBy = (field) => {
      if (sortField.value === field) {
        sortOrder.value = sortOrder.value === "asc" ? "desc" : "asc";
      } else {
        sortField.value = field;
        sortOrder.value = "asc";
      }
      currentPage.value = 1;
    };

    const sortedRows = computed(() => {
      if (!sortField.value) return filteredRows.value;

      return [...filteredRows.value].sort((a, b) => {
        const vA = a[sortField.value];
        const vB = b[sortField.value];

        if (vA == null) return 1;
        if (vB == null) return -1;

        if (typeof vA === "number" && typeof vB === "number") {
          return sortOrder.value === "asc" ? vA - vB : vB - vA;
        }

        return sortOrder.value === "asc"
          ? String(vA).localeCompare(String(vB))
          : String(vB).localeCompare(String(vA));
      });
    });

    // ---------- ПАГИНАЦИЯ ----------
    const totalPages = computed(() =>
      Math.ceil(sortedRows.value.length / pageSize)
    );

    const paginatedRows = computed(() => {
      const start = (currentPage.value - 1) * pageSize;
      return sortedRows.value.slice(start, start + pageSize);
    });

    // ---------- ЗАГРУЗКА ----------
    const fetchData = async () => {
      loading.value = true;
      error.value = null;

      try {
        const res = await fetch("http://localhost:7778/enquiry/api/v1/getprotocols");
        if (!res.ok) throw new Error(`Ошибка HTTP: ${res.status}`);

        const data = await res.json();
        if (!Array.isArray(data))
          throw new Error("API должен вернуть массив");

        rows.value = data;
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
      columns,
      currentPage,
      totalPages,
      paginatedRows,

      filters,
      resetPage,

      sortField,
      sortOrder,
      sortBy,
    };
  },
};
</script>

<style scoped>
</style>
