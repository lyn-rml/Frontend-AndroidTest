import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  RefreshControl,
  Alert,
  Modal,
  Switch,
} from "react-native";
import { BlurView } from "expo-blur";

import AgentCard from "../../components/AgentCard";
import {
  createAgent,
  deleteUser,
  getAgents,
  searchAgents,
  updateUser,
} from "../../api/userService";

export default function AdminPanel() {
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [agents, setAgents] = useState([]);

  const [selectedAgent, setSelectedAgent] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editPassword, setEditPassword] = useState("");
  const [editIsActive, setEditIsActive] = useState(true);

  const [addName, setAddName] = useState("");
  const [addEmail, setAddEmail] = useState("");
  const [addPassword, setAddPassword] = useState("");

  const debounceRef = useRef(null);

  const fetchAgents = async () => {
    try {
      setLoading(true);
      const res = await getAgents();
      setAgents(res.data || []);
    } catch (e) {
      console.log("GET AGENTS ERROR:", e?.response?.data || e?.message);
      Alert.alert("Erreur", "Impossible de récupérer la liste des agents.");
    } finally {
      setLoading(false);
    }
  };

  const fetchSearch = async (q) => {
    try {
      setLoading(true);
      const res = await searchAgents(q);
      setAgents(res.data || []);
    } catch (e) {
      console.log("SEARCH AGENTS ERROR:", e?.response?.data || e?.message);
      Alert.alert("Erreur", "Recherche impossible.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAgents();
  }, []);

  useEffect(() => {
    const q = search.trim();
    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      if (!q) {
        fetchAgents();
      } else {
        fetchSearch(q);
      }
    }, 400);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [search]);

  const onAdd = () => {
    setAddName("");
    setAddEmail("");
    setAddPassword("");
    setShowAddModal(true);
  };

  const onEdit = (agent) => {
    setSelectedAgent(agent);
    setEditName(agent.name || "");
    setEditEmail(agent.email || "");
    setEditPassword("");
    setEditIsActive(agent.is_active ?? true);
    setShowEditModal(true);
  };

  const onDelete = (agent) => {
    setSelectedAgent(agent);
    setShowDeleteModal(true);
  };

  const saveEditedAgent = async () => {
    if (!selectedAgent) return;
    if (!editName.trim() || !editEmail.trim()) {
      Alert.alert("Erreur", "Nom et email sont obligatoires.");
      return;
    }

    try {
      const payload = {
        name: editName.trim(),
        email: editEmail.trim(),
        is_active: editIsActive,
      };

      if (editPassword) {
        payload.password = editPassword;
      }

      const res = await updateUser(selectedAgent.id || selectedAgent._id, payload);
      setAgents((prev) =>
        prev.map((agent) =>
          agent.id === (selectedAgent.id || selectedAgent._id) ? res.data : agent
        )
      );
      setShowEditModal(false);
      setSelectedAgent(null);
    } catch (e) {
      console.log("UPDATE USER ERROR:", e?.response?.data || e?.message);
      Alert.alert("Erreur", "Impossible de modifier l’agent.");
    }
  };

  const confirmDelete = async () => {
    if (!selectedAgent) return;

    try {
      await deleteUser(selectedAgent.id || selectedAgent._id);
      setAgents((prev) =>
        prev.filter((agent) => agent.id !== (selectedAgent.id || selectedAgent._id))
      );
      setShowDeleteModal(false);
      setSelectedAgent(null);
    } catch (e) {
      console.log("DELETE USER ERROR:", e?.response?.data || e?.message);
      Alert.alert("Erreur", "Impossible de supprimer l’agent.");
    }
  };

  const confirmCreate = async () => {
    if (!addName.trim() || !addEmail.trim() || !addPassword) {
      Alert.alert("Erreur", "Tous les champs sont obligatoires.");
      return;
    }

    try {
      const res = await createAgent({
        name: addName.trim(),
        email: addEmail.trim(),
        password: addPassword,
      });
      setAgents((prev) => [res.data, ...prev]);
      setShowAddModal(false);
    } catch (e) {
      console.log("CREATE AGENT ERROR:", e?.response?.data || e?.message);
      Alert.alert("Erreur", "Impossible de créer l’agent.");
    }
  };

  const renderItem = ({ item }) => (
    <AgentCard agent={item} onEdit={onEdit} onDelete={onDelete} />
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Admin Panel</Text>
        <TouchableOpacity style={styles.addBtn} onPress={onAdd}>
          <Text style={styles.addText}>+ Add</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>Agents</Text>
      <View style={styles.underline} />

      <View style={styles.searchBox}>
        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="Search for Name or Email"
          placeholderTextColor="#999"
          style={styles.searchInput}
        />
      </View>

      <FlatList
        data={agents}
        keyExtractor={(item) => String(item.id || item._id || item.email)}
        renderItem={renderItem}
        contentContainerStyle={{ paddingTop: 10, paddingBottom: 20 }}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={fetchAgents} />
        }
        ListEmptyComponent={
          !loading ? <Text style={styles.emptyText}>No agents found</Text> : null
        }
      />

      <Modal
        visible={showEditModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowEditModal(false)}
      >
        <BlurView intensity={30} style={StyleSheet.absoluteFillObject} />
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <View style={styles.modalTopBar}>
              <Text onPress={() => setShowEditModal(false)} style={styles.modalCancel}>
                Cancel
              </Text>
              <Text style={styles.modalTitle}>Edit Agent</Text>
              <Text onPress={saveEditedAgent} style={styles.modalAction}>
                Edit
              </Text>
            </View>

            <View style={styles.form}>
              <Text style={styles.label}>Full Name</Text>
              <TextInput value={editName} onChangeText={setEditName} style={styles.input} />

              <Text style={styles.label}>Email</Text>
              <TextInput
                value={editEmail}
                onChangeText={setEditEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                style={styles.input}
              />

              <Text style={styles.label}>Password</Text>
              <TextInput
                value={editPassword}
                onChangeText={setEditPassword}
                secureTextEntry
                placeholder="(optional)"
                style={styles.input}
              />

              <View style={styles.switchRow}>
                <Text style={styles.labelInline}>Active</Text>
                <Switch value={editIsActive} onValueChange={setEditIsActive} />
              </View>

              <TouchableOpacity style={styles.primaryBtn} onPress={saveEditedAgent}>
                <Text style={styles.primaryBtnText}>Edit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        visible={showDeleteModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowDeleteModal(false)}
      >
        <BlurView intensity={30} style={StyleSheet.absoluteFillObject} />
        <View style={styles.modalOverlayCenter}>
          <View style={styles.deleteBox}>
            <Text style={styles.deleteTitle}>Delete Agent ?</Text>
            <Text style={styles.deleteText}>
              Are you sure you want to delete{" "}
              <Text style={{ fontWeight: "900" }}>{selectedAgent?.name}</Text> ?
            </Text>

            <View style={styles.deleteRow}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setShowDeleteModal(false)}
              >
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.deleteBtn} onPress={confirmDelete}>
                <Text style={styles.deleteBtnText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        visible={showAddModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowAddModal(false)}
      >
        <BlurView intensity={30} style={StyleSheet.absoluteFillObject} />
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <View style={styles.modalTopBar}>
              <Text onPress={() => setShowAddModal(false)} style={styles.modalCancel}>
                Cancel
              </Text>
              <Text style={styles.modalTitle}>Create Agent</Text>
              <Text onPress={confirmCreate} style={styles.modalAction}>
                Create
              </Text>
            </View>

            <View style={styles.form}>
              <Text style={styles.label}>Full Name</Text>
              <TextInput value={addName} onChangeText={setAddName} style={styles.input} />

              <Text style={styles.label}>Email</Text>
              <TextInput
                value={addEmail}
                onChangeText={setAddEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                style={styles.input}
              />

              <Text style={styles.label}>Password</Text>
              <TextInput
                value={addPassword}
                onChangeText={setAddPassword}
                secureTextEntry
                style={styles.input}
              />

              <TouchableOpacity style={styles.primaryBtn} onPress={confirmCreate}>
                <Text style={styles.primaryBtnText}>Create</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#DADBDD", paddingHorizontal: 14, paddingTop: 10 },
  header: {
    backgroundColor: "#6B73A5",
    borderRadius: 6,
    paddingVertical: 12,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerTitle: { color: "white", fontWeight: "800", fontSize: 16 },
  addBtn: { backgroundColor: "#E6E6E6", paddingVertical: 8, paddingHorizontal: 14, borderRadius: 6 },
  addText: { fontWeight: "800", color: "#333" },
  sectionTitle: { marginTop: 14, fontSize: 16, fontWeight: "800", color: "#1E2230" },
  underline: { height: 3, width: 70, backgroundColor: "#6B73A5", marginTop: 4, borderRadius: 3 },
  searchBox: {
    marginTop: 12,
    backgroundColor: "#EFEFEF",
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  searchInput: { fontSize: 13, color: "#111" },
  emptyText: { textAlign: "center", color: "#555", marginTop: 32, fontWeight: "600" },
  modalOverlay: { flex: 1, justifyContent: "center", padding: 18, backgroundColor: "rgba(0,0,0,0.25)" },
  modalBox: { backgroundColor: "#F4F5F7", borderRadius: 14, overflow: "hidden" },
  modalTopBar: {
    backgroundColor: "white",
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#E6E6E6",
  },
  modalCancel: { color: "#6B73A5", fontWeight: "700" },
  modalTitle: { fontWeight: "800", color: "#1E2230" },
  modalAction: { color: "#6B73A5", fontWeight: "800" },
  form: { padding: 16 },
  label: { marginTop: 10, marginBottom: 6, fontWeight: "700", color: "#333" },
  input: {
    backgroundColor: "white",
    height: 44,
    borderRadius: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#E8E8E8",
  },
  switchRow: {
    marginTop: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  labelInline: { fontWeight: "700", color: "#333" },
  primaryBtn: {
    marginTop: 22,
    backgroundColor: "#6B73A5",
    height: 50,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  primaryBtnText: { color: "white", fontWeight: "800", fontSize: 16 },
  modalOverlayCenter: { flex: 1, justifyContent: "center", alignItems: "center", padding: 18, backgroundColor: "rgba(0,0,0,0.25)" },
  deleteBox: { width: "100%", maxWidth: 420, backgroundColor: "white", borderRadius: 12, padding: 18 },
  deleteTitle: { fontSize: 18, fontWeight: "900", textAlign: "center" },
  deleteText: { marginTop: 10, textAlign: "center", color: "#333", fontWeight: "600" },
  deleteRow: { marginTop: 18, flexDirection: "row", justifyContent: "center" },
  cancelBtn: { backgroundColor: "#E6E6E6", paddingVertical: 10, paddingHorizontal: 18, borderRadius: 8, marginRight: 12 },
  cancelBtnText: { fontWeight: "800", color: "#333" },
  deleteBtn: { backgroundColor: "#E53935", paddingVertical: 10, paddingHorizontal: 18, borderRadius: 8 },
  deleteBtnText: { fontWeight: "900", color: "black" },
});
