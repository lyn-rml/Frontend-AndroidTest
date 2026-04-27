import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from "react-native";
import Constants from "expo-constants";
import { router } from "expo-router";
import { useAuth } from "../context/AuthContext";

const extra = Constants.expoConfig?.extra ?? {};
const deviceAuth = extra.deviceAuth ?? {};
const AGENT_CODE = deviceAuth.agentCode || "AGENT-2026";
const ADMIN_CODE = deviceAuth.adminCode || "ADMIN-2026";

export default function Auth() {
  const { login } = useAuth();

  const [displayName, setDisplayName] = useState("");
  const [accessCode, setAccessCode] = useState("");
  const [selectedRole, setSelectedRole] = useState("AGENT");
  const [showCode, setShowCode] = useState(false);
  const [loading, setLoading] = useState(false);

  const onSignIn = async () => {
    if (!displayName.trim() || !accessCode.trim()) {
      Alert.alert("Erreur", "Nom et code d'accès requis.");
      return;
    }

    try {
      setLoading(true);

      const expectedCode = selectedRole === "ADMIN" ? ADMIN_CODE : AGENT_CODE;
      if (accessCode.trim().toUpperCase() !== expectedCode.toUpperCase()) {
        Alert.alert("Connexion échouée", "Code d'accès invalide pour ce rôle.");
        return;
      }

      const normalizedName = displayName.trim();
      const user = {
        id: `device-${selectedRole.toLowerCase()}-${normalizedName.toLowerCase().replace(/\s+/g, "-")}`,
        name: normalizedName,
        email: `${normalizedName.toLowerCase().replace(/\s+/g, ".")}@device.local`,
        role: selectedRole,
        authMethod: "device-access-code",
      };

      login({ user });

      if (user.role === "ADMIN") {
        router.replace("/admin");
        return;
      }

      router.replace("/employee");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.center}>
          <Text style={styles.brand}>MULTIVISIO</Text>
          <Text style={styles.subtitle}>Mode test Android / APK</Text>
        </View>

        <View>
          <View style={styles.roleRow}>
            <TouchableOpacity
              style={[styles.roleChip, selectedRole === "AGENT" && styles.roleChipActive]}
              onPress={() => setSelectedRole("AGENT")}
            >
              <Text style={[styles.roleText, selectedRole === "AGENT" && styles.roleTextActive]}>
                Agent
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.roleChip, selectedRole === "ADMIN" && styles.roleChipActive]}
              onPress={() => setSelectedRole("ADMIN")}
            >
              <Text style={[styles.roleText, selectedRole === "ADMIN" && styles.roleTextActive]}>
                Admin
              </Text>
            </TouchableOpacity>
          </View>

          <TextInput
            value={displayName}
            onChangeText={setDisplayName}
            placeholder="Nom affiché"
            placeholderTextColor="#B5B5B5"
            autoCapitalize="words"
            style={styles.input}
          />

          <View style={styles.passwordRow}>
            <TextInput
              value={accessCode}
              onChangeText={setAccessCode}
              placeholder="Code d'accès"
              placeholderTextColor="#B5B5B5"
              autoCapitalize="characters"
              secureTextEntry={!showCode}
              style={[styles.input, { flex: 1, marginBottom: 0 }]}
            />
            <TouchableOpacity onPress={() => setShowCode((v) => !v)}>
              <Text style={styles.showText}>{showCode ? "Hide" : "Show"}</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.hint}>
            Code Agent: {AGENT_CODE}{"\n"}Code Admin: {ADMIN_CODE}
          </Text>

          <TouchableOpacity style={styles.button} onPress={onSignIn} disabled={loading}>
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Entrer dans l'app</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.replace("/")}>
            <Text style={styles.backHome}>Back</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#DADBDD" },
  container: { flex: 1, justifyContent: "center", paddingHorizontal: 22 },
  center: { alignItems: "center", marginBottom: 26 },
  brand: { fontSize: 26, fontWeight: "800", color: "#6B73A5", letterSpacing: 1 },
  subtitle: { marginTop: 6, color: "#6D6D6D", fontWeight: "600" },

  roleRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 12,
  },
  roleChip: {
    flex: 1,
    backgroundColor: "#ECECEC",
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
  },
  roleChipActive: {
    backgroundColor: "#6B73A5",
  },
  roleText: {
    color: "#4B4B4B",
    fontWeight: "700",
  },
  roleTextActive: {
    color: "white",
  },

  input: {
    backgroundColor: "white",
    height: 48,
    borderRadius: 10,
    paddingHorizontal: 14,
    fontSize: 14,
    marginBottom: 12,
  },

  passwordRow: { flexDirection: "row", alignItems: "center" },
  showText: { marginLeft: 10, color: "#6B73A5", fontWeight: "700" },

  hint: {
    marginTop: 14,
    textAlign: "center",
    color: "#6B73A5",
    fontWeight: "600",
    lineHeight: 22,
  },

  button: {
    marginTop: 26,
    backgroundColor: "#6B73A5",
    height: 52,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: { color: "white", fontSize: 16, fontWeight: "800" },
  backHome: { marginTop: 14, textAlign: "center", color: "#6B73A5", fontWeight: "600" },
});
