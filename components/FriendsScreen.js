import React, { Component } from 'react';
import SearchScreen from './SearchScreen';
import FriendProfile from './FriendProfile';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

class FriendsScreen extends Component{

  render(){
    return(
      <Stack.Navigator initialRouteName="Search" screenOptions={{headerShown: false}}>
        <Stack.Screen name="Search" component={SearchScreen} />
        <Stack.Screen name="FriendProfile" component={FriendProfile} />
      </Stack.Navigator>      
    );
  }
}

export default FriendsScreen;