import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { COLORS } from '../constants';
import { AntDesign } from '@expo/vector-icons';
import { useDispatch, useSelector } from "react-redux";
import { Audio } from 'expo-av';
import { setCurrentMargin, setCurrentPlaying, setMusicPlayerDisplay } from './actions/actions';


export default function MusicPlayer({ music }) {
  const { musicplayerdisplay } = useSelector(state => state.musicReducer);
  const [{ bookname, page }, setCurrTrack] = useState(music);
  const { duration } = useSelector(state => state.screenReducer);
  const animatedOpacity = useRef(new Animated.Value(0)).current;
  const [isPlaying, setIsPlaying] = useState(false);
  const dispatch = useDispatch();
  const [currentTrackIndex, setCurrentTrackIndex] = useState(null);
  const sound = useRef(new Audio.Sound());
  // const { playlists } = useSelector(state => state.musicReducer);

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
    dispatch(setCurrentMargin(0));
    // Add closing animation
    Animated.timing(animatedOpacity, {
      toValue: 0,
      duration: duration,
      useNativeDriver: false,
    }).start();
    dispatch(setMusicPlayerDisplay('none'));
    sound.current.stopAsync();
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
    if (currentTrackIndex !== null || currentTrackIndex === musicid) {
      await sound.current.stopAsync(); // Stop the currently playing sound
      console.log('stop sound')
      await sound.current.unloadAsync(); // Unload the sound
    }
    const { sound: newSound } = await Audio.Sound.createAsync(require(`../assets/music/習作本1/習作本1 P11.mp3`));
    // const { sound: newSound } = await Audio.Sound.createAsync(require(`../assets/music/${music.musicName}`));
    sound.current = newSound;
    setCurrentTrackIndex(musicid); // Update the current track index here
    await sound.current.playAsync();
    setIsPlaying(true);
  }

  return (
    <Animated.View style={{
      display: musicplayerdisplay,
      position: 'absolute',
      bottom: 70,
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
              <AntDesign name="pause" size={30} color="black" style={styles.controlIcon} />
            ) : (
              <AntDesign name="play" size={30} color="black" style={styles.controlIcon} />
            )}
          </TouchableOpacity>
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
    backgroundColor: COLORS.main,
    padding: 10,
    paddingRight: 33,
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
    justifyContent: 'center',
  },
  controlIcon: {
    marginHorizontal: 10,
    fontWeight: 600,
    color: 'red'
  },
});



