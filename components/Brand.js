import React from 'react';
import { View, Text, Image } from 'react-native';
import { FONTS } from '../constants';

const textStyle = (color, fontSize, margin) => ({
  margin: 0,
  textShadowColor: color,
  textShadowOffset: { width: 0.6, height: 0 },
  textShadowRadius: 0,
  color,
  fontSize,
  fontFamily: FONTS.mainFont,
  // fontWeight: '900',
  letterSpacing: 1.2,
});

export const Brand = ({ fontSize, margin }) => {
  return (
    <View style={{
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingLeft: 15,
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
