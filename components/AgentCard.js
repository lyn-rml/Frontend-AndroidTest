import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

function formatLastLogin(lastLogin) {
  if (!lastLogin) return "Never connected";

  const date = new Date(lastLogin);
  if (Number.isNaN(date.getTime())) return "Unknown";

  return `Last login ${date.toLocaleDateString()} ${date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  })}`;
}

export default function AgentCard({ agent, onEdit, onDelete }) {
  const isActive = agent.is_active ?? agent.isActive ?? false;

  return (
    <View style={styles.card}>
      <View style={{ flex: 1 }}>
        <Text style={styles.name}>{agent.name}</Text>
        <Text style={styles.email}>{agent.email}</Text>
        <View style={styles.statusRow}>
          <View
            style={[
              styles.dot,
              { backgroundColor: isActive ? "#2ECC71" : "#E53935" },
            ]}
          />
          <Text style={styles.statusText}>
            {isActive ? "Active" : "Inactive"}
          </Text>
        </View>
        <Text style={styles.lastLogin}>{formatLastLogin(agent.last_login)}</Text>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity onPress={() => onEdit(agent)} style={styles.editBtn}>
          <Text style={styles.editText}>Edit</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => onDelete(agent)} style={styles.deleteBtn}>
          <Text style={styles.deleteText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 14,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  name: { fontSize: 14, fontWeight: "800", color: "#1E2230" },
  email: { fontSize: 12, color: "#666", marginTop: 2 },

  statusRow: { flexDirection: "row", alignItems: "center", marginTop: 8 },
  dot: { width: 10, height: 10, borderRadius: 5, marginRight: 8 },
  statusText: { fontSize: 12, color: "#444", fontWeight: "600" },
  lastLogin: { fontSize: 11, color: "#777", marginTop: 6 },

  actions: { flexDirection: "row", gap: 10 },
  editBtn: {
    backgroundColor: "#E6E6E6",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  editText: { fontWeight: "700", color: "#333" },

  deleteBtn: {
    backgroundColor: "transparent",
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderRadius: 6,
  },
  deleteText: { fontWeight: "800", color: "#E53935" },
});
