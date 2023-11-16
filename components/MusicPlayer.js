import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS } from '../constants';
import { AntDesign } from '@expo/vector-icons';

// Assuming you have React Navigation installed
import { useNavigation } from '@react-navigation/native';

const MusicPlayer = ({ display, data }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  // const navigation = useNavigation();
  const handlePress = () => {
    // Navigate to MusicPlayerScreen
    // navigation.navigate('MusicPlayerScreen', { data }); // You may need to adjust the route name
  };

  // useEffect(() => {
  //   // Add a track when the component mounts
  //   TrackPlayer.add([{
  //     id: '1',
  //     url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', // Adjust the path based on your project structure
  //     title: data.bookname,
  //     artist: data.page,
  //     artwork: require('../assets/img/headphone.png'), // Adjust the path based on your project structure
  //   }]);
  // }, [data]);

  // const togglePlayback = async () => {
  //   if (isPlaying) {
  //     await TrackPlayer.pause();
  //   } else {
  //     await TrackPlayer.play();
  //   }
  //   setIsPlaying(!isPlaying);
  // };

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
              <Text>{isPlaying ? 'Playing' : 'Paused'}</Text>
              <TouchableOpacity>
                {isPlaying ? (
                  <AntDesign name="pause" size={24} color="black" style={styles.controlIcon} />
                ) : (
                  <AntDesign name="play" size={24} color="black" style={styles.controlIcon} />
                )}
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
