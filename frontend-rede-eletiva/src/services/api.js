// import 'dotenv/config'
import axios from "axios";

export const API = axios.create({
  baseURL: "http://localhost:3000/api/v1",
});
