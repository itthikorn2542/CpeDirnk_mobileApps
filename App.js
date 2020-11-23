import { StatusBar } from 'expo-status-bar';
import React, { Component } from 'react';
import {
  View,Text,TouchableOpacity,ActivityIndicator
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useNavigation } from '@react-navigation/native';
import { useRoute } from '@react-navigation/native';
import { FontAwesome5 } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import Constants from 'expo-constants';
import Spalsh from './Spalsh'
import Login from './Login'
import Register from './Register'
import Home from './Home'
import Song from './Song'
import ForgotPassword from './ForgotPassword'
import QrCode from './QrCode'
import Profile from './Profile'
import Food from './Food'
import Chat from './Chat'
import PageChat from './PageChat'
import FriendList from './FriendList'
import { AntDesign } from '@expo/vector-icons';
import { EvilIcons } from '@expo/vector-icons';
import * as Font from 'expo-font';
import {Provider} from 'react-redux'
import configureStore from './Store'
const SpalshScreen =()=> {
  const navigation = useNavigation();
  return (
    <Spalsh navigation={navigation} />
  );
}

const LoginScreen =()=> {
  const navigation = useNavigation();
  return (
    <Login navigation={navigation} />
  );
}
const PostScreen =()=> {
  const navigation = useNavigation();
  return (
    <Post navigation={navigation} />
  );
}
const RegisterScreen =()=> {
  const navigation = useNavigation();
  return (
    <Register navigation={navigation} />
  );
}

const ForgotPasswordScreen =()=> {
  const navigation = useNavigation();
  return (
    <ForgotPassword navigation={navigation} />
  );
}

const HomeScreen =()=> {
  const navigation = useNavigation();
  return (
    <Home navigation={navigation} />
  );
}

const QrCodeScreen =()=> {
  const navigation = useNavigation();
  return (
    <QrCode navigation={navigation} />
  );
}

const ProfileScreen =()=> {
  const navigation = useNavigation();
  return (
    <Profile navigation={navigation} />
  );
}
const FoodScreen =()=> {
  const navigation = useNavigation();
  return (
    <Food navigation={navigation} />
  );
}
const SongScreen =()=> {
  const navigation = useNavigation();
  return (
    <Song navigation={navigation} />
  );
}

const ChatScreen =()=> {
  const navigation = useNavigation();
  const route = useRoute();
  return (
    <Chat navigation={navigation} route={route}/>
  );
}

const FriendListScreen =()=> {
  const navigation = useNavigation();
  return (
    <FriendList navigation={navigation} />
  );
}

const PageChatScreen =()=> {
  const navigation = useNavigation();
  const route = useRoute();
  return (
    <PageChat navigation={navigation} route={route} />
  );
}

const Stack = createStackNavigator();
const MyStack=()=>{
      return (
        <Stack.Navigator screenOptions={{
          headerTitleStyle :{fontFamily:'kanitSemiBold'},
          headerTintColor:'white',
          headerTitleAlign:"center",
          headerBackTitleVisible:false,
          headerStyle:{
            backgroundColor:'black',
          },
        }}>
          <Stack.Screen name="Spalsh" 
            component={SpalshScreen} 
            options={{ headerShown: false}}/>

          <Stack.Screen name="Login" 
            component={LoginScreen} 
            options={{ headerShown: false}}/>

          <Stack.Screen name="Register" 
            component={RegisterScreen} 
            options={{ headerShown: false}}/>

          <Stack.Screen name="ForgotPassword" 
            component={ForgotPasswordScreen} 
            options={{ headerShown: false}}/>

          <Stack.Screen name="Chat" 
            component={ChatScreen} 
            options={{ 
              headerShown: true,
              title: "FRIEND"
            }}
            />

          <Stack.Screen name="FriendList"
            component={FriendListScreen} 
            options={{ 
              headerShown: true,
              title: "MEMBER"
            }}/>

          <Stack.Screen name="PageChat" 
            component={PageChatScreen} 
            options={({ route }) => ({ title: route.params.username ,headerShown: true,})}/>

          
          <Stack.Screen 
          options={({ navigation }) => (
            { 
                title: "CPE ขี้เมา",
                headerRight: () => (
                  <View style={{flexDirection:'row',flex:1,justifyContent:'flex-end',alignItems:'flex-start',alignItems:'center'}}>
                  <TouchableOpacity onPress={() => navigation.navigate('FriendList')}>
                      <View style={{backgroundColor:'#565656',width:40,height:40,borderRadius:6,justifyContent:'center',alignItems:'center',marginRight:15}}>
                        <FontAwesome5 style={{margin:5}} name="user-friends" size={20} color="white" />
                      </View>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={()=>navigation.navigate('Chat')}>
                      <View style={{backgroundColor:'#565656',width:40,height:40,borderRadius:6,justifyContent:'center',alignItems:'center',marginRight:10}}>
                          <Entypo style={{margin:5}} name="chat" size={24} color="white" />
                      </View>
                    </TouchableOpacity>
                 </View>
                )
            })} 
          
          name="Bottomtab" component={MyBottomTab}/>

        </Stack.Navigator>
      );
}

