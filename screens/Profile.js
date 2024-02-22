import React, { useEffect, useState } from "react";
import { View, SafeAreaView, Text, StyleSheet, Alert, Image, RefreshControl, ScrollView } from "react-native";
import { useNavigation } from '@react-navigation/native';
import { HomeHeader, FocusedStatusBar, LogoutButton } from "../components";
import { COLORS, FONTS, SIZES } from "../constants";
import ScreenContainer from "./ScreenContainer";
import { ProgressBar } from 'react-native-paper';
import { signOut } from "@firebase/auth";
import { authentication } from "./firebase-config";

const Profile = () => {
  const navigation = useNavigation();
  const currentDate = new Date().toJSON().slice(0, 10);
  const currentMonth = new Date().toJSON().slice(0, 7);
  const Month = new Date().toJSON().slice(5, 7);

  // const userclass = storage.getString('ae-class');
  // const username = storage.getString('ae-username');
  // const usertimeplayed = storage.getString('ae-totaltimeplayed');
  // const dailytimeplayed = storage.getString('ae-dailyplayed');
  // const percentage = dailytimeplayed / 30;

  // useEffect(() => {
  //   firebase.auth().onAuthStateChanged(user => {
  //     if (!user) return error();
  //   });
  // }, [currentDate, currentMonth, db, useruid]);

  // const Logout = () => {
  //   Alert.alert(
  //     'Confirmation',
  //     'Are you sure you want to proceed?',
  //     [
  //       {
  //         text: 'Cancel',
  //         style: 'cancel',
  //       },
  //       {
  //         text: 'OK',
  //         onPress: () => {
  //           // Handle the confirmation action
  //           console.log('User confirmed');
  //           firebase.auth().signOut()
  //             .then(() => {
  //               navigation.navigate("Login");

  //             }).catch((err) => {
  //               console.log(err);
  //             });
  //         },
  //       },
  //     ],
  //     { cancelable: false } // Prevents the user from dismissing the dialog by tapping outside it
  //   );
  // };

  const Logout = () => {
    signOut(authentication)
      .then(() => {
        navigation.navigate("Login");
      }).catch((error) => {
        console.log(error);
      });
  };

  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = () => {
    setRefreshing(true);
    getUserInfo();
    setRefreshing(false);
  }


  return (
    <ScreenContainer>
      <FocusedStatusBar backgroundColor={COLORS.primary} />
      <HomeHeader display='none' />
      <ScrollView
        contentContainerStyle={styles.Upper}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
      >
        <View style={styles.titleContainer}>
          <View style={{
            backgroundColor: 'white',
            borderRadius: 100,
            padding: 20,
            position: 'absolute',
            top: 20,
            borderWidth: 2,
            borderColor: '#5784e9',
          }}>
            <Image source={require('../assets/img/headphone.png')} style={{
              width: 100,
              height: 100,
            }} />
          </View>
        </View>
        {/* <Text style={styles.titleText}>{username}</Text> */}
        <Text style={styles.titleText}>Username</Text>
        <View style={styles.userInfoContainer}>
          <View style={{ padding: 20 }}>
            <Text style={{ fontSize: 20, fontFamily: FONTS.bold }}>Account</Text>
            <View style={styles.userinfo}>
              <Text style={styles.userinfolabel}>班級</Text>
              <Text style={styles.secondtitleText}>Teacher</Text>
              {/* <Text style={styles.secondtitleText}>{userclass}</Text> */}
            </View>
            <View style={styles.userinfo}>
              {/* <Text style={styles.userinfolabel}>{Month} 月聽力次數 </Text> */}
              <Text style={styles.userinfolabel}>2 月聽力次數 </Text>
              <Text style={styles.secondtitleText}>聽力次數</Text>
              {/* <Text style={styles.secondtitleText}>{usertimeplayed}</Text> */}
            </View>
            <View style={styles.userinfo}>
              <Text style={styles.userinfolabel}>今日聽力次數 </Text>
              <Text style={styles.secondtitleText}>聽力次數</Text>
              {/* <Text style={styles.secondtitleText}>{dailytimeplayed}</Text> */}
            </View>
          </View>
        </View>
        <View>
          {/* <View style={styles.listeningCountContainer}>
            <View style={{ paddingLeft: 20, paddingRight: 20 }}>
              <Text style={styles.userInfoText}>
                今日目標聽力次數 : 30 次
              </Text>
              <Text style={styles.userSecondInfoText}>
                今天已經聽了 {dailytimeplayed} 次了，加油!!!
              </Text>
            </View>
            <View style={{ width: '90%', margin: 20, }}>
              <ProgressBar progress={percentage} theme={{
                colors: {
                  primary: 'red',
                  surfaceVariant: '#89a9f0'
                },
              }} style={{
                height: 8,
                borderRadius: 30,
              }} />
              <View style={{ marginTop: 10, alignItems: 'stretch', justifyContent: 'space-between', flexDirection: 'row' }}>
                <Text style={{ color: 'white', fontWeight: '700' }}>0次</Text>
                <Text style={{ color: 'white', fontWeight: '700' }}>30次</Text>
              </View>
            </View>
          </View> */}
          <LogoutButton
            fontSize={20}
            handlePress={Logout}
          />
        </View>
      </ScrollView>

    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  Upper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 50,
    paddingBottom: 50,
    marginBottom: 50,
    backgroundColor: COLORS.main,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    elevation: 3,
    position: 'relative', // Make the container relative to position the absolute image
  },

  titleText: {
    marginTop: 25,
    fontSize: 26,
    fontWeight: '900',
    fontFamily: FONTS.bold,
    color: COLORS.primary,
  },
  userinfolabel: {
    marginTop: 15,
    fontSize: 15,
    fontFamily: FONTS.bold,
    color: 'black',
  },
  secondtitleText: {
    marginTop: 15,
    fontSize: 15,
    fontFamily: FONTS.bold,
    color: 'gray',
  },
  userInfoContainer: {
    width: '90%',
    backgroundColor: 'white',
    margin: 15,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    padding: SIZES.base, // You can adjust this padding as needed
    borderRadius: SIZES.base,
    // elevation: 3,
    // shadowColor: COLORS.black,
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.2,
    // shadowRadius: 2,
  },
  listeningCountContainer: {
    backgroundColor: '#5784e9',//blue background
    margin: 15,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    padding: SIZES.base,
    borderRadius: SIZES.base,
    elevation: 3,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  userinfo: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  userInfoText: {
    fontSize: 20,
    fontWeight: '700',
    color: 'white',
    paddingTop: 25,
    paddingBottom: 15,
  },
  userSecondInfoText: {
    fontSize: 15,
    color: 'white',
    paddingBottom: 20,
  },

});

export default Profile;
