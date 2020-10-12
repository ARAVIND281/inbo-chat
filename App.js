import React, { Component } from 'react';
import { Text, View } from 'react-native';
import Contacts from './screens/Contacts'
import { createAppContainer, createSwitchNavigator,} from 'react-navigation';

export default function App() {
  return (
    <AppContainer/>
  );
}

const switchNavigator = createSwitchNavigator({

  Contacts:{screen: Contacts},
})

const AppContainer =  createAppContainer(switchNavigator);
