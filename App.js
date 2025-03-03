import { createStackNavigator } from "@react-navigation/stack"
import { NavigationContainer, DefaultTheme } from "@react-navigation/native"
import { useFonts } from "expo-font"
import { Text, Dimensions } from "react-native";
import { authentication, getstorage, rtdb } from "./screens/firebase-config";
import Home from "./screens/Home";
import Login from "./screens/Login";
import Profile from "./screens/Profile";
import Playlist from "./screens/Playlist";
// import Leaderboard from './screens/Leaderboard';
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
import { useMemo, useState } from "react";
// import Homework from "./screens/Homework";
import { useEffect } from "react";
import MusicPlayer from "./components/MusicPlayer";
import { View } from "react-native";
import { COLORS, FONTS } from "./constants";

// import Sidebar from "./components/Sidebar";
import BigScreen from "./screens/BigScreen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Teacher from "./screens/Teacher";
import { off, onValue, ref as rtdbRef, set } from "firebase/database";
import AddUser from "./screens/AddUser";
import StudentControl from "./screens/StudentControl";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Setting from "./screens/Setting";
import Toast from "react-native-toast-message";
import AddHomework from "./screens/AddHomework";
import HomeworkList from "./screens/HomeworkList";
import NotificationSettings from "./screens/NotificationSettings";
import SetNotification from "./screens/SetNotification";
import * as Notifications from "expo-notifications";
import { Alert } from 'react-native';
import { getAuth } from "firebase/auth";
import TaskScreen from "./screens/TaskScreen";
import { HomeHeader } from "./components";
import { PaperProvider } from "react-native-paper";
import NotificationsScreen from "./screens/NotificationScreen";
import { UserProvider } from "./screens/UserProvider";
import { MenuProvider } from "react-native-popup-menu";

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
const taskpage = '任務';
const leaderboardpage = '排行榜';
const homework = '聯絡簿';
const teacher = '老師專用';
const setting = '設定'

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

const SettingFunction = () => {
  return (
    <Stack.Navigator initialRouteName="Setting" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Setting" component={Setting} />
      <Stack.Screen name="NotificationSettings" component={NotificationSettings}
        // AddHomework 的最上面返回鍵
        options={{
          headerShown: true,
          headerBackTitle: '',
          headerBackTitleStyle: { color: 'black', fontWeight: '600', display: 'flex', justifyContent: 'center' },
          headerTintColor: 'black',
          headerStyle: { height: Dimensions.get('window').height < 800 ? 70 : 100, backgroundColor: '#ebc0a7' },
          headerTitleStyle: { fontFamily: 'Nunito', fontSize: 18, fontWeight: '700' }
        }}
      />
    </Stack.Navigator>
  );
};

const TeacherFunction = () => {
  return (
    <Stack.Navigator initialRouteName="Teacher" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Teacher" component={Teacher} />
      <Stack.Screen name="SetNotification" component={SetNotification}
        // AddHomework 的最上面返回鍵
        options={({ route }) => ({
          headerShown: true,
          headerBackTitle: '',
          headerBackTitleStyle: { color: 'black', fontWeight: '600', display: 'flex', justifyContent: 'center' },
          headerTintColor: 'black',
          headerStyle: { height: Dimensions.get('window').height < 800 ? 70 : 100, backgroundColor: '#ebc0a7' },
          headerTitleStyle: { fontFamily: 'Nunito', fontSize: 18, fontWeight: '700' }
        })} />
      <Stack.Screen name="AddHomework" component={AddHomework}
        // AddHomework 的最上面返回鍵
        options={({ route }) => ({
          headerShown: true,
          headerBackTitle: '',
          headerBackTitleStyle: { color: 'black', fontWeight: '600', display: 'flex', justifyContent: 'center' },
          headerTintColor: 'black',
          headerStyle: { height: Dimensions.get('window').height < 800 ? 70 : 100, backgroundColor: '#ebc0a7' },
          headerTitleStyle: { fontFamily: 'Nunito', fontSize: 18, fontWeight: '700' }
        })} />
      <Stack.Screen name="HomeworkList" component={HomeworkList}
        // AddHomework 的最上面返回鍵
        options={({ route }) => ({
          headerShown: true,
          headerBackTitle: '',
          headerBackTitleStyle: { color: 'black', fontWeight: '600', display: 'flex', justifyContent: 'center' },
          headerTintColor: 'black',
          headerStyle: { height: Dimensions.get('window').height < 800 ? 70 : 100, backgroundColor: '#ebc0a7' },
          headerTitleStyle: { fontFamily: 'Nunito', fontSize: 18, fontWeight: '700' }
        })} />
      <Stack.Screen name="StudentControl" component={StudentControl}
        // PlaylistDetail 的最上面返回鍵
        options={({ route }) => ({
          headerShown: true,
          headerBackTitle: '',
          headerBackTitleStyle: { color: 'black', fontWeight: '600', display: 'flex', justifyContent: 'center' },
          headerTintColor: 'black',
          headerStyle: { height: Dimensions.get('window').height < 800 ? 70 : 100, backgroundColor: '#ebc0a7' },
          headerTitleStyle: { fontFamily: 'Nunito', fontSize: 18, fontWeight: '700' }
        })} />
      <Stack.Screen
        name="AddUser" component={AddUser}
        options={({ route }) => ({
          headerShown: true,
          headerBackTitle: '',
          headerBackTitleStyle: { color: 'black', fontWeight: '600', display: 'flex', justifyContent: 'center' },
          headerTintColor: 'black',
          headerStyle: { height: Dimensions.get('window').height < 800 ? 70 : 100, backgroundColor: '#ebc0a7' },
          headerTitleStyle: { fontFamily: 'Nunito', fontSize: 18, fontWeight: '700' }
        })} />
    </Stack.Navigator>
  );
};

