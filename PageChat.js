import React, { Component } from 'react';
import moment from 'moment';
import {
  View, Text, StyleSheet, Image, FlatList, TextInput, TouchableOpacity
} from 'react-native';

import { connect } from 'react-redux';
import { saveProfile } from './actions/profile';

import firestore from "./firebase/Firestore"
import { MaterialCommunityIcons } from '@expo/vector-icons';
class PageChat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      id:this.props.profile.id,
      text:null,
    };
    const { route } = this.props;
    this.username = route.params.username;
    this.room = route.params.roomID;
    console.log("Username :" + this.username + " Room: "+this.room)
  }
  async componentDidMount(){
    await firestore.listeningMessage(this.room,this.listeningSuccess,this.unsuccess)
  }
  componentWillUnmount(){
    console.log("componentWillUnmount")
  }
  listeningSuccess=(messages)=>{
    console.log("listeningSuccess message")
    console.log(messages)
    var message=[]
    messages.forEach(function(data){
          let mes=data
          // mes.createdDate=new Date(data.createdDate);
          mes.createdDate=data.createdDate.toDate();
          message.push(mes)
      })
    message.sort((a,b)=>a.createdDate.getTime()-b.createdDate.getTime())
    console.log(message)
    this.setState({messages:this.state.messages.concat(message)})
  }
  onSend= async ()=>{
    const a = new Date();
    let newMessages={
      sender: this.state.id,
      roomId:this.room,
      content:this.state.text,
      createdDate:a
    }
    console.log(newMessages)

    if(this.state.text!==null){
      await firestore.sendMessage(newMessages,this.sendSuccess,this.unsuccess);
    }
  }
  sendSuccess=(docRef)=>{
    console.log(docRef.id)
    //this.setState({text:null})
  }
  unsuccess=(error)=>{
    console.log(error)
  }
  renderSeparator = () => {
    return (
      <View
        style={{
          height: 8,
        }}
      />
    );
  };
  renderItem = ({ item }) => {
    return (
      <View style={{marginRight:10}}>
        {item.sender===this.state.id &&
        <View style={{flexDirection:"row",justifyContent:"flex-end"}}>
          <View style={styles.Sender}>
              <Text style={styles.txtSender} >{item.content}</Text>
              <Text style={styles.time}>{moment(item.createdDate).fromNow()}</Text>
          </View>
          
       </View>}

       {item.sender!==this.state.id &&
        <View style={{flexDirection:"row",borderRadius:20}}>
          <View style={styles.Receiver}>
              <Text style={styles.txtReceiver}>{item.content}</Text>
              <Text style={styles.time}>{moment(item.createdDate).fromNow()}</Text>
          </View>
       </View>}
      </View>
    );
  }

  render(props) {
    return (
        <View style={{ flex: 1,backgroundColor: '#E5E5E5' }}>
          <View style={styles.content}>
            <FlatList
              data={this.state.messages}
              renderItem={this.renderItem}
              keyExtractor={item => item.id}
              ItemSeparatorComponent={this.renderSeparator}
              ref={(ref) => { this.flatListRef = ref; }}
              onContentSizeChange={() => this.flatListRef.scrollToEnd()}
            />
          </View>

        <View style={styles.chatContent}>
          <TextInput
            placeholder="Message"
            style={styles.textInput}
            //value={this.state.Text}
            onChangeText={txt => { this.setState({ text: txt }) }} />

          <TouchableOpacity
            onPress={this.onSend}>
            <MaterialCommunityIcons name="send-circle" size={50} color="#C4C4C4" />
          </TouchableOpacity>
        </View>
      </View >
    );
  }
}
const styles = StyleSheet.create({
  textInput: {
    height:45,
    flex: 1,
    borderColor: 'gray',
    paddingStart: 20,
    backgroundColor:'#C4C4C4',
    borderRadius:30,
    margin:5,
    fontFamily:'kanitLight',
    fontSize:18
  },
  content: {
    flex: 1,
    padding: 16,
    marginBottom: 8,
    width: "100%",
  },
  chatContent: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "gray",
    backgroundColor:'black'
  },
  Receiver: {
    flexWrap:'wrap',
    borderTopRightRadius:20,
    borderTopLeftRadius:20,
    borderBottomRightRadius:20,
    padding:8,
    flexShrink:1,
    backgroundColor: "#C0C0C0",

  },
  Sender: {
    flexWrap:'wrap',
    borderTopLeftRadius:20,
    borderTopRightRadius:20,
    borderBottomLeftRadius:20,
    padding:8,
    marginLeft:8,
    flexShrink:1,
    backgroundColor: "#ffffff",
  },
  txtSender:{
    color:'black',
    fontSize:18,
    fontFamily:'kanitLight'
  },
  txtReceiver:{
    color:'black',
    fontSize:18,
    fontFamily:'kanitLight'
  },
  time:{
    alignSelf:'flex-end',
    color:'gray',
    fontFamily:'kanitLight'
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

export default connect(mapStateToProps, mapDispatchToProps)(PageChat);