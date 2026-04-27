import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { deleteUser } from "../../api/userService";

export default function DeleteAgentModal() {
  const params = useLocalSearchParams();
  const userId = params.userId;
  const name = params.name ? String(params.name) : "this agent";

  const onDelete = async () => {
    if (!userId) return Alert.alert("Erreur", "userId manquant");

    try {
      await deleteUser(userId);
      router.back();
    } catch (e) {
      console.log("DELETE ERROR:", e?.message);
      Alert.alert("Erreur", "Impossible de supprimer l’agent.");
    }
  };

  return (
    <View style={styles.backdrop}>
      <View style={styles.box}>
        <Text style={styles.title}>Delete Agent ?</Text>
        <Text style={styles.text}>
          Are you sure you want to delete <Text style={styles.bold}>{name}</Text> ?
        </Text>

        <View style={styles.row}>
          <TouchableOpacity style={styles.cancelBtn} onPress={() => router.back()}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.deleteBtn} onPress={onDelete}>
            <Text style={styles.deleteText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: "rgba(0,0,0,0.35)", justifyContent: "center", alignItems: "center", padding: 18 },
  box: { width: "100%", maxWidth: 420, backgroundColor: "white", borderRadius: 12, padding: 18 },
  title: { fontSize: 18, fontWeight: "900", textAlign: "center" },
  text: { marginTop: 10, textAlign: "center", color: "#333", fontWeight: "600" },
  bold: { fontWeight: "900" },
  row: { marginTop: 18, flexDirection: "row", justifyContent: "center", gap: 12 },
  cancelBtn: { backgroundColor: "#E6E6E6", paddingVertical: 10, paddingHorizontal: 18, borderRadius: 8 },
  cancelText: { fontWeight: "800", color: "#333" },
  deleteBtn: { backgroundColor: "#E53935", paddingVertical: 10, paddingHorizontal: 18, borderRadius: 8 },
  deleteText: { fontWeight: "900", color: "black" },
});