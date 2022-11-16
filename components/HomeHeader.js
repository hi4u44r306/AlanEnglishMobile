import React, {useState} from "react";
import { View, Text, Image, TextInput } from "react-native";

import { COLORS, FONTS, SIZES, assets } from "../constants";
import { Brand } from "./Brand";

import firebase from 'firebase/app';
import 'firebase/firestore';

const HomeHeader = ({ onSearch }) => {

  const db = firebase.firestore();
  const [navusername, setnavUsername] = useState();
  const currentDate = new Date().toJSON().slice(0, 10);
  const currentMonth = new Date().toJSON().slice(0, 7);
  const [dailytimeplayed, setDailyTimeplayed] = useState();
  const percentage = dailytimeplayed*100/20;
  const custompathColor = `#89aae6`


  const getUserInfo = (user) =>{  //從firestore取得 student 集合中選取符合user.uid的資訊
    if(user){
        db.collection('student').doc(user.uid).get().then( doc => {
            setnavUsername(doc.data().name)
            // if(doc.data().Resetallmusic === currentMonth+'alreadyupdated'){
              // setUpdated(`${currentMonth}'月次數已歸零'`)
            // }else{
              // setUpdated('尚未歸零')
            // }
        }, err =>{
            console.log(err.message);
        });
        db.collection('student').doc(user.uid).collection('Logfile').doc(currentMonth).collection(currentMonth).doc(currentDate).get().then((doc)=>{
          setDailyTimeplayed(doc.data().todaytotaltimeplayed);
        }).catch(()=>{
            setDailyTimeplayed("0")
        })
    }else{
  
    }
  }    

  firebase.auth().onAuthStateChanged(user => {
      if(user){
          db.collection('student').onSnapshot(snapshot =>{
              getUserInfo(user);
          }, err =>{
              console.log(err.message);
          });
      }else{
          getUserInfo();
      }
  })
  return (
    <View
      style={{
        backgroundColor: COLORS.ricewhite,
        padding: SIZES.font,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignContent:'center',
          alignItems: "center",
        }}
      >
        <Brand fontSize={18} margin={1}/>
        <View style={{ width: "fit-content", height: 45, justifyContent:'center' }}>
          <Text
            style={{
              fontFamily: FONTS.bold,
              fontSize: SIZES.large,
              color: COLORS.primary,
            }}
          >
            {/* <Image
              source={assets.person01}
              resizeMode="contain"
              style={{ width: "100%", height: "100%" }}
            />
            <Image
              source={assets.badge}
              resizeMode="contain"
              style={{
                position: "absolute",
                width: 15,
                height: 15,
                bottom: 0,
                right: 0,
              }}
            /> */}
            {navusername || "Loading..."} 👋
          </Text>
        </View>
      </View>

      <View style={{ marginVertical: SIZES.font }}>
        {/* <Text
          style={{
            fontFamily: FONTS.regular,
            fontSize: SIZES.small,
            color: COLORS.primary,
          }}
        >
          Hello {navusername || "Loading..."} 👋
        </Text> */}

        <Text
          style={{
            fontFamily: FONTS.bold,
            fontSize: SIZES.large,
            color: COLORS.primary,
            marginTop: SIZES.base / 2,
          }}
        >
          Let's learn English
        </Text>
      </View>

      <View style={{ marginTop: SIZES.font }}>
        <View
          style={{
            width: "100%",
            borderRadius: SIZES.font,
            backgroundColor: COLORS.primary,
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: SIZES.font,
            paddingVertical: SIZES.small - 2,
          }}
        >
          <Image
            source={assets.search}
            resizeMode="contain"
            style={{ width: 20, height: 20, marginRight: SIZES.base }}
          />
          <TextInput
            placeholder="Search Tracks........"
            style={{ flex: 1 , color: COLORS.white}}
            onChangeText={onSearch}
          />
        </View>
      </View>
    </View>
  );
};

export default HomeHeader;
