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
import { Icon, Input, ListItem } from 'react-native-elements';
import { RFValue } from 'react-native-responsive-fontsize';
import firebase from 'firebase'
import db from '../config'

export default class ContactsScreen extends Component {
  constructor() {
    super();
    this.state = {
      counter: 0,
      image: '../assets/into-2.png',
      userid: firebase.auth().currentUser.email,
      fContact: '',
      fName: '',
      isFriendModalVisible: false,
      fEmail: '',
      fabout: '',
      docId: '',
      name: '',
      about: '',
      contact: '',
      friends: []
    };
  }


  getPermissions = () => {
    PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
      {
        'title': 'Contacts',
        'message': 'This app would like to view your contacts.',
        'buttonPositive': 'Please accept bare mortal'
      }
    )
      .then(Contacts.getAll)
      .then(contacts => {
        this.setState({
          contacts: contacts
        })
      })
  }

  incrementCounter = () => {
    this.setState({
      counter: this.state.counter + 1,
    });
  };

  createUniqueId() {
    return Math.random().toString(36).substring(7);
  }

  getFriendDetails = async (fContact) => {
    var friendid = this.createUniqueId()
    await db.collection("users")
      .where("contact", "==", fContact)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          var data = doc.data();
          this.setState({
            fEmail: data.email_id,
            fabout: data.about,
            docId: doc.id,
          });
          this.addFriend(this.state.fEmail, this.state.fabout, friendid)
          this.addFriendslist(friendid)
          this.addChat(friendid)
        });
      });
  }

  addFriend = async (email_id, about, id) => {
    await db.collection(this.state.userid + 'friend').add({
      name: this.state.fName,
      contact: this.state.fContact,
      email_id: email_id,
      about: about,
      friendid: id
    })
  }

  getUserDetails = () => {
    db.collection("users")
      .where("email_id", "==", this.state.userid)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          var data = doc.data();
          this.setState({
            name: data.first_name,
            about: data.about,
            contact: data.contact,
            docId: doc.id,
          });
        });
      });
  };

  addFriendslist = async (id) => {
    await db.collection(this.state.fEmail + 'friend').add({
      name: this.state.fContact,
      contact: this.state.fContact,
      email_id: this.state.userid,
      about: this.state.about,
      friendid: id
    })
    Alert.alert('Friend Added Successfully')
  }

  getFriends = () => {
    this.friendsRef = db.collection(this.state.userid + "friend")
      .onSnapshot((snapshot) => {
        var friends = snapshot.docs.map((doc) => doc.data())
        this.setState({
          friends: friends
        });
      })
  }

  addChat = async (id) => {
    await db.collection(id).add({
      massage: 'Thank you for using INBO CHAT',
      sender: 'INBO CHAT',
      reciever: 'INBO CHAT USER',
    })
  }

  keyExtractor = (index) => index.toString()

  renderItem = ({ item, i }) => {
    return (
      <ListItem
        key={i}
        title={item.name}
        subtitle={item.about}
        //titleStyle={{ color: 'black', fontWeight: 'bold' }}
        rightElement={
          <TouchableOpacity style={styles.button}
            onPress={() => {
              this.props.navigation.navigate("RecieverDetails", { "details": item })
            }}
          >
            <Icon name="comments" type="font-awesome-5" solid={true} size={RFValue(35)} />
          </TouchableOpacity>
        }
        leftElement={
          <TouchableOpacity style={styles.button}
            onPress={() => {
            }}
          >
            <Icon name="ellipsis-v" type="font-awesome-5" />
          </TouchableOpacity>
        }
        bottomDivider
      />
    )
  }

  componentDidMount() {
    setInterval(this.incrementCounter, 500);
    this.getUserDetails();
    this.getFriends();
  }

  friendModal = () => {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={this.state.isFriendModalVisible}
      >
        <ScrollView style={styles.scrollview}>
          <View style={styles.signupView}>
            <Text style={styles.signupText}> ADD FRIEND </Text>
          </View>
          <View style={{ flex: 0.95 }}>
            <Text style={styles.label}>Friend's Name</Text>
            <Input
              style={styles.loginBox}
              value={this.state.fName}
              placeholder={"Name"}
              onChangeText={(text) => {
                this.setState({
                  fName: text,
                });
              }}
              leftIcon={
                <Icon
                  name='id-badge'
                  size={RFValue(35)}
                  color='#fabf10'
                  type="font-awesome-5"
                />
              }
            />

            <Text style={styles.label}>Friend's Contact No</Text>

            {this.state.fContact.length !== 10 ? (
              <Input
                style={styles.loginBox}
                placeholder={"Contact"}
                maxLength={10}
                keyboardType={"numeric"}
                onChangeText={(text) => {
                  this.setState({
                    fContact: text,
                  });
                }}
                leftIcon={
                  <Icon
                    name='phone'
                    size={RFValue(35)}
                    color='#fabf10'
                    type="font-awesome-5"
                  />
                }
                errorMessage='Enter a Valid Phone Number'
              />
            ) : (
                <Input
                  style={styles.loginBox}
                  placeholder={"Contact"}
                  maxLength={10}
                  keyboardType={"numeric"}
                  onChangeText={(text) => {
                    this.setState({
                      fContact: text,
                    });
                  }}
                  leftIcon={
                    <Icon
                      name='phone'
                      size={RFValue(35)}
                      color='#fabf10'
                      type="font-awesome-5"
                    />
                  }
                />
              )
            }

          </View>

          <View style={{ flex: 0.2, alignItems: 'center' }}>
            <TouchableOpacity
              style={styles.registerButton}
              onPress={() => {
                this.state.fContact.length !== 10 ? (
                  Alert.alert('Enter a Valid Phone Number')
                ) : (
                    this.getFriendDetails(this.state.fContact),
                    this.setState({
                      isFriendModalVisible: false
                    })
                  )
              }

              }
            >
              <Text style={styles.registerButtonText}>ADD FRIEND</Text>
            </TouchableOpacity>
            <Text
              style={styles.cancelButtonText}
              onPress={() => {
                this.setState({ isFriendModalVisible: false });

              }}
            >
              Cancel</Text>
          </View>
        </ScrollView>
      </Modal >
    );
  }

  render() {
    return (
      <View style={{ flex: 1, justifyContent: 'center' }}>

        {this.state.counter < 1 ? (
          <Image
            source={require(
              '../assets/into-1.png'
            )}
            style={{ height: '100%', width: '100%', alignSelf: 'center' }}
          />
        ) : (
            <View style={{ flex: 1, }}>
              <View style={{ flex: 0.1 }}>
                <MyHeader title="INBO CHAT" navigation={this.props.navigation} />
              </View>
              <View style={{ flex: 0.9, marginTop: RFValue(30) }}>
                <View>
                  {this.friendModal()}
                </View>
                <View>
                  {
                    this.state.friends.length === 0 ? (
                      <Text>You have no Friend</Text>
                    ) : (
                        <FlatList
                          keyExtractor={this.keyExtractor}
                          data={this.state.friends}
                          renderItem={this.renderItem}
                        />
                      )
                  }
                </View>

              </View>
              <View style={{ marginTop: RFValue(30), justifyContent: 'flex-end' }}>
                <TouchableOpacity style={styles.add1}
                  onPress={() => {
                    this.setState({
                      isFriendModalVisible: true
                    })
                  }}>
                  <Icon
                    name='user-plus'
                    type="font-awesome-5"
                    size={RFValue(35)}
                    color='#fabf10'
                  />
                </TouchableOpacity>
              </View>
              <View style={{ justifyContent: 'flex-end' }}>
                <TouchableOpacity style={styles.add1}>
                  <Icon
                    name='users'
                    type="font-awesome-5"
                    size={RFValue(35)}
                    color='#fabf10'
                  />
                </TouchableOpacity>
              </View>
            </View>
          )

        }


      </View>
    );
  }
}

