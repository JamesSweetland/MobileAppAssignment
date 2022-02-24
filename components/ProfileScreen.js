import React, { Component } from 'react';
import { StyleSheet, Text, View, Button, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { render } from 'react-dom';

class ProfileScreen extends Component{

  state = {
    userID: null, token: null,
    fName: null, lName: null, email: null, friendCount: null,
    photo: null
  }

  componentDidMount() {
    this.unsubscribe = this.props.navigation.addListener('focus', () => {
      this.getData();
    });    
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  getData = async () => {
    try{
      let id = await AsyncStorage.getItem('userID');
      let sessionToken = await AsyncStorage.getItem('token');

      if(sessionToken != null){
        sessionToken = sessionToken.replaceAll('"', '');
      }
      else{
        return null;
      }     

      this.setState({
        userID: id,
        token: sessionToken
      })

      return fetch("http://localhost:3333/api/1.0.0/user/" + id, {
        method: 'GET',
        headers: {
          'X-Authorization': sessionToken
        }
      })
      .then((response) => {
        if(response.status === 200){
          return response.json()
        }else if(response.status === 401){
          this.props.navigation.navigate("Login");
        }else{
          throw 'Something went wrong';
        }
      })
      .then((responseJson) => {
        if(responseJson != undefined){
          this.setState({
            fName: responseJson.first_name,
            lName: responseJson.last_name,
            email: responseJson.email,
            friendCount: responseJson.friend_count
          })
          this.getProfileImage();
        }        
      })
    }
    catch(error){
      console.error(error);
    }    
  }

  getProfileImage = () => {
    try{
      fetch("http://localhost:3333/api/1.0.0/user/" + /*this.state.id*/ 1 + "/photo", {
        method: 'GET',
        headers: {
          'X-Authorization': this.state.token
        }
      })
      .then((response) => {
        return response.blob();
      })
      .then((responseBlob) => {
        let data = URL.createObjectURL(responseBlob);
        this.setState({ photo: data });
      });
    }
    catch(error){
      console.error(error);
    }
  }
  
  logout = async () => {
    try {
      let sessionToken = this.state.token;

      return fetch("http://localhost:3333/api/1.0.0/logout", {
        method: 'POST',
        headers: {
          'X-Authorization': sessionToken
        }
      })
      .then( async (response) => {
        if(response.status === 200 || response.status === 401){
          await AsyncStorage.removeItem("userID");
          await AsyncStorage.removeItem("token");

          this.props.navigation.navigate("Login");
        }
        else{
          throw 'Something went wrong';
        }
      })
    }
    catch(error) {
      console.error(error);
    }
  }  
  
  render(){
    return(    
      <View style={styles.container}>
        
        <View style={styles.header}>
          <Text style={styles.title}>SpaceBook</Text>
          <Text style={styles.text}>Profile Screen</Text>

          <Image
            source={{
              uri: this.state.photo
            }}
            style={{
              width: 300,
              height: 300,
              borderRadius: 180,
            }}
          />  
          <Text style={styles.text}>{this.state.fName} {this.state.lName}</Text>
        </View>
        
        <Text>Email: {this.state.email}</Text>
        <Text>Friends: {this.state.friendCount}</Text>

        <View style={styles.button}>
          <Button
            title='Logout'
            onPress={() =>this.logout()}
            color="#19a9f7"
          />
        </View>
        
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    fontFamily: "Helvetica",
    flex: 1
  },
  header: {
    alignItems: 'center',
  },
  image: {
    alignItems: 'center',
  },
  title: {    
    color: '#19a9f7',
    fontWeight: 'bold',
    fontSize: '400%'
  },
  text: {
    padding: 5,
    fontSize: '120%'
  },
  button: {
    margin: 10,
    alignItems: 'center'
  }
});

export default ProfileScreen;
