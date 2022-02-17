import React, { Component } from 'react';
import { StyleSheet, Text, View, Button} from 'react-native';

class HomeScreen extends Component{

  render(){
    return(
        <View style={styles.container}>

          <Text style={styles.title}>SpaceBook</Text>
          <Text style={styles.text}>Welcome to SpaceBook, Please Login or Signup</Text>
          
          <View style={styles.buttonContainer}>
            <View style={styles.button}>
              <Button
                title="Login"
                onPress={() => this.props.navigation.navigate('Login')}
              />
            </View>
            <View style={styles.button}>
              <Button
                title="Signup"
                onPress={() => this.props.navigation.navigate('Signup')}
              />
            </View>
          </View>

        </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: '#19a9f7',
    fontWeight: 'bold',
    fontSize: 30,
  },
  text: {
    padding: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
  },
  button: {
    margin: 10,
  },
});

export default HomeScreen;
