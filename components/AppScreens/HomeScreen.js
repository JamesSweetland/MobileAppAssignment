import React, { Component } from 'react';
import SearchScreen from './SearchScreen';
import FriendsScreen from './FriendsScreen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

class HomeScreen extends Component{

  render(){
    return(
      <Stack.Navigator initialRouteName="Search" screenOptions={{headerShown: false}}>
        <Stack.Screen name="Search" component={SearchScreen} />
        <Stack.Screen name="FriendsScreen" component={FriendsScreen} />
      </Stack.Navigator>      
    );
  }
}

export default HomeScreen;