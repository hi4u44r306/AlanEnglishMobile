import { View, Text } from 'react-native'
import React from 'react'
import { FONTS } from '../constants'

export const Brand = ({ fontSize, margin }) => {
  return (
    <View style={{
      flexDirection: "row",
    }}>
      <Text
        style={{
          color: "red",
          textShadowColor: 'red',
          textShadowOffset: { width: 1, height: 0 },
          textShadowRadius: 0,
          margin: margin,
          fontSize: fontSize,
          fontWeight: 900,
          fontFamily: FONTS.VarelaRound,
        }}>A</Text>
      <Text style={{
        margin: margin,
        textShadowColor: '#f45d01',
        textShadowOffset: { width: 1, height: 0 },
        textShadowRadius: 0,
        color: "#f45d01",
        fontSize: fontSize,
        fontWeight: 900,
        fontFamily: FONTS.VarelaRound,
      }}>L</Text>
      <Text style={{
        margin: margin,
        textShadowColor: '#eeb902',
        textShadowOffset: { width: 1, height: 0 },
        textShadowRadius: 0,
        color: "#eeb902",
        fontSize: fontSize,
        fontWeight: 900,
        fontFamily: FONTS.VarelaRound,
      }}>A</Text>
      <Text style={{
        margin: margin,
        textShadowColor: '#04cc0b',
        textShadowOffset: { width: 1, height: 0 },
        textShadowRadius: 0,
        color: "#04cc0b",
        fontSize: fontSize,
        fontWeight: 900,
        fontFamily: FONTS.VarelaRound,
      }}>N</Text>
      <Text>  </Text>
      <Text style={{
        margin: margin,
        textShadowColor: '#2d7dd2',
        textShadowOffset: { width: 1, height: 0 },
        textShadowRadius: 0,
        color: "#2d7dd2",
        fontSize: fontSize,
        fontWeight: 900,
        fontFamily: FONTS.VarelaRound,
      }}>E</Text>
      <Text style={{
        margin: margin,
        textShadowColor: '#4062bb',
        textShadowOffset: { width: 1, height: 0 },
        textShadowRadius: 0,
        color: "#4062bb",
        fontSize: fontSize,
        fontWeight: 900,
        fontFamily: FONTS.VarelaRound,
      }}>N</Text>
      <Text style={{
        margin: margin,
        textShadowColor: '#52489c',
        textShadowOffset: { width: 1, height: 0 },
        textShadowRadius: 0,
        color: "#52489c",
        fontSize: fontSize,
        fontWeight: 900,
        fontFamily: FONTS.VarelaRound,
      }}>G</Text>
      <Text style={{
        margin: margin,
        textShadowColor: 'red',
        textShadowOffset: { width: 1, height: 0 },
        textShadowRadius: 0,
        color: "red",
        fontSize: fontSize,
        fontWeight: 900,
        fontFamily: FONTS.VarelaRound,
      }}>L</Text>
      <Text style={{
        margin: margin,
        textShadowColor: '#f45d01',
        textShadowOffset: { width: 1, height: 0 },
        textShadowRadius: 0,
        color: "#f45d01",
        fontSize: fontSize,
        fontWeight: 900,
        fontFamily: FONTS.VarelaRound,
      }}>I</Text>
      <Text style={{
        margin: margin,
        textShadowColor: '#eeb902',
        textShadowOffset: { width: 1, height: 0 },
        textShadowRadius: 0,
        color: "#eeb902",
        fontSize: fontSize,
        fontWeight: 900,
        fontFamily: FONTS.VarelaRound,
      }}>S</Text>
      <Text style={{
        margin: margin,
        textShadowColor: '#4062bb',
        textShadowOffset: { width: 1, height: 0 },
        textShadowRadius: 0,
        color: "#4062bb",
        fontSize: fontSize,
        fontWeight: 900,
        fontFamily: FONTS.VarelaRound,
      }}>H</Text>
    </View>

  )
}
