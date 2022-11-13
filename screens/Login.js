// import { View, Text } from 'react-native'
// import { View, SafeAreaView, FlatList } from "react-native";
import React from 'react'
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView, Text, View, TextInput, StyleSheet,Keyboard,KeyboardAvoidingView, TouchableWithoutFeedback,Platform} from "react-native";
import { Brand, SubBrand, FocusedStatusBar, LoginButton, Blackboard, Copyright } from "../components";
import { COLORS, SIZES, assets, FONTS } from "../constants";
import firebase from "./firebase";
import ToastManager, { Toast } from 'toastify-react-native'

const Login = () => {
    const navigation = useNavigation();
    const [email, onChangeEmail] = React.useState("");
    const [password, onChangePassword] = React.useState("");


    const success = () =>  {
        Toast.success('😻Welcome😻',{
            className:"notification",
            position: "top-center",
            autoClose: 500,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
            progress: undefined,
            theme: "colored",
            });
            setTimeout(()=>{navigation.navigate("Home")} ,500); 
            
        };

    const error = () =>  {
        Toast.error('🙀帳號密碼錯誤🙀',{
            className:"notification",
            position: "top-center",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
            progress: undefined,
            theme: "colored",
            });
        };
    const expire = () =>  {
        Toast.error('此帳號已註銷',{
            className:"notification",
            position: "top-center",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
            progress: undefined,
            theme: "colored",
            });
        };
    const login = (email, password) =>{
        firebase.auth().signInWithEmailAndPassword(email,password)
        .then((userCredential)=>{
            // 檢查次帳號試用期是否已到 //
            firebase.firestore().collection('student').doc(userCredential.user.uid).get().then((doc)=>{
                if(doc.data().accountcreatetime === calculateaccountexpiretime){
                    expire();
                }else{
                    success();
                }
            })
        }).catch(()=>{
            error();
        })
    }

    return (
        // <SafeAreaView style={{backgroundColor:COLORS.ricewhite, width:"100%", height:"100%", }}>
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.container}
        >
        <FocusedStatusBar backgroundColor="black" />
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={{ marginTop: SIZES.font, alignItems: "center", justifyContent:"center" }}>
                
                    <Blackboard/>
                    <Brand/>
                    <SubBrand/>
                    <View
                    style={{
                        fontFamily: FONTS.VarelaRound,
                        width: "90%",
                        borderRadius: SIZES.font,
                        flexDirection: "column",
                        alignItems: "center",
                        margin: 20,
                        paddingHorizontal: SIZES.font,
                        paddingVertical: SIZES.small - 2,
                        borderColor: "#ffbf3f",
                        borderWidth: 10,
                        borderRadius:10,
                    }}
                    >
                    <ToastManager />    
                    <Text style={{fontSize: SIZES.extraLarge,fontWeight:900,margin:10}}>帳號</Text>
                    <TextInput
                        placeholder="Email..."
                        value={email}
                        onChangeText={onChangeEmail(email)}
                        style={styles.input}
                    />
                
                    <Text style={{fontSize: SIZES.extraLarge,fontWeight:900,margin:10}}>密碼</Text>
                    <TextInput
                        placeholder="Password..."
                        value={password}
                        onChangeText={onChangePassword(password)}
                        style={styles.input}
                        secureTextEntry={true}
                    />
                        <LoginButton
                            margin={20}
                            minWidth={120}
                            fontSize={SIZES.extraLarge}
                            handlePress={login(email,password)}
                        />
                        <Copyright/>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    // </SafeAreaView>
  )
}
const styles = StyleSheet.create({
    container:{
        flex:1,
        paddingTop: 40,
    },
    input: {
        fontFamily: FONTS.VarelaRound,
        fontWeight:"900",
        fontSize:18,
        textAlign: 'center',
        justifyContent: 'center',
        backgroundColor: "white",
        color: COLORS.primary, 
        borderColor: COLORS.inputfieldgreen,
        borderWidth: 3.5,
        borderRadius:5,
        width: "80%",
        height: 40,
        margin: 12,
        padding: 10,
    },
});

export default Login