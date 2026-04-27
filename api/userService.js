// api/userService.js
import { api } from "./api";

// GET /users?role=AGENT
export const getAgents = () => api.get("/users", { params: { role: "AGENT" } });

// GET /users?role=AGENT&search=alice
export const searchAgents = (search) =>
  api.get("/users", { params: { role: "AGENT", search } });

// POST /users
export const createAgent = ({ name, email, password }) =>
  api.post("/users", { name, email, password, role: "AGENT" });

// PATCH /api/users/{userId}
export const updateUser = (userId, payload) =>
  api.patch(`/users/${userId}`, payload);

// DELETE /api/users/{userId}
export const deleteUser = (userId) =>
  api.delete(`/users/${userId}`);

// POST /users/{userId}/push-token
export const registerPushToken = (userId, token) =>
  api.post(`/users/${userId}/push-token`, { token });
