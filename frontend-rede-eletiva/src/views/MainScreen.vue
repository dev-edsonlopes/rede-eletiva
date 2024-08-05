<template>
  <button class="logout" @click="logout">Sair</button>

  <div class="header">
    <div class="menu-dropdown" @click="toggleMenu">
      <span><i class="menu fa-solid fa-bars"></i></span>
      <div class="menu-content" v-show="isMenuOpen">
        <button class="logout-mobile" @click="logout">Sair</button>
      </div>
    </div>
    <h1 class="title">Rede Eletiva</h1>
  </div>

  <main v-if="student.length > 0">
    <h2 class="name-title" v-if="student.length > 0">{{ student[0].name }}</h2>
    <div
      class="frame"
      v-for="(frameElectives, frame) in groupedElectives"
      :key="frame"
    >
      <h3 class="title-frame">{{ frame }}</h3>
      <div class="container">
        <div class="loading-container" v-if="electivesLoading">
          <i class="fa-solid fa-circle-notch fa-spin"></i>
        </div>
        <div
          v-else
          class="content"
          v-for="(elective, index) in frameElectives"
          :key="index"
        >
          <div class="context">
            <h1>{{ elective.name_elective }}</h1>
            <h2>Professor: {{ elective.name_teacher }}</h2>
          </div>
          <div class="context-right">
            <h3>
              {{ elective.filled_vacancies }}/{{ elective.total_vacancies }}
            </h3>
            <button
            @click="selectElective(elective.frame, elective.code_elective, index)"
              type="submit"
              :class="  elective.available_vacancies === '0' ? 'disabled' : student.length > 0 &&
                statusSelectedClass(
                  elective.frame,
                  elective.code_elective,
                  index
                  )
                  "
                :disabled="elective.available_vacancies === '0'"
            >
              {{
                student.length > 0 &&
                elective.code_elective === selectedElective[elective.frame]
                  ? "Selecionado" : elective.available_vacancies === '0' ?
                 "Indisponível" : "Selecionar"
              }}
            </button>
          </div>
        </div>
        <div class="container-button">
          <button
            v-if="student.length > 0 && student[0].electives[frame]"
            class="replace-button"
            @click="toggleButtonReplace(frame)"
          >
            Trocar Eletiva
          </button>
          <button
            v-else
            class="confirm-button"
            type="submit"
            @click="confirmSelection(frame)"
            :disabled="registerLoading"
          >
          <span v-if="!registerLoading">Confirmar</span>
          <span v-else>
            <i class="fa-solid fa-circle-notch fa-spin"></i>
          </span>
          </button>
        </div>
      </div>
    </div>
  </main>
  <img
    class="pernambuco-main-mobile"
    src="../assets/pernambuco-main-mobile .svg"
  />
  <img class="pernambuco-main" src="../assets/pernambuco-main.svg" alt="" />
  <footer class="footer"></footer>
</template>

<script>
import { API } from "@/services/api";
import Cookies from "js-cookie";

