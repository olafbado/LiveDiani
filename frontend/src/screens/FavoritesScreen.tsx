import { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../api/axios';
import { useNavigation } from '@react-navigation/native';
import Colors from '../constants/colors';

import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
export default function FavoritesScreen() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation<any>();

  useFocusEffect(
    useCallback(() => {
      const fetchFavorites = async () => {
        try {
          const res = await api.get('/favorites');
          setEvents(res.data);
        } catch (err) {
          console.error('Error fetching favorites:', err);
        } finally {
          setLoading(false);
        }
      };

      fetchFavorites();
    }, []),
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
        data={events}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('EventDetails', { eventId: item.id })}
          >
            <Image
              source={{ uri: 'http://localhost:5084' + item.mainPhoto?.url }}
              style={styles.image}
            />
            <Text style={styles.title}>{item.title}</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Text style={{ color: Colors.muted, textAlign: 'center' }}>No favorites yet.</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  card: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
  },
  image: {
    height: 160,
    width: '100%',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    padding: 12,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
});
