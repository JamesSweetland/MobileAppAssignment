import React, { Component } from 'react';
import { StyleSheet, Text, View, Button, TextInput } from 'react-native';

class SignupScreen extends Component{

  state = {
    firstName: null,
    firstNameError : null,

    lastName: null,
    lastNameError: null,

    email: null,
    emailError: null,

    password: null,
    passwordError: null
  }

  async signup(){
    try {
      
      let fName = this.state.firstName;
      let lName = this.state.lastName;
      let email = this.state.email;
      let pass = this.state.password;

      if(fName == null || lName == null || email == null || pass == null){        
        throw "All fields must be filled in";
      }  
      else if(!/^[a-zA-Z]+$/.test(fName)){            
        throw "First Name must be letters";
      }
      else if(!/^[a-zA-Z]+$/.test(lName)){
        throw "Last Name must be letters";
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
      switch (error){
        case "All fields must be filled in":
          this.setState({passwordError : error});
          break;
        case "First Name must be letters":
          this.setState({firstNameError : error});
          break;
        case "Last Name must be letters":
          this.setState({lastNameError : error});
          break;
        default:
          console.error(error);
      }      
    }
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
          { (this.state.firstNameError != null) &&
            <Text style={{color:"white", backgroundColor:"red", padding:5, borderRadius: 3}}>
              {this.state.firstNameError}
            </Text>
          }

          <TextInput
            style={styles.input}
            placeholder="Last Name"
            onChangeText={value => this.setState({lastName: value})}
          />
          { (this.state.lastNameError != null) &&
            <Text style={{color:"white", backgroundColor:"red", padding:5, borderRadius: 3}}>
              {this.state.lastNameError}
            </Text>
          }

          <TextInput
            style={styles.input}
            placeholder="Email"
            onChangeText={value => this.setState({email: value})}
          />
          { (this.state.emailError != null) &&
            <Text style={{color:"white", backgroundColor:"red", padding:5, borderRadius: 3}}>
              {this.state.firstNameError}
            </Text>
          }

          <TextInput
            style={styles.input}
            placeholder="Password"
            onChangeText={value => this.setState({password: value})}
            secureTextEntry={true}
          />
          { (this.state.passwordError != null) &&
            <Text style={{color:"white", backgroundColor:"red", padding:5, borderRadius: 3}}>
              {this.state.passwordError}
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
    justifyContent: 'center',
  },
  title: {
    color: '#19a9f7',
    fontWeight: 'bold',
    fontSize: '400%',
  },
  text: {
    padding: 5,
    fontSize: '150%',
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    borderRadius: 3,
  },
  buttonContainer: {
    flexDirection: 'row',
  },
  button: {
    margin: 10,
  },
});

export default SignupScreen;
