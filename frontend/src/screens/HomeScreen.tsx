import { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import api from '../api/axios';
import Colors from '../constants/colors';
import { useNavigation } from '@react-navigation/native';
import {
  startOfWeek,
  addDays,
  format,
  parseISO,
  eachDayOfInterval,
} from 'date-fns';
import { enUS } from 'date-fns/locale/en-US';

export default function HomeScreen() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation<any>();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await api.get('/events');
        setEvents(res.data);
      } catch (err) {
        console.error('Failed to load events:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const weekDays = eachDayOfInterval({
    start: startOfWeek(new Date(), { weekStartsOn: 1 }),
    end: addDays(startOfWeek(new Date(), { weekStartsOn: 1 }), 6),
  });

  const eventsByDate: { [key: string]: any[] } = {};
  events.forEach((event) => {
    const dateKey = format(parseISO(event.date), 'yyyy-MM-dd');
    if (!eventsByDate[dateKey]) eventsByDate[dateKey] = [];
    eventsByDate[dateKey].push(event);
  });

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Upcoming Events</Text>

      {weekDays.map((day) => {
        const dateKey = format(day, 'yyyy-MM-dd');
        const dayName = format(day, 'EEEE', { locale: enUS });
        const dayNum = format(day, 'd');
        const month = format(day, 'MMM').toUpperCase();
        const dayEvents = eventsByDate[dateKey] || [];
        const hasEvents = dayEvents.length > 0;

        return (
          <TouchableOpacity
            key={dateKey}
            style={[
              styles.dayRow,
              !hasEvents && styles.inactiveRow,
            ]}
            onPress={() => {
              if (hasEvents) {
                navigation.navigate('EventsByDay', { selectedDate: dateKey })
              }
            }}
            disabled={!hasEvents}
            activeOpacity={hasEvents ? 0.7 : 1}
          >
            <View style={styles.left}>
              <Image
                source={require('../../assets/icon.png')}
                style={[
                  styles.icon,
                  !hasEvents && { opacity: 0.3 },
                ]}
              />
              <View>
                <Text
                  style={[
                    styles.dayName,
                    !hasEvents && styles.inactiveText,
                  ]}
                >
                  {dayName}
                </Text>
                <Text
                  style={[
                    styles.eventsCount,
                    !hasEvents && styles.inactiveText,
                  ]}
                >
                  {hasEvents ? `${dayEvents.length} event${dayEvents.length > 1 ? 's' : ''}` : 'No events'}
                </Text>
              </View>
            </View>
            <View style={styles.right}>
              <Text
                style={[
                  styles.dateNumber,
                  !hasEvents && styles.inactiveText,
                ]}
              >
                {dayNum}
              </Text>
              <Text
                style={[
                  styles.dateMonth,
                  !hasEvents && styles.inactiveText,
                ]}
              >
                {month}
              </Text>
            </View>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.background,
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 16,
  },
  dayRow: {
    flexDirection: 'row',
    backgroundColor: Colors.cardBackground,
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  inactiveRow: {
    opacity: 0.6,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  icon: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  dayName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
  },
  eventsCount: {
    fontSize: 13,
    color: Colors.muted,
  },
  right: {
    alignItems: 'flex-end',
  },
  dateNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
  },
  dateMonth: {
    fontSize: 13,
    color: Colors.muted,
  },
  inactiveText: {
    color: Colors.muted,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
});
