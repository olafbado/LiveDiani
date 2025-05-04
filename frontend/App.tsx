import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen'; // <-- dodaj ten import
import AppNavigator from './src/navigation/AppNavigator';

const Stack = createNativeStackNavigator();

export default function App() {
  const [initialRoute, setInitialRoute] = useState<string | null>(null);

  useEffect(() => {
    const checkToken = async () => {
      const token = await AsyncStorage.getItem('token');
      setInitialRoute(token ? 'App' : 'Login');
    };
    checkToken();
  }, []);

  if (!initialRoute) return null;

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={initialRoute}>
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
        <Stack.Screen name="App" component={AppNavigator} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
