import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Animated, PanResponder } from 'react-native';
import { COLORS } from '../constants';
import { AntDesign } from '@expo/vector-icons';
import { useDispatch, useSelector } from "react-redux";

import { Audio } from 'expo-av';
import { setCurrentMargin, setMusicPlayerDisplay } from './actions/actions';


export default function MusicPlayer({ music }) {
  const { musicplayerdisplay } = useSelector(state => state.musicReducer);
  const [{ bookname, page, musicName }, setCurrTrack] = useState(music);
  const { duration } = useSelector(state => state.screenReducer);
  const { playlists } = useSelector(state => state.musicReducer);
  const animatedOpacity = useRef(new Animated.Value(0)).current;
  const [isPlaying, setIsPlaying] = useState(false);
  const [sound, setSound] = useState();
  const dispatch = useDispatch();
  const currentTrack = playlists.findIndex(obj => obj.musicName === musicName)


  useEffect(() => {
    setCurrTrack(music);
    playSound();

    Animated.timing(animatedOpacity, {
      toValue: musicplayerdisplay === 'flex' ? 1 : 0,
      duration: duration,
      useNativeDriver: false,
    }).start();

    return sound ? () => sound.unloadAsync() : undefined;
  }, [music, musicplayerdisplay, sound]);


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



  const loadNewMusic = async () => {
    try {
      const { sound } = await Audio.Sound.createAsync(
        require(`../assets/music/${musicName}`)
      );
      return sound;
    } catch (error) {
      console.error('加载音乐文件时出错：', error);
      return null;
    }
  }

  // const playSound = async () => {

  //   //目前可撥放不同音檔但不能暫停跟開始


  //   // 載入新音檔
  //   const newSound = await loadNewMusic(`../assets/music/${musicName}`);

  //   if (newSound) {
  //     if (isPlaying) {
  //       // 暫停當前音樂
  //       await sound.pauseAsync();
  //       console.log('暂停');
  //     } else {
  //       // 開始撥放新音樂
  //       await newSound.playAsync();
  //       console.log('开始');
  //     }
  //     // 更新当前播放音乐和播放状态
  //     setSound(newSound);
  //     setIsPlaying(!isPlaying);
  //   }
  // };


  const playSound = async () => {
    if (!sound) {
      // If sound is undefined, load new sound
      const newSound = await loadNewMusic();
      if (newSound) {
        setSound(newSound);
        setIsPlaying(true);
        await newSound.playAsync();
      }
    } else {
      // If sound is defined, simply play it
      await sound.playAsync();
      setIsPlaying(true);
    }
  };




  const pauseSound = async () => {
    if (sound) {
      await sound.pauseAsync();
      setIsPlaying(false);
    }
  };

  const resumeSound = async () => {
    if (sound) {
      await sound.playAsync();
      setIsPlaying(true);
    }
  };



  // const playSound = async () => {
  //   const { sound } = await Audio.Sound.createAsync(
  //     require('../assets/music/習作本1/習作本1 P11.mp3')
  //   );

  //   if (isPlaying) {
  //     await sound.pauseAsync();
  //   } else {
  //     await sound.playAsync();
  //   }

  //   setIsPlaying(!isPlaying);
  // };


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

        {/* <View style={styles.controlsContainer}>
            <TouchableOpacity onPress={playSound}>
              {isPlaying ? (
                <AntDesign name="pause" size={24} color="black" style={styles.controlIcon} />
              ) : (
                <AntDesign name="play" size={24} color="black" style={styles.controlIcon} />
              )}
            </TouchableOpacity>
          </View> */}


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



