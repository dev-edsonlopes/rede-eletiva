<template>
  <Template>
    <div class="content">
      <h1>Gestão de Eletivas</h1>
      <!-- Iterar sobre os índices das eletivas -->
      <i @click="toggleAddModal()" class="fa-solid fa-circle-plus"></i>
      <div
        v-for="(indexData, index) in organizedElectives"
        :key="index"
        class="content-table"
      >
        <div class="controls">
          <h2>{{ index }} ano</h2>
          <i class="fa-solid fa-toggle-on"></i>
        </div>
        <div
          v-for="(frameData, frame) in indexData"
          :key="frame"
          class="frame-table"
        >
          <table>
            <tr>
              <th>Eletivas</th>
              <th>Professor</th>
              <th>Vagas</th>
              <th>Ação</th>
            </tr>
            <tr
              v-for="(elective, electiveIndex) in frameData"
              :key="electiveIndex"
              class="border-data"
            >
              <td>{{ elective.name_elective }}</td>
              <td>{{ elective.name_teacher }}</td>
              <td>
                {{ elective.filled_vacancies }}/{{ elective.total_vacancies }}
              </td>
              <td>
                <i
                  @click="deleteElective(elective.code_elective)"
                  class="fa-solid fa-delete-left"
                ></i>
                <i
                  @click="toggleEditModal(elective)"
                  class="fa-regular fa-pen-to-square"
                ></i>
              </td>
            </tr>
          </table>
          <h3 class="frame">{{ frame }}</h3>
        </div>
      </div>
    </div>
  </Template>

  <Modal @close="toggleAddModal" :modalActive="addModalActive">
    <div class="modal-content">
      <h1>Adicionar Eletivas</h1>
      <form @submit.prevent="addElective">
        <div class="input-group">
          <label for="name">Nome Eletiva</label>
          <input type="text" name="name" v-model="data.name" />
        </div>
        <div class="input-group">
          <label for="name_teacher">Professor</label>
          <input type="text" name="name_teacher" v-model="data.name_teacher" />
        </div>
        <div class="input-group">
          <label for="number_vacancies">Quantidade de Vagas</label>
          <input
            type="number"
            name="number_vacancies"
            min="1"
            max="40"
            v-model="data.number_vacancies"
          />
        </div>
        <div class="input-group">
          <label for="module">Ano</label>
          <select name="module" v-model="data.module">
            <option :value="1">1</option>
            <option :value="2">2</option>
            <option :value="3">3</option>
          </select>
        </div>
        <div class="input-group">
          <label for="frame">Dia</label>
          <select name="frame" v-model="data.frame">
            <option value="segunda-feira">segunda-feira</option>
            <option value="terça-feira">terça-feira</option>
            <option value="quarta-feira">quarta-feira</option>
            <option value="quinta-feira">quinta-feira</option>
            <option value="sexta-feira">sexta-feira</option>
          </select>
        </div>
      </form>
      <button class="button" type="submit" @click="addElective">Adicionar</button>
    </div>
  </Modal>

  <Modal @close="editModalActive = false" :modalActive="editModalActive">
    <div class="modal-content">
      <h1>Editar Eletivas</h1>
      <form @submit.prevent="editElective">
        <div class="input-group">
          <label for="name">Nome Eletiva</label>
          <input type="text" name="name" v-model="data.name" />
        </div>
        <div class="input-group">
          <label for="name_teacher">Professor</label>
          <input type="text" name="name_teacher" v-model="data.name_teacher" />
        </div>
        <div class="input-group">
          <label for="number_vacancies">Quantidade de Vagas</label>
          <input
            type="number"
            name="number_vacancies"
            min="1"
            max="40"
            v-model="data.number_vacancies"
          />
        </div>
        <div class="input-group">
          <label for="module">Ano</label>
          <select name="module" v-model="data.module">
            <option :value="1">1</option>
            <option :value="2">2</option>
            <option :value="3">3</option>
          </select>
        </div>
        <div class="input-group">
          <label for="frame">Dia</label>
          <select name="frame" v-model="data.frame">
            <option value="segunda-feira">segunda-feira</option>
            <option value="terça-feira">terça-feira</option>
            <option value="quarta-feira">quarta-feira</option>
            <option value="quinta-feira">quinta-feira</option>
            <option value="sexta-feira">sexta-feira</option>
          </select>
        </div>
      </form>
      <button class="button" type="submit" @click="editElective">Editar</button>
    </div> </Modal>
</template>

<script>
import Template from "@/components/TemplateADM";
import { API } from "@/services/api";
import Modal from "@/components/ModalService";
import { ref, computed } from "vue";
import Cookies from "js-cookie";

