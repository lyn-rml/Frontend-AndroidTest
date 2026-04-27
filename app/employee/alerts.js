import React, { useEffect, useState, useRef } from "react";
import { Platform } from "react-native";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  RefreshControl,
  Alert,
} from "react-native";
import { router } from "expo-router";
import AlertCard from "../../components/AlertCard";
import { getAlerts } from "../../api/alertService";
import { WS_URL } from "../../constants/network";

const TABS = ["ALL", "ACTIVE", "RESOLVED"];

export default function AlertsPage() {
  const [tab, setTab] = useState("ALL");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const tabRef = useRef(tab);

  const fetchAlerts = async (nextTab = tab) => {
    try {
      setLoading(true);

      const statusParam = nextTab === "ALL" ? undefined : nextTab;
      const res = await getAlerts(statusParam);

      setData(res.data || []);
    } catch (e) {
      console.log("GET ALERTS ERROR:", e?.message);
      Alert.alert("Erreur", "Impossible de récupérer les alertes.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts(tab);
  }, [tab]);

  useEffect(() => {
    tabRef.current = tab;
  }, [tab]);

  useEffect(() => {
    const ws = new WebSocket(WS_URL);

    ws.onopen = () => {
      console.log("WS connected:", WS_URL);
    };

    ws.onmessage = (msg) => {
      try {
        const payload = JSON.parse(msg.data);

        const event =
          payload.event ||
          (payload.status === "RESOLVED" ? "alert_resolved" : "new_alert");

        const incoming = payload.data || payload;

        if (event === "new_alert") {
          setData((prev) => {
            const currentTab = tabRef.current;

            if (currentTab === "RESOLVED") return prev;

            if (prev.some((a) => a.id === incoming.id)) return prev;

            return [incoming, ...prev];
          });
          return;
        }

        if (event === "alert_resolved") {
          setData((prev) => {
            const currentTab = tabRef.current;

            const updated = prev.map((a) =>
              a.id === incoming.id
                ? { ...a, ...incoming, status: "RESOLVED" }
                : a
            );

            if (currentTab === "ACTIVE") {
              return updated.filter((a) => a.status !== "RESOLVED");
            }

            if (currentTab === "RESOLVED") {
              const exists = updated.some((a) => a.id === incoming.id);
              if (exists) return updated;

              return [{ ...incoming, status: "RESOLVED" }, ...updated];
            }

            return updated;
          });
        }
      } catch (e) {
        console.log("WS message parse error:", e?.message);
      }
    };

    ws.onerror = (e) => {
      console.log("WS error:", e?.message || e);
    };

    ws.onclose = () => {
      console.log("WS disconnected");
    };

    return () => {
      ws.close();
    };
  }, []);

  const onPressAlert = (alert) => {
    router.push(`/employee/alert-details/${alert.id}`);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerBack}>‹</Text>
        <Text style={styles.headerTitle}>Alerts</Text>
      </View>

      <View style={styles.tabs}>
        {TABS.map((t) => (
          <TouchableOpacity
            key={t}
            onPress={() => setTab(t)}
            style={styles.tabBtn}
          >
            <Text style={[styles.tabText, tab === t && styles.tabTextActive]}>
              {t === "ALL" ? "ALL" : t[0] + t.slice(1).toLowerCase()}
            </Text>
            {tab === t && <View style={styles.tabUnderline} />}
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={data}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item, index }) => (
          <AlertCard
            alert={{ ...item, displayIndex: index + 1 }}
            onPress={() => onPressAlert(item)}
          />
        )}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={() => fetchAlerts(tab)}
          />
        }
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#DADBDD",
  },
  header: {
    backgroundColor: "#6B73A5",
    paddingTop: 14,
    paddingBottom: 14,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
  },
  headerBack: {
    color: "white",
    fontSize: 34,
    fontWeight: "400",
    marginRight: 10,
    lineHeight: 34,
  },
  headerTitle: {
    color: "white",
    fontWeight: "900",
    fontSize: 18,
  },
  tabs: {
    flexDirection: "row",
    backgroundColor: "white",
    paddingHorizontal: 10,
    paddingTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#D9D9D9",
  },
  tabBtn: {
    flex: 1,
    alignItems: "center",
    paddingBottom: 10,
  },
  tabText: {
    fontWeight: "800",
    color: "#111",
    fontSize: 14,
  },
  tabTextActive: {
    color: "#111",
  },
  tabUnderline: {
    height: 3,
    width: 48,
    backgroundColor: "#6B73A5",
    marginTop: 8,
    borderRadius: 3,
  },
  listContent: {
    padding: 14,
    paddingBottom: 20,
  },
});
