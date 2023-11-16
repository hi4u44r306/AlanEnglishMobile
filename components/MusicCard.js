import React, { useState } from "react";
// import {useDispatch} from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { View } from "react-native";

import { COLORS, SIZES, SHADOWS } from "../constants";
import { Timeplayed, MusicTitle, GameScore } from "./SubInfo";
import { PlayButton, GameButton } from "./Button";
import firebase from 'firebase/app';
import { Audio } from 'expo-av';


const MusicCard = ({ data, onclickmusic }) => {
  const navigation = useNavigation();
  const db = firebase.firestore();

  firebase.auth().onAuthStateChanged(user => {
    if (user) {
      db.collection('student').onSnapshot(() => {
        getUserInfo(user);
      });
    } else {
      getUserInfo();
    }
  })

  const getUserInfo = (user) => {
    if (user) {
      const convertmusicid = "'" + data.id + "'";
      // db.collection('student').doc(user.uid).collection('Musics').doc(convertmusicid).get().then((doc) => {
      //   setTimesplayed(doc.data().timeplayed);
      // })
      // db.collection('student').doc(user.uid).collection('Musics').doc(convertmusicid).get().then((doc)=>{
      //     setGamescore(doc.data().gamescore);
      // })

      // .catch((err)=>{
      //     console.log("There no data for some ID", err)
      // })
    } else {
      console.log('no data');
    }
  }

  return (
    <View
      style={{
        backgroundColor: COLORS.white,
        ...SHADOWS.medium,
      }}
    >
      <View style={{ width: "100%", padding: SIZES.font, justifyContent: 'center', alignContent: 'center' }}>
        <View style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          alignContent: 'center',
        }}>
          <MusicTitle
            title={data.bookname}
            subTitle={data.page}
            titleSize={SIZES.large}
            subTitleSize={SIZES.small}
          />
          {/* <PlayButton handlePress={onclickmusic} /> */}
          <PlayButton handlePress={() => onclickmusic(data)} />
        </View>
        {/* <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            alignContent: 'center',
          }}
        >
          <GameButton
            minWidth={10}
            fontSize={SIZES.font}
            handlePress={() => navigation.navigate("Details", { data })}
          />
        </View> */}
      </View>
    </View>
  );
};

export default MusicCard;
