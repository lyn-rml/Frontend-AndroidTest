import React from "react";
import { View, StyleSheet } from "react-native";
import { Slot, Redirect } from "expo-router";
import EmployeeBottomBar from "../../components/EmployeeBottomBar";
import { useAuth } from "../../context/AuthContext";

export default function EmployeeLayout() {
  const { user } = useAuth();

  if (!user) {
    return <Redirect href="/auth" />;
  }

  if (user.role !== "AGENT") {
    return <Redirect href="/admin" />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Slot />
      </View>
      <EmployeeBottomBar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1 },
});