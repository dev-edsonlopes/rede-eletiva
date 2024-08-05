<template>
  <main class="container">
    <img class="pernambuco-mobile" src="../assets/pernambuco-mobile.svg" />
    <img class="pernambuco-tape" src="../assets/pernambuco.svg" />
    <div class="content-left">
      <h1 class="title">Rede Eletiva</h1>
      <form @submit.stop.prevent="submit">
        <div class="input-group">
          <label for="ra">Matrícula</label>
          <input v-model="ra" type="text" name="ra" />
        </div>

        <div class="input-group">
          <label for="date_birth">Data Nascimento</label>
          <input
            type="text"
            v-model="date_birth"
            name="date_birth"
            @input="formatarDataInput"
            placeholder="dd/mm/aaaa"
          />
        </div>
        <p class="error">{{ error }}</p>
        <button
          type="submit"
          :style="{ cursor: loginLoading ? 'not-allowed' : 'pointer' }"
          :disabled="loginLoading"
        >
          <span v-if="!loginLoading">Entrar</span>
          <span v-else>
            <i class="fa-solid fa-circle-notch fa-spin"></i>
          </span>
        </button>

        <div class="container-modal">
          <Modal @close="toggleModal" :modalActive="modalActive">
              <div class="modal-content">
                  <h1>Administrador</h1>
                  <form @submit.prevent.self="loginADM">
                      <div class="input-group">
                          <label for="email">Email</label>
                          <input type="text" name="email" v-model="email">
                      </div>
                      <div class="input-group">
                          <label for="password">Senha</label>
                          <input type="password" name="password" v-model="password">
                      </div>
                      <button type="submit" @click="loginADM">Entrar</button>
                  </form>
              </div>
          </Modal>
        </div>

        <a @click="toggleModal" class="access-administrator">Administrador </a>
      </form>
    </div>
    <div class="content-right"></div>
    <div class="footer"></div>
  </main>
</template>

<script>
import { API } from "../services/api.js" ;
import Cookie from "js-cookie";
import Modal from '../components/ModalService.vue';
import { ref } from 'vue';

export default {
  components: {
    Modal
  },
  setup() {
    const modalActive = ref(false);

    const toggleModal = () => {
      modalActive.value = !modalActive.value;
      if (modalActive.value) {
        document.body.classList.add('modal-open');
      } else {
        document.body.classList.remove('modal-open'); 
      }
    };
    return { modalActive, toggleModal };
  },
  data() {
    return {
      ra: "",
      date_birth: "",
      loginLoading: false,
      error: null,
      email: "",
      password: ""
    };
  },
  methods: {
    async submit() {
      this.loginLoading = true;


      if (!this.ra || !this.date_birth) {
        this.error = "Por favor, preencha todos os campos.";
        this.loginLoading = false;
        return;
      }

      const dataPattern = /^\d{2}\/\d{2}\/\d{4}$/;
      if (!dataPattern.test(this.date_birth)) {
        this.error = "Formato de data inválido. Use dd/mm/aaaa.";
        this.loginLoading = false;
        return;
      }

      const payload = {
        ra: this.ra,
        date_birth: this.formatarParaAAMMDD(this.date_birth),
      };

      try {
        const response = await API.post(
          "/students/login",
          payload
        );

        const { token } = response.data;
        if (response.data.success) {
          Cookie.set("_myapp_token", token);
          this.$router.push("/");
        }
      } catch (error) {
        this.error = error.response.data.message;
      } finally {
        this.loginLoading = false;
      }
    },

    async loginADM() {
      const payload = {
        email: this.email,
        password: this.password
      }

      try {
        const response = await API.post('/administrator/login', payload);

        const { token } = response.data;
        if (response.data.success) {
          Cookie.set("_myapp_token", token);
          this.$router.push("/painel");

        }
      } catch (error) {
        console.log(error.mesage)
      }
    },

    formatarDataInput() {
      let valorSemCaracteresNaoNumericos = this.date_birth.replace(/\D/g, "");

      if (valorSemCaracteresNaoNumericos.length > 2) {
        valorSemCaracteresNaoNumericos =
          valorSemCaracteresNaoNumericos.slice(0, 2) +
          "/" +
          valorSemCaracteresNaoNumericos.slice(2);
      }
      if (valorSemCaracteresNaoNumericos.length > 5) {
        valorSemCaracteresNaoNumericos =
          valorSemCaracteresNaoNumericos.slice(0, 5) +
          "/" +
          valorSemCaracteresNaoNumericos.slice(5);
      }

      if (valorSemCaracteresNaoNumericos.length > 10) {
        valorSemCaracteresNaoNumericos = valorSemCaracteresNaoNumericos.slice(
          0,
          10
        );
      }

      this.date_birth = valorSemCaracteresNaoNumericos;
    },
    formatarParaAAMMDD(data) {
      const partes = data.split("/");
      const dia = partes[0];
      const mes = partes[1].length === 1 ? "0" + partes[1] : partes[1];
      const ano = partes[2];

      return ano + "-" + mes + "-" + dia;
    },
  },
};
</script>
<style scoped>
@media (max-width: 768px) {
  .content-left {
    width: 100% !important;
  }

  .content-left .title {
    font-size: 36pt !important;
  }

  .content-left form {
    width: 100% !important;
  }

  .content-left form .input-group {
    width: 80% !important;
  }

  .content-right {
    display: none;
  }

  .container .pernambuco-tape {
    display: none;
  }

  .container .pernambuco-mobile {
    display: block !important;
    position: absolute;
    top: 0;
    right: 0px;
    z-index: -1;
  }

  .footer {
    background-image: url("../assets/Banner Eletiva (2).svg") !important;
    left: 0 !important;
    height: 150px !important;
    width: 100vw !important;
  }
}

