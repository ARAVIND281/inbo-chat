import React from 'react';
import {createDrawerNavigator} from 'react-navigation-drawer';
import { AppTabNavigator } from './AppTabNavigator'
import SideBar  from './SideBar';
import SettingScreen from '../screens/SettingScreen';
import Chat from '../screens/Contacts'

import {Icon} from 'react-native-elements';

export const AppDrawerNavigator = createDrawerNavigator({
    Chat : {
    screen : Chat,
    navigationOptions:{
      drawerIcon : <Icon name="stack-exchange" type ="font-awesome" />,
      drawerLabel : "Chat"
    }
  },
  Setting : {
    screen : SettingScreen,
    navigationOptions:{
      drawerIcon : <Icon name="user-cog" type ="fontawesome5" />,
      drawerLabel : "Setting"
    }
  }
},
  {
    contentComponent:SideBar
  },
  {
    initialRouteName : 'Chat'
  })