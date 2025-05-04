import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import EventDetailsScreen from '../screens/EventDetailsScreen';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../constants/colors';
import EventsByDayScreen from '../screens/EventsByDayScreen';
import ManageStack from './ManageStack';
import ProfileScreen from '../screens/ProfileScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="HomeMain" component={HomeScreen} options={{ title: 'Home' }} />
      <Stack.Screen name="EventDetails" component={EventDetailsScreen} />
      <Stack.Screen name="EventsByDay" component={EventsByDayScreen} />
    </Stack.Navigator>
  );
}

export default function AppNavigator() {
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const getRole = async () => {
      const storedRole = await AsyncStorage.getItem('role');
      setRole(storedRole);
    };
    getRole();
  }, []);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.muted,
        tabBarStyle: {
          backgroundColor: Colors.cardBackground,
          borderTopColor: Colors.background,
        },
        tabBarIcon: ({ color, size }) => {
          let iconName = 'home';
          if (route.name === 'Home') iconName = 'home';
          if (route.name === 'Manage') iconName = 'settings';
          return <Ionicons name={iconName as any} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeStack} />
      {role === 'admin' && <Tab.Screen name="Manage" component={ManageStack} />}
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Ionicons name="person" size={size} color={color} />,
        }}
      />
    </Tab.Navigator>
  );
}
