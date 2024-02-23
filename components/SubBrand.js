import { View, Text } from 'react-native'
import React from 'react'
import { COLORS, FONTS } from '../constants'

const SubBrand = ({ fontSize }) => {
  return (
    <View>
      <Text style=
        {{
          fontSize: fontSize,
          fontFamily: FONTS.mainFont,
          fontWeight: 900,
          color: COLORS.inputfieldgreen,
        }}>
        系統化  |  口語化  |  聽力導向
      </Text>
    </View>
  )
}

export default SubBrand