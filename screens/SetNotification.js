import React, { useState } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  Alert, 
  Image 
} from "react-native";
import ScreenContainer from "./ScreenContainer";
import { FocusedStatusBar, HomeHeader } from "../components";
import { rtdb } from "./firebase-config";
import { child, get, ref as rtdbRef } from "firebase/database";
import * as Notifications from "expo-notifications";
import { COLORS } from "../constants";

const SetNotification = () => {
  const [message, setMessage] = useState("");

  // 從 Firebase RTDB 中取得所有用戶的推播 token
  const fetchPushTokens = async () => {
    try {
      const dbRef = rtdbRef(rtdb);
      const snapshot = await get(child(dbRef, "pushTokens"));
      if (snapshot.exists()) {
        const tokens = Object.values(snapshot.val());
        console.log("取得的 tokens:", tokens);
        return tokens;
      } else {
        return [];
      }
    } catch (error) {
      console.error("Error fetching push tokens:", error);
      return [];
    }
  };

  const sendNotification = async () => {
    if (!message.trim()) {
      Alert.alert("請輸入通知內容");
      return;
    }

    const tokens = await fetchPushTokens();

    if (tokens.length === 0) {
      Alert.alert("目前沒有用戶可以接收通知");
      return;
    }

    // 建立要發送的訊息，每個 token 一筆
    const notifications = tokens.map(token => ({
      to: token,
      sound: "default",
      title: "Alan English",
      body: message,
      data: { extraData: "可根據需求傳遞其他資料" },
    }));

    try {
      // 呼叫 Expo 推播 API
      const response = await fetch("https://exp.host/--/api/v2/push/send", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Accept-encoding": "gzip, deflate",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(notifications),
      });
      const data = await response.json();
      console.log("Push notification response:", data);
      Alert.alert("通知已發送！");
      setMessage("");
    } catch (error) {
      console.error("Error sending push notifications:", error);
      Alert.alert("發送通知時發生錯誤");
    }
  };

  return (
    <ScreenContainer>
      <FocusedStatusBar backgroundColor={COLORS.black} />
      <HomeHeader display="none" />
      <View style={styles.container}>
       
        <Text style={styles.title}>設定全域通知</Text>
        <Text style={styles.subtitle}>分享聽力練習推播通知訊息！</Text>

        {/* 通知內容輸入框 */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="輸入可愛的通知內容..."
            placeholderTextColor="#aaa"
            value={message}
            onChangeText={setMessage}
            multiline
          />
        </View>

        {/* 發送按鈕 */}
        <TouchableOpacity style={styles.button} onPress={sendNotification}>
          <Text style={styles.buttonText}>發送通知</Text>
        </TouchableOpacity>
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF9F2", // 柔和的背景色
    alignItems: "center",
    padding: 20,
  },
  logo: {
    width: 120,
    height: 120,
    marginVertical: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FF6F61",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: "#FFB6B9",
    marginBottom: 20,
  },
  inputContainer: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    padding: 15,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    marginBottom: 20,
  },
  input: {
    fontSize: 16,
    color: "#333",
    textAlignVertical: "top",
    minHeight: 100,
  },
  button: {
    backgroundColor: "#FF6F61",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginBottom: 20,
    shadowColor: "#FF6F61",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  illustrationsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginTop: 20,
  },
  illustration: {
    width: 80,
    height: 80,
  },
});

export default SetNotification;
