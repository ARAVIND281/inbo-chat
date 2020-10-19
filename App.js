import React, { Component } from 'react';
import { Text, View } from 'react-native';
import { AppTabNavigator } from './components/AppTabNavigator'
import { createAppContainer, createSwitchNavigator, } from 'react-navigation';
import WelcomeScreen from './screens/WelcomeScreen';
import { AppDrawerNavigator } from './components/AppDrawerNavigator';

export default function App() {
  return (
    <AppContainer />
  );
}

const switchNavigator = createSwitchNavigator({
  WelcomeScreen: { screen: WelcomeScreen },
  Drawer: { screen: AppDrawerNavigator },
  Bottomtab:{screen:AppTabNavigator},
})

const AppContainer = createAppContainer(switchNavigator);
