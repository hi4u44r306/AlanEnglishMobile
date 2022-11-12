// import { View, Text } from 'react-native'
// import { View, SafeAreaView, FlatList } from "react-native";
import React from 'react'
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView, Text, View, TextInput, StyleSheet } from "react-native";
import { Brand, SubBrand, FocusedStatusBar, LoginButton, Blackboard, Copyright } from "../components";
import { COLORS, SIZES, assets, FONTS } from "../constants";


const Login = () => {
    const navigation = useNavigation();
    const [email, onChangeEmail] = React.useState("");
    const [password, onChangePassword] = React.useState("");

    return (
        <SafeAreaView style={{backgroundColor:COLORS.ricewhite, width:"100%", height:"100%", }}>
        <FocusedStatusBar backgroundColor={COLORS.primary} />
        

            <View style={{ marginTop: SIZES.font, alignItems: "center", justifyContent:"center" }}>
            
                <Blackboard/>
                <Brand/>
                <SubBrand/>
                <View
                style={{
                    fontFamily: FONTS.bold,
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
                    
                <Text style={{fontSize: SIZES.extraLarge,fontWeight:900,margin:10}}>帳號</Text>
                <TextInput
                    placeholder="Email..."
                    value={email}
                    onChangeText={onChangeEmail}
                    style={styles.input}
                />
            
                <Text style={{fontSize: SIZES.extraLarge,fontWeight:900,margin:10}}>密碼</Text>
                <TextInput
                    placeholder="Password..."
                    value={password}
                    onChangeText={onChangePassword}
                    style={styles.input}
                />
                    <LoginButton
                        margin={20}
                        minWidth={120}
                        fontSize={SIZES.extraLarge}
                        handlePress={() => navigation.navigate("Home")}
                    />
                    <Copyright/>
                </View>
            </View>

    </SafeAreaView>
  )
}
const styles = StyleSheet.create({
    input: {
        fontFamily: FONTS.semiBold,
        outline:"none",
        fontSize:18,
        textAlign: 'center',
        justifyContent: 'center',
        // backgroundColor: "#bbdef0",
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