// middleware.js
import Cookies from "js-cookie";

export default {
  auth(to, from, next) {
    const token = Cookies.get("_myapp_token");
    if (!token) {
      next("/entrar");
    } else {
      next();
    }
  },
};
