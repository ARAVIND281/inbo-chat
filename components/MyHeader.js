import React, { Component } from 'react';
import { Header, Icon, Badge } from 'react-native-elements';
import { View, Text, StyeSheet, Alert } from 'react-native';

export default class MyHeader extends Component {
    render() {
        return (
            <Header
                leftComponent={<Icon name='bars' type='font-awesome' color='#fff' onPress={() => this.props.navigation.toggleDrawer()} />}
                centerComponent={{ text: this.props.title , style: { color: '#fabf10', fontSize: 20, fontWeight: "bold", } }}
                rightComponent={<Icon name='comments' type='font-awesome' color='#fff' />}
                backgroundColor="#a901ff"
            />

        )
    }

}