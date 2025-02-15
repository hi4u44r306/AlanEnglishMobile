import React, { useEffect, useState } from "react";
import { View, TouchableOpacity, StyleSheet, Text, Image, FlatList, SafeAreaView, Dimensions } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { FocusedStatusBar, HomeHeader } from "../components";
import { COLORS, FONTS, SHADOWS, SIZES } from "../constants";
import { useSelector } from "react-redux";
import ScreenContainer from "./ScreenContainer";
import { off, onValue, ref as rtdbRef } from "firebase/database";
import { rtdb } from "./firebase-config";




const Playlist = () => {
  const navigation = useNavigation();
  // const { screenmargin } = useSelector(state => state.musicReducer);

  const handlePlaylistDetailNavigation = (musicType) => {
    navigation.navigate("PlaylistDetail", { musicType });
  };

  const [data, setData] = useState([]);

  // Fetch data from Firebase RTDB
  useEffect(() => {
    const navItemsRef = rtdbRef(rtdb, 'AppNavbar/');
    onValue(navItemsRef, (snapshot) => {
      const fetchedData = snapshot.val();
      if (fetchedData) {
        // Convert the data to a structured array for FlatList
        const parsedData = Object.keys(fetchedData).map((key) => ({
          title: key,
          children: Object.values(fetchedData[key]),
        }));
        setData(parsedData);
      }
    });

    return () => {
      // Clean up listener on unmount
      const dbRef = rtdbRef(rtdb, 'AppNavbar/');
      off(dbRef);  // 移除監聽
    }
  }, []);

  const screenWidth = Dimensions.get('window').width;
  const itemWidth = screenWidth / 2 - 30; // Adjust spacing


  const renderItem = ({ item }) => (
    <View style={styles.section}>
      {/* Render the section title */}
      <Text style={styles.title} key={item.title}>{item.title}</Text>
      {/* Render the children */}
      <View>
        <FlatList
          data={item.children}
          numColumns={2}
          keyExtractor={(child, index) => index.toString()}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item: child }) => (
            // 類別方框
            <TouchableOpacity
              onPress={() => handlePlaylistDetailNavigation(`${child.path}`)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: itemWidth,
                padding: 8,
                backgroundColor: COLORS.white,
                borderRadius: 5,
                margin: SIZES.base,
                ...SHADOWS.medium,
              }}
            >
              {/* <Image source={require('../assets/img/headphone.png')} style={styles.img} /> */}
              <Text style={{ fontWeight: '700', fontSize: 18, fontFamily: "Nunito" }}>{child.name}</Text>
            </TouchableOpacity>
          )}
        />
      </View>
    </View>
  );

  return (
    <ScreenContainer>
      <FocusedStatusBar backgroundColor={COLORS.black} />
      <HomeHeader display="none" />
      <FlatList
        data={data}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
      />
    </ScreenContainer>

  );
};



const styles = StyleSheet.create({
  img: {
    width: 70,
    height: 70,
  },
  section: {
    marginVertical: 10,
    padding: 10,
    borderRadius: 5,
    elevation: 2,
  },
  title: {
    backgroundColor: '#ebc0a7',
    padding: 10,
    borderRadius: 5,
    elevation: 2,
    marginBottom: 10,
    fontSize: 20,
    fontWeight: "bold",
    fontFamily: "Nunito",
  },
  child: {
    marginTop: 5,
  },
  childText: {
    fontSize: 14,
  },
});

export default Playlist;
