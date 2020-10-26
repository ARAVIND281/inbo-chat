import React, { Component } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
} from "react-native";
import { DrawerItems } from "react-navigation-drawer";
import firebase from "firebase";
import db from "../config";
import { Icon } from "react-native-elements";
import { RFValue } from "react-native-responsive-fontsize";

export default class SideBar extends Component {
  state = {
    userId: firebase.auth().currentUser.email,
    image: "#",
    name: "",
    docId: "",
  };


  fetchImage = (imageName) => {
    var storageRef = firebase
      .storage()
      .ref()
      .child("user_profiles/" + imageName);

    storageRef
      .getDownloadURL()
      .then((url) => {
        this.setState({ image: url });
      })
      .catch((error) => {
        this.setState({ image: "#" });
      });
  };

  getUserProfile() {
    db.collection("users")
      .where("email_id", "==", this.state.userId)
      .onSnapshot((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          this.setState({
            name: doc.data().first_name + " " + doc.data().last_name,
            about: doc.data().about,
            docId: doc.id,
            image: doc.data().image,
          });
        });
      });
  }

  componentDidMount() {
    this.fetchImage(this.state.userId);
    this.getUserProfile();
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <View
          style={{
            flex: 0.2,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#a901ff",
          }}
        >

          <Text
            style={{
              fontWeight: "300",
              fontSize: RFValue(20),
              color: "#fff",
              padding: RFValue(10),
            }}
          >
            {this.state.name}
          </Text>
          <Text
            style={{
              fontWeight: "300",
              fontSize: RFValue(16),
              color: "#aaaaaa",
              padding: RFValue(5),
            }}
          >
            {this.state.about}
          </Text>
        </View>
        <View style={{ flex: 0.7 }}>
          <DrawerItems {...this.props} />
        </View>
        <View style={{ flex: 0.1 }}>
          <TouchableOpacity
            style={{
              flexDirection: "row",
              width: "100%",
              height: "100%",
            }}
            onPress={() => {
              this.props.navigation.navigate("WelcomeScreen");
              firebase.auth().signOut();
            }}
          >
            <Icon
              name="sign-out-alt"
              type="font-awesome-5"
              size={RFValue(35)}
              iconStyle={{ paddingLeft: RFValue(10) }}
            />

            <Text
              style={{
                fontSize: RFValue(15),
                fontWeight: "bold",
                marginLeft: RFValue(30),
              }}
            >
              Log Out
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

var styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  drawerItemsContainer: {
    flex: 0.8,
  },
  logOutContainer: {
    flex: 0.2,
    justifyContent: "flex-end",
    paddingBottom: 30,
    flexDirection: "row",
  },
  logOutButton: {
    height: 30,
    width: "85%",
    justifyContent: "center",
    padding: 10,
  },
  imageContainer: {
    flex: 0.75,
    width: "40%",
    height: "20%",
    marginLeft: 20,
    marginTop: 30,
    borderRadius: 40,
  },
  logOutText: {
    fontSize: 30,
    fontWeight: "bold",
  },
});