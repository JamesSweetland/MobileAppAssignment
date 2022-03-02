import React, { Component } from 'react';
import { StyleSheet, Text, View, Button, TextInput } from 'react-native';

class SignupScreen extends Component{

  state = {
    errorMsg: [ "", "", "", "" ], //an array of the messages that are displayed if the input is invalid
    firstName: null,
    lastName: null,
    email: null,
    password: null
  }

  validate = () => {
    let errors = [ "", "", "", "" ]; //an array to hold the error messages
    
    //loads fields into an array
    let fields = [
      this.state.firstName,
      this.state.lastName,
      this.state.email,
      this.state.password
    ];
    
    //uses regex to check first name only contains letter
    if(!/^[a-zA-Z]+$/i.test(fields[0])){
      errors[0] = "First name must only contain letters";
    }

    //uses regex to check last name only contains letter
    if(!/^[a-zA-Z]+$/i.test(fields[1])){
      errors[1] = "Last name must only contain letters";
    }

    //uses regex to check email is a valid format
    if(!/^\S+@\S+\.\S+$/.test(fields[2])){
      errors[2] = "Please give a valid email";
    }
    
    //checks each field is not empty
    for(let i = 0; i < fields.length; i++){
      if(fields[i] == null || fields[i] == ""){
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

  signup = () => {
    this.validate(); //checks fields are valid

    //sends new user request to server
    return fetch('http://localhost:3333/api/1.0.0/user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "first_name": this.state.firstName,
        "last_name": this.state.lastName,
        "email": this.state.email,
        "password": this.state.password
      })
    })
    .then((response) => {
      //checks the response code before returning the json
      if(response.status === 201){ //201 = Created
        return response.json()
      }else if(response.status === 400){ //400 = Bad Request        
        throw 'Failed Validation';
      }else{
        throw 'Something went wrong';
      }
    })
    .then((responseJson) => {
      console.log("User created with ID:", responseJson.id);

      this.props.navigation.navigate("Login"); //navigates to the login page
    })
    .catch((error) => {
      let errors = [ "", "", "", ""];
      if(error == 'Failed Validation'){
        errors[3] = "Your Details are not valid";
      }
      else{
        errors[3] = error + ", please try again";
      }
      //displays error message to user and in debug console
      this.setState({ errorMsg: errors });
      console.error(error); 
    })
  }

  render(){
    return(
      <View style={styles.container}>

        <Text style={styles.title}>SpaceBook</Text>
        <Text style={styles.text}>Create an account</Text>

        <TextInput
          style={styles.input}
          placeholder="First Name"
          onChangeText={value => this.setState({firstName: value})}
        />
        { //the display box for the first name field error message
          (this.state.errorMsg[0] != "") /* Only displays if there is a message to be displayed */ &&
          <Text style={{color:"white", backgroundColor:"red", padding:5, borderRadius: 3}}>
            {this.state.errorMsg[0]}
          </Text>
        }   

        <TextInput
          style={styles.input}
          placeholder="Last Name"
          onChangeText={value => this.setState({lastName: value})}
        />
        { //the display box for the last name field error message
          (this.state.errorMsg[1] != "") /* Only displays if there is a message to be displayed */ &&
          <Text style={{color:"white", backgroundColor:"red", padding:5, borderRadius: 3}}>
            {this.state.errorMsg[1]}
          </Text>
        }   

        <TextInput
          style={styles.input}
          placeholder="Email"
          onChangeText={value => this.setState({email: value})}
        />
        { //the display box for the email field error message
          (this.state.errorMsg[2] != "") /* Only displays if there is a message to be displayed */ &&
          <Text style={{color:"white", backgroundColor:"red", padding:5, borderRadius: 3}}>
            {this.state.errorMsg[2]}
          </Text>
        }   

        <TextInput
          style={styles.input}
          placeholder="Password"
          onChangeText={value => this.setState({password: value})}
          secureTextEntry={true}
        />
        { //the display box for the password field error message
          (this.state.errorMsg[3] != "") /* Only displays if there is a message to be displayed */ &&
          <Text style={{color:"white", backgroundColor:"red", padding:5, borderRadius: 3}}>
            {this.state.errorMsg[3]}
          </Text>
        }          

        <View style={styles.buttonContainer}>
          <View style={styles.button}>
            <Button
              title='Signup'
              onPress={() => this.signup()}
              color="#19a9f7"
            />
          </View>
          <View style={styles.button}>
            <Button
              title='Back'
              onPress={() => this.props.navigation.goBack()}
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
  buttonContainer: {
    flexDirection: 'row'
  },
  button: {
    margin: 10
  }
});

export default SignupScreen;