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
                <router-link to="/main/spravki">Справки</router-link>
            </nav>
            </div>
        </header>
    </div>
  <div class="container_modal_spravki">
    <h2>Скачать справку</h2>

    <div class="form">

      <!-- поле поиска ИНН -->
      <label>ИНН организации</label>
      <div class="autocomplete">
        <input
          type="text"
          v-model="search"
          placeholder="Введите ИНН"
          @focus="showList = true"
          @blur="handleBlur"
        />

        <ul v-if="showList && filteredInnList.length" class="dropdown">
          <li
            v-for="inn in filteredInnList"
            :key="inn"
            @mousedown.prevent="selectInn(inn)"
          >
            {{ inn }}
          </li>
        </ul>
      </div>

      <!-- отображаем выбранное значение -->
      <!-- <p v-if="selectedInn">Выбранный ИНН: {{ selectedInn }}</p> -->

      <!-- тип файла -->
      <label>Тип файла</label>
      <select v-model="fileType">
        <!-- <option value="pdf">PDF</option>  -->
        <option value="excel">Excel</option>
        <!-- <option value="word">Word</option> -->
      </select>

      <button
        @click="downloadFile"
        :disabled="!selectedInn || loading"
      >
        {{ loading ? "Загрузка..." : "Скачать файл" }}
      </button>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue"
import axios from "axios"

const search = ref("")
const innList = ref([])
const selectedInn = ref("")
const showList = ref(false)
const fileType = ref("pdf")
const loading = ref(false)

/* подгружаем список ИНН с API */
const loadInnList = async () => {
  try {
    const response = await axios.get(
      "http://localhost:7779/enquiry/api/v1/orgslist"
    )
    innList.value = response.data
  } catch (error) {
    console.error("Ошибка загрузки ИНН", error)
  }
}

/* фильтрованный список */
const filteredInnList = computed(() => {
  if (!search.value) return innList.value
  return innList.value.filter(inn =>
    inn.toString().includes(search.value)
  )
})

/* выбор ИНН */
const selectInn = (inn) => {
  selectedInn.value = inn
  search.value = inn
  showList.value = false
}

/* скрытие списка при потере фокуса */
const handleBlur = () => {
  // небольшой таймаут чтобы успел сработать click по элементу
  setTimeout(() => showList.value = false, 100)
}

/* API ручки и расширения файлов */
const apiEndpoints = {
  //pdf: "http://localhost:7778/enquiry/api/v1/1/pdf/",
  excel: "http://localhost:7778/enquiry/api/v1/1/xlsx/",
  //word: "http://localhost:7778/enquiry/api/v1/1/word/"
}
const fileExtensions = { /*pdf: "pdf",*/ excel: "xlsx"/*, word: "docx"*/ }

/* скачивание файла */
const downloadFile = async () => {
  loading.value = true
  const payload = {
  user_id: 0,
  filter_params: {
    parent_id: [1],
    inn: [String(selectedInn.value)]
  },
  fields: {
    key: "value",
    key_n: "value_n"
  }
}
  try {
    const response = await axios.post(
      apiEndpoints[fileType.value],
      payload,
      { responseType: "blob" }
    )
    const blob = new Blob([response.data])
    const fileName = "report_" + selectedInn.value + "." + fileExtensions[fileType.value]
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = fileName
    document.body.appendChild(link)
    link.click()
    link.remove()
    window.URL.revokeObjectURL(url)
  } catch (error) {
    console.error("Ошибка скачивания:", error)
    alert("Ошибка загрузки файла")
  }
  loading.value = false
}

onMounted(() => {
  loadInnList()
})
</script>

<style scoped>
.container_modal_spravki {
  max-width: 520px;
  margin: 80px auto;
  padding: 35px;
  background: white;
  border-radius: 10px;
  background-color: #274E7D;
  box-shadow: 0 10px 25px rgba(0,0,0,0.08);
}

.form {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.autocomplete {
  position: relative;
}

.form label {
    color: white;
}

h2 {
    color: white;
}

.form input {
    height: 2rem;
}

.form select {
    height: 2.5rem;
    border-radius: 5px;
    border: 1px solid #ccc;
}

.form option {
    border-radius: 5px;
}

.autocomplete input {
  padding: 10px;
  font-size: 16px;
  width: 100%;
  box-sizing: border-box;
}

.dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  max-height: 200px;
  overflow-y: auto;
  background: white;
  border: 1px solid #ccc;
  z-index: 10;
  list-style: none;
  margin: 0;
  padding: 0;
}

.dropdown li {
  padding: 8px 12px;
  cursor: pointer;
}

.dropdown li:hover {
  background-color: #f0f0f0;
}

select, button {
  padding: 10px;
  font-size: 16px;
}

button {
  background: #6899D3;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  height: 3rem;
}

button:disabled {
  opacity: 0.5;
}
</style>