import { createStackNavigator } from 'react-navigation-stack';
import BookDonateScreen from '../screens/Contacts';
import RecieverDetailsScreen from '../screens/ChatScreen';

export const AppStackNavigator = createStackNavigator({
  BookDonateList: {
    screen: BookDonateScreen,
    navigationOptions: {
      headerShown: false
    }
  },
  RecieverDetails: {
    screen: RecieverDetailsScreen,
    navigationOptions: {
      headerShown: false
    }
  }
},
  {
    initialRouteName: 'BookDonateList'
  }
);