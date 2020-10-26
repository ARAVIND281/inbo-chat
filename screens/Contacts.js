import React, { Component } from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Modal,
  ScrollView,
  Alert,
  FlatList,
} from 'react-native';
import MyHeader from '../components/MyHeader.js';
import { Icon, Input, ListItem, Avatar, Badge } from 'react-native-elements';
import { RFValue } from 'react-native-responsive-fontsize';
import firebase from 'firebase'
import db from '../config'
import * as ImagePicker from "expo-image-picker";

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
      friends: [],
      isGroupModal: false,
      gCode: '',
      gName: '',
      gAbout: 'INBO CHAT',
      jgName: '',
      jgAbout: '',
      jgCode: '',
      gdocId: '',
      image: '#',
      isSelectImageModal: false,
      refgCode: '',
      groupValue: 'fail',
      friendValue: 'fail',
      RefCode: '#',
      RefName: '',
      Refcontact: '#'
    };
  }

  selectPicture = async () => {
    const { cancelled, uri } = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!cancelled) {
      this.uploadImage(uri, this.state.refgCode);
    }
  };

  uploadImage = async (uri, imageName) => {
    var response = await fetch(uri);
    var blob = await response.blob();

    var ref = firebase
      .storage()
      .ref()
      .child("group_profiles/" + imageName);

    return ref.put(blob).then((response) => {
      this.fetchImage(imageName);
    });
  };

  fetchImage = (imageName) => {
    var storageRef = firebase
      .storage()
      .ref()
      .child("group_profiles/" + imageName);

    storageRef
      .getDownloadURL()
      .then((url) => {
        this.setState({ image: url });
      })
      .catch((error) => {
        this.setState({ image: "#" });
        Alert.alert(error)
      });
  };

  incrementCounter = () => {
    this.setState({
      counter: this.state.counter + 1,
    });
  };

  createUniqueId() {
    return Math.random().toString(36).substring(7);
  }

  getFriendDetails = async (fContact) => {
    db.collection(this.state.userid + 'friend')
      .where("contact", "==", fContact)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          var data = doc.data();
          this.setState({
            Refcontact: data.contact,
          });
        });

        if (fContact === this.state.Refcontact) {
          Alert.alert('Your already in ' + this.state.Refcontact + ' friend')
        }
        else if (fContact !== this.state.Refcontact) {
          var friendid = this.createUniqueId()
          db.collection("users")
            .where("contact", "==", fContact)
            .get()
            .then((snapshot) => {
              snapshot.forEach((doc) => {
                var data = doc.data();
                this.setState({
                  fEmail: data.email_id,
                  fabout: data.about,
                  docId: doc.id,
                  friendValue: 'pass',
                });
                this.addFriend(this.state.fEmail, this.state.fabout, friendid),
                  this.addFriendslist(friendid)
              });
            });
        }
        else if (this.state.friendValue === 'fail') {
          alert('This number is not registered in the INBO CHAT.Ask your friend to register in the APP')
        }
      })
  }

  addFriend = async (email_id, about, id) => {
    await db.collection(this.state.userid + 'friend')
      .doc(id)
      .set({
        name: this.state.fName,
        contact: this.state.fContact,
        email_id: email_id,
        about: about,
        friendid: id,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        state: 'read'
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
    await db.collection(this.state.fEmail + 'friend')
      .doc(id)
      .set({
        name: this.state.fContact,
        contact: this.state.fContact,
        email_id: this.state.userid,
        about: this.state.about,
        friendid: id,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        state: 'read',
      })
    Alert.alert('Friend Added Successfully')
  }

  IconWithBadge = () => {
    return (
      <View>
        <Icon name="comments" type="font-awesome-5" solid={true} size={RFValue(35)}
          onPress={() => {
            this.props.navigation.navigate("RecieverDetails", { "details": item })
          }}
        />
        <Badge
          status="success" containerStyle={{ position: 'absolute', top: -4, right: -4 }} />
      </View>
    )
  }

  getFriends = () => {
    this.friendsRef = db.collection(this.state.userid + "friend")
      .orderBy('createdAt', 'desc')
      .onSnapshot((snapshot) => {
        var friends = snapshot.docs.map((doc) => doc.data())
        this.setState({
          friends: friends
        });
      })
  }

  keyExtractor = (index) => index.toString()

  renderItem = ({ item, i }) => {
    return (
      <ListItem
        key={i}
        title={
          <TouchableOpacity
            onPress={() => {
              this.props.navigation.navigate("RecieverDetails", { "details": item })
            }}
          >
            <Text
              style={{
                fontSize: RFValue(20)
              }}
            >{item.name}</Text>
          </TouchableOpacity>}
        subtitle={
          <TouchableOpacity
            onPress={() => {
              this.props.navigation.navigate("RecieverDetails", { "details": item })
            }}
          >
            <Text>{item.about}</Text>
          </TouchableOpacity>
        }
        //titleStyle={{ color: 'black', fontWeight: 'bold' }}
        rightElement={
          <TouchableOpacity
            onPress={() => {
              this.props.navigation.navigate("RecieverDetails", { "details": item })
            }}
          >
            {item.state === 'unread' ? (
              <View>
                <Icon name="comments" type="font-awesome-5" solid={true} size={RFValue(35)} />
                <Badge
                  status="success"
                  containerStyle={{ position: 'absolute', top: -4, right: -4 }}
                  value />
              </View>
            ) : (
                <Icon name="comments" type="font-awesome-5" solid={true} size={RFValue(35)} />

              )

            }

          </TouchableOpacity>
        }
        bottomDivider
      />
    )
  }
  addGrope = async (gName, gAbout, id) => {
    await db.collection(id + 'groupabout').add({
      name: gName,
      about: gAbout,
      created_by: this.state.userid,
      grope_code: id
    }),
      this.addGropeMember(id),
      this.addUserGroup(gName, gAbout, id),
      this.addinGroup(gName, gAbout, id),
      Alert.alert('GROUP ADDED ')
  }

  addinGroup = async (gName, gAbout, id) => {
    await db.collection('groups')
      .doc(id)
      .set({
        name: gName,
        about: gAbout,
        created_by: this.state.userid,
        grope_code: id
      })
  }

  addGropeMember = async (gName) => {
    await db.collection(gName + 'groupmember')
      .doc(this.state.userid)
      .set({
        name: this.state.name,
        contact: this.state.contact,
        about: this.state.about,
        userid: this.state.userid,
        grope_code: gName,
        Memberstate: 'admin'
      })
  }

  addUserGroup = async (gName, gAbout, id) => {
    await db.collection(this.state.userid + "group")
      .doc(this.state.userid)
      .set({
        group_name: gName,
        group_about: gAbout,
        group_code: id
      })
  }

  joinGroup = (jgCode) => {
    db.collection(this.state.userid + 'group')
      .where("group_code", "==", jgCode)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          var data = doc.data();
          this.setState({
            RefCode: data.group_code,
            RefName: data.group_name
          });
        });

        if (jgCode === this.state.RefCode) {
          Alert.alert('Your already in ' + this.state.RefName + ' group')
        } else if (jgCode !== this.state.RefCode) {
          db.collection('groups')
            .where("grope_code", "==", jgCode)
            .get()
            .then((snapshot) => {
              snapshot.forEach((doc) => {
                var data = doc.data();
                this.setState({
                  jgName: data.name,
                  jgAbout: data.about,
                  groupValue: 'pass',
                  gdocId: doc.id,
                });
                this.addinUserGroup(this.state.jgName, this.state.jgAbout, jgCode),
                  this.addinGroupMember(jgCode),
                  Alert.alert('joined Group Successfull')
              });
            });
        } else if (this.state.groupValue !== 'pass') {
          Alert.alert('Invalid Grope Code')
        }
      });
  }

  addinUserGroup = async (jgName, jgAbout, id) => {
    await db.collection(this.state.userid + "group")
      .doc(id)
      .set({
        group_name: jgName,
        group_about: jgAbout,
        group_code: id
      })
  }

  addinGroupMember = async (jgName) => {
    await db.collection(jgName + 'groupmember')
      .doc(this.state.userid)
      .set({
        name: this.state.name,
        contact: this.state.contact,
        about: this.state.about,
        userid: this.state.userid,
        Memberstate: 'member'
      })
  }

  componentDidMount() {
    setInterval(this.incrementCounter, 1000);
    this.getUserDetails();
    this.getFriends();
  }

  selectImageModal = () => {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={this.state.isSelectImageModal}
      >
        <ScrollView style={styles.scrollview}>
          <View style={styles.signupView}>
            <Text style={styles.signupText}>SELECT GROUP ICON</Text>
          </View>
          <View
            style={{
              flex: 0.3,
              justifyContent: "center",
              alignItems: "center",
              marginTop: 20
            }}
          >

            <Avatar
              rounded
              source={{
                uri: this.state.image,
              }}
              size={RFValue(200)}
              onPress={() => this.selectPicture()}
              //title={this.state.gName}
              showEditButton
            />


            <View style={{ marginTop: -30, alignItems: 'flex-end', marginLeft: RFValue(133) }}>
              <Icon name='camera-retro' type='font-awesome-5' color="#fabf10" solid={true} />
            </View>

            <Text
              style={{
                fontWeight: "300",
                fontSize: RFValue(20),
                color: "#000",
                padding: RFValue(10),
              }}
            >
              {this.state.gName}
            </Text>
          </View>
          <View style={{ flex: 0.2, alignItems: 'center' }}>
            <TouchableOpacity
              style={styles.registerButton}
              onPress={() => {
                {
                  this.state.image !== '#' ? (
                    this.addGrope(this.state.gName, this.state.gAbout, this.state.refgCode),
                    this.setState({
                      isSelectImageModal: false
                    })
                  ) : (
                      Alert.alert('SELECT IMAGE I you selected iMAGE Please till Image apper')
                    )
                }
              }

              }
            >
              <Text style={styles.registerButtonText}>CREATE GROUP</Text>
            </TouchableOpacity>
            <Text
              style={styles.cancelButtonText}
              onPress={() => {
                this.setState({ isSelectImageModal: false });

              }}
            >
              Cancel</Text>
          </View>
        </ScrollView>
      </Modal>
    )
  }

  groupModal = () => {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={this.state.isGroupModal}
      >
        <ScrollView style={styles.scrollview}>
          <View style={styles.signupView}>
            <Text style={styles.signupText}> JOIN GROUP </Text>
          </View>
          <View style={{ flex: 0.95 }}>
            <Text style={styles.label}>Group Code</Text>
            {this.state.jgCode.length <= 4 ? (
              <Input
                style={styles.loginBox}
                maxLength={6}
                onChangeText={(text) => {
                  this.setState({
                    jgCode: text,
                  });
                }}
                leftIcon={
                  <Icon
                    name='key'
                    size={RFValue(35)}
                    color='#fabf10'
                    type="font-awesome-5"
                  />
                }
                errorMessage='Enter a Valid Group Code'
              />
            ) : (
                <Input
                  style={styles.loginBox}
                  maxLength={6}
                  onChangeText={(text) => {
                    this.setState({
                      jgCode: text,
                    });
                  }}
                  leftIcon={
                    <Icon
                      name='code-commit'
                      size={RFValue(35)}
                      color='#fabf10'
                      type="font-awesome-5"
                    />
                  }
                />
              )
            }
            <View style={{ alignItems: 'center' }}>

              <TouchableOpacity
                style={styles.registerButton}
                onPress={() => {
                  this.state.jgCode.length <= 4 ? (
                    Alert.alert('Enter a Valid Group Code')
                  ) : (
                      this.joinGroup(this.state.jgCode),
                      this.setState({
                        isGroupModal: false
                      })
                    )
                }

                }
              >
                <Text style={styles.registerButtonText}>JOIN GROUP</Text>
              </TouchableOpacity>
            </View>

            <View style={[styles.signupView, { marginTop: RFValue(10) }]}>
              <Text style={styles.signupText}> ADD GROUP </Text>
            </View>
            <Text style={styles.label}>Group Name</Text>
            <Input
              style={styles.loginBox}
              value={this.state.gName}
              placeholder={"Name"}
              onChangeText={(text) => {
                this.setState({
                  gName: text,
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

            <Text style={styles.label}>About Group</Text>
            <Input
              style={styles.loginBox}
              value={this.state.gAbout}
              placeholder={"About"}
              onChangeText={(text) => {
                this.setState({
                  gAbout: text,
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

          </View>

          <View style={{ flex: 0.2, alignItems: 'center' }}>
            <TouchableOpacity
              style={styles.registerButton}
              onPress={() => {
                var id = this.createUniqueId()
                {
                  this.state.gName.length !== 0 ? (
                    this.setState({
                      isGroupModal: false,
                      isSelectImageModal: true,
                      refgCode: id
                    })
                  ) : (
                      Alert.alert('Please type your group Name')
                    )
                }
              }
              }
            >
              <Text style={styles.registerButtonText}>ADD GROUP</Text>
            </TouchableOpacity>
            <Text
              style={styles.cancelButtonText}
              onPress={() => {
                this.setState({ isGroupModal: false });

              }}
            >
              Cancel</Text>
          </View>
        </ScrollView>
      </Modal >
    );
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
                  {this.groupModal()}
                  {this.selectImageModal()}
                </View>
                <View>
                  {
                    this.state.friends.length === 0 ? (
                      <View style={styles.imageView}>
                        <Image
                          source={require('../assets/Notification.png')} />
                        <Text style={{ fontSize: 25 }}>You have no Friend</Text>
                      </View>
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
              <View>
                <View style={{ marginTop: RFValue(-150) }}>
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
                <View style={{ marginTop: RFValue(5) }}>
                  <TouchableOpacity style={styles.add1}
                    onPress={() => {
                      this.setState({
                        isGroupModal: true
                      })
                    }}
                  >
                    <Icon
                      name='users'
                      type="font-awesome-5"
                      size={RFValue(35)}
                      color='#fabf10'
                    />
                  </TouchableOpacity>
                </View>
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
  imageView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: RFValue(250)
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