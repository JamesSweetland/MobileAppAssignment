import React, { Component } from 'react';
import { StyleSheet, Text, View} from 'react-native';

class RequestsScreen extends Component{

    render(){
        return(
            <View style={styles.container}>
    
              <Text style={styles.title}>SpaceBook</Text>
              <Text style={styles.text}>Requests Screen</Text>   
    
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

export default RequestsScreen;