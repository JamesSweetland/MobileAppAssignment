import React, { Component } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ProfileNav from './Profile Screens/ProfileNav';
import SearchNav from './Search Screens/SearchNav';
import RequestsScreen from './Profile Screens/RequestsScreen';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

class MainNav extends Component{

  componentDidMount() {
    //checks user is logged in when page is first loaded and if this page is focused
    this.checkLoggedIn();
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
        initialRouteName="Home" 
        screenOptions={{
          headerShown: false,
          "tabBarActiveTintColor": "#19a9f7"
        }}
      >
        <Tab.Screen 
          name="Home"
          component={ProfileNav}
          options={{
            tabBarIcon: ({ color, size, focused }) => (
              <Ionicons name={focused ? "ios-home" : "ios-home-outline"} size={size} color={color} />
            )
          }}
        /> 
        <Tab.Screen 
          name="Search" 
          component={SearchNav}
          options={{
            tabBarIcon: ({ color, size, focused }) => (
              <Ionicons name={focused ? "ios-search" : "ios-search-outline"} color={color} size={size} />
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

export default MainNav;