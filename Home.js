import React, { Component } from 'react';
import {
  View,Text,StyleSheet,FlatList,Image,TouchableOpacity, Modal,TextInput
} from 'react-native';
import Constants from 'expo-constants';
import {createStackNavigator} from '@react-navigation/stack' 
import {NavigationContainer,useNavigation } from '@react-navigation/native'
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs'
import { FontAwesome5 } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import {Card,Avatar,Title,Paragraph} from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { SimpleLineIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as data from './data.json';
import {savePost,addPost} from './actions/actionPost'
import {connect} from 'react-redux';
import firestore from './firebase/Firestore'
import storage from './firebase/Storage';
import moment from 'moment';
import { AntDesign } from '@expo/vector-icons';


class Home extends Component {
  constructor(props){
    super(props);
     this.state = {
      showModal:false,
      showModal2:false,
      img:null,
      caption:"",
      linkImage:null,
      type:"txt",
      timeDate:null,
      id:null

    };
  }
  pickImage= async()=>{
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes:ImagePicker.MediaTypeOptions.All,
      allowsEditing:true,
      quality:1
    });

    if(!result.cancelled){
      console.log(result);
      this.setState({img:result.uri});
    }
  }
  componentDidMount=()=>{
    firestore.getAllPost(this.success,this.addUnSuccess);
  }
  success = (querySnapshot) => {
    //console.log(querySnapshot)
    var posts = []
    querySnapshot.forEach(function(doc){ 
      let post = doc.data()
      post.id  = doc.id
      posts = posts.concat(post)
    })
    this.props.save(posts)
    //console.log(this.props.post)
    //console.log(posts)
  }
  addUnSuccess=(error)=>{
    console.log(error);
  }
