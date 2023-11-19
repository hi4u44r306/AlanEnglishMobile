import React from "react";
import { View, TouchableOpacity, StyleSheet, Text, Image, FlatList, SafeAreaView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { FocusedStatusBar, HomeHeader } from "../components";
import { COLORS, FONTS, SHADOWS, SIZES } from "../constants";
import { useSelector } from "react-redux";
import ScreenContainer from "./ScreenContainer";

const playlists = {
  習作本: ['Workbook_1', 'Workbook_2', 'Workbook_3', 'Workbook_4', 'Workbook_5'],
  SuperEasyReading: ['SER1', 'SER2', 'SER3'],
  STEAM: ['STEAM1', 'STEAM2', 'STEAM3'],
  ShortArticalReading: ['SARC1'],
  ReadingLamp: ['RL1Reading', 'RL2Reading', 'RL3Reading'],
  Skyline: ['Skyline1', 'Skyline2', 'Skyline3'],
  ReadingTable: ['ReadingTable1', 'ReadingTable2', 'ReadingTable3'],
};

const Playlist = () => {
  const navigation = useNavigation();
  const { screenmargin } = useSelector(state => state.musicReducer);

  const handlePlaylistDetailNavigation = (musicType) => {
    navigation.navigate("PlaylistDetail", { musicType });
  };


  //類別方框
  const renderItem = ({ item, index }) => (
    <TouchableOpacity
      onPress={() => handlePlaylistDetailNavigation(`${item}`)}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 150,
        padding: 15,
        backgroundColor: COLORS.white,
        borderRadius: SIZES.font,
        marginBottom: SIZES.extraLarge,
        margin: SIZES.base,
        ...SHADOWS.dark,
      }}
    >
      <Image source={require('../assets/img/headphone.png')} style={styles.img} />
      <Text style={{ fontWeight: '600', fontSize: 15 }}>{item}</Text>
    </TouchableOpacity>
  );

  return (
    <ScreenContainer>
      <FocusedStatusBar backgroundColor={COLORS.primary} />
      <HomeHeader display="none" />
      <FlatList
        style={{ paddingTop: 10, paddingBottom: 20 }}
        data={[
          { title: '習作本', data: playlists.習作本 },
          { title: 'Super Easy Reading', data: playlists.SuperEasyReading },
          { title: 'Steam Reading', data: playlists.STEAM },
          { title: 'ShortArticalReading', data: playlists.ShortArticalReading },
          { title: 'ReadingLamp', data: playlists.ReadingLamp },
          { title: 'Skyline', data: playlists.Skyline },
          { title: 'ReadingTable', data: playlists.ReadingTable },
        ]}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View>
            <View style={styles.typetitle}>
              <Text style={{
                fontFamily: FONTS.VarelaRound,
                fontWeight: '700',
                height: 20,
                color: 'white',
                fontSize: 17,
                letterSpacing: 1,
              }}>{item.title}</Text>
            </View>
            <View>
              <FlatList
                data={item.data}
                keyExtractor={(subItem, index) => index.toString()}
                renderItem={renderItem}
                style={{
                  flex: 4, flexDirection: 'row', flexWrap: 'wrap'
                }}
              />
            </View>
          </View>
        )}
      />
    </ScreenContainer>

  );
};



const styles = StyleSheet.create({
  typetitle: {
    width: 250,
    height: 25,
    padding: 18,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
    alignContent: 'center',
    backgroundColor: '#005b7f',
    borderTopRightRadius: 15,
    borderBottomRightRadius: 15,
    marginTop: 10,
    marginBottom: 15,
  },
  playlistContainer: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    flexWrap: 'wrap',
    justifyContent: 'space-evenly',
    backgroundColor: 'white',
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
