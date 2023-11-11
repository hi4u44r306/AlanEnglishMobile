// import { View, Text } from 'react-native'
// import React from "react";
// import { COLORS } from '../constants';


// const FooterMusicPlayer = ({ display, data }) => {
//   return (
//     <View style={{ display: display }}>
//       <Text style={{ fontSize: 50, display: 'flex', justifyContent: 'center', backgroundColor: COLORS.ricewhite }}>{data.page}</Text>
//     </View>
//   )
// }

// export default FooterMusicPlayer

import { View, Text } from 'react-native';
import React from "react";
import { COLORS } from '../constants';

const FooterMusicPlayer = ({ display, data }) => {
  return (
    <View style={{ display: display }}>
      {data && (
        <Text style={{ fontSize: 50, justifyContent: 'center', backgroundColor: COLORS.ricewhite }}>
          {data.page}
        </Text>
      )}
    </View>
  );
};

export default FooterMusicPlayer;
