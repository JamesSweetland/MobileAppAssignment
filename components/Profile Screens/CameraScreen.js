import React, { Component } from 'react';
import { StyleSheet, Text, View, Button, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Camera } from 'expo-camera';

class ProfilePic extends Component{
    
  constructor(props){
    super(props);

    this.state = {
      hasPermission: null,
      type: Camera.Constants.Type.back
    }
  }

  async componentDidMount(){
    const { status } = await Camera.requestCameraPermissionsAsync();
    this.setState({hasPermission: status === 'granted'});
  }

  sendToServer = async (data) => {
    //gets the signed in user's ID and authorisation token in async storage
    let id = await AsyncStorage.getItem('userID');
    let sessionToken = await AsyncStorage.getItem('token');

    let res = await fetch(data.base64);
    let blob = await res.blob();

    return fetch("http://localhost:3333/api/1.0.0/user/" + id + "/photo", {
      method: "POST",
      headers: {
        "Content-Type": "image/png",
        "X-Authorization": sessionToken
      },
      body: blob
    })
    .then((response) => {
      console.log("Picture added", response);
    })
    .catch((err) => {
      console.log(err);
    })
  }

  takePicture = async () => {
    if(this.camera){
      const options = {
          quality: 0.5,
          base64: true,
          onPictureSaved: (data) => this.sendToServer(data)
      };
      await this.camera.takePictureAsync(options); 
    }
  }

  render(){
    if(this.state.hasPermission){
      return(
        <View style={styles.container}>
          <Camera 
            style={styles.camera} 
            type={this.state.type}
            ref={ref => this.camera = ref}
          >
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.button}
                onPress={() => {
                  this.takePicture();
                }}>
                <Text style={styles.text}> Take Photo </Text>
              </TouchableOpacity>
            </View>
          </Camera>

          <View style={styles.button}>
            <Button
              title='Back'
              onPress={() =>this.props.navigation.goBack()}
              color="#19a9f7"
            />
          </View>  
        </View>
      );
    }else{
      return(
        <View>
          <Text>No access to camera</Text>
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
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    fontFamily: "Helvetica",
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    margin: 20,
  },
  button: {
    flex: 0.1,
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
    color: 'white',
  }
});

export default ProfilePic;