const BottomTab=createBottomTabNavigator();
function MyBottomTab(){
  return(
    <BottomTab.Navigator 
      tabBarOptions={{activeTintColor:"white",
      inactiveColor:"gray",
      backgroundColor:'#000000',
      style:{
        backgroundColor: '#000000'
      }}}>
      <BottomTab.Screen 
      options={{tabBarIcon:({color})=>(<AntDesign name="home" size={28} color={color} />),tabBarLabel:() => {return null}}}
      name="TopTap" component={MyTopTap}/>

    <BottomTab.Screen 
      options={{tabBarIcon:({color})=>(<AntDesign name="qrcode" size={28} color={color} />),tabBarLabel:() => {return null}}} 
      name="QrCode" component={QrCodeScreen}/>
      
    <BottomTab.Screen 
      options={{tabBarIcon:({color})=>(<AntDesign name="profile" size={28} color={color} />),tabBarLabel:() => {return null}}} 
      name="Profile" component={ProfileScreen}/>
      
    </BottomTab.Navigator>
  );
}

const TopTab = createMaterialTopTabNavigator();
function MyTopTap(){
  return(
    <TopTab.Navigator 
    // sceneContainerStyle={{ backgroundColor: '#d1dfff', margin: 10, borderRadius: 20 }}
    style={{ backgroundColor: '#F1F1F1' }}
    tabBarOptions={{
        activeTintColor: 'white',
        inactiveTintColor: '#000000',
        //showIcon: true,
        //pressColor: 'gray',
        scrollEnabled: false,
        tabStyle: { borderRadius: 30,position:"relative",top:-9},
        indicatorStyle: {
          backgroundColor: '#000000',
          height:34,
          borderRadius: 30,
          width: '33.33%'
        },
        style: { borderRadius: 30,marginTop:20,marginBottom:20,marginHorizontal:"5%", height: 34, width: '90%' },
        labelStyle: { fontSize: 16 ,fontFamily:'kanitSemiBold'},

    }}>
      <TopTab.Screen options={{title:"หน้าฟีด"}} name="Home" component={HomeScreen}/>
      <TopTab.Screen options={{title:"เมนูอาหาร"}} name="Food" component={FoodScreen}/>
      <TopTab.Screen options={{title:"ขอคิวเพลง"}} name="Song" component={SongScreen}/>
    </TopTab.Navigator>
  );
}

export default class App extends Component {

  constructor(props){
    super(props);
     this.state = {
      loadingFont:true
    };
  }
  async componentDidMount() {
    await Font.loadAsync({
          sriracha:require('./assets/fonts/Sriracha-Regular.ttf'),
          kanitBlack: require('./assets/fonts/Kanit-Black.ttf'),
          kanitBlackItalic: require('./assets/fonts/Kanit-BlackItalic.ttf'),
          kanitBold: require('./assets/fonts/Kanit-Bold.ttf'),
          kanitBoldItalic: require('./assets/fonts/Kanit-BoldItalic.ttf'),
          kanitExtraBold: require('./assets/fonts/Kanit-ExtraBold.ttf'),
          kanitExtraBoldItalic: require('./assets/fonts/Kanit-ExtraBoldItalic.ttf'),
          kanitExtraLight: require('./assets/fonts/Kanit-ExtraLight.ttf'),
          kanitExtraLightItalic: require('./assets/fonts/Kanit-ExtraLightItalic.ttf'),
          kanitItalic: require('./assets/fonts/Kanit-Italic.ttf'),
          kanitLight: require('./assets/fonts/Kanit-Light.ttf'),
          kanitLightItalic: require('./assets/fonts/Kanit-LightItalic.ttf'),
          kanitMedium: require('./assets/fonts/Kanit-Medium.ttf'),
          kanitMediumItalic: require('./assets/fonts/Kanit-MediumItalic.ttf'),
          kanitRegular: require('./assets/fonts/Kanit-Regular.ttf'),
          kanitSemiBold: require('./assets/fonts/Kanit-SemiBold.ttf'),
          kanitSemiBoldItalic: require('./assets/fonts/Kanit-SemiBoldItalic.ttf'),
          kanitThin: require('./assets/fonts/Kanit-Thin.ttf'),
          kanitThinItalic: require('./assets/fonts/Kanit-ThinItalic.ttf'),
     })
     this.setState({loadingFont:false})
  }

  render(props) {
    const { loadingFont } = this.state

    if (loadingFont) {
      return <ActivityIndicator size="large"/>
    }
    else{
      return (
        <Provider store={configureStore}>
          <NavigationContainer>
            <MyStack/>
          </NavigationContainer>
        </Provider>
        
      );
    } 
  }
}
