import React, { Component } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';

class FriendProfile extends Component{

    render(){
        return(
          <View style={styles.container}>
        
            <Text style={styles.title}>SpaceBook</Text>
            <Text style={styles.text}>Friends Profile</Text>

            <Button
                title='Back'
                onPress={() =>this.props.navigation.goBack()}
                color="#19a9f7"
            />
        
          </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
      fontFamily: "Helvetica",
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    title: {
      color: '#19a9f7',
      fontWeight: 'bold',
      fontSize: '400%',
    },
    text: {
      padding: 5,
      fontSize: '120%',
    }
  });

export default FriendProfile;