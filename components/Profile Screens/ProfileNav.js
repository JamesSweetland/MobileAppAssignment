import React, { Component } from 'react';
import ProfileScreen from './ProfileScreen';
import ProfilePic from './ProfilePic';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

class SearchNav extends Component{

  render(){
    return(
      <Stack.Navigator initialRouteName="ProfileScreen" screenOptions={{headerShown: false}}>
        <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
        <Stack.Screen name="ProfilePic" component={ProfilePic} />
      </Stack.Navigator>      
    );
  }
}

export default SearchNav;