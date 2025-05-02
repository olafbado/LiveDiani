import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import EventDetailsScreen from '../screens/EventDetailsScreen';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../constants/colors';
import EventsByDayScreen from '../screens/EventsByDayScreen';
import ManageStack from './ManageStack';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="HomeMain" component={HomeScreen} options={{ title: 'Home' }} />
      <Stack.Screen name="EventDetails" component={EventDetailsScreen} options={{ title: 'Details' }} />
      <Stack.Screen name="EventsByDay" component={EventsByDayScreen} options={{ title: 'Events by Day' }} />
    </Stack.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }: { route: { name: string } }) => ({
          tabBarActiveTintColor: Colors.primary,
          tabBarInactiveTintColor: Colors.muted,
          headerShown: false,
          tabBarStyle: {
            backgroundColor: Colors.cardBackground,
            borderTopColor: Colors.background,
          },
          tabBarIcon: ({ color, size }: { color: string; size: number }) => {
            let iconName = 'home';
            if (route.name === 'Home') iconName = 'home';
            if (route.name === 'Details') iconName = 'information-circle';
            return <Ionicons name={iconName as any} size={size} color={color} />;
          },
        })}
      >
        <Tab.Screen name="Home" component={HomeStack} />
        <Tab.Screen
  name="Manage"
  component={ManageStack}
  options={{
    tabBarIcon: ({ color, size }) => (
      <Ionicons name="settings" size={size} color={color} />
    ),
  }}
/>
      </Tab.Navigator>
    </NavigationContainer>
  );
}
