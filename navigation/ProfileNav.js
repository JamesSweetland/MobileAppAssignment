import React, { Component } from 'react';
import MyProfileScreen from '../components/MyProfileScreen';
import EditPostScreen from '../components/EditPostScreen';
import EditProfileScreen from '../components/EditProfileScreen';
import CameraScreen from '../components/CameraScreen';
import DraftsScreen from '../components/DraftsScreen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

class SearchNav extends Component {

  render() {
    return (
      <Stack.Navigator initialRouteName="MyProfileScreen" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="MyProfileScreen" component={MyProfileScreen} />
        <Stack.Screen name="EditPost" component={EditPostScreen} />
        <Stack.Screen name="DraftsScreen" component={DraftsScreen} />
        <Stack.Screen name="EditProfile" component={EditProfileScreen} />
        <Stack.Screen name="CameraScreen" component={CameraScreen} />
      </Stack.Navigator>
    );
  }
}

export default SearchNav;