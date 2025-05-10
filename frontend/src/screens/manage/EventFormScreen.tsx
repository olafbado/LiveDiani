import { ScrollView } from 'react-native';
import { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Platform,
  Image,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
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
  const [mainImage, setMainImage] = useState<any>(null);
  const [extraImages, setExtraImages] = useState<any[]>([]);

  const [locations, setLocations] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [tags, setTags] = useState<any[]>([]);
  const [selectedTagIds, setSelectedTagIds] = useState<number[]>([]);

  useEffect(() => {
    console.log('event');

    if (existingEvent) {
      setTitle(existingEvent.title);
      setDescription(existingEvent.description);
      setPickedDate(new Date(existingEvent.date));
      setLocationId(String(existingEvent.locationId));
      setCategoryId(String(existingEvent.categoryId));
      setUserId(String(existingEvent.createdByUserId));

      if (existingEvent.mainPhoto) {
        console.log('Existing main image URL:', existingEvent.url);
        setMainImage({
          uri: 'http://192.168.1.36:5084' + existingEvent.mainPhoto.url,
          id: existingEvent.mainPhoto.id,
        });
      }

      if (existingEvent.additionalPhotos) {
        console.log('Existing additional image URLs:', existingEvent.additionalPhotos);
        const extras = existingEvent.additionalPhotos.map(
          ({ url, id }: { url: string; id: number }) => ({
            uri: 'http://192.168.1.36:5084' + url,
            id: id,
          }),
        );
        setExtraImages(extras);
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

        if (existingEvent?.tagIds) {
          setSelectedTagIds(existingEvent.tagIds);
        }
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

  const pickImage = async (isMain: boolean) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'], // nowa forma
      allowsEditing: false,
      quality: 1,
      base64: false,
    });

    if (!result.canceled && result.assets.length > 0) {
      const asset = result.assets[0];

      console.log('Picked image file URI:', asset.uri); // powinno być file://...

      if (isMain) {
        console.log('Picked main image file URI:', asset.uri);
        setMainImage(asset);
      } else {
        console.log('Picked extra image file URI:', asset.uri);
        setExtraImages((prev) => [...prev, asset]);
      }
    }
  };

  const uploadPhotos = async (eventId: number) => {
    const upload = async (image: any, isMain: boolean) => {
      if (image.uri.startsWith('http://') || image.uri.startsWith('https://')) return;
      const formData = new FormData();

      formData.append('image', {
        uri: image.uri,
        name: image.fileName || 'photo.jpg',
        type: image.mimeType || 'image/jpeg',
      } as any);

      formData.append('eventId', String(eventId));
      formData.append('isMain', String(isMain));

      try {
        const res = await api.post('/eventphotos/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        console.log('Upload OK:', res.data);
      } catch (err) {
        console.error('Upload failed:', err);
      }
    };

    console.log('main image', mainImage);
    if (mainImage) await upload(mainImage, true);
    for (const img of extraImages) await upload(img, false);
  };

  const handleSave = async () => {
    if (!title || !locationId || !categoryId || !mainImage) {
      Alert.alert('Validation', 'Please fill all required fields and select a main image');
      return;
    }

    const payload = {
      title,
      description,
      date: pickedDate.toISOString(),
      locationId: parseInt(locationId),
      categoryId: parseInt(categoryId),
      tagIds: selectedTagIds,
    };

    try {
      let eventId = null;

      if (existingEvent) {
        await api.put(`/events/${existingEvent.id}`, { ...existingEvent, ...payload });
        eventId = existingEvent.id;
      } else {
        const res = await api.post('/events', payload);
        eventId = res.data.id;
      }

      if (eventId) await uploadPhotos(eventId);

      navigation.goBack();
    } catch (err) {
      console.error('Save failed:', err);
      Alert.alert('Error', 'Failed to save event.');
    }
  };

  const handleRemoveImage = async (index: number, id?: number) => {
    if (id) {
      try {
        await api.delete(`/eventphotos/${id}`);
      } catch (err) {
        console.error('Failed to delete image:', err);
      }
    }
    console.log('Deleting image with ID:', id);
    setExtraImages((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
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

      <Text style={styles.label}>Main Image</Text>
      <TouchableOpacity style={styles.imagePicker} onPress={() => pickImage(true)}>
        {mainImage ? (
          <Image source={{ uri: mainImage.uri }} style={styles.image} />
        ) : (
          <Text>Select Main Image</Text>
        )}
      </TouchableOpacity>

      <Text style={styles.label}>Extra Images</Text>
      <TouchableOpacity style={styles.imagePicker} onPress={() => pickImage(false)}>
        <Text>Select Additional Images</Text>
      </TouchableOpacity>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
        {extraImages.map((img, idx) => (
          <View key={idx} style={{ position: 'relative', margin: 4 }}>
            <Image source={{ uri: img.uri }} style={styles.thumbnail} />
            <TouchableOpacity
              onPress={() => handleRemoveImage(idx, img.id)}
              style={styles.deleteButton}
            >
              <Text style={styles.deleteButtonText}>×</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>

      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>{existingEvent ? 'Update Event' : 'Create Event'}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  deleteButton: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: 'red',
    borderRadius: 10,
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  container: { padding: 16, backgroundColor: Colors.background, flexGrow: 1 },
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
  imagePicker: {
    backgroundColor: Colors.cardBackground,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  image: { width: '100%', height: 200, borderRadius: 8 },
  thumbnail: { width: 80, height: 80, margin: 4, borderRadius: 8 },
});
