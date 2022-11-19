import React, { useState } from "react";
import { View, Text } from "react-native";

const Game = ({data}) => {
  return (
    <>
      <Text
        style={{width: "100%",}}>
         Game
         {data.page}
      </Text>
    </>
  );
};

export default Game;
