import React, { Component } from 'react';
import { StyleSheet, Text, View, Button, TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

class EditProfileScreen extends Component {

  state = {
    errorMsg: ["", "", "", ""], //an array of the messages that are displayed if the input is invalid
    fName: null, lName: null, email: null, //the already existing details
    newFName: null, newLName: null, newEmail: null,
    password: null
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
            email: responseJson.email
          })
        }
      })
      .catch((error) => {
        console.error(error);
      })
  }

  validate = () => {
    let errors = ["", "", "", ""]; //an array to hold the error messages

    //uses regex to check first name only contains letter
    if (!/^[a-zA-Z]+$/i.test(this.state.newFName)) {
      errors[0] = "First name must only contain letters";
    }

    //uses regex to check last name only contains letter
    if (!/^[a-zA-Z]+$/i.test(this.state.newLName)) {
      errors[1] = "Last name must only contain letters";
    }

    if (this.state.newFName == null || this.state.newFName == "") {
      this.setState({ newFName: this.state.fName });
    }

    if (this.state.newLName == null || this.state.newLName == "") {
      this.setState({ newLName: this.state.lName });
    }

    if (this.state.newEmail == null || this.state.newEmail == "") {
      this.setState({ newEmail: this.state.email });
    }
    else if (!/^\S+@\S+\.\S+$/.test(this.state.newEmail)) { //if email has been supplied checks email is a valid format using regex
      errors[2] = "Please give a valid email";
    }

    if (this.state.password == null || this.state.password == "") {
      errors[3] = "Please enter your existing password\nto confirm, or a new one to change it";
    }

    this.setState({ errorMsg: errors });

    //throws error if any field is invalid
    for (let i = 0; i < errors.length; i++) {
      if (errors[i] != "") {
        throw errors[i];
      }
    }
  }

  updateDetails = async () => {
    this.validate();

    //gets the signed in user's ID and authorisation token in async storage
    let id = await AsyncStorage.getItem('userID');
    let sessionToken = await AsyncStorage.getItem('token');

    return fetch("http://localhost:3333/api/1.0.0/user/" + id, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'X-Authorization': sessionToken
      },
      body: JSON.stringify({
        "first_name": this.state.newFName,
        "last_name": this.state.newLName,
        "email": this.state.newEmail,
        "password": this.state.password
      })
    })
      .then((response) => {
        //checks the response code before returning the json
        if (response.status === 200) {
          console.log('Details Updated')
        } else if (response.status === 400) {
          throw 'Failed Validation';
        } else if (response.status === 401 || response.status === 403) {//if not authorised then redirect to login
          this.props.navigation.navigate("Login");
        } else {
          throw 'Something went wrong';
        }
      })
      .catch((error) => {
        let errors = ["", "", "", ""];
        if (error == 'Failed Validation') {
          errors[3] = "Your Details are not valid";
        }
        else {
          errors[3] = error + ", please try again";
        }
        //displays error message to user and in debug console
        this.setState({ errorMsg: errors });
        console.error(error);
      })
  }

  render() {
    return (
      <View style={styles.container}>

        <View style={{ alignItems: 'center' }}>
          <Text style={styles.title}>SpaceBook</Text>
          <Text style={styles.text}>Edit Profile</Text>
        </View>

        <View style={{ alignItems: 'center' }}>
          <View style={styles.button}>
            <Button
              title='Change Profile Picture'
              onPress={() => this.props.navigation.navigate("CameraScreen")}
              color="#19a9f7"
            />
          </View>

          <Text>First Name</Text>
          <TextInput
            style={styles.input}
            onChangeText={value => this.setState({ newFName: value })}
            placeholder={this.state.fName}
          />
          { //the display box for the first name field error message
            (this.state.errorMsg[0] != "") /* Only displays if there is a message to be displayed */ &&
            <Text style={{ color: "white", backgroundColor: "red", padding: 5, borderRadius: 3 }}>
              {this.state.errorMsg[0]}
            </Text>
          }

          <Text>Last Name</Text>
          <TextInput
            style={styles.input}
            onChangeText={value => this.setState({ newLName: value })}
            placeholder={this.state.lName}
          />
          { //the display box for the last name field error message
            (this.state.errorMsg[1] != "") /* Only displays if there is a message to be displayed */ &&
            <Text style={{ color: "white", backgroundColor: "red", padding: 5, borderRadius: 3 }}>
              {this.state.errorMsg[1]}
            </Text>
          }

          <Text>Email</Text>
          <TextInput
            style={styles.input}
            onChangeText={value => this.setState({ newEmail: value })}
            placeholder={this.state.email}
          />
          { //the display box for the email field error message
            (this.state.errorMsg[2] != "") /* Only displays if there is a message to be displayed */ &&
            <Text style={{ color: "white", backgroundColor: "red", padding: 5, borderRadius: 3 }}>
              {this.state.errorMsg[2]}
            </Text>
          }

          <Text>Password</Text>
          <TextInput
            style={styles.input}
            onChangeText={value => this.setState({ password: value })}
            placeholder="Password"
            secureTextEntry={true}
          />
          { //the display box for the password field error message
            (this.state.errorMsg[3] != "") /* Only displays if there is a message to be displayed */ &&
            <Text style={{ color: "white", backgroundColor: "red", padding: 5, borderRadius: 3 }}>
              {this.state.errorMsg[3]}
            </Text>
          }

          <View>
            <View style={styles.button}>
              <Button
                title='Update'
                onPress={() => this.updateDetails()}
                color="#19a9f7"
              />
            </View>
            <View style={styles.button}>
              <Button
                title='Back'
                onPress={() => this.props.navigation.goBack()}
                color="#19a9f7"
              />
            </View>
          </View>
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
    color: '#19a9f7',
    fontWeight: 'bold',
    fontSize: 'min(16vw, 500%)'//css sets title to 16% of the viewpoint width but never more than the font size 500%
  },
  text: {
    padding: 5,
    fontSize: '120%'
  },
  button: {
    margin: 10
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