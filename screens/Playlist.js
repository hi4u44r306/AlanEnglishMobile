// Music.js
import React, { useState } from "react";
import { View, SafeAreaView, FlatList, Picker, ScrollView, TouchableOpacity, StyleSheet, Text } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { MusicCard, HomeHeader, FocusedStatusBar } from "../components";
import FooterMusicPlayer from "../components/FooterMusicPlayer";
import { COLORS, musicDB, SIZES } from "../constants";
import PlaylistDetail from "./PlaylistDetail";

const Playlist = () => {
  const navigation = useNavigation();
  const [musicData, setMusicData] = useState(musicDB);
  const [selectedMusic, setSelectedMusic] = useState(null);
  const [selectedType, setSelectedType] = useState("all");
  const route = useRoute();
  const musicTypes = ["Workbook_1", "Workbook_2", "Workbook_3", "Workbook_4", "Workbook_5", "Workbook_6", "SER1", "SER2", "SER3", "STEAM1", "STEAM2", "STEAM3", "SARC1", "RL1Reading", "RL2Reading", "RL3Reading", "Skyline1", "Skyline2", "Skyline3", "ReadingTable 1", "ReadingTable 2", "ReadingTable 3"];
  const handleCardClick = (data) => {
    setSelectedMusic(data);
  };

  const handleSearch = (value) => {
    // Your existing search logic...
  };

  const filterMusicByType = (type) => {
    if (type === "all") {
      return musicData;
    }
    return musicData.filter((item) => item.type === type);
  };

  const handlePlaylistDetailNavigation = (musicType) => {
    navigation.navigate("PlaylistDetail", { musicType });
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <FocusedStatusBar backgroundColor={COLORS.primary} />
      <View style={{ flex: 1 }}>
        <View style={{ zIndex: 0 }}>
          <HomeHeader onSearch={handleSearch} />
          <View style={styles.playlistcontainer}>
            <ScrollView style={{ flex: 1 }}>
              {musicTypes.map((type) => (
                <TouchableOpacity
                  key={type}
                  onPress={() => handlePlaylistDetailNavigation(type)}
                  style={styles.playlistcard}
                >
                  <Text>{type}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </View>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  playlistcontainer: {
    flexDirection: 'row', // Set flexDirection to 'row'
    flexWrap: 'nowrap',   // Set flexWrap to 'nowrap'
    backgroundColor: 'white',
    padding: 16,
    margin: 8,
    borderRadius: 8,
  },

  playlistcard: {
    padding: 16,
    margin: 8,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,

  }

});

export default Playlist;
