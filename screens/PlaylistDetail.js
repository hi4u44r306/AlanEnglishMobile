import React, { useState, useEffect, useCallback } from 'react';
import { Text, View, FlatList, StyleSheet, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux'; // 假設要用 dispatch
import ScreenContainer from './ScreenContainer';
import { FocusedStatusBar, HomeHeader, MusicCard } from '../components';
import { COLORS } from '../constants';
import { onValue, ref } from 'firebase/database';
import { rtdb } from './firebase-config';
import { getAuth } from 'firebase/auth';
import { setCurrentPlaying, setMusicPlayerDisplay, setCurrentMargin } from '../components/actions/actions';

const PlaylistDetail = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const musicType = route.params?.musicType || 'Default Type';
  const dispatch = useDispatch();

  // 來自 redux，目前播放的曲目
  const { playing } = useSelector(state => state.musicReducer);
  const [currMusic, setCurrMusic] = useState(null);

  // 播放清單
  const [playlists, setPlaylists] = useState([]);
  // 用來記錄每個「單元」是否通過
  const [completionMap, setCompletionMap] = useState({});

  // 螢幕尺寸
  const [dimensions, setDimensions] = useState({ window: Dimensions.get('window') });
  const { window } = dimensions;
  const windowHeight = window.height;

  // 取得當前使用者
  const auth = getAuth();
  const user = auth.currentUser;

  // 一次撈取「Music」資料
  useEffect(() => {
    const dbRef = ref(rtdb, 'Music');
    onValue(dbRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        setPlaylists(data);
      }
    });
  }, []);

  // 監聽螢幕旋轉
  useEffect(() => {
    const subscription = Dimensions.addEventListener("change", ({ window }) => {
      setDimensions({ window });
    });
    return () => subscription?.remove();
  }, []);

  // 監聽目前正在播放的音檔
  useEffect(() => {
    setCurrMusic(playing);
  }, [playing]);

  // 一次撈取使用者「所有單元」的完成資訊
  useEffect(() => {
    if (!user) return;
    const userRef = ref(rtdb, `student/${user.uid}/MusicLogfile`);
    onValue(userRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        setCompletionMap(data);
      }
    });
  }, [user]);

  // 依序判斷是否要鎖定 (locked)
  // 如果上一個單元未通過，就鎖定下一個單元
  const trackData = playlists[musicType] || [];
  let lockedSoFar = false; // 用來標記是否曾遇過「未通過」的單元
  const processedTracks = trackData.map((item, index) => {
    const convertmusicName = item.bookname + ' ' + item.page;
    const trackComplete = completionMap[convertmusicName]?.complete;

    let locked = false;
    if (index === 0) {
      // 第 1 個單元永遠解鎖
      locked = false;
    } else {
      // 檢查「上一個單元」是否通過
      const prevItem = trackData[index - 1];
      const prevName = prevItem.bookname + ' ' + prevItem.page;
      const prevComplete = completionMap[prevName]?.complete;
      if (prevComplete !== '通過') {
        locked = true;
      }
    }
    // 若之前已經鎖定，後面全部鎖
    if (lockedSoFar) locked = true;
    if (locked) lockedSoFar = true;
    return { ...item, locked };
  });

  /**
   * 當播放完畢時，決定要不要跳下一首
   * @param {Object} currentTrack - 目前播放完畢的那一首
   */
  const handleAudioEnd = useCallback((currentTrack) => {
    const idx = processedTracks.findIndex(
      t => t.musicName === currentTrack.musicName && t.page === currentTrack.page
    );
    if (idx < 0) return;
  
    const convertmusicName = currentTrack.bookname + ' ' + currentTrack.page;
    const isPassed = completionMap[convertmusicName]?.complete === '通過';
  
    let nextIndex = idx + 1;
    let nextTrack = processedTracks[nextIndex];
  
    // 當前音軌未通過或下一首被鎖定時，回到第一首
    if (!isPassed || !nextTrack || nextTrack.locked) {
      nextTrack = processedTracks.find(track => !track.locked) || processedTracks[0]; // 找到第一首未鎖定的
    }
  
    if (nextTrack) {
      dispatch(setCurrentMargin(65));
      dispatch(setMusicPlayerDisplay("flex"));
      dispatch(setCurrentPlaying({ ...nextTrack }));
    }
  }, [processedTracks, completionMap]);
  

  return (
    <ScreenContainer>
      <FlatList
        style={{ paddingBottom: windowHeight < 800 ? 20 : 30 }}
        data={processedTracks}
        keyExtractor={(item, idx) => `track-${idx}`}
        renderItem={({ item }) => (
            <MusicCard
            music={item}
            locked={item.locked}
            onAudioEnd={handleAudioEnd}  // 這個 handleAudioEnd 為你處理播放結束時回到第一首的邏輯
            />
        )}
        ListFooterComponent={() => (
          <View style={styles.endOfList}>
            <Ionicons name="checkmark-done-circle-outline" size={30} color="rgb(64, 98, 187)" />
            <Text style={styles.endOfListText}>這是播放列表的末端了</Text>
            <Ionicons name="checkmark-done-circle-outline" size={30} color="rgb(64, 98, 187)" />
          </View>
        )}
      />
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  endOfList: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 30,
    gap: 5,
  },
  endOfListText: {
    fontSize: 16,
    color: COLORS.gray,
    textTransform: 'uppercase',
  },
});

export default PlaylistDetail;
