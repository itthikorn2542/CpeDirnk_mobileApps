import * as React from 'react';
import {
  Text,
  View,
  StyleSheet,
  Button
} from 'react-native';
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';
import firestore from './firebase/Firestore'
import {connect} from 'react-redux';
import {
  BarCodeScanner
} from 'expo-barcode-scanner';

class QrCode extends React.Component {
  state = {
    hasCameraPermission: null,
    scanned: false,
  };

  async componentDidMount() {
    this.getPermissionsAsync();
  }

  getPermissionsAsync = async() => {
    const {status} = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({
      hasCameraPermission: status === 'granted'
    });
  };

  render() {
    const {hasCameraPermission,scanned} = this.state;

    // if (hasCameraPermission === null) {
    //   return (
    //     this.setState({hasCameraPermission:null})
    //   );
    // }
    if (hasCameraPermission === false) {
      return (<Text> No access to camera </Text>);
    }
    return (
      <View style = {{flex: 1,flexDirection: 'column',justifyContent: 'flex-end',}}>
        <BarCodeScanner 
        onBarCodeScanned = {scanned ? undefined : this.handleBarCodeScanned}
        style = {StyleSheet.absoluteFillObject}/>
        {scanned && (<Button title = {'Tap to Scan Again'} onPress = {() => this.setState({scanned: false})}/>)} 
      </View>
    );
  }

success=()=>{
  console.log("update success...")
  
}
reject=(error)=>{
  console.log(error)
}
onUpdate=async()=>{
    let user = {
        status:"1"
      }
      await firestore.updateAccountStatusByID(user,this.props.type.id,this.success,this.reject)
  }
  handleBarCodeScanned = ({ type, data }) => {
    this.setState({
      scanned: true
    });
    alert("ยินดีต้อนรับเข้าสู้ร้าน CPEขี้เมา");
    if(data == "เข้าร้าน"){
      this.onUpdate()
      this.props.navigation.navigate('Home')
    }

  };
}

const mapStateToProps=(state)=>{
  return{
    type:state.profileReducer.profile
  }
    
}
export default connect(mapStateToProps)(QrCode);