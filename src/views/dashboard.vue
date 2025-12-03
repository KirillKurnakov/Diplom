<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4">График PFHD</h1>

    <div v-if="loading">Загрузка...</div>
    <div v-else-if="error" class="text-red-500">{{ error }}</div>

    <div v-show="!loading && !error">
      <!-- Линейный график PFHD -->
      <div id="chart-container" style="width:100%; height:500px; margin-bottom:50px;"></div>

      <!-- Столбчатая диаграмма субсидий -->
      <h1 class="text-2xl font-bold mb-4 mt-10">Диаграмма субсидий</h1>
      <div id="bar-chart-container" style="width:100%; height:500px; margin-bottom:50px;"></div>

      <!-- Новая диаграмма после гистограммы -->
      <h1 class="text-2xl font-bold mb-4 mt-10">Субсидии по годам</h1>
      <div id="bar2-chart-container" style="width:100%; height:500px;"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from "vue";
import Highcharts from "highcharts";

Highcharts.setOptions({
  lang: {
    locale: "en-US",
    decimalPoint: ".",
    thousandsSep: " ",
    numericSymbols: null
  }
});

const loading = ref(true);
const error = ref(null);
const chartData = ref(null);
const protocolsData = ref(null);
const bar2Data = ref(null);

async function fetchData() {
  try {
    const res1 = await fetch("http://localhost:7778/enquiry/api/v1/api/pfhd-chart");
    if (!res1.ok) throw new Error("Ошибка API PFHD: " + res1.status);
    chartData.value = await res1.json();

    const res2 = await fetch("http://localhost:7778/enquiry/api/v1/api/protocols-chart");
    if (!res2.ok) throw new Error("Ошибка API Протоколы: " + res2.status);
    protocolsData.value = await res2.json();

    // Новая диаграмма: заменяем API на fkform-chart
    const res3 = await fetch("http://localhost:7778/enquiry/api/v1/api/fkform-chart");
    if (!res3.ok) throw new Error("Ошибка API FKForm: " + res3.status);
    bar2Data.value = await res3.json();

  } catch (e) {
    error.value = e.message;
  } finally {
    loading.value = false;
  }
}

/* Линейный график PFHD */
function renderLineChart() {
  Highcharts.chart("chart-container", {
    chart: { type: "line" },
    title: { text: chartData.value.title },
    xAxis: { categories: chartData.value.categories },
    yAxis: { title: { text: chartData.value.ytitle || "Y" }},
    series: chartData.value.series,
    credits: { enabled: false }
  });
}

/* Столбчатая диаграмма субсидий */
function renderBarChart() {
  Highcharts.chart("bar-chart-container", {
    chart: { type: "column" },
    title: { text: protocolsData.value.title },
    xAxis: {
      categories: protocolsData.value.categories,
      labels: { rotation: -45, style: { fontSize: "11px" }}
    },
    yAxis: {
      type: "logarithmic",
      title: { text: protocolsData.value.ytitle },
    },
    series: protocolsData.value.series.map(s => ({ ...s, color: "#4A90E2" })),
    tooltip: { pointFormat: "<b>{point.y:.2f} млн ₽</b>" },
    legend: { enabled: false },
    credits: { enabled: false }
  });
}

/* Новая диаграмма после гистограммы */
function renderBar2Chart() {
  Highcharts.chart("bar2-chart-container", {
    chart: { type: "bar" },
    title: { text: bar2Data.value.title },
    xAxis: { categories: bar2Data.value.categories, title: { text: null } },
    yAxis: {
      min: 0,
      title: { text: bar2Data.value.ytitle || "Сумма по субсидиям" }
    },
    series: bar2Data.value.series,
    plotOptions: { bar: { borderRadius: "50%", dataLabels: { enabled: true }, groupPadding: 0.1 } },
    legend: bar2Data.value.legend,
    credits: { enabled: false },
    tooltip: { valueSuffix: " млн рублей" }
  });
}

onMounted(async () => {
  await fetchData();
  await nextTick();

  requestAnimationFrame(() => {
    if (!error.value) {
      renderLineChart();
      renderBarChart();
      renderBar2Chart();
    }
  });
});
</script>
