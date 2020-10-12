import React, { Component } from 'react';
import { Text, View, StyleSheet, Image, Dimensions, PermissionsAndroid } from 'react-native';
import Contacts from 'react-native-contacts';

export default class App extends Component {
  constructor() {
    super();
    this.state = {
      counter: 0,
      image: '../assets/into-2.png',
      contacts: []
    };
  }


  getPermissions = () => {
    PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
      {
        'title': 'Contacts',
        'message': 'This app would like to view your contacts.',
        'buttonPositive': 'Please accept bare mortal'
      }
    )
      .then(Contacts.getAll)
      .then(contacts => {

      })
  }

  incrementCounter = () => {
    this.setState({
      counter: this.state.counter + 1,
    });
  };

  getDimensions = () => {
    if (Dimensions.get('window').width < Dimensions.get('window').height) {
      this.setState({
        image: '../assets/into-2.png'
      })
    } else {
      this.setState({
        image: '../assets/into-1.png'
      })
    }
  }

  componentDidMount() {
    this.getDimensions();
    setInterval(this.incrementCounter, 1000);
  }

  render() {
    return (
      <View style={{ flex: 1, justifyContent: 'center' }}>
        {this.state.counter < 10 ? (
          <Image
            source={require(this.state.image)}
            style={{ height: 50, width: 50, alignSelf: 'center' }}
          />
        ) : (
            <Text style={{ alignSelf: 'center' }}>hi</Text>
          )

        }


      </View>
    );
  }
}
