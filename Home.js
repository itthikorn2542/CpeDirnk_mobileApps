import React, { Component } from 'react';
import {
  View,Text,StyleSheet,FlatList,Image,TouchableOpacity, Modal,TextInput
} from 'react-native';
import Constants from 'expo-constants';
import {Card,Avatar,Title,Paragraph} from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { SimpleLineIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import {savePost,addPost, deletePost,editPost} from './actions/actionPost'
import {connect} from 'react-redux';
import firestore from './firebase/Firestore'
import storage from './firebase/Storage';
import moment from 'moment';
import { AntDesign } from '@expo/vector-icons';

class Home extends Component {
  constructor(props){

    

    super(props);
     this.state = {
      showModalPost:false,
      showModalOption:false,
      showModalEdit:false,
      img:null,
      caption:"",
      linkImage:null,
      type:"txt",
      timeDate:null,
      id:null,
      post:[],
      deleteID:null,
      editID:null,
      refreshing:false,

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
  componentDidMount=async()=>{
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
    this.refresh2()
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
    this.setState({showModalPost:false});
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
    this.setState({showModalPost:false});
    
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
//////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////DELETE POST BY ID FROM FIREBASE//////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////
deleteSuccess=()=>{
  let post = {
    id:this.state.deleteID
  }
  this.props.del(post)
}
deleteUnSuccess=(error)=>{
  console.log(error)
}
onDeletePost= async()=>{
  let id = this.state.deleteID;
  await firestore.deletePostByID(id,this.deleteSuccess,this.deleteUnSuccess);
}
//////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////EDIT POST BY ID FROM FIREBASE////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////
updateSuccess=()=>{
  let post = {
    caption:this.state.caption,
    id:this.state.editID
  }
  this.props.edit(post)
  this.setState({img:null});
  this.setState({linkImage:null});
  this.setState({caption:null});
  this.setState({type:"txt"});
}
updateUnSuccess=(error)=>{
  console.log("this is error of update");
  console.log(error)
}
onUpdatePost= async()=>{
  this.setState({showModalEdit:false})
    let post = {
      caption:this.state.caption,
      id:this.state.editID,
    }
    await firestore.updatePostByID(post,this.updateSuccess,this.updateUnSuccess)
}
//////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////
  renderItem=({item})=>{
    return(
      <View style={{padding:8}}>
        <Card>
            <Card.Title style={{fontFamily:'kanitSemiBold'}} title="CPEขี้เมา" subtitle={moment(item.createdDate.toDate()).fromNow()}
            left={()=>(<Avatar.Image size={50} source={{uri:"https://bit.ly/2JeaoVz"}}/>)} right={()=>(
            this.props.type.type=="Admin"&&<View style={{backgroundColor:'white',height:50,width:50,justifyContent:'center',alignItems:'center',marginLeft:30}}>
              <TouchableOpacity onPress={()=>{this.setState({showModalOption:true}),this.setState({deleteID:item.id})}}>
                <SimpleLineIcons name="options-vertical" size={18} color="black" />
              </TouchableOpacity>
            </View>
           
            )}/>
            <Card.Content>
            <Paragraph ><Text style={{fontFamily:'kanitRegular',fontSize:18,margin:20}}>{item.caption}</Text></Paragraph>
            </Card.Content>
            <View style={{height:300}}>
            <Image style={{height:300 ,resizeMode:'cover'}}source={{uri:item.linkImage}}/>
            </View>
            {/* {item.type=="img"&&<Card.Cover style={{margin:20}}source={{uri:item.linkImage}} />} */}
          </Card>

{/* ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      //////////////////////////////////////////////////////////////////MODAL OPTION POST//////////////////////////////////////////////////////////
      ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// */}
          {this.state.deleteID==item.id&&<Modal transparent={true} visible={this.state.showModalOption} animationType="slide">
            <View  style={{justifyContent:'flex-end',paddingTop:Constants.statusBarHeight,flex:1}}>
                <View style={{backgroundColor:'#000000',height:250,width:'100%'}} >
                  <TouchableOpacity style={{flex:1,alignItems:'center',justifyContent:'center'}} onPress={()=>{this.setState({showModalOption:false})}}>
                    <View >
                      <AntDesign name="caretdown" size={24} color="white" />
                    </View>
                  </TouchableOpacity>
                    
                    <View style={{flex:2,justifyContent:'space-between',alignItems:'center'}}>
                      <View style={{height:1,width:'100%',backgroundColor:'white'}}></View>

                      <TouchableOpacity onPress={()=>{
                      this.setState({showModalEdit:true}),
                      this.setState({editID:item.id}),
                      this.setState({showModalOption:false}),
                      this.setState({type:item.type}),
                      this.setState({timeDate:item.createdDate}),
                      this.setState({linkImage:item.linkImage}),
                      this.setState({caption:item.caption})}} style={{height:30,width:'100%'}}>
                        <View style={{justifyContent:'center',alignItems:'center',}}>
                            <Text style={{fontSize:20,fontFamily:'kanitRegular',color:'white'}}>แก้ไขโพสต์</Text>
                        </View>
                      </TouchableOpacity>
              
                        <View style={{height:1,width:'100%',backgroundColor:'white'}}></View>
                      <TouchableOpacity onPress={this.onDeletePost} style={{height:30,width:'100%'}}>
                        <View style={{justifyContent:'center',alignItems:'center',}}>
                            <Text style={{fontSize:20,fontFamily:'kanitRegular',color:'white'}}>ลบโพสต์</Text>
                        </View>
                      </TouchableOpacity>
                        
                        <View style={{height:1,width:'100%',backgroundColor:'white'}}></View>
                    </View>
                    <View style={{flex:1}}/>
                </View>
            </View>
      </Modal>}
      {/* ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      //////////////////////////////////////////////////////////////////MODAL EDIT POST//////////////////////////////////////////////////////////
      ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// */}

      {this.state.editID==item.id&&<Modal transparent={true} visible={this.state.showModalEdit} animationType="slide">
            <View  style={{backgroundColor:'#00000060',justifyContent:'center',alignItems:'center',paddingTop:Constants.statusBarHeight,flex:1}}>
                <View style={{backgroundColor:'white',borderRadius:10,height:800,width:400}}>
                    <View style={{flex:1,justifyContent:'center',flexDirection:'row'}}>
                      <TouchableOpacity style={{justifyContent:'center'}} onPress={()=>{this.setState({showModalEdit:false}),this.setState({picture:null})}}>
                        <View >
                          <Ionicons style={{marginLeft:10}} name="md-arrow-round-back" size={24} color="black" />
                        </View>
                      </TouchableOpacity>
                      
                      <View style={{flex:1,justifyContent:'center'}}>
                        <Text style={{marginLeft:10,fontSize:20,fontFamily: 'kanitSemiBold'}}>การแก้ไข</Text>
                      </View>
                      <TouchableOpacity onPress={this.onUpdatePost}>
                         <View style={{flex:1,justifyContent:'center',alignItems:'flex-end'}}>
                            <Text style={{marginRight:10,fontSize:20,fontFamily: 'kanitSemiBold',color:'#6F0CEE'}}>บันทึก</Text>
                        </View>
                      </TouchableOpacity>
                     
                    </View>
                    <View style={{height:1,backgroundColor:'#00000060'}}></View>
                    <View style={{flex:10}}>
                      <View style={{flex:1,flexDirection:'row',alignItems:'center'}}>
                            <Image style={{height:50,width:50,borderRadius:50,marginLeft:10}} 
                                   source={{uri:this.props.type.avatar}}></Image>
                            <Text style={{marginLeft:10,fontSize:20,fontFamily:'kanitRegular'}}>CPEขี้เมา</Text>
                      </View>
                      <View style={{flex:10}}>
                        <View style={{flex:1,margin:10,}}>
                          <TextInput onChangeText={(txt)=>{this.setState({caption:txt})}} multiline={true}  value={this.state.caption} style={{marginLeft:10,fontSize:18,width:'96%',fontFamily:'kanitRegular'}}></TextInput>
                          {item.linkImage!=null&&<Image style={{flex:1,marginTop:5,resizeMode:'cover'}} source={{uri:item.linkImage}}></Image>}
                        </View>
                        
                      </View>

                    </View>
                </View>
            </View>
        </Modal>}
{/* ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// */}

      </View>
    );
  };
  refresh2=()=>{
    this.setState({refreshing:false})
  }
  refresh=()=>{
    this.setState({refreshing:true})
    firestore.getAllPost(this.success,this.addUnSuccess);
  }
  render(props) {
    const { navigation } = this.props;
    
    return (
      <View style={{flex:1}}>
        {/* <Text>kjcflkbcgk</Text> */}
        {this.props.type.type=="Admin"&&<View style={styles.postStatus}>
            <Image style={{height:50,width:50,borderRadius:50}} 
                   source={{uri:this.props.type.avatar}}></Image>
            <TouchableOpacity style={{width:'80%'}} onPress={()=>{this.setState({showModalPost:true})}}>
              <View style={{backgroundColor:'#E1E1E1',height:40,borderRadius:40,justifyContent:'center'}}>
                <Text style={{marginLeft:10,fontFamily:'kanitRegular'}}>ประกาศให้ลูกค้ารู้</Text>
              </View>
    </TouchableOpacity>  
        </View>}
        <Modal transparent={true} visible={this.state.showModalPost} animationType="slide">
            <View  style={{backgroundColor:'#00000060',justifyContent:'center',alignItems:'center',paddingTop:Constants.statusBarHeight,flex:1}}>
                <View style={{backgroundColor:'white',borderRadius:10,height:700,width:400}}>
                    <View style={{flex:1,justifyContent:'center',flexDirection:'row'}}>
                      <TouchableOpacity style={{justifyContent:'center'}} onPress={()=>{this.setState({showModalPost:false}),this.setState({picture:null})}}>
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
                                   source={{uri:'https://bit.ly/2JeaoVz'}}></Image>
                            <Text style={{marginLeft:10,fontSize:20,fontFamily:'kanitRegular'}}>CPEขี้เมา</Text>
                      </View>
                      <View style={{flex:10}}>
                        <View style={{flex:1,margin:10,}}>
                          <TextInput onChangeText={(txt)=>{this.setState({caption:txt})}} multiline={true} placeholder="บอกอะไรให้ลูกค้าทราบ..." style={{marginLeft:10,fontSize:18,width:'96%',fontFamily:'kanitRegular'}}></TextInput>
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


      

      <FlatList
        data={this.props.post}
        keyExtractor = {item=>item.id}
        renderItem={this.renderItem}
        refreshing={this.state.refreshing}
        onRefresh={this.refresh}
        ref={(ref) => { this.flatListRef = ref; }}
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
      del:(data)=>dispatch(deletePost(data)),
      edit:(data)=>dispatch(editPost(data))
    }
  }
  
  const mapStateToProps=(state)=>{
    return{
      post:state.postReducer.postList,
      type:state.profileReducer.profile,
    }
  }
export default connect(mapStateToProps,mapDispatchToProps)(Home);