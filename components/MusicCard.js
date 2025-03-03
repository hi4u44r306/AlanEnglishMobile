import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text } from "react-native";
import { COLORS } from "../constants";
import { MusicTitle } from "./SubInfo";
import { PlayButton } from "./Button";
import { useDispatch } from "react-redux";
import {
  setCurrentMargin,
  setCurrentPlaying,
  setMusicPlayerDisplay,
} from "./actions/actions";
import { child, onValue, ref as rtdbRef } from "firebase/database";
import {
  getDownloadURL,
  getStorage,
  ref as storageRef,
} from "firebase/storage";
import { rtdb } from "../screens/firebase-config";
import { getAuth } from "firebase/auth";

const PASS_COUNT = 20; // 通過次數閾值

const MusicCard = (props) => {
  const dispatch = useDispatch();
  const { bookname, musicName, page, locked } = props.music;
  const { onAudioEnd } = props; // 父層傳入的回呼，用來處理播放結束後的跳轉
  const [audioURL, setAudioURL] = useState("");
  const [complete, setComplete] = useState();
  const [musicplay, setMusicPlay] = useState(0);

  const convertmusicName = bookname + " " + page;
  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    // 監聽單一單元的播放次數 & 完成狀態
    const dbRef = rtdbRef(rtdb);
    const completeRef = child(
      dbRef,
      `student/${user.uid}/MusicLogfile/${convertmusicName}/complete`
    );
    const musicplayRef = child(
      dbRef,
      `student/${user.uid}/MusicLogfile/${convertmusicName}/musicplay`
    );

    onValue(musicplayRef, (snapshot) => {
      setMusicPlay(snapshot.exists() ? snapshot.val() : 0);
    });

    onValue(completeRef, (snapshot) => {
      setComplete(snapshot.exists() ? snapshot.val() : "");
    });
  }, [convertmusicName]);

  // 播放前取得檔案 URL
  async function fetchAudioURL() {
    const storage = getStorage();
    try {
      const audioPath = storageRef(storage, `Music/${musicName}`);
      const audioDownloadURL = await getDownloadURL(audioPath);
      setAudioURL(audioDownloadURL);
      return audioDownloadURL;
    } catch (error) {
      console.error("Error fetching audio URL:", error);
    }
  }

  // 點擊播放
  function handlePlay() {
    // if (locked) return; // 若被鎖定，則不允許播放
    fetchAudioURL();
    if (!musicName) {
      console.error("Music name is undefined.");
      return;
    }
    dispatch(setCurrentMargin(90));
    dispatch(setMusicPlayerDisplay("flex"));
    dispatch(setCurrentPlaying({ ...props.music, audioURL }));
  }

  /**
   * 此函式用於音檔播放完畢時自動觸發
   * 請將你播放器的 onPlaybackStatusUpdate 中，
   * 當發現播放結束（例如 didJustFinish === true）時，
   * 呼叫此函式： onPlaybackEnd()
   */
  function onPlaybackEnd() {
    if (onAudioEnd) {
      onAudioEnd(props.music);
    }
  }

  // 計算進度條的寬度百分比（最多到 PASS_COUNT）
  const progress = Math.min(musicplay, PASS_COUNT) / PASS_COUNT;

  return (
    <View
      style={[
        styles.cardContainer,
        // 若 locked 為 true，就同時將 opacity 設為 0.3 並停用觸控
        // locked
        //   ? { opacity: 0.3, pointerEvents: 'none' }
        //   : { pointerEvents: 'auto' },
      ]}
    >
      <View style={styles.musiclist}>
        <View style={styles.rowBetween}>
          <MusicTitle
            title={bookname}
            subTitle={page}
            musicplay={musicplay}
            complete={complete}
          />
          <PlayButton handlePress={handlePlay} />
        </View>

        {/* 播放次數進度條 + 是否通過的顯示 */}
        <View style={styles.progressContainer}>
          {musicplay < PASS_COUNT ? (
            <>
              {/* 進度條 */}
              <View style={styles.progressBarBackground}>
                <View
                  style={[
                    styles.progressBarFill,
                    { width: `${progress * 100}%` },
                  ]}
                />
              </View>
              {/* 顯示目前播放次數 / 目標次數 */}
              <Text style={styles.progressText}>
                {musicplay}次 / {PASS_COUNT}次
              </Text>
            </>
          ) : (
            // 如果已經 >= PASS_COUNT，就顯示勾勾
            <View style={styles.passContainer}>
              <Text style={styles.passText}>恭喜達標</Text>
              <Text style={styles.passCheckMark}>✓</Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

export default MusicCard;

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: COLORS.white,
  },
  musiclist: {
    width: "100%",
    padding: 10,
    borderBottomColor: "gray",
    borderBottomWidth: 1,
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  // 進度條區域
  progressContainer: {
    marginTop: 10,
    alignItems: "center",
  },
  progressBarBackground: {
    width: "90%",
    height: 8,
    backgroundColor: "#ccc",
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: 5,
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: "green",
  },
  progressText: {
    fontSize: 14,
    color: "#666",
  },
  passContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  passText: {
    fontSize: 16,
    color: "green",
    marginRight: 5,
  },
  passCheckMark: {
    fontSize: 18,
    color: "green",
  },
});
