import { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import Colors from '../../constants/colors';
import api from '../../api/axios';
import { useNavigation, useRoute } from '@react-navigation/native';

export default function CategoryFormScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const existingCategory = route.params?.category;

  const [name, setName] = useState('');

  useEffect(() => {
    if (existingCategory) {
      setName(existingCategory.name);
    }
  }, [existingCategory]);

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Validation', 'Name is required');
      return;
    }

    try {
      if (existingCategory) {
        await api.put(`/eventcategories/${existingCategory.id}`, {
          ...existingCategory,
          name,
        });
      } else {
        await api.post('/eventcategories', { name });
      }
      navigation.goBack();
    } catch (err) {
      console.error('Save failed:', err);
      Alert.alert('Error', 'Failed to save category.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Category name</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g. Party"
        value={name}
        onChangeText={setName}
      />

      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>
          {existingCategory ? 'Update Category' : 'Create Category'}
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
