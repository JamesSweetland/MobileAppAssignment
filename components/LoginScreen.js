import React, { Component } from 'react';
import { StyleSheet, Text, View ,Button, TextInput} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

class LoginScreen extends Component{

  state = {
    errorMsg: [ "", "" ], //an array of the messages that are displayed if the input is invalid
    email: null,
    password: null
  }

  validate = () => {
    let errors = [ "", "" ]; //an array to hold the error messages
    
    //loads fields into an array
    let fields = [
      this.state.email,
      this.state.password
    ];

    //uses regex to check email is a valid format
    if(!/^\S+@\S+\.\S+$/.test(fields[0])){
      errors[0] = "The email supplied is not a valid format";
    }

    //checks each field is not empty
    for(let i = 0; i < fields.length; i++){
      if(fields[i] == null){
        errors[i] = "All fields must be filled in";
      }
    }

    this.setState({ errorMsg: errors });

    //throws error if any field is invalid
    for(let i = 0; i < errors.length; i++){
      if(errors[i] != ""){
        throw errors[i];
      }
    }
  }

  login = async () => {
    await AsyncStorage.removeItem("userID");
    await AsyncStorage.removeItem("token");

    this.validate(); //checks fields are valid

    //sends login request to server
    return fetch("http://localhost:3333/api/1.0.0/login", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "email": this.state.email,
        "password": this.state.password
      })
    })
    .then((response) => {
      //checks the response code before returning the json
      if(response.status === 200){
        return response.json()
      }else if(response.status === 400){
        throw 'Invalid email or password';
      }else{
        throw 'Something went wrong';
      }
    })
    .then(async (responseJson) => {

      //sets the signed in user's ID and authorisation token in async storage
      await AsyncStorage.setItem("userID", JSON.stringify(responseJson.id));
      await AsyncStorage.setItem("token", JSON.stringify(responseJson.token).replaceAll('"', ''));//removes speakmarks from token
        
      this.props.navigation.navigate("Home");//navigates to the home page
    })
    .catch((error) => {
      console.error(error);
    })   
  }

  render(){
    return(
        <View style={styles.container}>

          <Text style={styles.title}>SpaceBook</Text>
          <Text style={styles.text}>Login</Text>

          <TextInput
            style={styles.input}
            placeholder="Email"
            onChangeText={value => this.setState({email: value})}
          />
          { //the display box for the email field error message
            this.state.errorMsg[0] != "" /* Only displays if there is a message to be displayed */ &&
            <Text style={{color:"white", backgroundColor:"red", padding:5, borderRadius: 3}}>
              {this.state.errorMsg[0]}
            </Text>
          }

          <TextInput
            style={styles.input}
            placeholder="Password"
            onChangeText={value => this.setState({password: value})}
            secureTextEntry={true}
          />
          { //the display box for the password field error message
            this.state.errorMsg[1] != "" /* Only displays if there is a message to be displayed */ &&
            <Text style={{color:"white", backgroundColor:"red", padding:5, borderRadius: 3}}>
              {this.state.errorMsg[1]}
            </Text>
          }
          
          <View>
            <View style={styles.button}>
              <Button
                title='Login'
                onPress={() =>this.login()}
                color="#19a9f7"
              />
            </View>
            <View style={styles.button}>
              <Button
                title='Create Account'
                onPress={() =>this.props.navigation.navigate('Signup')}
                color="#19a9f7"
              />
            </View>                                    
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
    justifyContent: 'center'
  },
  title: {
    color: '#19a9f7',
    fontWeight: 'bold',
    fontSize: 'min(16vw, 500%)'//css sets title to 16% of the viewpoint width but never more than the font size 500%
  },
  text: {
    padding: 5,
    fontSize: '120%'
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    borderRadius: 3
  },
  button: {
    margin: 10
  }
});

export default LoginScreen;