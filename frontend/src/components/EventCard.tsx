import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Colors from '../constants/colors';

interface EventCardProps {
  title: string;
  date: string;
  location: string;
  category?: string | null;
  onPress?: () => void;
}

export default function EventCard({ title, date, location, category, onPress }: EventCardProps) {
  const categoryKey = category?.toLowerCase() as keyof typeof Colors.category;
  const categoryColor = Colors.category[categoryKey] || Colors.primary;

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.info}>{date}</Text>
      <Text style={styles.info}>{location}</Text>
      {category && <Text style={[styles.category, { color: categoryColor }]}>{category}</Text>}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 4,
  },
  info: {
    fontSize: 14,
    color: Colors.muted,
  },
  category: {
    marginTop: 6,
    fontSize: 12,
    fontWeight: '600',
  },
});
