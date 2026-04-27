import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Pressable,
} from "react-native";
import { useEffect, useMemo, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { getAlertsByPersonId } from "../../../api/alertService";
import { API_URL } from "../../../constants/network";
import ResponsiveRemoteImage from "../../../components/ResponsiveRemoteImage";

function fullUrl(u) {
  if (!u) return "";
  if (u.startsWith("http://") || u.startsWith("https://")) return u;
  return `${API_URL}${u}`;
}

export default function PersonDetailsPage() {
  const { personId } = useLocalSearchParams();
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAlerts = async () => {
      try {
        setLoading(true);
        const response = await getAlertsByPersonId(personId);
        setAlerts(response?.data || []);
      } catch (error) {
        console.log("Erreur getAlertsByPersonId:", error?.message);
        setAlerts([]);
      } finally {
        setLoading(false);
      }
    };

    if (personId) {
      loadAlerts();
    }
  }, [personId]);

  const cameraHistory = useMemo(() => {
    const allHistory = alerts.flatMap((alert) =>
      (alert.owner_camera_history || []).map((historyItem) => ({
        ...historyItem,
        alert_id: alert.id,
        proprietaire_id: alert.proprietaire_id,
      }))
    );

    return allHistory.sort(
      (a, b) => new Date(b.seen_at).getTime() - new Date(a.seen_at).getTime()
    );
  }, [alerts]);

  const formatTime = (dateString) => {
    if (!dateString) return "Unknown";
    const date = new Date(dateString);
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const renderItem = ({ item, index }) => {
    const isLatest = index === 0;
    const imageUrl = item.screenshot_url ? fullUrl(item.screenshot_url) : "";

    return (
      <Pressable style={[styles.card, isLatest && styles.latestCard]}>
        {imageUrl ? (
          <ResponsiveRemoteImage
            uri={imageUrl}
            minHeight={180}
            maxHeight={360}
            style={styles.imageWrap}
          />
        ) : (
          <View style={[styles.imagePlaceholder, styles.placeholder]}>
            <Text style={styles.placeholderText}>No image</Text>
          </View>
        )}

        <View style={styles.row}>
          <Text style={styles.cameraText}>{(item.camera_id || "").toUpperCase()}</Text>
          <Text style={styles.timeText}>
            {isLatest
              ? `Time: ${formatTime(item.seen_at)}`
              : `Seen at: ${formatTime(item.seen_at)}`}
          </Text>
        </View>
      </Pressable>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>List Cameras</Text>
      </View>

      {loading ? (
        <Text style={styles.message}>Loading...</Text>
      ) : cameraHistory.length === 0 ? (
        <Text style={styles.message}>No cameras found</Text>
      ) : (
        <FlatList
          data={cameraHistory}
          keyExtractor={(item, index) => `${item.alert_id}-${item.camera_id}-${index}`}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#d9d9d9",
  },
  header: {
    backgroundColor: "#7c82ad",
    paddingVertical: 18,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "#2da8ff",
  },
  headerTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "600",
  },
  list: {
    padding: 14,
  },
  card: {
    backgroundColor: "#f3f3f3",
    padding: 14,
    marginBottom: 16,
  },
  latestCard: {
    backgroundColor: "red",
  },
  imageWrap: {
    marginBottom: 12,
  },
  imagePlaceholder: {
    width: "100%",
    minHeight: 180,
    marginBottom: 12,
    borderRadius: 8,
    overflow: "hidden",
  },
  placeholder: {
    backgroundColor: "#ddd",
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    color: "#555",
    fontWeight: "600",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cameraText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111",
  },
  timeText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#111",
  },
  message: {
    textAlign: "center",
    marginTop: 40,
    fontSize: 16,
  },
});
