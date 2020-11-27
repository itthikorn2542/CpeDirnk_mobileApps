import React, { Component, memo } from 'react';
import {
  View,Text,StyleSheet,FlatList,Image,TouchableOpacity,Modal,TextInput
} from 'react-native';
import Constants from 'expo-constants';
import { FontAwesome5 } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import * as meno from './meno.json';
import * as listFood from './listFood.json';
import {connect} from 'react-redux';
import firestore from './firebase/Firestore'
import { MaterialIcons } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { addOrder, deleteOrder, saveOrder } from './actions/actionOrder';

class Food extends Component {
  constructor(props){
    super(props);
    this.state = {
      selectedID:1,
      foodID:null,
      searchText:null,
      showModalOrder:false,
      showModal:false,
      showModalBox:false,
      id:1,
      count:1,
      catagory:"",
      selectedMenu:1,
      order:[],
      name:null,
      price:null,
   };
  }


  // componentDidMount= async()=>{
  //   await firestore.getAllFood(this.success,this.reject)
  //  }
  renderSeparator=()=>{
    return(
      <View style={{height:1,backgroundColor:'black'}}></View>
    );
  }
  countMinus=()=>{
    if(this.state.count>1){
      this.setState({count:this.state.count-1})
    }
  }
  renderItem=({item})=>{
    let bg = "white"
    if(this.state.selectedMenu==item.id){
      bg = "#FB7070"
    }
    return(
        <View style={{padding:8}}>
          <View style={{height:60,width:90,justifyContent:'space-evenly',alignItems:'center'}}>
              <TouchableOpacity onPress={()=>{
                this.setState({selectedMenu:item.id})
                for(let i = 0;i<listFood.list.length;i++){
                  if(item.name===listFood.list[i].type){
                    this.FlatListRef.scrollToIndex({index:i});
                    this.setState({selectedID:listFood.list[i].id})
                  }
                  
                }
                if(item.name=="เมนู"){
                  this.FlatListRef.scrollToIndex({index:0});
                    this.setState({selectedID:listFood.list[0].id})
                }
                }}>
                <View style={{height:45,width:45,backgroundColor:bg,borderRadius:100,justifyContent:'center',alignItems:'center',borderWidth:1}}>
                  <Image source={{uri:item.url}} style={{height:25,width:25}}></Image>
              </View>
              </TouchableOpacity>
            </View>

        </View>
    );
  }
  renderFood=({item})=>{
    return(
      <View style={{padding:8}}>
        <TouchableOpacity onPress={()=>{this.setState({showModal:true}),this.setState({id:item.id}),this.setState({name:item.name}),this.setState({price:item.price})}}>
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
                          <TextInput  keyboardType='number-pad'  value={this.props.type.caption} style={{fontFamily:'kanitSemiBold',textAlign:'center'}}></TextInput>
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
                    <TouchableOpacity onPress={this.onOrder}>
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
  deleteSuccess=()=>{
    let food ={
        id:this.state.foodID
    }
    this.props.del(food)
    this.setState({showModalBox:false})
  }
  deleteUnsuccess=(error)=>{
    console.log(error)
  }
onDelete=async()=>{
  await firestore.deleteFoodByID(this.state.foodID,this.deleteSuccess,this.deleteUnsuccess);
}
renderOrder=({item})=>{
  return(
    <View style={{padding:8}}>
      <TouchableOpacity onPress={
        ()=>{
          this.setState({foodID:item.id}),
          this.setState({showModalBox:true})
        }}>
        <View style={styles.orderBar}>
          <View style={{flex:1,flexDirection:'row'}}>
              <View style={{backgroundColor:'black',height:40,width:40,borderTopLeftRadius:5,borderBottomRightRadius:10}}>
                  <Text style={{fontSize:20,margin:5,color:'white'}}>{item.table}</Text>
              </View>
              <View style={{height:50,width:290,justifyContent:'center',alignItems:'center'}}>
                    <Text style={{fontSize:20,fontFamily:'kanitSemiBold'}}>{item.name}</Text>
              </View>
          </View>
          <View style={{flex:1,flexDirection:'row',justifyContent:'space-evenly',alignItems:'center',borderTopWidth:2}}>
                <Text style={{fontSize:15,fontFamily:'kanitSemiBold'}}>จำนวน: {item.amount}</Text>
                <Text style={{fontSize:15,fontFamily:'kanitSemiBold'}}>ราคา: {item.price}</Text>
          </View>
        </View>
        </TouchableOpacity>
        
      </View>
  );
  
}
success=(querySnapshot)=>{
  var orders = []
    querySnapshot.forEach(function(doc){ 
      let order = doc.data()
      order.id  = doc.id
      orders = orders.concat(order)
    })
    this.props.save(orders);
    this.setState({order:orders})
    console.log(orders)
}
reject=(error)=>{
  console.log(error)
}
orderSuccess=(docRef)=>{
  this.setState({showModal:false});
  let foods=[];
    let food={
        id:docRef.id,
        name:this.state.name,
        price:this.state.price*this.state.count,
        table:this.props.type.caption,
        amount:this.state.count
    }
    foods=foods.concat(food)
    this.props.add(foods);
    console.log("++++++++++++++++++++++++++++++++++++++")
    console.log(foods);
    this.setState({name:null})
    this.setState({price:null})
    this.setState({count:1})
}
onOrder= async()=>{
  let food ={
    name:this.state.name,
    price:this.state.price,
    table:this.props.type.caption,
    amount:this.state.count
  }
  await firestore.addOrderFood(food,this.orderSuccess,this.reject)
}
  render(props) {
    
    return (
      <View style={{flex:1}}>
            <View style={{height:80,width:'100%'}}>
              <FlatList
                  horizontal
                  data={meno.food}
                  keyExtractor={item=>item.id}
                  renderItem={this.renderItem}
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
          {this.props.type.type=="Admin"&&
          <TouchableOpacity
          activeOpacity={0.7}
          onPress={async()=>{
            this.setState({showModalOrder:true})
            await firestore.getAllFood(this.success,this.reject)
          }}
          style={styles.touchableOpacityStyle}>
          <View style={styles.floatingButtonStyle}>
          <FontAwesome5 name="clipboard-list" size={24} color="white" />
          </View>
        </TouchableOpacity>}

        <Modal transparent={true} visible={this.state.showModalOrder} animationType='slide'>
          <View style={{backgroundColor:'#00000060',flex:1,justifyContent:'center',alignItems:'center'}}>
            <View style={{backgroundColor:'white',height:600,width:350,borderRadius:20}}>
              <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                  <Text style={{fontFamily:'kanitSemiBold',fontSize:20}}>รายการสั่งซื้อ</Text>
              </View>
              <View style={{height:1,width:'100%',backgroundColor:'#000000'}}></View>
              <View style={{flex:6,height:100,width:'100%'}}>
                
                  <FlatList
                      data={this.props.order}
                      keyExtractor={item=>item.id}
                      renderItem={this.renderOrder}
                  />
                  
              </View>
              <View style={{height:1,width:'100%',backgroundColor:'#000000'}}></View>
              <TouchableOpacity style={{flex:1,justifyContent:'center',alignItems:'center'}} onPress={()=>{this.setState({showModalOrder:false})}}>
                <View style={{height:60,width:60,borderRadius:100,backgroundColor:'#EF3D3D',justifyContent:'center',alignItems:'center'}}>
                  <FontAwesome name="close" size={24} color="white" />
                </View>
              </TouchableOpacity>
              

            </View>

          </View>

        </Modal>
    
        <Modal transparent={true} visible={this.state.showModalBox}>
            <View style={{flex:1,backgroundColor:'#00000060',justifyContent:'center',alignItems:'center'}}>
              <View style={{height:200,width:300,backgroundColor:'white',borderRadius:20}}>
                <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                        <Text style={{fontSize:20,fontFamily:'kanitSemiBold'}}>พร้อมเสิร์ฟลูกค้า?</Text>
                </View>
                <View style={{backgroundColor:'black',height:1,width:'100%'}}></View>
                <View style={{flex:1,flexDirection:'row',alignItems:'center'}}>
                  <TouchableOpacity style={{flex:1,alignItems:'center',justifyContent:'center'}} onPress={()=>{this.setState({showModalBox:false})}}>
                    <View style={{alignItems:'center'}}>
                      <Text style={{fontSize:20,fontFamily:'kanitSemiBold'}}>ยกเลิก</Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity style={{flex:1,alignItems:'center',justifyContent:'center'}} onPress={this.onDelete}>
                    <View style={{alignItems:'center'}}>
                      <Text style={{fontSize:20,fontFamily:'kanitSemiBold',color:'green'}}>ใช่</Text>
                    </View>
                  </TouchableOpacity>
                  
                  
                </View>

              </View>
            </View>
        </Modal>
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
  borderRadius:10,
  //borderWidth:1,
  flexDirection:'row',
  alignItems:'center',
  marginLeft:10,
  marginRight:10,
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
  },
  touchableOpacityStyle: {
    position: 'absolute',
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    right: 30,
    bottom: 30,
  },
  floatingButtonStyle: {
    resizeMode: 'contain',
    width: 60,
    height: 60,
    backgroundColor:'#FB7070',
    borderRadius:50,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,

    elevation: 6,
    justifyContent:'center',
    alignItems:'center'
    //backgroundColor:'black'
  },
  orderBar:{
    height:100,
    width:'100%',
    backgroundColor:'#C4C4C4',
    borderRadius:10,
    shadowColor: "#000",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.20,
    shadowRadius: 1.41,

    elevation: 2,

  }
  });
  const mapDispatchToProps=(dispatch)=>{
    return{
      save:(data)=>dispatch(saveOrder(data)),
      add:(data)=>dispatch(addOrder(data)),
      del:(data)=>dispatch(deleteOrder(data))
    }
    
  }
  const mapStateToProps=(state)=>{
    return{
      type:state.profileReducer.profile,
      order:state.orderReducer.orderList
    }
  }

export default connect(mapStateToProps,mapDispatchToProps)(Food);