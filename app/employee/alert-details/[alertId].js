import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { getAlertById, resolveAlert } from "../../../api/alertService";
import { API_URL, WS_URL } from "../../../constants/network";
import ResponsiveRemoteImage from "../../../components/ResponsiveRemoteImage";

function fullUrl(u) {
  if (!u) return "";
  if (u.startsWith("http://") || u.startsWith("https://")) return u;
  return `${API_URL}${u}`;
}

export default function AlertDetailsPage() {
  const { alertId } = useLocalSearchParams();

  const [loading, setLoading] = useState(true);
  const [resolving, setResolving] = useState(false);
  const [alertData, setAlertData] = useState(null);

  const alertIdRef = useRef(String(alertId || ""));

  useEffect(() => {
    alertIdRef.current = String(alertId || "");

    if (!alertId) return;

    let isMounted = true;

    const loadDetails = async () => {
      try {
        setLoading(true);
        const res = await getAlertById(alertId);
        if (isMounted) {
          setAlertData(res.data || null);
        }
      } catch (e) {
        console.log("GET ALERT DETAILS ERROR:", e?.message);
        if (isMounted) {
          Alert.alert("Erreur", "Impossible de charger les details de l alerte.");
          setAlertData(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadDetails();

    return () => {
      isMounted = false;
    };
  }, [alertId]);

  useEffect(() => {
    const ws = new WebSocket(WS_URL);

    ws.onmessage = (msg) => {
      try {
        const payload = JSON.parse(msg.data);

        const event = payload.event || "alert_update";
        const data = payload.data || payload;

        if (event !== "alert_update") return;

        const incomingId = String(data.alert_id || data.id || "");
        if (!incomingId || incomingId !== alertIdRef.current) return;

        setAlertData((prev) => {
          if (!prev) return prev;

          const newCam = data.new_owner_camera_id;
          const newShot = data.new_screenshot_url;

          const cams = Array.isArray(prev.cameras_proprietaire_ids)
            ? [...prev.cameras_proprietaire_ids]
            : [];

          const shots = Array.isArray(prev.screenshots_urls)
            ? [...prev.screenshots_urls]
            : [];

          if (newCam) cams.push(newCam);
          if (newShot) shots.push(newShot);

          return {
            ...prev,
            cameras_proprietaire_ids: cams,
            screenshots_urls: shots,
          };
        });
      } catch (e) {
        console.log("WS parse error:", e?.message);
      }
    };

    return () => ws.close();
  }, []);

  const onResolve = async () => {
    if (!alertData || alertData.status === "RESOLVED") return;

    try {
      setResolving(true);

      const res = await resolveAlert(alertId, {
        status: "RESOLVED",
      });

      setAlertData((prev) => ({
        ...prev,
        ...res.data,
        status: "RESOLVED",
      }));

      Alert.alert("OK", "Alerte resolue.");
    } catch (e) {
      console.log("RESOLVE ERROR:", e?.message);
      Alert.alert("Erreur", "Impossible de resoudre l alerte.");
    } finally {
      setResolving(false);
    }
  };

  const triggerImage = useMemo(
    () => fullUrl(alertData?.trigger_screenshot_url),
    [alertData]
  );

  const ownerShots = alertData?.screenshots_urls || [];
  const ownerCams = alertData?.cameras_proprietaire_ids || [];

  const ownerRows = ownerShots.map((url, i) => {
    const cam = ownerCams[i] || "";
    return { url: fullUrl(url), cam };
  });

  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator />
      </View>
    );
  }

  if (!alertData) {
    return (
      <View style={[styles.container, { padding: 16 }]}>
        <Text style={{ fontWeight: "800" }}>Alerte introuvable</Text>
        <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 12 }}>
          <Text style={{ color: "#6B73A5", fontWeight: "800" }}>Retour</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.back}>{"\u2039"}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Alert Details</Text>
        <View style={{ width: 20 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.block}>
          <Text style={styles.camTitle}>
            {(alertData.camera_detect_bagage_id || "").toUpperCase()}
          </Text>

          <ResponsiveRemoteImage
            uri={triggerImage}
            minHeight={180}
            maxHeight={360}
          />

          <View style={styles.metaRow}>
            <Text style={styles.metaText}>{alertData.bagage_id}</Text>
            <Text style={styles.metaText}>
              {(alertData.camera_detect_bagage_id || "").toUpperCase()}
            </Text>
          </View>
        </View>

        {ownerRows.map((row, idx) => (
          <View key={`${row.url}-${idx}`} style={styles.block}>
            <View style={styles.ownerTop}>
              <Text style={styles.ownerName}>{alertData.proprietaire_id}</Text>
              <Text style={styles.ownerCam}>{(row.cam || "").toUpperCase()}</Text>
            </View>

            <ResponsiveRemoteImage
              uri={row.url}
              minHeight={180}
              maxHeight={360}
            />
          </View>
        ))}

        <TouchableOpacity
          style={[
            styles.resolveBtn,
            alertData.status === "RESOLVED" && { opacity: 0.5 },
          ]}
          onPress={onResolve}
          disabled={resolving || alertData.status === "RESOLVED"}
        >
          <Text style={styles.resolveText}>
            {resolving
              ? "..."
              : alertData.status === "RESOLVED"
                ? "Resolved"
                : "Resolve"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#DADBDD" },
  center: { justifyContent: "center", alignItems: "center" },

  header: {
    backgroundColor: "#6B73A5",
    paddingVertical: 12,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  back: {
    color: "white",
    fontSize: 28,
    fontWeight: "900",
    paddingHorizontal: 6,
  },
  headerTitle: {
    color: "white",
    fontWeight: "900",
    fontSize: 18,
  },
  scrollContent: {
    padding: 14,
    paddingBottom: 30,
  },
  block: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
  },
  camTitle: {
    fontSize: 16,
    fontWeight: "900",
    marginBottom: 10,
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#EDEDED",
    marginTop: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  metaText: {
    fontWeight: "800",
    color: "#333",
  },
  ownerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#EDEDED",
    marginBottom: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  ownerName: {
    fontWeight: "900",
    color: "#333",
  },
  ownerCam: {
    fontWeight: "900",
    color: "#D94A4A",
  },
  resolveBtn: {
    marginTop: 8,
    backgroundColor: "#6B73A5",
    height: 54,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  resolveText: {
    color: "white",
    fontWeight: "900",
    fontSize: 16,
  },
});
