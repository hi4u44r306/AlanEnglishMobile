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
          fontWeight:900,
          fontFamily:'Arial',}}>A</Text>
        <Text style={{
          margin:margin,
          color:"#f45d01",
          fontSize: fontSize,
          fontWeight:900,
          fontFamily:'Arial',}}>L</Text>
        <Text style={{
          margin:margin,
          color:"#eeb902",
          fontSize: fontSize,
          fontWeight:900,
          fontFamily:'Arial',}}>A</Text>
        <Text style={{
          margin:margin,
          color:"#04cc0b",
          fontSize: fontSize,
          fontWeight:900,
          fontFamily:'Arial',}}>N</Text>
        <Text>  </Text>
        <Text style={{
          margin:margin,
          color:"#2d7dd2",
          fontSize: fontSize,
          fontWeight:900,
          fontFamily:'Arial',}}>E</Text>
        <Text style={{
          margin:margin,
          color:"#4062bb",
          fontSize: fontSize,
          fontWeight:900,
          fontFamily:'Arial',}}>N</Text>
        <Text style={{
          margin:margin,
          color:"#52489c",
          fontSize: fontSize,
          fontWeight:900,
          fontFamily:'Arial',}}>G</Text>
        <Text style={{
          margin:margin,
          color:"red",
          fontSize: fontSize,
          fontWeight:900,
          fontFamily:'Arial',}}>L</Text>
        <Text style={{
          margin:margin,
          color:"#f45d01",
          fontSize: fontSize,
          fontWeight:900,
          fontFamily:'Arial',}}>I</Text>
        <Text style={{
          margin:margin,
          color:"#eeb902",
          fontSize: fontSize,
          fontWeight:900,
          fontFamily:'Arial',}}>S</Text>
        <Text style={{
          margin:margin,
          color:"#4062bb",
          fontSize: fontSize,
          fontWeight:900,
          fontFamily:'Arial',}}>H</Text>
      </View>

  )
}
