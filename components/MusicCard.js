import React from "react";
import { useNavigation } from "@react-navigation/native";
import { View } from "react-native";

import { COLORS, SIZES, SHADOWS } from "../constants";
import { Timeplayed, MusicTitle } from "./SubInfo";
import { RectButton } from "./Button";

const MusicCard = ({ data }) => {

  const navigation = useNavigation();

  return (
    <View
      style={{
        backgroundColor: COLORS.white,
        borderRadius: SIZES.font,
        marginBottom: SIZES.extraLarge,
        margin: SIZES.base,
        ...SHADOWS.dark,
      }}
    >

      <View style={{ width: "100%", padding: SIZES.font, justifyContent:'center', alignContent:'center' }}>
        <MusicTitle
          title={data.bookname}
          subTitle={data.page}
          titleSize={SIZES.large}
          subTitleSize={SIZES.small}
        />

        <View
          style={{
            marginTop: SIZES.font,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            alignContent:'center',
          }}
        >
          <Timeplayed price={data.timesPlayed} />
          <RectButton
            minWidth={10}
            fontSize={SIZES.font}
            handlePress={() => navigation.navigate("Details", { data })}
          />
        </View>
      </View>
    </View>
  );
};

export default MusicCard;
