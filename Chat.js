import moment from 'moment';
import React, { Component } from 'react';
import {
  View,Text,StyleSheet,Image,FlatList,TouchableOpacity,TextInput
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { connect } from 'react-redux';
import { saveProfile } from './actions/profile';
import firestore from "./firebase/Firestore"
class Chat extends Component {
  constructor(props){
    super(props);
     this.state = {
       roomId:null,
       items:[],
    };
  }
  componentDidMount(){
    firestore.getFriend(this.props.profile.id,this.getFriendSuccess,this.unsucess);
  }
  getFriendAccountSuccess=(doc)=>{
    console.log("getFriendAccountSuccess")
    let account = doc.data();
    account.roomId = this.state.roomId;
    this.setState({items:this.state.items.concat(account)});
    console.log(account)
  }
  getFriendSuccess=(querySnapshot)=>{
    if(querySnapshot.docs.length>0){
      var myID = this.props.profile.id;
      this.setState({items:[]});
      var friend=[]
      var roomID=[]
      querySnapshot.forEach(function(doc){
        let friendID = null
        if(doc.data().member[0]==myID){
          friendID = doc.data().member[1];
        }else{
          friendID = doc.data().member[0];
        }
        roomID.push(doc.id)
        friend.push(friendID);
      });
      for(let i=0;i<friend.length;i++){
        this.setState({roomId:roomID[i]})
        firestore.getAccountWithID(friend[i],this.getFriendAccountSuccess,this.unsucess);
      }
    }
  }
  unsucess=(error)=>{
    console.log(error)
  }
  Header=()=>{
    return(
      <View style={styles.header}>
        <FontAwesome name="search" size={24} color="gray" style={styles.icons}/>
        <TextInput style={styles.inputHeader} placeholder="Search" ></TextInput>
      </View>
    )
    
  }
  renderSeparator = () => {
    return (
      <View
        style={{
          height: 1,
          backgroundColor: "#dddddd",
          marginHorizontal:10
        }}
      />
    );
  };
  renderItem=({item})=>{
    return(
      <View style={{marginHorizontal:10}}>
        <TouchableOpacity style={{backgroundColor:"#E5E5E5"}}  onPress={()=>this.props.navigation.navigate("PageChat",{roomID:item.roomId,username:item.name})} >
            <View style={styles.container}>
                <View style={styles.lefContainer}>
                  <Image style={styles.profile} source={{uri:item.avatar}}/>
                    <View style={styles.midContainer}>
                      <Text style={styles.name}>{item.name}</Text>
                      <Text style={styles.lastMessage} numberOfLines={1}>{this.props.profile.caption}</Text>
                    </View>
                </View>
                {/* <Text style={styles.time}>{moment(item.lastMessage.createdAt).format("DD/MM/YYYY")}</Text> */}
	        </View>
        </TouchableOpacity>
      </View>
    );
  }
  render(props) {
    const { navigation } = this.props;
    return (
      <View style={{flex:1}}>
        <this.Header/>
        <FlatList
          style={{width:"100%"}}
          data={this.state.items}
          renderItem={this.renderItem}
          keyExtractor={item => item.id}
          ItemSeparatorComponent={this.renderSeparator}
        />
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container:{
    flexDirection:'row',
    width:'100%',
    justifyContent:'space-between',
    padding: 10,
    // marginVertical: 8,
  },
  lefContainer:{
    flexDirection:'row',
  },
  midContainer:{
    justifyContent:'space-around',
  },
  profile:{
    height:60,
    width:60,
    borderRadius:50,
    borderWidth:3,
    marginRight:15,
    borderColor:'white'
  },
  name: {
    fontSize: 18,	
    fontFamily:'kanitSemiBold'
    },
  lastMessage:{
    fontSize:16,
    color:'gray',
    width:100,
    fontFamily:'kanitLight'
  },
  time:{
    fontSize:16,
    color:'gray',
    fontFamily:'kanitLight'
  },
  inputHeader:{
    flex: 1,
    fontSize:20,
    fontFamily:'kanitLight'
  },
  icons:{
    padding: 2,
    margin: 5,
    alignItems: 'center',
  },
  header:{
    flexDirection:'row',
    justifyContent: 'center',
    alignItems: 'center',
    height:50,
    borderRadius: 20,
    margin:15,
    backgroundColor:'#E5E5E5'
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
  
export default connect(mapStateToProps, mapDispatchToProps)(Chat);