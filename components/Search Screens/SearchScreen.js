import React, { Component } from 'react';
import { StyleSheet, Text, View, TextInput, Button, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

class SearchScreen extends Component {

  state = {
    loading: true,
    query: null,
    results: [],
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
    let id = await AsyncStorage.getItem('userID')
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
        } else {
          throw 'Something went wrong';
        }
      })
      .then((responseJson) => {        
        this.setState({
          loading: false,
          friends: responseJson
        });        
      })
      .catch((error) => {
        console.error(error);
      })
  }

  search = async () => {
    let sessionToken = await AsyncStorage.getItem('token');

    //sends a search request to the server
    return fetch("http://localhost:3333/api/1.0.0/search?q=" + this.state.query, {
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
        } else {
          throw 'Something went wrong';
        }
      })
      .then((responseJson) => {
        if (responseJson.length != 0) {
          this.setState({ results: responseJson });
        }
      })
      .catch((error) => {
        console.error(error);
      })
  }

  viewProfile = async (userID) => {
    await AsyncStorage.setItem("profileID", userID);

    this.props.navigation.navigate('ProfileScreen');
  }

  render() {
    if (this.state.loading) {
      return (
        <View style={styles.container}>
          <View style={{ alignItems: 'center' }}>
            <Text style={styles.title}>SpaceBook</Text>
          </View>
          <View style={{ flex: 2, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ fontSize: '100%' }}>Loading...</Text>
          </View>
        </View>
      );
    }
    else if (this.state.results.length == 0) {//if there hasn't been a search yet or there are no results show friends instead
      return (
        <View style={styles.container}>

          <View style={{ alignItems: 'center' }}>
            <Text style={styles.title}>SpaceBook</Text>
          </View>

          <View style={styles.searchContainer}>
            <TextInput
              style={styles.input}
              placeholder="Search"
              onChangeText={value => this.setState({ query: value })}
            />
            <View style={styles.button}>
              <Button
                title='Search'
                onPress={() => this.search()}
                color="#19a9f7"
              />
            </View>
          </View>

          <Text>Your Friends:</Text>

          <FlatList
            data={this.state.friends}
            renderItem={({ item }) => (
              <View style={styles.resultsContainer}>
                <Text>{item.user_givenname} {item.user_familyname}</Text>
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
        </View>
      );
    }
    else {
      return (
        <View style={styles.container}>

          <View style={{ alignItems: 'center' }}>
            <Text style={styles.title}>SpaceBook</Text>
          </View>

          <View style={styles.searchContainer}>
            <TextInput
              style={styles.input}
              placeholder="Search"
              onChangeText={value => this.setState({ query: value })}
            />
            <View style={styles.button}>
              <Button
                title='Search'
                onPress={() => this.search()}
                color="#19a9f7"
              />
            </View>
          </View>

          <Text>Results:</Text>

          <FlatList
            data={this.state.results}
            renderItem={({ item }) => (
              <View style={styles.resultsContainer}>
                <Text>{item.user_givenname} {item.user_familyname}</Text>
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

          <Text>Your Friends:</Text>

          <FlatList
            data={this.state.friends}
            renderItem={({ item }) => (
              <View style={styles.resultsContainer}>
                <Text>{item.user_givenname} {item.user_familyname}</Text>
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

          <View style={styles.cancelButton}>
            <Button
              title='Cancel'
              onPress={() => this.setState({ results: [] })}
              color="red"
            />
          </View>
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
  },
  cancelButton: {
    margin: 10,
    alignItems: 'center',
  }
});

export default SearchScreen;
