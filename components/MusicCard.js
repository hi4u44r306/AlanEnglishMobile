import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { COLORS, SIZES } from "../constants";
import { MusicTitle } from "./SubInfo";
import { PlayButton } from "./Button";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentMargin, setCurrentPlaying, setMusicPlayerDisplay } from "./actions/actions";
import { child, off, onValue, ref as rtdbRef } from "firebase/database";
import { getDownloadURL, getStorage, ref as storageRef } from "firebase/storage"
import { rtdb } from "../screens/firebase-config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRoute } from "@react-navigation/native";
import { getAuth } from "firebase/auth";

const MusicCard = ((props) => {
  const [audioURL, setAudioURL] = useState('');
  const dispatch = useDispatch();
  const { bookname, musicName, page } = props.music;
  const [complete, setComplete] = useState();
  const [musicplay, setMusicPlay] = useState();
  const convertmusicName = bookname + ' ' + page;
  // const convertmusicName = bookname + ' ' + musicName.replace(/^(.*?)\/(.*?)\.mp3$/, '$2');
  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    const dbRef = rtdbRef(rtdb);
    const completeRef = child(dbRef, `student/${user.uid}/MusicLogfile/${convertmusicName}/complete`);
    const musicplayRef = child(dbRef, `student/${user.uid}/MusicLogfile/${convertmusicName}/musicplay`);

    onValue(musicplayRef, (snapshot) => {
      if (snapshot.exists()) {
        setMusicPlay(snapshot.val());
        console.log(snapshot.val());
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
  }, [convertmusicName]);

  async function fetchAudioURL() {
    const storage = getStorage();
    try {
      const audioPath = storageRef(storage, `Music/${musicName}`);
      const audioDownloadURL = await getDownloadURL(audioPath);
      setAudioURL(audioDownloadURL);
      return audioDownloadURL;
    } catch (error) {
      console.error("Error fetching audio URL:", error);
    }
  }

  function handlePlay() {
    fetchAudioURL();
    if (!musicName) {
      console.error("Music name is undefined.");
      return;
    }
    dispatch(setCurrentMargin(65))
    dispatch(setMusicPlayerDisplay('flex'))
    dispatch(setCurrentPlaying({ ...props.music, audioURL }));
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
            musicplay={musicplay}
            complete={complete}
          />
          <PlayButton handlePress={handlePlay} />
        </View>
      </View>
    </View>
  );
});

export default MusicCard;

const styles = StyleSheet.create({
  musiclist: {
    width: "100%",
    padding: 10,
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
