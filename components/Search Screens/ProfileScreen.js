import React, { Component } from 'react';
import { StyleSheet, Text, View, Button, Image, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

class FriendsScreen extends Component {

  state = {
    fName: null, lName: null, email: null, friendCount: null,
    photo: null,
    posts: [],
    friends: true
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

    this.setState({ posts: [] }) //resets posts to avoid old posts showing when navigating between a friends profile and a profile which is not a friend

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
          this.setState({
            fName: responseJson.first_name,
            lName: responseJson.last_name,
            email: responseJson.email,
            friendCount: responseJson.friend_count
          })
          this.getProfileImage(); //gets profile pic
          this.getPosts(); //gets users posts     
        }
      })
      .catch((error) => {
        console.error(error);
      })
  }

  getProfileImage = async () => {
    //gets authorisation token and selected user profile id in async storage
    let id = await AsyncStorage.getItem('profileID');
    let sessionToken = await AsyncStorage.getItem('token');

    //sends a get request to the server to get the signed in user's photo
    fetch("http://localhost:3333/api/1.0.0/user/" + id + "/photo", {
      method: 'GET',
      headers: {
        'X-Authorization': sessionToken
      }
    })
      .then((response) => {
        //checks the response code before returning the json
        if (response.status === 200) {
          return response.blob();
        } else if (response.status === 401) {//if not authorised then redirect to login
          this.props.navigation.navigate("Login");
        } else if (response.status === 404) {
          this.props.navigation.navigate("SearchResults");
        } else {
          throw 'Something went wrong';
        }
      })
      .then((responseBlob) => {
        let data = URL.createObjectURL(responseBlob);
        this.setState({ photo: data });
      })
      .catch((error) => {
        console.error(error);
      })
  }

  getPosts = async () => {
    //gets authorisation token and selected user profile id in async storage
    let id = await AsyncStorage.getItem('profileID');
    let sessionToken = await AsyncStorage.getItem('token');    

    //sends a get request to the server to get the signed in user's posts
    fetch("http://localhost:3333/api/1.0.0/user/" + id + "/post", {
      method: 'GET',
      headers: {
        'X-Authorization': sessionToken
      }
    })
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        } else if (response.status === 401) {
          this.props.navigation.navigate("Login");
        } else if (response.status === 403) {
          throw 'You must be friends to view posts';
        } else if (response.status === 404) {
          this.props.navigation.navigate("SearchResults");
        } else {
          throw 'Something went wrong';
        }
      })
      .then((responseJson) => {
        this.setState({ friends: true }) //successfully got posts so user is a friend

        responseJson.forEach(post => {
          //converts date and time to a format based on the local settings
          let date = new Date(post.timestamp)
          post.timestamp = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + " " + date.toLocaleDateString();
        });

        this.setState({ posts: responseJson })
      })
      .catch((error) => {
        if (error == 'You must be friends to view posts') {
          this.setState({ friends: false }) //cannot view posts so users not friends
        }
        console.error(error);
      })
  }

  likePost = async (methodType, postID) => {
    //gets authorisation token and selected user profile id in async storage
    let id = await AsyncStorage.getItem('profileID');
    let sessionToken = await AsyncStorage.getItem('token');

    return fetch("http://localhost:3333/api/1.0.0/user/" + id + "/post/" + postID + "/like", {
      method: methodType,
      headers: {
        'X-Authorization': sessionToken
      }
    })
      .then((response) => {
        //checks the response code before returning the json
        if (response.status === 200) {
          console.log(methodType + ' Like');
          this.getPosts();
        } else if (response.status === 400) {
          console.log('Post already liked or unliked');
        } else if (response.status === 401) {
          this.props.navigation.navigate("Login");
        } else if (response.status === 404) {
          this.props.navigation.navigate("SearchResults");
        } else {
          throw 'Something went wrong';
        }
      })
      .catch((error) => {
        console.error(error);
      })
  }

  addFriend = async () => {
    //gets authorisation token and selected user profile id in async storage  
    let id = await AsyncStorage.getItem('profileID');
    let sessionToken = await AsyncStorage.getItem('token');

    //sends a search request to the server
    return fetch("http://localhost:3333/api/1.0.0/user/" + id + "/friends", {
      method: 'POST',
      headers: {
        'X-Authorization': sessionToken
      }
    })
      .then((response) => {
        //checks the response code before returning the json
        if (response.status === 201) {
          console.log('Friend Request Sent')
        } else if (response.status === 401) { //if not authorised then redirect to login
          this.props.navigation.navigate("Login");
        } else if (response.status === 403 || response.status === 404) {
          this.props.navigation.navigate("SearchResults");
        } else {
          throw 'Something went wrong';
        }
      })
      .catch((error) => {
        console.error(error);
      })
  }

  render() {
    return (
      <View style={styles.container}>

        <View style={{ alignItems: 'center' }}>

          <Text style={styles.title}>SpaceBook</Text>

          <Image source={{ uri: this.state.photo }} style={styles.image} />
          <Text style={styles.name}>{this.state.fName} {this.state.lName}</Text>

          <View>
            <Text style={{ fontSize: '100%' }}>Email: {this.state.email}</Text>
            <Text style={{ fontSize: '100%' }}>Friends: {this.state.friendCount}</Text>
          </View>

          {this.state.friends &&
            <View style={styles.button}>
              <Button
                title='View Friends'
                onPress={() => this.props.navigation.navigate("ViewFriends")}
                color="#19a9f7"
              />
            </View>
          }

          {!this.state.friends &&
            <View style={styles.button}>
              <Button
                title='Add Friend'
                onPress={() => this.addFriend()}
                color="#19a9f7"
              />
            </View>
          }

        </View>

        {!this.state.friends &&
          <View style={{ alignItems: 'center', marginVertical: '10vh' }}>
            <Text>You must be friends to view their posts</Text>
          </View>
        }

        <FlatList
          data={this.state.posts}
          renderItem={({ item }) => (
            <View style={styles.post}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={{ fontWeight: 'bold' }}>{item.author.first_name} {item.author.last_name}</Text>
                <Text>{item.timestamp}</Text>
              </View>
              <Text style={{ margin: 5 }}>{item.text}</Text>
              <View style={{ justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center' }}>
                <Text>Likes: {item.numLikes}</Text>
                <View style={{ flexDirection: 'row' }}>
                  <View style={{ marginRight: 5 }}>
                    <Button
                      title='Like'
                      onPress={() => this.likePost('POST', item.post_id)}
                      color="#19a9f7"
                    />
                  </View>

                  <Button
                    title='Unlike'
                    onPress={() => this.likePost('DELETE', item.post_id)}
                    color="red"
                  />
                </View>
              </View>

            </View>
          )}
          keyExtractor={(item, index) => item.post_id.toString()}
          style={{ padding: 5 }}
        />

        <View style={styles.button}>
          <Button
            title='Back'
            onPress={() => this.props.navigation.navigate("SearchResults")}
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
  image: {
    alignItems: 'center',
    width: 'min(20vh, 50vw, 250px)',
    height: 'min(20vh, 50vw, 250px)',
    borderRadius: 180
  },
  title: {
    color: '#19a9f7',
    fontWeight: 'bold',
    fontSize: 'min(16vw, 500%)'//css sets title to 16% of the viewpoint width but never more than the font size 500%
  },
  name: {
    padding: 5,
    fontSize: '120%',
    fontWeight: 'bold'
  },
  button: {
    margin: 10,
    alignItems: 'center'
  },
  post: {
    backgroundColor: '#FFFFFF',
    borderRadius: 3,
    margin: 5,
    padding: 5
  }
});

export default FriendsScreen;
