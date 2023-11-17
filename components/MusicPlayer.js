import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS, musicDB } from '../constants';
import { AntDesign } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import { useDispatch, useSelector } from "react-redux";
import { setCurrentPlaying } from "./actions/actions";

// import TrackPlayer from 'react-native-track-player';


function MusicPlayer({ display, autoPlay, music }) {
  const [{ bookname, page, musicName }, setCurrTrack] = useState(music);
  const [isPlaying, setIsPlaying] = useState(false);
  const [sound, setSound] = useState();

  useEffect(() => {
    setCurrTrack(music);
  }, [music]);

  // const playSound = async () => {
  //   // Set up the player
  //   await TrackPlayer.setupPlayer();

  //   // Add a track to the queue
  //   await TrackPlayer.add({
  //     url: require(`../assets/music/${musicName}`),
  //     title: bookname,
  //     artist: 'Track Artist',
  //   });

  //   // Start playing it
  //   await TrackPlayer.play();
  // }


  // useEffect(() => {
  //   return sound ? () => sound.unloadAsync() : undefined;
  // }, [sound]);

  // const playSound = async () => {
  //   try {
  //     if (sound) {
  //       isPlaying ? await sound.pauseAsync() : await sound.playAsync();
  //       setIsPlaying(!isPlaying);
  //     } else {
  //       const { sound: newSound } = await Audio.Sound.createAsync(
  //         require(`../assets/music/${musicName}`)
  //       );
  //       setSound(newSound); // Update sound state with the new sound
  //       setIsPlaying(true);
  //       await newSound.playAsync();
  //       newSound.setOnPlaybackStatusUpdate((status) => {
  //         if (status.didJustFinish) {
  //           setIsPlaying(false);
  //         }
  //       });
  //     }
  //   } catch (error) {
  //     console.error('Error playing sound:', error);
  //   }
  // };

  // useEffect(() => {
  //   if (autoPlay) {
  //     playSound();
  //   }
  // }, [autoPlay]);




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
      <View style={{ display: display }}>
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
              <TouchableOpacity onPress={handleClickNext}>
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

