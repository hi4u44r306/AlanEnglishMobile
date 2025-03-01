import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Animated, ActivityIndicator, Image } from 'react-native';
import Slider from '@react-native-community/slider';
import { COLORS, SIZES } from '../constants';
import { AntDesign, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { useDispatch, useSelector } from "react-redux";
import { Audio, ResizeMode } from 'expo-av';
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
  // state 用來顯示目前累計的聽取時間（用於畫面顯示、debug 等）
  const [listenedMillis, setListenedMillis] = useState(0);
  // ref 用來儲存最新的聽取時間（避免閉包問題）
  const listenedMillisRef = useRef(0);
  // 用來儲存計時器 ID
  const timerRef = useRef(null);

  // 新增：重複播放狀態
  const [repeat, setRepeat] = useState(false);
  const repeatRef = useRef(false);

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

  // 當外部傳入的 music 改變時重新播放，並重置累計聽取時間
  useEffect(() => {
    if (music && isPlaylistsLoaded) {
      setCurrentTrack(music);
      // 重置 state 與 ref
      setListenedMillis(0);
      listenedMillisRef.current = 0;
      playSound(music);
    }
  }, [music, isPlaylistsLoaded]);

  // 播放器顯示狀態改變時的淡入淡出
  useEffect(() => {
    Animated.timing(animatedOpacity, {
      toValue: musicplayerdisplay === 'flex' ? 1 : 0,
      duration,
      useNativeDriver: false,
    }).start();
  }, [musicplayerdisplay]);

  // 利用 useEffect 當播放狀態改變時啟動或清除計時器
  useEffect(() => {
    // 先清除之前的計時器
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    // 當 isPlaying 為 true 時，建立新的計時器
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        listenedMillisRef.current += 1000;
        console.log('listenedMillisRef : ', listenedMillisRef.current);
        setListenedMillis(listenedMillisRef.current);
      }, 1000);
    }
    // 清除計時器（component unmount 時）
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isPlaying, currentTrack]); // 加入 currentTrack 為依賴


  // 播放下一首
  const handleNextTrack = () => {
    if (!playlists || !playlists[music.type]) return;

    const musicList = Object.values(playlists[music.type]);
    const currentIndex = getCurrentMusicIndex();
    if (currentIndex === -1) return;

    let nextTrackIndex = currentIndex + 1;
    if (nextTrackIndex >= musicList.length) {
      nextTrackIndex = 0;
    }
    let nextTrack = musicList[nextTrackIndex];

    // 如果下一首或當前曲目被鎖定，則回到第一首（或找出第一個未鎖定的）
    if (nextTrack.locked || musicList[currentIndex].locked) {
      nextTrack = musicList.find(track => !track.locked) || musicList[0];
    }

    setListenedMillis(0);
    listenedMillisRef.current = 0;
    dispatch(setCurrentPlaying(nextTrack));
  };

  // 顯示通過通知
  const success = () => {
    Toast.show({
      type: 'success',
      position: 'top',
      text1: '太棒了! 聽力次數+1',
      visibilityTime: 2000,
      autoHide: true,
    });
  };

  // 顯示錯誤通知
  const error = () => {
    Toast.show({
      type: 'error',
      position: 'top',
      text1: '要完全聽完才能增加播放次數喔!',
      visibilityTime: 5000,
      autoHide: true,
    });
  };

  // 更新資料庫
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
          newMusicPlay >= 20
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

  // 播放狀態更新的 callback
  // 播放狀態更新的 callback
  const onPlaybackStatusUpdate = (status) => {
    if (status.isLoaded) {
      const safePosition = isNaN(status.positionMillis) ? 0 : status.positionMillis;
      const safeDuration = isNaN(status.durationMillis) ? 0 : status.durationMillis;
      setPositionMillis(safePosition);
      setDurationMillis(safeDuration);

      if (status.didJustFinish) {
        // 清除計時器
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
        // 利用 ref 的值來計算聽取比例
        const listenedPercentage = safeDuration ? listenedMillisRef.current / safeDuration : 0;
        console.log('listenedPercentage : ', listenedPercentage);
        // 只有聽取達 95% 以上才更新播放次數
        if (listenedPercentage >= 0.90) {
          updateRTDBData();
        } else {
          error();
        }
        // 重置累計聽取時間
        setListenedMillis(0);
        listenedMillisRef.current = 0;
        // 根據重複模式決定：重播目前曲目或播放下一首
        if (repeatRef.current) {
          // 將 isPlaying 設為 false 來觸發 useEffect 重啟計時器
          setIsPlaying(false);
          playSound(currentTrack);
        } else {
          handleNextTrack();
        }
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
      // 重置累計聽取時間（state 與 ref）
      setListenedMillis(0);
      listenedMillisRef.current = 0;
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
      setIsPlaying(false);
    } else {
      await sound.current.playAsync();
      setIsPlaying(true);
    }
  };

  // 切換重複播放狀態
  const toggleRepeat = () => {
    setRepeat(prev => {
      const newValue = !prev;
      repeatRef.current = newValue;
      return newValue;
    });
  };

  // 關閉播放器
  const closeMusicPlayer = async () => {
    Animated.timing(animatedOpacity, {
      toValue: 0,
      duration,
      useNativeDriver: false,
    }).start();
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    await sound.current.stopAsync();
    dispatch(setCurrentMargin(0));
    dispatch(setMusicPlayerDisplay('none'));
  };

  // 將物件轉成陣列再做 findIndex
  const getCurrentMusicIndex = () => {
    if (!playlists || !playlists[music.type]) return -1;
    const musicList = Object.values(playlists[music.type]);
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
        opacity: animatedOpacity,
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


          <Image
            style={styles.image}
            source={require('../assets/img/headphone.png')}
          />
          <View style={styles.detailsContainer}>
            <Text style={styles.bookName}>{currentTrack.bookname}</Text>
            <Text style={styles.page}>{currentTrack.page}</Text>
          </View>

          {/* 新增：重複播放按鈕，根據狀態改變顏色 */}
          <TouchableOpacity onPress={toggleRepeat}>
            {
              repeat ?
                (
                  <MaterialIcons
                    name="repeat-on"
                    size={30}
                    style={[styles.controlIcon, { color: "red" }]}
                  />
                )
                :
                (
                  <MaterialIcons
                    name="repeat"
                    size={30}
                    style={[styles.controlIcon, { color: "black" }]}
                  />
                )
            }

          </TouchableOpacity>

          {musicLoading ? (
            <ActivityIndicator size={30} color="black" style={styles.controlIcon} />
          ) : (
            <TouchableOpacity onPress={togglePlayPause}>
              <AntDesign
                name={isPlaying ? "pause" : "play"}
                size={35}
                style={styles.controlIcon}
              />
            </TouchableOpacity>
          )}

          {/* 如果需要也可以加入下一首按鈕 */}
          {/* <TouchableOpacity onPress={handleNextTrack}>
            <AntDesign
              name="stepforward"
              size={30}
              color="black"
              style={styles.controlIcon}
            />
          </TouchableOpacity> */}
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
  sliderContainer: {
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
  controlsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  controlIcon: {
    marginHorizontal: 10,
    color: COLORS.black,
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
  image: {
    width: 40,
    height: 40,
    marginRight: 10,
    ResizeMode: 'contain',
  }
};
