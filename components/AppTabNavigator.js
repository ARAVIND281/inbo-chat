import React from 'react';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { AppStackNavigator } from './AppStackNavigator';
import { Icon } from "react-native-elements";
import FeedBackScreen from '../screens/FeedBackScreen';
import { AppStackNavigator2 } from './AppStackNavigator2';

export const AppTabNavigator = createBottomTabNavigator ({
  Chat: {
    screen: AppStackNavigator,
    navigationOptions: {
      tabBarIcon: <Icon name="comments" type="font-awesome-5" solid={true}/>,
      tabBarLabel: "Chat",
    }
  },
  Group: {
    screen: AppStackNavigator2,
    navigationOptions: {
      tabBarIcon: <Icon name="users" type="font-awesome-5" solid={true}/>,
      tabBarLabel: "Group",
    }
  },
  FeedBackScreen: {
    screen: FeedBackScreen,
    navigationOptions: {
      tabBarIcon: <Icon name="comment" type="font-awesome-5" solid={true}/>,
      tabBarLabel: "FeedBack",
    }
  }
});