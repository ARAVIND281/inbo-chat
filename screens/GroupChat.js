import React, { Component } from 'react';
import {
    Text,
    View,
    StyleSheet,
    Image,
    PermissionsAndroid,
    TouchableOpacity,
    Modal,
    ScrollView,
    Alert,
    FlatList,
} from 'react-native';
import Contacts from 'react-native-contacts';
import MyHeader from '../components/MyHeader.js';
import { Icon, Input, ListItem, Header } from 'react-native-elements';
import { RFValue } from 'react-native-responsive-fontsize';
import firebase from 'firebase'
import db from '../config'

export default class GroupChat extends Component {
    constructor(props) {
        super(props);
        this.state = {
            gName: this.props.navigation.getParam("details")["group_name"],
            gAbout: this.props.navigation.getParam("details")["group_about"],
        }
    }
    render() {
        return (
            <View style={{ flex:1 }}>
                <View style={{ flex: 0.1 }}>
                    <Header
                        leftComponent={
                            <Icon
                                name="arrow-left"
                                type="feather"
                                color="#ffffff"
                                onPress={() => this.props.navigation.goBack()}
                            />
                        }
                        centerComponent={{
                            text: this.state.gName,
                            subtitle:this.state.gAbout,
                            style: {
                                color: "#ffffff",
                                fontSize: RFValue(20),
                                fontWeight: "bold",
                            },
                        }}
                        backgroundColor="#32867d"
                    />
                </View>
                <View style={{flex:0.9}}>
                    <Text>{this.state.gName}</Text>
                    <Text>{this.state.gAbout}</Text>
                </View>
            </View>
        );
    }
}