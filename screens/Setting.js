// import React, { useEffect, useState } from "react";
// import { 
//   View, Text, Switch, TouchableOpacity, StyleSheet 
// } from "react-native";
// import DateTimePickerModal from "react-native-modal-datetime-picker";
// import * as Notifications from "expo-notifications";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { getAuth } from "firebase/auth";
// import { rtdb } from "./firebase-config";
// import { onValue, ref as rtdbRef } from "firebase/database";
// import { HomeHeader, FocusedStatusBar } from "../components";
// import { COLORS } from "../constants";
// import ScreenContainer from "./ScreenContainer";

// const Setting = ({ navigation }) => {
//   const [time, setTime] = useState(new Date());
//   const [isPickerVisible, setPickerVisible] = useState(false);
//   const [username, setUsername] = useState("用戶");
//   const [pushEnabled, setPushEnabled] = useState(true);

//   const auth = getAuth();
//   const user = auth.currentUser;

//   // 讀取 Firebase 的用戶名稱
//   useEffect(() => {
//     let unsubscribe;
//     const fetchUserName = async () => {
//       try {
//         if (user?.uid) {
//           const userRef = rtdbRef(rtdb, `student/${user.uid}`);
//           unsubscribe = onValue(
//             userRef,
//             (snapshot) => {
//               const data = snapshot.val();
//               if (data) {
//                 setUsername(data.name || "用戶");
//               }
//             },
//             (error) => {
//               console.error("Error fetching user data:", error);
//             }
//           );
//         }
//       } catch (error) {
//         console.error("讀取用戶名稱失敗:", error);
//       }
//     };

//     const loadTime = async () => {
//       const savedTime = await AsyncStorage.getItem("notificationTime");
//       if (savedTime) setTime(new Date(savedTime));
//     };

//     fetchUserName();
//     loadTime();

//     return () => {
//       if (unsubscribe) {
//         unsubscribe();
//       }
//     };
//   }, []);

//   // 顯示時間選擇器
//   const showPicker = () => setPickerVisible(true);
//   const hidePicker = () => setPickerVisible(false);

//   // 當用戶選擇時間
//   const handleConfirm = (selectedTime) => {
//     hidePicker();
//     setTime(selectedTime);
//     AsyncStorage.setItem("notificationTime", selectedTime.toISOString());
//     scheduleNotification(selectedTime);
//   };

//   // 設定通知
//   const scheduleNotification = async (selectedTime) => {
//     await Notifications.cancelAllScheduledNotificationsAsync();

//     const trigger = new Date(selectedTime);
//     trigger.setSeconds(0);

//     await Notifications.scheduleNotificationAsync({
//       content: {
//         title: "Alan English",
//         body: `${username}，到了練習聽力的時間！趕快來練習吧！`,
//       },
//       trigger,
//     });
//   };

//   return (
//     <ScreenContainer>
//       <FocusedStatusBar backgroundColor={COLORS.primary} />
//       <HomeHeader display="none" />

//       <View style={styles.container}>
//         <Text style={styles.title}>設定</Text>

//         {/* 推播通知開關 */}
//         <View style={styles.row}>
//           <Text style={styles.text}>推播通知</Text>
//           <Switch value={pushEnabled} onValueChange={setPushEnabled} />
//         </View>

//         {/* 選擇通知時間 */}
//         <TouchableOpacity style={styles.row} onPress={showPicker}>
//           <Text style={styles.text}>通知時間</Text>
//           <Text style={styles.time}>{time.toLocaleTimeString()}</Text>
//         </TouchableOpacity>

//         <DateTimePickerModal
//           isVisible={isPickerVisible}
//           mode="time"
//           onConfirm={handleConfirm}
//           onCancel={hidePicker}
//         />

//         {/* 其他設定選項 */}
//         <TouchableOpacity style={styles.row} onPress={() => navigation.navigate("Privacy")}>
//           <Text style={styles.text}>隱私政策</Text>
//         </TouchableOpacity>

//         <TouchableOpacity style={styles.row} onPress={() => navigation.navigate("AboutUs")}>
//           <Text style={styles.text}>關於我們</Text>
//         </TouchableOpacity>

//         <TouchableOpacity style={styles.row} onPress={() => navigation.navigate("LearnMore")}>
//           <Text style={styles.text}>了解更多</Text>
//         </TouchableOpacity>
//       </View>
//     </ScreenContainer>
//   );
// };

// // **樣式**
// const styles = StyleSheet.create({
//   container: {
//     padding: 20,
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: "bold",
//     marginBottom: 20,
//   },
//   text: {
//     fontSize: 18,
//   },
//   time: {
//     fontSize: 18,
//     color: "gray",
//   },
//   row: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     paddingVertical: 15,
//     borderBottomWidth: 1,
//     borderBottomColor: "#ddd",
//   },
// });

// export default Setting;

import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { FocusedStatusBar, HomeHeader } from "../components";
import ScreenContainer from "./ScreenContainer";
import { COLORS } from "../constants";

const Setting = ({ navigation }) => {
  return (
    <ScreenContainer>
      <FocusedStatusBar backgroundColor={COLORS.primary} />
      <HomeHeader display="none" />
      <View style={styles.container}>
        <Text style={styles.header}>Settings</Text>

        {/* 設定選項列表 */}
        <TouchableOpacity style={styles.row} onPress={() => navigation.navigate("NotificationSettings")}>
          <Ionicons name="notifications-outline" size={22}   />
          <Text style={styles.text}>Notifications</Text>
          <Ionicons name="chevron-forward" size={20} color="#aaa" style={styles.icon} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.row} onPress={() => navigation.navigate("PrivacyPolicy")}>
          <Ionicons name="shield-outline" size={22}   />
          <Text style={styles.text}>Privacy Policy</Text>
          <Ionicons name="chevron-forward" size={20} color="#aaa" style={styles.icon} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.row} onPress={() => navigation.navigate("AboutUs")}>
          <Ionicons name="information-circle-outline" size={22}   />
          <Text style={styles.text}>About Us</Text>
          <Ionicons name="chevron-forward" size={20} color="#aaa" style={styles.icon} />
        </TouchableOpacity>
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  text: {
    fontSize: 18,
    flex: 1,
    marginLeft: 10,
  },
  icon: {
    marginLeft: "auto",
  },
});

export default Setting;
