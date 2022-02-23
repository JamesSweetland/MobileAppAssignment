import React, { Component } from 'react';
import { StyleSheet, Text, View ,Button, TextInput} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

class LoginScreen extends Component{

  state = {
    errorMsg: [ "", "" ],
    email: null,
    password: null
  }

  validate = () => {
    let errors = [ "", "" ];
      
    let fields = [
      this.state.email,
      this.state.password
    ];

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

  login = async () => {
    try {
      this.validate();

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
        if(response.status === 200){
          return response.json()
        }else if(response.status === 400){
          throw 'Invalid email or password';
        }else{
          throw 'Something went wrong';
        }
      })
      .then(async (responseJson) => {

        await AsyncStorage.setItem("userID", JSON.stringify(responseJson.id));
        await AsyncStorage.setItem("token", JSON.stringify(responseJson.token));

        this.props.navigation.navigate("Home");
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
          <Text style={styles.text}>Login</Text>

          <TextInput
            style={styles.input}
            placeholder="Email"
            onChangeText={value => this.setState({email: value})}
          />
          { this.state.errorMsg[0] != "" &&
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
          { this.state.errorMsg[1] != "" &&
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
  button: {
    margin: 10,
  }
});

export default LoginScreen;