import React from "react";
import { View, SafeAreaView, FlatList, Text } from "react-native";

import { HomeHeader, FocusedStatusBar } from "../components";
import { COLORS } from "../constants";

const Leaderboard = () => {
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
        <View style={{alignItems:'center', justifyContent:'center'}}>
          <Text style=
            {{
              fontSize:26,
              fontWeight:'bold',
              padding:20,
            }}>
            Leaderboard
          </Text>
        </View>
      </View>
    </View>
  </SafeAreaView>
  )
}

export default Leaderboard