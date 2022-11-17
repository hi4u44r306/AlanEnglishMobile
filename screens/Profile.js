import React from "react";
import { View, SafeAreaView, FlatList, Text } from "react-native";

import { HomeHeader, FocusedStatusBar, LogoutButton } from "../components";
import { COLORS, SIZES } from "../constants";
import firebase from "./firebase";

const Profile = () => {

  const Logout = () => {
    firebase.auth().signOut()
    .then(()=>{
        navigation.navigate("Login")
    }).catch((err)=>{
        console.log(err)
    })
  }
  return (
    <SafeAreaView style={{ flex: 1 }}>
    <FocusedStatusBar backgroundColor={COLORS.primary} />
    <View style={{ flex: 1 }}>
      <View style={{ zIndex: 0 }}>
        {/* <FlatList
          ListHeaderComponent={<HomeHeader display='none' />}
          // data={nftData}
          // renderItem={({ item }) => <NFTCard data={item} />}
          // keyExtractor={(item) => item.id}
          // showsVerticalScrollIndicator={false}
        /> */}
        <HomeHeader display='none' />
        <View style={{flex:1, alignItems:'center', justifyContent:'center'}}>
          <Text style=
            {{
              fontSize:26,
              fontWeight:'bold',
              padding:20,
            }}>
            Profile
          </Text>
        </View>
        <View style={{
          alignContent:'center',
          alignItems: "center",
          }}>
          <LogoutButton
            minWidth={80}
            fontSize={SIZES.font}
            handlePress={Logout}
          />
        </View>
      </View>
    </View>
  </SafeAreaView>
  )
}

export default Profile