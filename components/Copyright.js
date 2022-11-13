import { View, Text } from 'react-native'
import React from 'react'
import { FONTS } from '../constants'

const Copyright = () => {
  return (
    <View>
      <Text style={{color:"red", fontFamily: FONTS.VarelaRound, fontWeight:"900", margin:10}}>Copyright © 2022 Alan English Inc.</Text>
    </View>
  )
}

export default Copyright