import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import {
  getCallHistory,
  CallHistory,
} from "../android/src/services/FireStoreService";
import { useFocusEffect } from "@react-navigation/native";

type Call = CallHistory & {
  name: string;
  avatar: string;
  time: string;
};

const CallsScreen = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<"all" | "missed">("all");
  const [calls, setCalls] = useState<Call[]>([]);

  // Tự động reload mỗi khi màn hình được focus
  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        const data = await getCallHistory();
        const mapped = data.map((item) => ({
          ...item,
          name: item.phone,
          avatar: item.phone[0] || "U",
          time: new Date(item.calledAt).toLocaleString(),
        }));
        setCalls(mapped);
      };
      fetchData();
    }, [])
  );

  const getCallIcon = (type: Call["type"]) => {
    switch (type) {
      case "incoming":
        return <Icon name="call-received" size={16} color="#4CAF50" />;
      case "outgoing":
        return <Icon name="call-made" size={16} color="#2196F3" />;
      case "missed":
        return <Icon name="call-missed" size={16} color="#F44336" />;
      default:
        return <Icon name="call" size={16} color="#666" />;
    }
  };

  const filteredData = calls.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.phone.includes(searchQuery);
    const matchesFilter = activeFilter === "all" || item.type === "missed";
    return matchesSearch && matchesFilter;
  });

  const renderCallItem = ({ item }: { item: Call }) => (
    <TouchableOpacity style={styles.callItem}>
      <View style={styles.avatarContainer}>
        <Text style={styles.avatarText}>{item.avatar}</Text>
      </View>
      <View style={styles.callInfo}>
        <Text style={styles.callName}>{item.name}</Text>
        <View style={styles.callDetails}>
          {getCallIcon(item.type)}
          <Text style={styles.callTime}>{item.time}</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.moreButton}>
        <Icon name="more-vert" size={20} color="#666" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity>
          <Icon name="close" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Calls</Text>
        <View style={styles.headerRight} />
      </View>

      {/* Bộ lọc All / Missed */}
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[
            styles.filterButton,
            activeFilter === "all" && styles.activeFilter,
          ]}
          onPress={() => setActiveFilter("all")}
        >
          <Text
            style={[
              styles.filterText,
              activeFilter === "all" && styles.activeFilterText,
            ]}
          >
            All
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filterButton,
            activeFilter === "missed" && styles.activeFilter,
          ]}
          onPress={() => setActiveFilter("missed")}
        >
          <Text
            style={[
              styles.filterText,
              activeFilter === "missed" && styles.activeFilterText,
            ]}
          >
            Missed
          </Text>
        </TouchableOpacity>
      </View>

      {/* Ô tìm kiếm */}
      <View style={styles.searchContainer}>
        <Icon name="search" size={20} color="#666" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search Calls..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Danh sách cuộc gọi */}
      <FlatList
        data={filteredData}
        renderItem={renderCallItem}
        keyExtractor={(item) => item.id}
        style={styles.callsList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  headerTitle: { fontSize: 18, fontWeight: "600", color: "#333" },
  headerRight: { width: 24 },
  filterContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "#fff",
  },
  filterButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 12,
    backgroundColor: "#f0f0f0",
  },
  menuOptionText: {
    fontSize: 14,
    padding: 8,
    color: "#333",
  },

  activeFilter: { backgroundColor: "#2196F3" },
  filterText: { fontSize: 14, color: "#666" },
  activeFilterText: { color: "#fff" },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  searchInput: { flex: 1, marginLeft: 8, fontSize: 16, color: "#333" },
  callsList: { flex: 1 },
  callItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#4CAF50",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  avatarText: { fontSize: 16, fontWeight: "600", color: "#fff" },
  callInfo: { flex: 1 },
  callName: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
    marginBottom: 2,
  },
  callDetails: { flexDirection: "row", alignItems: "center" },
  callTime: { fontSize: 12, color: "#666", marginLeft: 4 },
  moreButton: { padding: 8 },
});

export default CallsScreen;
