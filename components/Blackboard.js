import { View, Text } from 'react-native'
import React from 'react'
import { FONTS } from '../constants'

const Blackboard = () => {
  return (
    <View style={{
        backgroundColor:"#2e9421",
        borderColor: "#ffbf3f",
        borderWidth: 5,
        borderRadius:10,
        width: "90%",
        padding: 10,
        margin: 20,
    }}>
      <Text style={{color:"#ffffff", fontSize:"12px", fontFamily: FONTS.VarelaRound, fontWeight:700,margin: 10,}}>步驟一：能聽清楚句子中每個單字,並瞭解中文句意。</Text>
      <Text style={{color:"#ffffff", fontSize:"12px", fontFamily: FONTS.VarelaRound, fontWeight:700,margin: 10,}}>步驟二：聽問句與提示後,能馬上完整地回答！回答速度可以比MP3更快！</Text>
      <Text style={{color:"#ffffff", fontSize:"12px", fontFamily: FONTS.VarelaRound, fontWeight:700,margin: 10,}}>步驟三：只唸幾次所強記的單字忘得快!!!!所以，依學生個別的專注能力，前兩個步驟需要 20～80 次反覆地聽讀跟唸,才能有效地背誦並牢記單字！</Text>
    </View>
  )
}

export default Blackboard