import { View, Text } from 'react-native'
import React from 'react'
import { COLORS, SIZES } from '../constants'

import { HomeButton,LeaderBoardButton,MusicButton,ProfileButton } from "../components";
import { useNavigation } from "@react-navigation/native";

const Navigationbar = () => {
  const navigation = useNavigation();
  return (
    <View style={{
        backgroundColor:COLORS.ricewhite,
        position: 'sticky',
        bottom: 0,
        padding: 20,
        }}>
        <View style={{flexDirection:'row',justifyContent:'space-evenly'}}>
            <HomeButton
              minWidth={80}
              fontSize={SIZES.font}
              handlePress={navigation.navigate("Home")}
            />
            <LeaderBoardButton
              minWidth={80}
              fontSize={SIZES.font}
              handlePress={navigation.navigate("Leaderboard")}
            />
            <MusicButton
              minWidth={80}
              fontSize={SIZES.font}
              handlePress={navigation.navigate("Music")}
            />
            <ProfileButton
              minWidth={80}
              fontSize={SIZES.font}
              handlePress={navigation.navigate("Profile")}
            />
        </View>
    </View>
  )
}

export default Navigationbar





// import { createStackNavigator } from "@react-navigation/stack"
// import { NavigationContainer, DefaultTheme } from "@react-navigation/native"
// import { useFonts } from "expo-font"

// import Home from "../screens/Home";
// import Details from "../screens/Home";
// import Login from "../screens/Home";
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import Ionicons from '@expo/vector-icons/Ionicons';

// // const Stack = createStackNavigator();
// const Tab = createBottomTabNavigator();
// const theme = {
//   ...DefaultTheme,
//   colors:{
//     ...DefaultTheme.colors,
//     background: "transparent",
//   }
// }
// const homeName = 'Home';
// const detailName = 'Details';
// const loginName = 'Login';

// const App = () => {
//   const [loaded] = useFonts({
//     InterBold: require("../assets/fonts/Inter-Bold.ttf"),
//     InterSemiBold: require("../assets/fonts/Inter-SemiBold.ttf"),
//     InterMedium: require("../assets/fonts/Inter-Medium.ttf"),
//     InterRegular: require("../assets/fonts/Inter-Regular.ttf"),
//     InterLight: require("../assets/fonts/Inter-Light.ttf"),
//     VarelaRound: require("../assets/fonts/VarelaRound-Regular.ttf"),
//   })
//   if (!loaded) return null;
//   return (
//     <NavigationContainer theme={theme}>
//       <Tab.Navigator 
//         initialRouteName="Login"
//         screenOptions={({route})=>({
//           tabBarOptions:({focused, color, size})=>{
//             let iconName;
//             let rn = route.name;

//             if(rn === homeName){
//               iconName = focused ? 'home' : 'home-outline';
//             }else if (rn === detailName){
//               iconName = focused ? 'list' : 'list-outline';
//             }else if (rn === loginName){
//               iconName = focused ? 'setting' : 'setting-outline';
//             }

//             return <Ionicons name={iconName} size={size} color={color} />
//           } 
//         })} 
//       >
        
//         <Tab.Screen name="Login" component={Login}/>
//         <Tab.Screen name="Home" component={Home}/>
//         <Tab.Screen name="Details" component={Details}/>
//       </Tab.Navigator>
//     </NavigationContainer>
//   );
// }
// export default App;

