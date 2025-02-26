import React, { useRef, useState } from "react";
import { View, Text, Image, TextInput, TouchableOpacity, SafeAreaView, Button, Dimensions } from "react-native";

import { COLORS, FONTS, SIZES, assets } from "../constants";
import { Brand } from "./Brand";

import { db } from "../screens/firebase-config";
import { AntDesign, Feather, FontAwesome, FontAwesome5, FontAwesome6, Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import FocusedStatusBar from "./FocusedStatusBar";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Drawer from "./Drawer";

import RBSheet from "react-native-raw-bottom-sheet";



const HomeHeader = ({ onSearch, display }) => {
  // const { username } = useSelector(state => state.userReducer);
  const navigation = useNavigation();
  const [username, setUsername] = useState();
  const currentDate = new Date().toJSON().slice(0, 10);
  const currentMonth = new Date().toJSON().slice(0, 7);
  const [dailytimeplayed, setDailyTimeplayed] = useState();
  const percentage = dailytimeplayed * 100 / 20;
  const custompathColor = `#89aae6`

  // const getUsername = async () => {
  //   try {
  //   } catch (error) {
  //     console.error('Error fetching username:', error);
  //     // Handle the error as needed
  //   }
  // };


  // useEffect(() => {
  //   getUsername();
  // }, []);

  const dispatch = useDispatch();
  // const handleProfilePress = () => {
  //   dispatch(setSidebar('flex'))

  //   // navigation.navigate('用戶'); 
  // };


  const refRBSheet = useRef();
  return (
    <SafeAreaView style={{ backgroundColor: COLORS.main, }}>
      <View style={{
        paddingTop: 15,
        paddingBottom: 15,
      }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignContent: 'center',
            alignItems: "center",
          }}
        >
          <Brand fontSize={25} />
          <TouchableOpacity onPress={() => refRBSheet.current.open()}
            style={{
              marginRight: 30,
              justifyContent: 'center',
              justifyItems: 'center',
              alignContent: 'center',
              alignItems: 'center',
            }}
          >
            <FontAwesome6
              name="user-gear"
              size={25}
              color={'black'}
              handlePress={() => refRBSheet.current.close()}
            // onPress={() => refRBSheet.current.close()}
            />
          </TouchableOpacity>
          <RBSheet
            ref={refRBSheet}
            height={Dimensions.get('window').height * 0.8}
            closeOnDragDown={false}  // 移除拖動關閉
            closeOnPressMask={false}  // 點擊遮罩不關閉
            customStyles={{
              wrapper: { backgroundColor: "transparent" },
              draggableIcon: { display: "none" }  // 隱藏預設的拖動 Icon
            }}
          >
            <Drawer onClose={() => refRBSheet.current?.close()} />
          </RBSheet>
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
