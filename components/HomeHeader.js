import React, { useState } from "react";
import { View, Text, Image, TextInput, TouchableOpacity, SafeAreaView } from "react-native";

import { COLORS, FONTS, SIZES, assets } from "../constants";
import { Brand } from "./Brand";

import firebase from 'firebase/app';
import 'firebase/firestore';
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import FocusedStatusBar from "./FocusedStatusBar";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSidebar } from "./actions/actions";



const HomeHeader = ({ onSearch, display }) => {
  // const { username } = useSelector(state => state.userReducer);
  const navigation = useNavigation();
  const db = firebase.firestore();
  const [username, setUsername] = useState();
  const currentDate = new Date().toJSON().slice(0, 10);
  const currentMonth = new Date().toJSON().slice(0, 7);
  const [dailytimeplayed, setDailyTimeplayed] = useState();
  const percentage = dailytimeplayed * 100 / 20;
  const custompathColor = `#89aae6`

  const getUsername = async () => {
    try {
      setUsername(await AsyncStorage.getItem('ae-username'));
    } catch (error) {
      console.error('Error fetching username:', error);
      // Handle the error as needed
    }
  };

  getUsername();

  useEffect(() => {
    getUsername();
  }, []);

  const dispatch = useDispatch();
  const handleProfilePress = () => {
    dispatch(setSidebar('flex'))
    console.log('sidebar open')

    // navigation.navigate('用戶'); 
  };

  return (
    <SafeAreaView style={{ backgroundColor: COLORS.ricewhite, }}>
      <View
        style={{
          backgroundColor: COLORS.ricewhite,
          paddingTop: 5,
          paddingBottom: 5,
          paddingLeft: 10,
          paddingRight: 10,
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
          <Brand fontSize={25} margin={0.7} />
          <TouchableOpacity onPress={handleProfilePress}>
            <View style={{ height: 45, justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
              <Ionicons name="list-outline" size={30} color="rgb(64, 98, 187)" style={{ marginRight: 10, }} />
              {/* <Ionicons name="person-circle" size={30} color="rgb(64, 98, 187)" style={{ marginRight: 8, }} /> */}
              {/* <Text
                style={{
                  fontFamily: FONTS.VarelaRound,
                  fontWeight: '700',
                  fontSize: 15,
                  color: COLORS.primary,
                }}
              >
                {username || "Loading..."}
              </Text> */}

            </View>
          </TouchableOpacity>

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
    </SafeAreaView>
  );
};

export default HomeHeader;
