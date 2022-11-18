import { createStackNavigator } from "@react-navigation/stack"
import { NavigationContainer, DefaultTheme } from "@react-navigation/native"
// import { useFonts } from "expo-font"
import Ionicons from '@expo/vector-icons/Ionicons';


import Home from "./screens/Home";
import Login from "./screens/Login";
import Profile from "./screens/Profile";
import Music from "./screens/Music";
import Leaderboard from './screens/Leaderboard';
import Details from './screens/Details';

const Stack = createStackNavigator();
const theme = {
  ...DefaultTheme,
  colors:{
    ...DefaultTheme.colors,
    background: "transparent",
  }
}
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FONTS } from "./constants";

const Tab = createBottomTabNavigator();

const homepage = 'Home';
const musicpage = 'Music';
const profilepage = 'Profile';
const leaderboardpage = 'Rank';
function Root(){
  return (
    <Tab.Navigator 
      initialRouteName="Profile"
      screenOptions={({route})=>({
      headerShown:false,
        tabBarIcon : ({focused, color})=>{
          let iconName;
          let rn = route.name;

          if (rn === homepage){
            iconName = focused ? 'home' : 'home-outline';
          }else if (rn === musicpage){
            iconName = focused ? 'musical-notes' : 'musical-notes-outline';
          }else if (rn === profilepage){
            iconName = focused ? 'person-circle' : 'person-circle-outline';
          }else if (rn === leaderboardpage){
            iconName = focused ? 'medal' : 'medal-outline';
          }
          return <Ionicons name={iconName} size={30} color={color} style={{margin:20}}/>
          
        },
        tabBarStyle:{ paddingBottom:30, height:90},
        tabBarLabelStyle:{fontWeight: 600, fontFamily: 'Arial', fontSize:15},
        tabBarActiveTintColor:'#ff3c38',
        tabBarInactiveTintColor:'grey'
      })} 
    >
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Rank" component={Leaderboard} />
      <Tab.Screen name="Music" component={Music} />
      <Tab.Screen name="Profile" component={Profile}/>
    </Tab.Navigator>
  );
}

const App = () => {
  // const [loaded] = useFonts({
  //   InterBold: require("./assets/fonts/Inter-Bold.ttf"),
  //   InterSemiBold: require("./assets/fonts/Inter-SemiBold.ttf"),
  //   InterMedium: require("./assets/fonts/Inter-Medium.ttf"),
  //   InterRegular: require("./assets/fonts/Inter-Regular.ttf"),
  //   InterLight: require("./assets/fonts/Inter-Light.ttf"),
  //   LibreRegular: require("./assets/fonts/LibreBaskerville-Bold.ttf"),
  //   LibreBold: require("./assets/fonts/LibreBaskerville-Regular.ttf"),
  //   VarelaRound: require("./assets/fonts/VarelaRound-Regular.ttf"),
  // })
  // if (!loaded) return null;
  return (
    <NavigationContainer theme={theme}>
      <Stack.Navigator screenOptions={{headerShown:false}} initialRouteName="Login">
        <Stack.Screen name="Root" component={Root}/>
        <Stack.Screen name="Login" component={Login}/>
        <Stack.Screen name="Details" component={Details}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
export default App;

