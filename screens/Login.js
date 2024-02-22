// import { View, Text } from 'react-native'
// import { View, SafeAreaView, FlatList } from "react-native";
import React, { useState } from 'react'
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView, Text, Image, View, TextInput, StyleSheet, Keyboard, KeyboardAvoidingView, TouchableWithoutFeedback, Platform, TouchableOpacity } from "react-native";
import { Brand, SubBrand, FocusedStatusBar, LoginButton, Blackboard, Copyright } from "../components";
import { COLORS, SIZES, assets, FONTS } from "../constants";
import { db, authentication } from './firebase-config';
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';
import Toast from 'react-native-toast-message';



const toastConfig = {
    successToast: ({ text1, text2 }) => (
        <View style={{
            height: 80,
            width: '70%',
            backgroundColor: '#ffffff',
            // backgroundColor: '#31afd4',
            borderRadius: '20px',
            justifyContent: 'center',
            alignItems: 'center',
            borderWidth: '5px',
            borderColor: '#ffbf3f',
        }}>
            <Image
                source={assets.badge}
                resizeMode="contain"
                style={{
                    position: "absolute",
                    width: 25,
                    height: 25,
                    top: '30%',
                    left: 10,
                }}
            />
            <Text style={{
                color: 'red',
                fontWeight: '700',
                fontSize: '20px',
                fontFamily: 'mainFont',
            }}>
                {text1}
            </Text>
        </View>
    ),
    errorToast: ({ text1 }) => (
        <View style={{
            height: 100,
            width: '90%',
            backgroundColor: '#fe5f55',
            borderRadius: '20px',
            justifyContent: 'center',
            alignItems: 'center',
            borderWidth: '5px',
            borderColor: '#ffbf3f',
        }}>
            <Text style={{
                color: 'white',
                fontWeight: '700',
                fontSize: '20px',
                fontFamily: 'mainFont',
            }}>
                {text1}
            </Text>
        </View>
    )
};

const Login = () => {
    const navigation = useNavigation();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");
    const currentDate = new Date().toJSON().slice(0, 10);
    const currentMonth = new Date().toJSON().slice(0, 7);

    const login = async () => {

        const success = () => {
            Toast.show({
                visibilityTime: 1000,
                type: 'successToast',
                text1: 'Welcome Back',
                // text2: `${email}`,
            });
        }
        const error = () => {
            Toast.show({
                visibilityTime: 1000,
                type: 'errorToast',
                text1: 'Email or Password is incorrect',
            });
        }

        try {
            const userCredential = await signInWithEmailAndPassword(authentication, email, password);
            const userDoc = await getDoc(doc(db, 'student', userCredential.user.uid));
            const userName = userDoc.data().name.toUpperCase();
            setUsername(userName);
            const userRef = doc(db, 'student', userCredential.user.uid);

            const currentDate = new Date().toISOString().slice(0, 10);
            const currentMonth = new Date().toISOString().slice(0, 7);

            const docSnapshot = await getDoc(userRef);
            const onlinetime = docSnapshot.data().onlinetime;
            if (onlinetime !== currentDate) {
                await updateDoc(userRef, {
                    onlinemonth: currentMonth,
                    onlinetime: currentDate,
                    currdatetimeplayed: 0,
                });
            }

            const resetAllMusic = docSnapshot.data().Resetallmusic;
            if (resetAllMusic === 'notupdated' || resetAllMusic !== currentMonth + 'alreadyupdated') {
                await setDoc(userRef, {
                    totaltimeplayed: 0,
                    Resetallmusic: currentMonth + 'alreadyupdated',
                }, { merge: true });

                const firebaseRef = firebase.database().ref();
                firebaseRef.child("student").child(userCredential.user.uid).child("totaltimeplayed").update({
                    totaltimeplayed: 0,
                });
            }

            success();
            setTimeout(() => { navigation.navigate("Root") }, 1000);

        } catch (error) {
            error();
        }
    }


    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.container}
        >
            <View style={{ zIndex: 999 }}>
                <Toast
                    position='center'
                    topOffset={50}
                    config={toastConfig}
                />
            </View>
            <FocusedStatusBar />
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={{ marginTop: SIZES.font, alignItems: "center", justifyContent: "center" }}>

                    <Blackboard />
                    <Brand fontSize={40} margin={2} />
                    <SubBrand />
                    <Text>{username}</Text>
                    <View
                        style={{
                            fontFamily: FONTS.mainFont,
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

                        <Text style={styles.inputtitle}>帳號</Text>
                        <TextInput
                            placeholder="Email..."
                            onChangeText={setEmail}
                            onChange={(event) => { setEmail(event.target.value) }}
                            style={styles.input}
                        />
                        <Text>{email}</Text>

                        <Text style={styles.inputtitle}>密碼</Text>
                        <TextInput
                            placeholder="Password..."
                            onChangeText={setPassword}
                            onChange={(event) => { setPassword(event.target.value) }}
                            style={styles.input}
                            secureTextEntry={true}
                        />

                        <LoginButton
                            margin={10}
                            minWidth={100}
                            fontSize={25}
                            padding={7}
                            handlePress={login}
                        />
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
        paddingTop: 40,
    },
    inputtitle: {
        fontFamily: FONTS.mainFont,
        fontWeight: "900",
        fontSize: 19,
        textAlign: 'center',
        justifyContent: 'center',
        backgroundColor: "white",
        color: COLORS.primary,
        margin: 3,
        padding: 10,
    },
    input: {
        fontFamily: FONTS.mainFont,
        fontWeight: "900",
        fontSize: 15,
        textAlign: 'center',
        justifyContent: 'center',
        backgroundColor: "white",
        color: COLORS.primary,
        borderColor: COLORS.inputfieldgreen,
        borderWidth: 3.5,
        borderRadius: 5,
        width: "80%",
        // height: 40,
        margin: 3,
        padding: 10,
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