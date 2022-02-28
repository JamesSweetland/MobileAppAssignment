import React, { Component } from 'react';
import { StyleSheet, Text, View, FlatList} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

class RequestsScreen extends Component{

  state = {
    userID: null,
    token: null,
    requests: []
  }

  componentDidMount() {
    //refreshes data if this page is focused
    this.unsubscribe = this.props.navigation.addListener('focus', () => {
      this.getRequests();      
    });    
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  getRequests = async () => {
    try{
      let id;
      let sessionToken;
      
      //gets authorisation token from async storage if it hasn't been set yet
      if(this.state.token == null){
        sessionToken = await AsyncStorage.getItem('token');
        id = await AsyncStorage.getItem('userID');
        this.setState({
          userID: id,
          token: sessionToken 
        });
      }
      else{
        sessionToken = this.state.token;
      }      

      return fetch("http://localhost:3333/api/1.0.0/friendrequests", {
        method: 'GET',
        headers: {
          'X-Authorization': sessionToken
        }
      })
      .then((response) => {
        //checks the response code before returning the json
        if(response.status === 200){
          return response.json()
        }else if(response.status === 401){//if not authorised then redirect to login
          this.props.navigation.navigate("Login");
        }else{
          throw 'Something went wrong';
        }
      })
      .then((responseJson) => {
        if(responseJson.length != 0){            
          this.setState({ requests: responseJson });
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
          <Text style={styles.text}>Requests Screen</Text>
        </View>        

        <FlatList
          data={this.state.requests}
          renderItem={({item}) => (
            <View style={ styles.requestsContainer }>          
              <Text>{item.first_name} {item.last_name}</Text>
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
  text: {
    padding: 5,
    fontSize: '120%',
  },
  requestsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 3,
    margin: 5,
    padding: 5
  }
});

export default RequestsScreen;