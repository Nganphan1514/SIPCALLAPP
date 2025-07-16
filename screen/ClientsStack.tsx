// ✅ ClientsStack.tsx
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ClientsScreen from "./ClientScreen";
import AddContactScreen from "./AddContactScreen";

export type ClientsStackParamList = {
    ClientsMain: undefined;
    AddContact: undefined;
};

const Stack = createNativeStackNavigator<ClientsStackParamList>();

const ClientsStack = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="ClientsMain"
                component={ClientsScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="AddContact"
                component={AddContactScreen}
                options={{ title: "Thêm liên hệ" }}
            />
        </Stack.Navigator>
    );
};

export default ClientsStack;
