import React, { Component } from 'react';
import { Text, TextInput, View, Button, StyleSheet, Alert } from 'react-native';

class App extends Component {
  constructor(props){
    super(props);
  }

  state = {
    myState: 'This is a text component, created using state data. It will change or updated on clicking it.'
  }
  
  updateState = () => this.setState({myState: 'The state is updated'})

  render() {
    return (
      <View>
        <Text onPress={this.updateState}>{this.state.myState}</Text>
      </View>
    );
  }

}

const styles = StyleSheet.create({
});

export default App