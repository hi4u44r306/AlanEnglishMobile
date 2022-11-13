import { View, Text } from 'react-native'
import React from 'react'
import { FONTS } from '../constants'

export const Brand = () => {
  return (
    <View style={{
        flexDirection:"row",
        padding:10,
      }}>
        <Text 
          style={{
          margin:2,
          color:"red",
          fontSize: "35px",
          fontWeight:"900",
          textShadowColor: "red",
          textShadowOffset: {width: 1, height: 0},
          textShadowRadius: 0,
          fontFamily: FONTS.VarelaRound,}}>A</Text>
        <Text style={{
          margin:2,
          color:"#f45d01",
          fontSize: "35px",
          fontWeight:"900",
          textShadowColor: "#f45d01",
          textShadowOffset: {width: 1, height: 0},
          textShadowRadius: 0,
          fontFamily: FONTS.VarelaRound,}}>L</Text>
        <Text style={{
          margin:2,
          color:"#eeb902",
          fontSize: "35px",
          fontWeight:"900",
          textShadowColor: "#eeb902",
          textShadowOffset: {width: 1, height: 0},
          textShadowRadius: 0,
          fontFamily: FONTS.VarelaRound,}}>A</Text>
        <Text style={{
          margin:2,
          color:"#04cc0b",
          fontSize: "35px",
          fontWeight:"900",
          textShadowColor: "#04cc0b",
          textShadowOffset: {width: 1, height: 0},
          textShadowRadius: 0,
          fontFamily: FONTS.VarelaRound,}}>N</Text>
        <Text>  </Text>
        <Text style={{
          margin:2,
          color:"#2d7dd2",
          fontSize: "35px",
          fontWeight:"900",
          textShadowColor: "#2d7dd2",
          textShadowOffset: {width: 1, height: 0},
          textShadowRadius: 0,
          fontFamily: FONTS.VarelaRound,}}>E</Text>
        <Text style={{
          margin:2,
          color:"#4062bb",
          fontSize: "35px",
          fontWeight:"900",
          textShadowColor: "#4062bb",
          textShadowOffset: {width: 1, height: 0},
          textShadowRadius: 0,
          fontFamily: FONTS.VarelaRound,}}>N</Text>
        <Text style={{
          margin:2,
          color:"#52489c",
          fontSize: "35px",
          fontWeight:"900",
          textShadowColor: "#52489c",
          textShadowOffset: {width: 1, height: 0},
          textShadowRadius: 0,
          fontFamily: FONTS.VarelaRound,}}>G</Text>
        <Text style={{
          margin:2,
          color:"red",
          fontSize: "35px",
          fontWeight:"900",
          textShadowColor: "red",
          textShadowOffset: {width: 1, height: 0},
          textShadowRadius: 0,
          fontFamily: FONTS.VarelaRound,}}>L</Text>
        <Text style={{
          margin:2,
          color:"#f45d01",
          fontSize: "35px",
          fontWeight:"900",
          textShadowColor: "#f45d01",
          textShadowOffset: {width: 1, height: 0},
          textShadowRadius: 0,
          fontFamily: FONTS.VarelaRound,}}>I</Text>
        <Text style={{
          margin:2,
          color:"#eeb902",
          fontSize: "35px",
          fontWeight:"900",
          textShadowColor: "#eeb902",
          textShadowOffset: {width: 1, height: 0},
          textShadowRadius: 0,
          fontFamily: FONTS.VarelaRound,}}>S</Text>
        <Text style={{
          margin:2,
          color:"#4062bb",
          fontSize: "35px",
          fontWeight:"900",
          textShadowColor: "#4062bb",
          textShadowOffset: {width: 1, height: 0},
          textShadowRadius: 0,
          fontFamily: FONTS.VarelaRound,}}>H</Text>
      </View>

  )
}
