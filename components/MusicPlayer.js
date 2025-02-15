// import React, { useState, useEffect, useRef } from 'react';
// import { View, Text, Image, TouchableOpacity, StyleSheet, Animated, Dimensions, ActivityIndicator } from 'react-native';
// import { COLORS, SIZES } from '../constants';
// import { AntDesign } from '@expo/vector-icons';
// import { useDispatch, useSelector } from "react-redux";
// import { Audio } from 'expo-av';
// import { setCurrentMargin, setCurrentPlaying, setMusicPlayerDisplay } from './actions/actions';
// import { getDownloadURL, getStorage, ref as storageRef } from 'firebase/storage';
// import { rtdb } from '../screens/firebase-config';
// import { off, onValue, ref as rtdbRef } from 'firebase/database';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// // import Slider from 'react-native-slider';


// export default function MusicPlayer({ music }) {
//   const [playlists, setPlaylists] = useState([]);
//   const { musicplayerdisplay } = useSelector(state => state.musicReducer);
//   const [{ bookname, page, type }, setCurrTrack] = useState(music);

//   const { duration, tabbarheight, musicplayerheight } = useSelector(state => state.screenReducer);
//   const animatedOpacity = useRef(new Animated.Value(0)).current;
//   const [isPlaying, setIsPlaying] = useState(false);
//   const dispatch = useDispatch();
//   const [currentTrackIndex, setCurrentTrackIndex] = useState(null);
//   const [musicisloading, setMusicIsLoading] = useState(false);
//   const sound = useRef(new Audio.Sound());
//   const [playbackStatus, setPlaybackStatus] = useState(null);





//   // const index = playlists[type].findIndex(music => music.musicName === musicName);

//   // if (index !== -1) {
//   //   console.log('找到相同的音樂，索引為:', index);
//   //   console.log('對應的物件:', playlists[type][index]);
//   // } else {
//   //   console.log('沒有找到相同的音樂');
//   // }

//   useEffect(() => {
//     const updatePlaybackStatus = async (status) => {
//       if (status) {
//         setPlaybackStatus(status);
//       }
//     };

//     if (sound.current) {
//       sound.current.setOnPlaybackStatusUpdate(updatePlaybackStatus);
//     }

//     return () => {
//       if (sound.current) {
//         sound.current.setOnPlaybackStatusUpdate(null);
//       }
//     };
//   }, []);



//   const [dimensions, setDimesions] = useState({ window: Dimensions.get('window') });

//   useEffect(() => {
//     const subscription = Dimensions.addEventListener("change", ({ window }) => {
//       setDimesions({ window });
//     });
//     return () => subscription?.remove();
//   })

//   const { window } = dimensions;

//   // 可以在IOS靜音模式播放音樂 像Youtube Music一樣
//   useEffect(() => { Audio.setAudioModeAsync({ playsInSilentModeIOS: true }); });

//   useEffect(() => {
//     setCurrTrack(music);
//     if (music) {
//       const musicid = music.index;
//       playSound(musicid);
//     }
//   }, [music])

//   useEffect(() => {
//     Animated.timing(animatedOpacity, {
//       toValue: musicplayerdisplay === 'flex' ? 1 : 0,
//       duration: duration,
//       useNativeDriver: false,
//     }).start();
//   }, [musicplayerdisplay]);

//   const closemusicplayer = async () => {
//     Animated.timing(animatedOpacity, {
//       toValue: 0,
//       duration: duration,
//       useNativeDriver: false,
//     }).start();
//     sound.current.stopAsync();
//     dispatch(setCurrentMargin(0));
//     // Add closing animation
//     dispatch(setMusicPlayerDisplay('none'));
//   };

//   const pauseSound = async () => {
//     if (sound) {
//       await sound.current.pauseAsync();
//       setIsPlaying(false);
//     }
//   };

//   const resumeSound = async () => {
//     if (sound) {
//       await sound.current.playAsync();
//       setIsPlaying(true);
//     }
//   };

//   // const handleClickNext = () => {
//   //   console.log('Next Track')
//   //   let abc = music.index + 1;
//   //   if ((music.index + 1) >= playlists.length) {
//   //     abc = 0;
//   //   }
//   //   dispatch(setCurrentPlaying(playlists[abc]));
//   // };

//   // Next Music 
//   useEffect(() => {
//     const handlePlaybackStatusUpdate = (playbackStatus) => {
//       if (playbackStatus.didJustFinish) {
//         console.log('Music finished!');

//         // Play the next track automatically
//         const nextTrackIndex = currentTrackIndex + 1;
//         if (nextTrackIndex < playlists.length) {
//           dispatch(setCurrentPlaying(playlists[nextTrackIndex]));
//         }
//       }
//     };

//     sound.current.setOnPlaybackStatusUpdate(handlePlaybackStatusUpdate);

//     return () => {
//       sound.current.setOnPlaybackStatusUpdate(null); // Clean up listener
//     };
//   }, [currentTrackIndex, sound, dispatch, playlists]);