///////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
getPostSuccess=(doc)=>{
    let post = doc.data();
    post.id  = doc.id
    this.props.add(post)
    this.setState({showModal:false});
    this.setState({img:null});
    this.setState({linkImage:null})
}
getPostUnsuccess=(error)=>{
  console.log(error)
}
  addSuccess= async(docRef)=>{
   await firestore.getPostWithID(docRef.id,this.getPostSuccess,this.getPostUnsuccess)
}
/////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////
uploadSuccess=async(uri)=>{
  console.log(uri)
  this.setState({type:"img"})
  this.setState({linkImage:uri})
  const timeDate = new Date();
  this.setState({createdDate:timeDate})
  let post = {
    caption:this.state.caption,
    type:"img",
    createdDate:timeDate,
    linkImage:this.state.linkImage,
  }
  await firestore.addPost(post,this.addSuccess,this.addUnSuccess);
}
////////////////////////////////////////////////////////
onUpload=(progress)=>{
  console.log(progress);
}
/////////////////////////////////////////////////////////
uploadError=(error)=>{
  console.log(error);
}
////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////////////////////////////
  AddPost = async()=>{
    this.setState({showModal:false});
    
    if(this.state.img!=null){
      
      let key = Math.random().toString()
      await storage.uploadToFirebase(this.state.img,key,this.uploadSuccess,this.uploadError);
    }
    else{
      const timeDate = new Date();
      this.setState({createdDate:timeDate})
      let post = {
        caption:this.state.caption,
        type:"txt",
        createdDate:timeDate,
        linkImage:this.state.linkImage,
      }
      await firestore.addPost(post,this.addSuccess,this.addUnSuccess);
    }
      
  }
  

  renderItem=({item})=>{
    return(
      <View style={{padding:8}}>
        <Card>
            <Card.Title style={{fontFamily:'kanitSemiBold'}} title="CPEขี้เมา" subtitle={moment(item.createdDate.toDate()).fromNow()}
            left={()=>(<Avatar.Image size={50} source={{uri:this.props.type.avatar}}/>)} right={()=>(
            <View style={{backgroundColor:'white',height:50,width:50,justifyContent:'center',alignItems:'center',marginLeft:30}}>
              <TouchableOpacity onPress={()=>{this.setState({showModal2:true})}}>
                <SimpleLineIcons name="options-vertical" size={18} color="black" />
              </TouchableOpacity>
            </View>
           
            )}/>
            <Card.Content>
            <Paragraph ><Text style={{fontFamily:'kanitRegular',fontSize:18,marginTop:10}}>{item.caption}</Text></Paragraph>
            </Card.Content>
            {item.type=="img"&&<Card.Cover source={{uri:item.linkImage}}/>}
          </Card>
      </View>
    );
  };

  
  render(props) {
    const { navigation } = this.props;
    return (
      <View style={{flex:1}}>
        {/* <Text>kjcflkbcgk</Text> */}
        {this.props.type.type=="Admin"&&<View style={styles.postStatus}>
            <Image style={{height:50,width:50,borderRadius:50}} 
                   source={{uri:'https://scontent.fbkk23-1.fna.fbcdn.net/v/t1.0-9/106120566_3049250375195115_1160308528193104189_o.jpg?_nc_cat=110&ccb=2&_nc_sid=09cbfe&_nc_eui2=AeFfLRFY8nsWPzaRCcMLitqYCLpinoXybFQIumKehfJsVP2YpNPfwK62kJ6zo5ChZO3UhLo3G1QN7X602rBhM-Fk&_nc_ohc=Rvmxq3WtlJgAX_ojFDr&_nc_ht=scontent.fbkk23-1.fna&oh=323ca4fb7b67911d8d2e4912768faced&oe=5FE00DA1'}}></Image>
            <TouchableOpacity style={{width:'80%'}} onPress={()=>{this.setState({showModal:true})}}>
              <View style={{backgroundColor:'#E1E1E1',height:40,borderRadius:40,justifyContent:'center'}}>
                <Text style={{marginLeft:10,fontFamily:'kanitRegular'}}>บอกความรู้สึกของคุณ</Text>
              </View>
    </TouchableOpacity>  
        </View>}
        <Modal transparent={true} visible={this.state.showModal} animationType="slide">
            <View  style={{backgroundColor:'#00000060',justifyContent:'center',alignItems:'center',paddingTop:Constants.statusBarHeight,flex:1}}>
                <View style={{backgroundColor:'white',borderRadius:10,height:800,width:400}}>
                    <View style={{flex:1,justifyContent:'center',flexDirection:'row'}}>
                      <TouchableOpacity style={{justifyContent:'center'}} onPress={()=>{this.setState({showModal:false}),this.setState({picture:null})}}>
                        <View >
                          <Ionicons style={{marginLeft:10}} name="md-arrow-round-back" size={24} color="black" />
                        </View>
                      </TouchableOpacity>
                      
                      <View style={{flex:1,justifyContent:'center'}}>
                        <Text style={{marginLeft:10,fontSize:20,fontFamily: 'kanitSemiBold'}}>การสร้างโพสต์</Text>
                      </View>
                      <TouchableOpacity onPress={this.AddPost}>
                         <View style={{flex:1,justifyContent:'center',alignItems:'flex-end'}}>
                            <Text style={{marginRight:10,fontSize:20,fontFamily: 'kanitSemiBold',color:'#6F0CEE'}}>โพสต์</Text>
                        </View>
                      </TouchableOpacity>
                     
                    </View>
                    <View style={{height:1,backgroundColor:'#00000060'}}></View>
                    <View style={{flex:10}}>
                      <View style={{flex:1,flexDirection:'row',alignItems:'center'}}>
                            <Image style={{height:50,width:50,borderRadius:50,marginLeft:10}} 
                                   source={{uri:'https://scontent.fbkk23-1.fna.fbcdn.net/v/t1.0-9/106120566_3049250375195115_1160308528193104189_o.jpg?_nc_cat=110&ccb=2&_nc_sid=09cbfe&_nc_eui2=AeFfLRFY8nsWPzaRCcMLitqYCLpinoXybFQIumKehfJsVP2YpNPfwK62kJ6zo5ChZO3UhLo3G1QN7X602rBhM-Fk&_nc_ohc=Rvmxq3WtlJgAX_ojFDr&_nc_ht=scontent.fbkk23-1.fna&oh=323ca4fb7b67911d8d2e4912768faced&oe=5FE00DA1'}}></Image>
                            <Text style={{marginLeft:10,fontSize:20,fontFamily:'kanitRegular'}}>Itthikorn Wisetpong</Text>
                      </View>
                      <View style={{flex:10}}>
                        <View style={{flex:1,margin:10,}}>
                          <TextInput onChangeText={(txt)=>{this.setState({caption:txt})}} multiline={true} placeholder="บอกความรู้สึกของคุณ..." style={{marginLeft:10,fontSize:18,width:'96%',fontFamily:'kanitRegular'}}></TextInput>
                          {this.state.img!=null&&<Image style={{flex:1,marginTop:5,resizeMode:'cover'}} source={{uri:this.state.img}}></Image>}
                        </View>
                        <View style={{flex:1}}>
                           <View style={{height:1,backgroundColor:'#00000060'}}></View>
                           <TouchableOpacity onPress={this.pickImage}>
                              <View style={{backgroundColor:'white',height:50,width:350,flexDirection:'row',alignItems:'center'}}>
                                <SimpleLineIcons style={{marginLeft:10}} name="picture" size={24} color="black" />
                                <Text style={{marginLeft:10,fontFamily:'kanitRegular'}}>รูปภาพ/วีดีโอ</Text>
                              </View>
                           </TouchableOpacity>
                         
                           <View style={{height:1,backgroundColor:'#00000060'}}></View>
                        </View>
                      </View>

                    </View>
                </View>
            </View>
        </Modal>


      <Modal transparent={true} visible={this.state.showModal2}>
            <View  style={{backgroundColor:'#00000060',justifyContent:'flex-end',paddingTop:Constants.statusBarHeight,flex:1}}>
                <View style={{backgroundColor:'white',height:250,width:'100%'}} animationType="slide">
                  <TouchableOpacity style={{flex:1,alignItems:'center',justifyContent:'center'}} onPress={()=>{this.setState({showModal2:false})}}>
                    <View >
                      <AntDesign name="caretdown" size={24} color="black" />
                    </View>
                  </TouchableOpacity>
                    
                    <View style={{flex:2,justifyContent:'space-between',alignItems:'center'}}>
                      <View style={{height:1,width:'100%',backgroundColor:'black'}}></View>

                      <TouchableOpacity>
                        <View style={{justifyContent:'center',alignItems:'center'}}>
                            <Text style={{fontSize:20,fontFamily:'kanitRegular'}}>แก้ไขโพสต์</Text>
                        </View>
                      </TouchableOpacity>
              
                        <View style={{height:1,width:'100%',backgroundColor:'black'}}></View>
                      <TouchableOpacity>
                        <View>
                            <Text style={{fontSize:20,fontFamily:'kanitRegular'}}>ลบโพสต์</Text>
                        </View>
                      </TouchableOpacity>
                        
                        <View style={{height:1,width:'100%',backgroundColor:'black'}}></View>
                    </View>
                    <View style={{flex:1}}/>
                </View>
            </View>
      </Modal>

      <FlatList
        data={this.props.post}
        keyExtractor = {item=>item.id}
        renderItem={this.renderItem}
        ref={(ref) => { this.flatListRef = ref; }}
        onContentSizeChange={() => this.flatListRef.scrollToEnd()}
    />
    </View>
    );
  }
}
const styles = StyleSheet.create({
    header:{
      width:'100%',
      height:'8%',
      backgroundColor:'black',
      flexDirection:'row',
    },
    postBar:{
      width:"100%",
      height:"20%",
      backgroundColor:"white",
      flexDirection:'row',
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.20,
      shadowRadius: 1.41,
      elevation: 2,

    },
    postStatus:{
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.20,
      shadowRadius: 1.41,
      elevation: 2,
      backgroundColor:'white',
      height:90,
      margin:8,
      borderRadius:5,
      flexDirection:'row',
      justifyContent:'space-evenly',
      alignItems:'center',
    },
    headerText: {
      fontSize: 20,
      margin: 10,
      fontWeight: "bold"
    },
    menuContent: {
      color: "#000",
      fontWeight: "bold",
      padding: 2,
      fontSize: 20
    }
  });

  const mapDispatchToProps=(dispatch)=>{
    return{
      save:(caption,type)=>dispatch(savePost(caption,type)),
      add:(caption,type)=>dispatch(addPost(caption,type)),
    }
  }
  
  const mapStateToProps=(state)=>{
    return{
      post:state.postReducer.postList,
      type:state.profileReducer.profile,
    }
  }
export default connect(mapStateToProps,mapDispatchToProps)(Home);