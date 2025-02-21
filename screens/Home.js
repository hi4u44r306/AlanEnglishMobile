// import React from "react";
// import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView, RefreshControl } from 'react-native';

// import { HomeHeader, FocusedStatusBar, MusicCard } from "../components";
// import { COLORS, FONTS } from "../constants";
// import ScreenContainer from "./ScreenContainer";

// import { useState } from "react";
// import { useEffect } from "react";
// import { ProgressBar } from 'react-native-paper';
// import { Feather, FontAwesome, Fontisto } from "@expo/vector-icons";
// import { getAuth } from "firebase/auth";
// import { onValue, ref as rtdbRef } from "firebase/database";
// import { rtdb } from "./firebase-config";


// const Home = () => {
//   const [refreshing, setRefreshing] = useState(false);
// //   const [homeworkdata, setHomeworkData] = useState([]);
// //   const currentMonth = new Date().toJSON().slice(0, 7);
// //   const currentDate = new Date().toJSON().slice(0, 10);

//   const [userData, setUserData] = useState({
//     username: '',
//     classname: '',
//     useruid: '',
//     dayplaytime: '',
//     monthplaytime: '',
//   });

//   const percentage = userData.dayplaytime / 30;

//     const auth = getAuth();
//     const user = auth.currentUser;
//    useEffect(() => {
//      // 用來存放解除監聽的函數
//      let unsubscribe;
   
//      const fetchRealtimeUserData = async () => {
//        try {
//          if (user.uid) {
//            const userRef = rtdbRef(rtdb, `student/${user.uid}`);
   
//            // 監聽資料變化
//            unsubscribe = onValue(
//              userRef,
//              (snapshot) => {
//                const data = snapshot.val();
//                if (data) {
//                  setUserData({
//                    username: data.name || 'Guest',
//                    classname: data.class || 'N/A',
//                    useruid: user.uid,
//                    dayplaytime: data.Daytotaltimeplayed || '0',
//                    monthplaytime: data.Monthtotaltimeplayed || '0',
//                  });
//                }
//              },
//              (error) => {
//                console.error("Error fetching realtime user data:", error);
//              }
//            );
//          }
//        } catch (error) {
//          console.error('Failed to retrieve user uid from AsyncStorage:', error);
//        }
//      };
   
//      fetchRealtimeUserData();
   
//      // 清除監聽器
//      return () => {
//        if (unsubscribe) {
//          unsubscribe();
//        }
//      };
//    }, []);


//   const onRefresh = () => {
//     setRefreshing(true);
//     fetchDatafromRealtimeDB();
//     getUserdata();
//     setRefreshing(false);
//   }

//   const fontcolor = 'white';
//   return (
//     <ScreenContainer>
//       <FocusedStatusBar backgroundColor={COLORS.primary} />
//       {/* <Image blurRadius={50} source={require('../assets/img/background.png')} style={{
//         position: 'absolute',
//         width: '100%',
//         height: '100%',
//       }} /> */}
//       <ScrollView
//         contentContainerStyle={styles.container}
//         refreshControl={
//           <RefreshControl
//             refreshing={refreshing}
//             onRefresh={onRefresh}
//           />
//         }
//       >
//         <FocusedStatusBar backgroundColor={COLORS.primary} />
//         <HomeHeader display='none' />
//         <View style={styles.missionContainer}>
//           <Text style={{ fontSize: 20, fontFamily: FONTS.bold, fontWeight: '700', color: fontcolor }}>每日任務</Text>
//           <View style={styles.userinfo}>
//             <Text style={styles.userInfoText}>聽力 30 / {userData.dayplaytime || 0} 次</Text>
//             {/* <Text style={styles.userinfolabel}>目前聽力 {dailyplayed} 次</Text> */}
//             <View style={styles.progressBarContainer}>
//               <ProgressBar progress={percentage} theme={{
//                 colors: {
//                   primary: 'red',
//                   surfaceVariant: fontcolor
//                 },
//               }} style={{
//                 height: 8,
//                 borderRadius: 30,
//               }} />
//             </View>
//             {
//               percentage >= 1
//                 ?
//                 <FontAwesome name="check-square-o" size={25} color={fontcolor} />
//                 :
//                 <Feather name="square" size={25} color={fontcolor} />
//             }
//           </View>
//           {/* <View style={styles.userinfo}>
//             <Text style={styles.userInfoText}>
//               {
//                 homeworkdata.length > 0
//                   ?
//                   `${homeworkdata[0].習作本} P.${homeworkdata[0].習作本頁數1} ~ P.${homeworkdata[0].習作本頁數2}`
//                   :
//                   "今日無習作本"
//               }
//             </Text>
//           </View>
//           <View style={styles.userinfo}>
//             <Text style={styles.userInfoText}>
//               {
//                 homeworkdata.length > 0
//                   ?
//                   `${homeworkdata[0].聽力本} P.${homeworkdata[0].聽力本頁數1} ~ P.${homeworkdata[0].聽力本頁數2}`
//                   :
//                   "今日無聽力本"
//               }
//             </Text>
//           </View> */}
//         </View>

