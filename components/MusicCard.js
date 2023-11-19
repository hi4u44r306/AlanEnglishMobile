import React, { useState } from "react";
// import {useDispatch} from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { StyleSheet, View } from "react-native";

import { COLORS, SIZES, SHADOWS } from "../constants";
import { Timeplayed, MusicTitle, GameScore } from "./SubInfo";
import { PlayButton, GameButton } from "./Button";
import firebase from 'firebase/app';

import { useDispatch } from "react-redux";
import { setCurrentMargin, setCurrentPlaying, setMusicPlayerDisplay } from "./actions/actions";


const MusicCard = React.memo((props) => {
  const { music } = props;
  const dispatch = useDispatch();
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
      // const convertmusicid = "'" + data.id + "'";
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
      // console.log('no data');
    }
  }

  function handlePlay() {
    console.log('Play button pressed');
    dispatch(setMusicPlayerDisplay('flex'))
    dispatch(setCurrentPlaying(music));
    dispatch(setCurrentMargin(75))
    // props.onclickmusic(music);
  }
  function handleStop() {
    dispatch(setCurrentPlaying());
  }

  return (
    <View
      style={{
        backgroundColor: COLORS.white,
        // ...SHADOWS.medium,
      }}
    >
      <View style={styles.musiclist}>
        <View style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          alignContent: 'center',
        }}>
          <MusicTitle
            title={music.bookname}
            subTitle={music.page}
            titleSize={SIZES.large}
            subTitleSize={SIZES.small}
          />
          <PlayButton handlePress={handlePlay} />
          {/* <PlayButton handlePress={() => onclickmusic(data)} /> */}
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
});

export default MusicCard;

const styles = StyleSheet.create({
  musiclist: {
    width: "100%",
    paddingLeft: 10,
    paddingRight: 10,
    justifyContent: 'center',
    alignContent: 'center',
    borderBottomColor: 'gray',
    borderBottomWidth: 1,
    borderBottomStyle: 'solid',
  },
})
