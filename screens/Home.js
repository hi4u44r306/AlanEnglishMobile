import React, { useState } from "react";
import { View, SafeAreaView, FlatList, Text } from "react-native";

import { MusicCard, HomeHeader, FocusedStatusBar } from "../components";
import { COLORS, musicDB, SIZES } from "../constants";

const Home = () => {
  // const [musicData, setMusicData] = useState(musicDB);

  // const handleSearch = (value) => {
  //   if (value.length === 0) {
  //     setMusicData(musicData);
  //   }

  //   const filteredData = musicData.filter((item) =>
  //     item.bookname.toLowerCase().includes(value.toLowerCase())
  //   );

  //   if (filteredData.length === 0) {
  //     setMusicData(musicData);
  //   } else {
  //     setMusicData(filteredData);
  //   }
  // };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <FocusedStatusBar backgroundColor={COLORS.primary} />
      <View style={{ flex: 1 }}>
        <View style={{ zIndex: 0 }}>
          {/* <FlatList
            ListHeaderComponent={<HomeHeader onSearch={handleSearch} />}
            data={musicData}
            renderItem={({ item }) => <MusicCard data={item} />}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
          /> */}
          <HomeHeader/>
          <View style={{alignItems:'center', justifyContent:'center'}}>
          <Text style=
            {{
              fontSize:26,
              fontWeight:'bold',
              padding:20,
            }}>
            Home
          </Text>
        </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Home;
