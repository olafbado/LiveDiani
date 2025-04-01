import { ScrollView, Text, TouchableOpacity, StyleSheet, View } from 'react-native';
import Colors from '../constants/colors';

const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function DaySlider({
  selected,
  onSelect,
}: {
  selected: number;
  onSelect: (index: number) => void;
}) {
  return (
    <View style={styles.wrapper}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {days.map((day, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => onSelect(index)}
            style={[styles.day, selected === index && styles.activeDay]}
          >
            <Text style={[styles.dayText, selected === index && styles.activeText]}>{day}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    paddingVertical: 12,
    paddingHorizontal: 8,
    backgroundColor: Colors.cardBackground,
  },
  day: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    marginRight: 8,
    backgroundColor: Colors.background,
  },
  activeDay: {
    backgroundColor: Colors.primary,
  },
  dayText: {
    fontSize: 14,
    color: Colors.text,
  },
  activeText: {
    color: Colors.white,
    fontWeight: 'bold',
  },
});
