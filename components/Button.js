import React from "react";
import { TouchableOpacity, Text, Image, View } from "react-native";

import { COLORS, SIZES, FONTS, SHADOWS } from "../constants";
import Ionicons from '@expo/vector-icons/Ionicons';

export const CircleButton = ({ imgUrl, handlePress, ...props }) => {
  return (
    <TouchableOpacity
      style={{
        marginTop: 5,
        display: 'flex',
        flexDirection: 'row',
        width: "auto",
        height: 30,
        position: "absolute",
        alignItems: "center",
        justifyContent: "center",
        justifyContentAlign: "center",
        ...SHADOWS.light,
        ...props,
      }}
      onPress={handlePress}
    >
      <Image
        source={imgUrl}
        resizeMode="contain"
        style={{ width: 24, height: 23 }}
      />
      <Text style={{ fontSize: 15 }}>
        回播放列表
      </Text>
    </TouchableOpacity>
  );
};

export const PlayButton = ({ minWidth, fontSize, handlePress, ...props }) => {
  return (
    <TouchableOpacity
      style={{
        // backgroundColor: '#759fbc',
        padding: SIZES.small,
        borderRadius: SIZES.extraLarge,
        minWidth: minWidth,
        ...props,
      }}
      onPress={handlePress}
    >
      <Text
        style={{
          fontFamily: FONTS.semiBold,
          fontSize: fontSize,
          color: COLORS.white,
          textAlign: "center",
        }}
      >
        <Ionicons name="ios-play-circle" style={{ fontSize: 35, fontWeight: 600, color: 'red', }} />
      </Text>
    </TouchableOpacity>
  );
};
export const GameButton = ({ minWidth, fontSize, handlePress, ...props }) => {
  return (
    <TouchableOpacity
      style={{
        backgroundColor: '#759fbc',
        padding: SIZES.small,
        borderRadius: SIZES.extraLarge,
        minWidth: minWidth,
        ...props,
      }}
      onPress={handlePress}
    >
      <Text
        style={{
          fontFamily: FONTS.semiBold,
          fontSize: fontSize,
          color: COLORS.white,
          textAlign: "center",
        }}
      >
        小測驗
      </Text>
    </TouchableOpacity>
  );
};

export const LoginButton = ({ minWidth, padding, fontSize, handlePress, margin, ...props }) => {
  return (
    <TouchableOpacity
      style={{
        backgroundColor: COLORS.white,
        padding: padding,
        borderWidth: 3.5,
        borderColor: "#2d7dd2",
        borderRadius: 10,
        minWidth: minWidth,
        margin: margin,
        ...props,
      }}
      onPress={handlePress}
    >
      <Text
        style={{
          fontFamily: FONTS.VarelaRound,
          fontSize: fontSize,
          fontWeight: 900,
          color: COLORS.primary,
          textAlign: "center",
        }}
      >
        登 入
      </Text>
    </TouchableOpacity>
  );
};

export const LogoutButton = ({ minWidth, fontSize, handlePress, ...props }) => {
  return (
    <TouchableOpacity
      style={{
        backgroundColor: COLORS.primary,
        padding: SIZES.small,
        borderRadius: SIZES.extraLarge,
        minWidth: minWidth,
        ...props,
      }}
      onPress={handlePress}
    >
      <Text
        style={{
          fontFamily: FONTS.semiBold,
          fontSize: fontSize,
          color: COLORS.white,
          textAlign: "center",
        }}
      >
        Logout
      </Text>
    </TouchableOpacity>
  );
};

export const HomeButton = ({ minWidth, fontSize, handlePress, ...props }) => {
  return (
    <TouchableOpacity
      style={{
        alignItems: 'center',
        backgroundColor: COLORS.white,
        padding: SIZES.small,
        borderRadius: SIZES.extraLarge,
        minWidth: minWidth,
        ...props,
      }}
      onPress={handlePress}
    >
      <Ionicons name="home" size={25} color="green" />
      <Text
        style={{
          fontFamily: FONTS.semiBold,
          fontSize: fontSize,
          color: COLORS.primary,
          textAlign: "center",
        }}
      >
        Home
      </Text>
    </TouchableOpacity>
  );
};
export const LeaderBoardButton = ({ minWidth, fontSize, handlePress, ...props }) => {
  return (
    <TouchableOpacity
      style={{
        alignItems: 'center',
        backgroundColor: COLORS.white,
        padding: SIZES.small,
        borderRadius: SIZES.extraLarge,
        minWidth: minWidth,
        ...props,
      }}
      onPress={handlePress}
    >
      <Ionicons name="medal" size={25} color="red"></Ionicons>
      <Text
        style={{
          fontFamily: FONTS.VarelaRound,
          fontWeight: 900,
          fontSize: fontSize,
          color: COLORS.primary,
          textAlign: "center",
        }}
      >
        LeaderBoard
      </Text>
    </TouchableOpacity>
  );
};
export const MusicButton = ({ minWidth, fontSize, handlePress, ...props }) => {
  return (
    <TouchableOpacity
      style={{
        alignItems: 'center',
        backgroundColor: COLORS.white,
        padding: SIZES.small,
        borderRadius: SIZES.extraLarge,
        minWidth: minWidth,
        ...props,
      }}
      onPress={handlePress}
    >
      <Ionicons name="musical-notes" size={25} color="green" />
      <Text
        style={{
          fontFamily: FONTS.VarelaRound,
          fontSize: fontSize,
          fontWeight: 900,
          color: COLORS.primary,
          textAlign: "center",
        }}
      >
        Listening
      </Text>
    </TouchableOpacity>
  );
};
export const ProfileButton = ({ minWidth, fontSize, handlePress, ...props }) => {
  return (
    <TouchableOpacity
      style={{
        alignItems: 'center',
        backgroundColor: COLORS.white,
        padding: SIZES.small,
        minWidth: minWidth,
        ...props,
      }}
      onPress={handlePress}
    >
      <Ionicons name="person-circle" size={25} color="blue" />
      <Text
        style={{
          fontFamily: FONTS.VarelaRound,
          fontSize: fontSize,
          fontWeight: 900,
          color: COLORS.primary,
          textAlign: "center",
        }}
      >
        Account
      </Text>
    </TouchableOpacity>
  );
};


