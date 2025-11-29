<template>
      <div class="header">
  <header>
  </header>
  </div>
  <div>
    <div class="blockinput">
      <h2 >Авторизация</h2>
      <div class="loginpass">
      <input
        v-model="login_f"
        type="text"
        placeholder="Введите логин"
        
      />

      <input
        v-model="passw_f"
        type="password"
        placeholder="Введите пароль"
        
      />
      </div>

      <button
        @click="authorize"
        
      >
        Войти
      </button>

      <p v-if="message" :class="messageClass" >
        {{ message }}
      </p>
    </div>
  </div>
  <div class="footer">
  <footer>
  </footer>
  </div>
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
          setTimeout(() => {
                this.$router.push('/main');
            }, 1000);
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