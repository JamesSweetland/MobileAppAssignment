import React, { Component } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';

class EditProfileScreen extends Component{

  render(){
    return(
        <View style={styles.container}>
            <Text style={styles.text}>Edit</Text>
            <View style={styles.button}>
            <Button
              title='Change Profile Picture'
              onPress={() =>this.props.navigation.navigate("CameraScreen")}
              color="#19a9f7"
            />
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
    input: {
      height: 40,
      margin: 12,
      padding: 10,    
      borderRadius: 3
    }
  });

export default EditProfileScreen;