//   async function playSound(musicid) {

//     setMusicIsLoading(true);
//     if (currentTrackIndex !== null && currentTrackIndex === musicid) {
//       await sound.current.stopAsync(); // Stop the currently playing sound
//       console.log('stop sound')
//       await sound.current.unloadAsync(); // Unload the sound
//     }
//     const storage = getStorage();
//     const musicRef = storageRef(storage, `Music/${music.musicName}`);
//     const downloadURL = await getDownloadURL(musicRef);
//     const { sound: newSound } = await Audio.Sound.createAsync({ uri: downloadURL });
//     sound.current = newSound;
//     setCurrentTrackIndex(musicid); // Update the current track index here
//     await sound.current.playAsync();
//     setIsPlaying(true);
//     setMusicIsLoading(false);
//   }


//   const handleNextTrack = () => {
//     // let nextTrackIndex = currentTrackIndex + 1;
//     // if (nextTrackIndex >= playlists.length) {
//     //   nextTrackIndex = 0;  // Wrap around to the first track
//     // }
//     // dispatch(setCurrentPlaying(playlists[nextTrackIndex]));
//   };

//   // const handlePreviousTrack = () => {
//   //   let previousTrackIndex = currentTrackIndex - 1;
//   //   if (previousTrackIndex < 0) {
//   //     previousTrackIndex = playlists.length - 1;  // Wrap around to the last track
//   //   }
//   //   dispatch(setCurrentPlaying(playlists[previousTrackIndex]));
//   // };

//   return (
//     <Animated.View style={{
//       display: musicplayerdisplay,
//       position: 'absolute',
//       bottom: tabbarheight,
//       width: '100%',
//       justifyContent: 'center',
//       alignItems: 'center',
//       // opacity: animatedOpacity,
//     }}>
//       <View style={[styles.container, { height: musicplayerheight }]}>
//         <View>
//           {/* <Slider
//             style={{ width: windowWidth * 0.85, height: 40 }}
//             minimumValue={0}
//             maximumValue={playbackStatus?.durationMillis || 0}
//             thumbTintColor={COLORS.primary} // Adjust color as needed
//             trackColor={COLORS.gray} // Adjust color as needed
//           // value={playbackStatus?.positionMillis || 0} // Set initial value
//           // onSlidingStart={() => {
//           //   // Pause the sound when seeking starts
//           //   sound.current.pauseAsync();
//           // }}
//           // onSlidingComplete={async (value) => {
//           //   // Update sound position and resume playback
//           //   await sound.current.setStatusAsync({ positionMillis: value });
//           //   await sound.current.playAsync(); // Resume playback after seeking
//           // }}
//           /> */}
//         </View>
//         <View style={styles.controlsContainer}>
//           <TouchableOpacity onPress={closemusicplayer}>
//             <AntDesign name="close" size={24} style={styles.controlIcon} />
//           </TouchableOpacity>
//           {/* Image */}
//           <Image source={require('../assets/img/headphone.png')} style={styles.image} />

//           {/* Details */}
//           <View style={styles.detailsContainer}>
//             <Text style={styles.bookName}>{bookname}</Text>
//             <Text style={styles.page}>{page}</Text>
//           </View>

//           {/* <TouchableOpacity onPress={handlePreviousTrack()}>
//             <AntDesign name="stepbackward" size={30} color="black" style={styles.controlIcon} />
//           </TouchableOpacity> */}
//           <View style={styles.controlsContainer}>
//             {
//               musicisloading ?
//                 (
//                   <ActivityIndicator size={30} color="black" style={styles.controlIcon} />
//                 )
//                 :
//                 (

//                   <TouchableOpacity onPress={() => {
//                     if (isPlaying) {
//                       pauseSound();
//                     } else {
//                       if (sound) {
//                         resumeSound();
//                       } else {
//                         playSound();
//                       }
//                     }
//                   }}>

//                     {isPlaying ? (
//                       <AntDesign name="pause" size={35} color="black" style={styles.controlIcon} />
//                     ) : (
//                       <AntDesign name="play" size={35} color="black" style={styles.controlIcon} />
//                     )}
//                   </TouchableOpacity>
//                 )
//             }


//             {/* <TouchableOpacity onPress={() => handleNextTrack()}>
//             <AntDesign name="stepforward" size={30} color="black" style={styles.controlIcon} />
//           </TouchableOpacity> */}
//           </View>
//           <TouchableOpacity onPress={handleNextTrack()}>
//             <AntDesign name="stepforward" size={30} color="black" style={styles.controlIcon} />
//           </TouchableOpacity>
//         </View>

//       </View>
//     </Animated.View>
//   );
// };



