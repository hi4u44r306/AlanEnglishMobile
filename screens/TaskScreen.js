import React, { useEffect, useState } from "react";
import { View, Text, Button, Alert } from "react-native";
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
        <ScreenContainer>
            <FocusedStatusBar backgroundColor={COLORS.primary} />
            <HomeHeader display="none" />
            <View>
                <Text>當前金幣：{coins}</Text>
                <Text>今日聽力次數：{tasks.listenCount}</Text>
                <Button title="每日簽到" onPress={checkIn} />
                <Button title="領取任務獎勵" onPress={claimReward} />
            </View>
        </ScreenContainer>
    );
};

export default TaskScreen;
