import React from "react";
import { Redirect, Stack } from "expo-router";
import { useAuth } from "../../context/AuthContext";

export default function AdminLayout() {
    const { user } = useAuth();

    if (!user) {
        return <Redirect href="/auth" />;
    }

    if (user.role !== "ADMIN") {
        return <Redirect href="/employee" />;
    }

    return <Stack screenOptions={{ headerShown: false }} />;
}