// const styles = StyleSheet.create({
//   container: {
//     flexDirection: 'column',
//     alignItems: 'center',
//     backgroundColor: COLORS.musicplayer,
//     padding: 10,
//     paddingRight: 15,
//     width: '100%',
//   },
//   image: {
//     borderRadius: 10,
//     width: 50,
//     height: 50,
//     marginRight: 18,
//   },
//   detailsContainer: {
//     flex: 1,
//   },
//   bookName: {
//     color: COLORS.black,
//     fontSize: SIZES.medium,
//     fontWeight: 'bold',
//   },
//   page: {
//     color: COLORS.black,
//     fontSize: SIZES.font,
//   },
//   controlsContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   controlIcon: {
//     marginHorizontal: 10,
//     fontWeight: 600,
//     color: COLORS.black
//   },
// });

import React, { useState, useEffect, useRef, useCallback, useContext } from 'react';
import { View, Text, Image, TouchableOpacity, Animated, Dimensions, ActivityIndicator } from 'react-native';
import { COLORS, SIZES } from '../constants';
import { AntDesign } from '@expo/vector-icons';
import { useDispatch, useSelector } from "react-redux";
import { Audio } from 'expo-av';
import { setCurrentMargin, setCurrentPlaying, setMusicPlayerDisplay } from './actions/actions';
import { getDownloadURL, getStorage, ref as storageRef } from 'firebase/storage';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function MusicPlayer({ music }) {
  const dispatch = useDispatch();
  const { musicplayerdisplay } = useSelector(state => state.musicReducer);
  const { duration, musicplayerheight } = useSelector(state => state.screenReducer);

  const sound = useRef(new Audio.Sound());
  const animatedOpacity = useRef(new Animated.Value(0)).current;
  const [isPlaying, setIsPlaying] = useState(false);
  const [musicLoading, setMusicLoading] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(music);
  const [playlists, setPlaylists] = useState(null);
  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        const data = await AsyncStorage.getItem('ae-playlistData');
        if (data) {
          setPlaylists(JSON.parse(data)); 
        }
      } catch (error) {
        console.error('Error fetching playlists:', error);
      }
    };
  
    fetchPlaylists();
  }, []);
  
  // Log only after playlists is updated
  useEffect(() => {
    if (playlists) {
      console.log('Updated playlists:', playlists);
    }
  }, [playlists]); 


  useEffect(() => { Audio.setAudioModeAsync({ playsInSilentModeIOS: true }); }, []);

  useEffect(() => {
    setCurrentTrack(music);
    if (music) playSound(music.index);
  }, [music]);

  useEffect(() => {
    Animated.timing(animatedOpacity, {
      toValue: musicplayerdisplay === 'flex' ? 1 : 0,
      duration,
      useNativeDriver: false,
    }).start();
  }, [musicplayerdisplay]);

  const playSound = async (musicId) => {
    try {
      if (sound.current._loaded) {
        await sound.current.stopAsync();
        await sound.current.unloadAsync();
      }

      const storage = getStorage();
      const musicRef = storageRef(storage, `Music/${music.musicName}`);
      const downloadURL = await getDownloadURL(musicRef);
      await sound.current.loadAsync({ uri: downloadURL });
      await sound.current.playAsync();
      setIsPlaying(true);
    } catch (error) {
      console.error("Error playing sound:", error);
    } finally {
      setMusicLoading(false);
    }
  };

  const togglePlayPause = async () => {
    if (isPlaying) {
      await sound.current.pauseAsync();
    } else {
      await sound.current.playAsync();
    }
    setIsPlaying(!isPlaying);
  };

  const closeMusicPlayer = async () => {
    Animated.timing(animatedOpacity, {
      toValue: 0,
      duration,
      useNativeDriver: false,
    }).start();
    await sound.current.stopAsync();
    dispatch(setCurrentMargin(0));
    dispatch(setMusicPlayerDisplay('none'));
  };

  const insets = useSafeAreaInsets();
  const tabBarHeight = 55 + insets.bottom;

  return (
    <Animated.View style={{
      display: musicplayerdisplay,
      position: 'absolute',
      bottom: tabBarHeight,
      width: '100%',
      alignItems: 'center',
    }}>
      <View style={[styles.container, { height: musicplayerheight }]}>
        <View style={styles.controlsContainer}>
          <TouchableOpacity onPress={closeMusicPlayer}>
            <AntDesign name="close" size={24} style={styles.controlIcon} />
          </TouchableOpacity>
          <Image source={require('../assets/img/headphone.png')} style={styles.image} />
          <View style={styles.detailsContainer}>
            <Text style={styles.bookName}>{currentTrack.bookname}</Text>
            <Text style={styles.page}>{currentTrack.page}</Text>
          </View>
          {musicLoading ? (
            <ActivityIndicator size={30} color="black" style={styles.controlIcon} />
          ) : (
            <TouchableOpacity onPress={togglePlayPause}>
              <AntDesign name={isPlaying ? "pause" : "play"} size={35} style={styles.controlIcon} />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Animated.View>
  );
}

const styles = {
  container: {
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: COLORS.musicplayer,
    padding: 10,
    width: '100%',
  },
  image: {
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
    color: COLORS.black,
  },
};


