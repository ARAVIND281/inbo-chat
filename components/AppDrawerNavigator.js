import React from 'react';
import { createDrawerNavigator } from 'react-navigation-drawer';
import SideBar from './SideBar';
import SettingScreen from '../screens/SettingScreen';
import { AppTabNavigator } from './AppTabNavigator';
import { Icon } from 'react-native-elements';

export const AppDrawerNavigator = createDrawerNavigator({
  Home: {
    screen: AppTabNavigator,
    navigationOptions: {
      drawerIcon: <Icon name="home" type="font-awesome" />
    }
  },
  Setting: {
    screen: SettingScreen,
    navigationOptions: {
      drawerIcon: <Icon name="user-circle" type="font-awesome-5" solid={true} />,
      drawerLabel: "Profile"
    }
  }
},
  {
    contentComponent: SideBar
  },
  {
    initialRouteName: 'Chat'
  })