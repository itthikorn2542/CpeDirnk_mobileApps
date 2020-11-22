import React, { Component } from 'react';
import {
  View,Text,StyleSheet,FlatList,Image,TouchableOpacity,Modal,TextInput
} from 'react-native';
import Constants from 'expo-constants';
import { FontAwesome5 } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import * as meno from './meno.json';
import * as listFood from './listFood.json';

class Food extends Component {
  constructor(props){
    super(props);
    this.state = {
      selectedID:1,
      searchText:null,
      showModal:false,
      id:1,
      count:1,
      catagory:""
   };
  }
  renderSeparator=()=>{
    return(
      <View style={{height:1,backgroundColor:'black'}}></View>
    );
  }
  renderItem=({item})=>{
    let backgroundColor = null;
    let textcolor = "black";
    if(this.state.selectedID==item.id){
      backgroundColor="#FB7070";
      textcolor = "white";
    }
    else{
      backgroundColor="white"
    }
    return(
      <View style={{marginLeft:20}}>
        <TouchableOpacity onPress={()=>{this.setState({selectedID:item.id})}} style={{backgroundColor:backgroundColor,borderRadius:5}}>
        <View style={styles.menuStyle}>
              <Text style={{margin:5,fontSize:11,color:textcolor,fontFamily:'kanitRegular'}}>{item.name}</Text>
        </View>
        </TouchableOpacity>
      </View>
    );
  };
  countMinus=()=>{
    if(this.state.count>1){
      this.setState({count:this.state.count-1})
    }
  }
  renderFood=({item})=>{
    return(
      <View style={{padding:8}}>
        <TouchableOpacity onPress={()=>{this.setState({showModal:true}),this.setState({id:item.id})}}>
          <View style={styles.foodBar}>
            <View style={{flex:1,height:120,justifyContent:'center'}}>
              <Image source={{uri:item.url}} style={{height:80,width:80,marginLeft:15,borderRadius:15}}/>
            </View>

            <View style={{flex:1,height:120,justifyContent:'center'}}>
                <Text style={{fontSize:20,fontFamily:'kanitRegular'}}>{item.name}</Text>
            </View>

            <View style={{flex:1,height:120,justifyContent:'center'}}>
                <Text style={{marginRight:10,marginLeft:30,fontSize:20,fontFamily:'kanitRegular'}}>{item.price+" บาท"}</Text>
            </View>
            
            
          </View>

          {item.id==this.state.id&&
          <Modal transparent={true} visible={this.state.showModal} animationType="slide">
            <View  style={{backgroundColor:'#00000060',flex:1,justifyContent:'center',alignItems:'center'}}>
                <View style={styles.viewModal}>
                    <View style={{height:'10%',width:'100%',borderRadius:10,justifyContent:'center',alignItems:'center',flex:2}}>
                        <Text style={{fontSize:20,fontFamily:'kanitSemiBold'}}>การสั่งซื้อ</Text>
                    </View>
                    <View style={{height:1,backgroundColor:'#656565'}}></View> 
                    <View style={{flex:10,alignItems:'center'}}>
                      <View style={{height:140,width:140,borderRadius:20,marginTop:30,justifyContent:'center',alignItems:'center',borderWidth:1}}>
                        <Image source={{uri:item.url}} style={{height:120,width:120,borderRadius:10}}></Image>
                      </View>
                        
                        <Text style={{fontSize:20,marginTop:15,fontFamily:'kanitSemiBold'}}>{item.name}</Text>
                        <Text style={{fontSize:15,marginTop:35,fontFamily:'kanitSemiBold'}}>โต๊ะ</Text>
                        <View style={{borderWidth:1,height:52,width:'40%',borderRadius:35,justifyContent:'center',alignItems:'center'}}>
                          <TextInput  keyboardType='number-pad'  placeholder="กรอกเลขโต๊ะ" style={{fontFamily:'kanitSemiBold',textAlign:'center'}}></TextInput>
                        </View>
                        <Text style={{fontSize:15,marginTop:25,fontFamily:'kanitSemiBold'}}>จำนวน</Text>
                        <View style={{flexDirection:'row',marginTop:2}}>
                          <TouchableOpacity onPress={this.countMinus}>
                            <View style={styles.minusStyle}>
                          <Text style={{fontFamily:'kanitSemiBold',fontSize:20,color:'white'}}>&#8722;</Text></View>
                          </TouchableOpacity>
                          
                          <View style={{borderWidth:1,height:52,width:'40%',borderRadius:35,justifyContent:'center',alignItems:'center'}}><Text style={{fontFamily:'kanitSemiBold'}}>{this.state.count}</Text></View>
                           <TouchableOpacity onPress={()=>{this.setState({count:this.state.count+1})}}>
                            <View style={styles.plusStyle}>
                                <Text style={{fontFamily:'kanitSemiBold',fontSize:20,color:'white'}}>&#43;</Text>
                            </View>
                           </TouchableOpacity>
                           
                        </View>
                      <Text style={{fontSize:15,marginTop:15,fontFamily:'kanitSemiBold'}}>{"ราคา: "+item.price*this.state.count}</Text>
                    </View>
                    <View style={{height:1,backgroundColor:'#656565'}}></View> 
                    <View style={{flex:2,justifyContent:'center',flexDirection:'row'}}>
                    <TouchableOpacity onPress={()=>{this.setState({showModal:false}),this.setState({count:1})}}>
                    <View style={{alignItems:'center',justifyContent:'center',marginRight:80}}>
                         <Text style={{fontFamily:'kanitSemiBold',fontSize:17,marginTop:40}}>ยกเลิก</Text>
                      </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=>{this.setState({showModal:false}),this.setState({count:1})}}>
                      <View style={{justifyContent:'center',alignItems:'center',marginLeft:80}}>
                         <Text style={{fontFamily:'kanitSemiBold',color:'#8B63FB',fontSize:17,marginTop:40}}>สั่งซื้อ</Text>
                      </View>
                    </TouchableOpacity>
                    </View>
                </View>
            </View>
          </Modal>}
        </TouchableOpacity>
        
      </View>
    );
  }

  render(props) {
    const { navigation } = this.props;
    return (
      <View style={{flex:1}}>
            <View style={{height:50,width:'100%'}}>
              <FlatList
            horizontal
            data={meno.food}
            keyExtractor = {item=>item.id,item=>item.type}
            renderItem={this.renderItem}
            ItemSeparatorComponent={this.renderSeparator}
            ref={(ref)=>{this.FlatListRef=ref}}
            />
            </View>
              <FlatList
                data={listFood.list}
                keyExtractor = {item=>item.id}
                renderItem={this.renderFood}
                //ItemSeparatorComponent={this.renderSeparator}
                ref={(ref)=>{this.FlatListRef=ref}}
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
  foodBar:{backgroundColor:'white',
  height:120,
  width:'94%',
  borderRadius:10,
  //borderWidth:1,
  flexDirection:'row',
  alignItems:'center',
  marginLeft:10,
  shadowColor: "#000",
  shadowOffset: {
    width: 0,
    height: 3,
  },
  shadowOpacity: 0.27,
  shadowRadius: 4.65,

  elevation: 6,
  },
  menuStyle:{
    height:27,
    width:'100%',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,

    elevation: 3,
  },
  viewModal:{
    backgroundColor:'white',
    height:700,
    width:350,
    borderRadius:10,
  },
  minusStyle:{
    height:50,
    width:50,
    borderRadius:25,
    backgroundColor:'gray',
    justifyContent:'center',
    alignItems:'center',
    shadowOffset: {
    width: 0,
    height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  plusStyle:{
    height:50,
    width:50,
    borderRadius:25,
    backgroundColor:'#00B2FF',
    justifyContent:'center',
    alignItems:'center',
    shadowOffset: {
    width: 0,
    height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  }
  });


export default Food;