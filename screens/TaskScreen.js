import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Alert, StyleSheet, ImageBackground } from "react-native";
import { authentication, rtdb } from "./firebase-config";
import { ref as rtdbRef, get, update } from "firebase/database";
import ScreenContainer from "./ScreenContainer";
import { FocusedStatusBar, HomeHeader } from "../components";
import { COLORS } from "../constants";

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

        const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
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
            Alert.alert("簽到成功！獲得 10 金幣");
        }).catch(error => {
            console.error("更新 Firebase 失敗:", error);
            Alert.alert("簽到失敗，請稍後再試");
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
            "tasks.listenCount": 0, // 領取後重置聽力計數
        }).then(() => {
            setCoins(newCoins);
            setTasks(prev => ({ ...prev, listenCount: 0 }));
            Alert.alert(`獎勵領取成功！獲得 ${extraCoins} 金幣`);
        }).catch(error => {
            console.error("更新 Firebase 失敗:", error);
            Alert.alert("領取失敗，請稍後再試");
        });
    };

    return (
        <ImageBackground style={styles.background}>
            <ScreenContainer>
                <FocusedStatusBar backgroundColor={COLORS.primary} />
                <HomeHeader display="none" />

                {/* 金幣顯示 */}
                <View style={styles.coinContainer}>
                    <Text style={styles.coinText}>💰 {coins}</Text>
                </View>

                {/* 任務盒子 - 每日簽到 */}
                <View style={styles.taskBox}>
                    <Text style={styles.taskTitle}>📅 每日簽到</Text>
                    <Text style={styles.taskDesc}>每天簽到可獲得 10 金幣</Text>
                    <TouchableOpacity onPress={checkIn} style={styles.taskButton}>
                        <Text style={styles.buttonText}>簽到</Text>
                    </TouchableOpacity>
                </View>

                {/* 任務盒子 - 領取獎勵 */}
                <View style={styles.taskBox}>
                    <Text style={styles.taskTitle}>🎧 任務獎勵</Text>
                    <Text style={styles.taskDesc}>聆聽 10/20 次可領取金幣</Text>
                    <TouchableOpacity onPress={claimReward} style={styles.taskButtonPurple}>
                        <Text style={styles.buttonText}>領取獎勵</Text>
                    </TouchableOpacity>
                </View>
            </ScreenContainer>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    background: {
        flex: 1,
        backgroundColor: "#F5F5F5", // 柔和的背景色
        justifyContent: "center",
    },
    coinContainer: {
        alignSelf: "center",
        backgroundColor: "#FFFFFF",
        padding: 15,
        borderRadius: 10,
        marginBottom: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    coinText: {
        fontSize: 22,
        color: "#333",
        fontWeight: "600",
    },
    taskBox: {
        backgroundColor: "#FFFFFF",
        borderRadius: 12,
        padding: 20,
        marginVertical: 10,
        marginHorizontal: 20,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
    },
    taskTitle: {
        fontSize: 18,
        color: "#222",
        fontWeight: "600",
        marginBottom: 5,
    },
    taskDesc: {
        fontSize: 14,
        color: "#666",
        textAlign: "center",
        marginBottom: 10,
    },
    taskButton: {
        backgroundColor: "#3A5A40", // 低調的綠色
        paddingVertical: 10,
        paddingHorizontal: 25,
        borderRadius: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    taskButtonPurple: {
        backgroundColor: "#2C3E50", // 深藍色，增強穩重感
        paddingVertical: 10,
        paddingHorizontal: 25,
        borderRadius: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    buttonText: {
        fontSize: 16,
        color: "#FFFFFF",
        fontWeight: "500",
        textAlign: "center",
    },
});


export default TaskScreen;
