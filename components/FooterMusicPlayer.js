import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS } from '../constants';
import { AntDesign, Ionicons } from '@expo/vector-icons';

const FooterMusicPlayer = ({ display, data }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlayPause = () => {
    // Implement your play/pause logic here
    setIsPlaying(!isPlaying);
  };

  const handlePrevious = () => {
    // Implement your previous track logic here
  };

  const handleNext = () => {
    // Implement your next track logic here
  };

  return (
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
            <TouchableOpacity onPress={handlePrevious}>
              <AntDesign name="stepbackward" size={24} color="black" style={styles.controlIcon} />
            </TouchableOpacity>

            <TouchableOpacity onPress={handlePlayPause}>
              {isPlaying ? (
                <AntDesign name="pause" size={24} color="black" style={styles.controlIcon} />
              ) : (
                <AntDesign name="play" size={24} color="black" style={styles.controlIcon} />
              )}
            </TouchableOpacity>

            <TouchableOpacity onPress={handleNext}>
              <AntDesign name="stepforward" size={24} color="black" style={styles.controlIcon} />
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
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

export default FooterMusicPlayer;
