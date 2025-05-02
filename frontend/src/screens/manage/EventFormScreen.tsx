import { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, Platform } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Colors from '../../constants/colors';
import api from '../../api/axios';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';

export default function EventFormScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const existingEvent = route.params?.event;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [pickedDate, setPickedDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [locationId, setLocationId] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [userId, setUserId] = useState('1');

  const [locations, setLocations] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [tags, setTags] = useState<any[]>([]);
  const [selectedTagIds, setSelectedTagIds] = useState<number[]>([]);

  useEffect(() => {
    if (existingEvent) {
      setTitle(existingEvent.title);
      setDescription(existingEvent.description);
      setPickedDate(new Date(existingEvent.date));
      setLocationId(String(existingEvent.locationId));
      setCategoryId(String(existingEvent.categoryId));
      setUserId(String(existingEvent.createdByUserId));

      if (existingEvent.tagIds) {
        setSelectedTagIds(existingEvent.tagIds);
      }
    }

    const fetchData = async () => {
      try {
        const locs = await api.get('/locations');
        const cats = await api.get('/eventcategories');
        const tgs = await api.get('/tags');
        setLocations(locs.data);
        setCategories(cats.data);
        setTags(tgs.data);
      } catch (err) {
        console.error('Fetch error:', err);
      }
    };

    fetchData();
  }, [existingEvent]);

  const toggleTag = (tagId: number) => {
    setSelectedTagIds((prev) =>
      prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId],
    );
  };

  const handleSave = async () => {
    if (!title || !locationId || !categoryId) {
      Alert.alert('Validation', 'Please fill all required fields');
      return;
    }

    const payload = {
      title,
      description,
      date: pickedDate.toISOString(),
      locationId: parseInt(locationId),
      categoryId: parseInt(categoryId),
      createdByUserId: parseInt(userId),
      tagIds: selectedTagIds,
    };

    console.log('Sending payload:', payload);

    try {
      if (existingEvent) {
        await api.put(`/events/${existingEvent.id}`, { ...existingEvent, ...payload });
      } else {
        await api.post('/events', payload);
      }
      navigation.goBack();
    } catch (err) {
      console.error('Save failed:', err);
      Alert.alert('Error', 'Failed to save event.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Title</Text>
      <TextInput style={styles.input} value={title} onChangeText={setTitle} />

      <Text style={styles.label}>Description</Text>
      <TextInput
        style={[styles.input, { height: 80 }]}
        multiline
        value={description}
        onChangeText={setDescription}
      />

      <Text style={styles.label}>Date</Text>
      <TouchableOpacity style={styles.input} onPress={() => setShowPicker(true)}>
        <Text style={{ color: Colors.text }}>{format(pickedDate, 'yyyy-MM-dd')}</Text>
      </TouchableOpacity>

      {showPicker && (
        <DateTimePicker
          value={pickedDate}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={(event, selectedDate) => {
            setShowPicker(false);
            if (selectedDate) setPickedDate(selectedDate);
          }}
        />
      )}

      <Text style={styles.label}>Location</Text>
      <Picker selectedValue={locationId} onValueChange={setLocationId} style={styles.input}>
        <Picker.Item label="-- Select Location --" value="" />
        {locations.map((loc) => (
          <Picker.Item key={loc.id} label={loc.name} value={String(loc.id)} />
        ))}
      </Picker>

      <Text style={styles.label}>Category</Text>
      <Picker selectedValue={categoryId} onValueChange={setCategoryId} style={styles.input}>
        <Picker.Item label="-- Select Category --" value="" />
        {categories.map((cat) => (
          <Picker.Item key={cat.id} label={cat.name} value={String(cat.id)} />
        ))}
      </Picker>

      <Text style={styles.label}>Tags</Text>
      <View style={styles.tagsContainer}>
        {tags.map((tag) => (
          <TouchableOpacity
            key={tag.id}
            style={[styles.tagButton, selectedTagIds.includes(tag.id) && styles.tagSelected]}
            onPress={() => toggleTag(tag.id)}
          >
            <Text
              style={[styles.tagText, selectedTagIds.includes(tag.id) && styles.tagTextSelected]}
            >
              {tag.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>{existingEvent ? 'Update Event' : 'Create Event'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: Colors.background, flex: 1 },
  label: { color: Colors.text, marginBottom: 8, fontWeight: 'bold' },
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
  buttonText: { color: Colors.white, fontWeight: 'bold' },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
  },
  tagButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.primary,
    marginRight: 8,
    marginBottom: 8,
  },
  tagSelected: {
    backgroundColor: Colors.primary,
  },
  tagText: {
    color: Colors.primary,
  },
  tagTextSelected: {
    color: Colors.white,
  },
});
