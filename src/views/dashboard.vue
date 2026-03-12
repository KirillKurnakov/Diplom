<template>
  <div class="header">
    <header>
      <div class="navigation">
        <nav>
          <router-link to="/main">Главная</router-link>
          <router-link to="/main/sourcepage">ПФХД</router-link>
          <router-link to="/main/fkform">737 форма</router-link>
          <router-link to="/main/protocols">Протоколы</router-link>
          <router-link to="/main/dashboard">Дашборды</router-link>
        </nav>
      </div>
    </header>
  </div>

  <div class="p-6">
    <h1 class="headers">График ПФХД</h1>

    <div v-if="loading">Загрузка...</div>
    <div v-else-if="error" class="text-red-500">{{ error }}</div>

    <div v-show="!loading && !error">
      <!-- ФИЛЬТР 1 -->
      <div class="filter-row">
        <label for="innLine">ИНН:</label>
        <div class="input-wrapper">
          <input
            id="innLine"
            type="text"
            v-model="selectedInnLine"
            @input="showInnListLine = true; renderLineChart()"
            placeholder="Введите ИНН"
            @focus="showInnListLine = true"
            @blur="hideList('line')"
          />
          <ul v-show="showInnListLine && filteredInnListLine.length" class="autocomplete-list">
            <li v-for="inn in filteredInnListLine" :key="inn" @mousedown.prevent="selectInn('line', inn)">
              {{ inn }}
            </li>
          </ul>
        </div>
      </div>

      <div id="chart-container"></div>

      <h1 class="headers">Диаграмма субсидий</h1>

      <!-- ФИЛЬТР 2 -->
      <div class="filter-row">
        <label for="innBar">ИНН:</label>
        <div class="input-wrapper">
          <input
            id="innBar"
            type="text"
            v-model="selectedInnBar"
            @input="showInnListBar = true; renderBarChart()"
            placeholder="Введите ИНН или оставьте пустым для всех"
            @focus="showInnListBar = true"
            @blur="hideList('bar')"
          />
          <ul v-show="showInnListBar && filteredInnListBar.length" class="autocomplete-list">
            <li v-for="inn in filteredInnListBar" :key="inn" @mousedown.prevent="selectInn('bar', inn)">
              {{ inn }}
            </li>
          </ul>
        </div>
      </div>

      <div id="bar-chart-container"></div>

      <h1 class="headers">Распределение видов доходов по годам</h1>

      <div class="income-description">
        <p>0 - Доходы от собственности</p>
			  <p>1 - Доходы от оказания платных услуг (работ), компенсации затрат</p>
			  <p>2 - Доходы от штрафов, пеней, неустоек, возмещения ущерба</p>
			  <p>3 - Безвозмездные денежные поступления</p>
			  <p>4 - Доходы от операций с активами</p>
			  <p>5 - Прочие доходы</p>
      </div>

      <!-- ФИЛЬТР 3 -->
      <div class="filter-row">
        <label for="innBar2">ИНН:</label>
        <div class="input-wrapper">
          <input
            id="innBar2"
            type="text"
            v-model="selectedInnBar2"
            @input="showInnListBar2 = true; renderBar2Chart()"
            placeholder="Введите ИНН или оставьте пустым для всех"
            @focus="showInnListBar2 = true"
            @blur="hideList('bar2')"
          />
          <ul v-show="showInnListBar2 && filteredInnListBar2.length" class="autocomplete-list">
            <li v-for="inn in filteredInnListBar2" :key="inn" @mousedown.prevent="selectInn('bar2', inn)">
              {{ inn }}
            </li>
          </ul>
        </div>
      </div>

      <div id="bar2-chart-container"></div>
    </div>
  </div>

  <div class="footer">
    <footer></footer>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from "vue";
import Highcharts from "highcharts";

Highcharts.setOptions({
  lang: { locale: "en-US", decimalPoint: ".", thousandsSep: " ", numericSymbols: null }
});

const loading = ref(true);
const error = ref(null);

const chartData = ref(null);
const protocolsData = ref(null);
const bar2Data = ref(null);

const innList = ref([]);

const selectedInnLine = ref("");
const selectedInnBar = ref("");
const selectedInnBar2 = ref("");

const showInnListLine = ref(false);
const showInnListBar = ref(false);
const showInnListBar2 = ref(false);

const filteredInnListLine = computed(() => innList.value.filter(i => i.includes(selectedInnLine.value)));
const filteredInnListBar = computed(() => innList.value.filter(i => i.includes(selectedInnBar.value)));
const filteredInnListBar2 = computed(() => innList.value.filter(i => i.includes(selectedInnBar2.value)));

