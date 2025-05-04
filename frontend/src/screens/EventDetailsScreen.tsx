import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import Colors from '../constants/colors';
import api from '../api/axios';
import { useEffect, useRef, useState } from 'react';
import { parseISO, format } from 'date-fns';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

export default function EventDetailsScreen() {
  const route = useRoute<any>();
  const { eventId } = route.params;

  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const screenWidth = Dimensions.get('window').width;
  const flatListRef = useRef<FlatList>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);

  const toggleFavorite = async () => {
    try {
      if (isFavorite) {
        await api.delete(`/favorites/${event.id}`);
      } else {
        await api.post(`/favorites/${event.id}`);
      }
      setIsFavorite(!isFavorite);
    } catch (err) {
      console.error('Toggle favorite failed:', err);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [eventRes, favRes] = await Promise.all([
          api.get(`/events/${eventId}`),
          api.get(`/favorites/check/${eventId}`),
        ]);
        setEvent(eventRes.data);
        setIsFavorite(favRes.data.isFavorite);
      } catch (err) {
        console.error('Error fetching event or favorite status:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [eventId]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (error || !event) {
    return (
      <View style={styles.center}>
        <Text style={{ color: Colors.danger }}>Failed to load event.</Text>
      </View>
    );
  }

  const images = [...(event.mainPhoto ? [event.mainPhoto] : []), ...(event.additionalPhotos || [])];

  const scrollToIndex = (index: number) => {
    flatListRef.current?.scrollToIndex({ index, animated: true });
    setActiveIndex(index);
  };

  return (
    <ScrollView style={{ backgroundColor: Colors.background }}>
      <FlatList
        ref={flatListRef}
        data={images}
        horizontal
        pagingEnabled
        keyExtractor={(item, idx) => idx.toString()}
        renderItem={({ item }) => (
          <Image
            source={{ uri: 'http://192.168.1.36:5084' + item.url }}
            style={styles.sliderImage}
          />
        )}
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(e) => {
          const index = Math.round(e.nativeEvent.contentOffset.x / screenWidth);
          setActiveIndex(index);
        }}
      />

      {images.length > 1 && (
        <View style={styles.thumbnailRow}>
          {images.map((img, idx) => (
            <TouchableOpacity key={idx} onPress={() => scrollToIndex(idx)}>
              <Image
                source={{ uri: 'http://192.168.1.36:5084' + img.url }}
                style={[styles.thumbnail, idx === activeIndex && styles.thumbnailSelected]}
              />
            </TouchableOpacity>
          ))}
        </View>
      )}

      <View style={styles.content}>
        <TouchableOpacity
          onPress={toggleFavorite}
          style={{ position: 'absolute', top: -10, right: 10, zIndex: 10 }}
        >
          <Ionicons name={isFavorite ? 'heart' : 'heart-outline'} size={28} color="red" />
        </TouchableOpacity>

        <Text style={styles.title}>{event.title}</Text>
        <Text style={styles.detail}>📅 {format(parseISO(event.date), 'dd MMM yyyy, HH:mm')}</Text>
        {event.location && <Text style={styles.detail}>📍 {event.location.name}</Text>}

        <Text style={styles.section}>Description</Text>
        <Text style={styles.paragraph}>{event.description}</Text>

        {event.tags?.length > 0 && (
          <>
            <Text style={styles.section}>Tags</Text>
            <View style={styles.tagContainer}>
              {event.tags.map((tag: any) => (
                <Text key={tag.id} style={styles.tag}>
                  #{tag.name}
                </Text>
              ))}
            </View>
          </>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  sliderImage: {
    width: Dimensions.get('window').width,
    height: 240,
    resizeMode: 'cover',
  },
  thumbnailRow: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  thumbnail: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 8,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  thumbnailSelected: {
    borderColor: Colors.primary,
  },
  content: {
    padding: 16,
    backgroundColor: Colors.cardBackground,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 8,
  },
  detail: {
    fontSize: 14,
    color: Colors.muted,
    marginBottom: 4,
  },
  section: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginTop: 20,
    marginBottom: 6,
  },
  paragraph: {
    fontSize: 14,
    color: Colors.text,
    lineHeight: 20,
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    backgroundColor: Colors.secondary,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    fontSize: 12,
    marginRight: 6,
    marginBottom: 6,
    color: Colors.white,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
});
