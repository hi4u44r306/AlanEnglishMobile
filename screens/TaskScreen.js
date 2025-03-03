import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    Alert,
    StyleSheet,
    SafeAreaView
} from "react-native";
import { authentication, rtdb } from "./firebase-config";
import { ref as rtdbRef, onValue, update, push, set } from "firebase/database";

// 這裡依你的專案結構調整
import ScreenContainer from "./ScreenContainer";
import { FocusedStatusBar } from "../components";
import { COLORS } from "../constants";
import { ProgressBar } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const PointsExchangeScreen = () => {
    const userId = authentication.currentUser?.uid;
    const [coins, setCoins] = useState(0);
    // 新增 listeningRewardClaimed 來追蹤「聽力暖身」是否已領取
    const [tasks, setTasks] = useState({ lastCheckIn: "", listenCount: 0, listeningRewardClaimed: false });
    // 用 state 來控制目前顯示「任務」或「商城」
    const [activeTab, setActiveTab] = useState("task");

    useEffect(() => {
        if (!userId) return;
        const userRef = rtdbRef(rtdb, `student/${userId}`);

        const unsubscribe = onValue(
            userRef,
            (snapshot) => {
                if (snapshot.exists()) {
                    const data = snapshot.val();
                    setCoins(data.coins || 0);
                    const musicABC = data.Daytotaltimeplayed || 0;
                    setTasks({
                        lastCheckIn: data.tasks?.lastCheckIn || "",
                        listenCount: musicABC,
                        listeningRewardClaimed: data.tasks?.listeningRewardClaimed || false,
                    });
                } else {
                    setCoins(0);
                    setTasks({ lastCheckIn: "", listenCount: 0, listeningRewardClaimed: false });
                }
            },
            (error) => {
                console.error("監聽 Firebase 錯誤:", error);
            }
        );

        return () => unsubscribe();
    }, [userId]);

    // 每日簽到的函式
    const checkIn = async () => {
        if (!userId) return;

        const today = new Date().toISOString().slice(0, 10);
        if (tasks.lastCheckIn === today) {
            Alert.alert("已經簽到過了");
            return;
        }

        const newCoins = coins + 5;
        const newTasks = { ...tasks, lastCheckIn: today };

        try {
            await update(rtdbRef(rtdb, `student/${userId}`), {
                coins: newCoins,
                tasks: newTasks,
            });
            setCoins(newCoins);
            setTasks(newTasks);
        } catch (error) {
            console.error("更新 Firebase 失敗:", error);
        }
    };

    // 聽力暖身獎勵的領取函式
    const claimWarmupReward = async () => {
        if (!userId) return;
        if (tasks.listenCount < 20) {
            Alert.alert("尚未達到聽力次數目標");
            return;
        }
        if (tasks.listeningRewardClaimed) {
            Alert.alert("已經領取過了");
            return;
        }
        const rewardAmount = 10;
        const newCoins = coins + rewardAmount;
        const updatedTasks = { ...tasks, listeningRewardClaimed: true };

        try {
            // 更新使用者金幣及任務狀態
            await update(rtdbRef(rtdb, `student/${userId}`), {
                coins: newCoins,
                tasks: updatedTasks,
            });
            setCoins(newCoins);
            setTasks(updatedTasks);

            // 新增使用者專屬通知 (存放在 userNotifications/{userId} 下)
            const notificationRef = push(rtdbRef(rtdb, `userNotifications/${userId}`));
            await set(notificationRef, {
                title: "聽力暖身獎勵",
                body: `你已經聽了20次，獲得${rewardAmount} 💰，請查收！`,
                timestamp: Date.now(),
            });
        } catch (error) {
            console.error("領取聽力暖身獎勵失敗:", error);
        }
    };

    // 任務列表的單項元件，新增 onPress 與 claimed prop
    const TaskItem = ({ title, desc, reward, progress = 0, onPress, claimed }) => {
        const canClaim = progress >= 1 && !claimed;
        return (
            <View style={styles.taskBox}>
                <View style={styles.taskContent}>
                    <View style={{ flex: 1 }}>
                        <View style={{ flexDirection: "row", gap: 10 }}>
                            <Text style={styles.taskTitle}>{title}</Text>
                            <Text style={styles.taskDesc}>{desc}</Text>
                        </View>
                        <View style={styles.progressBarContainer}>
                            <ProgressBar
                                progress={progress > 1 ? 1 : progress}
                                color={COLORS.primary}
                                style={styles.progressBar}
                            />
                        </View>
                    </View>
                    <TouchableOpacity
                        style={[styles.taskButton, (!canClaim || claimed) && styles.disabledButton]}
                        disabled={!canClaim}
                        onPress={onPress}
                    >
                        <Text style={styles.buttonText}>
                            {claimed ? "已領取" : `${reward} 💰`}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    };

    return (
        <ScreenContainer>
            <FocusedStatusBar backgroundColor={COLORS.primary} />

            {/* --- 自訂 Header 區域 --- */}
            <SafeAreaView style={styles.headerContainer}>
                <Text style={styles.headerTitle}>集點兌禮</Text>
                <View style={styles.headerRight}>
                    <View style={styles.coinContainer}>
                        <MaterialCommunityIcons name="currency-usd" size={20} color="gold" />
                        <Text style={styles.coinText}>{coins}</Text>
                    </View>
                </View>
            </SafeAreaView>

            {/* --- Tab 區域（任務 / 商城） --- */}
            <View style={styles.tabContainer}>
                <TouchableOpacity
                    style={[styles.tabButton, activeTab === "task" && styles.activeTab]}
                    onPress={() => setActiveTab("task")}
                >
                    <Text
                        style={[
                            styles.tabText,
                            activeTab === "task" && styles.activeTabText,
                        ]}
                    >
                        任務
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.tabButton, activeTab === "shop" && styles.activeTab]}
                    onPress={() => setActiveTab("shop")}
                >
                    <Text
                        style={[
                            styles.tabText,
                            activeTab === "shop" && styles.activeTabText,
                        ]}
                    >
                        商城
                    </Text>
                </TouchableOpacity>
            </View>

            {/* --- 主要內容區域 --- */}
            {activeTab === "task" ? (
                <View style={styles.contentContainer}>
                    <Text style={styles.listenCountText}>
                        目前聽力次數: {tasks.listenCount}
                    </Text>

                    <View style={styles.taskList}>
                        {/* 每日簽到 */}
                        <View style={styles.taskBox}>
                            <View style={styles.taskContent}>
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.taskTitle}>
                                        開始充實英文的一天 - 每日簽到
                                    </Text>
                                </View>
                                <TouchableOpacity
                                    style={[
                                        styles.taskButton,
                                        tasks.lastCheckIn === new Date().toISOString().slice(0, 10) &&
                                        styles.disabledButton,
                                    ]}
                                    onPress={checkIn}
                                    disabled={
                                        tasks.lastCheckIn === new Date().toISOString().slice(0, 10)
                                    }
                                >
                                    <Text style={styles.buttonText}>
                                        {tasks.lastCheckIn === new Date().toISOString().slice(0, 10)
                                            ? "已簽到"
                                            : "5 💰"}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* 聽力暖身任務 */}
                        <TaskItem
                            title="聽力暖身"
                            desc="聽力20次"
                            reward={10}
                            progress={tasks.listenCount / 20}
                            claimed={tasks.listeningRewardClaimed}
                            onPress={claimWarmupReward}
                        />
                        {/* 其他任務示範 */}
                        <TaskItem
                            title="聽力進階"
                            desc="聽力50次"
                            reward={20}
                            progress={tasks.listenCount / 50}
                        />
                    </View>
                </View>
            ) : (
                <View style={styles.contentContainer}>
                    <Text style={{ fontSize: 18, textAlign: "center", marginTop: 20 }}>
                        這裡放商城的內容
                    </Text>
                </View>
            )}
        </ScreenContainer>
    );
};