//         {/* Footer Section */}
//         {/* <View style={styles.footer}>
//           <Text style={styles.footerText}>Download the app now and enhance your English listening skills!</Text>
//         </View> */}
//       </ScrollView>
//     </ScreenContainer>
//   );
// };
// const fontcolor = COLORS.lightgray;
// const fontFamily = FONTS.bold;
// const styles = StyleSheet.create({
//   container: {
//     justifyContent: 'space-between',
//   },
//   missionContainer: {
//     backgroundColor: COLORS.blue,
//     padding: 15,
//   },
//   userInfoText: {
//     color: fontcolor,
//     fontSize: 15,
//     fontWeight: '700',
//     marginTop: 5,
//     marginBottom: 5,
//     justifyContent: 'flex-start',
//   },
//   userinfo: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     margin: 10,
//   },
//   progressBarContainer: {
//     width: '60%'
//   },

//   header: {
//     padding: 20,
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },
//   logo: {
//     width: 100,
//     height: 100,
//   },
//   appName: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginTop: 10,
//   },
//   features: {
//     marginTop: 30,
//   },
//   featureText: {
//     fontSize: 16,
//     marginBottom: 10,
//   },
//   ctaButton: {
//     backgroundColor: '#007BFF',
//     padding: 15,
//     borderRadius: 10,
//     alignItems: 'center',
//   },
//   ctaButtonText: {
//     color: '#FFFFFF',
//     fontSize: 18,
//     fontWeight: 'bold',
//   },
//   footer: {
//     marginBottom: 30,
//     alignItems: 'center',
//   },
//   footerText: {
//     fontSize: 16,
//     textAlign: 'center',
//   },


// });
// export default Home;
import React, { useState, useEffect } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  RefreshControl 
} from 'react-native';
import { ProgressBar } from 'react-native-paper';
import { Feather, FontAwesome } from "@expo/vector-icons";
import { getAuth } from "firebase/auth";
import { onValue, ref as rtdbRef } from "firebase/database";
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

  // 計算進度（每日目標：30 次）
  const dayPlaytime = parseFloat(userData.dayplaytime) || 0;
  const percentage = dayPlaytime / 30;

  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    let unsubscribe;

    const fetchRealtimeUserData = async () => {
      try {
        if (user && user.uid) {
          const userRef = rtdbRef(rtdb, `student/${user.uid}`);

          // 監聽資料變化
          unsubscribe = onValue(
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

    // 解除監聽
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [user]);

  // 若首頁還有其他即時資料更新邏輯，可在這裡定義 fetchDatafromRealtimeDB 與 getUserdata
  const onRefresh = () => {
    setRefreshing(true);
    // fetchDatafromRealtimeDB();
    // getUserdata();
    setRefreshing(false);
  };

  return (
    <ScreenContainer>
      <FocusedStatusBar backgroundColor={COLORS.primary} />
      <ScrollView
        contentContainerStyle={styles.container}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <FocusedStatusBar backgroundColor={COLORS.primary} />
        <HomeHeader display="none" />

        {/* 每日任務區塊 */}
        <View style={styles.missionContainer}>
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
        </View>

        {/* 可考慮在首頁新增其他區塊，例如： */}
        {/*
          1. 推薦課程/聽力練習：展示熱門或新上架的英文聽力課程
          2. 每日單字/短語：提供每日一句或單字，讓使用者學習新詞彙
          3. 聽力排行榜：顯示用戶的聽力練習進度或排名
          4. 最新消息：分享APP的更新內容、活動或挑戰
        */}
        <View style={styles.extraContainer}>
          <Text style={styles.extraTitle}>推薦聽力練習</Text>
          {/* 這裡可以放置例如 MusicCard 的列表或其他自定義卡片 */}
          {/* <ScrollView horizontal>
                {recommendedData.map(item => (
                  <MusicCard key={item.id} data={item} />
                ))}
              </ScrollView> */}
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
    backgroundColor: COLORS.background, // 可在 constants 中定義背景色（例如淺灰）
    padding: 16,
  },
  missionContainer: {
    backgroundColor: COLORS.blue,
    padding: 20,
    borderRadius: 16,
    marginVertical: 12,
    // 陰影效果（iOS 與 Android）
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  missionTitle: {
    fontSize: 22,
    fontFamily: FONTS.bold,
    fontWeight: '700',
    color: COLORS.white,
    marginBottom: 16,
    textAlign: 'center',
  },
  userinfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  userInfoText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
  },
  progressBarContainer: {
    flex: 1,
    marginHorizontal: 12,
  },
  progressBar: {
    height: 10,
    borderRadius: 5,
  },
  extraContainer: {
    backgroundColor: COLORS.primary,
    padding: 20,
    borderRadius: 16,
    marginVertical: 12,
    // 陰影效果
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  extraTitle: {
    fontSize: 20,
    fontFamily: FONTS.bold,
    fontWeight: '700',
    color: COLORS.white,
    marginBottom: 8,
    textAlign: 'center',
  },
  extraDescription: {
    fontSize: 14,
    color: COLORS.lightgray,
    textAlign: 'center',
    marginTop: 8,
  },
});

export default Home;
