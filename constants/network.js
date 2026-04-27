import Constants from "expo-constants";
import { Platform } from "react-native";

const extra = Constants.expoConfig?.extra ?? {};

const androidConnectionMode =
  process.env.EXPO_PUBLIC_ANDROID_LINK_MODE ||
  extra.androidConnectionMode ||
  "adb-reverse";

function adaptLocalhostForAndroid(rawUrl = "") {
  if (!rawUrl || Platform.OS !== "android") {
    return rawUrl;
  }

  if (androidConnectionMode === "emulator") {
    return rawUrl
      .replace("://localhost", "://10.0.2.2")
      .replace("://127.0.0.1", "://10.0.2.2");
  }

  if (androidConnectionMode === "adb-reverse") {
    return rawUrl
      .replace("://localhost", "://127.0.0.1")
      .replace("://10.0.2.2", "://127.0.0.1");
  }

  return rawUrl;
}

const defaultApiUrl = "http://localhost:3000";
const defaultWsUrl = "ws://localhost:3000/ws";

const configuredApiUrl =
  process.env.EXPO_PUBLIC_API_URL ||
  process.env.API_URL ||
  extra.apiUrl ||
  defaultApiUrl;

const configuredWsUrl =
  process.env.EXPO_PUBLIC_WS_URL ||
  process.env.WS_URL ||
  extra.wsUrl ||
  defaultWsUrl;

export const API_URL = adaptLocalhostForAndroid(configuredApiUrl);
export const WS_URL = adaptLocalhostForAndroid(configuredWsUrl);
export const ANDROID_CONNECTION_MODE = androidConnectionMode;
