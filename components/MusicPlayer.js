import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS, musicDB } from '../constants';
import { AntDesign } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import { useDispatch, useSelector } from "react-redux";
import { setCurrentPlaying } from "./actions/actions";

// import TrackPlayer from 'react-native-track-player';
// TrackPlayer.updateOptions({
//   stopWithApp: false,
//   capabilities: [TrackPlayer.CAPABILITY_PLAY, TrackPlayer.CAPABILITY_PAUSE],
//   compactCapabilities: [
//     TrackPlayer.CAPABILITY_PLAY,
//     TrackPlayer.CAPABILITY_PAUSE,
//   ],
// });


function MusicPlayer({ display, autoPlay, music }) {
  const [{ bookname, page, musicName }, setCurrTrack] = useState(music);
  const [isPlaying, setIsPlaying] = useState(false);
  const [sound, setSound] = useState();

  useEffect(() => {
    setCurrTrack(music);
  }, [music]);

  // const setUpTrackPlayer = async () => {
  //   try {
  //     await TrackPlayer.setupPlayer();
  //     await TrackPlayer.add(tracks);
  //     console.log('Tracks added');
  //   } catch (e) {
  //     console.log(e);
  //   }
  // };

  // useEffect(() => {
  //   setUpTrackPlayer();

  //   return () => TrackPlayer.destroy();
  // }, []);

  const playSound = async () => {
    console.log('playsound')
    try {
      if (sound) {
        isPlaying ? await sound.pauseAsync() : await sound.playAsync();
        setIsPlaying(!isPlaying);
      } else {
        const { sound: newSound } = await Audio.Sound.createAsync(
          require(`../assets/music/${musicName}`)
        );
        setSound(newSound); // Update sound state with the new sound
        setIsPlaying(true);
        await newSound.playAsync();
        newSound.setOnPlaybackStatusUpdate((status) => {
          if (status.didJustFinish) {
            setIsPlaying(false);
            setSound(null);
          }
        });
      }
    } catch (error) {
      console.error('Error playing sound:', error);
    }
  };

  useEffect(() => {
    if (autoPlay) {
      playSound();
    }
  }, [autoPlay]);



  useEffect(() => {
    // Stop the current sound when the music prop changes
    stopSound();
  }, [music]);

  const stopSound = async () => {
    console.log('stop sound')
    try {
      if (sound) {
        await sound.stopAsync();
        setIsPlaying(false);
        setSound(null); // Remove the reference to the sound
      }
    } catch (error) {
      console.error('Error stopping sound:', error);
    }
  };



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
    <TouchableOpacity >
      <View style={{
        display: display,
        position: 'absolute',
        bottom: 90,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        {music && (
          <View style={styles.container}>
            {/* Image */}
            <Image source={require('../assets/img/headphone.png')} style={styles.image} />

            {/* Details */}
            <View style={styles.detailsContainer}>
              <Text style={styles.bookName}>{bookname}</Text>
              <Text style={styles.page}>{`Page ${page}`}</Text>
            </View>

            {/* Controls */}
            {/* <View style={styles.controlsContainer}>
              <TouchableOpacity onPress={() => TrackPlayer.skipToPrevious()}>
                <AntDesign name="stepbackward" size={24} color="black" style={styles.controlIcon} />
              </TouchableOpacity>
              <TouchableOpacity >
                {isPlaying ? (
                  <AntDesign name="pause" size={24} color="black" style={styles.controlIcon} onPress={() => TrackPlayer.play()} />
                ) : (
                  <AntDesign name="play" size={24} color="black" style={styles.controlIcon} onPress={() => TrackPlayer.pause()} />
                )}
              </TouchableOpacity>
              <TouchableOpacity onPress={() => TrackPlayer.skipToNext()}  >
                <AntDesign name="stepforward" size={24} color="black" style={styles.controlIcon} />
              </TouchableOpacity>
            </View> */}

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
              <TouchableOpacity onPress={stopSound}>
                <AntDesign name="closecircle" size={24} color="black" style={styles.controlIcon} />
              </TouchableOpacity>
              <TouchableOpacity onPress={handleClickNext}  >
                <AntDesign name="stepforward" size={24} color="black" style={styles.controlIcon} />
              </TouchableOpacity>
            </View>

          </View>
        )}
      </View>
    </TouchableOpacity>
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

