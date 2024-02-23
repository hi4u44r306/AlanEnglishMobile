import { createStackNavigator } from "@react-navigation/stack"
import { NavigationContainer, DefaultTheme } from "@react-navigation/native"
import { useFonts } from "expo-font"
import { Text, Dimensions } from "react-native";
import { authentication } from "./screens/firebase-config";
import { collection, doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "./screens/firebase-config";
// import Home from "./screens/Home";
import Login from "./screens/Login";
import Profile from "./screens/Profile";
import Playlist from "./screens/Playlist";
import Leaderboard from './screens/Leaderboard';
import Details from './screens/Details';
import Solve from "./screens/Solve";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from "@expo/vector-icons";
import PlaylistDetail from "./screens/PlaylistDetail";
import AsyncStorage from '@react-native-async-storage/async-storage';

// import TrackPlayer from 'react-native-track-player';
// TrackPlayer.registerPlaybackService(() => require('./service.js'));

import { Provider, useSelector } from "react-redux";
import { createStore } from 'redux';
import rootReducer from './reducer/reducer'; // Assuming you have a rootReducer
import { useState } from "react";
// import Homework from "./screens/Homework";
import { useEffect } from "react";
import MusicPlayer from "./components/MusicPlayer";
import { View } from "react-native";
import { COLORS, FONTS } from "./constants";
import { useNavigation } from "@react-navigation/native";

// import Sidebar from "./components/Sidebar";
import BigScreen from "./screens/BigScreen";
import { onAuthStateChanged } from "firebase/auth";


const store = createStore(rootReducer);
const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: "transparent",
  }
}
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const homepage = '首頁';
const playlistpage = '播放列表';
const profilepage = '用戶';
const leaderboardpage = '排行榜';
const homework = '聯絡簿';


const PlaylistStackScreen = () => (

  <Stack.Navigator initialRouteName="Playlist" screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Playlist" component={Playlist} />
    <Stack.Screen name="PlaylistDetail" component={PlaylistDetail}

      // PlaylistDetail 的最上面返回鍵
      options={{
        headerShown: true, title: '', headerStyle: { height: Dimensions.get('window').height < 800 ? 70 : 85, backgroundColor: COLORS.main }, headerTitleStyle: { fontFamily: FONTS.mainFont, fontSize: 16 }
      }} />
  </Stack.Navigator>
);

function Root() {
  const { playing } = useSelector(state => state.musicReducer);
  const [currMusic, setCurrMusic] = useState(null);
  const [dimensions, setDimesions] = useState({ window: Dimensions.get('window') });

  useEffect(() => {
    const subscription = Dimensions.addEventListener("change", ({ window }) => {
      setDimesions({ window });
    });
    return () => subscription?.remove();
  })

  const { window } = dimensions;
  const windowWidth = window.width;
  const windowHeight = window.height;

  useEffect(() => {
    setCurrMusic(playing)
  }, [playing]);



  return (
    <View style={{ flex: 1, overflow: 'hidden' }}>
      <Tab.Navigator
        initialRouteName="播放列表"
        tabBarShowLabel
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarIcon: ({ focused, color }) => {
            let iconName;
            let rn = route.name;

            // if (rn === homepage) {
            //   iconName = focused ? 'home' : 'home-outline';
            // }
            if (rn === playlistpage) {
              iconName = focused ? 'musical-notes' : 'musical-notes-outline';
            }
            else if (rn === profilepage) {
              iconName = focused ? 'person-circle' : 'person-circle-outline';
            }
            else if (rn === leaderboardpage) {
              iconName = focused ? 'medal' : 'medal-outline';
            }
            else if (rn === homework) {
              iconName = focused ? 'book' : 'book-outline';
            }

            return <Text><Ionicons name={iconName} size={20} color={color} /></Text>

          },
          tabBarStyle: { height: windowHeight < 800 ? 65 : 90, backgroundColor: COLORS.main, },
          tabBarLabelStyle: { fontFamily: FONTS.mainFont, fontSize: 14, },
          // tabBarActiveTintColor: 'rgb(64, 98, 187)',
          tabBarActiveTintColor: COLORS.blue,
          tabBarInactiveTintColor: 'black'
        })}
      >
        {/* <Tab.Screen name="首頁" component={Home} /> */}
        <Tab.Screen name="排行榜" component={Leaderboard} />
        <Tab.Screen name="播放列表" component={PlaylistStackScreen} />
        {/* <Tab.Screen name="聯絡簿" component={Homework} /> */}
        <Tab.Screen name="用戶" component={Profile} />
      </Tab.Navigator>
      <View>
        {currMusic
          &&
          (
            <>
              <MusicPlayer music={currMusic} />
              {/* <BigScreen music={currMusic} /> */}
            </>
          )}
      </View>
      {/* <Sidebar /> */}
    </View>
  );
}


