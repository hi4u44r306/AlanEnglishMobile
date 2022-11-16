// import { View, Text } from 'react-native'
// import { View, SafeAreaView, FlatList } from "react-native";
import React,{useState} from 'react'
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView, Text, Image, View, TextInput, StyleSheet,Keyboard,KeyboardAvoidingView, TouchableWithoutFeedback,Platform} from "react-native";
import { Brand, SubBrand, FocusedStatusBar, LoginButton, Blackboard, Copyright } from "../components";
import { COLORS, SIZES, assets, FONTS } from "../constants";
import firebase from "./firebase";
import Toast from 'react-native-toast-message';



const toastConfig = {
    successToast: ({ text1, text2 }) => (
      <View style={{ 
        height: 80, 
        width: '80%', 
        backgroundColor: '#ffffff',
        // backgroundColor: '#31afd4',
        borderRadius: '20px',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth:'5px',
        borderColor:'#ffbf3f',
        }}>
        <Text style={{
            color:'red',
            fontWeight: 700,
            fontSize:'20px',
            fontFamily:FONTS.VarelaRound,
        }}>
        {/* <Image
            source={assets.badge}
            resizeMode="contain"
            style={{
            position: "absolute",
            width: 25,
            height: 25,
            top: '30%',
            left: 10,
            }}
        /> */}
        {text1} {text2}
        </Text>
        <Text style={{
            color:'black',
            fontWeight: 900,
            fontSize:'23px',
            fontFamily:FONTS.VarelaRound,
        }}>{text2}</Text>
        <Image
            source={assets.badge}
            resizeMode="contain"
            style={{
            position: "absolute",
            width: 25,
            height: 25,
            top: '30%',
            right: 10,
            }}
        />
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
        borderWidth:'5px',
        borderColor:'#ffbf3f',
        }}>
        <Text style={{
            color:'white',
            fontWeight: 700,
            fontSize:'20px',
            fontFamily:FONTS.VarelaRound,
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
        {text1}
        <Image
            source={assets.badge}
            resizeMode="contain"
            style={{
            position: "absolute",
            width: 25,
            height: 25,
            top: '30%',
            right: 10,
            }}
        />
        </Text>
      </View>
    )
  };

const Login = () => {
    const navigation = useNavigation();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const login = () =>{
        const success = () => {
            Toast.show({
                visibilityTime:1000,
                type: 'successToast',
                text1: 'Welcome',
                text2: `${email}`,
            });
          }
        const error = () => {
            Toast.show({
                visibilityTime:1000,
                type: 'errorToast',
                text1: 'Email or Password is incorrect',
            });
          }

        firebase.auth().signInWithEmailAndPassword(email,password)
        .then(()=>{
            success();
            setTimeout(()=>{navigation.navigate("Root")},1000) 
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
        <View style={{zIndex:'100000000000000'}}>
            <Toast
                position='center'
                topOffset={50}
                config={toastConfig}
            />
        </View>
        <FocusedStatusBar backgroundColor="black" />
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={{ marginTop: SIZES.font, alignItems: "center", justifyContent:"center" }}>
                    
                    <Blackboard/>
                    <Brand fontSize={20}/>
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
                            borderWidth: 5,
                            borderRadius:10,
                        }}
                    >
                   
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