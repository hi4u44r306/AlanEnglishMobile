// Music.js
import React, { useState } from "react";
import { View, SafeAreaView, TouchableOpacity, StyleSheet, Text } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { MusicCard, HomeHeader, FocusedStatusBar } from "../components";
import FooterMusicPlayer from "../components/FooterMusicPlayer";
import { COLORS, musicDB, SIZES } from "../constants";
import PlaylistDetail from "./PlaylistDetail";

const Playlist = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const [musicData, setMusicData] = useState(musicDB);
  const [selectedMusic, setSelectedMusic] = useState(null);
  const [selectedType, setSelectedType] = useState("all");

  const musicTypes = [
    "Workbook_1", "Workbook_2", "Workbook_3", "Workbook_4", "Workbook_5",
    "Workbook_6", "SER1", "SER2", "SER3", "STEAM1", "STEAM2", "STEAM3",
    "SARC1", "RL1Reading", "RL2Reading", "RL3Reading", "Skyline1", "Skyline2",
    "Skyline3", "ReadingTable 1", "ReadingTable 2", "ReadingTable 3"
  ];

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
    <SafeAreaView style={styles.safeAreaView}>
      <FocusedStatusBar backgroundColor={COLORS.primary} />
      <View>
        <HomeHeader onSearch={handleSearch} />
        <View style={styles.playlistContainer}>
          {musicTypes.map((type) => (
            <TouchableOpacity
              key={type}
              onPress={() => handlePlaylistDetailNavigation(type)}
              style={styles.playlistCard}
            >
              <Text>{type}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
  },
  playlistContainer: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-evenly',
    backgroundColor: 'white',
    padding: 16,
    margin: 8,
  },
  playlistCard: {
    width: 200,
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
  },
});

export default Playlist;
