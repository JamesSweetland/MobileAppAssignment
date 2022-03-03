import React, { Component } from 'react';
import MyProfileScreen from './MyProfileScreen';
import EditProfileScreen from './EditProfileScreen';
import CameraScreen from './CameraScreen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

class SearchNav extends Component{

  render(){
    return(
      <Stack.Navigator initialRouteName="MyProfileScreen" screenOptions={{headerShown: false}}>
        <Stack.Screen name="MyProfileScreen" component={MyProfileScreen} />
        <Stack.Screen name="EditProfile" component={EditProfileScreen} />
        <Stack.Screen name="CameraScreen" component={CameraScreen} />
      </Stack.Navigator>      
    );
  }
}

export default SearchNav;