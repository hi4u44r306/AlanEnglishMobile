import { View, Text } from 'react-native'
import React from 'react'
import { COLORS } from '../constants'

const SubBrand = () => {
  return (
    <View>
      <Text style=
      {{
        fontSize: '18px',
        fontFamily: "Varela Round , sans-serif",
        fontWeight:900,
        color: COLORS.inputfieldgreen,
        paddingBottom: "20px",
      }}>
      系統化 | 口語化 | 聽力導向 
      </Text>
    </View>
  )
}

export default SubBrand