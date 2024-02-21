import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView, RefreshControl } from 'react-native';

import { HomeHeader, FocusedStatusBar, MusicCard } from "../components";
import { COLORS, FONTS } from "../constants";
import ScreenContainer from "./ScreenContainer";

import firebase from "firebase";
import { useState } from "react";
import { useEffect } from "react";
import { ProgressBar } from 'react-native-paper';
import { Feather, FontAwesome, Fontisto } from "@expo/vector-icons";


const Home = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [homeworkdata, setHomeworkData] = useState([]);
  const currentMonth = new Date().toJSON().slice(0, 7);
  const currentDate = new Date().toJSON().slice(0, 10);
  // const username = storage.getString('ae-username');
  // const dailyplayed = storage.getString('ae-dailyplayed');
  const percentage = dailyplayed / 30;



  useEffect(() => {
    fetchDatafromRealtimeDB();
  }, []);

  const fetchDatafromRealtimeDB = () => {
    const PostRef = firebase.database().ref(`homework/${'B 班'}/${currentMonth}`).orderByChild('日期').equalTo(currentDate);

    PostRef.on('value', (snapshot) => {
      const data = snapshot.val();

      if (data) {
        const dataArray = Object.entries(data).map(([date, details]) => ({
          date,
          ...details,
        }));
        setHomeworkData(dataArray);
      } else {
        setHomeworkData([]);
      }
    });
  }

  const onRefresh = () => {
    setRefreshing(true);
    fetchDatafromRealtimeDB();
    getUserdata();
    setRefreshing(false);
  }

  const fontcolor = COLORS.lightgray;;
  return (
    <ScreenContainer>
      <FocusedStatusBar backgroundColor={COLORS.primary} />
      {/* <Image blurRadius={50} source={require('../assets/img/background.png')} style={{
        position: 'absolute',
        width: '100%',
        height: '100%',
      }} /> */}
      <ScrollView
        contentContainerStyle={styles.container}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
      >
        {/* Header Section */}
        <View style={styles.header}>
          <View style={{
            borderRadius: 100,
            backgroundColor: 'red',
            width: 30,
            height: 30,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
            <Text style={{ fontSize: 30, color: 'white', textAlign: 'center', textAlignVertical: 'center', marginBottom: 5 }}>
              {username.charAt(0) || ''}
            </Text>
          </View>

          <View>
            <Text style={{
              fontSize: 23,
              fontWeight: '700',
              fontFamily: FONTS.bold,
            }}>
              Welcome {username}
            </Text>
          </View>

          <View>
            <TouchableOpacity>
              <Fontisto name="bell" size={25} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.missionContainer}>
          <Text style={{ fontSize: 20, fontFamily: FONTS.bold, fontWeight: '700', color: fontcolor }}>每日任務</Text>
          <View style={styles.userinfo}>
            <Text style={styles.userInfoText}>聽力 30 / {dailyplayed} 次</Text>
            {/* <Text style={styles.userinfolabel}>目前聽力 {dailyplayed} 次</Text> */}
            <View style={styles.progressBarContainer}>
              <ProgressBar progress={percentage} theme={{
                colors: {
                  primary: 'red',
                  surfaceVariant: fontcolor
                },
              }} style={{
                height: 8,
                borderRadius: 30,
              }} />
            </View>
            {
              percentage === 1
                ?
                <FontAwesome name="check-square-o" size={25} color={fontcolor} />
                :
                <Feather name="square" size={25} color={fontcolor} />
            }
          </View>
          {/* <View style={styles.userinfo}>
            <Text style={styles.userInfoText}>
              {
                homeworkdata.length > 0
                  ?
                  `${homeworkdata[0].習作本} P.${homeworkdata[0].習作本頁數1} ~ P.${homeworkdata[0].習作本頁數2}`
                  :
                  "今日無習作本"
              }
            </Text>
          </View>
          <View style={styles.userinfo}>
            <Text style={styles.userInfoText}>
              {
                homeworkdata.length > 0
                  ?
                  `${homeworkdata[0].聽力本} P.${homeworkdata[0].聽力本頁數1} ~ P.${homeworkdata[0].聽力本頁數2}`
                  :
                  "今日無聽力本"
              }
            </Text>
          </View> */}
        </View>

        {/* Footer Section */}
        {/* <View style={styles.footer}>
          <Text style={styles.footerText}>Download the app now and enhance your English listening skills!</Text>
        </View> */}
      </ScrollView>
    </ScreenContainer>
  );
};
const fontcolor = COLORS.lightgray;
const fontFamily = FONTS.bold;
const styles = StyleSheet.create({
  container: {
    justifyContent: 'space-between',
  },
  missionContainer: {
    backgroundColor: COLORS.blue,
    padding: 15,
  },
  userInfoText: {
    color: fontcolor,
    fontSize: 15,
    fontWeight: '700',
    marginTop: 5,
    marginBottom: 5,
    justifyContent: 'flex-start',
  },
  userinfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    margin: 10,
  },
  progressBarContainer: {
    width: '60%'
  },

  header: {
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logo: {
    width: 100,
    height: 100,
  },
  appName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 10,
  },
  features: {
    marginTop: 30,
  },
  featureText: {
    fontSize: 16,
    marginBottom: 10,
  },
  ctaButton: {
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  ctaButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  footer: {
    marginBottom: 30,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 16,
    textAlign: 'center',
  },


});
export default Home;