import React, { Component } from 'react';
import { StyleSheet, Text, View, TextInput, Button, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

class SearchScreen extends Component{

  state = {
    token: null,
    query: null,
    results: [],
  }

  search = async () => {
    try{
      let sessionToken;

      //gets authorisation token from async storage if it hasn't been set yet
      if(this.state.token == null){
        sessionToken = await AsyncStorage.getItem('token');
        this.setState({ token: sessionToken });
      }
      else{
        sessionToken = this.state.token;
      } 

      //sends a search request to the server
      return fetch("http://localhost:3333/api/1.0.0/search?q=" + this.state.query, {
        method: 'GET',
        headers: {
          'X-Authorization': sessionToken
        }
      })
      .then((response) => {
        //checks the response code before returning the json
        if(response.status === 200){
          return response.json()
        }else if(response.status === 401){ //if not authorised then redirect to login
          this.props.navigation.navigate("Login");
        }else{
          throw 'Something went wrong';
        }
      })
      .then((responseJson) => {
        if(responseJson.length != 0){            
          this.setState({ results: responseJson });
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

        <View style={{ alignItems: 'center' }}>
          <Text style={styles.title}>SpaceBook</Text>
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

        <FlatList
          data={this.state.results}
          renderItem={({item}) => (
            <View style={ styles.resultsContainer }>          
              <Text>{item.user_givenname} {item.user_familyname}</Text>
              <Button
                title='View Profile'
                onPress={() =>this.props.navigation.navigate('FriendProfile')}
                color="#19a9f7"
              />
            </View>
          )}
          keyExtractor={(item,index) => item.user_id.toString()}
          style={{ padding: 5 }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
    container: {
      fontFamily: "Helvetica",
      flex: 1
    },
    title: {
      color: '#19a9f7',
      fontWeight: 'bold',
      fontSize: '400%',
    },
    searchContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center'
    },
    resultsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#FFFFFF',
        borderRadius: 3,
        margin: 5,
        padding: 5
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

export default SearchScreen;