import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import api from '../api/axios';
import Colors from '../constants/colors';
import { useNavigation } from '@react-navigation/native';

export default function RegisterScreen() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation<any>();

  const handleRegister = async () => {
    if (!username || !email || !password) {
      Alert.alert('Validation', 'Fill in all fields');
      return;
    }

    try {
      await api.post('/auth/register', {
        username,
        email,
        password,
      });

      Alert.alert('Success', 'Account created! You can now log in.');
      navigation.replace('Login');
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Registration failed');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Create Account</Text>

      <TextInput
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        style={styles.input}
      />
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        keyboardType="email-address"
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        style={styles.input}
        secureTextEntry
      />

      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.link}>Already have an account? Log in</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: 'center', backgroundColor: Colors.background },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 24, color: Colors.text },
  input: {
    backgroundColor: Colors.cardBackground,
    padding: 14,
    borderRadius: 8,
    marginBottom: 16,
    color: Colors.text,
  },
  button: {
    backgroundColor: Colors.primary,
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 12,
  },
  buttonText: { color: Colors.white, fontWeight: 'bold' },
  link: {
    marginTop: 16,
    color: Colors.primary,
    textAlign: 'center',
  },
});
