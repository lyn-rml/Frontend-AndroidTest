import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

function formatTime(timestamp) {
  if (!timestamp) return "";
  const d = new Date(timestamp);
  return d.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatResolvedDate(timestamp) {
  if (!timestamp) return "";
  const d = new Date(timestamp);

  const day = d.getDate();
  const month = d.toLocaleString("en-US", { month: "short" });
  const time = d.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return `${month} ${day}, ${time}`;
}

export default function AlertCard({ alert, onPress }) {
  const isResolved = alert.status === "RESOLVED";

  const alertNumber = alert.id
    ? alert.id.slice(-3)
    : "001";

  const cameraName = alert.camera_detect_bagage_id || "CAM_---";
  const personName = alert.proprietaire_id || "Unknown";
  const bagName = alert.bagage_id || "Unknown";
  const ipText = alert.ip || "Unknown IP";

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      <View style={styles.topRow}>
        <Text style={styles.alertTitle}>Alert {alertNumber}</Text>
        <Text style={styles.dots}>----</Text>
      </View>

      <Text style={styles.cameraText}>{cameraName}</Text>

      <View style={styles.middleRow}>
        <Text style={styles.infoText}>{personName}</Text>
        <Text style={styles.infoText}>{bagName}</Text>
      </View>

      <View style={styles.bottomRow}>
        <View style={styles.ipRow}>
          <View style={styles.greenDot} />
          <Text style={styles.ipText}>{ipText}</Text>
        </View>

        <Text style={styles.timeText}>
          {isResolved
            ? `Resolved ${formatResolvedDate(alert.resolved_at || alert.timestamp)}`
            : `Time : ${formatTime(alert.timestamp)}`}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    padding: 18,
    marginBottom: 16,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  alertTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: "#6B73A5",
  },
  dots: {
    fontSize: 18,
    fontWeight: "900",
    color: "#111",
    letterSpacing: 1,
  },
  cameraText: {
    marginTop: 14,
    fontSize: 22,
    fontWeight: "900",
    color: "#111",
  },
  middleRow: {
    flexDirection: "row",
    marginTop: 10,
    gap: 18,
  },
  infoText: {
    fontSize: 15,
    color: "#222",
  },
  bottomRow: {
    marginTop: 18,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  ipRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  greenDot: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#53C943",
    marginRight: 10,
  },
  ipText: {
    fontSize: 16,
    color: "#222",
  },
  timeText: {
    fontSize: 16,
    color: "#222",
  },
});
