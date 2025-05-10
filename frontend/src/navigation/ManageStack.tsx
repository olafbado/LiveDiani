import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ManageDashboardScreen from '../screens/manage/ManageDashboardScreen';
import ManageLocationsScreen from '../screens/manage/ManageLocationsScreen';
import ManageCategoriesScreen from '../screens/manage/ManageCategoriesScreen';
import ManageTagsScreen from '../screens/manage/ManageTagsScreen';
import TagFormScreen from '../screens/manage/TagFormScreen';
import CategoryFormScreen from '../screens/manage/CategoryFormScreen';
import LocationFormScreen from '../screens/manage/LocationFormScreen';
import EventFormScreen from '../screens/manage/EventFormScreen';
import ManageEventsScreen from '../screens/manage/ManageEventsScreen';

const Stack = createNativeStackNavigator();

export default function ManageStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ManageDashboard"
        component={ManageDashboardScreen}
        options={{ title: 'Manage' }}
      />
      {/* <Stack.Screen name="ManageEvents" component={ManageEventsScreen} options={{ title: 'Manage Events' }} /> */}
      <Stack.Screen
        name="ManageCategories"
        component={ManageCategoriesScreen}
        options={{ title: 'Categories' }}
      />
      <Stack.Screen
        name="CategoryForm"
        component={CategoryFormScreen}
        options={{ title: 'Category Form' }}
      />

      <Stack.Screen
        name="ManageTags"
        component={ManageTagsScreen}
        options={{ title: 'Manage Tags' }}
      />
      <Stack.Screen name="TagForm" component={TagFormScreen} options={{ title: 'Tag Form' }} />

      <Stack.Screen
        name="ManageLocations"
        component={ManageLocationsScreen}
        options={{ title: 'Locations' }}
      />
      <Stack.Screen
        name="LocationForm"
        component={LocationFormScreen}
        options={{ title: 'Location Form' }}
      />

      <Stack.Screen
        name="ManageEvents"
        component={ManageEventsScreen}
        options={{ title: 'Events' }}
      />
      <Stack.Screen
        name="EventForm"
        component={EventFormScreen}
        options={{ title: 'Event Form' }}
      />
    </Stack.Navigator>
  );
}
