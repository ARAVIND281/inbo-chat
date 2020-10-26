import { createStackNavigator } from 'react-navigation-stack';
import GroupScreen from '../screens/GroupScreen'
import GroupChat from '../screens/GroupChat';

export const AppStackNavigator2 = createStackNavigator({
    GroupScreen: {
        screen: GroupScreen,
        navigationOptions: {
            headerShown: false
        }
    },
    GroupChat: {
        screen: GroupChat,
        navigationOptions: {
            headerShown: false
        }
    }
},
    {
        initialRouteName: 'GroupScreen'
    }
);