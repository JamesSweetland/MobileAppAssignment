import React, { Component } from 'react';
import { StyleSheet, Text, View, Button, Image, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

class ProfileScreen extends Component{

  state = {
    userID: null, token: null,
    fName: null, lName: null, email: null, friendCount: null,
    photo: null,
    posts: []
  }

  componentDidMount() {
    this.unsubscribe = this.props.navigation.addListener('focus', () => {
      this.getData();      
    });    
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  getData = async () => {
    try{
      let id = await AsyncStorage.getItem('userID');
      let sessionToken = await AsyncStorage.getItem('token');

      if(sessionToken != null){
        sessionToken = sessionToken.replaceAll('"', '');
      }
      else{
        return null;
      }

      this.setState({
        userID: id,
        token: sessionToken
      })

      return fetch("http://localhost:3333/api/1.0.0/user/" + id, {
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
          this.setState({
            fName: responseJson.first_name,
            lName: responseJson.last_name,
            email: responseJson.email,
            friendCount: responseJson.friend_count
          })
          this.getProfileImage();
          this.getPosts();       
        }
      })
    }
    catch(error){
      console.error(error);
    }
  }

  getProfileImage = () => {
    try{
      fetch("http://localhost:3333/api/1.0.0/user/" + /*this.state.id*/ 1 + "/photo", {
        method: 'GET',
        headers: {
          'X-Authorization': this.state.token
        }
      })
      .then((response) => {
        return response.blob();
      })
      .then((responseBlob) => {
        let data = URL.createObjectURL(responseBlob);
        this.setState({ photo: data });
      });
    }
    catch(error){
      console.error(error);
    }
  }

  getPosts = () => {
    try{
      fetch("http://localhost:3333/api/1.0.0/user/" + this.state.userID + "/post", {
        method: 'GET',
        headers: {
          'X-Authorization': this.state.token
        }
      })
      .then((response) => {
        if(response.status === 200){
          return response.json();
        }else if(response.status === 401){
          this.props.navigation.navigate("Login");
        }else{
          throw 'Something went wrong';
        }
      })
      .then((responseJson) =>{
        responseJson.forEach(post => {
          let date = new Date(post.timestamp)
          post.timestamp = date.toLocaleTimeString( [], {hour: '2-digit', minute:'2-digit'} ) + " " + date.toLocaleDateString();
        });
        this.setState({posts: responseJson})
      })
    }
    catch(error){
      console.error(error);
    }
  }
  
  logout = async () => {
    try {
      let sessionToken = this.state.token;

      return fetch("http://localhost:3333/api/1.0.0/logout", {
        method: 'POST',
        headers: {
          'X-Authorization': sessionToken
        }
      })
      .then( async (response) => {
        if(response.status === 200 || response.status === 401){
          await AsyncStorage.removeItem("userID");
          await AsyncStorage.removeItem("token");

          this.props.navigation.navigate("Login");
        }
        else{
          throw 'Something went wrong';
        }
      })
    }
    catch(error) {
      console.error(error);
    }
  }
  
  render(){
    return(    
      <View style={styles.container}>
        
        <View style={styles.header}>
          <Text style={styles.title}>SpaceBook</Text>
          <Text style={styles.text}>Profile Screen</Text>

          <Image
            source={{
              uri: this.state.photo
            }}
            style={{
              width: 250,
              height: 250,
              borderRadius: 180,
            }}
          />  
          <Text style={styles.text}>{this.state.fName} {this.state.lName}</Text>
          <View>
            <Text style={{fontSize: '100%'}}>Email: {this.state.email}</Text>
            <Text style={{fontSize: '100%'}}>Friends: {this.state.friendCount}</Text>
          </View>      
        </View>
        
        

        <FlatList
          data={this.state.posts}
          renderItem={({item}) => (
            <View style={ styles.post }>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={{ fontWeight: 'bold', /*fontSize: '100%'*/ }}>{item.author.first_name} {item.author.last_name}</Text>
                <Text>{item.timestamp}</Text>
              </View>              
              <Text style={{ margin: 5}}>{item.text}</Text>
              <Text>Likes: {item.numLikes}</Text>
            </View>
          )}
          keyExtractor={(item,index) => item.post_id.toString()}
          style={{ padding: 5 }}
        />

        <View style={styles.button}>
          <Button
            title='Logout'
            onPress={() =>this.logout()}
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
  header: {
    alignItems: 'center',
  },
  image: {
    alignItems: 'center',
  },
  title: {    
    color: '#19a9f7',
    fontWeight: 'bold',
    fontSize: '400%'
  },
  text: {
    padding: 5,
    fontSize: '120%'
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

export default ProfileScreen;
