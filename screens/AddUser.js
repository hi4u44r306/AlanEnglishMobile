import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker"; // Import Picker component
import Toast from "react-native-toast-message";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getDatabase, ref, update } from "firebase/database";
import ScreenContainer from "./ScreenContainer";

const AddUser = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [classtype, setClassType] = useState("");
    const [plan, setPlan] = useState("");

    const success = () => {
        Toast.show({
            type: "success",
            text1: "創建成功",
            position: "top",
            visibilityTime: 1000,
        });
    };

    const error = () => {
        Toast.show({
            type: "error",
            text1: "失敗",
            position: "top",
            visibilityTime: 1000,
        });
    };

    const signupUser = async () => {
        const auth = getAuth();
        try {
            const credentials = await createUserWithEmailAndPassword(auth, email, password);
            const useruid = credentials.user.uid;

            const rtdb = getDatabase();
            const currentDate = new Date().toJSON().slice(0, 10);
            const currentMonth = new Date().toJSON().slice(0, 7);
            const databaseRef = ref(rtdb, `student/${useruid}`);
            await update(databaseRef, {
                Resetallmusic: `${currentMonth}alreadyupdated`,
                onlinemonth: currentMonth,
                onlinetime: currentDate,
                name,
                class: classtype,
                email,
                plan,
                Daytotaltimeplayed: 0,
                Monthtotaltimeplayed: 0,
                userimage: "6C9570CC-B276-424C-857F-11BBDD21C99B.png",
                totaltimeplayed: 0,
            });
            success();
        } catch {
            error();
        }
    };

    return (
        <ScreenContainer>
            <View style={styles.container}>
                <Text style={styles.title}>新增學生資料</Text>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>帳號</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="輸入電子郵件或帳號..."
                        onChangeText={setEmail}
                        value={email}
                        keyboardType="email-address"
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>密碼</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="輸入密碼..."
                        onChangeText={setPassword}
                        value={password}
                        secureTextEntry
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>English Name</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="輸入姓名..."
                        onChangeText={setName}
                        value={name}
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>ClassType</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="輸入Class..."
                        onChangeText={setClassType}
                        value={classtype}
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Plan</Text>
                    <Picker
                        selectedValue={plan}
                        style={styles.input}
                        onValueChange={(itemValue) => setPlan(itemValue)}
                    >
                        <Picker.Item label="選擇Plan..." value="" />
                        <Picker.Item label="純聽力" value="listeningonly" />
                        <Picker.Item label="全方位" value="allcover" />
                    </Picker>
                </View>

                <Button title="創建學生資料" onPress={signupUser} color="#2196F3" />
                <Toast />
            </View>
        </ScreenContainer>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: "#f5f5f5",
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 20,
        textAlign: "center",
    },
    inputContainer: {
        marginBottom: 15,
    },
    label: {
        fontSize: 16,
        marginBottom: 5,
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 5,
        padding: 10,
        fontSize: 16,
        backgroundColor: "#fff",
    },
});

export default AddUser;
