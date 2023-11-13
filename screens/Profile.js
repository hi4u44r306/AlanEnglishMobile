import React, { useEffect, useState } from "react";
import { View, SafeAreaView, Text, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from '@react-navigation/native';
import { HomeHeader, FocusedStatusBar, LogoutButton } from "../components";
import { COLORS, SIZES } from "../constants";
import firebase from "./firebase";

const Profile = () => {
  const navigation = useNavigation();
  const db = firebase.firestore();
  const [username, setUsername] = useState();
  const [useruid, setUserUID] = useState();
  const [usertimeplayed, setUsertimeplayed] = useState();
  const [dailytimeplayed, setDailyTimeplayed] = useState();
  const currentDate = new Date().toJSON().slice(0, 10);
  const currentMonth = new Date().toJSON().slice(0, 7);

  useEffect(() => {
    const getUserInfo = async () => {
      try {
        setUsername(await AsyncStorage.getItem('ae-username'));
        setUserUID(await AsyncStorage.getItem('ae-useruid'));
        setUsertimeplayed(await AsyncStorage.getItem('ae-totaltimeplayed'));
      } catch (error) {
        console.error('Error fetching user info:', error);
      }
    };

    getUserInfo();
  }, []);

  useEffect(() => {
    db.collection('student').doc(useruid).collection('Logfile').doc(currentMonth).collection(currentMonth).doc(currentDate).get().then((doc) => {
      setDailyTimeplayed(doc.data().todaytotaltimeplayed);
    }).catch(() => {
      setDailyTimeplayed("0");
    });

    firebase.auth().onAuthStateChanged(user => {
      if (!user) return error();
    });
  }, [currentDate, currentMonth, db, useruid]);

  const Logout = () => {
    firebase.auth().signOut()
      .then(() => {
        navigation.navigate("Login");
      }).catch((err) => {
        console.log(err);
      });
  };

  return (
    <SafeAreaView style={styles.container}>
      <FocusedStatusBar backgroundColor={COLORS.primary} />
      <HomeHeader display='none' />
      <View style={styles.contentContainer}>

        <View style={styles.titleContainer}>
          <Text style={styles.titleText}>Profile</Text>
        </View>

        <View style={styles.userInfoContainer}>
          <Text style={styles.userInfoText}>
            用戶名稱: {username}
            {'\n'}
            總聽力次數: {usertimeplayed}
            {'\n'}
            今日聽力次數: {dailytimeplayed}
          </Text>
        </View>

        <View style={styles.logoutButtonContainer}>
          <LogoutButton
            minWidth={80}
            fontSize={15}
            handlePress={Logout}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: SIZES.padding,
  },
  titleText: {
    fontSize: 26,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  userInfoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: SIZES.base,
    margin: 20,
    backgroundColor: COLORS.white,
    borderRadius: SIZES.base,
    elevation: 3,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  userInfoText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    color: COLORS.black,
    padding: 20,
  },
  logoutButtonContainer: {
    marginTop: SIZES.padding,
  },
});

export default Profile;
