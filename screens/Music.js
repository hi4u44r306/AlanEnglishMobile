import React, { useState } from "react";
import { View, SafeAreaView, FlatList } from "react-native";

import { MusicCard, HomeHeader, FocusedStatusBar } from "../components";
import FooterMusicPlayer from "../components/FooterMusicPlayer";
import { COLORS, musicDB, SIZES } from "../constants";

const Music = () => {

  const [musicData, setMusicData] = useState(musicDB);
  const [test, setTest] = useState('none');

  const handleClick =()=>{
    setTest('flex');
    
  }

  const handleSearch = (value) => {
    if (value.length === 0) {
      setMusicData(musicData);
    }

    const filteredData = musicData.filter((item) =>
      item.bookname.toLowerCase().includes(value.toLowerCase())
    );

    if (filteredData.length === 0) {
      setMusicData(musicData);
    } else {
      setMusicData(filteredData);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <FocusedStatusBar backgroundColor={COLORS.primary} />
      <View style={{ flex: 1 }}>
        <View style={{ zIndex: 0 }}>
          <FlatList
            ListHeaderComponent={<HomeHeader onSearch={handleSearch}/>}
            data={musicData}
            renderItem={({ item }) => <MusicCard data={item} onclickmusic={handleClick}/>}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </View>
      <View>
        <FlatList
          data={musicData}
          renderItem={({ item }) => <FooterMusicPlayer display={test} data={item}/>}
          keyExtractor={(item) => item.id}
        />
      </View>
    </SafeAreaView>
  );
}

export default Music