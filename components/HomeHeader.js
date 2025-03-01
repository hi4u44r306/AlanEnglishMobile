import React, { useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  StyleSheet
} from "react-native";
import { COLORS, SIZES } from "../constants";
import { Brand } from "./Brand";
import { useNavigation } from "@react-navigation/native";
import RBSheet from "react-native-raw-bottom-sheet";
import { FontAwesome5, FontAwesome6, Ionicons } from "@expo/vector-icons";
import { rtdb } from "../screens/firebase-config";
import { ref as rtdbRef, onValue } from "firebase/database";
import Profile from "./Profile";
import { getAuth } from "firebase/auth";

const HomeHeader = ({ onSearch, display }) => {
  const navigation = useNavigation();
  const refRBSheet = useRef();

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const auth = getAuth();
  const user = auth.currentUser;

  // 監聽 Firebase 的通知列表
  useEffect(() => {
    if (!user) return;

    const notificationsRef = rtdbRef(rtdb, "notifications");

    const unsubscribeNotifications = onValue(notificationsRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = Object.entries(snapshot.val()).map(([id, value]) => ({
          id,
          ...value,
        }));
        setNotifications(data);
      } else {
        setNotifications([]);
      }
    });

    return () => unsubscribeNotifications();
  }, [user]); // 這裡不再依賴 notifications，避免無窮迴圈

  // 監聽該用戶的未讀通知狀態
  useEffect(() => {
    if (!user || notifications.length === 0) {
      setUnreadCount(0);
      return;
    }

    const userStatusRef = rtdbRef(rtdb, `userNotificationStatus/${user.uid}`);

    const unsubscribeStatus = onValue(userStatusRef, (snapshot) => {
      if (snapshot.exists()) {
        const readStatus = snapshot.val();
        const unread = notifications.filter((notif) => !readStatus[notif.id]).length;
        setUnreadCount(unread);
      } else {
        setUnreadCount(notifications.length);
      }
    });

    return () => unsubscribeStatus();
  }, [user, notifications]); // 這裡的 useEffect 只依賴 notifications，確保更新

  return (
    <SafeAreaView style={{ backgroundColor: COLORS.main }}>
      <View style={{ paddingTop: 15, paddingBottom: 15 }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: 15,
          }}
        >
          <Brand fontSize={25} style={{ alignSelf: "flex-start" }} />
          <View style={{ flexDirection: "row", marginLeft: "auto", alignItems: "center" }}>
            <TouchableOpacity
              onPress={() => navigation.navigate("NotificationsScreen")}
              style={{
                marginRight: 30,
                alignItems: "center",
                position: "relative",
              }}
            >
              <FontAwesome5 name="bell" size={20} color={"black"} />
              {unreadCount > 0 && (
                <View style={styles.notificationBadge}>
                  <Text style={styles.notificationText}>{unreadCount}</Text>
                </View>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => refRBSheet.current.open()}
              style={{
                marginRight: 15,
                alignItems: "center",
              }}
            >
              <FontAwesome6 name="user-gear" size={20} color={"black"} />
            </TouchableOpacity>
            <RBSheet
              ref={refRBSheet}
              height={Dimensions.get("window").height * 0.8}
              closeOnDragDown={false}
              closeOnPressMask={false}
              customStyles={{
                wrapper: { backgroundColor: "transparent" },
                draggableIcon: { display: "none" },
              }}
            >
              <Profile onClose={() => refRBSheet.current?.close()} />
            </RBSheet>
          </View>
        </View>
        <View style={{ marginTop: SIZES.font, display: display }}>
          <View
            style={{
              width: "100%",
              borderRadius: SIZES.font,
              backgroundColor: "white",
              flexDirection: "row",
              alignItems: "center",
              paddingHorizontal: SIZES.font,
              paddingVertical: SIZES.small - 2,
            }}
          >
            <Ionicons name="search-outline" size={20} style={{ marginRight: SIZES.base }} />
            <TextInput
              placeholder="Search Tracks..."
              style={{ flex: 1, color: "black" }}
              onChangeText={onSearch}
            />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  notificationBadge: {
    position: "absolute",
    top: -5,
    right: -10,
    backgroundColor: "red",
    borderRadius: 10,
    width: 18,
    height: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  notificationText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
});

export default HomeHeader;
