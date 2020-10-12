import React, { Component } from 'react';
import { Text, View } from 'react-native';
import Contacts from './screens/Contacts';
import { createAppContainer, createSwitchNavigator, } from 'react-navigation';
import WelcomeScreen from './screens/WelcomeScreen'

export default function App() {
  return (
    <AppContainer />
  );
}

const switchNavigator = createSwitchNavigator({
  WelcomeScreen: { screen: WelcomeScreen },
  Contacts: { screen: Contacts },
})

const AppContainer = createAppContainer(switchNavigator);
