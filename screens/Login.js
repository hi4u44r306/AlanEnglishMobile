// import { View, Text } from 'react-native'
// import { View, SafeAreaView, FlatList } from "react-native";
import React from 'react'
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView, Text, View, TextInput } from "react-native";
import { Brand, SubBrand, FocusedStatusBar, LoginButton, Blackboard, Copyright } from "../components";
import { COLORS, SIZES, assets } from "../constants";


const Login = () => {
    const navigation = useNavigation();
  return (
    <SafeAreaView style={{backgroundColor:COLORS.ricewhite, width:"100%", height:"100%", paddingTop:"30px"}}>
        <FocusedStatusBar backgroundColor={COLORS.primary} />
        <View style={{ marginTop: SIZES.font, alignItems: "center", justifyContent:"center" }}>
            <Blackboard/>
            <Brand/>
            <SubBrand/>
            <View
            style={{
                width: "90%",
                borderRadius: SIZES.font,
                flexDirection: "column",
                alignItems: "center",
                gap:"30px",
                paddingHorizontal: SIZES.font,
                paddingVertical: SIZES.small - 2,
                borderColor: "#ffbf3f",
                borderWidth: 10,
                borderTopLeftRadius: 10,
                borderTopRightRadius: 10,
                borderBottomRightRadius: 10,
                borderBottomLeftRadius: 10,
            }}
            >
                <View style={{
                    width: "100%",
                    alignItems: "center",
                    gap:20,
                }}>
                    <Text style={{fontSize: SIZES.extraLarge,fontFamily: "Varela Round",
                    fontWeight:900,}}>帳號</Text>
                    <TextInput
                        placeholder="Email..."
                        style={{ 
                            outline:"none",
                            flex: 1,
                            fontSize:"15px",
                            textAlign: 'center',
                            justifyContent: 'center',
                            color: COLORS.primary, 
                            borderColor: COLORS.inputfieldgreen,
                            borderWidth: 3.5,
                            borderTopLeftRadius: 5,
                            borderTopRightRadius: 5,
                            borderBottomRightRadius: 5,
                            borderBottomLeftRadius: 5,
                            width: 100,
                            height:50,
                            }}
                    />
                </View>
                <View style={{
                    width: "100%",
                    flexDirection:"column",
                    alignItems: "center",
                    gap:"20px",
                }}>
                    <Text style={{fontSize: SIZES.extraLarge,fontFamily: "Varela Round",
                    fontWeight:900,}}>密碼</Text>
                    <TextInput
                        placeholder="Password..."
                        style={{ 
                            outline:"none",
                            flex: 1,
                            fontSize:"15px",
                            textAlign: 'center',
                            justifyContent: 'center',
                            color: COLORS.primary, 
                            borderColor: COLORS.inputfieldgreen,
                            borderWidth: 3.5,
                            borderTopLeftRadius: 5,
                            borderTopRightRadius: 5,
                            borderBottomRightRadius: 5,
                            borderBottomLeftRadius: 5,
                            width: 100,
                            height:50,
                        }}
                        // onChangeText={onSearch}
                    />
                </View>
                <LoginButton
                    minWidth={120}
                    fontSize={SIZES.font}
                    handlePress={() => navigation.navigate("Home")}
                />
                <Copyright/>
            </View>
        </View>
    </SafeAreaView>
  )
}

export default Login