export default {
  components: {
    Template,
    Modal,
  },
  setup() {
    const addModalActive = ref(false);
    const editModalActive = ref(false);
    const activeIndex = ref(null);
    const electives = ref([]);
    const data = ref({});

    const toggleAddModal = (index) => {
      addModalActive.value = !addModalActive.value;
      activeIndex.value = index;
      data.value = {
        name: null,
        name_teacher: null,
        number_vacancies: null,
        module: index,
        frame: null,
      };
    };

    const toggleEditModal = (elective) => {
      data.value = {
        code: elective.code_elective,
        name: elective.name_elective,
        name_teacher: elective.name_teacher,
        number_vacancies: elective.number_vacancies,
        module: elective.module,
        frame: elective.frame,
      };
      editModalActive.value = !editModalActive.value;
    };

    const fetchElective = async () => {
      try {
        const token = Cookies.get("_myapp_token"); 
        const response = await API.get(
          "/administrator/list-electives",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        electives.value = Object.values(response.data).flat();
      } catch (error) {
        console.log(error.message);
      }
    };

    const organizedElectives = computed(() => {
      const organized = {};
      electives.value.forEach((elective) => {
        const index = elective.module;
        const frame = elective.frame;
        if (!organized[index]) {
          organized[index] = {};
        }
        if (!organized[index][frame]) {
          organized[index][frame] = [];
        }
        organized[index][frame].push(elective);
      });
      return organized;
    });

    const addElective = async () => {
      const { name, name_teacher, number_vacancies, module, frame } =
        data.value;

      try {
        const token = Cookies.get("_myapp_token");
        await API.post(
          "/administrator/create-elective",
          {
            name,
            name_teacher,
            number_vacancies,
            module,
            frame,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        data.value.name = null;
        data.value.name_teacher = null;
        data.value.number_vacancies = null;
        data.value.frame = null;
        addModalActive.value = false;
      } catch (error) {
        console.log(error.message);
      } finally {
        fetchElective();
      }
    };

    const deleteElective = async (code_elective) => {
      try {
        const token = Cookies.get("_myapp_token");
        await API.delete(
          `/administrator/delete-elective/${code_elective}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } catch (error) {
        console.log(error);
      } finally {
        fetchElective();
      }
    };

    const editElective = async () => {
      const { code, name, name_teacher, number_vacancies, module, frame } =
        data.value;

      try {
        const token = Cookies.get("_myapp_token");
        await API.put(
          `/administrator/update-elective/${code}`,
          {
            name,
            name_teacher,
            number_vacancies,
            module,
            frame,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        data.value.name = null;
        data.value.name_teacher = null;
        data.value.number_vacancies = null;
        data.value.frame = null;
        editModalActive.value = false;
      } catch (error) {
        console.log(error);
      } finally {
        fetchElective();
      }
    };

    fetchElective();

    return {
      addModalActive,
      editModalActive,
      toggleAddModal,
      toggleEditModal,
      activeIndex,
      electives,
      data,
      addElective,
      deleteElective,
      editElective,
      organizedElectives
    };
  },
};
</script>


<style scoped>
.content {
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  flex-direction: column;
}

.content h1 {
  color: #374c9b;
  font-size: 18pt;
  margin: 25px 0;
}

.content-table {
  width: 80%;
  margin-bottom: 55px;
}

.content-table .controls {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 5px 25px;
}

.content-table .controls i {
  font-size: 18pt;
  color: #737373;
}

.fa-delete-left {
  font-size: 14pt;
  padding: 0 15px;
  transition: 0.3s;
}

.fa-delete-left:hover {
  color: #ff00007d;
}

.fa-pen-to-square {
  font-size: 14pt;
  padding: 0 15px;
  transition: 0.3s;
}

.fa-pen-to-square:hover {
  color: #edd445;
}

.content-table .controls h2 {
  color: #737373;
  font-weight: 600;
  text-transform: uppercase;
}

.content-table .controls .fa-toggle-on {
  font-size: 25pt;
  color: #6bd15a;
}

.content-table table {
  width: 100%;
  background: #374c9b;
  text-align: center;
  padding: 20px;
  border-radius: 8px;
  border-spacing: 0 20px;
  box-shadow: 3px 3px 3px #0000008b;
}

table th {
  text-transform: uppercase;
  color: #f3f3f3;
  padding: 8px;
  font-weight: 600;
}

table .border-data {
  background: #eef5ff;
}

.border-data td {
  padding: 15px;
}

.frame {
  color: #737373;
  padding: 8px 0;
  margin-bottom: 45px;
  text-align: end;
}
.modal-content h1 {
  color: #263a7f;
  text-align: center;
  padding: 10px;
}
.input-group {
  margin-bottom: 10px;
}

.input-group label {
  display: block;
  margin-bottom: 5px;
  color: #666;
}

.input-group input,
.input-group select {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.button {
  margin-top: 15px;
  padding: 10px 20px;
  background-color: #374c9b;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  width: 100%;
}

.button:hover {
  background-color: #263a7f;
}

.fa-circle-plus {
  position: fixed;
  bottom: 20px;
  font-size: 30pt;
  color: #737373;
  transition: 0.3s;
  display: flex;
  width: 95vw;
  justify-content: flex-end;
}

.fa-circle-plus:hover {
  color: #6bd15a;
}

</style>