import { View, Text } from 'react-native'
import React from 'react'

const Blackboard = () => {
  return (
    <View style={{
        backgroundColor:"#2e9421",
        borderColor: "#ffbf3f",
        borderWidth: 10,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        borderBottomRightRadius: 10,
        borderBottomLeftRadius: 10,
        width: "90%",
        paddingTop: "20px",
        paddingBottom: "20px",
        paddingLeft: "20px",
        paddingRight: "20px",
        gap:"15px",
    }}>
      <Text style={{color:"#ffffff", fontSize:"12px", fontFamily: "Varela Round", fontWeight:"600"}}>步驟一：能聽清楚句子中每個單字,並瞭解中文句意。</Text>
      <Text style={{color:"#ffffff", fontSize:"12px", fontFamily: "Varela Round", fontWeight:"600"}}>步驟二：聽問句與提示後,能馬上完整地回答！回答速度可以比MP3更快！</Text>
      <Text style={{color:"#ffffff", fontSize:"12px", fontFamily: "Varela Round", fontWeight:"600"}}>步驟三：只唸幾次所強記的單字忘得快!!!!所以，依學生個別的專注能力，前兩個步驟需要 20～80 次反覆地聽讀跟唸,才能有效地背誦並牢記單字！</Text>
    </View>
  )
}

export default Blackboard