export default {
  data() {
    return {
      electivesLoading: true,
      student: [],
      electives: [],
      selectedElective: {},
      isMenuOpen: false,
      registerLoading: false
    };
  },

  computed: {
    groupedElectives() {
      const electivesByFrame = {};

      this.electives.forEach((elective) => {
        const frame = elective.frame;

        if (!electivesByFrame[frame]) {
          electivesByFrame[frame] = [];
        }

        electivesByFrame[frame].push(elective);
      });

      return electivesByFrame;
    },
  },

  mounted() {
    this.fetchElectives();
    this.getDataStudent();
    window.addEventListener("click", (event) => {
      if (!event.target.closest(".menu-dropdown")) {
        this.isMenuOpen = false;
      }
    });
  },

  methods: {
    toggleMenu() {
      this.isMenuOpen = !this.isMenuOpen;
    },
    statusSelectedClass(frame, code_elective) {
      if (
        this.student[0].electives[frame] &&
        this.student[0].electives[frame] === code_elective &&
        !this.selectedElective[frame]
      ) {
        return "selected";
      } else if (
        !this.student[0].electives[frame] &&
        this.selectedElective[frame] === code_elective
      ) {
        return "selected-on";
      } else {
        return "selected-off";
      }
    },
    async confirmSelection(frame) {
      try {
        this.registerLoading = true;
        const token = Cookies.get("_myapp_token");
        await API.post(
          "/students/register",

          { code_elective: this.selectedElective[frame] },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } catch (error) {
        alert(error.response.data.message);
      } finally {
        this.fetchElectives();
        this.getDataStudent();
        this.selectedElective[frame] = "";
        this.registerLoading = false;
      }
    },
    selectElective(frame, code_elective) {
      if (!this.student[0].electives[frame]) {
        if (frame in this.selectedElective) {
          this.selectedElective[frame] = code_elective;
        } else {
          this.selectedElective[frame] = code_elective;
        }
      }
    },

    async fetchElectives() {
      try {
        const token = Cookies.get("_myapp_token");

        const response = await API.get(
          "/discipline/list-electives",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        this.electives = response.data;
      } catch (error) {
        console.log(error.message);
      } finally {
        this.electivesLoading = false;
      }
    },
    async getDataStudent() {
      try {
        const token = Cookies.get("_myapp_token");

        const response = await API.get(
          "/students/dataStudent",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        this.student = response.data;
      } catch (error) {
        console.log(error.message);
      }
    },
    toggleButtonReplace(frame) {
      this.student[0].electives[frame] = "";
    },
    logout() {
      Cookies.remove("_myapp_token");
      location.reload();
    },
  },
};
</script>
<style scoped>
@media (max-width: 768px) {
  .menu-dropdown {
    position: relative;
    display: inline-block;
  }

  .menu-content {
    display: none;
    position: absolute;
    background-color: #f9f9f9;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
    padding: 10px;
    z-index: 1;
    border-radius: 8px;
  }

  .menu-dropdown:hover .menu-content {
    display: block;
  }

  .menu {
    display: block !important;
    font-size: 22pt;
  }

  .logout-mobile {
    width: 150px;
    height: 35px;
    border: 3px solid #00000063;
    border-radius: 8px;
    font-weight: 700;
    background-color: #ff00004a;
    cursor: pointer;
    transition: 0.3s;
  }

  .logout {
    display: none;
  }
  .title {
    font-size: 32pt !important;
    text-align: center;
    margin: 5px 0;
  }

  .title-frame {
    right: 0 !important;
  }

  .name-title {
    font-size: 12pt !important;
    width: 95% !important;
  }

  main {
    align-items: center !important;
  }

  .container {
    width: 96vw !important;
    margin-left: 0 !important;
  }

  .content {
    height: 100px !important;
    width: 100% !important;
    padding: 10px !important;
  }

  .content .context h1 {
    font-size: 12pt !important;
    width: 100%;
  }

  .content .context h2 {
    font-size: 10pt !important;
  }

  .selected-on,
  .selected-off,
  .selected,
  .disabled {
    width: 80px !important;
    font-size: 8pt !important;
    height: 25px !important;
    font-weight: 100px !important;
  }

  .confirm-button,
  .replace-button {
    width: 110px !important;
    font-size: 8pt !important;
    height: 25px !important;
  }

  .container .context-right h3 {
    font-size: 8pt !important;
  }

  .pernambuco-main {
    display: none;
  }
  .pernambuco-main-mobile {
    display: block !important;
    position: fixed !important;
    right: 0 !important;
    bottom: 0 !important;
    z-index: -2;
  }

  .footer {
    background-image: url("../assets/footer-ete.svg");
    background-repeat: no-repeat;
    background-size: contain;
    background-position: center bottom;
    height: 90px;
    width: 100%;
    z-index: 2;
    position: fixed;
    bottom: 0;
  }
}

.menu {
  display: none;
}

.logout {
  position: absolute;
  top: 5%;
  right: 5%;
  width: 150px;
  height: 35px;
  border: 3px solid #00000063;
  border-radius: 8px;
  font-weight: 700;
  background-color: #ff00004a;
  cursor: pointer;
  transition: 0.3s;
}

.logout:hover {
  background: #ff00008e;
}
.header {
  width: 100vw;
  height: 150px;
  padding: 20px;
}

.title {
  text-shadow: 1px 1px 1px #737373;
  color: #2b6cb0;
  font-size: 42pt;
  width: 100%;
  z-index: 1;
  font-weight: 800;
}

.name-title {
  font-weight: 700;
  color: #737373;
  margin-left: 12px;
  margin: 0 30px;
}

label {
  padding-right: 20px;
  font-weight: 700;
  color: #737373;
}

.frame {
  position: relative;
}

.title-frame {
  position: absolute;
  text-align: end;
  top: -35px;
  right: 0;
  color: #3182ce;
  font-weight: 600;
  text-transform: uppercase;
  font-size: 10pt;
  background: #fff;
  padding: 5px 8px 20px 8px;
  border: #7373736a 2px solid;
  border-radius: 12px 12px;
  z-index: -1;
}
main {
  display: flex;
  flex-direction: column;
  width: 100vw;
  align-items: start;
}
.container {
  margin-left: 20px;
  width: 75vw;
  height: 50%;
  background: #fff;
  border: #7373736a 3px solid;
  padding: 15px;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: start;
  margin: auto;
  margin-bottom: 90px;
  z-index: 3;
  margin-left: 25px;
}

.loading-container {
  width: 100%;
  height: 470px;
  display: flex;
  color: #3182ce;
  align-items: center;
  justify-content: center;
  font-size: 32pt;
}

.container .content {
  position: relative;
  background: #3182ce1a;
  width: 100%;
  height: 120px;
  border: 3px solid #73737382;
  display: flex;
  padding: 15px 8px;
  justify-content: space-between;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 15px;
}

.content .context h1 {
  font-size: 30px;
  color: #3182ce;
}
.content .context h2 {
  font-size: 20px;
  color: #000000b1;
}

.container .context-right h3 {
  position: absolute;
  top: 5px;
}

.context-right {
  height: 100%;
  width: 30%;
  display: flex;
  flex-direction: column;
  align-items: end;
  justify-content: space-between;
}

.selected {
  position: absolute;
  bottom: 5px;
  width: 150px;
  height: 35px;
  border-radius: 8px;
  font-weight: 700;
  background: #3d7e33d0;
  color: #fff;
  border: 3px solid #00000063;
  cursor: pointer;
  transition: 0.3s;
}

.selected-off {
  position: absolute;
  bottom: 5px;
  width: 150px;
  height: 35px;
  border-radius: 8px;
  font-weight: 700;
  background: #2b6cb0;
  color: #fff;
  border: 3px solid #00000063;
  cursor: pointer;
  transition: 0.3s;
}



.selected-off:hover {
  background-color: #0f4a89;
}

.disabled {
  position: absolute;
  bottom: 5px;
  width: 150px;
  height: 35px;
  border-radius: 8px;
  font-weight: 700;
  background: #ff00004a;
  color: #000;
  border: 3px solid #00000063;
  cursor: not-allowed;
  transition: 0.3s;
}

.selected-on {
  position: absolute;
  bottom: 5px;
  width: 150px;
  height: 35px;
  border-radius: 8px;
  font-weight: 700;
  background: #b3af3a9e;
  color: #fff;
  border: 3px solid #00000063;
  cursor: pointer;
  transition: 0.3s;
}

.replace-button:hover {
  color: #000;
  background-color: #ddd72ebe;
}

.container-button {
  display: flex;
  width: 100%;
  justify-content: end;
}

.confirm-button {
  width: 150px;
  height: 35px;
  border-radius: 8px;
  font-weight: 700;
  border: 3px solid #00000063;
  background-color: #3d7e3376;
  cursor: pointer;
  transition: 0.3s;
}

.confirm-button:hover {
  background-color: #3d7e33d0;
}
.replace-button {
  width: 150px;
  height: 35px;
  border: 3px solid #00000063;
  border-radius: 8px;
  font-weight: 700;
  background-color: #b3af3a9e;
  cursor: pointer;
  transition: 0.3s;
}

.replace-button:hover {
  color: #000;
  background-color: #ddd72ebe;
}
.pernambuco-main-mobile {
  display: none;
}
.pernambuco-main {
  position: fixed;
  bottom: 0;
  right: 0;
  width: 70%;
  z-index: -2;
}
</style>
