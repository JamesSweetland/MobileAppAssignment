import React, { Component } from 'react';
import { StyleSheet, Text, View, TextInput, Button, FlatList} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

class SearchScreen extends Component{

  state = {
    token: null,
    query: null,
    results: [],
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