const styles = StyleSheet.create({
  add1: {
    width: RFValue(65),
    height: RFValue(65),
    marginTop: RFValue(20),
    justifyContent: "center",
    alignItems: "center",
    borderRadius: RFValue(100),
    backgroundColor: "#a901ff",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.44,
    shadowRadius: 10.32,
    elevation: 16,
    marginTop: RFValue(10),
  },
  scrollview: {
    flex: 1,
    backgroundColor: "#fff"
  },
  signupView: {
    flex: 0.05,
    justifyContent: 'center',
    alignItems: 'center'
  },
  signupText: {
    fontSize: RFValue(20),
    fontWeight: "bold",
    color: "#32867d"
  },
  label: {
    fontSize: RFValue(17),
    color: "#717D7E",
    fontWeight: 'bold',
    paddingLeft: RFValue(10),
    marginLeft: RFValue(20)
  },
  registerButton: {
    width: "75%",
    height: RFValue(50),
    marginTop: RFValue(20),
    justifyContent: "center",
    alignItems: "center",
    borderRadius: RFValue(3),
    backgroundColor: "#32867d",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.44,
    shadowRadius: 10.32,
    elevation: 16,
    marginTop: RFValue(10),
  },
  registerButtonText: {
    fontSize: RFValue(23),
    fontWeight: "bold",
    color: "#fff",
  },
  cancelButtonText: {
    fontSize: RFValue(20),
    fontWeight: 'bold',
    color: "#32867d",
    marginTop: RFValue(10)
  },
})