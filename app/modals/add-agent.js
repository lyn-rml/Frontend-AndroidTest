import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { router } from "expo-router";
import { createAgent } from "../../api/userService";

export default function AddAgentModal() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onCreate = async () => {
    if (!fullName.trim() || !email.trim() || !password) {
      Alert.alert("Erreur", "Tous les champs sont obligatoires.");
      return;
    }

    try {
      await createAgent({
        name: fullName.trim(),
        email: email.trim(),
        password,
      });

      router.back(); // ferme le modal
    } catch (e) {
      console.log("CREATE AGENT ERROR:", e?.message);
      Alert.alert("Erreur", "Impossible de créer l’agent.");
    }
  };

  return (
    <View style={styles.backdrop}>
      <View style={styles.modal}>
        <View style={styles.topBar}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.cancel}>Cancel</Text>
          </TouchableOpacity>

          <Text style={styles.title}>Create Agent</Text>

          <TouchableOpacity onPress={onCreate}>
            <Text style={[styles.createTop, !(fullName && email && password) && styles.disabled]}>
              Create
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.form}>
          <Text style={styles.label}>Full Name</Text>
          <TextInput value={fullName} onChangeText={setFullName} style={styles.input} />

          <Text style={styles.label}>Email</Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            style={styles.input}
          />

          <Text style={styles.label}>Password</Text>
          <TextInput value={password} onChangeText={setPassword} secureTextEntry style={styles.input} />

          <TouchableOpacity style={styles.createBtn} onPress={onCreate}>
            <Text style={styles.createBtnText}>Create</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: "rgba(0,0,0,0.35)", justifyContent: "center", padding: 18 },
  modal: { backgroundColor: "#F4F5F7", borderRadius: 14, overflow: "hidden" },
  topBar: {
    backgroundColor: "white",
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#E6E6E6",
  },
  cancel: { color: "#6B73A5", fontWeight: "700" },
  title: { fontWeight: "800", color: "#1E2230" },
  createTop: { color: "#6B73A5", fontWeight: "800" },
  disabled: { opacity: 0.35 },
  form: { padding: 16 },
  label: { marginTop: 10, marginBottom: 6, fontWeight: "700", color: "#333" },
  input: {
    backgroundColor: "white",
    height: 44,
    borderRadius: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#E8E8E8",
  },
  createBtn: {
    marginTop: 22,
    backgroundColor: "#6B73A5",
    height: 50,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  createBtnText: { color: "white", fontWeight: "800", fontSize: 16 },
});