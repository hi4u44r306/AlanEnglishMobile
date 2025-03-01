import React, { useState, useEffect } from "react";
import { View, Text, Switch, TouchableOpacity, StyleSheet, Modal } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";
import { getAuth } from "firebase/auth";
import { onValue, ref as rtdbRef } from "firebase/database";
import { rtdb } from "./firebase-config";

const NotificationSettings = () => {
  const [pushEnabled, setPushEnabled] = useState(true);
  const [showPicker, setShowPicker] = useState(false);
  const [time, setTime] = useState(new Date());
  const [username, setUsername] = useState();

  const auth = getAuth();
  const user = auth.currentUser;
  useEffect(() => {
    // 用來存放解除監聽的函數
    let unsubscribe;

    const fetchRealtimeUserData = async () => {
      try {
        if (user.uid) {
          const userRef = rtdbRef(rtdb, `student/${user.uid}`);

          // 監聽資料變化
          unsubscribe = onValue(
            userRef,
            (snapshot) => {
              const data = snapshot.val();
              if (data) {
                setUsername(data.name)
              }
            },
            (error) => {
              console.error("Error fetching realtime user data:", error);
            }
          );
        }
      } catch (error) {
        console.error('Failed to retrieve user uid from AsyncStorage:', error);
      }
    };

    fetchRealtimeUserData();

    // 清除監聽器
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  useEffect(() => {
    const loadTime = async () => {
      const savedTime = await AsyncStorage.getItem("notificationTime");
      if (savedTime) setTime(new Date(savedTime));
    };
    loadTime();
  }, []);

  const onChangeTime = async (event, selectedTime) => {
    setShowPicker(false);
    if (selectedTime) {
      setTime(selectedTime);
      await AsyncStorage.setItem("notificationTime", selectedTime.toISOString());
      scheduleNotification(selectedTime);
    }
  };

  const scheduleNotification = async (selectedTime) => {
    await Notifications.cancelAllScheduledNotificationsAsync();

    const trigger = new Date(selectedTime);
    trigger.setSeconds(0);

    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Alan English",
        body: `嗨${username}~到了練習聽力的時間！趕快來練習吧！`,
      },
      trigger,
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Notification Settings</Text>

      <View style={styles.row}>
        <Text style={styles.text}>推播通知</Text>
        <Switch value={pushEnabled} onValueChange={setPushEnabled} />
      </View>

      <TouchableOpacity style={styles.row} onPress={() => setShowPicker(true)}>
        <Text style={styles.text}>聽力練習通知時間</Text>
        <Text style={styles.time}>
          {time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </Text>
      </TouchableOpacity>

      <Modal transparent={true} visible={showPicker} animationType="fade">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <DateTimePicker
              value={time}
              mode="time"
              display="spinner"
              onChange={onChangeTime}
              textColor="black"
            />
            <TouchableOpacity style={styles.closeButton} onPress={() => setShowPicker(false)}>
              <Text style={styles.closeText}>確定</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
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
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    backgroundColor: "#f0f0f0",
  },
  text: {
    fontSize: 18,
  },
  time: {
    fontSize: 18,
    fontWeight: "700",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    padding: 20,
    borderRadius: 10,
    backgroundColor: "white",
    alignItems: "center",
  },
  closeButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: "#2196F3",
    borderRadius: 5,
  },
  closeText: {
    fontSize: 16,
    color: "white",
  },
});

export default NotificationSettings;
