import React, { Component } from 'react';
import {
  View, Text, StyleSheet, Image, TouchableOpacity, Modal, ActivityIndicator
} from 'react-native';
import { render } from 'react-dom'
import { AntDesign } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { TextInput } from 'react-native-gesture-handler';
import { Feather } from '@expo/vector-icons';
import firestore from './firebase/Firestore'
import storage from './firebase/Storage';
import * as ImagePicker from 'expo-image-picker';

import { connect } from 'react-redux';
import { saveProfile } from './actions/profile';
class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      avatar: this.props.profile.avatar,
      name: this.props.profile.name,
      caption: this.props.profile.caption,
      fb: this.props.profile.fb,
      ig: this.props.profile.ig,
      line: this.props.profile.line,
      loading: false,
      loadingOut: false
    };
  }
  componentDidMount() {
    this.setState({ loadingOut: false })
  }
  componentWillUnmount() {
    this.setState({ loadingOut: false })
    console.log("componentWillUnmount logOut")
  }
  onSignOutSuccess = () => {
    console.log('Sign Out Success');
  }
  unsuccess = (error) => {
    console.log(error)
  }
  updateAccountSuccess = () => {
    console.log("update account success")
    let user = {
      id: this.props.profile.id,
      avatar: this.state.avatar,
      name: this.state.name,
      caption: this.state.caption,
      fb: this.state.fb,
      ig: this.state.ig,
      line: this.state.line,
    }
    this.props.save(user);
    this.setState({ loading: false })
    this.setState({ modalVisible: false });
  }
  updateAccount = async () => {
    if (this.state.avatar === this.props.profile.avatar) {
      this.setState({ loading: true })
      let user = {
        avatar: this.props.profile.avatar,
        name: this.state.name,
        caption: this.state.caption,
        fb: this.state.fb,
        ig: this.state.ig,
        line: this.state.line,
      }
      await firestore.updateAccountByID(user, this.props.profile.id, this.updateAccountSuccess, this.unsuccess)
    }
    else {
      console.log('upload........')
      this.setState({ loading: true })
      let keys = Math.random().toString();
      await storage.uploadProfileToFirebase(this.state.avatar, keys, this.uploadSuccess, this.uploadError, this.onUpload);
    }
    //this.setState({ modalVisible: false });
  }
  uploadSuccess = async (uri) => {
    let user = {
      avatar: uri,
      name: this.state.name,
      caption: this.state.caption,
      fb: this.state.fb,
      ig: this.state.ig,
      line: this.state.line,
    }
    await firestore.updateAccountByID(user, this.props.profile.id, this.updateAccountSuccess, this.unsuccess)
  }
  onUpload = (progress) => {
    console.log(progress);
  }

  uploadError = (error) => {
    console.log(error);
  }
  onLogout = () => {
    this.setState({ loadingOut: true })
    firestore.signOut(this.onSignOutSuccess, this.onReject);
  }
  setModalVisible = (visible) => {
    this.setState({ avatar: this.props.profile.avatar })
    this.setState({ name: this.props.profile.name })
    this.setState({ caption: this.props.profile.caption })
    this.setState({ fb: this.props.profile.fb })
    this.setState({ ig: this.props.profile.ig })
    this.setState({ line: this.props.profile.line })
    this.setState({ modalVisible: visible });
  }
  pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      quality: 1
    });

    if (!result.cancelled) {
      console.log("image")
      console.log(result.uri);
      this.setState({ avatar: result.uri });
    }
  }
  renderButtonOut() {
    if (this.state.loadingOut) {
      return (<ActivityIndicator size='large' color='black' />);
    }
    else {
      return (
        <View style={{ flexDirection: 'column', flex: 1, justifyContent: 'space-evenly', alignItems: 'center' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <MaterialIcons name="description" size={28} color="black" />
            <Text style={styles.txtDescription}>  {this.props.profile.caption}</Text>
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <AntDesign name="facebook-square" size={24} color="black" />
            <Text style={styles.txtDescription}>  {this.props.profile.fb}</Text>
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <AntDesign name="instagram" size={24} color="black" />
            <Text style={styles.txtDescription}>   {this.props.profile.ig}</Text>
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <FontAwesome5 name="line" size={24} color="black" />
            <Text style={styles.txtDescription}>   {this.props.profile.line}</Text>
          </View>
        </View>
      )
    }
  }
  renderButton() {
    if (this.state.loading) {
      return (<ActivityIndicator size='large' color='black' />);
    }
    else {
      return (<View style={styles.modalMid}>
        <View style={styles.modalMidLeft}>
          <Feather name="user" size={24} color="black" />
        </View>
        <View style={styles.modalMidRight}>
          <TextInput style={styles.textInput} value={this.state.name} onChangeText={(text) => this.setState({ name: text })}></TextInput>
        </View>
      </View>);
    }
  }
  render(props) {
    const { navigation } = this.props;
    const { modalVisible } = this.state;
    return (
      <View style={{ flex: 1, backgroundColor: "#E5E5E5" }}>

        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            Alert.alert("Modal has been closed.");
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <TouchableOpacity onPress={this.pickImage}>
                <View style={styles.profile}>
                  <Image style={styles.image} source={{ uri: this.state.avatar }} />
                </View>
              </TouchableOpacity>
              <View style={{ height: 2, backgroundColor: 'gray', width: 300, margin: 20 }}></View>
              {this.renderButton()}

              <View style={styles.modalMid}>
                <View style={styles.modalMidLeft}>
                  <MaterialIcons name="description" size={28} color="black" />
                </View>
                <View style={styles.modalMidRight}>
                  <TextInput style={styles.textInput} value={this.state.caption} onChangeText={(text) => this.setState({ caption: text })}></TextInput>
                </View>
              </View>

              <View style={styles.modalMid}>
                <View style={styles.modalMidLeft}>
                  <AntDesign name="facebook-square" size={24} color="black" />
                </View>
                <View style={styles.modalMidRight}>
                  <TextInput style={styles.textInput} value={this.state.fb} onChangeText={(text) => this.setState({ fb: text })}></TextInput>
                </View>
              </View>

              <View style={styles.modalMid}>
                <View style={styles.modalMidLeft}>
                  <AntDesign name="instagram" size={24} color="black" />
                </View>
                <View style={styles.modalMidRight}>
                  <TextInput style={styles.textInput} value={this.state.ig} onChangeText={(text) => this.setState({ ig: text })}></TextInput>
                </View>
              </View>

              <View style={styles.modalMid}>
                <View style={styles.modalMidLeft}>
                  <FontAwesome5 name="line" size={24} color="black" />
                </View>
                <View style={styles.modalMidRight}>
                  <TextInput style={styles.textInput} value={this.state.line} onChangeText={(text) => this.setState({ line: text })}></TextInput>
                </View>
              </View>
              <View style={{ height: 2, backgroundColor: 'gray', width: 300, margin: 20 }}></View>

              <View style={styles.modalFooter}>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                  <TouchableOpacity
                    onPress={() => {
                      this.setModalVisible(!modalVisible);
                    }}
                  >
                    <Text style={{ fontSize: 18, fontFamily: 'kanitRegular' }}>ยกเลิก</Text>
                  </TouchableOpacity>
                </View>

                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                  <TouchableOpacity
                    onPress={this.updateAccount}
                  >
                    <Text style={{ fontSize: 18, fontFamily: 'kanitRegular', color: '#6F0CEE' }}>ยืนยัน</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </Modal>

        {/*================ close modal ==================*/}

        <View style={styles.header}>
          <View style={styles.profile}>
            <Image style={styles.image} source={{ uri: this.props.profile.avatar }} />
          </View>
        </View>
        <View style={styles.mid}>
          <Text style={styles.name}>{this.props.profile.name}</Text>
          {this.renderButtonOut()}
        </View>
        <View style={styles.footer}>
          <View >
            <TouchableOpacity onPress={() => { this.setModalVisible(true); }}>
              <View style={styles.editProfile}>
                <AntDesign name="setting" size={24} color="black" />
                <Text style={{ fontSize: 16, fontFamily: 'kanitLight' }}> ตั้งค่าโปรไฟล์</Text>
              </View>
            </TouchableOpacity>
          </View>
          <View>
            <TouchableOpacity onPress={this.onLogout}>
              <View style={styles.logOut}>
                <Ionicons name="ios-log-out" size={24} color="white" />
                <Text style={{ fontSize: 16, color: 'white', fontFamily: 'kanitLight' }}> ออกจากระบบ</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

      </View>
    );
  }
}
const styles = StyleSheet.create({
  header: {
    flex: 1,
    justifyContent: "center",
    alignItems: 'center'
  },
  mid: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-evenly'
  },
  footer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  profile: {
    width: 150,
    height: 150,
    backgroundColor: 'gray',
    borderRadius: 100
  },
  image: {
    width: 150,
    height: 150,
    resizeMode: 'cover',
    //alignSelf:'center',
    //borderRadius:50
    borderRadius: 100,
  },
  name: {
    fontSize: 24,
    fontFamily: 'kanitSemiBold'
  },
  txtDescription: {
    fontSize: 18,
    fontFamily: 'kanitRegular'
  },
  editProfile: {
    backgroundColor: 'white',
    borderRadius: 7,
    borderColor: 'black',
    height: 35,
    padding: 5,
    borderWidth: 1,
    flexDirection: 'row',
    marginTop: 5
  },
  logOut: {
    backgroundColor: 'black',
    borderRadius: 7,
    borderColor: 'white',
    height: 35,
    padding: 5,
    borderWidth: 1,
    flexDirection: 'row',
    marginTop: 5
  },



  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10
  },
  modalView: {
    margin: 10,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    width: 350,
    height: 570
  },
  modalMid: {
    flexDirection: 'row'
  },
  modalMidLeft: {
    width: "10%",
    justifyContent: 'center'
  },
  modalMidRight: {
    width: "90%",
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E5E5E5',
    margin: 5
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'kanitLight',
    textAlign: 'center'
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-evenly'
  }

});

const mapStateToProps = (state) => {
  return {
    profile: state.profileReducer.profile
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    save: (profile) => dispatch(saveProfile(profile)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Profile);