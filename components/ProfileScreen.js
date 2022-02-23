import React, { Component } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

class ProfileScreen extends Component{
  
  logout = async () => {    
    await AsyncStorage.removeItem("userID");
    await AsyncStorage.removeItem("token");

    this.props.navigation.navigate('Login')
  }
  
  render(){
    return(    
      <View style={styles.container}>

        <Text style={styles.title}>SpaceBook</Text>
        <Text style={styles.text}>Profile Screen</Text>

        <View style={styles.button}>
          <Button
            title='Logout'
            onPress={() =>this.logout()}
            color="#19a9f7"
          />
        </View>
        
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    fontFamily: "Helvetica",
    flex: 1,
    alignItems: 'center',
    //justifyContent: 'center',
  },
  title: {
    color: '#19a9f7',
    fontWeight: 'bold',
    fontSize: '400%',
  },
  text: {
    padding: 5,
    fontSize: '120%',
  }
});

export default ProfileScreen;