import React, { Component } from 'react';
import { StyleSheet, Text, View, Button, FlatList } from 'react-native';
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
        this.setState({ requests: responseJson });
      })
    }
    catch(error){
      console.error(error);
    }
  }

  handleRequest = (methodType, userID) => {
    try{
      let sessionToken = this.state.token;

      return fetch("http://localhost:3333/api/1.0.0/friendrequests/" + userID, {
        method: methodType,
        headers: {
          'X-Authorization': sessionToken
        }
      })
      .then((response) => {
        //checks the response code before returning the json
        if(response.status === 200){
          console.log(methodType + 'ED request');
        }else if(response.status === 401){//if not authorised then redirect to login
          this.props.navigation.navigate("Login");
        }else if(response.status === 401){
          throw 'User Not Found';
        }else{
          throw 'Something went wrong';
        }
      })
    }
    catch(error){
      console.error(error);
    }
  }

  render(){
    if(this.state.requests.length == 0){
      return(
        <View style={styles.container}>
          
          <View style={{ alignItems: 'center' }}>
            <Text style={styles.title}>SpaceBook</Text>
            <Text style={styles.text}>Requests Screen</Text>
          </View>        

          <View style={{ alignItems: 'center', marginTop: '30vh' }}>
            <Text style={styles.text}>No Requests</Text>  
          </View>          
      
        </View>
      );
    }
    else{
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
  
                <View style={{ flexDirection: 'row' }}>
                  <Button
                    title='Accept'
                    onPress={() =>this.handleRequest('POST', item.user_id)}
                    color="#19a9f7"
                  />
                  <Button
                    title='Reject'
                    onPress={() =>this.handleRequest('DELETE', item.user_id)}
                    color="#19a9f7"
                  />
                </View>              
              </View>
            )}
            keyExtractor={(item,index) => item.user_id.toString()}
            style={{ padding: 5 }}
          />  
      
        </View>
      );
    }    
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
    fontSize: 'min(16vw, 500%)'//css sets title to 16% of the viewpoint width but never more than the font size 500%
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