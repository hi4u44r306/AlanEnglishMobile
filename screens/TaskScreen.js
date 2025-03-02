import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Alert, StyleSheet, ImageBackground } from "react-native";
import { authentication, rtdb } from "./firebase-config";
import { ref as rtdbRef, get, update, onValue } from "firebase/database";
import ScreenContainer from "./ScreenContainer";
import { FocusedStatusBar, HomeHeader } from "../components";
import { COLORS } from "../constants";
import { ProgressBar } from "react-native-paper";

const TaskScreen = () => {
    const userId = authentication.currentUser?.uid;
    const [coins, setCoins] = useState(0);
    const [tasks, setTasks] = useState({ lastCheckIn: "", listenCount: 0 });

    useEffect(() => {
        if (!userId) return;

        const userRef = rtdbRef(rtdb, `student/${userId}`);

        // 使用 onValue 即時監聽資料變化
        const unsubscribe = onValue(userRef, (snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val();
                setCoins(data.coins || 0);
                // 從 MusicLogfile 中計算總聽力次數
                const musicLog = data.MusicLogfile || {};
                const totalListenCount = Object.values(musicLog).reduce((sum, log) => sum + (log.musicplay || 0), 0);
                setTasks({
                    lastCheckIn: data.tasks?.lastCheckIn || "",
                    listenCount: totalListenCount,
                });
            } else {
                setCoins(0);
                setTasks({ lastCheckIn: "", listenCount: 0 });
            }
        }, (error) => {
            console.error("監聽 Firebase 錯誤:", error);
        });

        // 清除監聽器
        return () => unsubscribe();
    }, [userId]);

    const checkIn = async () => {
        if (!userId) return;

        const today = new Date().toISOString().slice(0, 10);
        if (tasks.lastCheckIn === today) {
            Alert.alert("已經簽到過了");
            return;
        }

        const newCoins = coins + 5;
        const newTasks = { ...tasks, lastCheckIn: today };

        await update(rtdbRef(rtdb, `student/${userId}`), {
            coins: newCoins,
            tasks: newTasks,
        }).then(() => {
            setCoins(newCoins);
            setTasks(newTasks);
        }).catch(error => {
            console.error("更新 Firebase 失敗:", error);
        });
    };

    return (
        <ImageBackground style={styles.background}>
            <ScreenContainer>
                <FocusedStatusBar backgroundColor={COLORS.primary} />
                <HomeHeader display="none" />

                <View style={styles.coinContainer}>
                    <Text style={styles.coinText}>💰 {coins}</Text>
                </View>

                <View style={styles.taskList}>
                    {/* 每日簽到改為單純按鈕 */}
                    <View style={styles.taskBox}>
                        <Text style={styles.taskTitle}>開始充實英文的一天</Text>
                        <Text style={styles.taskDesc}>每日簽到</Text>
                        <View style={styles.rewardContainer}>
                            <TouchableOpacity
                                style={[
                                    styles.taskButton,
                                    tasks.lastCheckIn === new Date().toISOString().slice(0, 10) && styles.disabledButton
                                ]}
                                onPress={checkIn}
                                disabled={tasks.lastCheckIn === new Date().toISOString().slice(0, 10)}
                            >
                                <Text style={styles.buttonText}>
                                    {tasks.lastCheckIn === new Date().toISOString().slice(0, 10)
                                        ? `已完成 (+5 💰)`
                                        : "簽到"}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* 其他任務保持進度條 */}
                    <TaskItem
                        title="聽力暖身"
                        desc="聽力20次"
                        reward={10}
                        progress={tasks.listenCount / 20}
                    />
                    <Text style={styles.listenCountText}>
                        目前聽力次數: {tasks.listenCount}
                    </Text>
                    <TaskItem
                        title="聽力進階"
                        desc="聽力50次"
                        reward={20}
                        progress={tasks.listenCount / 50}
                    />
                </View>
            </ScreenContainer>
        </ImageBackground>
    );
};

const TaskItem = ({ title, desc, reward, progress = 0 }) => (
    <View style={styles.taskBox}>
        <Text style={styles.taskTitle}>{title}</Text>
        <Text style={styles.taskDesc}>{desc}</Text>
        <View style={styles.progressBarContainer}>
            <ProgressBar progress={progress > 1 ? 1 : progress} color={COLORS.primary} style={styles.progressBar} />
        </View>
        <View style={styles.rewardContainer}>
            <Text style={styles.rewardText}>{reward}</Text>
        </View>
    </View>
);

const styles = StyleSheet.create({
    background: { flex: 1 },
    coinContainer: { alignSelf: "center", backgroundColor: "#FFF", padding: 15, borderRadius: 10, marginBottom: 20 },
    coinText: { fontSize: 22, color: "#333", fontWeight: "600" },
    taskList: { marginHorizontal: 10 },
    taskBox: { backgroundColor: "#FFF", borderRadius: 12, padding: 20, marginBottom: 10 },
    taskTitle: { fontSize: 18, fontWeight: "600" },
    taskDesc: { fontSize: 14, color: "#666", marginBottom: 5 },
    progressBarContainer: { marginVertical: 5 },
    progressBar: { height: 8, borderRadius: 5 },
    rewardContainer: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
    rewardText: { fontSize: 16, color: "#FFD700", fontWeight: "600" },
    taskButton: { backgroundColor: "#A0522D", paddingVertical: 8, paddingHorizontal: 20, borderRadius: 8 },
    buttonText: { color: "#FFF", fontWeight: "600" },
    disabledButton: { backgroundColor: "#A0A0A0" },
    listenCountText: { fontSize: 16, color: "#333", textAlign: "center", marginVertical: 10 },
});

export default TaskScreen;