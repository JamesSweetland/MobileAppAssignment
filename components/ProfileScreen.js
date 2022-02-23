import React, { Component } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

class ProfileScreen extends Component{

    logout = async () => {
        try {

            const token = await AsyncStorage.getItem('token');
    
            return fetch("http://localhost:3333/api/1.0.0/logout", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Authorization' : token
                }
            })
            .then(async (response) => {
                if(response.status === 200){
                    await AsyncStorage.removeItem("userID");
                    await AsyncStorage.removeItem("token");
                    return response.json()
                }else if(response.status === 401){
                    throw 'Unauthorised';
                }else{
                    throw 'Something went wrong';
                }
            })
        }
        catch(error) {
          console.log(error);
        }      
      }

    render(){
        return(
            <View style={styles.container}>
    
              <Text style={styles.title}>SpaceBook</Text>
              <Text style={styles.text}>Profile Screen</Text>
            
              <Button
                title='Login'
                onPress={() => this.props.navigation.navigate('Login', {})}
                color="#19a9f7"
              />
              <Button
                title='Logout'
                onPress={() =>this.logout()}
                color="#19a9f7"
              />
    
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
      fontFamily: "Helvetica",
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
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