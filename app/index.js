import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  SafeAreaView,
} from "react-native";
import { router } from "expo-router";

export default function Welcome() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      <View style={styles.bg}>
        <View style={styles.bgTopGlow} />
        <View style={styles.bgBottomGlow} />
        <View style={styles.overlay} />

        <View style={styles.content}>
          <Text style={styles.brand}>MULTIVISIO</Text>

          <Text style={styles.title}>Security{"\n"}App</Text>
          <Text style={styles.subtitle}>Secure Monitoring & Alerts</Text>

          <TouchableOpacity
            style={styles.button}
            onPress={() => router.push("/auth")}
          >
            <Text style={styles.buttonText}>Get Started</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#111522" },
  bg: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "#161C2E",
  },
  bgTopGlow: {
    position: "absolute",
    top: -80,
    right: -40,
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: "rgba(138, 152, 214, 0.26)",
  },
  bgBottomGlow: {
    position: "absolute",
    left: -70,
    bottom: 120,
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: "rgba(93, 117, 211, 0.18)",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.28)",
  },
  content: { paddingHorizontal: 22, paddingBottom: 28 },
  brand: { color: "#BFC6E6", fontWeight: "800", letterSpacing: 1, marginBottom: 18 },
  title: { color: "white", fontSize: 44, fontWeight: "900", lineHeight: 48 },
  subtitle: {
    color: "rgba(255,255,255,0.8)",
    marginTop: 10,
    marginBottom: 22,
    fontSize: 14,
  },
  button: {
    backgroundColor: "rgba(255,255,255,0.85)",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    width: "100%",
    maxWidth: 520,
    alignSelf: "center",
  },
  buttonText: { color: "#1E2230", fontWeight: "800", fontSize: 16 },
});
