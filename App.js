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


const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: "transparent",
  }
}
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const homepage = 'Home';
const playlistpage = 'Playlist';
const profilepage = 'Profile';
const leaderboardpage = 'Rank';



function Root() {
  return (
    <Tab.Navigator
      initialRouteName="Playlist"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color }) => {
          let iconName;
          let rn = route.name;

          if (rn === homepage) {
            iconName = focused ? 'home' : 'home-outline';
          } else if (rn === playlistpage) {
            iconName = focused ? 'musical-notes' : 'musical-notes-outline';
          } else if (rn === profilepage) {
            iconName = focused ? 'person-circle' : 'person-circle-outline';
          } else if (rn === leaderboardpage) {
            iconName = focused ? 'medal' : 'medal-outline';
          }
          return <Text><Ionicons name={iconName} size={18} color={color} style={{ margin: 20, }} /></Text>

        },
        tabBarStyle: { paddingBottom: 30, height: 90 },
        tabBarLabelStyle: { fontWeight: 700, fontFamily: 'Nunito', fontSize: 15 },
        tabBarActiveTintColor: 'rgb(64, 98, 187)',
        tabBarInactiveTintColor: 'gray'
      })}
    >
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Rank" component={Leaderboard} />
      <Tab.Screen name="Playlist" component={Playlist} />
      <Tab.Screen name="Profile" component={Profile} />
    </Tab.Navigator>
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
  })

  const db = firebase.firestore();
  firebase.auth().onAuthStateChanged(async (user) => {
    if (user) {
      await AsyncStorage.setItem('ae-useruid', user.uid);

      try {
        const studentDoc = await db.collection('student').doc(user.uid).get();
        await AsyncStorage.setItem('ae-class', studentDoc.data()?.class || '');
        await AsyncStorage.setItem('ae-username', studentDoc.data()?.name);
        await AsyncStorage.setItem('ae-totaltimeplayed', studentDoc.data()?.totaltimeplayed);
      } catch (error) {
        console.error('Error while setting student data:', error);
      }

      try {
        const teacherDoc = await db.collection('teacher').doc(user.uid).get();
        await AsyncStorage.setItem('ae-teacherschool', teacherDoc.data()?.school || '');
      } catch (error) {
        console.error('Error while setting teacher data:', error);
      }

      try {
        const snapshot = await firebase.database().ref('TeachingResources/').once('value');
        const data = snapshot.val();

        if (data) {
          const dataArray = Object.entries(data).map(([date, details]) => ({
            date,
            ...details,
          }));

          await AsyncStorage.setItem('teachingResourcesData', JSON.stringify(dataArray));
        } else {
          const placeholderData = {
            description: 'This is a placeholder node.',
            timestamp: '2023-10-19 12:00:00',
          };

          await AsyncStorage.setItem('teachingResourcesData', JSON.stringify(placeholderData));
        }
      } catch (error) {
        console.error('Error while setting teaching resources data:', error);
      }
    } else {
      await AsyncStorage.setItem('ae-class', '');
      await AsyncStorage.setItem('ae-useruid', '');
      await AsyncStorage.setItem('ae-username', '');
      await AsyncStorage.setItem('ae-totaltimeplayed', '');
      await AsyncStorage.setItem('ae-teacherschool', '');
    }
  });


  if (!loaded) return null;
  return (
    <NavigationContainer theme={theme}>
      <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Root">
        <Stack.Screen name="Root" component={Root} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Details" component={Details} />
        <Stack.Screen name="PlaylistDetail" component={PlaylistDetail} />
        <Stack.Screen name="Solve" component={Solve} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
export default App;

