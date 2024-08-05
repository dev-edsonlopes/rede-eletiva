import { createRouter, createWebHistory } from "vue-router";
import Guard from "../src/services/middleware.js";
import LoginPage from "./views/LoginPage";
import MainScreen from "./views/MainScreen";
import Panel from "./views/AccessPanel";
import PanelElective from "./views/PanelElectives";
import PanelStudent from "./views/PanelStudents";

const routes = [
  { path: "/", component: MainScreen, beforeEnter: Guard.auth },
  { path: "/entrar", component: LoginPage },
  { path: "/painel/", component: Panel },
  { path: "/painel/eletiva", component: PanelElective, beforeEnter: Guard.auth },
  { path: "/painel/aluno", component: PanelStudent, beforeEnter: Guard.auth  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
