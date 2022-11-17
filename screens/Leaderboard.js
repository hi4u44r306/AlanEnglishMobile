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
        <FlatList
          ListHeaderComponent={<HomeHeader display='none'/>}
        />
        <View style={{flex:1, alignItems:'center', justifyContent:'center'}}>
          <Text style={{
            fontSize:26,
            fontWeight:'bold',
          }}>Leaderboard</Text>
        </View>
      </View>
    </View>
  </SafeAreaView>
  )
}

export default Leaderboard