.access-administrator {
  color: #737373;
  font-size: 14pt;
  transition: 0.3s;
  cursor: pointer;
}

.access-administrator:hover {
  color: #2b6cb0;
}

.footer {
  background-image: url("../assets/footer-ete.svg");
  background-repeat: no-repeat;
  background-size: contain;
  background-position: center bottom;
  position: fixed;
  bottom: 0;
  left: -3px;
  height: 230px;
  width: 1000px;
  z-index: -2;
}

.error {
  color: #c10808;
  font-size: 10pt;
  font-weight: 500;
  text-align: center;
}

.container .pernambuco-mobile {
  display: none;
}

.pernambuco-tape {
  position: fixed;
  top: 0;
  z-index: -1;
  width: 950px;
}

.container {
  display: flex;
  width: 100vw;
  height: 100vh;
}

.content-left {
  width: 65%;
  flex-direction: column;
  display: flex;
  align-items: center;
  justify-content: center;
}

.content-left .title {
  text-shadow: 1px 1px 1px #737373;
  color: #2b6cb0;
  font-size: 42pt;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: start;
  z-index: 1;
  font-weight: 800;
}

.content-left form {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 16pt;
  font-weight: 700;
  height: 400px;
  width: 660px;
  z-index: 1;
}

form .input-group {
  display: flex;
  flex-direction: column;
  color: #737373;
  width: 55%;
  margin: 15px 0;
}

form .input-group input {
  background: #fff;
  height: 45px;
  border-radius: 8px;
  border: 3px solid #e8e8e8;
  font-size: 12pt;
  font-weight: 700px;
  padding: 8px;
  color: #737373;
}

.content-left form button {
  background-color: #2b6cb0;
  color: #fff;
  width: 55%;
  height: 45px;
  border-radius: 8px;
  border: 3px solid #00000029;
  font-size: 16pt;
  font-weight: 700;
  margin: 35px 0 15px;
  z-index: 1;
  cursor: pointer;
  transition: 0.3s;
}

.content-left form button:hover {
  background-color: #0f4a89;
}

.container .content-right {
  width: 35%;
  background-image: url("../assets/background-students.svg");
  background-repeat: no-repeat;
  background-size: cover;
  background-position: left bottom;
}

/* Modal Style */
.modal-open .container-modal::before {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  backdrop-filter: blur(5px); 
  background-color: rgba(0, 0, 0, 0.5);
}

.modal-content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.modal-content h1 {
  margin: 35px 0;
  color: #2b6cb0;
}

</style>