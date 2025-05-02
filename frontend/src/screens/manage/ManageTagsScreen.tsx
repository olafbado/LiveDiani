import { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  FlatList,
} from 'react-native';
import Colors from '../../constants/colors';
import api from '../../api/axios';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';

export default function ManageTagsScreen() {
  const [tags, setTags] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation<any>();
  useFocusEffect(
    useCallback(() => {
      const fetchTags = async () => {
        try {
          const res = await api.get('/tags');
          setTags(res.data);
        } catch (err) {
          console.error('Failed to load tags:', err);
        } finally {
          setLoading(false);
        }
      };
      fetchTags();
    }, []),
  );

  const handleDelete = async (id: number) => {
    console.log('Deleting tag ID:', id);

    try {
      await api.delete(`/tags/${id}`);
      setTags((prev) => prev.filter((tag) => tag.id !== id));
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.item}>
      <Text style={styles.name}>🏷 {item.name}</Text>
      <View style={styles.actions}>
        <TouchableOpacity onPress={() => navigation.navigate('TagForm', { tag: item })}>
          <Ionicons name="pencil" size={20} color={Colors.secondary} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleDelete(item.id)} style={{ marginLeft: 16 }}>
          <Ionicons name="trash" size={20} color={Colors.danger} />
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={tags}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 80 }}
      />
      <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('TagForm')}>
        <Ionicons name="add" size={28} color="white" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 16,
  },
  item: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  name: {
    fontSize: 16,
    color: Colors.text,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  fab: {
    position: 'absolute',
    right: 24,
    bottom: 24,
    backgroundColor: Colors.primary,
    padding: 16,
    borderRadius: 32,
    elevation: 2,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