const App = () => {
  const [loaded] = useFonts({
    InterBold: require("./assets/fonts/Inter-Bold.ttf"),
    InterSemiBold: require("./assets/fonts/Inter-SemiBold.ttf"),
    InterMedium: require("./assets/fonts/Inter-Medium.ttf"),
    InterRegular: require("./assets/fonts/Inter-Regular.ttf"),
    InterLight: require("./assets/fonts/Inter-Light.ttf"),
    LibreRegular: require("./assets/fonts/LibreBaskerville-Bold.ttf"),
    LibreBold: require("./assets/fonts/LibreBaskerville-Regular.ttf"),
    VarelaRound: require("./assets/fonts/VarelaRound-Regular.ttf"),
    Nunito: require("./assets/fonts/Nunito-VariableFont_wght.ttf"),
    AbhayaLibre: require("./assets/fonts/AbhayaLibre-Bold.ttf"),
  })

  const currentDate = new Date().toJSON().slice(0, 10);
  const currentMonth = new Date().toJSON().slice(0, 7);

  useEffect(() => {
    const fetchUserData = async () => {
      const user = authentication.currentUser;
      if (user) {
        try {
          getDoc(doc(db, 'student', user.uid))
            .then(async (docSnapshot) => {
              const username = docSnapshot.data().name;
              const userclass = docSnapshot.data().class;
              const totaltimeplayed = JSON.stringify(docSnapshot.data().totaltimeplayed);
              const currdatetimeplayed = JSON.stringify(docSnapshot.data().currdatetimeplayed);

              await AsyncStorage.setItem('ae-username', username);
              await AsyncStorage.setItem('ae-useuserclassrname', userclass);
              await AsyncStorage.setItem('ae-totaltimeplayed', totaltimeplayed);
              await AsyncStorage.setItem('ae-currdatetimeplayed', currdatetimeplayed);

            })
          getDoc(doc(db, 'teacher', user.uid)).then(async (docSnapshot) => {
            const teacherschool = docSnapshot.data().school;

            await AsyncStorage.setItem('ae-teacherschool', teacherschool);
          })
        } catch (error) {
          console.error('Error while setting student data:', error);
        }
      } else {
        await AsyncStorage.setItem('ae-username', '');
        await AsyncStorage.setItem('ae-useuserclassrname', '');
        await AsyncStorage.setItem('ae-totaltimeplayed', '');
        await AsyncStorage.setItem('ae-currdatetimeplayed', '');
        await AsyncStorage.setItem('ae-teacherschool', '');
      }
    };
    const unsubscribe = authentication.onAuthStateChanged(async () => {
      await fetchUserData();
    });
    return () => unsubscribe();
  }, []);


  if (!loaded) return null;
  return (
    <Provider store={store}>
      <NavigationContainer theme={theme}>
        <Stack.Navigator
          initialRouteName="Login"
          screenOptions={{
            headerShown: false,
            cardStyle: { backgroundColor: 'transparent' },
            cardOverlayEnabled: true,
            cardStyleInterpolator: ({ current: { progress } }) => ({
              cardStyle: {
                opacity: progress,
              },
            }),
          }}
          presentation='modal'
        >
          <Stack.Screen name="Root" component={Root} />
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Details" component={Details} />
          <Stack.Screen name="Solve" component={Solve} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}




export default App;

