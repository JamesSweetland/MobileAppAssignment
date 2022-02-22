import React, { Component } from 'react';
import { StyleSheet, Text, View, Button, TextInput } from 'react-native';

class SignupScreen extends Component{

  state = {
    errorMsg: [ "", "", "", "" ],
    firstName: null,
    lastName: null,
    email: null,
    password: null
  }

  validate = () => {
    let errors = [ "", "", "", "" ];
      
    let fields = [
      this.state.firstName,
      this.state.lastName,
      this.state.email,
      this.state.password
    ];

    if(!/^[a-zA-Z]+$/i.test(fields[0])){
      errors[0] = "First name must only contain letters";
    }

    if(!/^[a-zA-Z]+$/i.test(fields[1])){
      errors[1] = "Last name must only contain letters";
    }

    if(!/^\S+@\S+\.\S+$/.test(fields[2])){
      errors[2] = "Please give a valid email";
    }

    for(let i = 0; i < fields.length; i++){
      if(fields[i] == null){
        errors[i] = "All fields must be filled in";
      }
    }

    this.setState({ errorMsg: errors });

    for(let i = 0; i < errors.length; i++){
      if(errors[i] != ""){
        throw errors[i];
      }
    }
  }

  signup = () => {
    try {
      this.validate();

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
        if(response.status === 201){
          return response.json()
        }else if(response.status === 400){
          throw 'Failed validation';
        }else{
          throw 'Something went wrong';
        }
      })
      .then((responseJson) => {
        console.log("User created with ID: ", responseJson);

        this.props.navigation.navigate("Login");
      })
    } catch (error) {      
      console.error(error);            
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
          { (this.state.errorMsg[0] != "") &&
            <Text style={{color:"white", backgroundColor:"red", padding:5, borderRadius: 3}}>
              {this.state.errorMsg[0]}
            </Text>
          }   

          <TextInput
            style={styles.input}
            placeholder="Last Name"
            onChangeText={value => this.setState({lastName: value})}
          />
          { (this.state.errorMsg[1] != "") &&
            <Text style={{color:"white", backgroundColor:"red", padding:5, borderRadius: 3}}>
              {this.state.errorMsg[1]}
            </Text>
          }   

          <TextInput
            style={styles.input}
            placeholder="Email"
            onChangeText={value => this.setState({email: value})}
          />
          { (this.state.errorMsg[2] != "") &&
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
          { (this.state.errorMsg[3] != "") &&
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
