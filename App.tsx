import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons';

// Các màn hình
import CallsScreen from './screen/CallScreen';
import ClientScreen from './screen/ClientScreen'; 
import KeypadScreen from './screen/KeypadScreen';
import VoicemailScreen from './screen/VoicemailScreen';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarIcon: ({ color, size }) => {
            let iconName = '';

            switch (route.name) {
              case 'Calls':
                iconName = 'phone';
                break;
              case 'Clients':
                iconName = 'people';
                break;
              case 'Keypad':
                iconName = 'dialpad';
                break;
              case 'Voicemail':
                iconName = 'voicemail';
                break;
              default:
                iconName = 'phone';
            }

            return <Icon name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#2196F3',
          tabBarInactiveTintColor: '#666',
        })}
      >
        <Tab.Screen name="Calls" component={CallsScreen} />
        <Tab.Screen name="Clients" component={ClientScreen} />
        <Tab.Screen name="Keypad" component={KeypadScreen} />
        <Tab.Screen name="Voicemail" component={VoicemailScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
