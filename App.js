import { createStackNavigator } from "@react-navigation/stack"
import { NavigationContainer, DefaultTheme } from "@react-navigation/native"
import { useFonts } from "expo-font"
import { Text } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import firebase from 'firebase/app';
import 'firebase/firestore';
import Home from "./screens/Home";
import Login from "./screens/Login";
import Profile from "./screens/Profile";
import Playlist from "./screens/Playlist";
import Leaderboard from './screens/Leaderboard';
import Details from './screens/Details';
import Solve from "./screens/Solve";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from "@expo/vector-icons";
import PlaylistDetail from "./screens/PlaylistDetail";

// import TrackPlayer from 'react-native-track-player';
// TrackPlayer.registerPlaybackService(() => require('./service.js'));

import { Provider, useSelector } from "react-redux";
import { createStore } from 'redux';
import rootReducer from './reducer/reducer'; // Assuming you have a rootReducer
import { useState } from "react";
import Homework from "./screens/Homework";
import { useEffect } from "react";
import MusicPlayer from "./components/MusicPlayer";
import { View } from "react-native";
import { COLORS, FONTS } from "./constants";
import { useNavigation } from "@react-navigation/native";

import Sidebar from "./components/Sidebar";
import BigScreen from "./screens/BigScreen";

import { MMKV } from 'react-native-mmkv'
export const storage = new MMKV()
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
      options={{
        headerShown: true, title: '', headerStyle: { height: 50, backgroundColor: 'white' }, headerTitleStyle: { fontFamily: FONTS.VarelaRound, fontSize: 16 }
      }} />
  </Stack.Navigator>
);

function Root() {
  const { playing, musicplayerdisplay } = useSelector(state => state.musicReducer);
  const [currMusic, setCurrMusic] = useState(null);

  useEffect(() => {
    setCurrMusic(playing)
  }, [playing]);



  return (
    <View style={{ flex: 1 }}>
      <Tab.Navigator
        initialRouteName="首頁"
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
          tabBarStyle: { height: 70, backgroundColor: 'white' },
          tabBarLabelStyle: { fontWeight: 'bold', fontFamily: 'Nunito', fontSize: 14 },
          tabBarActiveTintColor: 'rgb(64, 98, 187)',
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
      <Sidebar />
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
  })

  // const currentDate = new Date().toJSON().slice(0, 10);
  // const currentMonth = new Date().toJSON().slice(0, 7);
  useEffect(() => {

  }, [])

  // const db = firebase.firestore();
  // firebase.auth().onAuthStateChanged(async (user) => {
  //   if (user) {
  //     await AsyncStorage.setItem('ae-useruid', user.uid);
  //     try {
  //       const studentDoc = await db.collection('student').doc(user.uid).get();
  //       await AsyncStorage.setItem('ae-class', studentDoc.data()?.class || '');
  //       await AsyncStorage.setItem('ae-username', studentDoc.data()?.name);
  //       await AsyncStorage.setItem('ae-totaltimeplayed', JSON.stringify(studentDoc.data()?.totaltimeplayed));
  //       await AsyncStorage.setItem('ae-dailyplayed', JSON.stringify(studentDoc.data()?.currdatetimeplayed));
  //     } catch (error) {
  //       console.error('Error while setting student data:', error);
  //     }

  //     try {
  //       const teacherDoc = await db.collection('teacher').doc(user.uid).get();
  //       await AsyncStorage.setItem('ae-teacherschool', teacherDoc.data()?.school || '');
  //     } catch (error) {
  //       console.error('Error while setting teacher data:', error);
  //     }

  //   } else {
  //     await AsyncStorage.setItem('ae-class', '');
  //     await AsyncStorage.setItem('ae-useruid', '');
  //     await AsyncStorage.setItem('ae-username', '');
  //     await AsyncStorage.setItem('ae-totaltimeplayed', '');
  //     await AsyncStorage.setItem('ae-teacherschool', '');
  //   }
  // });

  useEffect(() => {
    const fetchUserData = async () => {
      const user = firebase.auth().currentUser;

      if (user) {
        try {
          storage.set('ae-useruid', user.uid)
          // await AsyncStorage.setItem('ae-useruid', user.uid);

          const studentDoc = await firebase.firestore().collection('student').doc(user.uid).get();
          storage.set('ae-class', studentDoc.data().class);
          storage.set('ae-username', studentDoc.data().name);
          storage.set('ae-totaltimeplayed', JSON.stringify(studentDoc.data().totaltimeplayed));
          storage.set('ae-dailyplayed', JSON.stringify(studentDoc.data().currdatetimeplayed));
          // await AsyncStorage.setItem('ae-class', studentDoc.data()?.class || '');
          // await AsyncStorage.setItem('ae-username', studentDoc.data()?.name);
          // await AsyncStorage.setItem('ae-totaltimeplayed', JSON.stringify(studentDoc.data()?.totaltimeplayed));
          // await AsyncStorage.setItem('ae-dailyplayed', JSON.stringify(studentDoc.data()?.currdatetimeplayed));
        } catch (error) {
          console.error('Error while setting student data:', error);
        }

        try {
          const teacherDoc = await firebase.firestore().collection('teacher').doc(user.uid).get();
          storage.set('ae-teacherschool', teacherDoc.data().school);
          // await AsyncStorage.setItem('ae-teacherschool', teacherDoc.data()?.school || '');
        } catch (error) {
          console.error('Error while setting teacher data:', error);
        }
      } else {
        storage.set('ae-class', '');
        storage.set('ae-useruid', '');
        storage.set('ae-username', '');
        storage.set('ae-dailyplayed', '');
        storage.set('ae-totaltimeplayed', '');
        storage.set('ae-teacherschool', '');
        // await AsyncStorage.setItem('ae-class', '');
        // await AsyncStorage.setItem('ae-useruid', '');
        // await AsyncStorage.setItem('ae-username', '');
        // await AsyncStorage.setItem('ae-totaltimeplayed', '');
        // await AsyncStorage.setItem('ae-teacherschool', '');
      }
    };

    const unsubscribe = firebase.auth().onAuthStateChanged(async () => {
      // Use onAuthStateChanged just to trigger the fetchUserData function
      await fetchUserData();
    });

    // Cleanup the subscription when the component unmounts
    return () => unsubscribe();
  }, []);


  if (!loaded) return null;
  return (
    <Provider store={store}>
      <NavigationContainer theme={theme}>
        <Stack.Navigator
          initialRouteName="Root"
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

