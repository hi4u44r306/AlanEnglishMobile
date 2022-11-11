import React from "react";
import { View, Text, Image, TextInput } from "react-native";

import { COLORS, FONTS, SIZES, assets } from "../constants";

const HomeHeader = ({ onSearch }) => {
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
          alignItems: "center",
        }}
      >
        <View style={{
          flexDirection:"row",
          // backgroundColor: COLORS.white,
          padding:"10px",
          borderRadius:"20px"          
        }}>
          <Text 
            style={{
            color:"red",
            fontSize: "30px",
            fontWeight:"900",
            fontFamily: "Varela Round",}}>A</Text>
          <Text style={{
            color:"#f45d01",
            fontSize: "30px",
            fontWeight:"900",
            fontFamily: "Varela Round",}}>L</Text>
          <Text style={{
            color:"#eeb902",
            fontSize: "30px",
            fontWeight:"900",
            fontFamily: "Varela Round",}}>A</Text>
          <Text style={{
            color:"#04cc0b",
            fontSize: "30px",
            fontWeight:"900",
            fontFamily: "Varela Round",}}>N</Text>
          <Text></Text>
          <Text style={{
            color:"#2d7dd2",
            fontSize: "30px",
            fontWeight:"900",
            fontFamily: "Varela Round",}}>E</Text>
          <Text style={{
            color:"#4062bb",
            fontSize: "30px",
            fontWeight:"900",
            fontFamily: "Varela Round",}}>N</Text>
          <Text style={{
            color:"#52489c",
            fontSize: "30px",
            fontWeight:"900",
            fontFamily: "Varela Round",}}>G</Text>
          <Text style={{
            color:"red",
            fontSize: "30px",
            fontWeight:"900",
            fontFamily: "Varela Round",}}>L</Text>
          <Text style={{
            color:"#f45d01",
            fontSize: "30px",
            fontWeight:"900",
            fontFamily: "Varela Round",}}>I</Text>
          <Text style={{
            color:"#eeb902",
            fontSize: "30px",
            fontWeight:"900",
            fontFamily: "Varela Round",}}>S</Text>
          <Text style={{
            color:"#4062bb",
            fontSize: "30px",
            fontWeight:"900",
            fontFamily: "Varela Round",}}>H</Text>
        </View>

        <View style={{ width: 45, height: 45 }}>
          <Image
            source={assets.person01}
            resizeMode="contain"
            style={{ width: "100%", height: "100%" }}
          />
          <Image
            source={assets.badge}
            resizeMode="contain"
            style={{
              position: "absolute",
              width: 15,
              height: 15,
              bottom: 0,
              right: 0,
            }}
          />
        </View>
      </View>

      <View style={{ marginVertical: SIZES.font }}>
        <Text
          style={{
            fontFamily: FONTS.regular,
            fontSize: SIZES.small,
            color: COLORS.primary,
          }}
        >
          Hello Victoria 👋
        </Text>

        <Text
          style={{
            fontFamily: FONTS.bold,
            fontSize: SIZES.large,
            color: COLORS.primary,
            marginTop: SIZES.base / 2,
          }}
        >
          Let's learn English
        </Text>
      </View>

      <View style={{ marginTop: SIZES.font }}>
        <View
          style={{
            width: "100%",
            borderRadius: SIZES.font,
            backgroundColor: COLORS.primary,
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: SIZES.font,
            paddingVertical: SIZES.small - 2,
          }}
        >
          <Image
            source={assets.search}
            resizeMode="contain"
            style={{ width: 20, height: 20, marginRight: SIZES.base }}
          />
          <TextInput
            placeholder="Search Tracks........"
            style={{ flex: 1 , color: COLORS.white}}
            onChangeText={onSearch}
          />
        </View>
      </View>
    </View>
  );
};

export default HomeHeader;
