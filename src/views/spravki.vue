<template>
  <div class="container">
    <h1>Скачать файл по ИНН</h1>

    <div class="form">
      <label>Выберите ИНН</label>

      <select v-model="selectedInn">
        <option disabled value="">Выберите значение</option>

        <option
          v-for="inn in innList"
          :key="inn"
          :value="inn"
        >
          {{ inn }}
        </option>
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
import { ref } from "vue"
import { downloadReport } from "./api"

const selectedInn = ref("")
const loading = ref(false)

const innList = [
  "5502013556",
  "7707083893",
  "7810755500"
]

const downloadFile = async () => {
  loading.value = true

  const payload = {
    user_id: 0,
    filter_params: {
      parent_id: [1],
      inn: [selectedInn.value]
    },
    fields: {
      key: "value",
      key_n: "value_n"
    }
  }

  try {
    const response = await downloadReport(payload)

    const blob = new Blob([response.data])

    let fileName = "report.xlsx"

    const disposition = response.headers["content-disposition"]
    if (disposition) {
      const match = disposition.match(/filename="?(.+)"?/)
      if (match?.length === 2) {
        fileName = match[1]
      }
    }

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
</script>

<style>
body {
  font-family: Arial;
  background: #f4f6f8;
}

.container {
  max-width: 500px;
  margin: 80px auto;
  padding: 40px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.08);
}

h1 {
  margin-bottom: 30px;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

select {
  padding: 10px;
  font-size: 16px;
}

button {
  padding: 12px;
  font-size: 16px;
  background: #42b883;
  border: none;
  color: white;
  cursor: pointer;
  border-radius: 6px;
}

button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>