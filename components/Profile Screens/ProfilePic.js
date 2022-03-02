import React, { Component } from 'react';
import { StyleSheet, Text, View, Button, TouchableOpacity } from 'react-native';
import { Camera } from 'expo-camera';


class ProfilePic extends Component{

    state = {
        hasPermission: null,
        type: Camera.Constants.Type.back
    }

    async componentDidMount(){
        const { status } = await Camera.requestCameraPermissionsAsync();
        this.setState({hasPermission: status === 'granted'});
    }

  render(){
    if(this.state.hasPermission){
        return(
          <View style={styles.container}>
            <Camera style={styles.camera} type={this.state.type}>
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => {
                    let type = type === Camera.Constants.Type.back
                    ? Camera.Constants.Type.front
                    : Camera.Constants.Type.back;
  
                    this.setState({type: type});
                  }}>
                  <Text style={styles.text}> Flip </Text>
                </TouchableOpacity>
              </View>
            </Camera>
            <Button
            title='Back'
            onPress={() =>this.props.navigation.goBack()}
            color="#19a9f7"
            />
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
    },
  });

export default ProfilePic;