import React, { Component } from 'react';
import { StyleSheet, Text, View, Button, TextInput } from 'react-native';

class SignupScreen extends Component{

  render(){
    return(
        <View style={styles.container}>
          <Text>Signup Screen</Text>
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
              />
            </View>
            <View style={styles.button}>
              <Button
                title='Back'
                onPress={() => this.props.navigation.goBack()}
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