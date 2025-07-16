import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import {
  getContacts,
  deleteContact,
  Contact,
} from "D:/SipCallApp/android/src/services/FireStoreService.ts";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ClientsStackParamList } from "./ClientsStack"; 


const ClientsScreen = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [contacts, setContacts] = useState<Contact[]>([]); // ✅ Khai báo kiểu Contact[]

  const navigation = useNavigation<NativeStackNavigationProp<ClientsStackParamList>>();


  const loadContacts = async () => {
    const data = await getContacts(); // nên đảm bảo getContacts trả về Contact[]
    setContacts(data);
  };

  useEffect(() => {
    loadContacts();
  }, []);

  const handleDelete = (id: string) => {
    Alert.alert("Xoá", "Bạn có chắc muốn xoá không?", [
      { text: "Huỷ" },
      {
        text: "Xoá",
        onPress: async () => {
          await deleteContact(id);
          loadContacts();
        },
      },
    ]);
  };

  const renderClientItem = ({ item }: { item: Contact }) => (
    <TouchableOpacity style={styles.clientItem}>
      <View style={styles.avatarContainer}>
        <Text style={styles.avatarText}>{item.name?.[0]}</Text>
      </View>
      <View style={styles.clientInfo}>
        <Text style={styles.clientName}>{item.name}</Text>
        <Text style={styles.clientNumber}>{item.phone}</Text>
      </View>
      <TouchableOpacity style={styles.moreButton} onPress={() => handleDelete(item.id)}>
        <Icon name="delete" size={20} color="#f44336" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Danh bạ</Text>
        <TouchableOpacity onPress={loadContacts}>
          <Icon name="refresh" size={24} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate("AddContact")}>
          <Icon name="person-add" size={24} color="#4CAF50" />
        </TouchableOpacity>

      </View>

      <View style={styles.searchContainer}>
        <Icon name="search" size={20} color="#666" />
        <TextInput
          style={styles.searchInput}
          placeholder="Tìm kiếm..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <FlatList
        data={contacts.filter(
          (c) =>
            c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.phone.includes(searchQuery)
        )}
        renderItem={renderClientItem}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  addButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#e8f5e8",
    justifyContent: "center",
    alignItems: "center",
  },
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
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: "#333",
  },
  clientItem: {
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
    backgroundColor: "#2196F3",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  avatarText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
  clientInfo: {
    flex: 1,
  },
  clientName: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
    marginBottom: 2,
  },
  clientNumber: {
    fontSize: 14,
    color: "#666",
  },
  moreButton: {
    padding: 8,
  },
});

export default ClientsScreen;
