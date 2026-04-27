import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  RefreshControl,
  Alert,
} from "react-native";
import CameraCard from "../../components/CameraCard";
import { getCameras } from "../../api/cameraService";

const TABS = ["ALL", "ONLINE", "OFFLINE", "ALERTING"];

export default function CamerasPage() {
  const [tab, setTab] = useState("ALL");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [cameras, setCameras] = useState([]);

  const debounceRef = useRef(null);

  const fetchFromApi = async (nextTab = tab, nextSearch = search) => {
    try {
      setLoading(true);

      const res = await getCameras({
        status: nextTab,
        search: nextSearch.trim() || undefined,
      });

      setCameras(res.data?.data || []);
    } catch (e) {
      console.log("GET CAMERAS ERROR:", e?.message);
      Alert.alert("Erreur", "Impossible de récupérer les caméras.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFromApi(tab, search);
  }, [tab]);

  const onTabPress = (t) => {
    setTab(t);
  };

  const onSearchChange = (text) => {
    setSearch(text);

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      fetchFromApi(tab, text);
    }, 400);
  };

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();

    return cameras.filter((c) => {
      const matchesTab = tab === "ALL" ? true : c.status === tab;

      const matchesSearch = !q
        ? true
        : c.name?.toLowerCase().includes(q) ||
        c.ip?.toLowerCase().includes(q) ||
        c._id?.toLowerCase().includes(q);

      return matchesTab && matchesSearch;
    });
  }, [cameras, tab, search]);

  const onLivePress = (camera) => {
    Alert.alert("Camera", `${camera.name} - ${camera.status}`);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Cameras</Text>
      </View>

      <View style={styles.tabs}>
        {TABS.map((t) => (
          <TouchableOpacity
            key={t}
            onPress={() => onTabPress(t)}
            style={styles.tabBtn}
          >
            <Text style={[styles.tabText, tab === t && styles.tabActive]}>
              {t === "ALL" ? "ALL" : t[0] + t.slice(1).toLowerCase()}
            </Text>
            {tab === t && <View style={styles.tabUnderline} />}
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.searchWrap}>
        <TextInput
          value={search}
          onChangeText={onSearchChange}
          placeholder="Search Cameras"
          placeholderTextColor="#999"
          style={styles.searchInput}
        />
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <CameraCard camera={item} onLivePress={onLivePress} />
        )}
        contentContainerStyle={{ padding: 14, paddingBottom: 20 }}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={() => fetchFromApi(tab, search)}
          />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#DADBDD" },
  header: { backgroundColor: "#6B73A5", paddingVertical: 14, paddingHorizontal: 14 },
  headerTitle: { color: "white", fontWeight: "900", fontSize: 18 },

  tabs: {
    flexDirection: "row",
    backgroundColor: "white",
    paddingHorizontal: 10,
    paddingTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#E6E6E6",
  },
  tabBtn: { flex: 1, alignItems: "center", paddingBottom: 10 },
  tabText: { fontWeight: "800", color: "#1E2230" },
  tabActive: { color: "#1E2230" },
  tabUnderline: {
    height: 3,
    width: 40,
    backgroundColor: "#6B73A5",
    marginTop: 8,
    borderRadius: 3,
  },

  searchWrap: { padding: 14 },
  searchInput: {
    backgroundColor: "#EFEFEF",
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 13,
    color: "#111",
  },
});