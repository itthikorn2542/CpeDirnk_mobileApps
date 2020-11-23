import moment from 'moment';
import React, { Component } from 'react';
import {
  View, Text, StyleSheet, Image, FlatList, TouchableOpacity, Modal
} from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
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
    };
  }
  async componentDidMount() {
    console.log('getaccountInStore')
    await firestore.getAccountByStatus(this.getSuccess, this.getUnsuccess)
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
            <TouchableOpacity>
              <View style={styles.addFriend}>
                <AntDesign name="adduser" size={26} color="black" />
              </View>
            </TouchableOpacity>
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
        <FlatList
          style={{ width: "100%" }}
          data={this.state.accountInStore}
          renderItem={this.renderItem}
          keyExtractor={item => item.id}
          ItemSeparatorComponent={this.renderSeparator}
        />
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


export default FriendList;