const styles = StyleSheet.create({
    headerContainer: {
        margin: 20,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "#fff",
        marginBottom: 5,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#333",
    },
    headerRight: {
        flexDirection: "row",
        alignItems: "center",
    },
    coinContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginRight: 10,
        backgroundColor: "black",
        paddingHorizontal: 8,
        paddingVertical: 5,
        borderRadius: 8,
    },
    coinText: {
        marginLeft: 5,
        fontSize: 16,
        fontWeight: "700",
        color: "white",
    },
    tabContainer: {
        flexDirection: "row",
        backgroundColor: "#fff",
        justifyContent: "center",
        marginBottom: 10,
    },
    tabButton: {
        flex: 1,
        paddingVertical: 10,
        alignItems: "center",
    },
    activeTab: {
        borderBottomWidth: 2,
        borderBottomColor: COLORS.primary,
    },
    tabText: {
        fontSize: 16,
        color: "#666",
    },
    activeTabText: {
        color: COLORS.primary,
        fontWeight: "bold",
    },
    contentContainer: {
        flex: 1,
        paddingHorizontal: 16,
    },
    listenCountText: {
        fontSize: 16,
        color: "#333",
        textAlign: "center",
        marginVertical: 10,
    },
    taskList: {
        marginVertical: 10,
    },
    taskBox: {
        backgroundColor: "#FFF",
        borderRadius: 12,
        padding: 20,
        marginBottom: 10,
    },
    taskContent: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    taskTitle: {
        fontSize: 18,
        fontWeight: "600",
        marginBottom: 5,
    },
    taskDesc: {
        fontSize: 14,
        color: "#666",
        marginBottom: 5,
    },
    progressBarContainer: {
        marginVertical: 5,
        width: "80%",
    },
    progressBar: {
        height: 8,
        borderRadius: 5,
    },
    taskButton: {
        backgroundColor: "#A0522D",
        paddingVertical: 8,
        paddingHorizontal: 20,
        borderRadius: 8,
    },
    buttonText: {
        color: "#FFF",
        fontWeight: "600",
    },
    disabledButton: {
        backgroundColor: "#A0A0A0",
    },
});

export default PointsExchangeScreen;
