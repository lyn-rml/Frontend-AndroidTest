import { api } from "./api";

export const getAlerts = (status) =>
  api.get("/alerts", {
    params: status && status !== "ALL" ? { status } : {},
  });

export const getAlertById = (alertId) =>
  api.get(`/alerts/${alertId}`);

export const resolveAlert = (alertId, body = {}) =>
  api.patch(`/alerts/${alertId}/resolve`, body);

export const getAlertsByPersonId = (personId) =>
  api.get("/alerts", {
    params: { proprietaire_id: personId },
  });