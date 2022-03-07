import React, { Component } from 'react';
import { StyleSheet, Text, View, Button, TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

class EditPostScreen extends Component{

    state = {
        author: {},
        post: {},
        timestamp: null,
        updatedText: null
    }

    componentDidMount() {
        //refreshes data if this page is focused
        this.unsubscribe = this.props.navigation.addListener('focus', () => {
          this.getPost();      
        });    
      }
    
      componentWillUnmount() {
        this.unsubscribe();
      }

    getPost = async () => {
        //gets the signed in user's ID and authorisation token in async storage
        let id = await AsyncStorage.getItem('userID');
        let postID = await AsyncStorage.getItem('postID');
        let sessionToken = await AsyncStorage.getItem('token');

        //sends a get request to the server to get the signed in user's posts
        fetch("http://localhost:3333/api/1.0.0/user/" + id + "/post/" + postID, {
            method: 'GET',
            headers: {
                'X-Authorization': sessionToken
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
            //converts date and time to a format based on the local settings
            let date = new Date(responseJson.timestamp)
            date = date.toLocaleTimeString( [], {hour: '2-digit', minute:'2-digit'} ) + " " + date.toLocaleDateString(); 
            this.setState({
                author: responseJson.author,
                post: responseJson,
                timestamp: date
            })
            console.log(this.state.post)
        })
        .catch((error) => {
            console.error(error);
        })
    }

    updatePost = async () => {
        //gets the signed in user's ID and authorisation token in async storage
        let id = await AsyncStorage.getItem('userID');
        let postID = await AsyncStorage.getItem('postID');
        let sessionToken = await AsyncStorage.getItem('token');

        fetch("http://localhost:3333/api/1.0.0/user/" + id + "/post/" + postID, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'X-Authorization': sessionToken
            },
            body: JSON.stringify({
                "post_id": this.state.post.post_id,
                "text": this.state.updatedText,
                "timestamp": this.state.post.timestamp,
                "author": this.state.author,
                "numLikes": this.state.post.numLikes
            })
        })
        .then((response) => {
            //checks the response code before returning the json
            if(response.status === 200){
                console.log('Post Updated')
                this.getPost();
            }else if(response.status === 401){//if not authorised then redirect to login
                this.props.navigation.navigate("Login");
            }else{
                throw 'Something went wrong';
            }
        })
        .catch((error) => {
            console.error(error);
        })
    }

  render(){
    return(
      <View style={styles.container}>

        <View style={{ alignItems: 'center' }}>
          <Text style={styles.title}>SpaceBook</Text>
          <Text style={styles.text}>Edit Post</Text>
        </View>

        <View style={ styles.post }>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={{ fontWeight: 'bold' }}>{this.state.author.first_name} {this.state.author.last_name}</Text>
                <Text>{this.state.timestamp}</Text>
            </View>

            <Text style={{ margin: 5}}>{this.state.post.text}</Text>            
            <Text>Likes: {this.state.post.numLikes}</Text>                                                      
        </View>

        <View style={styles.postContainer}>
          <TextInput
            ref={input => { this.textInput = input }}
            style={styles.input}
            onChangeText={value => this.setState({updatedText: value})}
            placeholder="Edit post"
          />
          <View style={{marginHorizontal: 10, marginBottom: 10}}>
            <Button
              title='Update'
              onPress={() => {this.updatePost()} }
              color="#19a9f7"
            />
          </View>          
        </View> 

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
        margin: 5,
        backgroundColor: '#FFFFFF',
        borderRadius: 3
    }
});

export default EditPostScreen;