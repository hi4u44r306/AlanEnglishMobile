// import { View, Text } from 'react-native'
// import { View, SafeAreaView, FlatList } from "react-native";
import React from 'react'
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView, Text, View, TextInput, KeyboardAvoidingView } from "react-native";
import { Brand, SubBrand, FocusedStatusBar, LoginButton, Blackboard, Copyright } from "../components";
import { COLORS, SIZES, assets, FONTS } from "../constants";


const Login = () => {
    const navigation = useNavigation();
  return (
    <SafeAreaView style={{backgroundColor:COLORS.ricewhite, width:"100%", height:"100%", }}>
        <FocusedStatusBar backgroundColor={COLORS.primary} />

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
                    <View style={{
                        width: "100%",
                        alignItems: "center",
                    }}>
                        <Text style={{fontSize: SIZES.extraLarge,fontWeight:900,margin:10}}>帳號</Text>
                        <TextInput
                            placeholder="Email..."
                            style={{ 
                                fontFamily: FONTS.VarelaRound,
                                outline:"none",
                                flex: 1,
                                fontSize:20,
                                textAlign: 'center',
                                justifyContent: 'center',
                                backgroundColor: COLORS.white,
                                color: COLORS.primary, 
                                borderColor: COLORS.inputfieldgreen,
                                borderWidth: 3.5,
                                borderRadius:5,
                                padding:SIZES.font,
                                margin:10,
                                width: "80%",
                                }}
                        />
                    </View>
                    <View style={{
                        width: "100%",
                        flexDirection:"column",
                        alignItems: "center",
                    }}>
                        <Text style={{fontSize: SIZES.extraLarge,fontWeight:900,margin:10}}>密碼</Text>
                        <TextInput
                            placeholder="Password..."
                            style={{ 
                                fontFamily: FONTS.VarelaRound,
                                outline:"none",
                                flex: 1,
                                fontSize:20,
                                textAlign: 'center',
                                justifyContent: 'center',
                                backgroundColor: COLORS.white,
                                color: COLORS.primary, 
                                borderColor: COLORS.inputfieldgreen,
                                borderWidth: 3.5,
                                borderRadius: 5,
                                padding:SIZES.font,
                                margin:10,
                                width: "80%",
                            }}
                            // onChangeText={onSearch}
                        />
                    </View>
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

export default Login