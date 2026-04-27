import { useEffect } from "react";
import { Stack, router } from "expo-router";
import Constants from "expo-constants";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

import { AuthProvider } from "../context/AuthContext";
import { useAuth } from "../context/AuthContext";
import { registerPushToken } from "../api/userService";

const PUSH_NOTIFICATIONS_ENABLED = Platform.OS !== "web";

if (PUSH_NOTIFICATIONS_ENABLED) {
    Notifications.setNotificationHandler({
        handleNotification: async () => ({
            shouldPlaySound: true,
            shouldSetBadge: false,
            shouldShowBanner: true,
            shouldShowList: true,
        }),
    });
}

function useNotificationObserver() {
    useEffect(() => {
        if (!PUSH_NOTIFICATIONS_ENABLED) {
            return undefined;
        }

        function redirect(notification) {
            const url = notification.request.content.data?.url;
            const alertId = notification.request.content.data?.alert_id;

            if (typeof url === "string") {
                router.push(url);
                return;
            }

            if (typeof alertId === "string") {
                router.push(`/employee/alert-details/${alertId}`);
            }
        }

        const response = Notifications.getLastNotificationResponse();
        if (response?.notification) {
            redirect(response.notification);
        }

        const subscription = Notifications.addNotificationResponseReceivedListener((resp) => {
            redirect(resp.notification);
        });

        return () => {
            subscription.remove();
        };
    }, []);
}

async function registerForPushNotificationsAsync() {
    if (!PUSH_NOTIFICATIONS_ENABLED) {
        return null;
    }

    if (Platform.OS === "android") {
        await Notifications.setNotificationChannelAsync("alerts", {
            name: "alerts",
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: "#6B73A5",
        });
    }

    if (!Device.isDevice) {
        return null;
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
    }

    if (finalStatus !== "granted") {
        return null;
    }

    const projectId =
        Constants?.expoConfig?.extra?.eas?.projectId ??
        Constants?.easConfig?.projectId;

    if (!projectId) {
        return null;
    }

    const token = await Notifications.getExpoPushTokenAsync({ projectId });
    return token.data;
}

function RootNavigator() {
    const { user } = useAuth();

    useNotificationObserver();

    useEffect(() => {
        async function syncPushToken() {
            if (!PUSH_NOTIFICATIONS_ENABLED) {
                return;
            }

            if (!user?.id || user.role !== "AGENT") {
                return;
            }

            try {
                const token = await registerForPushNotificationsAsync();
                if (!token) {
                    return;
                }

                await registerPushToken(user.id, token);
            } catch (error) {
                console.log("PUSH TOKEN REGISTER ERROR:", error?.response?.data || error?.message);
            }
        }

        syncPushToken();
    }, [user?.id, user?.role]);

    return <Stack screenOptions={{ headerShown: false }} />;
}

export default function RootLayout() {
    return (
        <AuthProvider>
            <RootNavigator />
        </AuthProvider>
    );
}
