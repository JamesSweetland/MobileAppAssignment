import React, { Component } from 'react';
import { StyleSheet, Text, View, Button, TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

class EditProfileScreen extends Component{

    state = {
        fName: null,
        lName: null,
        email: null
    }

    componentDidMount() {
        this.getData();      

    }

    getData = async () => {    
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
          if(response.status === 200){
            return response.json()
          }else if(response.status === 401){//if not authorised then redirect to login
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
              email: responseJson.email
            })
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
                    <Text style={styles.text}>Edit Profile</Text>
                </View>            

                <View style={styles.button}>
                    <Button
                        title='Change Profile Picture'
                        onPress={() =>this.props.navigation.navigate("CameraScreen")}
                        color="#19a9f7"
                    />
                </View>

                <Text>{this.state.fName}</Text>
                <TextInput
                    style={styles.input}
                    placeholder="First Name"
                />               

                <Text>{this.state.lName}</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Last Name"
                />
                
                <Text>{this.state.email}</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Email"
                />

                <Text>Password</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Password"
                />

                <View style={styles.button}>
                    <Button
                    title='Update'
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
        flex: 1,
        alignItems: 'center'
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
        borderWidth: 1,
        padding: 10,
        borderRadius: 3
    }
});

export default EditProfileScreen;