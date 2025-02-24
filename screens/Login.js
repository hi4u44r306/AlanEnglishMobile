import React, { useEffect, useState, useRef } from 'react'
import { useNavigation } from "@react-navigation/native";
import { Text, View, TextInput, StyleSheet, Keyboard, KeyboardAvoidingView, TouchableWithoutFeedback, Platform, TouchableOpacity, ActivityIndicator, Dimensions, Pressable } from "react-native";
import { Brand, SubBrand, FocusedStatusBar, Blackboard, Copyright } from "../components";
import { COLORS, SIZES, FONTS } from "../constants";
import { authentication, rtdb } from './firebase-config';
import { signInWithEmailAndPassword } from "firebase/auth";
import Toast from 'react-native-toast-message';
import { AntDesign, Ionicons, Octicons } from '@expo/vector-icons';
import { setTabBarHeight } from '../components/actions/actions';
import { useDispatch } from 'react-redux';
import { child, get, ref, update } from 'firebase/database';



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

    const login = async () => {
        toggleLoading();
        const currentDate = new Date().toISOString().slice(0, 10);
        const currentMonth = new Date().toISOString().slice(0, 7);

        try {
            signInWithEmailAndPassword(authentication, email, password).then((userCredential) => {
                const userid = userCredential.user.uid
                const dbRef = ref(rtdb);
                get(child(dbRef, `student/${userid}`)).then((snapshot) => {
                    const userName = snapshot.val().name.toUpperCase();
                    const onlinetime = snapshot.val().onlinetime;
                    const musicRef = ref(rtdb, '/student/' + userid);
                    if (onlinetime !== currentDate) {
                        update(musicRef, {
                            Daytotaltimeplayed: 0,
                            onlinemonth: currentMonth,
                            onlinetime: currentDate,
                        })
                    }

                    if (snapshot.val().Resetallmusic === 'notupdated' || snapshot.val().Resetallmusic !== currentMonth + 'alreadyupdated') {

                        const databaseRef = ref(rtdb, `student/${userid}`);
                        update(databaseRef, {
                            Monthtotaltimeplayed: 0,
                            Resetallmusic: currentMonth + 'alreadyupdated',
                        });
                        const musicLogfileRef = ref(rtdb, `student/${userid}/MusicLogfile`);
                        remove(musicLogfileRef);
                    }

                    success(userName);
                    setTimeout(() => {
                        navigation.navigate("Root")
                    }, 1000);
                })
            })


        } catch {
            error();
        }
    }


    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={[styles.container, { paddingTop: windowHeight < 800 ? 20 : 40 }]}
        >
            <FocusedStatusBar />
            <View style={{ zIndex: 999 }}>
                <Toast config={toastConfig} topOffset={50} />
            </View>
            <Pressable onPress={Keyboard.dismiss}>
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
                            onChange={(event) => { setEmail(event.value) }}
                            style={[styles.input, { fontSize: windowHeight < 800 ? 15 : 15 }]}
                        />

                        <Text style={[styles.inputtitle, { fontSize: windowHeight < 800 ? 15 : 19 }]}>密碼</Text>
                        <TextInput
                            placeholder="Password..."
                            onChangeText={setPassword}
                            onChange={(event) => { setPassword(event.value) }}
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
            </Pressable>
        </KeyboardAvoidingView>
        // </SafeAreaView>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        // fontFamily: 'Nunito',
    },
    inputtitle: {
        fontFamily: FONTS.mainFont,
        fontWeight: "700",
        textAlign: 'center',
        justifyContent: 'center',
        backgroundColor: "white",
        color: COLORS.primary,
        margin: 3,
        // padding: 10,
    },
    input: {
        fontFamily: FONTS.VarelaRound,
        fontWeight: "700",
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