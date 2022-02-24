import React, { Component } from 'react';
import { StyleSheet, Text, View, TextInput, Button} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

class FriendsScreen extends Component{

  state = {
    token: null,
    query: null,
    userID: null,
    fName: null, lName: null, email: null, friendCount: null
  }

  search = async () => {
    try{
      let sessionToken = await AsyncStorage.getItem('token');

      if(sessionToken != null){
        sessionToken = sessionToken.replaceAll('"', '');
      }
      else{
        return null;
      }     

      this.setState({ token: sessionToken })

      return fetch("http://localhost:3333/api/1.0.0/search?q=" + this.state.query, {
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
          this.setState({ userID: responseJson[0].user_id});
          this.getData();
        }        
      })
    }
    catch(error){
      console.error(error);
    }
  }

  getData = async () => {
    try{
      return fetch("http://localhost:3333/api/1.0.0/user/" + this.state.userID, {
        method: 'GET',
        headers: {
          'X-Authorization': this.state.token
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
        }        
      })
    }
    catch(error){
      console.error(error);
    }    
  }

  render(){
    return(
      <View style={styles.container}>

        <View style={styles.header}>
          <Text style={styles.title}>SpaceBook</Text>
          <Text style={styles.text}>Friend Screen</Text>
        </View> 
        
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.input}
            placeholder="Search"
            onChangeText={value => this.setState({query: value})}
          />
          <View style={styles.button}>
            <Button
              title='Search'
              onPress={() =>this.search()}
              color="#19a9f7"
            />
          </View>
        </View>

        { this.state.fName != null &&
          <View>
            <Text>{this.state.fName} {this.state.lName}</Text>
            <Text>Email: {this.state.email}</Text>
            <Text>Friends: {this.state.friendCount}</Text>
          </View>
        }

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
  title: {
    color: '#19a9f7',
    fontWeight: 'bold',
    fontSize: '400%',
  },
  text: {
    padding: 5,
    fontSize: '120%',
  },
  searchContainer: {
    flexDirection: 'row',
    justifyContent: 'center'
  },
  input: {
    flex: 3,
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    borderRadius: 3
  },
  button: {
    flex: 1,
    margin: 10,
    alignItems: 'center',
  }
});

export default FriendsScreen;
