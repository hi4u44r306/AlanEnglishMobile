// Music.js
import React, { useState } from "react";
import { View, SafeAreaView, TouchableOpacity, StyleSheet, Text, Image, ScrollView, FlatList } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { MusicCard, HomeHeader, FocusedStatusBar } from "../components";
import FooterMusicPlayer from "../components/FooterMusicPlayer";
import { COLORS, musicDB, SIZES } from "../constants";
import PlaylistDetail from "./PlaylistDetail";
import { useRef } from "react";
const playlists = {
  習作本: ['Workbook_1', 'Workbook_2', 'Workbook_3', 'Workbook_4', 'Workbook_5'],
  SER: ['SER1', 'SER2', 'SER3'],
  STEAM: ['STEAM1', 'STEAM2', 'STEAM3'],
  SARC: ['SARC1'],
  RL: ['RL1Reading', 'RL2Reading', 'RL3Reading'],
  Skyline: ['Skyline1', 'Skyline2', 'Skyline3'],
  ReadingTable: ['ReadingTable1', 'ReadingTable2', 'ReadingTable3'],
};

const Playlist = () => {
  const navigation = useNavigation();

  const handlePlaylistDetailNavigation = (musicType) => {
    navigation.navigate("PlaylistDetail", { musicType });
  };

  const renderItem = ({ item, index }) => (
    <TouchableOpacity
      onPress={() => handlePlaylistDetailNavigation(`${item}`)}
      style={styles.playlistCard}
    >
      <Image source={require('../assets/img/headphone.png')} style={styles.img} />
      <Text style={{ fontFamily: 'Nunito', fontWeight: '500', fontSize: 14 }}>{item}</Text>
    </TouchableOpacity>
  );

  return (
    <>
      <HomeHeader />
      <ScrollView>
        <FlatList
          data={[
            { title: '習作本', data: playlists.習作本 },
            { title: 'Super Easy Reading', data: playlists.SER },
            { title: 'Steam Reading', data: playlists.STEAM },
            { title: 'SARC', data: playlists.SARC },
            { title: 'RL', data: playlists.RL },
            { title: 'Skyline', data: playlists.Skyline },
            { title: 'ReadingTable', data: playlists.ReadingTable },
          ]}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View>
              <View style={styles.typetitle}>
                <Text style={{ color: '#fff4d5', fontFamily: 'Nunito', fontWeight: '600', fontSize: 18 }}>{item.title}</Text>
              </View>
              <View style={styles.scrollViewContainer}>
                <FlatList
                  horizontal
                  data={item.data}
                  keyExtractor={(subItem, index) => index.toString()}
                  renderItem={renderItem}
                />
              </View>
            </View>
          )}
        />
      </ScrollView>
    </>
  );
};



const styles = StyleSheet.create({
  typetitle: {
    width: '50%',
    height: 25,
    padding: 18,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
    backgroundColor: '#005b7f',
    borderTopRightRadius: 15,
    borderBottomRightRadius: 15,
    marginTop: 10,
    marginBottom: 10,
  },
  scrollViewContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-evenly',
    backgroundColor: 'white',
    paddingBottom: 16, // Add some padding to the bottom to allow for scrolling
  },


  playlistContainer: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    flexWrap: 'wrap',
    justifyContent: 'space-evenly',
    backgroundColor: 'white',
  },
  playlistCard: {
    display: 'flex',
    alignItems: 'center',
    width: 135,
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
  arrow: {
    width: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  img: {
    width: 50,
    height: 50,
  }
});

export default Playlist;
