import React, { Component } from 'react';
import { StyleSheet, Text, View, Button} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

class HomeScreen extends Component{

  componentDidMount() {
    this.unsubscribe = this.props.navigation.addListener('focus', () => {
      this.checkLoggedIn();
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  checkLoggedIn = async () => {
    const value = await AsyncStorage.getItem('token');
    if (value == null) {
        this.props.navigation.navigate('Login');
    }
  };

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
                color="#19a9f7"
              />
            </View>
            <View style={styles.button}>
              <Button
                title="Signup"
                onPress={() => this.props.navigation.navigate('Signup')}
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
    padding: 20,
    fontSize: '120%',
  },
  buttonContainer: {
    flexDirection: 'row',
  },
  button: {
    margin: 10,
  },
});

export default HomeScreen;
