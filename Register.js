import React, { Component } from 'react';
import {
  View,Text,StyleSheet,TextInput,TouchableOpacity,Alert
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import { FontAwesome5 } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import firestore from './firebase/Firestore'
class Register extends Component {
  constructor(props){
    super(props);
     this.state = {
        check_textInputChange:false,
        check_textInputChangeName:false,
        password:null,
        confirmPassword:null,
        secureTextEntry:true,
        secureTextEntryConfirm:true,
        email:null,
        name:null,
        chackPass:false,
        chackConfrimPass:false
    };
  }
//   componentDidMount=()=>{
//     firestore.listeningCurrentUser(this.listeningCurrentUser);
//   }
//   listeningCurrentUser=async (user)=>{
//     if(!user){
//         firestore.test();
//     }
//   }
  success=(docRef)=>{
      console.log("Add Your Account Success")
    // Alert.alert(
    //     "Success",
    //     "Add Your Account Success",
    //     [
    //       { text: "OK", onPress: () => this.props.navigation.navigate("Login") }
    //     ],
    //     { cancelable: false }
    //   );
  }
  reject=(error)=>{
        Alert.alert(
        "Creaste Account Fail",
        error.message,
        [
          { text: "OK"}
        ],
        { cancelable: false }
      );
  }
  onRegisterAut=()=>{
    console.log("onRegisterAut")
    if(this.state.check_textInputChangeName && this.state.check_textInputChange && !this.state.chackPass && !this.state.chackConfrimPass){
        firestore.createUser(this.state.email,this.state.password,this.state.name,this.reject);
    }
    else{
        Alert.alert(
        "Creaste Account Fail",
        "กรอกข้อมูลให้ถูกต้องครบถ้วน",
        [
          { text: "OK"}
        ],
        { cancelable: false }
      );
    }
  }
//   addUser=async()=>{
//     console.log("addUser")
//     var User={
//             email:this.state.email,
//             password:this.state.password,
//             name:this.state.name,
//             fb:"-",
//             ig:"-",
//             line:"-",
//             caption:"-",
//             avatar:"-",
//             type:"User",
//             status:"0"
//           }
//     await firestore.addUser(User,this.success,this.reject);
//   }
  checkCharactersPassword=(value)=>{
    this.setState({password:value})
      if(value.length!=0){
          if(value.length<6){
              this.setState({chackPass:true})
          }
          else{
            this.setState({chackPass:false})
          }
      }
  }
  checkPasswordMatch=(value)=>{
    this.setState({confirmPassword:value})
    if(value.length!=0){
        if(value!==this.state.password){
            this.setState({chackConfrimPass:true})
        }
        else{
          this.setState({chackConfrimPass:false})
        }
    }

  }
  
  textInputChange=(value)=>{
    if(value.length!==0){
        this.setState({check_textInputChange:true}),
        this.setState({email:value})
    }
    else{
        this.setState({check_textInputChange:false})
    }
  }

  textInputChangeName=(value)=>{
    if(value.length!==0){
        this.setState({check_textInputChangeName:true}),
        this.setState({name:value})
    }
    else{
        this.setState({check_textInputChange:false})
    }
  }
  secureTextEntry=()=>{
      this.setState({secureTextEntry:!this.state.secureTextEntry})
  }
  secureTextEntryConfirm=()=>{
    this.setState({secureTextEntryConfirm:!this.state.secureTextEntryConfirm})
}

  render(props) {
    const { navigation } = this.props;
    return (
        <View style={{ flex: 1,backgroundColor:"#000000" }}>
            <View style={styles.header}>
                <Text style={styles.text_header}>Create Account</Text>
            </View>
            <Animatable.View animation="fadeInUpBig" style={styles.footer}>

                <Text style={styles.text_footer}>Name</Text>
                <View style={styles.action}>
                    <FontAwesome5 name="user-circle" size={20} color="black" />
                    <TextInput 
                        placeholder="Your Name"
                        style={styles.text_input}
                        onChangeText={(text)=>this.textInputChangeName(text)}
                    />
                    {this.state.check_textInputChangeName ?
                    <Animatable.View animation="bounceIn">
                        <Ionicons name="md-checkmark-circle-outline" size={20} color="red" /> 
                    </Animatable.View>
                    : null}
                </View>
                <Text style={[styles.text_footer,{marginTop:15}]}>E-Mail</Text>
                <View style={styles.action}>
                    <FontAwesome5 name="user-circle" size={20} color="black" />
                    <TextInput 
                        placeholder="Your E-Mail"
                        style={styles.text_input}
                        onChangeText={(text)=>this.textInputChange(text)}
                    />
                    {this.state.check_textInputChange ?
                    <Animatable.View animation="bounceIn">
                        <Ionicons name="md-checkmark-circle-outline" size={20} color="red" /> 
                    </Animatable.View>
                    : null}
                </View>
                <Text style={[styles.text_footer,{marginTop:15}]}>Password</Text>
                <View style={styles.action}>
                    <AntDesign name="lock1" size={20} color="black" />
                    {this.state.secureTextEntry 
                    ? <TextInput 
                        placeholder="Your Password"
                        secureTextEntry={true}
                        style={styles.text_input}
                        value={this.state.password}
                        onChangeText={(text)=>this.checkCharactersPassword(text)}
                      />
                    : <TextInput 
                        placeholder="Your Password"
                        style={styles.text_input}
                        value={this.state.password}
                        secureTextEntry={false}
                        onChangeText={(text)=>this.checkCharactersPassword(text)}
                     />
                    }
                    
                    <TouchableOpacity onPress={()=>this.secureTextEntry()}>
                        {this.state.secureTextEntry ?
                         <Feather name="eye-off" size={20} color="gray" />
                        : <Feather name="eye" size={20} color="gray" /> }
                       
                    </TouchableOpacity>
                </View>
                {this.state.chackPass ?
                <Text style={{fontFamily:'kanitLight',fontSize:16,color:'red'}}>Password at least 6 characters</Text>
                :null
                }
                <Text style={[styles.text_footer,{marginTop:15}]}>Confirm Password</Text>
                <View style={styles.action}>
                    <AntDesign name="lock1" size={20} color="black" />
                    {this.state.secureTextEntryConfirm 
                    ? <TextInput 
                        placeholder="Your Password"
                        secureTextEntry={true}
                        style={styles.text_input}
                        value={this.state.confirmPassword}
                        onChangeText={(text)=>this.checkPasswordMatch(text)}
                      />
                    : <TextInput 
                        placeholder="Your Password"
                        secureTextEntry={false}
                        style={styles.text_input}
                        value={this.state.confirmPassword}
                        onChangeText={(text)=>this.checkPasswordMatch(text)}
                     />
                    }
                    
                    <TouchableOpacity onPress={()=>this.secureTextEntryConfirm()}>
                        {this.state.secureTextEntryConfirm ?
                         <Feather name="eye-off" size={20} color="gray" />
                        : <Feather name="eye" size={20} color="gray" /> }
                       
                    </TouchableOpacity>
                </View>
                {this.state.chackConfrimPass ?
                <Text style={{fontFamily:'kanitLight',fontSize:16,color:'red'}}>Password not match</Text>
                :null
                }
                <View style={styles.botton}>
                    <TouchableOpacity style={[styles.signUp,{marginTop:10}]} onPress={this.onRegisterAut}>
                        <Text style={styles.text_singUp}>SignUp</Text>
                    </TouchableOpacity>
                </View>
            </Animatable.View>
            
        </View>
    );
  }
}
const styles = StyleSheet.create({
    header:{
        flex:1,
        justifyContent:'flex-end',
        paddingHorizontal:20,
        paddingBottom:50
    },
    footer:{
        flex:3,
        backgroundColor:"white",
        borderTopLeftRadius:30,
        borderTopRightRadius:30,
        paddingHorizontal:20,
        paddingVertical:30,
    },
    text_header:{
        color:"white",
        fontSize:30,
        fontFamily:'kanitSemiBold'
    },
    text_footer:{
        fontSize:18,
        fontFamily:'kanitLight'
    },
    action:{
        flexDirection:"row",
        marginTop:10,
        borderBottomWidth:1,
        borderColor:"#C4C4C4",
        paddingBottom:5,
    },
    text_input:{
        flex:1,
        paddingLeft:10,
        fontSize:18,
        fontFamily:'kanitLight'
    },
    botton:{
        alignItems:"center",
        marginTop:30,
    },
    signUp:{
        width:"100%",
        height:50,
        backgroundColor:"#C4C4C4",
        borderRadius:10,
        justifyContent:"center",
        alignItems:"center",
        borderColor:"#000000",
        borderWidth:1
    },
    text_singUp:{
        color:"black",
        fontSize:18,
        fontFamily:'kanitSemiBold'
    },
  });


export default Register;