function selectInn(type, inn) {
  if (type === 'line') selectedInnLine.value = inn;
  if (type === 'bar') selectedInnBar.value = inn;
  if (type === 'bar2') selectedInnBar2.value = inn;
  renderAllCharts();
}

function hideList(type) {
  setTimeout(() => {
    if (type === 'line') showInnListLine.value = false;
    if (type === 'bar') showInnListBar.value = false;
    if (type === 'bar2') showInnListBar2.value = false;
  }, 150);
}

async function fetchData() {
  try {
    const res1 = await fetch("http://localhost:7779/enquiry/api/v1/api/pfhd-chart");
    chartData.value = await res1.json();

    const res2 = await fetch("http://localhost:7779/enquiry/api/v1/api/protocols-chart");
    protocolsData.value = await res2.json();

    const res3 = await fetch("http://localhost:7779/enquiry/api/v1/api/fkform-chart");
    bar2Data.value = await res3.json();

    const res4 = await fetch("http://localhost:7779/enquiry/api/v1/orgslist");
    innList.value = await res4.json();

    if (innList.value.length > 0) {
      selectedInnLine.value = innList.value[0];
      selectedInnBar.value = innList.value[0];
      selectedInnBar2.value = innList.value[0];
    }
  } catch (e) {
    error.value = e.message;
  } finally {
    loading.value = false;
  }
}

function renderAllCharts() {
  renderLineChart();
  renderBarChart();
  renderBar2Chart();
}

function renderLineChart() {
  if (!chartData.value) return;
  let series = chartData.value.series;
  if (selectedInnLine.value) series = series.filter(s => s.inn.includes(selectedInnLine.value));
  Highcharts.chart("chart-container", {
    chart: { type: "line" },
    title: { text: chartData.value.title },
    xAxis: { categories: chartData.value.categories },
    yAxis: { title: { text: chartData.value.ytitle || "Y" } },
    tooltip: { pointFormat: "<b>{point.y:.2f} млн рублей</b>" },
    series,
    credits: { enabled: false }
  });
}

function renderBarChart() {
  if (!protocolsData.value) return;
  let series = protocolsData.value.series;
  if (selectedInnBar.value) series = series.filter(s => s.inn.includes(selectedInnBar.value));
  Highcharts.chart("bar-chart-container", {
    chart: { type: "column" },
    title: { text: protocolsData.value.title },
    xAxis: { categories: protocolsData.value.categories, labels: { rotation: -45, style: { fontSize: "11px" } } },
    yAxis: { type: "logarithmic", title: { text: protocolsData.value.ytitle } },
    series,
    legend: { enabled: false },
    credits: { enabled: false }
  });
}

function renderBar2Chart() {
  if (!bar2Data.value) return;
  let series = bar2Data.value.series;
  if (selectedInnBar2.value) series = series.filter(s => s.inn.includes(selectedInnBar2.value));
  Highcharts.chart("bar2-chart-container", {
    chart: { type: "bar" },
    title: { text: "Наименование направления доходов" },
    xAxis: { categories: bar2Data.value.categories },
    yAxis: { min: 0, title: { text: bar2Data.value.ytitle || "Сумма по субсидиям" } },
    series,
    plotOptions: { bar: { borderRadius: "50%", dataLabels: { enabled: true }, groupPadding: 0.1 } },
    legend: bar2Data.value.legend,
    credits: { enabled: false },
    tooltip: { valueSuffix: " млн рублей" }
  });
}

onMounted(async () => {
  await fetchData();
  await nextTick();
  renderAllCharts();
});
</script>

<style>
.filter-row {
  display: flex;
  align-items: center;
  margin: 20px 0;
}

.filter-row label {
  margin-left: 2rem;
  width: 3rem;
  font-weight: 500;
}

.income-description {
  margin-left: 2rem;
  margin-bottom: 20px;
}

.input-wrapper {
  position: relative;
  flex: 1;
}

.input-wrapper input {
  width: 15%;
  padding: 6px 10px;
  border-radius: 6px;
  border: 1px solid #6899D3;
  display: block;
}

.autocomplete-list {
  position: absolute;
  top: calc(100% + 2px);
  left: 0;
  width: 17%;
  max-height: 150px;
  overflow-y: auto;
  border: 1px solid black;
  border-radius: 6px;
  background: white;
  z-index: 100;
  list-style: none;
  padding: 0;
  margin: 0;
}

.autocomplete-list li {
  padding: 5px 10px;
  cursor: pointer;
}

.autocomplete-list li:hover {
  background-color: #4284D3;
  color: white;
}
</style>