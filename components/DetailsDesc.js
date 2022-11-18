import React, { useState } from "react";
import { View, Text } from "react-native";

import { Timeplayed, MusicTitle } from "./SubInfo";
import { COLORS, SIZES, FONTS } from "../constants";

const DetailsDesc = ({ data }) => {
  // const [text, setText] = useState(data.description.slice(0, 100));
  // const [readMore, setReadMore] = useState(false);

  return (
    <>
      <View
        style={{
          width: "100%",
          flexDirection: "column",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text>Music Section</Text>
        <MusicTitle
          title={data.bookname}
          subTitle={data.page}
          titleSize={SIZES.extraLarge}
          subTitleSize={SIZES.font}
        />

        <Timeplayed price={data.timesPlayed} />
      </View>

      <View style={{ marginVertical: SIZES.extraLarge * 1.5 }}>
        <Text
          style={{
            fontSize: SIZES.font,
            fontFamily: FONTS.semiBold,
            color: COLORS.primary,
          }}
        >
          Game Section
        </Text>
      </View>
    </>
  );
};

export default DetailsDesc;
