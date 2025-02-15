import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Animated, ActivityIndicator } from 'react-native';
import Slider from '@react-native-community/slider';
import { COLORS, SIZES } from '../constants';
import { AntDesign } from '@expo/vector-icons';
import { useDispatch, useSelector } from "react-redux";
import { Audio } from 'expo-av';
import { setCurrentMargin, setCurrentPlaying, setMusicPlayerDisplay } from './actions/actions';
import { getDownloadURL, getStorage, ref as storageRef } from 'firebase/storage';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { get, onValue, ref as rtdbRef, set, update } from 'firebase/database';
import { rtdb } from '../screens/firebase-config';
import { getAuth } from 'firebase/auth';
import Toast from 'react-native-toast-message';

export default function MusicPlayer({ music }) {
  const dispatch = useDispatch();
  const { musicplayerdisplay } = useSelector(state => state.musicReducer);
  const { duration } = useSelector(state => state.screenReducer);
  const sound = useRef(new Audio.Sound());
  const animatedOpacity = useRef(new Animated.Value(0)).current;
  const [isPlaying, setIsPlaying] = useState(false);
  const [musicLoading, setMusicLoading] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(music);
  const [playlists, setPlaylists] = useState({});
  const [positionMillis, setPositionMillis] = useState(0);
  const [durationMillis, setDurationMillis] = useState(0);
  const [isPlaylistsLoaded, setIsPlaylistsLoaded] = useState(false);
  const [userId, setUserId] = useState();
  const auth = getAuth();
  const user = auth.currentUser;

  // 將毫秒轉換成 mm:ss
  const formatTime = (millis) => {
    const minutes = Math.floor(millis / 60000);
    const seconds = Math.floor((millis % 60000) / 1000);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  // 監聽播放清單 (RTDB 路徑: Music)
  useEffect(() => {
    if (user !== null) {
      setUserId(user.uid);
    }
    const playlistsRef = rtdbRef(rtdb, 'Music');
    const unsubscribe = onValue(playlistsRef, (snapshot) => {
      if (snapshot.exists()) {
        setPlaylists(snapshot.val());
      } else {
        setPlaylists({});
      }
      // 當資料回傳時，表示 playlists 已載入完成
      setIsPlaylistsLoaded(true);
    });
    return () => unsubscribe();
  }, []);

  // iOS 靜音模式下也可播放
  useEffect(() => {
    Audio.setAudioModeAsync({ playsInSilentModeIOS: true });
  }, []);

  // 當外部傳入的 music 改變時重新播放
  useEffect(() => {
    if (music && isPlaylistsLoaded) {
      setCurrentTrack(music);
      playSound(music);
    }
  }, [music, isPlaylistsLoaded]);

  // 播放器顯示狀態改變時的淡入/淡出
  useEffect(() => {
    Animated.timing(animatedOpacity, {
      toValue: musicplayerdisplay === 'flex' ? 1 : 0,
      duration,
      useNativeDriver: false,
    }).start();
  }, [musicplayerdisplay]);

  // 播放下一首
  const handleNextTrack = () => {
    if (!playlists || !playlists[music.type]) return;

    // 先轉成陣列
    const musicList = Object.values(playlists[music.type]);

    const currentIndex = getCurrentMusicIndex();
    console.log('目前播放的 index:', currentIndex);
    if (currentIndex === -1) return;

    let nextTrackIndex = currentIndex + 1;
    if (nextTrackIndex >= musicList.length) {
      nextTrackIndex = 0; // 如果已經到最後一首，就循環回第一首
    }
    const nextTrack = musicList[nextTrackIndex];
    console.log('下一首的 index:', nextTrackIndex, '下一首資料:', nextTrack);

    dispatch(setCurrentPlaying(nextTrack));
  };

  const success = () => {
    Toast.show({
      type: 'success',
      position: 'top',
      text1: '聽力次數+1',
      visibilityTime: 2000,
      autoHide: true,
    });
  };

  function updateRTDBData() {
    success();
    // 組合一個辨識音樂的字串
    const convertMusicName = `${music.bookname} ${music.page}`;

    // 更新單一音樂的播放次數，播放次數達到 100 時加上 complete 標記
    async function updateMusicPlay(userId, convertMusicName) {
      try {
        const path = `/student/${userId}/MusicLogfile/${convertMusicName}/`;
        const musicRef = rtdbRef(rtdb, path);
        const snapshot = await get(musicRef, { once: true });
        const currentMusicPlay = snapshot.exists() ? snapshot.val().musicplay : 0;
        const newMusicPlay = currentMusicPlay + 1;
        const updateData =
          newMusicPlay >= 100
            ? { musicplay: newMusicPlay, complete: '通過' }
            : { musicplay: newMusicPlay };
        await update(musicRef, updateData);
      } catch (error) {
        console.error("Error updating music play:", error);
      }
    }

    // 更新 counter (例如每日、每月播放次數)
    async function updateCounter(userId, counterType) {
      try {
        const path = `/student/${userId}/${counterType}`;
        const counterRef = rtdbRef(rtdb, path);
        const snapshot = await get(counterRef, { once: true });
        // 若資料不存在則預設為 0，並確保轉成數字
        const currentCount = snapshot.exists() ? parseInt(snapshot.val(), 10) : 0;
        await set(counterRef, currentCount + 1);
      } catch (error) {
        console.error(`Error updating ${counterType}:`, error);
      }
    }

    // 執行更新
    updateMusicPlay(userId, convertMusicName);
    updateCounter(userId, 'Daytotaltimeplayed');
    updateCounter(userId, 'Monthtotaltimeplayed');
  }

  // 播放狀態更新，更新進度與檢查是否播放完畢
  const onPlaybackStatusUpdate = (status) => {
    if (status.isLoaded) {
      const safePosition = isNaN(status.positionMillis) ? 0 : status.positionMillis;
      const safeDuration = isNaN(status.durationMillis) ? 0 : status.durationMillis;
      setPositionMillis(safePosition);
      setDurationMillis(safeDuration);

      if (status.didJustFinish) {
        console.log("didJustFinish triggered");
        updateRTDBData();
        handleNextTrack();
      }
    }
  };

  // 播放音檔
  const playSound = async (track) => {
    try {
      if (sound.current._loaded) {
        await sound.current.stopAsync();
        await sound.current.unloadAsync();
      }
      setMusicLoading(true);
      const storage = getStorage();
      const musicRef = storageRef(storage, `Music/${track.musicName}`);
      const downloadURL = await getDownloadURL(musicRef);
      await sound.current.loadAsync({ uri: downloadURL });
      sound.current.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate);
      await sound.current.playAsync();
      setIsPlaying(true);
    } catch (error) {
      console.error("Error playing sound:", error);
    } finally {
      setMusicLoading(false);
    }
  };

  // 播放/暫停
  const togglePlayPause = async () => {
    if (isPlaying) {
      await sound.current.pauseAsync();
    } else {
      await sound.current.playAsync();
    }
    setIsPlaying(!isPlaying);
  };

  // 關閉播放器
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

  // 將物件轉成陣列再做 findIndex
  const getCurrentMusicIndex = () => {
    if (!playlists || !playlists[music.type]) return -1;

    // playlists[music.type] 可能是 {0: {...}, 1: {...}, 2: {...}}
    const musicList = Object.values(playlists[music.type]);
    // 現在 musicList 才是一個真正的陣列

    return musicList.findIndex(item => item.musicName === music.musicName);
  };




  const insets = useSafeAreaInsets();
  const tabBarHeight = 55 + insets.bottom;

  return (
    <Animated.View
      style={{
        display: musicplayerdisplay,
        position: 'absolute',
        bottom: tabBarHeight,
        width: '100%',
        alignItems: 'center',
        opacity: animatedOpacity,  // 加上淡入淡出效果
      }}
    >
      <View style={styles.container}>
        {/* 上方：Slider + 時間 */}
        <View style={styles.sliderContainer}>
          <View style={styles.timeRow}>
            <Text style={styles.timeText}>
              {Number.isNaN(positionMillis) ? "0:00" : formatTime(positionMillis)}
            </Text>
            <Text style={styles.timeText}>
              {Number.isNaN(durationMillis) ? "0:00" : formatTime(durationMillis)}
            </Text>
          </View>
          <Slider
            style={styles.sliderStyle}
            minimumValue={0}
            maximumValue={durationMillis}
            value={positionMillis}
            minimumTrackTintColor="#000000"
            maximumTrackTintColor="#FFFFFF"
            thumbTintColor="#000000"
            onSlidingComplete={async (value) => {
              try {
                await sound.current.setPositionAsync(value);
              } catch (e) {
                console.error(e);
              }
            }}
          />

        </View>

        {/* 下方：控制列 */}
        <View style={styles.controlsContainer}>
          <TouchableOpacity onPress={closeMusicPlayer}>
            <AntDesign name="close" size={24} style={styles.controlIcon} />
          </TouchableOpacity>

          {/* <Image 
            source={require('../assets/img/headphone.png')} 
            style={styles.image} 
          /> */}

          <View style={styles.detailsContainer}>
            <Text style={styles.bookName}>{currentTrack.bookname}</Text>
            <Text style={styles.page}>{currentTrack.page}</Text>
          </View>

          {musicLoading ? (
            <ActivityIndicator
              size={30}
              color="black"
              style={styles.controlIcon}
            />
          ) : (
            <TouchableOpacity onPress={togglePlayPause}>
              <AntDesign
                name={isPlaying ? "pause" : "play"}
                size={35}
                style={styles.controlIcon}
              />
            </TouchableOpacity>
          )}

          <TouchableOpacity onPress={handleNextTrack}>
            <AntDesign
              name="stepforward"
              size={30}
              color="black"
              style={styles.controlIcon}
            />
          </TouchableOpacity>

        </View>
      </View>
    </Animated.View>
  );
}

const styles = {
  container: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    backgroundColor: COLORS.musicplayer,
    height: 'auto',
    padding: 10,
    width: '100%',
  },
  // -------------- Slider + 時間 --------------
  sliderContainer: {
    // 讓 Slider 置頂
    width: '100%',
    alignItems: 'center',
  },
  sliderStyle: {
    width: '95%',
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '95%',
    marginTop: -5,
  },
  timeText: {
    color: 'black',
    fontSize: SIZES.font,
    fontWeight: '600'
  },

  // -------------- 控制列 --------------
  controlsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    // 這裡可以再加一些 marginTop、padding 等微調
  },
  controlIcon: {
    marginHorizontal: 10,
    color: COLORS.black,
  },

  // -------------- 其他 --------------
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
};
