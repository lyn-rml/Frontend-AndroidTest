import { api } from "./api";

// GET /cameras  (+ params status/search)
export const getCameras = ({ status, search } = {}) =>
  api.get("/cameras", {
    params: {
      ...(status && status !== "ALL" ? { status } : {}),
      ...(search ? { search } : {}),
    },
  });