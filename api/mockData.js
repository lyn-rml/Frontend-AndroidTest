export const TEMP_ALERTS = [
  {
    id: "ALERT_001",
    timestamp: "2026-02-24T11:11:00Z",
    camera_detect_bagage_id: "CAM_014",
    proprietaire_id: "Personne_001",
    bagage_id: "Bag_00101",
    status: "ACTIVE",
    ip: "194.168.2.2",

    // ✅ champs utiles pour Alert Details
    cameras_proprietaire_ids: ["CAM_014", "CAM_012"],
    trigger_screenshot_url: "https://picsum.photos/800/500?random=1",
    screenshots_urls: [
      "https://picsum.photos/800/500?random=2",
      "https://picsum.photos/800/500?random=3",
    ],
  },
  {
    id: "ALERT_002",
    timestamp: "2026-02-24T17:12:00Z",
    camera_detect_bagage_id: "CAM_014",
    proprietaire_id: "Personne_001",
    bagage_id: "Bag_00101",
    status: "RESOLVED",
    resolved_at: "2026-02-24T17:12:00Z",
    ip: "194.168.2.2",

    cameras_proprietaire_ids: ["CAM_014"],
    trigger_screenshot_url: "https://picsum.photos/800/500?random=4",
    screenshots_urls: [],
  },
];

export const getTempAlertById = (alertId) =>
  TEMP_ALERTS.find((a) => a.id === alertId);