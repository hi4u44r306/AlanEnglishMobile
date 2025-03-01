import React, { useEffect, useState } from 'react'
import { useNavigation } from "@react-navigation/native";
import { Text, View, TextInput, StyleSheet, Keyboard, KeyboardAvoidingView, TouchableWithoutFeedback, Platform, TouchableOpacity, ActivityIndicator, Dimensions, Pressable, Modal, SafeAreaView } from "react-native";
import { Brand, SubBrand, FocusedStatusBar, Blackboard, Copyright } from "../components";
import { COLORS, SIZES, FONTS } from "../constants";
import { authentication, rtdb } from './firebase-config';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import Toast from 'react-native-toast-message';
import { AntDesign, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { setTabBarHeight } from '../components/actions/actions';
import { useDispatch } from 'react-redux';
import { child, get, ref as rtdbRef, update } from 'firebase/database';
import AsyncStorage from '@react-native-async-storage/async-storage';


const toastConfig = {
    success: internalState => (
        <View style={{
            fontFamily: 'Nunito',
            position: 'absolute',
            height: 80,
            width: '100%',
            backgroundColor: '#44db56',
            justifyContent: 'center',
            alignContent: 'center',
            alignItems: 'center',
            flexDirection: 'row',
            gap: 10
        }}>
            <Ionicons name="checkmark-done-circle-sharp" size={20} />
            <Text style={{
                color: 'black',
                fontWeight: 'bold',
                fontSize: 16,
            }}>
                {internalState.text1}
            </Text>
            {/* <Octicons name='check-circle-fill' style={{ color: 'rgb(7, 188, 12)' }} size={20} />
            <Text style={{
                color: 'black',
                fontWeight: 'bold',
                fontSize: SIZES.medium,
            }}>
                {internalState.text1}
            </Text> */}
        </View>
    ),
    error: internalState => (
        <View style={{
            fontFamily: 'Nunito',
            position: 'absolute',
            height: 50,
            width: '100%',
            backgroundColor: '#ff1303',
            justifyContent: 'center',
            alignContent: 'center',
            alignItems: 'center',
            flexDirection: 'row',
            gap: 10
        }}>
            <AntDesign name='closecircle' style={{ color: 'rgb(247, 32, 32)' }} size={30} />
            <Text style={{
                color: 'black',
                fontWeight: 'bold',
                fontSize: SIZES.medium,

            }}>
                {internalState.text1}
            </Text>
        </View>
    ),
    info: () => { },
    any_custom_type: () => { },
};

const Login = () => {
    const navigation = useNavigation();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const dispatch = useDispatch();
    const [dimensions, setDimesions] = useState({ window: Dimensions.get('window') });
    const [modalVisible, setModalVisible] = useState(false);
    const { window } = dimensions;
    const windowWidth = window.width;
    const windowHeight = window.height;

    useEffect(() => {
        const subscription = Dimensions.addEventListener("change", ({ window }) => {
            setDimesions({ window });
        });
        return () => subscription?.remove();
    })

    // This function will be triggered when the button is pressed
    const toggleLoading = () => {
        setIsLoading(!isLoading);
        setTimeout(() => {
            setIsLoading(isLoading);
        }, 5000);
    };

    useEffect(() => {
        if (windowHeight < 900) {
            dispatch(setTabBarHeight(65));
        } else {
            dispatch(setTabBarHeight(90));
        }
    }, []);

    const success = (username) => {
        Toast.show({
            type: 'success',
            position: 'top',
            text1: `歡迎回來 ${username}`,
            visibilityTime: 3000,
            autoHide: true,
            onShow: () => { },
            onHide: () => { },
        })
    }

    const error = () => {
        Toast.show({
            type: 'error',
            position: 'top',
            text1: '帳號或密碼不正確',
            visibilityTime: 3000,
            autoHide: true,
            onShow: () => { },
            onHide: () => { },
        })
    }

    const handleLogin = async () => {
        toggleLoading();
        const currentDate = new Date().toISOString().slice(0, 10);
        const currentMonth = new Date().toISOString().slice(0, 7);
        try {
            const userCredential = await signInWithEmailAndPassword(authentication, email, password);
            const userid = userCredential.user.uid;

            const dbRef = rtdbRef(rtdb);
            const snapshot = await get(child(dbRef, `student/${userid}`));

            if (snapshot.exists()) {
                const userName = snapshot.val().name.toUpperCase();
                const onlinetime = snapshot.val().onlinetime;

                const musicRef = rtdbRef(rtdb, '/student/' + userid);
                if (onlinetime !== currentDate) {
                    await update(musicRef, {
                        Daytotaltimeplayed: 0,
                        onlinemonth: currentMonth,
                        onlinetime: currentDate,
                    });
                }

                if (snapshot.val().Resetallmusic === 'notupdated' || snapshot.val().Resetallmusic !== currentMonth + 'alreadyupdated') {
                    const databaseRef = rtdbRef(rtdb, `student/${userid}`);
                    await update(databaseRef, {
                        Monthtotaltimeplayed: 0,
                        Resetallmusic: currentMonth + 'alreadyupdated',
                    });
                    const musicLogfileRef = rtdbRef(rtdb, `student/${userid}/MusicLogfile`);
                    remove(musicLogfileRef);
                }

                await AsyncStorage.setItem('userId', userid);

                success(userName);
                setTimeout(() => {
                    navigation.navigate("Root");
                }, 2000);
            } else {
                error();
            }
        } catch {
            error();
        }
    };



    return (
        <SafeAreaView style={styles.safeContainer}>
            <View style={{ zIndex: 999 }}>
                <Toast config={toastConfig} topOffset={50} />
            </View>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.keyboardContainer}
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={styles.innerContainer}>
                        <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.reminderButton}>
                            <MaterialCommunityIcons name='chat-question-outline' size={20} color={'white'} />
                            <Text style={styles.reminderText}>
                                APP 使用手冊
                            </Text>
                        </TouchableOpacity>

                        <Modal
                            animationType="slide"
                            transparent={true}
                            visible={modalVisible}
                            onRequestClose={() => setModalVisible(false)}
                        >
                            <View style={styles.modalContainer}>
                                <Blackboard fontSize={15} margin={10} />

                                <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
                                    <Text style={styles.closeButtonText}>關閉</Text>
                                </TouchableOpacity>
                            </View>
                        </Modal>
                        <Brand fontSize={50} margin={0} />
                        <SubBrand fontSize={18} />

                        <View style={styles.inputContainer}>
                            <Text style={styles.inputtitle}>帳號</Text>
                            <TextInput
                                placeholder="Email..."
                                style={styles.input}
                                onChangeText={setEmail}
                                onChange={(event) => { setEmail(event.value) }}
                            />
                            <Text style={styles.inputtitle}>密碼</Text>
                            <TextInput
                                placeholder="Password..."
                                style={styles.input}
                                secureTextEntry={true}
                                onChangeText={setPassword}
                                onChange={(event) => { setPassword(event.value) }}
                            />
                        </View>

                        <TouchableOpacity onPress={handleLogin}>
                            <View
                                style={{
                                    backgroundColor: COLORS.white,
                                    margin: 10,
                                    minWidth: 100,
                                    padding: 7,
                                    borderWidth: 3.5,
                                    borderColor: "#2d7dd2",
                                    borderRadius: 10,
                                }}
                            >
                                {isLoading && <ActivityIndicator size="small" color="black" />}
                                <Text style={{
                                    fontFamily: FONTS.mainFont,
                                    fontSize: windowHeight < 800 ? 20 : 25,
                                    fontWeight: 900,
                                    color: COLORS.primary,
                                    textAlign: "center",
                                }}>
                                    {isLoading ? "登入中 . . ." : "登入"}
                                </Text>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.solevbtn} onPress={() => navigation.navigate('Solve')}>
                            <Text style={styles.solevbtntext}>無法登入嗎?</Text>
                        </TouchableOpacity>

                        <Copyright />
                    </View>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}
