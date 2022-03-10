import React, { Component } from 'react';
import { StyleSheet, Text, View, Button, Image, FlatList, TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

class ProfileScreen extends Component {

  state = {
    loading: true,
    fName: null, lName: null, email: null, friendCount: null,
    photo: null,
    postText: null,
    posts: []
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
    this.setState({ loading: true })

    //gets the signed in user's ID and authorisation token in async storage
    let id = await AsyncStorage.getItem('userID');
    let sessionToken = await AsyncStorage.getItem('token');

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
          this.getProfileImage(); //gets profile pic if getData was successfull
          this.getPosts(); //gets users posts     
        }
      })
      .catch((error) => {
        console.error(error);
      })
  }

  getProfileImage = async () => {
    //gets the signed in user's ID and authorisation token in async storage
    let id = await AsyncStorage.getItem('userID');
    let sessionToken = await AsyncStorage.getItem('token');

    //sends a get request to the server to get the signed in user's photo
    fetch("http://localhost:3333/api/1.0.0/user/" + id + "/photo", {
      method: 'GET',
      headers: {
        'X-Authorization': sessionToken
      }
    })
      .then((response) => {
        if (response.status === 200) {
          return response.blob();
        } else if (response.status === 401) {//if not authorised then redirect to login
          this.props.navigation.navigate("Login");
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
    //gets the signed in user's ID and authorisation token in async storage
    let id = await AsyncStorage.getItem('userID');
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
        } else {
          throw 'Something went wrong';
        }
      })
      .then((responseJson) => {
        responseJson.forEach(post => {
          //converts date and time to a format based on the local settings
          let date = new Date(post.timestamp)
          post.timestamp = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + " " + date.toLocaleDateString();
        });
        this.setState({
          loading: false,
          posts: responseJson
        })
      })
      .catch((error) => {
        console.error(error);
      })
  }

  makePost = async () => {
    //gets the signed in user's ID and authorisation token in async storage
    let id = await AsyncStorage.getItem('userID');
    let sessionToken = await AsyncStorage.getItem('token');

    return fetch("http://localhost:3333/api/1.0.0/user/" + id + "/post", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Authorization': sessionToken
      },
      body: JSON.stringify({
        "text": this.state.postText
      })
    })
      .then((response) => {
        //checks the response code before returning the json
        if (response.status === 201) {
          console.log('Post created');
          this.getPosts();
        } else if (response.status === 401) {
          this.props.navigation.navigate("Login");
        } else {
          throw 'Something went wrong';
        }
      })
      .catch((error) => {
        console.error(error);
      })
  }

  editPost = async (postID) => {
    await AsyncStorage.setItem("postID", postID);
    this.props.navigation.navigate('EditPost');
  }

  deletePost = async (postID) => {
    //gets the signed in user's ID and authorisation token in async storage
    let id = await AsyncStorage.getItem('userID');
    let sessionToken = await AsyncStorage.getItem('token');

    return fetch("http://localhost:3333/api/1.0.0/user/" + id + "/post/" + postID, {
      method: 'DELETE',
      headers: {
        'X-Authorization': sessionToken
      }
    })
      .then((response) => {
        //checks the response code before returning the json
        if (response.status === 200) {
          console.log('Post deleted');
          this.getPosts();
        } else if (response.status === 401) {
          this.props.navigation.navigate("Login");
        } else {
          throw 'Something went wrong';
        }
      })
      .catch((error) => {
        console.error(error);
      })
  }

  logout = async () => {
    let sessionToken = await AsyncStorage.getItem('token');

    //sends a logout request to the server
    return fetch("http://localhost:3333/api/1.0.0/logout", {
      method: 'POST',
      headers: {
        'X-Authorization': sessionToken
      }
    })
      .then(async (response) => {
        if (response.status === 200 || response.status === 401) {
          //removes the logged in user's ID and authorisation token from async storage
          await AsyncStorage.removeItem("userID");
          await AsyncStorage.removeItem("token");
          await AsyncStorage.removeItem("postID");
          await AsyncStorage.removeItem("profileID");

          this.props.navigation.navigate("Login");//navigates to the login
        }
        else {
          throw 'Something went wrong';
        }
      })
      .catch((error) => {
        console.error(error);
      })
  }

  render() {
    if (this.state.loading) {
      return (
        <View style={styles.container}>
          <View style={{ alignItems: 'center' }}>
            <Text style={styles.title}>SpaceBook</Text>
          </View>
          <View style={{ flex: 2, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ fontSize:'100%' }}>Loading...</Text>
          </View>          
        </View>
      );
    } else {
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

          </View>

          <View style={styles.postContainer}>
            <TextInput
              ref={input => { this.textInput = input }}
              style={styles.input}
              onChangeText={value => this.setState({ postText: value })}
              multiline={true}
              placeholder="What's on your mind?"
            />
            <View style={{ marginHorizontal: 10, marginBottom: 10 }}>
              <Button
                title='Post'
                onPress={() => { this.makePost(); this.textInput.clear(); }}
                color="#19a9f7"
              />
            </View>
          </View>

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
                        title='Edit'
                        onPress={() => this.editPost(item.post_id)}
                        color="#19a9f7"
                      />
                    </View>
                    <Button
                      title='Delete'
                      onPress={() => this.deletePost(item.post_id)}
                      color="red"
                    />
                  </View>
                </View>
              </View>
            )}
            keyExtractor={(item, index) => item.post_id.toString()}
            style={{ padding: 5 }}
          />

          <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
            <View style={styles.button}>
              <Button
                title='Edit Profile'
                onPress={() => this.props.navigation.navigate('EditProfile')}
                color="#19a9f7"
              />
            </View>
            <View style={styles.button}>
              <Button
                title='Logout'
                onPress={() => this.logout()}
                color="red"
              />
            </View>
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
  input: {
    height: 40,
    margin: 12,
    padding: 10,
    borderRadius: 3
  },
  post: {
    backgroundColor: '#FFFFFF',
    borderRadius: 3,
    margin: 5,
    padding: 5
  },
  postContainer: {
    margin: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 3
  }
});

export default ProfileScreen;