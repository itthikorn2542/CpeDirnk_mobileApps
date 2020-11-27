import moment from 'moment';
import React, { Component } from 'react';
import {
  View, Text, StyleSheet, Image, FlatList, TouchableOpacity, Modal,Alert,ActivityIndicator
} from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { connect } from 'react-redux';
import { saveProfile } from './actions/profile';
import firestore from './firebase/Firestore'

class FriendList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      accountInStore: [],
      modalId: null,
      modalAvatar: null,
      modalName: null,
      modalCaption: null,
      modalFb: null,
      modalIg: null,
      modalLine: null,
      Friend: [],
      member:null,
      loading: false

    };
  }
  async componentDidMount() {
    console.log('getaccountInStore')
    this.setState({loading:true})
    await firestore.getFriend(this.props.profile.id, this.getFriendSuccess, this.getUnsuccess);
    await firestore.getAccountByStatus(this.getSuccess, this.getUnsuccess)
  }
  // componentWillUnmount() {
  //   console.log("componentWillUnmount")
  // }
  addFriend=async(id)=>{
    let data={}
    let members=[]
    members.push(this.props.profile.id)
    members.push(id)
    data.member=members
    this.setState({member:id})
    await firestore.addGroup(data,this.addFriendSuccess,this.getUnsuccess)
    
  }
  addFriendSuccess=(docRef)=>{
    console.log("Add friend Success")
    this.setState({Friend:this.state.Friend.concat(this.state.member)});
  }
  DeleteUser=async()=>{
    this.setState({loading:true})
    console.log("updateStatusByID1")
    let count=this.state.accountInStore.length
    for(let i=0;i<count;i++){
      await firestore.updateStatusByID(this.state.accountInStore[i].id,this.DeleteSuccess,this.getUnsuccess)
    }
    this.setState({loading:false})
    this.setState({accountInStore:[]})
  }
  DeleteSuccess=()=>{
    console.log("UpdateSuccess")
  }
  checkDeleteUser=()=>{
    Alert.alert(
      "Delete User",
      "คุณต้องการลบลูกค้าออกจากร้านใช่หรือใช่หรือไม่",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        { text: "OK", onPress: () => this.DeleteUser() }
      ],
      { cancelable: false }
    );
  }
  preAddFriend=(id)=>{
        Alert.alert(
        "Add Friend",
        "คุณต้องการเพิ่มเพื่อนใช่หรือไม่",
        [
          {
            text: "Cancel",
            onPress: () => console.log("Cancel Pressed"),
            style: "cancel"
          },
          { text: "OK", onPress: () => this.addFriend(id) }
        ],
        { cancelable: false }
      );
  }
  getFriendSuccess = async (querySnapshot) => {
    console.log('getfriend')
    if (querySnapshot.docs.length > 0) {
      var friend = []
      var myID = this.props.profile.id;
      querySnapshot.forEach(function (doc) {
        let friendID = null
        if (doc.data().member[0] == myID) {
          friendID = doc.data().member[1];
        } else {
          friendID = doc.data().member[0];
        }
        friend.push(friendID);
      });
      this.setState({ Friend: friend })
    }
  }
  getSuccess = (querySnapshot) => {
    this.setState({ accountInStore: [] });
    var accounts = [];
    querySnapshot.forEach(function (doc) {
      let account = doc.data();
      account.id = doc.id;
      accounts = accounts.concat(account);
    });
    console.log("getaccountInStoreSuccess")
    this.setState({ accountInStore: accounts })
    this.setState({loading:false})
  }
  getAccountSuccess = (doc) => {
    this.setState({ modalAvatar: doc.data().avatar })
    this.setState({ modalName: doc.data().name })
    this.setState({ modalCaption: doc.data().caption })
    this.setState({ modalFb: doc.data().fb })
    this.setState({ modalIg: doc.data().ig })
    this.setState({ modalLine: doc.data().line })
  }
  getUnsuccess = (error) => {
    console.log(error)
    this.setState({loading:false})
  }
  getModal = async (id) => {
    console.log('get modal')
    console.log(id)
    await firestore.getAccountWithID(id, this.getAccountSuccess, this.getUnsuccess)
    this.setState({ modalVisible: true });
  }
  setModalVisible = async (visible) => {
    this.setState({ modalVisible: visible });
  }
  renderButton() {
    if (this.state.loading) {
      return (<ActivityIndicator size='large' color='black' />);
    } 
  }
  Header = () => {
    return (
      <View style={styles.header}>
        <Text style={styles.txtHeader}>จำนวนคนในร้านทั้งหมด</Text>
      </View>
    )

  }
  renderSeparator = () => {
    return (
      <View
        style={{
          height: 1,
          backgroundColor: "#dddddd",
          marginHorizontal: 10
        }}
      />
    );
  };
  renderItem = ({ item }) => {
    return (
      <View style={{ backgroundColor: '#E5E5E5', marginHorizontal: 10 }}>
        <TouchableOpacity onPress={() => { this.getModal(item.id); }}>
          <View style={styles.container}>
            <View style={styles.lefContainer}>
              <View style={styles.viewProfile}>
                <Image style={styles.profile} source={{ uri: item.avatar }} />
              </View>
              <View style={styles.midContainer}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.txtcaption} numberOfLines={1}>{item.caption}</Text>
              </View>
            </View>
            {(this.props.profile.id==item.id )&&
              <TouchableOpacity>
              <View style={styles.addFriend}>
                <AntDesign name="user" size={26} color="black" />
              </View>
              </TouchableOpacity> 
            }
            {(this.state.Friend.indexOf(item.id) == -1 && this.props.profile.id!=item.id )&&
              <TouchableOpacity onPress={()=>{this.preAddFriend(item.id)}}>
              <View style={styles.addFriend}>
                <AntDesign name="adduser" size={26} color="black" />
              </View>
              </TouchableOpacity> 
            }
            {(this.state.Friend.indexOf(item.id) != -1 && this.props.profile.id!=item.id )&&
              <TouchableOpacity>
              <View style={styles.addFriend}>
                <AntDesign name="check" size={26} color="black" />
              </View>
              </TouchableOpacity> 
            }
          </View>
        </TouchableOpacity>
      </View>
    );
  }
  render(props) {
    const { navigation } = this.props;
    const { modalVisible } = this.state;
    return (
      <View style={{ flex: 1 }}>
        <this.Header />
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
              <View style={styles.modalProfile}>
                <Image style={styles.modalImage} source={{ uri: this.state.modalAvatar }} />
              </View>
              <View style={{ height: 2, backgroundColor: 'gray', width: 300, margin: 20 }}></View>

              <View style={styles.modalMid}>
                <Text style={styles.modalName}>{this.state.modalName}</Text>
                <View style={{ flexDirection: 'column', flex: 1, justifyContent: 'space-evenly', alignItems: 'center' }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <MaterialIcons name="description" size={28} color="black" />
                    <Text style={styles.txtDescription}>  {this.state.modalCaption}</Text>
                  </View>

                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <AntDesign name="facebook-square" size={24} color="black" />
                    <Text style={styles.txtDescription}>  {this.state.modalFb}</Text>
                  </View>

                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <AntDesign name="instagram" size={24} color="black" />
                    <Text style={styles.txtDescription}>   {this.state.modalIg}</Text>
                  </View>

                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <FontAwesome5 name="line" size={24} color="black" />
                    <Text style={styles.txtDescription}>   {this.state.modalLine}</Text>
                  </View>
                </View>
              </View>
              <View style={{ height: 2, backgroundColor: 'gray', width: 300, margin: 20 }}></View>
              <TouchableOpacity
                onPress={() => {
                  this.setModalVisible(!modalVisible);
                }}
              >
                <Text style={{ fontSize: 18, fontFamily: 'kanitRegular' }}>ปิด</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>


        {/* ============= close Modal ================== */}
        {this.renderButton()}
        <FlatList
          style={{ width: "100%" }}
          data={this.state.accountInStore}
          renderItem={this.renderItem}
          keyExtractor={item => item.id}
          ItemSeparatorComponent={this.renderSeparator}
        />
        {this.props.profile.type!=="Admin"&&<TouchableOpacity
          //activeOpacity={0.7}
          onPress={this.checkDeleteUser}
          style={styles.touchableOpacityStyle}>
          <View style={styles.floatingButtonStyle}>
          <AntDesign name="delete" size={30} color="white" />
          </View>
        </TouchableOpacity>}
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    padding: 10,
    alignItems: 'center'
    // marginVertical: 8,
  },
  lefContainer: {
    flexDirection: 'row',
  },
  midContainer: {
    justifyContent: 'space-around',
  },
  viewProfile: {
    width: 60,
    height: 60,
    backgroundColor: 'gray',
    borderRadius: 50,
    marginRight: 15,
  },
  profile: {
    height: 60,
    width: 60,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: 'white'
  },
  name: {
    fontSize: 18,
    fontFamily: 'kanitSemiBold',
  },
  txtcaption: {
    fontSize: 16,
    color: 'gray',
    width: 100,
    fontFamily: 'kanitLight',
  },
  time: {
    fontSize: 16,
    color: 'gray'
  },
  txtHeader: {
    fontSize: 20,
    fontFamily: 'kanitRegular'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
    borderRadius: 20,
    margin: 15,
    backgroundColor: '#E5E5E5',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.44,
    shadowRadius: 10.32,
    elevation: 16,
  },
  addFriend: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
    width: 50,
    borderRadius: 50,
    backgroundColor: 'white',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.44,
    shadowRadius: 10.32,
    elevation: 16,
  },
  touchableOpacityStyle: {
    position: 'absolute',
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    right: 40,
    bottom: 60,
  },
  floatingButtonStyle: {
    resizeMode: 'contain',
    width: 60,
    height: 60,
    backgroundColor:'#FB7070',
    borderRadius:50,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,

    elevation: 6,
    justifyContent:'center',
    alignItems:'center'
    //backgroundColor:'black'
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
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
    height: 550
  },
  openButton: {
    backgroundColor: "#F194FF",
    borderRadius: 20,
    padding: 10,
    elevation: 2
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  },
  modalImage: {
    width: 150,
    height: 150,
    resizeMode: 'cover',
    //alignSelf:'center',
    //borderRadius:50
    borderRadius: 100,
  },
  modalProfile: {
    width: 150,
    height: 150,
    backgroundColor: 'gray',
    borderRadius: 100
  },
  modalMid: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-evenly'
  },
  modalName: {
    fontSize: 24,
    fontFamily: 'kanitSemiBold'
  },
  txtDescription: {
    fontSize: 18,
    fontFamily: 'kanitRegular'
  },
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

export default connect(mapStateToProps, mapDispatchToProps)(FriendList);
