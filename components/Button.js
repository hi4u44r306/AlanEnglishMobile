import React from "react";
import { TouchableOpacity, Text, Image } from "react-native";

import { COLORS, SIZES, FONTS, SHADOWS } from "../constants";

export const CircleButton = ({ imgUrl, handlePress, ...props }) => {
  return (
    <TouchableOpacity
      style={{
        width: 40,
        height: 40,
        backgroundColor: COLORS.white,
        position: "absolute",
        borderRadius: SIZES.extraLarge,
        alignItems: "center",
        justifyContent: "center",
        ...SHADOWS.light,
        ...props,
      }}
      onPress={handlePress}
    >
      <Image
        source={imgUrl}
        resizeMode="contain"
        style={{ width: 24, height: 24 }}
      />
    </TouchableOpacity>
  );
};

export const RectButton = ({ minWidth, fontSize, handlePress, ...props }) => {
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
        Show More...
      </Text>
    </TouchableOpacity>
  );
};

export const LoginButton = ({ minWidth, fontSize, handlePress, margin, ...props }) => {
  return (
    <TouchableOpacity
      style={{
        backgroundColor: COLORS.white,
        padding: SIZES.small,
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
          fontFamily: "Varela Round",
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
