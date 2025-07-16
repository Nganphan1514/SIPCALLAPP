//D:\SipCallApp\screen\KeypadScreen.tsx
import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { saveCallHistory } from "../android/src/services/FireStoreService";

// ✅ Kiểu cho từng nút trên bàn phím
type KeypadButtonType = {
  number: string;
  letters: string;
};

const KeypadScreen = () => {
  const [phoneNumber, setPhoneNumber] = useState("");

  const keypadData: KeypadButtonType[][] = [
    [
      { number: "1", letters: "" },
      { number: "2", letters: "ABC" },
      { number: "3", letters: "DEF" },
    ],
    [
      { number: "4", letters: "GHI" },
      { number: "5", letters: "JKL" },
      { number: "6", letters: "MNO" },
    ],
    [
      { number: "7", letters: "PQRS" },
      { number: "8", letters: "TUV" },
      { number: "9", letters: "WXYZ" },
    ],
    [
      { number: "*", letters: "" },
      { number: "0", letters: "" },
      { number: "#", letters: "" },
    ],
  ];

  const handleKeyPress = (key: string) => {
    setPhoneNumber((prev) => prev + key);
  };

  const handleBackspace = () => {
    setPhoneNumber((prev) => prev.slice(0, -1));
  };

  const renderKeypadButton = (item: KeypadButtonType) => (
    <TouchableOpacity
      key={item.number}
      style={styles.keypadButton}
      onPress={() => handleKeyPress(item.number)}
    >
      <Text style={styles.keypadNumber}>{item.number}</Text>
      {item.letters && <Text style={styles.keypadLetters}>{item.letters}</Text>}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity>
          <Icon name="close" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Call using (234) 345-345</Text>
        <TouchableOpacity>
          <Icon name="expand-more" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      {/* Hiển thị số điện thoại */}
      <View style={styles.displayContainer}>
        <Text style={styles.phoneNumberDisplay}>
          {phoneNumber || "Enter number"}
        </Text>
        {phoneNumber.length > 0 && (
          <TouchableOpacity
            style={styles.backspaceButton}
            onPress={handleBackspace}
          >
            <Icon name="backspace" size={24} color="#666" />
          </TouchableOpacity>
        )}
      </View>

      {/* Bàn phím số */}
      <View style={styles.keypadContainer}>
        {keypadData.map((row: KeypadButtonType[], rowIndex: number) => (
          <View key={rowIndex} style={styles.keypadRow}>
            {row.map((item: KeypadButtonType) => renderKeypadButton(item))}
          </View>
        ))}
      </View>

      {/* Các nút hành động */}
      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={styles.callButton}
          onPress={() => {
            if (phoneNumber) {
              saveCallHistory(phoneNumber, "outgoing");
              console.log("Calling SIP:", phoneNumber);
            }
          }}
        >
          <Icon name="call" size={28} color="#fff" />
        </TouchableOpacity>
        
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
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
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
  displayContainer: {
    paddingHorizontal: 32,
    paddingVertical: 24,
    backgroundColor: "#fff",
    alignItems: "center",
    minHeight: 80,
    justifyContent: "center",
  },
  phoneNumberDisplay: {
    fontSize: 24,
    fontWeight: "400",
    color: "#333",
    letterSpacing: 2,
  },
  backspaceButton: {
    position: "absolute",
    right: 16,
    top: 24,
    padding: 8,
  },
  keypadContainer: {
    flex: 1,
    paddingHorizontal: 32,
    paddingVertical: 16,
    justifyContent: "center",
  },
  keypadRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  keypadButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#e8f5e8",
    justifyContent: "center",
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  keypadNumber: {
    fontSize: 24,
    fontWeight: "500",
    color: "#333",
  },
  keypadLetters: {
    fontSize: 10,
    color: "#666",
    marginTop: 2,
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingHorizontal: 32,
    paddingVertical: 24,
    backgroundColor: "#fff",
  },
  callButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#4CAF50",
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  
});

export default KeypadScreen;
