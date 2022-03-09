import React, { Component } from 'react';
import { StyleSheet, Text, View, Button, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

class ViewFriendsScreen extends Component {

  state = {
    fName: null,
    friends: []
  }

  componentDidMount() {
    //refreshes data if this page is focused
    this.unsubscribe = this.props.navigation.addListener('focus', () => {
      this.getData();
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  getData = async () => {
    //gets authorisation token and selected user profile id in async storage
    let id = await AsyncStorage.getItem('profileID');
    let sessionToken = await AsyncStorage.getItem('token');

    this.setState({ posts: [] })

    //gets signed in user's data
    return fetch("http://localhost:3333/api/1.0.0/user/" + id, {
      method: 'GET',
      headers: {
        'X-Authorization': sessionToken
      }
    })
      .then((response) => {
        //checks the response code before returning the json
        if (response.status === 200) {
          return response.json()
        } else if (response.status === 401) {//if not authorised then redirect to login
          this.props.navigation.navigate("Login");
        } else if (response.status === 404) {
          this.props.navigation.navigate("SearchResults");
        } else {
          throw 'Something went wrong';
        }
      })
      .then((responseJson) => {
        if (responseJson != undefined) {
          this.setState({ fName: responseJson.first_name })
          this.getFriends();
        }
      })
      .catch((error) => {
        console.error(error);
      })
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
        if (response.status === 200) {
          return response.json()
        } else if (response.status === 401) { //if not authorised then redirect to login
          this.props.navigation.navigate("Login");
        } else if (response.status === 403 || response.status === 404) {
          this.props.navigation.navigate("SearchResults");
        } else {
          throw 'Something went wrong';
        }
      })
      .then((responseJson) => {
        if (responseJson.length != 0) {
          this.setState({ friends: responseJson });
        }
      })
      .catch((error) => {
        console.error(error);
      })
  }

  viewProfile = async (userID) => {
    let id = await AsyncStorage.getItem('userID');

    //ensures that if the user requests to view their own profile it takes them to the my profile screen
    if (id == userID) {
      this.props.navigation.navigate('MyProfileScreen');
    }
    else {
      await AsyncStorage.setItem("profileID", userID);
      this.props.navigation.navigate('ProfileScreen');
    }
  }

  render() {
    return (
      <View style={styles.container}>

        <Text style={styles.title}>SpaceBook</Text>
        <Text style={styles.text}>{this.state.fName}'s Friends:</Text>

        <FlatList
          data={this.state.friends}
          renderItem={({ item }) => (
            <View style={styles.friendsContainer}>
              <Text style={{ fontSize: '100%' }}>{item.user_givenname} {item.user_familyname}</Text>
              <Button
                title='View Profile'
                onPress={() => this.viewProfile(item.user_id)}
                color="#19a9f7"
              />
            </View>
          )}
          keyExtractor={(item, index) => item.user_id.toString()}
          style={{ padding: 5 }}
        />

        <View style={styles.button}>
          <Button
            title='Back'
            onPress={() => this.props.navigation.goBack()}
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
  friendsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 3,
    margin: 5,
    padding: 5
  }
});


export default ViewFriendsScreen;
