import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import api from '../api/axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Colors from '../constants/colors';

export default function LoginScreen({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const res = await api.post('/auth/login', { email, password });
      const token = res.data.token;
      const role = res.data.role;

      await AsyncStorage.setItem('token', token);
      await AsyncStorage.setItem('role', role);

      navigation.reset({
        index: 0,
        routes: [{ name: 'App' }],
      });
    } catch (err) {
      console.error('Login failed:', err);
      Alert.alert('Login failed', 'Invalid credentials');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput placeholder="Email" style={styles.input} value={email} onChangeText={setEmail} />
      <TextInput
        placeholder="Password"
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Log in</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text style={styles.link}>Don't have an account? Register</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24, backgroundColor: Colors.background },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 32, color: Colors.text },
  input: {
    backgroundColor: Colors.cardBackground,
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    color: Colors.text,
  },
  link: {
    marginTop: 16,
    color: Colors.primary,
    textAlign: 'center',
  },

  button: {
    backgroundColor: Colors.primary,
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: { color: Colors.white, fontWeight: 'bold' },
});
