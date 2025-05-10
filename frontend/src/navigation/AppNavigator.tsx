import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../constants/colors';
import ManageStack from './ManageStack';
import ProfileScreen from '../screens/ProfileScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import FavoritesScreen from '../screens/FavoritesScreen';
import HomeStack from './HomeStack';
import FavoritesStack from './FavoritesStack';

const Tab = createBottomTabNavigator();

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
          if (route.name === 'Favorites') iconName = 'heart';
          if (route.name === 'Profile') iconName = 'person';
          return <Ionicons name={iconName as any} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeStack} options={{ headerShown: false }} />

      {role === 'admin' && (
        <Tab.Screen name="Manage" component={ManageStack} options={{ headerShown: false }} />
      )}
      <Tab.Screen name="Favorites" component={FavoritesStack} options={{ headerShown: false }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: 'Profile' }} />
    </Tab.Navigator>
  );
}
