import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constants/colors';
import { useNavigation } from '@react-navigation/native';

const resources = [
  { icon: 'calendar', label: 'Events', screen: 'ManageEvents' },
  { icon: 'location', label: 'Locations', screen: 'ManageLocations' },
  { icon: 'folder', label: 'Categories', screen: 'ManageCategories' },
  { icon: 'pricetag', label: 'Tags', screen: 'ManageTags' },
];

export default function ManageDashboardScreen() {
  const navigation = useNavigation<any>();

  return (
    <View style={styles.container}>
      {resources.map((item) => (
        <TouchableOpacity
          key={item.label}
          style={styles.card}
          onPress={() => navigation.navigate(item.screen)}
        >
          <View style={styles.row}>
            <Ionicons name={item.icon as any} size={24} color={Colors.primary} />
            <Text style={styles.label}>{item.label}</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={Colors.muted} />
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: Colors.background,
    flex: 1,
  },
  card: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  label: {
    fontSize: 16,
    color: Colors.text,
    fontWeight: 'bold',
  },
});
