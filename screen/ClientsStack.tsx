import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ClientsScreen from "./ClientScreen";
import AddContactScreen from "./AddContactScreen";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export type ClientsStackParamList = {
    ClientsMain: undefined;
    AddContact: undefined;
};

const Stack = createNativeStackNavigator<ClientsStackParamList>();

const ClientsStack = () => {
    return (
      <SafeAreaView style={styles.safearea} edges={['top']}>
        <Stack.Navigator>
          <Stack.Screen
            name="ClientsMain"
            component={ClientsScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="AddContact"
            component={AddContactScreen}
            options={{ title: 'Thêm liên hệ' }}
          />
        </Stack.Navigator>
      </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safearea : {
        flex: 1,
        backgroundColor: "#f5f5f5",
    }
})

export default ClientsStack;
