import axios from "axios";

// --- Juuriosoite ---
const http = axios.create({
  baseURL: "http://localhost:3001/api",
});

// --- CONTACTS ---
export const ContactsAPI = {
  list: (params = {}) => http.get("/contacts", { params }).then((r) => r.data),
  create: (body) => http.post("/contacts", body).then((r) => r.data),
  update: (id, body) => http.put(`/contacts/${id}`, body).then((r) => r.data),
  remove: (id) => http.delete(`/contacts/${id}`),
};

// --- COMPANIES ---
export const CompaniesAPI = {
  list: (params = {}) => http.get("/companies", { params }).then((r) => r.data),
  create: (body) => http.post("/companies", body).then((r) => r.data),
  update: (id, body) => http.put(`/companies/${id}`, body).then((r) => r.data),
  remove: (id) => http.delete(`/companies/${id}`),
};

// --- YELLOW PAGES ---
export const YellowAPI = {
  list: (params = {}) =>
    http.get("/yellow-pages", { params }).then((r) => r.data),
  create: (body) => http.post("/yellow-pages", body).then((r) => r.data),
  update: (id, body) =>
    http.put(`/yellow-pages/${id}`, body).then((r) => r.data),
  remove: (id) => http.delete(`/yellow-pages/${id}`),
};

export default http;
