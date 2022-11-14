// import { View, Text } from 'react-native'
// import { View, SafeAreaView, FlatList } from "react-native";
import React,{useState} from 'react'
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView, Text, View, TextInput, StyleSheet,Keyboard,KeyboardAvoidingView, TouchableWithoutFeedback,Platform} from "react-native";
import { Brand, SubBrand, FocusedStatusBar, LoginButton, Blackboard, Copyright } from "../components";
import { COLORS, SIZES, assets, FONTS } from "../constants";
import firebase from "./firebase";
import Toast, { BaseToast, ErrorToast } from 'react-native-toast-message';

const toastConfig = {
    successToast: ({ text1, text2 }) => (
      <View style={{ 
        height: 100, 
        width: '80%', 
        backgroundColor: '#2e9421',
        borderRadius: '20px',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth:'7px',
        borderColor:'#ffbf3f',
        zIndex: 1000,
        }}>
        <Text style={{
            color:'white',
            fontWeight: 600,
            fontSize:'20px',
            fontFamily:FONTS.VarelaRound,
        }}>{text1}</Text>
        <Text style={{
            color:'white',
            fontWeight: 500,
            fontSize:'20px',
            fontFamily:FONTS.VarelaRound,
        }}>{text2}</Text>
      </View>
    )
  };

const Login = () => {
    const navigation = useNavigation();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");


    const login = () =>{
        // success();
        // function subtractDays(numOfDays, date = new Date()) {
        //     const dateCopy = new Date(date.getTime());
        //     dateCopy.setDate(dateCopy.getDate() - numOfDays);
        //     return dateCopy;
        // }
        
        // const date = new Date('2022-11-07');
        // const result = subtractDays(7, date);
        // const calculateaccountexpiretime = result.toJSON().slice(0,10)

        const success = () => {
            Toast.show({
                visibilityTime:1000,
                type: 'successToast',
                text1: 'Welcome 👋',
                text2: `${email}`,
            });
          }

        firebase.auth().signInWithEmailAndPassword(email,password)
        .then(()=>{
            //檢查次帳號試用期是否已到 //
            // firebase.firestore().collection('student').doc(userCredential.user.uid).get().then((doc)=>{
            //     if(doc.data().accountcreatetime === calculateaccountexpiretime){
            //         // expire();
            //         alert('expire')
            //     }else{
            //         // success();
            //         setTimeout(()=>{navigation.navigate("Home")} ,1000);
            //     }
            // })
            success();
            setTimeout(function(){navigation.navigate("Home")},1000) 
        }).catch(()=>{
            // error();
            alert('error')
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
                    <Toast
                        position='top'
                        zIndex='20'
                        topOffset={20}
                        config={toastConfig}
                    />
                        <Text style={{fontSize: SIZES.extraLarge,fontWeight:900,margin:10}}>帳號</Text>
                        <TextInput
                            placeholder="Email..."
                            onChangeText={setEmail}
                            onChange={(event)=>{setEmail(event.target.value)}}
                            style={styles.input}
                        />
                    
                        <Text style={{fontSize: SIZES.extraLarge,fontWeight:900,margin:10}}>密碼</Text>
                        <TextInput
                            placeholder="Password..."
                            onChangeText={setPassword}
                            onChange={(event)=>{setPassword(event.target.value)}}
                            style={styles.input}
                            secureTextEntry={true}
                        />
                        <LoginButton
                            margin={20}
                            minWidth={120}
                            fontSize={SIZES.extraLarge}
                            handlePress={login}
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