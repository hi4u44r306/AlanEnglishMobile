// import { View, Text } from 'react-native'
// import { View, SafeAreaView, FlatList } from "react-native";
import React, { useEffect, useState, useRef } from 'react'
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView, Text, Image, View, TextInput, StyleSheet, Keyboard, KeyboardAvoidingView, TouchableWithoutFeedback, Platform, TouchableOpacity, Alert, ActivityIndicator, Dimensions } from "react-native";
import { Brand, SubBrand, FocusedStatusBar, LoginButton, Blackboard, Copyright } from "../components";
import { COLORS, SIZES, assets, FONTS } from "../constants";
import { db, authentication, rtdb } from './firebase-config';
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';
import Toast, { BaseToast, ErrorToast } from 'react-native-toast-message';
import { AntDesign, FontAwesome5, Octicons } from '@expo/vector-icons';
import { setTabBarHeight } from '../components/actions/actions';
import { useDispatch } from 'react-redux';



const toastConfig = {
    success: internalState => (
        <View style={{
            position: 'absolute',
            height: 80,
            width: '100%',
            // borderColor: "#ffbf3f",
            // borderWidth: 5,
            backgroundColor: 'white',
            justifyContent: 'center',
            alignContent: 'center',
            alignItems: 'center',
            flexDirection: 'row',
            gap: '10px'
        }}>
            <Octicons name='check-circle-fill' style={{ color: 'rgb(7, 188, 12)' }} size={30} />
            <Text style={{
                color: 'black',
                fontWeight: 'bold',
                fontSize: SIZES.medium,

            }}>
                {internalState.text1}
            </Text>
        </View>
    ),
    error: internalState => (
        <View style={{
            position: 'absolute',
            height: 80,
            width: '100%',
            // borderColor: "#ffbf3f",
            // borderWidth: 5,
            backgroundColor: 'white',
            justifyContent: 'center',
            alignContent: 'center',
            alignItems: 'center',
            flexDirection: 'row',
            gap: '10px'
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
    const [username, setUsername] = useState("");
    const currentDate = new Date().toJSON().slice(0, 10);
    const currentMonth = new Date().toJSON().slice(0, 7);
    const [isLoading, setIsLoading] = useState(false);
    const toastRef = useRef();
    const dispatch = useDispatch();
    const [dimensions, setDimesions] = useState({ window: Dimensions.get('window') });

    useEffect(() => {
        const subscription = Dimensions.addEventListener("change", ({ window }) => {
            setDimesions({ window });
        });
        return () => subscription?.remove();
    })

    const { window } = dimensions;
    const windowWidth = window.width;
    const windowHeight = window.height;

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
            visibilityTime: 2000,
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
            visibilityTime: 2000,
            autoHide: true,
            onShow: () => { },
            onHide: () => { },
        })
    }

    const login = async () => {
        toggleLoading();
        const currentDate = new Date().toISOString().slice(0, 10);
        const currentMonth = new Date().toISOString().slice(0, 7);

        signInWithEmailAndPassword(authentication, email, password)
            .then((userCredential) => {
                const userId = userCredential.user.uid;
                const studentRef = doc(db, 'student', userId);
                getDoc(studentRef)
                    .then((docSnapshot) => {
                        const username = docSnapshot.data().name;
                        const onlinetime = docSnapshot.data().onlinetime;

                        if (onlinetime !== currentDate) {
                            updateDoc(studentRef, {
                                onlinemonth: currentMonth,
                                onlinetime: currentDate,
                                currdatetimeplayed: 0,
                            });
                        }

                        const resetAllMusic = docSnapshot.data().Resetallmusic;
                        if (resetAllMusic === 'notupdated' || resetAllMusic !== currentMonth + 'alreadyupdated') {
                            setDoc(studentRef, {
                                totaltimeplayed: 0,
                                Resetallmusic: currentMonth + 'alreadyupdated',
                            }, { merge: true });

                            const firebaseRef = ref(); // Get reference to Realtime Database root
                            update(firebaseRef.child("student").child(userId).child("totaltimeplayed"), {
                                totaltimeplayed: 0,
                            });
                        }

                        success(username);
                        setTimeout(() => {
                            navigation.navigate("Root")
                        }, 1000);
                    })
                    .catch(() => {
                        error();
                    });
            })
            .catch(() => {
                error();
            });
    }


    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={[styles.container, { paddingTop: windowHeight < 800 ? 20 : 40 }]}
        >
            <View style={{ zIndex: 999 }}>
                <Toast config={toastConfig} ref={toastRef} topOffset={50} />
            </View>
            <FocusedStatusBar />
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={{ marginTop: SIZES.font, alignItems: "center", justifyContent: "center" }}>
                    <Blackboard fontSize={windowHeight < 800 ? 13 : 15} margin={windowHeight < 800 ? 10 : 20} />
                    <Brand fontSize={windowHeight < 800 ? 40 : 45} margin={2} />
                    <SubBrand fontSize={windowHeight < 800 ? 13 : 15} />
                    <View
                        style={{
                            width: "90%",
                            borderRadius: SIZES.font,
                            flexDirection: "column",
                            alignItems: "center",
                            margin: 20,
                            paddingHorizontal: SIZES.font,
                            paddingVertical: SIZES.small - 2,
                            borderColor: "#ffbf3f",
                            borderWidth: 5,
                            borderRadius: 10,
                        }}
                    >

                        <Text style={[styles.inputtitle, { fontSize: windowHeight < 800 ? 15 : 19 }]}>帳號</Text>
                        <TextInput
                            placeholder="Email..."
                            onChangeText={setEmail}
                            onChange={(event) => { setEmail(event.target.value) }}
                            style={[styles.input, { fontSize: windowHeight < 800 ? 15 : 15 }]}
                        />

                        <Text style={[styles.inputtitle, { fontSize: windowHeight < 800 ? 15 : 19 }]}>密碼</Text>
                        <TextInput
                            placeholder="Password..."
                            onChangeText={setPassword}
                            onChange={(event) => { setPassword(event.target.value) }}
                            style={[styles.input, { fontSize: windowHeight < 800 ? 15 : 15 }]}
                            secureTextEntry={true}
                        />
                        <TouchableOpacity onPress={login}>
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
                </View>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
        // </SafeAreaView>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    inputtitle: {
        fontFamily: FONTS.mainFont,
        fontWeight: "900",
        textAlign: 'center',
        justifyContent: 'center',
        backgroundColor: "white",
        color: COLORS.primary,
        margin: 3,
        // padding: 10,
    },
    input: {
        fontFamily: FONTS.VarelaRound,
        fontWeight: "900",
        textAlign: 'center',
        justifyContent: 'center',
        backgroundColor: "white",
        color: COLORS.primary,
        borderColor: COLORS.inputfieldgreen,
        borderWidth: 3.5,
        borderRadius: 5,
        width: "90%",
        height: 'auto',
        margin: 3,
        padding: 15,
    },
    solevbtn: {
        padding: 10,
        borderWidth: 0, // You can add a border if needed
        backgroundColor: 'transparent', // Make the background transparent
    },
    solevbtntext: {
        fontSize: 16,
        fontWeight: 'bold',
    },

});

export default Login