import { AntDesign, Ionicons } from "@expo/vector-icons";
import React from "react";
import { View, Image, Text } from "react-native";

import { SIZES, FONTS, COLORS, SHADOWS, assets } from "../constants";

export const MusicTitle = ({ title, subTitle, musicplay, complete }) => {
  return (
    <View style={{ flexDirection: "row", justifyContent: 'center', alignItems: 'center' }}>
      <Image source={require('../assets/img/headphone.png')} style={{
        width: 50,
        height: 50,
        marginRight: 18,
      }} />
      <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'start', gap: 10 }}>
        {/* BookName */}
        <Text
          style={{
            fontWeight: 'bold',
            fontSize: SIZES.medium,
            color: COLORS.primary,
          }}
        >
          {title}
        </Text>
        {/* <Text>-</Text> */}

        {/* Page */}
        <View
          style={{
            // fontFamily: FONTS.bold,
            fontSize: SIZES.font,
            color: COLORS.primary,
            gap: 10,
            flexDirection: 'row',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Text>
            {subTitle}
          </Text>
          <Text>
            播放次數 : {musicplay || 0} 次
          </Text>
          <Text>通過 :</Text>
          <Text>
            {
              complete === '通過'
                ?
                <AntDesign name={"checkcircle"} style={{
                  display: 'flex',
                  color: '#8bc34a',
                  fontWeight: '700',
                  fontSize: 16,
                  textAlign: 'center',
                  justifyContent: 'space-around',
                }} />
                :
                <Text>-</Text>
            }
          </Text>
        </View>
      </View>
      {/* <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 10 }}>
        <Text>播放次數 : {musicplay || 0} 次</Text>
        <Text>通過 :</Text>
      </View> */}
    </View>
  );
};

export const GameScore = ({ gamescore }) => {
  return (

    <Text style={{
      flexDirection: "row",
      // justifyContent: "space-between",
      alignItems: "center",
      alignContent: 'center',
    }}>
      <Text style={{ marginLeft: 10, }}>
        {gamescore}
      </Text>
    </Text>

  );
};
export const Timeplayed = ({ timeplayed }) => {
  return (

    <Text style={{
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      alignContent: 'center',
    }}>
      <Ionicons name="musical-notes-outline" resizeMode="contain" style={{ marginRight: 5, color: 'red', fontSize: 15 }} />播放次數
      <Text style={{ marginLeft: 10, fontWeight: 600, color: 'red' }}>
        {timeplayed}
      </Text>
    </Text>

  );
};

const ImageCmp = ({ imgUrl, index }) => {
  return (
    <Image
      source={imgUrl}
      resizeMode="contain"
      style={{
        width: 48,
        height: 48,
        marginLeft: index === 0 ? 0 : -SIZES.font,
      }}
    />
  );
};

export const People = () => {
  return (
    <View style={{ flexDirection: "row" }}>
      {[assets.person02, assets.person03, assets.person04].map(
        (imgUrl, index) => (
          <ImageCmp imgUrl={imgUrl} index={index} key={`People-${index}`} />
        )
      )}
    </View>
  );
};

export const EndDate = () => {
  return (
    <View
      style={{
        paddingHorizontal: SIZES.font,
        paddingVertical: SIZES.base,
        backgroundColor: COLORS.white,
        borderRadius: SIZES.font,
        justifyContent: "center",
        alignItems: "center",
        ...SHADOWS.light,
        elevation: 1,
        maxWidth: "50%",
      }}
    >
      <Text
        style={{
          fontFamily: FONTS.regular,
          fontSize: SIZES.small,
          color: COLORS.primary,
        }}
      >
        Ending in
      </Text>
      <Text
        style={{
          fontFamily: FONTS.semiBold,
          fontSize: SIZES.medium,
          color: COLORS.primary,
        }}
      >
        12h 30m
      </Text>
    </View>
  );
};

export const SubInfo = () => {
  return (
    <View
      style={{
        width: "100%",
        paddingHorizontal: SIZES.font,
        marginTop: -SIZES.extraLarge,
        flexDirection: "row",
        justifyContent: "space-between",
      }}
    >
      <People />
      <EndDate />
    </View>
  );
};