const PlaylistStackScreen = () => (

  <Stack.Navigator initialRouteName="Playlist" screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Playlist" component={Playlist} />
    <Stack.Screen name="PlaylistDetail" component={PlaylistDetail}

      // PlaylistDetail 的最上面返回鍵
      options={({ route }) => ({
        headerShown: true,
        headerBackTitle: '',
        headerBackTitleStyle: { color: 'black', fontWeight: '600', display: 'flex', justifyContent: 'center' },
        title: route.params?.musicType || '',
        headerTintColor: 'black',
        headerStyle: { height: Dimensions.get('window').height < 800 ? 70 : 100, backgroundColor: '#ebc0a7' },
        headerTitleStyle: { fontFamily: 'Nunito', fontSize: 18, fontWeight: '700' }
      })} />
  </Stack.Navigator>
);



function Root() {
  const { playing } = useSelector(state => state.musicReducer);
  const [currMusic, setCurrMusic] = useState(null);
  const insets = useSafeAreaInsets();
  const tabBarHeight = 55 + insets.bottom;


  const toastConfig = useMemo(() => ({
    success: internalState => (
      <View style={{
        position: 'absolute',
        top: insets.top + Dimensions.get('window').height < 800 ? 70 : 100,
        left: 0,
        height: 50,
        padding: 10,
        width: '100%',
        backgroundColor: '#44db56',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        gap: 10
      }}>
        {/* 你可以在這裡自定義 icon */}
        <Ionicons name="checkmark-done-circle-sharp" size={20} />
        <Text style={{
          color: 'black',
          fontWeight: 'bold',
          fontSize: 16,
        }}>
          {internalState.text1}
        </Text>
      </View>
    ),
    error: internalState => (
      <View style={{
        position: 'absolute',
        top: insets.top + Dimensions.get('window').height < 800 ? 70 : 100,
        left: 0,
        height: 50,
        padding: 10,
        width: '100%',
        backgroundColor: '#ff1303',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        gap: 10
      }}>
        <Text style={{
          color: 'white',
          fontWeight: 'bold',
          fontSize: 16,
        }}>
          {internalState.text1}
        </Text>
      </View>
    ),
    // info: internalState => (
    //   <View style={{
    //     position: 'absolute',
    //     top: 100,
    //     height: 50,
    //     padding: 10,
    //     borderRadius: 5,
    //     width: '100%',
    //     backgroundColor: '#34b4eb',
    //     justifyContent: 'center',
    //     alignItems: 'center',
    //     flexDirection: 'row',
    //     gap: 10
    //   }}>
    //     <Ionicons name="alert-circle" size={20} />
    //     <Text style={{
    //       color: 'black',
    //       fontWeight: 'bold',
    //       fontSize: 16,
    //     }}>
    //       {internalState.text1}
    //     </Text>
    //   </View>
    // ),
    // info 與其他類型也可以依需求設定
  }), []);


  useEffect(() => {
    setCurrMusic(playing)
  }, [playing]);

  const [userclass, setUserClass] = useState();


  const auth = getAuth();
  const user = auth.currentUser;
  useEffect(() => {
    let unsubscribe;

    const fetchRealtimeUserData = async () => {
      try {
        if (user?.uid) {
          const userRef = rtdbRef(rtdb, `student/${user.uid}`);

          unsubscribe = onValue(
            userRef,
            (snapshot) => {
              const data = snapshot.val();
              if (data) {
                setUserClass(data.class);
              }
            },
            (error) => {
              console.error("Error fetching realtime user data:", error);
            }
          );
        }
      } catch (error) {
        console.error("Failed to retrieve user uid:", error);
      }
    };

    fetchRealtimeUserData();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [user?.uid]); // 確保當 `user.uid` 變更時重新執行

  return (
    <UserProvider>
      <View style={{ flex: 1 }}>
        <View style={{ zIndex: 10 }}>
          {/* Toast Container 放在這裡，整個頁面最上層 */}
          <Toast config={toastConfig} topOffset={0} />
        </View>

        <Tab.Navigator
          initialRouteName="播放列表"
          tabBarShowLabel
          screenOptions={({ route }) => ({
            headerShown: false,
            tabBarIcon: ({ focused, color }) => {
              let iconName;
              let rn = route.name;

              if (rn === homepage) {
                iconName = focused ? 'home' : 'home-outline';
              }
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
              else if (rn === teacher) {
                iconName = focused ? 'document-text' : 'document-text-outline';
              }
              else if (rn === setting) {
                iconName = focused ? 'settings' : 'settings-outline';
              }
              else if (rn === taskpage) {
                iconName = focused ? 'file-tray-full' : 'file-tray-full-outline';
              }

              return <Text><Ionicons name={iconName} size={20} color={color} /></Text>

            },
            tabBarStyle: { height: tabBarHeight, backgroundColor: COLORS.main, },
            tabBarLabelStyle: { fontFamily: FONTS.mainFont, fontSize: 12, },
            tabBarActiveTintColor: '#f70505',
            // tabBarActiveTintColor: '#056af7',
            tabBarInactiveTintColor: 'black'
          })}
        >
          {/* <Tab.Screen name="排行榜" component={Leaderboard} /> */}
          <Tab.Screen name="播放列表" component={PlaylistStackScreen} />
          {userclass === 'Teacher' && (
            <Tab.Screen name="老師專用" component={TeacherFunction} />
          )}
          <Tab.Screen name="首頁" component={Home} />
          {/* <Tab.Screen name="用戶" component={Profile} /> */}
          <Tab.Screen name="任務" component={TaskScreen} />
          <Tab.Screen name="設定" component={SettingFunction} />
          {/* <Tab.Screen name="聯絡簿" component={Homework} /> */}


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
    </UserProvider>
  );
}


function App() {

  async function registerForPushNotificationsAsync() {
    let token;
    // 取得當前通知權限
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    // 如果權限未授予則請求權限
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      Alert.alert('未能取得推播權限！');
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log("取得的推播 token:", token);
    return token;
  }

  async function savePushToken(userId, token) {
    try {
      // 儲存在 "pushTokens/{userId}" 下，方便後續管理
      await set(rtdbRef(rtdb, 'pushTokens/' + userId), token);
      console.log("推播 token 儲存成功");
    } catch (error) {
      console.error("推播 token 儲存失敗：", error);
    }
  }

  useEffect(() => {
    const requestPermissions = async () => {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== "granted") {
        alert("請允許通知權限！");
      }
    };
    requestPermissions();
  }, []);

  useEffect(() => {

  }, []);


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


  useEffect(() => {
    const fetchUserData = async () => {
      const user = authentication.currentUser;
      if (user) {
        const studentDocRef = rtdbRef(rtdb, `student/${user.uid}`);
        onValue(studentDocRef, async (snapshot) => {
          const data = snapshot.val();
          if (data) {
            const items = [
              ['ae-useruid', user.uid],
              ['ae-username', data.name.toUpperCase()],
              ['ae-class', data.class],
              ['ae-email', data.email],
              ['ae-plan', data.plan],
              ['ae-userimage', data.userimage],
              ['ae-daytotal', JSON.stringify(data.Daytotaltimeplayed)],
              ['ae-monthtotal', JSON.stringify(data.Monthtotaltimeplayed)],
            ];
            await AsyncStorage.multiSet(items);
          }
        });
      }
    };
    const unsubscribe = authentication.onAuthStateChanged(async () => {
      await fetchUserData();
    });
    return () => unsubscribe();
  }, []);


  useEffect(() => {
    const fetchPlaylistsFromRTDB = () => {
      try {
        const dbRef = rtdbRef(rtdb, 'Music');
        const navItemsRef = rtdbRef(rtdb, 'AppNavbar/');
        onValue(dbRef, (snapshot) => {
          if (snapshot.exists()) {
            const data = snapshot.val();
            AsyncStorage.setItem('ae-playlistData', JSON.stringify(data));
          }
        });
        onValue(navItemsRef, (snapshot) => {
          if (snapshot.exists()) {
            const data = snapshot.val();
            const childTitles = Object.keys(data);
            AsyncStorage.setItem('ae-navData', JSON.stringify(data));
            AsyncStorage.setItem('ae-NavItems', JSON.stringify(childTitles));
          }
        });
      } catch (error) {
        console.error("Error fetching playlists from RTDB:", error);
      }
    };

    fetchPlaylistsFromRTDB();

    // 清理函數，當組件卸載時移除監聽器
    return () => {
      // 如果你需要在組件卸載時移除監聽，可以使用 off 方法
      const dbRef = rtdbRef(rtdb, 'Music');
      off(dbRef);  // 移除監聽
    };
  }, []); // 空的依賴陣列表示只在組件掛載和卸載時執行


  if (!loaded) return null;
  return (
    <Provider store={store}>
      <MenuProvider>
        <PaperProvider>
          <UserProvider>
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
                <Stack.Screen name="NotificationsScreen" component={NotificationsScreen} />
              </Stack.Navigator>
            </NavigationContainer>
          </UserProvider>
        </PaperProvider>
      </MenuProvider>
    </Provider>
  );
}








export default App;

