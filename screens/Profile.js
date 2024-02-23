import React, { useEffect, useState } from "react";
import { View, SafeAreaView, Text, StyleSheet, Alert, Image, RefreshControl, ScrollView } from "react-native";
import { useNavigation } from '@react-navigation/native';
import { HomeHeader, FocusedStatusBar, LogoutButton } from "../components";
import { COLORS, FONTS, SIZES } from "../constants";
import ScreenContainer from "./ScreenContainer";
import { ProgressBar } from 'react-native-paper';
import { signOut } from "@firebase/auth";
import { authentication } from "./firebase-config";
import { onAuthStateChanged } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Profile = () => {
  const navigation = useNavigation();
  const [username, setUsername] = useState();
  const [classname, setClassName] = useState();
  const [useruid, setUserUID] = useState();
  const [usertimeplayed, setUsertimeplayed] = useState();
  const [currdatetimeplayed, setCurrdatetimeplayed] = useState();
  const currentDate = new Date().toJSON().slice(0, 10);
  const currentMonth = new Date().toJSON().slice(0, 7);
  const Month = new Date().toJSON().slice(5, 7);

  useEffect(() => {
    const getUserInfo = async () => {
      try {
        setUsername(await AsyncStorage.getItem('ae-username'));
        setClassName(await AsyncStorage.getItem('ae-useuserclassrname'));
        setUserUID(await AsyncStorage.getItem('ae-useruid'));
        setUsertimeplayed(await AsyncStorage.getItem('ae-totaltimeplayed'));
        setCurrdatetimeplayed(await AsyncStorage.getItem('ae-currdatetimeplayed'));
      } catch (error) {
        console.error('Error fetching user info:', error);
      }
    };

    getUserInfo();
  }, []);

  const Logout = () => {
    Alert.alert(
      '登出',
      '確定要登出嗎 ?',
      [
        {
          text: '取消',
          style: 'cancel',
        },
        {
          text: '確定',
          onPress: () => {
            // Handle the confirmation action
            alert('User confirmed');
            signOut(authentication)
              .then(() => {
                navigation.navigate("Login");
              }).catch((error) => {
                alert(error);
              });
          },
        },
      ],
      { cancelable: false } // Prevents the user from dismissing the dialog by tapping outside it
    );
  };


  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = () => {
    setRefreshing(true);
    // getUserInfo();
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
        <Text style={styles.titleText}>{username || 'NONE'}</Text>
        <View style={styles.userInfoContainer}>
          <View style={{ padding: 20 }}>
            <Text style={{ fontSize: 20, fontFamily: FONTS.bold }}>Account</Text>
            <View style={styles.userinfo}>
              <Text style={styles.userinfolabel}>班級</Text>
              <Text style={styles.secondtitleText}>{classname || '0'}</Text>
            </View>
            <View style={styles.userinfo}>
              <Text style={styles.userinfolabel}>{Month} 月聽力次數 </Text>
              <Text style={styles.secondtitleText}>{usertimeplayed || '0'}</Text>
            </View>
            <View style={styles.userinfo}>
              <Text style={styles.userinfolabel}>今日聽力次數 </Text>
              <Text style={styles.secondtitleText}>{currdatetimeplayed || '0'}</Text>
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
