import React, { Component } from 'react';
import SearchScreen from './SearchScreen';
import FriendsScreen from './FriendsScreen';
import ViewFriendsScreen from './ViewFirendsScreen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

class SearchNav extends Component{

  render(){
    return(
      <Stack.Navigator initialRouteName="Search" screenOptions={{headerShown: false}}>
        <Stack.Screen name="SearchResults" component={SearchScreen} />
        <Stack.Screen name="FriendsScreen" component={FriendsScreen} />
        <Stack.Screen name="ViewFriends" component={ViewFriendsScreen} />
      </Stack.Navigator>      
    );
  }
}

export default SearchNav;
