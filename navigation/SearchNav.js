import React, { Component } from 'react';
import SearchScreen from '../components/SearchScreen';
import ProfileScreen from '../components/ProfileScreen';
import FriendsScreen from '../components/FriendsScreen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

class SearchNav extends Component {

  render() {
    return (
      <Stack.Navigator initialRouteName="Search" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="SearchResults" component={SearchScreen} />
        <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
        <Stack.Screen name="ViewFriends" component={FriendsScreen} />
      </Stack.Navigator>
    );
  }
}

export default SearchNav;
