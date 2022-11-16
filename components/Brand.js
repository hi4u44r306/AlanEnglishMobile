import { View, Text } from 'react-native'
import React from 'react'
import { FONTS } from '../constants'

export const Brand = ({fontSize, margin}) => {
  return (
    <View style={{
        flexDirection:"row",
      }}>
        <Text 
          style={{
          margin:margin,
          color:"red",
          fontSize: fontSize,
          fontFamily: FONTS.bold,}}>A</Text>
        <Text style={{
          margin:margin,
          color:"#f45d01",
          fontSize: fontSize,
          fontFamily: FONTS.bold,}}>L</Text>
        <Text style={{
          margin:margin,
          color:"#eeb902",
          fontSize: fontSize,
          fontFamily: FONTS.bold,}}>A</Text>
        <Text style={{
          margin:margin,
          color:"#04cc0b",
          fontSize: fontSize,
          fontFamily: FONTS.bold,}}>N</Text>
        <Text>  </Text>
        <Text style={{
          margin:margin,
          color:"#2d7dd2",
          fontSize: fontSize,
          fontFamily: FONTS.bold,}}>E</Text>
        <Text style={{
          margin:margin,
          color:"#4062bb",
          fontSize: fontSize,
          fontFamily: FONTS.bold,}}>N</Text>
        <Text style={{
          margin:margin,
          color:"#52489c",
          fontSize: fontSize,
          fontFamily: FONTS.bold,}}>G</Text>
        <Text style={{
          margin:margin,
          color:"red",
          fontSize: fontSize,
          fontFamily: FONTS.bold,}}>L</Text>
        <Text style={{
          margin:margin,
          color:"#f45d01",
          fontSize: fontSize,
          fontFamily: FONTS.bold,}}>I</Text>
        <Text style={{
          margin:margin,
          color:"#eeb902",
          fontSize: fontSize,
          fontFamily: FONTS.bold,}}>S</Text>
        <Text style={{
          margin:margin,
          color:"#4062bb",
          fontSize: fontSize,
          fontFamily: FONTS.bold,}}>H</Text>
      </View>

  )
}
