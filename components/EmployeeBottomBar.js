import React from "react";
import { View, TouchableOpacity, StyleSheet, Image } from "react-native";
import { router, usePathname } from "expo-router";

const ICON_SIZE = 80; // <-- change ici (36 ou 40)

export default function EmployeeBottomBar() {
  const pathname = usePathname();
  const isActive = (route) => pathname === route;

  return (
    <View style={styles.bar}>
      <TouchableOpacity onPress={() => router.replace("/employee")} style={styles.item}>
        <Image
          source={require("../assets/icons/nav-camera.png")}
          style={[styles.icon, { opacity: isActive("/employee") ? 1 : 0.4 }]}
          resizeMode="contain"
        />
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.replace("/employee/alerts")} style={styles.item}>
        <Image
          source={require("../assets/icons/nav-alert.png")}
          style={[styles.icon, { opacity: isActive("/employee/alerts") ? 1 : 0.4 }]}
          resizeMode="contain"
        />
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.replace("/employee/persones")} style={styles.item}>
        <Image
          source={require("../assets/icons/nav-menu.png")}
          style={[styles.icon, { opacity: isActive("/employee/persones") ? 1 : 0.4 }]}
          resizeMode="contain"
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    height: 70, // un peu plus grand si tu mets ICON_SIZE=40
    backgroundColor: "#F4F5F7",
    borderTopWidth: 1,
    borderTopColor: "#E6E6E6",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingBottom: 6,
  },
  item: { padding: 10 },
  icon: { width: ICON_SIZE, height: ICON_SIZE },
});
