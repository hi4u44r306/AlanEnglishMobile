import { View, Text } from 'react-native'
import React from 'react'
import { COLORS, FONTS } from '../constants'

const SubBrand = () => {
  return (
    <View>
      <Text style=
        {{
          fontSize: '17px',
          fontFamily: FONTS.VarelaRound,
          fontWeight: 900,
          color: COLORS.inputfieldgreen,
          padding: 10,
        }}>
        系統化  |  口語化  |  聽力導向
      </Text>
    </View>
  )
}

export default SubBrand