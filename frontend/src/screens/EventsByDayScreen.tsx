import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import { useEffect, useState } from 'react';
import { useRoute, useNavigation } from '@react-navigation/native';
import api from '../api/axios';
import Colors from '../constants/colors';
import {
  startOfWeek,
  addDays,
  format,
  parseISO,
  isSameDay,
  differenceInCalendarDays,
} from 'date-fns';
import { enUS } from 'date-fns/locale/en-US';
import { useFocusEffect } from '@react-navigation/native';

export default function EventsByDayScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { selectedDate } = route.params; // format: 'yyyy-MM-dd'

  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
  const initialIndex = Math.min(
    6,
    Math.max(0, differenceInCalendarDays(new Date(selectedDate), weekStart)),
  );
  const [selectedIndex, setSelectedIndex] = useState(initialIndex);

  const activeDate = addDays(weekStart, selectedIndex);

  useEffect(() => {
    let isActive = true;

    const fetchEvents = async () => {
      try {
        const res = await api.get('/events');
        if (isActive) {
          setEvents(res.data);
        }
      } catch (err) {
        console.error('Error fetching events:', err);
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    };

    fetchEvents();

    return () => {
      isActive = false;
    };
  }, []);

  const filteredEvents = events.filter((ev) => isSameDay(parseISO(ev.date), activeDate));

  const formattedTitle = format(activeDate, 'EEEE, d MMM', { locale: enUS });

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Events for {formattedTitle}</Text>

      <View style={styles.daySelector}>
        {Array.from({ length: 7 }).map((_, i) => {
          const date = addDays(weekStart, i);
          const label = format(date, 'EEE');
          const isActive = i === selectedIndex;

          return (
            <TouchableOpacity
              key={i}
              onPress={() => setSelectedIndex(i)}
              style={[styles.dayButton, isActive && styles.dayButtonActive]}
            >
              <Text style={[styles.dayButtonText, isActive && styles.dayButtonTextActive]}>
                {label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={Colors.primary} />
      ) : filteredEvents.length === 0 ? (
        <View style={styles.noEvents}>
          <Text style={{ color: Colors.muted }}>No events on this day.</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.eventList}>
          {filteredEvents.map((event) => (
            <TouchableOpacity
              key={event.id}
              style={styles.card}
              onPress={() => navigation.navigate('EventDetails', { eventId: event.id })}
            >
              <Image
                source={{
                  uri: 'http://192.168.1.36:5084' + event.mainPhoto?.url,
                }}
                style={styles.image}
              />
              <Text style={styles.cardTitle}>{event.title}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.background,
    flex: 1,
    paddingTop: 16,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.text,
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  noEvents: {
    alignItems: 'center',
    padding: 32,
  },
  eventList: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    marginTop: 12,
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
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },

  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    padding: 12,
  },
  daySelector: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    paddingHorizontal: 12,
  },

  dayButton: {
    backgroundColor: Colors.cardBackground,
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
  },

  dayButtonActive: {
    backgroundColor: Colors.primary,
  },

  dayButtonText: {
    color: Colors.text,
    fontWeight: '500',
  },

  dayButtonTextActive: {
    color: Colors.white,
  },
});
