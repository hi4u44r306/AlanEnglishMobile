import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Animated, PanResponder } from 'react-native';
import { COLORS } from '../constants';
import { AntDesign } from '@expo/vector-icons';
import { useDispatch, useSelector } from "react-redux";

import { Audio } from 'expo-av';
import { setCurrentMargin, setMusicPlayerDisplay } from './actions/actions';
import BigScreen from '../screens/BigScreen';

function MusicPlayer() {
  const { musicplayerdisplay, autoplay, playing } = useSelector(state => state.musicReducer);
  const { duration } = useSelector(state => state.screenReducer);
  const [{ bookname, page, musicName }, setCurrTrack] = useState(playing);
  const animatedOpacity = useRef(new Animated.Value(0)).current;
  const dispatch = useDispatch();

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
    await sound.pauseAsync();
  };

  useEffect(() => {
    setCurrTrack(playing);
  }, [playing]);


  const [sound, setSound] = useState();
  const [isPlaying, setIsPlaying] = useState(false);


  useEffect(() => {
    return sound ? () => sound.unloadAsync() : undefined;
  }, [sound]);

  useEffect(() => {
    if (autoplay === true) {
      playSound();
    }
  }, [autoplay]);

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
        require('../assets/music/習作本1/習作本1 P11.mp3')
      );
      setSound(sound);
      setIsPlaying(true);
      await sound.playAsync();
      sound.setOnPlaybackStatusUpdate((status) => {
        // You can handle playback status updates here if needed
      });
    }
  };


  const closeBigScreen = async () => {
    // Add closing animation for the big screen
    Animated.timing(animatedOpacity, {
      toValue: 0,
      duration: duration,
      useNativeDriver: false,
    }).start();

    dispatch(setMusicPlayerDisplay('none'));
    dispatch(setCurrentMargin(0));

    await sound.pauseAsync();
  };

  const showBigScreen = () => {
    // dispatch(setMusicPlayerDisplay('none'));
    // // Add opening animation for the big screen
    // Animated.timing(animatedOpacity, {
    //   toValue: 1,
    //   duration: duration,
    //   useNativeDriver: false,
    // }).start();
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



  // const handleClickNext = async () => {
  //   console.log('Next Track')

  // };

  // const handleClickPrevious = async () => {
  //   console.log('Previous Track')

  // };


  // const panResponder = useRef(
  //   PanResponder.create({
  //     onMoveShouldSetPanResponder: (_, gestureState) => gestureState.dy > 5, // Allow only downward swipe
  //     onPanResponderRelease: (_, gestureState) => {
  //       if (gestureState.dy > 50) {
  //         // If swiped down more than 50 pixels, close the big screen
  //         closeBigScreen();
  //       }
  //     },
  //   })
  // ).current;

  return (
    <TouchableOpacity onPress={showBigScreen}>
      <Animated.View style={{
        display: musicplayerdisplay,
        position: 'absolute',
        bottom: 80,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        opacity: animatedOpacity,
        // ...panResponder.panHandlers,
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
            {/* <TouchableOpacity onPress={handleClickPrevious}>
            <AntDesign name="stepbackward" size={24} color="black" style={styles.controlIcon} />
          </TouchableOpacity> */}
            <TouchableOpacity onPress={playSound}>
              {isPlaying ? (
                <AntDesign name="pause" size={24} color="black" style={styles.controlIcon} />
              ) : (
                <AntDesign name="play" size={24} color="black" style={styles.controlIcon} />
              )}
            </TouchableOpacity>


            {/* <TouchableOpacity onPress={handleClickNext}  >
            <AntDesign name="stepforward" size={24} color="black" style={styles.controlIcon} />
          </TouchableOpacity> */}
          </View>
        </View>
      </Animated.View>

    </TouchableOpacity>
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

export default MusicPlayer;


// import React, { useState, useEffect, useRef } from 'react';
// import { View, Text, Image, TouchableOpacity, StyleSheet, Animated } from 'react-native';
// import { COLORS } from '../constants';
// import { AntDesign } from '@expo/vector-icons';
// import Sound from 'react-native-sound'; // Import react-native-sound

// function MusicPlayer() {
//   const { musicplayerdisplay, autoplay, playing } = useSelector(state => state.musicReducer);
//   const [{ bookname, page, musicName }, setCurrTrack] = useState(playing);
//   const animatedOpacity = useRef(new Animated.Value(0)).current;
//   const sound = useRef(null); // Use useRef for the sound instance

//   useEffect(() => {
//     Animated.timing(animatedOpacity, {
//       toValue: musicplayerdisplay === 'flex' ? 1 : 0,
//       duration: 500,
//       useNativeDriver: false,
//     }).start();
//   }, [musicplayerdisplay]);

//   useEffect(() => {
//     setCurrTrack(playing);
//   }, [playing]);

//   useEffect(() => {
//     return () => {
//       if (sound.current) {
//         sound.current.release(); // Release the sound when the component unmounts
//       }
//     };
//   }, []);

//   useEffect(() => {
//     if (autoplay === true) {
//       playSound();
//     }
//   }, [autoplay]);

//   const playSound = async () => {
//     if (sound.current) {
//       if (sound.current.isPlaying()) {
//         sound.current.pause();
//       } else {
//         sound.current.play();
//       }
//     } else {
//       const soundInstance = new Sound('習作本1 P11.mp3', Sound.MAIN_BUNDLE, (error) => {
//         if (error) {
//           console.error('Error loading the sound:', error);
//         } else {
//           sound.current = soundInstance;
//           soundInstance.play(() => {
//             soundInstance.release(); // Release the sound when it's finished playing
//           });
//         }
//       });
//     }
//   };

//   const handleClickNext = () => {
//     console.log('Next Track');
//     // Implement logic for next track
//   };

//   const handleClickPrevious = () => {
//     console.log('Previous Track');
//     // Implement logic for previous track
//   };

//   return (
//     <Animated.View style={{
//       display: musicplayerdisplay,
//       position: 'absolute',
//       bottom: 90,
//       width: '100%',
//       justifyContent: 'center',
//       alignItems: 'center',
//       opacity: animatedOpacity,
//     }}>
//       <View style={styles.container}>
//         {/* Image */}
//         <Image source={require('../assets/img/headphone.png')} style={styles.image} />

//         {/* Details */}
//         <View style={styles.detailsContainer}>
//           <Text style={styles.bookName}>{bookname}</Text>
//           <Text style={styles.page}>{`Page ${page}`}</Text>
//         </View>

//         <View style={styles.controlsContainer}>
//           <TouchableOpacity onPress={handleClickPrevious}>
//             <AntDesign name="stepbackward" size={24} color="black" style={styles.controlIcon} />
//           </TouchableOpacity>
//           <TouchableOpacity onPress={playSound}>
//             {sound.current && sound.current.isPlaying() ? (
//               <AntDesign name="pause" size={24} color="black" style={styles.controlIcon} />
//             ) : (
//               <AntDesign name="play" size={24} color="black" style={styles.controlIcon} />
//             )}
//           </TouchableOpacity>
//           <TouchableOpacity onPress={handleClickNext}>
//             <AntDesign name="stepforward" size={24} color="black" style={styles.controlIcon} />
//           </TouchableOpacity>
//         </View>
//       </View>
//     </Animated.View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: COLORS.ricewhite,
//     padding: 10,
//     width: '100%',
//   },
//   image: {
//     width: 50,
//     height: 50,
//     marginRight: 10,
//   },
//   detailsContainer: {
//     flex: 1,
//   },
//   bookName: {
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
//   page: {
//     fontSize: 14,
//   },
//   controlsContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   controlIcon: {
//     width: 30,
//     height: 30,
//     marginHorizontal: 10,
//   },
// });

// export default MusicPlayer;
