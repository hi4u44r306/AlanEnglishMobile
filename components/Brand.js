import React from 'react';
import { View, Text, Image } from 'react-native';
import { FONTS } from '../constants';

const textStyle = (color, fontSize, margin) => ({
  margin,
  color,
  fontSize,
  fontFamily: FONTS.mainFont,
  letterSpacing: 1.2,
  // 原本的 textShadowColor, textShadowOffset, textShadowRadius 改成:
  textShadow: `0.6px 0px 0 ${color}`, // 或者您想要的其他值
});

export const Brand = ({ fontSize, margin }) => {
  return (
    <View style={{
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingLeft: 15,
      gap: 1,
    }}>
      {/* <Image source={require('../assets/A-logo.png')} style={{
        width: 35,
        height: 35,
        marginRight: 3,
      }} /> */}
      {/* <Text style={textStyle('black', 25, margin)}>English</Text> */}
      <Text style={textStyle('red', fontSize, margin)}>A</Text>
      <Text style={textStyle('#f45d01', fontSize, margin)}>L</Text>
      <Text style={textStyle('#eeb902', fontSize, margin)}>A</Text>
      <Text style={textStyle('#04cc0b', fontSize, margin)}>N</Text>
      <Text>  </Text>
      <Text style={textStyle('#2d7dd2', fontSize, margin)}>E</Text>
      <Text style={textStyle('#4062bb', fontSize, margin)}>N</Text>
      <Text style={textStyle('#52489c', fontSize, margin)}>G</Text>
      <Text style={textStyle('red', fontSize, margin)}>L</Text>
      <Text style={textStyle('#f45d01', fontSize, margin)}>I</Text>
      <Text style={textStyle('#eeb902', fontSize, margin)}>S</Text>
      <Text style={textStyle('#4062bb', fontSize, margin)}>H</Text>
    </View>
  );
};
