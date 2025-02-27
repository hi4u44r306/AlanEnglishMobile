import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    Alert,
    StyleSheet,
    SafeAreaView
} from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { rtdb } from "./firebase-config";
import { ref as rtdbRef, onValue, update } from "firebase/database";
import { COLORS } from "../constants";
import { getAuth } from "firebase/auth";

const NotificationsScreen = ({ navigation }) => {
    const [notifications, setNotifications] = useState([]);
    // 儲存目前使用者對通知的讀取狀態：{ notificationId: true }
    const [notificationStatus, setNotificationStatus] = useState({});

    const auth = getAuth();
    const user = auth.currentUser;

    // 讀取全域通知資料
    useEffect(() => {
        const notificationsRef = rtdbRef(rtdb, "notifications");
        const unsubscribeNotifications = onValue(notificationsRef, (snapshot) => {
            if (snapshot.exists()) {
                const data = Object.entries(snapshot.val()).map(([id, value]) => ({
                    id,
                    ...value,
                }));
                // 假設原本資料是依照新增順序排列，反轉陣列讓最新的顯示在最上面
                setNotifications(data.reverse());
            } else {
                setNotifications([]);
            }
        });
        return () => unsubscribeNotifications();
    }, []);

    // 讀取目前使用者的通知讀取狀態
    useEffect(() => {
        if (user) {
            const userStatusRef = rtdbRef(rtdb, `userNotificationStatus/${user.uid}`);
            const unsubscribeStatus = onValue(userStatusRef, (snapshot) => {
                const data = snapshot.val() || {};
                setNotificationStatus(data);
            });
            return () => unsubscribeStatus();
        }
    }, [user]);

    // 只更新目前使用者的已讀狀態，不影響其他使用者
    const markAllAsRead = () => {
        if (!user) return;
        const updates = {};
        notifications.forEach(({ id }) => {
            updates[`userNotificationStatus/${user.uid}/${id}`] = true;
        });
        update(rtdbRef(rtdb), updates)
            .then(() => {
                Alert.alert("通知", "所有通知已標記為已讀");
            })
            .catch((error) => console.error("標記通知為已讀時發生錯誤", error));
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <FontAwesome5 name="arrow-left" size={24} color="black" />
                </TouchableOpacity>
                {/* <Text style={styles.title}>通知</Text> */}
                <TouchableOpacity onPress={markAllAsRead}>
                    <Text style={styles.markRead}>全部已讀</Text>
                </TouchableOpacity>
            </View>
            <FlatList
                data={notifications}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => {
                    // 判斷目前使用者是否已讀這則通知
                    const isRead = notificationStatus[item.id] ? true : false;
                    return (
                        <View
                            style={[
                                styles.notificationItem,
                                { backgroundColor: isRead ? "white" : "#ffefef" },
                            ]}
                        >
                            <Text style={styles.notificationTitle}>{item.title}</Text>
                            <Text style={styles.notificationBody}>{item.body}</Text>
                        </View>
                    );
                }}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f9f9f9",
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: 'space-between',
        padding: 15,
        backgroundColor: "#fff",
        elevation: 3,
        shadowColor: "#000",
    },
    title: {
        flex: 1,
        textAlign: "center",
        fontSize: 20,
        fontWeight: "bold",
    },
    markRead: {
        color: "red",
        fontSize: 16,
    },
    notificationItem: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: "#ccc",
    },
    notificationTitle: {
        fontSize: 16,
        fontWeight: "bold",
    },
    notificationBody: {
        fontSize: 14,
        color: "#555",
    },
});

export default NotificationsScreen;
