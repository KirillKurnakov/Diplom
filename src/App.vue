<template>
  <div class="header">
  <header>
  </header>
  </div>
  <div class="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
    <div class="bg-white shadow-md rounded-2xl p-6 w-full max-w-sm">
      <h2 class="text-2xl font-semibold text-center mb-4">Авторизация</h2>

      <input
        v-model="login_f"
        type="text"
        placeholder="Login"
        class="w-full mb-3 p-2 border rounded-xl"
      />

      <input
        v-model="passw_f"
        type="password"
        placeholder="Password"
        class="w-full mb-3 p-2 border rounded-xl"
      />

      <button
        @click="authorize"
        class="w-full bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700 transition"
      >
        Войти
      </button>

      <p v-if="message" :class="messageClass" class="mt-4 text-center text-sm">
        {{ message }}
      </p>
    </div>
  </div>
  <footer>

  </footer>
</template>

<script>
export default {
  name: "LoginForm",
  data() {
    return {
      login_f: "",
      passw_f: "",
      message: "",
      messageClass: "",    
    };
  },
  methods: {
    async authorize() {
      this.message = "Идет авторизация...";

      try {
        const response = await fetch("http://localhost:7778/enquiry/api/v1/authorization", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            login_f: this.login_f,
            passw_f: this.passw_f,
          }),
        });
        console.log('3')
        if (response.status === 200) {
          this.message = "Авторизация успешна";
          this.messageClass = "text-green-600";
        } else if (response.status === 403) {
          this.message = "Неверный логин или пароль";
          this.messageClass = "text-red-600";
        } else {
          this.message = "Ошибка сервера";
          this.messageClass = "text-red-500";
        }
      } catch (e) {
        this.message = "Не удалось подключиться к серверу";
        this.messageClass = "text-red-500";
      }
    },
  },
};
</script>

<style scoped>
</style>