import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS, musicDB } from '../constants';
import { AntDesign } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import { useRef } from 'react';

const MusicPlayer = ({ display, data, autoPlay, }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [sound, setSound] = useState();
  const [music, setMusic] = useState(data.musicName);

  useEffect(() => {
    return sound ? () => sound.unloadAsync() : undefined;
  }, [sound]);

  useEffect(() => {
    if (autoPlay) {
      playSound();
    }
  }, [autoPlay]);

  useEffect(() => {
    // Set the music when the data changes
    setMusic(data.musicName);
  }, [data]);

  const playSound = async () => {
    if (sound) {
      if (isPlaying) {
        await sound.pauseAsync();
      } else {
        await sound.playAsync();
      }
      setIsPlaying(!isPlaying);
    } else {
      const { sound } = await Audio.Sound.createAsync(
        require(`../assets/music/${music}`)
      );
      setSound(sound);
      setIsPlaying(true);
      await sound.playAsync();
      sound.setOnPlaybackStatusUpdate((status) => {
        // You can handle playback status updates here if needed
      });
    }
  };

  const handleClickNext = async () => {
  };

  const handleClickPrevious = async () => {
  };



  return (
    <TouchableOpacity >
      <View style={{ display: display }}>
        {data && (
          <View style={styles.container}>
            {/* Image */}
            <Image source={require('../assets/img/headphone.png')} style={styles.image} />

            {/* Details */}
            <View style={styles.detailsContainer}>
              <Text style={styles.bookName}>{data.bookname}</Text>
              <Text style={styles.page}>{`Page ${data.page}`}</Text>
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

