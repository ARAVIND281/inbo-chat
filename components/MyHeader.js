import React, { Component } from 'react';
import { Header, Icon, } from 'react-native-elements';

export default class MyHeader extends Component {
    render() {
        return (
            <Header
                leftComponent={<Icon name='bars' type='font-awesome-5' color='#fff' solid={true} onPress={() => this.props.navigation.toggleDrawer()} />}
                centerComponent={{ text: this.props.title, style: { color: '#fabf10', fontSize: 20, fontWeight: "bold", } }}
                rightComponent={<Icon name='comments' type='font-awesome-5' color='#fff' />}
                backgroundColor="#a901ff"
            />

        )
    }

}