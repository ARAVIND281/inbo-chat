import React, { Component } from 'react';
import { Text, View, StyleSheet, Image, Dimensions, PermissionsAndroid } from 'react-native';
import Contacts from 'react-native-contacts';
import MyHeader from '../components/MyHeader.js'

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
        this.setState({
          contacts: contacts
        })
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
    //this.getPermissions();
  }

  render() {
    return (
      <View style={{ flex: 1, justifyContent: 'center' }}>

        {this.state.counter < 3 ? (
          <Image
            source={require(
              '../assets/into-1.png'
            )}
            style={{ height: '100%', width: '100%', alignSelf: 'center' }}
          />
        ) : (
            <View style={{ flex: 1 }}>
              <MyHeader title="INBO CHAT" navigation={this.props.navigation} />
              <View style={{ flex: 1 }}>
                <Text style={{ alignSelf: 'center' }}>
                  lo
            </Text>
              </View>
            </View>
          )

        }


      </View>
    );
  }
}
