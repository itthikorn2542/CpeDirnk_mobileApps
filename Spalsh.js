import React, { Component } from 'react';
import {
  View,Text,StyleSheet,Image,ActivityIndicator
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import firestore from './firebase/Firestore'

import { connect } from 'react-redux';
import { saveProfile } from './actions/profile';
class Splash extends Component {
  constructor(props){
    super(props);
     this.state = {
 
    };
  }
//   componentDidMount(){
//     setTimeout(() => {
//         this.props.navigation.navigate('Login');
//         this.props.navigation.reset({index:0,routes:[{name:'Login'}]}) 
//     }, 2500)
//   }
    onSignOutSuccess=()=>{
        console.log('Sign Out Success');
    }
    unsuccess=(error)=>{
        console.log(error)
    }

    getAccountSuccess=(doc)=>{
        console.log(doc.id)
        let account=doc.data()
        account.id=doc.id
        this.props.save(account);
        console.log('redux')
        console.log(this.props.profile)
        this.props.navigation.reset({index:0,routes:[{name:'Bottomtab'}]}) 
      }

    listeningCurrentUserSuccess=async(user)=>{
        if(user!==null){
            if(user.displayName!==null){
                console.log(user.uid)
                await firestore.getAccountWithID(user.uid,this.getAccountSuccess,this.unsuccess)
                
            //this.props.navigation.reset({index:0,routes:[{name:'Bottomtab'}]}) 
            }
            else if(user.displayName===null){
                await firestore.signOut(this.onSignOutSuccess,this.onReject);
                //this.props.navigation.reset({index:0,routes:[{name:'Login'}]}) 
            }
            
        }
        else{
            setTimeout(() => {
                // this.props.navigation.navigate('Login');
                this.props.navigation.reset({index:0,routes:[{name:'Login'}]}) 
            }, 2500)
        }
  }
   componentDidMount() {
    this.authFirebaseListener=firestore.listeningCurrentUser(this.listeningCurrentUserSuccess);
    }
  render(props) {
    const { navigation } = this.props;
    return (
        <View style={{ flex: 1,backgroundColor:"#000000" }}>
            <View style={styles.top}></View>
            <View style={styles.middle}>
                <View style={{flexDirection:"row"}}>
                    <Animatable.View animation="slideInLeft">
                        <View>
                            <Image
                                style={styles.imageLeft}
                                source={require('./images/beer.png')}
                            />
                        </View>
                    </Animatable.View>
                    <Animatable.View animation="slideInRight">
                        <View>
                            <Image
                                style={styles.imageRight}
                                source={require('./images/beer.png')}
                            />
                        </View>
                    </Animatable.View>
                </View>
                 <Text style={{color:"white", fontSize:40,position:'relative',top:"5%",fontFamily:'sriracha'}}>CPE ขี้เมา</Text>
            </View>
            <View style={styles.bottom}></View>
        </View>
    );
  }
}
const styles = StyleSheet.create({
    top:{
        flex:1
    },
    middle: {
        flex:2,
        justifyContent:"center",
        alignItems:"center"
    },
    bottom:{
        flex:1,
    },
    imageLeft: {
        width: 138,
        height: 138,
        resizeMode:'contain',
        alignSelf:'center',
        marginBottom:8,
        transform: [{ rotate: "-14.73deg"},{rotateY:"180deg"}],
        position:"relative",
        top:15
    },
    imageRight: {
        width: 138,
        height: 138,
        resizeMode:'contain',
        alignSelf:'center',
        marginBottom:8,
        transform: [{ rotate: "14.73deg" }],
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
  
export default connect(mapStateToProps, mapDispatchToProps)(Splash);