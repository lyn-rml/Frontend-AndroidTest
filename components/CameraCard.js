import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

function statusColor(status) {
  if (status === "ONLINE") return "#2ECC71";
  if (status === "OFFLINE") return "#F39C12";
  if (status === "ALERTING") return "#FF8C00";
  return "#999";
}

function statusLabel(status) {
  if (status === "ONLINE") return "Live";
  if (status === "OFFLINE") return "No signal";
  if (status === "ALERTING") return "Alerting";
  return status || "Unknown";
}

export default function CameraCard({ camera, onLivePress }) {
  const color = statusColor(camera.status);
  const label = statusLabel(camera.status);

  return (
    <View style={styles.card}>
      <View style={styles.left}>
        <Text style={styles.title}>{camera.name}</Text>

        <View style={styles.ipRow}>
          <View style={[styles.dot, { backgroundColor: color }]} />
          <Text style={styles.ip}>{camera.ip}</Text>
        </View>
      </View>

      <TouchableOpacity
        style={[
          styles.badge,
          camera.status === "ONLINE" && styles.badgeGray,
          camera.status === "OFFLINE" && styles.badgeOrange,
          camera.status === "ALERTING" && styles.badgeAlert,
        ]}
        onPress={() => onLivePress?.(camera)}
        activeOpacity={0.8}
      >
        <Text style={styles.badgeText}>{label}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 14,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  left: {
    flex: 1,
    paddingRight: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: "900",
    color: "#1E2230",
  },
  ipRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  ip: {
    fontSize: 12,
    color: "#333",
    fontWeight: "700",
  },
  badge: {
    minWidth: 92,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeGray: {
    backgroundColor: "#E6E6E6",
  },
  badgeOrange: {
    backgroundColor: "#F5A64A",
  },
  badgeAlert: {
    backgroundColor: "#FF8C00",
  },
  badgeText: {
    fontWeight: "900",
    color: "#111",
  },
});