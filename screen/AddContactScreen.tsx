import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import { addContact } from "../android/src/services/FireStoreService";
import { useNavigation } from "@react-navigation/native";

const AddContactScreen = () => {
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const navigation = useNavigation();

    const handleAdd = async () => {
        if (!name || !phone) {
            Alert.alert("Lỗi", "Vui lòng nhập đầy đủ tên và số điện thoại");
            return;
        }

        await addContact(name, phone);
        Alert.alert("Thành công", "Đã thêm liên hệ mới");
        navigation.goBack(); // Quay lại màn hình trước
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Thêm Danh Bạ</Text>
            <TextInput
                placeholder="Tên"
                value={name}
                onChangeText={setName}
                style={styles.input}
            />
            <TextInput
                placeholder="Số điện thoại"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
                style={styles.input}
            />
            <Button title="Lưu" onPress={handleAdd} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: "#fff",
    },
    title: {
        fontSize: 22,
        fontWeight: "bold",
        marginBottom: 20,
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        padding: 12,
        borderRadius: 8,
        marginBottom: 12,
    },
});

export default AddContactScreen;
