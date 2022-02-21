import React, { Component } from 'react';
import { StyleSheet, Text, View, Button, TextInput } from 'react-native';

class SignupScreen extends Component{

  state = {
    firstName: null,
    lastName: null,
    email: null,
    password: null
  }

  async signup(){
    try {
      
      let fName = this.state.firstName;
      let lName = this.state.lastName;
      let email = this.state.email;
      let pass = this.state.password;

      if(fName == null || lName == null || email == null || pass == null){
        throw new Error("All fields must be filled in")
      }

      const response = await fetch('http://localhost:3333/api/1.0.0/user',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            "first_name": this.state.firstName,
            "last_name": this.state.lastName,
            "email": this.state.email,
            "password": this.state.password
          })
        });
      console.debug("Response Code: " + response.status)

    } catch (error) {
      console.error(error);
    }
  }

  render(){
    return(
        <View style={styles.container}>

          <Text>Signup Screen</Text>
          <TextInput
            style={styles.input}
            placeholder="First Name"
            onChangeText={value => this.setState({firstName: value})}
          />
          <TextInput
            style={styles.input}
            placeholder="Last Name"
            onChangeText={value => this.setState({lastName: value})}
          />
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

export default SignupScreen;
