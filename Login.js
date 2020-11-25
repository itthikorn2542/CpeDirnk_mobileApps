import React, { Component } from 'react';
import {
  View,Text,StyleSheet,TextInput,TouchableOpacity,Alert,ActivityIndicator
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import { FontAwesome5 } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import firestore from './firebase/Firestore'
class Login extends Component {
    constructor(props){
        super(props);
        this.state = {
            check_textInputChange:false,
            email:null,
            password:null,
            secureTextEntry:true,
            loading:false
        };
        
    }
    // listeningCurrentUserSuccess=(user)=>{
    //     console.log("login Screen")
    
    //     if(user){
    //         this.props.navigation.reset({index:0,routes:[{name:'Bottomtab'}]})
    //     }
             
    // }
    // componentDidMount() {
    //     this.authFirebaseListener=firestore.listeningCurrentUser(this.listeningCurrentUserSuccess);
    //     }
    onLoginSuccess(user){
        console.log("login success")
    }

    onLoginFail=(error)=>{
        Alert.alert(
                "Login Fail",
                error.message,
                [
                  { text: "OK"}
                ],
                { cancelable: false }
              );
    }
    onLogin=()=>{
        if(!this.state.check_textInputChange){
            Alert.alert(
                "Login Fail",
                "E-mail ของคุณไม่ถูกต้อง",
                [
                  { text: "OK"}
                ],
                { cancelable: false }
              );
        }
        else if(!this.state.password){
            Alert.alert(
                "Login Fail",
                "password ของคุณไม่ถูกต้อง",
                [
                  { text: "OK"}
                ],
                { cancelable: false }
            );
        }
        else{
            // this.setState({loading:true});
            // firestore.firebase.auth().signInWithEmailAndPassword(this.state.email,this.state.password)
            // .then((user)=>{ 
            //     console.log("test success")
            //     this.setState({loading:false});
            //     alert("Successful , "+email+" "+password); 
            // })
            // .catch((error)=>{ 
            //     console.log("test error")
            //     this.setState({loading:false});
            //     alert(msgError.message);
            // });
            firestore.signIn(this.state.email,this.state.password,this.onLoginSuccess,this.onLoginFail);
        }
    }
  
    textInputChange=(value)=>{
        this.setState({email:value})
        let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if (reg.test(value) === false) {
            this.setState({check_textInputChange:false})
            return false;
        }
          else {
            this.setState({check_textInputChange:true})
        }
    }
    secureTextEntry=()=>{
        this.setState({secureTextEntry:!this.state.secureTextEntry})
    }
    // renderButton(){
    //     if(this.state.loading){
    //         return(<ActivityIndicator size='large' color='black'/>);
    //     }else{
    //         return(<TouchableOpacity style={styles.signin} onPress={this.onLogin } >
    //             <Text style={styles.text_singIn}>SignIn</Text>
    //                 </TouchableOpacity>);
    //     }
    // }

  render(props) {
    return (
        <View style={{ flex: 1,backgroundColor:"#000000" }}>
            <View style={styles.header}>
                <Text style={styles.text_header}>Welcome To...</Text>
            </View>
            <Animatable.View animation="fadeInUpBig" style={styles.footer}>
                <Text style={styles.text_footer}>E-Mail</Text>
                <View style={styles.action}>
                    <FontAwesome5 name="user-circle" size={20} color="black" />
                    <TextInput 
                        keyboardType='email-address'
                        placeholder="Your E-Mail"
                        style={styles.text_input}
                        onChangeText={(text)=>this.textInputChange(text)}
                    />
                    {this.state.check_textInputChange ?
                    <Animatable.View animation="bounceIn">
                        <Ionicons name="md-checkmark-circle-outline" size={20} color="green" /> 
                    </Animatable.View>
                    : null}
                </View>

                <Text style={[styles.text_footer,{marginTop:35}]}>Password</Text>
                <View style={styles.action}>
                    <AntDesign name="lock1" size={20} color="black" />
                    {this.state.secureTextEntry ?
                         <TextInput 
                         placeholder="Your Password"
                         secureTextEntry={true}
                         style={styles.text_input}
                         value={this.state.password}
                         onChangeText={(text)=>this.setState({password:text})}
                       />
                        : <TextInput 
                        placeholder="Your Password"
                        secureTextEntry={false}
                        style={styles.text_input}
                        value={this.state.password}
                        onChangeText={(text)=>this.setState({password:text})}
                     />}
                    
                    <TouchableOpacity onPress={()=>this.secureTextEntry()}>
                        {this.state.secureTextEntry ?
                         <Feather name="eye-off" size={20} color="gray" />
                        : <Feather name="eye" size={20} color="gray" /> }
                       
                    </TouchableOpacity>
                </View>
                <TouchableOpacity onPress={()=>this.props.navigation.navigate('ForgotPassword')}>
                    <Text style={{color:"#009db1",marginTop:15,fontFamily:'kanitLight'}}>Forgot password?</Text>
                </TouchableOpacity>
                <View style={styles.botton}>
                    {/* {this.renderButton()} */}
                    <TouchableOpacity style={styles.signin} onPress={this.onLogin } >
                        <Text style={styles.text_singIn}>SignIn</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.signUp,{marginTop:15}]} onPress={()=>this.props.navigation.navigate('Register')}>
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
        paddingVertical:30
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
        fontFamily:'kanitLight'
    },
    text_input:{
        flex:1,
        paddingLeft:10,
        fontSize:18,
        fontFamily:'kanitLight'
    },
    botton:{
        alignItems:"center",
        marginTop:50,
    },
    signin:{
        width:"100%",
        height:50,
        backgroundColor:"#000000",
        borderRadius:10,
        justifyContent:"center",
        alignItems:"center"
    },
    text_singIn:{
        color:"white",
        fontSize:18,
        fontFamily:'kanitSemiBold'
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


export default Login;