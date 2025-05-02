import { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import Colors from '../../constants/colors';
import api from '../../api/axios';
import { useNavigation, useRoute } from '@react-navigation/native';

export default function LocationFormScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const existingLocation = route.params?.location;

  const [name, setName] = useState('');
  const [address, setAddress] = useState('');

  useEffect(() => {
    if (existingLocation) {
      setName(existingLocation.name || '');
      setAddress(existingLocation.address || '');
    }
  }, [existingLocation]);

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Validation', 'Name is required');
      return;
    }

    const payload = { name, address };

    try {
      if (existingLocation) {
        await api.put(`/locations/${existingLocation.id}`, { ...existingLocation, ...payload });
      } else {
        await api.post('/locations', payload);
      }
      navigation.goBack();
    } catch (err) {
      console.error('Save failed:', err);
      Alert.alert('Error', 'Failed to save location.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Location name</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g. Ocean Bar"
        value={name}
        onChangeText={setName}
      />

      <Text style={styles.label}>Address</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g. Main Street 123"
        value={address}
        onChangeText={setAddress}
      />

      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>
          {existingLocation ? 'Update Location' : 'Create Location'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: Colors.background,
    flex: 1,
  },
  label: {
    color: Colors.text,
    marginBottom: 8,
    fontWeight: 'bold',
  },
  input: {
    backgroundColor: Colors.cardBackground,
    padding: 12,
    borderRadius: 8,
    color: Colors.text,
    marginBottom: 20,
  },
  button: {
    backgroundColor: Colors.primary,
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: Colors.white,
    fontWeight: 'bold',
  },
});
