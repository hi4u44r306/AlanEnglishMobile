import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { COLORS } from '../constants';
import { AntDesign } from '@expo/vector-icons';
import { useDispatch, useSelector } from "react-redux";

import { Audio } from 'expo-av';
import { setAutoPlay, setCurrentMargin, setMusicPlayerDisplay } from './actions/actions';


export default function MusicPlayer({ music }) {
  const { musicplayerdisplay } = useSelector(state => state.musicReducer);
  const [{ bookname, page, musicName }, setCurrTrack] = useState(music);
  const { duration } = useSelector(state => state.screenReducer);
  const { playlists, autoplay } = useSelector(state => state.musicReducer);
  const animatedOpacity = useRef(new Animated.Value(0)).current;
  const [isPlaying, setIsPlaying] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    setCurrTrack(music);

    Animated.timing(animatedOpacity, {
      toValue: musicplayerdisplay === 'flex' ? 1 : 0,
      duration: duration,
      useNativeDriver: false,
    }).start();
  }, [music, musicplayerdisplay]);



  const closemusicplayer = async () => {
    dispatch(setCurrentMargin(0));
    // Add closing animation
    Animated.timing(animatedOpacity, {
      toValue: 0,
      duration: duration,
      useNativeDriver: false,
    }).start();
    dispatch(setMusicPlayerDisplay('none'));
    setSound();
  };

  const pauseSound = async () => {
    if (sound) {
      await sound.pauseAsync();
      setIsPlaying(false);
    }
  };

  // const resumeSound = async () => {
  //   if (sound) {
  //     await sound.playAsync();
  //     setIsPlaying(true);
  //   }
  // };












  useEffect(() => {
    if (music) {
      playSound();
    }
  }, [music])



  const [currentTrackIndex, setCurrentTrackIndex] = useState(null);
  const sound = useRef(new Audio.Sound());

  async function playSound() {
    if (currentTrackIndex !== null) {
      await sound.current.stopAsync(); // Stop the currently playing sound
      await sound.current.unloadAsync(); // Unload the sound
    } else {

    }
    console.log('Loading Sound');
    const { sound: newSound } = await Audio.Sound.createAsync(require(`../assets/music/${musicName}`));
    sound.current = newSound;
    console.log('Playing Sound');
    await sound.current.playAsync();
    // 找出目前曲目序號
    const currentTrack = playlists.findIndex(obj => obj.musicName === musicName)
    setCurrentTrackIndex(currentTrack);
  }







  return (
    <Animated.View style={{
      display: musicplayerdisplay,
      position: 'absolute',
      bottom: 80,
      width: '100%',
      justifyContent: 'center',
      alignItems: 'center',
      opacity: animatedOpacity,
    }}>
      <View style={styles.container}>
        <View style={styles.controlsContainer}>
          <TouchableOpacity onPress={closemusicplayer}>
            <AntDesign name="close" size={24} color="black" style={styles.controlIcon} />
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
              <AntDesign name="pause" size={24} color="black" style={styles.controlIcon} />
            ) : (
              <AntDesign name="play" size={24} color="black" style={styles.controlIcon} />
            )}
          </TouchableOpacity>
        </View>

      </View>
    </Animated.View>
  );
};



const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.main,
    padding: 10,
    width: '100%',
  },
  image: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  detailsContainer: {
    flex: 1,
  },
  bookName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  page: {
    fontSize: 14,
  },
  controlsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  controlIcon: {
    width: 30,
    height: 30,
    marginHorizontal: 10,
  },
});



