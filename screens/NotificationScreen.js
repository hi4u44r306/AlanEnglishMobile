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
import { FontAwesome5, Fontisto, MaterialCommunityIcons } from "@expo/vector-icons";
import { Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';
import { rtdb } from "./firebase-config";
import { ref as rtdbRef, onValue, update } from "firebase/database";
import { getAuth } from "firebase/auth";
import ScreenContainer from "./ScreenContainer";

const NotificationsScreen = ({ navigation }) => {
    const [notifications, setNotifications] = useState([]);
    const [notificationStatus, setNotificationStatus] = useState({});
    const auth = getAuth();
    const user = auth.currentUser;

    useEffect(() => {
        if (!user) return;
        // 改為監聽使用者專屬通知
        const notificationsRef = rtdbRef(rtdb, `userNotifications/${user.uid}`);
        const unsubscribeNotifications = onValue(notificationsRef, (snapshot) => {
            if (snapshot.exists()) {
                const data = Object.entries(snapshot.val()).map(([id, value]) => ({
                    id,
                    ...value,
                }));
                // 依 timestamp 排序 (由新到舊)
                const sortedData = data.sort((a, b) => b.timestamp - a.timestamp);
                setNotifications(sortedData);
            } else {
                setNotifications([]);
            }
        });
        return () => unsubscribeNotifications();
    }, [user]);

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

    const confirmAction = (action) => {
        Alert.alert(
            "確認操作",
            action === 'read' ? "確定要標記所有通知為已讀嗎？" : "確定要刪除所有通知？刪除後無法恢復！",
            [
                { text: "取消", style: "cancel" },
                { text: "確定", onPress: () => (action === 'read' ? markAllAsRead() : deleteAllNotifications()) },
            ]
        );
    };

    const markAllAsRead = () => {
        if (!user) return;
        const updates = {};
        notifications.forEach(({ id }) => {
            updates[`userNotificationStatus/${user.uid}/${id}`] = { read: true };
        });
        update(rtdbRef(rtdb), updates)
            .then(() => {
                Alert.alert("通知", "所有通知已標記為已讀");
            })
            .catch(error => console.error("標記通知為已讀時發生錯誤", error));
    };

    const deleteAllNotifications = () => {
        if (!user) return;
        const updates = {};
        notifications.forEach(({ id }) => {
            updates[`userNotificationStatus/${user.uid}/${id}/deleted`] = true;
        });
        update(rtdbRef(rtdb), updates)
            .then(() => {
                Alert.alert("通知", "所有通知已刪除");
            })
            .catch(error => console.error("刪除通知時發生錯誤", error));
    };

    return (
        <ScreenContainer>
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backbutton}>
                        <Fontisto name="angle-left" size={24} color="black" />
                        <Text style={styles.backbuttontext}>Back</Text>
                    </TouchableOpacity>
                    <Menu>
                        <MenuTrigger>
                            <FontAwesome5 name="ellipsis-h" size={30} color="black" />
                        </MenuTrigger>
                        <MenuOptions customStyles={menuStyles.menuOptions}>
                            <MenuOption onSelect={() => confirmAction('read')} customStyles={menuStyles.menuOption}>
                                <MaterialCommunityIcons name="email-check-outline" size={24} />
                                <Text style={menuStyles.menuText}>全部已讀</Text>
                            </MenuOption>
                            <View style={menuStyles.separator} />
                            <MenuOption onSelect={() => confirmAction('delete')} customStyles={menuStyles.menuOption}>
                                <MaterialCommunityIcons name="email-remove-outline" size={24} color={"red"} />
                                <Text style={[menuStyles.menuText, { color: "red" }]}>全部刪除</Text>
                            </MenuOption>
                        </MenuOptions>
                    </Menu>
                </View>
                <FlatList
                    data={notifications.filter(item => !notificationStatus[item.id]?.deleted)}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => {
                        const isRead = notificationStatus[item.id]?.read || false;
                        return (
                            <View style={[styles.notificationItem, { backgroundColor: isRead ? "white" : "#ffefef" }]}>
                                <Text style={styles.notificationTitle}>{item.title}</Text>
                                <Text style={styles.notificationBody}>{item.body}</Text>
                            </View>
                        );
                    }}
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyText}>目前沒有通知</Text>
                        </View>
                    }
                />
            </SafeAreaView>
        </ScreenContainer>
    );
};

const styles = StyleSheet.create({
    backbutton: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    backbuttontext: {
        fontSize: 18,
        marginLeft: 5,
        fontWeight: '700',
        fontFamily: 'Nunito'
    },
    container: { flex: 1 },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 15,
        elevation: 3,
    },
    notificationItem: { padding: 15, borderBottomWidth: 1, borderBottomColor: "#ccc" },
    notificationTitle: { fontSize: 16, fontWeight: "bold" },
    notificationBody: { fontSize: 14, color: "#555" },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 50,
    },
    emptyText: {
        fontSize: 16,
        color: '#888',
    },
});

const menuStyles = {
    menuOptions: {
        optionsContainer: {
            width: 'contain',
            backgroundColor: "white",
            borderRadius: 10,
            paddingVertical: 5,
            shadowColor: "#000",
            shadowOpacity: 0.2,
            shadowOffset: { width: 0, height: 2 },
            shadowRadius: 4,
            elevation: 5,
        },
    },
    menuOption: {
        optionWrapper: {
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            gap: 10,
            paddingVertical: 12,
            paddingHorizontal: 20,
        },
    },
    menuText: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#333",
    },
    separator: {
        height: 1,
        backgroundColor: "#ddd",
        marginHorizontal: 10,
    },
};

export default NotificationsScreen;
