import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import ScreenContainer from "./ScreenContainer";
import { FocusedStatusBar } from "../components";
import { rtdb } from "./firebase-config";
import { child, get, ref as rtdbRef, push, set } from "firebase/database";
import { COLORS } from "../constants";

const SetNotification = () => {
  const [customTitle, setCustomTitle] = useState("");
  const [message, setMessage] = useState("");

  // 取得 Firebase 中的推播 tokens
  const fetchPushTokens = async () => {
    try {
      const dbRef = rtdbRef(rtdb);
      const snapshot = await get(child(dbRef, "pushTokens"));
      if (snapshot.exists()) {
        // 移除重複的 tokens
        const tokens = [...new Set(Object.values(snapshot.val()))];
        return tokens;
      } else {
        return [];
      }
    } catch (error) {
      console.error("Error fetching push tokens:", error);
      return [];
    }
  };


  // 儲存通知到 Firebase
  const saveNotificationToFirebase = async (title, message) => {
    try {
      const notificationRef = push(rtdbRef(rtdb, "notifications"));
      await set(notificationRef, {
        title: title,
        body: message,
        timestamp: new Date().toISOString(),
      });
      console.log("通知已儲存到 Firebase");
    } catch (error) {
      console.error("儲存通知時發生錯誤:", error);
    }
  };

  // 發送通知
  const sendNotification = async () => {
    if (!customTitle.trim() || !message.trim()) {
      Alert.alert("請輸入完整的通知標題與內容");
      return;
    }

    const tokens = await fetchPushTokens();
    if (tokens.length === 0) {
      Alert.alert("目前沒有用戶可以接收通知");
      return;
    }

    const notifications = tokens.map((token) => ({
      to: token,
      sound: "default",
      title: customTitle,
      body: message,
      data: { extraData: "可根據需求傳遞其他資料" },
    }));

    try {
      const response = await fetch("https://exp.host/--/api/v2/push/send", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Accept-encoding": "gzip, deflate",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(notifications),
      });

      console.log("Push notification response:", await response.json());
      Alert.alert("通知已發送！");

      // 儲存通知到 Firebase
      await saveNotificationToFirebase(customTitle, message);

      // 清除輸入欄位
      setCustomTitle("");
      setMessage("");
    } catch (error) {
      console.error("Error sending push notifications:", error);
      Alert.alert("發送通知時發生錯誤");
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <FocusedStatusBar backgroundColor={COLORS.black} />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <Text style={styles.title}>設定全域通知</Text>
          <Text style={styles.subtitle}>分享聽力練習推播通知訊息！</Text>

          {/* 通知標題輸入框 */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="輸入通知標題..."
              placeholderTextColor="#aaa"
              value={customTitle}
              onChangeText={setCustomTitle}
            />
          </View>

          {/* 通知內容輸入框 */}
          <View style={styles.inputContainer}>
            <TextInput
              style={[styles.input, { minHeight: 100 }]}
              placeholder="輸入通知內容..."
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
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFF9F2",
  },
  container: {
    flex: 1,
    alignItems: "center",
    padding: 20,
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
});

export default SetNotification;
