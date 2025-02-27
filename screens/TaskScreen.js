import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Alert, StyleSheet, ImageBackground } from "react-native";
import { authentication, rtdb } from "./firebase-config";
import { ref as rtdbRef, get, update } from "firebase/database";
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

        get(userRef).then((snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val();
                setCoins(data.coins || 0);
                setTasks(data.tasks || { lastCheckIn: "", listenCount: 0 });
            }
        }).catch(error => {
            console.error("讀取 Firebase 錯誤:", error);
        });
    }, [userId]);

    const checkIn = async () => {
        if (!userId) return;

        const today = new Date().toISOString().slice(0, 10);
        if (tasks.lastCheckIn === today) {
            Alert.alert("已經簽到過了");
            return;
        }

        const newCoins = coins + 10;
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

    const claimReward = async () => {
        if (!userId) return;

        const extraCoins = tasks.listenCount >= 20 ? 10 : tasks.listenCount >= 10 ? 5 : 0;
        if (extraCoins === 0) {
            Alert.alert("尚未達成領取條件");
            return;
        }

        const newCoins = coins + extraCoins;

        await update(rtdbRef(rtdb, `student/${userId}`), {
            coins: newCoins,
            "tasks.listenCount": 0,
        }).then(() => {
            setCoins(newCoins);
            setTasks(prev => ({ ...prev, listenCount: 0 }));
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

                <View style={styles.taskBox}>
                    <Text style={styles.taskTitle}>📅 每日簽到</Text>
                    <Text style={styles.taskDesc}>每天簽到可獲得 10 金幣</Text>
                    <TouchableOpacity
                        onPress={checkIn}
                        style={[styles.taskButton, tasks.lastCheckIn === new Date().toISOString().slice(0, 10) && styles.disabledButton]}
                        disabled={tasks.lastCheckIn === new Date().toISOString().slice(0, 10)}
                    >
                        <Text style={styles.buttonText}>{tasks.lastCheckIn === new Date().toISOString().slice(0, 10) ? "已簽到" : "簽到"}</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.taskBox}>
                    <Text style={styles.taskTitle}>🎧 任務獎勵</Text>
                    <Text style={styles.taskDesc}>聆聽 10/20 次可領取金幣</Text>
                    <ProgressBar progress={tasks.listenCount / 30} width={200} color={COLORS.primary} />
                    <TouchableOpacity
                        onPress={claimReward}
                        style={[styles.taskButtonPurple, tasks.listenCount < 10 && styles.disabledButton]}
                        disabled={tasks.listenCount < 10}
                    >
                        <Text style={styles.buttonText}>{tasks.listenCount < 10 ? "未達標" : "領取獎勵"}</Text>
                    </TouchableOpacity>
                </View>
            </ScreenContainer>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    background: { flex: 1, backgroundColor: "#F5F5F5", justifyContent: "center" },
    coinContainer: { alignSelf: "center", backgroundColor: "#FFF", padding: 15, borderRadius: 10, marginBottom: 20, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
    coinText: { fontSize: 22, color: "#333", fontWeight: "600" },
    taskBox: { backgroundColor: "#FFF", borderRadius: 12, padding: 20, marginVertical: 10, marginHorizontal: 20, alignItems: "center", shadowColor: "#000", shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.1, shadowRadius: 6 },
    taskTitle: { fontSize: 18, color: "#222", fontWeight: "600", marginBottom: 5 },
    taskDesc: { fontSize: 14, color: "#666", textAlign: "center", marginBottom: 10 },
    taskButton: { backgroundColor: "#3A5A40", paddingVertical: 10, paddingHorizontal: 25, borderRadius: 8 },
    taskButtonPurple: { backgroundColor: "#2C3E50", paddingVertical: 10, paddingHorizontal: 25, borderRadius: 8 },
    buttonText: { fontSize: 16, color: "#FFF", fontWeight: "500", textAlign: "center" },
    disabledButton: { backgroundColor: "#A0A0A0" },
});

export default TaskScreen;
