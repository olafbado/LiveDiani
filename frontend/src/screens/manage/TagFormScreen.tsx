import { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import Colors from '../../constants/colors';
import api from '../../api/axios';
import { useNavigation, useRoute } from '@react-navigation/native';

export default function TagFormScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const existingTag = route.params?.tag;

  const [name, setName] = useState('');

  useEffect(() => {
    if (existingTag) {
      setName(existingTag.name);
    }
  }, [existingTag]);

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Validation', 'Name is required');
      return;
    }

    try {
      if (existingTag) {
        // EDIT
        await api.put(`/tags/${existingTag.id}`, { ...existingTag, name });
      } else {
        // CREATE
        await api.post('/tags', { name });
      }
      navigation.goBack();
    } catch (err) {
      console.error('Save failed:', err);
      Alert.alert('Error', 'Something went wrong while saving.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Tag name</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g. Live Music"
        value={name}
        onChangeText={setName}
      />

      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>{existingTag ? 'Update Tag' : 'Create Tag'}</Text>
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
