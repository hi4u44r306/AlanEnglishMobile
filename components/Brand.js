import React from 'react';
import { View, Text } from 'react-native';
import { FONTS } from '../constants';

const textStyle = (color, fontSize, margin) => ({
  margin,
  textShadowColor: color,
  textShadowOffset: { width: 1.5, height: 0 },
  textShadowRadius: 0,
  color,
  fontSize,
  fontWeight: 900,
  fontFamily: FONTS.VarelaRound,
});

export const Brand = ({ fontSize, margin }) => {
  return (
    <View style={{
      flexDirection: 'row',
      backgroundColor: 'white',
      paddingTop: 5,
      paddingBottom: 5,
      paddingLeft: 15,
      paddingRight: 15,
      borderRadius: 10
    }}>
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
