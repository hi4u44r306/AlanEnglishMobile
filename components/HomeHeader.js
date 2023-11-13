import React, { useState } from "react";
import { View, Text, Image, TextInput } from "react-native";

import { COLORS, FONTS, SIZES, assets } from "../constants";
import { Brand } from "./Brand";

import firebase from 'firebase/app';
import 'firebase/firestore';
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";



const HomeHeader = ({ onSearch, display }) => {

  const db = firebase.firestore();
  const [username, setUsername] = useState();
  const currentDate = new Date().toJSON().slice(0, 10);
  const currentMonth = new Date().toJSON().slice(0, 7);
  const [dailytimeplayed, setDailyTimeplayed] = useState();
  const percentage = dailytimeplayed * 100 / 20;
  const custompathColor = `#89aae6`

  const getUsername = async () => {
    setUsername(await AsyncStorage.getItem('ae-username'))
  };
  getUsername();

  return (
    <View
      style={{
        backgroundColor: COLORS.ricewhite,
        padding: SIZES.font,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignContent: 'center',
          alignItems: "center",
        }}
      >
        <Brand fontSize={23} margin={1} />
        <View style={{ height: 45, justifyContent: 'center' }}>
          <Text
            style={{
              fontFamily: FONTS.bold,
              fontSize: SIZES.large,
              color: COLORS.primary,
            }}
          >
            {username || "Loading..."} 👋
          </Text>
        </View>
      </View>


      <View style={{ marginTop: SIZES.font, display: display }}>
        <View
          style={{
            width: "100%",
            borderRadius: SIZES.font,
            backgroundColor: 'white',
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: SIZES.font,
            paddingVertical: SIZES.small - 2,
          }}
        >
          <Text><Ionicons name='search-outline' source={assets.search} resizeMode="contain" style={{ width: 20, height: 20, marginRight: SIZES.base }} /></Text>
          <TextInput
            placeholder="Search Tracks........"
            style={{ flex: 1, color: 'black' }}
            onChangeText={onSearch}
          />
        </View>
      </View>
    </View>
  );
};

export default HomeHeader;
