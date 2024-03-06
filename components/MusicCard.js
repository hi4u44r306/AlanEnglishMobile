import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { COLORS, SIZES } from "../constants";
import { MusicTitle } from "./SubInfo";
import { PlayButton } from "./Button";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentMargin, setCurrentPlaying, setMusicPlayerDisplay } from "./actions/actions";
import { child, onValue, ref } from "firebase/database";
import { rtdb } from "../screens/firebase-config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AntDesign, FontAwesome5 } from "@expo/vector-icons";

const MusicCard = ((props) => {

  const dispatch = useDispatch();
  const { playlists } = useSelector(state => state.musicReducer);
  const currentTrackID = playlists.findIndex(obj => obj.musicName === props.music.musicName);
  const [complete, setComplete] = useState();
  const [musicplay, setMusicPlay] = useState();
  const convertmusicName = props.music.musicName.replace(/^(.*?)\/(.*?)\.mp3$/, '$2');

  useEffect(() => {
    async function fetchMusicData() {
      // 次數通過
      const dbRef = ref(rtdb);
      const completeRef = child(dbRef, `student/${await AsyncStorage.getItem('ae-useruid')}/MusicLogfile/${convertmusicName}/complete`);
      const musicplayRef = child(dbRef, `student/${await AsyncStorage.getItem('ae-useruid')}/MusicLogfile/${convertmusicName}/musicplay`);

      onValue(musicplayRef, (snapshot) => {
        if (snapshot.exists()) {
          setMusicPlay(snapshot.val());
        } else {
          setMusicPlay(); // If data doesn't exist, setComplete to its default value
        }
      }, (error) => {
        alert("Error fetching complete value:", error);
      });

      onValue(completeRef, (snapshot) => {
        if (snapshot.exists()) {
          setComplete(snapshot.val());
        } else {
          setComplete(); // If data doesn't exist, setComplete to its default value
        }
      }, (error) => {
        alert("Error fetching complete value:", error);
      });
    }

    fetchMusicData();
  }, [convertmusicName]);

  function handlePlay() {
    dispatch(setCurrentMargin(65))
    dispatch(setMusicPlayerDisplay('flex'))
    dispatch(setCurrentPlaying({ ...props.music, index: currentTrackID }));
  }


  return (
    <View style={{ backgroundColor: COLORS.white, }}>
      <View style={styles.musiclist}>
        <View style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          alignContent: 'center',
        }}>
          <MusicTitle
            title={props.music.bookname}
            subTitle={props.music.page}
            titleSize={SIZES.large}
            subTitleSize={SIZES.small}
          />
          <PlayButton handlePress={handlePlay} />
        </View>
        <View style={styles.labelcontainer}>
          <View style={styles.quizlabel}>
            <Text style={styles.quizlabeltext}>播放次數 : {musicplay || 0} 次</Text>
          </View>
          <View style={styles.quizlabel}>
            <Text style={styles.quizlabeltext}>通過 :</Text>
            <Text style={styles.quizlabeltext}>
              {
                complete === '通過'
                  ?
                  <AntDesign name={"checkcircle"} style={styles.timeplayed} />
                  :
                  <AntDesign name={"closecircle"} style={styles.timeplayednotcomplete} />
              }
            </Text>
          </View>
        </View>
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
    paddingBottom: 10,
    justifyContent: 'center',
    alignContent: 'center',
    borderBottomColor: 'gray',
    borderBottomWidth: 1,
    borderBottomStyle: 'solid',
  },
  labelcontainer: {
    flexDirection: 'row',
    gap: 20,
    alignContent: 'center',
    justifyContent: 'center',
  },
  quizlabel: {
    backgroundColor: 'yellow',
    padding: 10,
    borderRadius: 10,
    flexDirection: 'row',
    fontFamily: "Nunito",
    fontWeight: '700',
    textAlign: 'center',
    marginRight: 10,
    gap: 15,
  },
  quizlabeltext: {
    fontSize: 16,
    fontWeight: '800',
  },
  timeplayed: {
    display: 'flex',
    color: '#8bc34a',
    fontWeight: '700',
    fontSize: 20,
    textAlign: 'center',
    justifyContent: 'space-around',
  },
  timeplayednotcomplete: {
    display: 'flex',
    color: '#ed3d3d',
    fontWeight: '700',
    fontSize: 20,
    textAlign: 'center',
    justifyContent: 'space-around',
  },
})
