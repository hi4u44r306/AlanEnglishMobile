import React, { useState, useEffect } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  RefreshControl 
} from "react-native";
import { ProgressBar } from "react-native-paper";
import { Feather, FontAwesome } from "@expo/vector-icons";
import { getAuth } from "firebase/auth";
import { onValue, ref as rtdbRef, query, orderByKey, limitToLast } from "firebase/database";
import { rtdb } from "./firebase-config";

import { HomeHeader, FocusedStatusBar } from "../components";
import { COLORS, FONTS } from "../constants";
import ScreenContainer from "./ScreenContainer";

const Home = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [userData, setUserData] = useState({
    username: '',
    classname: '',
    useruid: '',
    dayplaytime: '0',
    monthplaytime: '0',
  });
  // 用來儲存最新功課（最新上傳的資料）
  const [latestHomework, setLatestHomework] = useState(null);
console.log(userData.classname)
  // 計算進度（每日目標：30 次）
  const dayPlaytime = parseFloat(userData.dayplaytime) || 0;
  const percentage = dayPlaytime / 30;

  const auth = getAuth();
  const user = auth.currentUser;

  // 讀取使用者資料（例如班級）
  useEffect(() => {
    let unsubscribeUser;
    const fetchRealtimeUserData = async () => {
      try {
        if (user && user.uid) {
          const userRef = rtdbRef(rtdb, `student/${user.uid}`);
          unsubscribeUser = onValue(
            userRef,
            (snapshot) => {
              const data = snapshot.val();
              if (data) {
                setUserData({
                  username: data.name || 'Guest',
                  classname: data.class || 'N/A',
                  useruid: user.uid,
                  dayplaytime: data.Daytotaltimeplayed || '0',
                  monthplaytime: data.Monthtotaltimeplayed || '0',
                });
              }
            },
            (error) => {
              console.error("Error fetching realtime user data:", error);
            }
          );
        }
      } catch (error) {
        console.error('Error in realtime user data:', error);
      }
    };

    fetchRealtimeUserData();

    return () => {
      if (unsubscribeUser) unsubscribeUser();
    };
  }, [user]);

  // 依據使用者的班級讀取最新的功課資料
  useEffect(() => {
    if (userData.classname && userData.classname !== 'N/A') {
      const homeworkRef = rtdbRef(rtdb, `HomeworkAssignments/${userData.classname}`);
      // 依照 key（假設為 YYYY-MM-DD 格式）排序並取最後一筆資料
      const latestQuery = query(homeworkRef, orderByKey(), limitToLast(1));
      const unsubscribeHomework = onValue(latestQuery, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          // data 為一個物件，其 key 為日期，取出該筆資料
          const dateKey = Object.keys(data)[0];
          const latestData = data[dateKey];
          // 儲存日期也方便顯示
          setLatestHomework({ date: dateKey, ...latestData });
        } else {
          setLatestHomework(null);
        }
      });
      return () => {
        if (unsubscribeHomework) unsubscribeHomework();
      };
    }
  }, [userData.classname]);

  const onRefresh = () => {
    setRefreshing(true);
    // 這裡可依需要觸發重新讀取資料，範例僅透過狀態更新
    setRefreshing(false);
  };

  return (
    <ScreenContainer>
      <FocusedStatusBar backgroundColor={COLORS.primary} />
      <HomeHeader display="none" />
      <ScrollView
        contentContainerStyle={styles.container}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* 每日任務區塊 */}
        {/* <View style={styles.missionContainer}>
          <Text style={styles.missionTitle}>每日任務</Text>
          <View style={styles.userinfo}>
            <Text style={styles.userInfoText}>
              聽力目標：30 / {dayPlaytime} 次
            </Text>
            <View style={styles.progressBarContainer}>
              <ProgressBar
                progress={percentage > 1 ? 1 : percentage}
                color={COLORS.accent}
                style={styles.progressBar}
              />
            </View>
            {percentage >= 1 ? (
              <FontAwesome name="check-square-o" size={28} color={COLORS.white} />
            ) : (
              <Feather name="square" size={28} color={COLORS.white} />
            )}
          </View>
        </View> */}

        {/* 最新功課內容區塊 */}
        <View style={styles.homeworkContainer}>
          <Text style={styles.homeworkTitle}>最新功課內容</Text>
          {latestHomework ? (
            <View style={styles.homeworkContent}>
              <Text style={styles.homeworkDate}>日期：{latestHomework.date}</Text>
              {latestHomework.assignments && latestHomework.assignments.map((assignment, index) => (
                <View key={index} style={styles.assignmentItem}>
                  <Text style={styles.assignmentText}>
                    書本：{assignment.book}
                  </Text>
                  <Text>
                    {assignment.classification === "unit"
                      ? `單元：${assignment.start} - ${assignment.end}`
                      : `頁數：${assignment.start} - ${assignment.end}`}
                  </Text>
                  <Text>
                    次數：{assignment.times}
                  </Text>
                </View>
              ))}
            </View>
          ) : (
            <Text style={styles.noHomeworkText}>暫無最新功課</Text>
          )}
        </View>

        {/* 其他頁面區塊（例如：推薦聽力練習、每日單字等等） */}
        <View style={styles.extraContainer}>
          <Text style={styles.extraTitle}>推薦聽力練習</Text>
          <Text style={styles.extraDescription}>
            挑戰自己，精進聽力技能！點擊此處查看更多課程。
          </Text>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#f9f9f9", // 較淺的背景色
    padding: 16,
  },
  missionContainer: {
    backgroundColor: "#e0f7fa", // 淺藍/青色調
    padding: 20,
    borderRadius: 16,
    marginVertical: 12,
    shadowColor: "#aaa",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  missionTitle: {
    fontSize: 22,
    fontFamily: FONTS.bold,
    fontWeight: "700",
    color: "#333", // 深色文字
    marginBottom: 16,
    textAlign: "center",
  },
  userinfo: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },
  userInfoText: {
    color: "#333", // 深色文字
    fontSize: 16,
    fontWeight: "600",
  },
  progressBarContainer: {
    flex: 1,
    marginHorizontal: 12,
  },
  progressBar: {
    height: 10,
    borderRadius: 5,
  },
  homeworkContainer: {
    backgroundColor: "#fff", // 白色背景，較明亮
    padding: 20,
    borderRadius: 16,
    marginVertical: 12,
    shadowColor: "#aaa",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  homeworkTitle: {
    fontSize: 20,
    fontFamily: FONTS.bold,
    fontWeight: "700",
    color: "#333",
    marginBottom: 12,
    textAlign: "center",
  },
  homeworkContent: {
    backgroundColor: "#f5f5f5", // 淺灰色背景
    padding: 12,
    borderRadius: 8,
  },
  homeworkDate: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    color: "#333",
  },
  assignmentItem: {
    display:'flex',
    flexDirection:'row',
    justifyContent:'space-around',
    marginBottom: 10,
    backgroundColor: "#fff",
    padding: 8,
    borderRadius: 5,
  },
  assignmentText: {
    fontSize: 14,
    color: "#333",
  },
  noHomeworkText: {
    fontSize: 16,
    textAlign: "center",
    color: "#333",
  },
  extraContainer: {
    backgroundColor: "#e3f2fd", // 較淺的藍色調
    padding: 20,
    borderRadius: 16,
    marginVertical: 12,
    shadowColor: "#aaa",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  extraTitle: {
    fontSize: 20,
    fontFamily: FONTS.bold,
    fontWeight: "700",
    color: "#333",
    marginBottom: 8,
    textAlign: "center",
  },
  extraDescription: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginTop: 8,
  },
});


export default Home;
