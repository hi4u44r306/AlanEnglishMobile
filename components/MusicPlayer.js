import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { COLORS, musicDB } from '../constants';
import { AntDesign } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import { useDispatch, useSelector } from "react-redux";

import Video from 'react-native-video';

function MusicPlayer({ music }) {
  const { musicplayerdisplay, autoplay } = useSelector(state => state.musicReducer);
  const [{ bookname, page, musicName }, setCurrTrack] = useState(music);
  const [isPlaying, setIsPlaying] = useState(false);
  const [sound, setSound] = useState();
  const dispatch = useDispatch();
  // const videoRef = useRef(null);


  const animatedOpacity = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(animatedOpacity, {
      toValue: musicplayerdisplay === 'flex' ? 1 : 0,
      duration: 500, // Adjust the duration as needed
      useNativeDriver: false, // Ensure this is set to false for opacity animations
    }).start();
  }, [musicplayerdisplay]);


  useEffect(() => {
    setCurrTrack(music);
  }, [music]);


  // useEffect(() => {
  //   return () => {
  //     // Cleanup and stop the video when the component unmounts
  //     if (sound) {
  //       sound.release();
  //     }
  //   };
  // }, []);

  // const playPause = () => {
  //   if (sound) {
  //     isPlaying ? sound.pause() : sound.play();
  //     setIsPlaying(!isPlaying);
  //   }
  // };






  const playSound = async () => {
    // try {
    //   if (sound) {
    //     isPlaying ? await sound.pauseAsync() : await sound.playAsync();
    //     setIsPlaying(!isPlaying);
    //   } else {
    //     const { sound: newSound } = await Audio.Sound.createAsync(
    //       require(`../assets/music/${musicName}`)
    //     );
    //     setSound(newSound); // Update sound state with the new sound
    //     setIsPlaying(true);
    //     await newSound.playAsync();
    //     newSound.setOnPlaybackStatusUpdate((status) => {
    //       if (status.didJustFinish) {
    //         setIsPlaying(false);
    //         setSound(null);
    //       }
    //     });
    //   }
    // } catch (error) {
    //   console.error('Error playing sound:', error);
    // }
  };

  useEffect(() => {
    if (autoplay === true) {
      playSound();
    }
  }, [autoplay]);

  // const currentTrack = playlists.findIndex(obj => obj.musicName === musicName)
  const handleClickNext = async () => {
    console.log('Next Track')
    // let abc = currentTrack + 1;
    // if ((currentTrack + 1) >= playlists.length) {
    //   abc = 0;
    // }
    // dispatch(setCurrentPlaying(playlists[abc]));
  };

  const handleClickPrevious = async () => {
    console.log('Previous Track')
    // let abc = currentTrack - 1;
    // if ((currentTrack - 1) <= -1) {
    //   abc = playlists.length - 1;
    // }
    // dispatch(setCurrentPlaying(playlists[abc]));
  };



  return (
    // <TouchableOpacity >
    // </TouchableOpacity>
    <Animated.View style={{
      display: musicplayerdisplay,
      position: 'absolute',
      bottom: 90,
      width: '100%',
      justifyContent: 'center',
      alignItems: 'center',
      opacity: animatedOpacity,
    }}>
      <View style={styles.container}>
        {/* Image */}
        <Image source={require('../assets/img/headphone.png')} style={styles.image} />

        {/* Details */}
        <View style={styles.detailsContainer}>
          <Text style={styles.bookName}>{bookname}</Text>
          <Text style={styles.page}>{`Page ${page}`}</Text>
        </View>

        <View style={styles.controlsContainer}>
          <TouchableOpacity onPress={handleClickPrevious}>
            <AntDesign name="stepbackward" size={24} color="black" style={styles.controlIcon} />
          </TouchableOpacity>
          <TouchableOpacity onPress={playSound}>
            {isPlaying ? (
              <AntDesign name="pause" size={24} color="black" style={styles.controlIcon} />
            ) : (
              <AntDesign name="play" size={24} color="black" style={styles.controlIcon} />
            )}
          </TouchableOpacity>


          {/* <Video
            source={{ uri: `../assets/music/習作本1/習作本1 P.34.mp3` }}
            audioOnly
            paused={!isPlaying}
          /> */}


          {/* <TouchableOpacity onPress={stopSound}>
                <AntDesign name="closecircle" size={24} color="black" style={styles.controlIcon} />
              </TouchableOpacity> */}
          <TouchableOpacity onPress={handleClickNext}  >
            <AntDesign name="stepforward" size={24} color="black" style={styles.controlIcon} />
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
    backgroundColor: COLORS.ricewhite,
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

export default MusicPlayer;

