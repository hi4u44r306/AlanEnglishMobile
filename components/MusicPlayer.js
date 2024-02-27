import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Animated, Dimensions, ActivityIndicator } from 'react-native';
import { COLORS, SIZES } from '../constants';
import { AntDesign } from '@expo/vector-icons';
import { useDispatch, useSelector } from "react-redux";
import { Audio } from 'expo-av';
import { setCurrentMargin, setCurrentPlaying, setMusicPlayerDisplay } from './actions/actions';
import { getDownloadURL, getStorage, ref } from 'firebase/storage';

export default function MusicPlayer({ music }) {
  const { musicplayerdisplay } = useSelector(state => state.musicReducer);
  const [{ bookname, page }, setCurrTrack] = useState(music);
  const { duration, tabbarheight, musicplayerheight } = useSelector(state => state.screenReducer);
  const animatedOpacity = useRef(new Animated.Value(0)).current;
  const [isPlaying, setIsPlaying] = useState(false);
  const dispatch = useDispatch();
  const [currentTrackIndex, setCurrentTrackIndex] = useState(null);
  const [musicisloading, setMusicIsLoading] = useState(false);
  const sound = useRef(new Audio.Sound());
  // const { playlists } = useSelector(state => state.musicReducer);

  const [dimensions, setDimesions] = useState({ window: Dimensions.get('window') });

  useEffect(() => {
    const subscription = Dimensions.addEventListener("change", ({ window }) => {
      setDimesions({ window });
    });
    return () => subscription?.remove();
  })

  const { window } = dimensions;
  const windowWidth = window.width;
  const windowHeight = window.height;

  // 可以在IOS靜音模式播放音樂 像Youtube Music一樣
  useEffect(() => { Audio.setAudioModeAsync({ playsInSilentModeIOS: true }); });

  useEffect(() => {
    setCurrTrack(music);
    if (music) {
      const musicid = music.index;
      playSound(musicid);
    }
  }, [music])

  useEffect(() => {
    Animated.timing(animatedOpacity, {
      toValue: musicplayerdisplay === 'flex' ? 1 : 0,
      duration: duration,
      useNativeDriver: false,
    }).start();
  }, [musicplayerdisplay]);

  const closemusicplayer = async () => {
    Animated.timing(animatedOpacity, {
      toValue: 0,
      duration: duration,
      useNativeDriver: false,
    }).start();
    sound.current.stopAsync();
    dispatch(setCurrentMargin(0));
    // Add closing animation
    dispatch(setMusicPlayerDisplay('none'));
  };

  const pauseSound = async () => {
    if (sound) {
      await sound.current.pauseAsync();
      setIsPlaying(false);
    }
  };

  const resumeSound = async () => {
    if (sound) {
      await sound.current.playAsync();
      setIsPlaying(true);
    }
  };

  // const handleClickNext = () => {
  //   console.log('Next Track')
  //   let abc = music.index + 1;
  //   if ((music.index + 1) >= playlists.length) {
  //     abc = 0;
  //   }
  //   dispatch(setCurrentPlaying(playlists[abc]));
  // };

  async function playSound(musicid) {
    setMusicIsLoading(true);
    if (currentTrackIndex !== null || currentTrackIndex === musicid) {
      await sound.current.stopAsync(); // Stop the currently playing sound
      console.log('stop sound')
      await sound.current.unloadAsync(); // Unload the sound
    }
    const storage = getStorage();
    const musicRef = ref(storage, `Music/${music.musicName}`);
    const downloadURL = await getDownloadURL(musicRef);
    const { sound: newSound } = await Audio.Sound.createAsync({ uri: downloadURL });
    sound.current = newSound;
    setCurrentTrackIndex(musicid); // Update the current track index here
    await sound.current.playAsync();
    setIsPlaying(true);
    setMusicIsLoading(false);
  }

  return (
    <Animated.View style={{
      display: musicplayerdisplay,
      position: 'absolute',
      bottom: tabbarheight,
      width: '100%',
      justifyContent: 'center',
      alignItems: 'center',
      opacity: animatedOpacity,
    }}>
      <View style={[styles.container, { height: musicplayerheight }]}>
        <View style={styles.controlsContainer}>
          <TouchableOpacity onPress={closemusicplayer}>
            <AntDesign name="close" size={24} style={styles.controlIcon} />
          </TouchableOpacity>
        </View>
        {/* Image */}
        <Image source={require('../assets/img/headphone.png')} style={styles.image} />

        {/* Details */}
        <View style={styles.detailsContainer}>
          <Text style={styles.bookName}>{bookname}</Text>
          <Text style={styles.page}>{`Page ${page}`}</Text>
        </View>


        <View style={styles.controlsContainer}>
          {
            musicisloading ?
              (
                <ActivityIndicator size={30} color="black" style={styles.controlIcon} />
              )
              :
              (
                <TouchableOpacity onPress={() => {
                  if (isPlaying) {
                    pauseSound();
                  } else {
                    if (sound) {
                      resumeSound();
                    } else {
                      playSound();
                    }
                  }
                }}>
                  {isPlaying ? (
                    <AntDesign name="pause" size={30} color="black" style={styles.controlIcon} />
                  ) : (
                    <AntDesign name="play" size={30} color="black" style={styles.controlIcon} />
                  )}
                </TouchableOpacity>
              )
          }

          {/* <TouchableOpacity onPress={handleClickNext}>
            <AntDesign name="stepforward" size={30} color="black" style={styles.controlIcon} />
          </TouchableOpacity> */}
        </View>

      </View>
    </Animated.View>
  );
};



const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.musicplayer,
    padding: 10,
    paddingRight: 15,
    width: '100%',
  },
  image: {
    backgroundColor: COLORS.white,
    borderRadius: 10,
    width: 50,
    height: 50,
    marginRight: 18,
  },
  detailsContainer: {
    flex: 1,
  },
  bookName: {
    color: COLORS.black,
    fontSize: SIZES.medium,
    fontWeight: 'bold',
  },
  page: {
    color: COLORS.black,
    fontSize: SIZES.font,
  },
  controlsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  controlIcon: {
    marginHorizontal: 10,
    fontWeight: 600,
    color: COLORS.black
  },
});



