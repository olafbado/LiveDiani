import { View, Text, Image, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { useRoute } from '@react-navigation/native';
import Colors from '../constants/colors';
import api from '../api/axios';
import { useEffect, useState } from 'react';
import { parseISO, format } from 'date-fns';

export default function EventDetailsScreen() {
  const route = useRoute<any>();
  const { eventId } = route.params;

  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await api.get(`/events/${eventId}`);
        setEvent(res.data);
      } catch (err) {
        console.error('Error fetching event:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
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

  return (
    <ScrollView style={{ backgroundColor: Colors.background }}>
      <Image
        source={{
          uri: event?.photos?.[0]?.url || 'https://source.unsplash.com/800x400/?event',
        }}
        style={{ width: '100%', height: 200 }}
      />

      <View style={{ padding: 16, backgroundColor: Colors.cardBackground }}>
        <Text style={styles.title}>{event.title}</Text>
        <Text style={styles.date}>📅 {format(parseISO(event.date), 'dd MMM yyyy, HH:mm')}</Text>
        <Text style={styles.location}>📍 {event.location?.name}</Text>
        {event.price && <Text style={styles.price}>💰 {event.price}</Text>}

        <Text style={styles.section}>Opis</Text>
        <Text style={styles.paragraph}>{event.description}</Text>

        {event.tags?.length > 0 && (
          <>
            <Text style={styles.section}>Tagi</Text>
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
  title: { fontSize: 24, fontWeight: 'bold', color: Colors.text, marginBottom: 4 },
  date: { fontSize: 14, color: Colors.muted },
  location: { fontSize: 14, color: Colors.muted },
  price: { fontSize: 14, color: Colors.text, marginBottom: 16 },
  section: { fontSize: 16, fontWeight: '600', color: Colors.text, marginTop: 16, marginBottom: 6 },
  paragraph: { fontSize: 14, color: Colors.text },
  tagContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  tag: {
    backgroundColor: Colors.secondary,
    color: Colors.white,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    fontSize: 12,
    marginTop: 4,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
});
