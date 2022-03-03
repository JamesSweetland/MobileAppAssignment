import React, { Component } from 'react';
import { StyleSheet, Text, View, Button, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

class ViewFriendsScreen extends Component{

    state = {
        friends: []
    }

    componentDidMount() {
        //refreshes data if this page is focused
        this.unsubscribe = this.props.navigation.addListener('focus', () => {
            this.getFriends();      
        });    
    }
    
    componentWillUnmount() {
        this.unsubscribe();
    }

    getFriends = async () => {
        //gets the signed in user's ID and authorisation token in async storage      
        let id = await AsyncStorage.getItem('profileID')
        let sessionToken = await AsyncStorage.getItem('token');
        
    
        //sends a search request to the server
        return fetch("http://localhost:3333/api/1.0.0/user/" + id + "/friends", {
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
            this.setState({ friends: responseJson });
          }        
        })
        .catch((error) => {
          console.error(error);
        })  
      }

  render(){
    return(
        <View style={styles.container}>

            <Text style={styles.title}>SpaceBook</Text>

            <Text style={styles.text}>Friends:</Text>            

            <FlatList
            data={this.state.friends}
            renderItem={({item}) => (
              <View style={ styles.resultsContainer }>          
                <Text>{item.user_givenname} {item.user_familyname}</Text>
              </View>
            )}
            keyExtractor={(item,index) => item.user_id.toString()}
            style={{ padding: 5 }}
          />

        <View style={styles.button}>
            <Button
                title='Back'
                onPress={() =>this.props.navigation.goBack()}
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
    title: {
        alignItems: 'center',
        color: '#19a9f7',
        fontWeight: 'bold',
        fontSize: 'min(16vw, 500%)'//css sets title to 16% of the viewpoint width but never more than the font size 500%
      },
    text: {        
        padding: 5,
        fontSize: '120%',
    },
    button: {
      margin: 10,
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
  });
  

export default ViewFriendsScreen;
