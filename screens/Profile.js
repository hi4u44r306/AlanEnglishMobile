import React from "react";
import { View, SafeAreaView, FlatList, Text } from "react-native";

import { HomeHeader, FocusedStatusBar, LogoutButton } from "../components";
import { COLORS, SIZES } from "../constants";

const Profile = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
    <FocusedStatusBar backgroundColor={COLORS.primary} />
    <View style={{ flex: 1 }}>
      <View style={{ zIndex: 0 }}>
        <FlatList
          ListHeaderComponent={<HomeHeader display='none' />}
          // data={nftData}
          // renderItem={({ item }) => <NFTCard data={item} />}
          // keyExtractor={(item) => item.id}
          // showsVerticalScrollIndicator={false}
        />
        <View style={{flex:1, alignItems:'center', justifyContent:'center'}}>
          <Text style={{
            fontSize:26,
            fontWeight:'bold',
          }}>Profile</Text>
        <LogoutButton
          minWidth={120}
          fontSize={SIZES.font}
          handlePress={() => navigation.navigate("Login")}
        />
        </View>
      </View>
    </View>
  </SafeAreaView>
  )
}

export default Profile