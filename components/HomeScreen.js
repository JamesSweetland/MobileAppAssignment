import React, { Component } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ProfileScreen from './ProfileScreen';
import FriendsScreen from './FriendsScreen';
import RequestsScreen from './RequestsScreen';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

class HomeScreen extends Component{

  componentDidMount() {
    //checks user is logged in if this page is focused
    this.unsubscribe = this.props.navigation.addListener('focus', () => {
      this.checkLoggedIn();
    });
  }

  componentWillUnmount() {
    this.unsubscribe(); //cancels listener when component is unmounted
  }

  checkLoggedIn = async () => {
    //checks if token exists in async storage
    const value = await AsyncStorage.getItem('token');
    if (value == null) {
      this.props.navigation.navigate('Login');
    }
  }

  render(){
    return(
      <Tab.Navigator 
        initialRouteName="Profile" 
        screenOptions={{
          headerShown: false,
          "tabBarActiveTintColor": "#19a9f7"
        }}
      >
        <Tab.Screen 
          name="Friends"
          component={FriendsScreen}
          options={{
            tabBarIcon: ({ color, size, focused }) => (
              <Ionicons name={focused ? "ios-people" : "ios-people-outline"} size={size} color={color} />
            )
          }}
        /> 
        <Tab.Screen 
          name="Profile" 
          component={ProfileScreen}
          options={{
            tabBarIcon: ({ color, size, focused }) => (
              <Ionicons name={focused ? "ios-home" : "ios-home-outline"} color={color} size={size} />
            )
          }}
        />        
        <Tab.Screen 
          name="Requests" 
          component={RequestsScreen}
          options={{
            tabBarIcon: ({ color, size, focused }) => (
              <Ionicons name={focused ? "ios-chatbubbles" : "ios-chatbubbles-outline"} size={size} color={color} />
            )
          }}
        />     
      </Tab.Navigator>       
    );
  }
}

export default HomeScreen;