const styles = StyleSheet.create({
    reminderButton: {
        backgroundColor: '#fc7703',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center",
        minWidth: 120, // 增加按鈕寬度
        display: 'flex',
        justifyContent: "center",
        alignItems: 'center',
        gap: 5,
        flexDirection: 'row',
        marginBottom: 10,
    },
    reminderText: {
        color: 'white',
        fontSize: 18, // 讓字變大
        fontWeight: "bold",

    },
    modalContainer: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.5)", // 半透明背景
        justifyContent: "center",
        alignItems: "center",
    },
    closeButton: {
        backgroundColor: "red",
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center",
        minWidth: 120,
        marginTop: 20,
    },
    closeButtonText: {
        color: "white",
        fontSize: 18,
        fontWeight: "bold",
        textAlign: "center",
    },
    safeContainer: {
        flex: 1,
        backgroundColor: "white", // 背景色
    },
    keyboardContainer: {
        flex: 1,
    },
    innerContainer: {
        flex: 1,
        justifyContent: "center", // 讓內容在中間
        alignItems: "center",
        paddingVertical: 20, // 上下留點空間
    },
    inputContainer: {
        width: "90%",
        alignItems: "center",
        marginVertical: 20,
    },
    inputtitle: {
        fontSize: 18,
        fontWeight: "700",
        color: COLORS.primary,
        marginBottom: 5,
    },
    input: {
        width: "90%",
        padding: 15,
        borderWidth: 2,
        borderColor: COLORS.inputfieldgreen,
        borderRadius: 5,
        backgroundColor: "white",
        textAlign: "center",
        fontSize: 16,
        marginBottom: 10,
    },
    loginButton: {
        backgroundColor: COLORS.primary,
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 10,
        minWidth: 120,
        alignItems: "center",
        justifyContent: "center",
        marginVertical: 10,
    },
    loginButtonText: {
        color: "white",
        fontSize: 20,
        fontWeight: "bold",
    },
    solevbtn: {
        marginTop: 10,
    },
    solevbtntext: {
        fontSize: 16,
        fontWeight: "bold",
    },

});

export default Login