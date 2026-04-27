import { View, Text, FlatList, StyleSheet, Pressable } from "react-native";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "expo-router";
import { getAlerts } from "../../api/alertService";

export default function PersonesPage() {
  const router = useRouter();
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadAlerts = async () => {
      try {
        setLoading(true);
        const response = await getAlerts();
        setAlerts(response.data || []);
      } catch (error) {
        console.log("Erreur lors du chargement des alerts :", error?.message);
        setAlerts([]);
      } finally {
        setLoading(false);
      }
    };

    loadAlerts();
  }, []);

  const persons = useMemo(() => {
    const grouped = {};

    alerts.forEach((alert) => {
      const personId = alert.proprietaire_id;
      if (!personId) return;

      if (!grouped[personId]) {
        grouped[personId] = alert;
      } else {
        const oldTime = new Date(grouped[personId].timestamp).getTime();
        const newTime = new Date(alert.timestamp).getTime();

        if (newTime > oldTime) {
          grouped[personId] = alert;
        }
      }
    });

    return Object.values(grouped).sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }, [alerts]);

  const formatLastSeen = (timestamp) => {
    if (!timestamp) return "Unknown";

    const date = new Date(timestamp);
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const renderItem = ({ item }) => {
    const lastCamera = item.camera_detect_bagage_id || "Unknown";

    return (
      <Pressable
        style={styles.card}
        onPress={() =>
          router.push({
            pathname: "/employee/person-details/[personId]",
            params: { personId: item.proprietaire_id },
          })
        }
      >
        <Text style={styles.title}>{item.proprietaire_id}</Text>
        <Text style={styles.text}>Last seen : {formatLastSeen(item.timestamp)}</Text>
        <Text style={styles.text}>Last Camera : {lastCamera}</Text>
        <Text style={styles.dots}>••••</Text>
      </Pressable>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>List</Text>

      <FlatList
        data={persons}
        keyExtractor={(item) => item.proprietaire_id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        refreshing={loading}
        ListEmptyComponent={
          !loading ? (
            <Text style={styles.emptyText}>No persons found</Text>
          ) : null
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#d9d9d9",
  },
  header: {
    fontSize: 28,
    fontWeight: "600",
    color: "#fff",
    backgroundColor: "#7c82ad",
    paddingVertical: 18,
    paddingHorizontal: 20,
  },
  list: {
    paddingTop: 16,
    paddingBottom: 20,
  },
  card: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    position: "relative",
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 10,
    color: "#111",
  },
  text: {
    fontSize: 15,
    color: "#333",
    marginBottom: 4,
  },
  dots: {
    position: "absolute",
    right: 16,
    top: 14,
    fontSize: 18,
    fontWeight: "700",
    color: "#111",
  },
  emptyText: {
    textAlign: "center",
    marginTop: 40,
    fontSize: 16,
    color: "#333",
  },
});
