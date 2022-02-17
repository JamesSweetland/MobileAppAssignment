import React, { Component } from 'react';
import { StyleSheet, Text, View ,Button, TextInput, Alert} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

class LoginScreen extends Component{

  state = {  
    email: null,
    password: null
  }  

  async login(){
    try {
      const response = await fetch('http://localhost:3333/api/1.0.0/login',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            "email": this.state.email,
            "password": this.state.password
          })
        });
      const responseJson = await response.json();

      console.debug("Response Code: " + response.status)

      await AsyncStorage.setItem("userID", JSON.stringify(responseJson.id));
      await AsyncStorage.setItem("token", JSON.stringify(responseJson.token));

    } catch (error) {
      console.error(error);
    }
  }

  render(){
    return(
        <View style={styles.container}>

          <Text>Login Screen</Text>
          <TextInput
            style={styles.input}
            placeholder="Email"
            onChangeText={value => this.setState({email: value})}
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            onChangeText={value => this.setState({password: value})}
            secureTextEntry={true}
          />

          <View style={styles.buttonContainer}>
            <View style={styles.button}>
              <Button
                title='Login'
                onPress={() =>this.login()}
              />
            </View>
            <View style={styles.button}>
              <Button
                title='Back'
                onPress={() =>this.props.navigation.goBack()}
              />
            </View>            
          </View>

        </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    //marginTop: 100,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
  },
  button: {
    margin: 10,
  },
});

export default LoginScreen;
