import React, { Component } from 'react';
import { StyleSheet, View , Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ProfileScreen from './ProfileScreen';
import FriendsScreen from './FriendsScreen';
import RequestsScreen from './RequestsScreen';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const Tab = createBottomTabNavigator();

class HomeScreen extends Component{

  constructor(props){
    super(props);
  }

  componentDidMount() {
    this.unsubscribe = this.props.navigation.addListener('focus', () => {
      this.checkLoggedIn();
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  checkLoggedIn = async () => {
    const value = await AsyncStorage.getItem('token');
    if (value == null) {
        this.props.navigation.navigate('Login', {});
    }
  };  

  render(){
    return(
      <NavigationContainer independent={true}>
        <Tab.Navigator initialRouteName="Profile" screenOptions={{headerShown: false}}>
          <Tab.Screen 
            name="Requests" 
            component={RequestsScreen}
            navigationOptions={{
              tabBarLabel: "Profile Page",
              tabBarIcon: ({ tintColor }) => (
                <Icon name="users" size={30} color="#900" />
              )
            }}
          />
          <Tab.Screen name="Profile" component={ProfileScreen}/>
          <Tab.Screen name="Friends" component={FriendsScreen}/>            
        </Tab.Navigator>
      </NavigationContainer>            
    );
  }
}

const styles = StyleSheet.create({
  container: {
    fontFamily: "Helvetica",
    flex: 1
  },
  button: {
    margin: 10,
  }
});

export default HomeScreen;
