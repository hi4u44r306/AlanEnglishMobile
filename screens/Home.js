import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

import { HomeHeader, FocusedStatusBar } from "../components";
import { COLORS, FONTS } from "../constants";
import ScreenContainer from "./ScreenContainer";

import firebase from "firebase";
import { useState } from "react";
import { useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FontAwesome } from "@expo/vector-icons";

const Home = () => {
  const [userclass, setUserclass] = useState();
  const [homeworkdata, setHomeworkdata] = useState({});
  const db = firebase.firestore();
  const currentDate = new Date().toJSON().slice(0, 10);


  useEffect(() => {
    const getUserdata = async () => {
      setUserclass(await AsyncStorage.getItem("ae-class"));
    };
    getUserdata();
  }, []);


  useEffect(() => {
    // db.collection('homework').where('A班', '==', userclass).get().then((querySnapshot) => {
    db.collection('homework').doc('A 班').collection(currentDate).get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        setHomeworkdata(doc.data());
        console.log(doc.data());
      })
    })
      .catch((error) => {
        console.log("Error getting documents: ", error);
      });
  }, [])

  return (
    <ScreenContainer>
      <FocusedStatusBar backgroundColor={COLORS.primary} />
      <HomeHeader display="none" />
      <View style={styles.container}>
        {/* Header Section */}

        <View style={styles.resultContainer}>
          <View style={styles.resultItem}>

            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
              <FontAwesome name="pencil-square" size={40} color="rgb(64, 98, 187)" />
              <Text style={{ fontSize: 25, marginLeft: 25, fontFamily: FONTS.bold }}>
                今日聯絡簿
              </Text>
            </View>
          </View>
          <View style={styles.resultItem}>
            <View style={styles.inline}>
              <Text style={styles.resultLabel}>班別: </Text>
              <Text style={styles.resultText}>{homeworkdata.班別}</Text>
            </View>
          </View>

          <View style={styles.resultItem}>
            <View style={styles.inline}>
              <Text style={styles.resultLabel}>聽力本:</Text>
              <Text style={styles.resultText}>{homeworkdata.聽力本}</Text>
            </View>
            <View style={styles.inline}>
              <Text style={styles.resultLabel}>聽力本頁數:</Text>
              <Text style={styles.resultText}>{`${homeworkdata.聽力本頁數1}頁 ~ ${homeworkdata.聽力本頁數2}頁`}</Text>
            </View>
          </View>

          <View style={styles.resultItem}>
            <View style={styles.inline}>
              <Text style={styles.resultLabel}>習作本:</Text>
              <Text style={styles.resultText}>{homeworkdata.習作本}</Text>
            </View>
            <View style={styles.inline}>
              <Text style={styles.resultLabel}>習作本頁數:</Text>
              <Text style={styles.resultText}>{`${homeworkdata.習作本頁數1}頁 ~ ${homeworkdata.習作本頁數2}頁`}</Text>
            </View>
          </View>
        </View>




        {/* Footer Section */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Download the app now and enhance your English listening skills!</Text>
        </View>
      </View>
    </ScreenContainer>
  );
};


const fontFamily = FONTS.bold;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'center',
    marginTop: 30,
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


  resultContainer: {
    marginTop: 10,
    padding: 15,
    backgroundColor: COLORS.main,
    borderRadius: 10,
    fontFamily: fontFamily,
  },
  previewLabel: {
    fontSize: 18,
    marginBottom: 10,
    fontFamily: fontFamily,
  },
  inline: {
    flexDirection: 'row',
    alignItems: 'center', // Optional: Align items vertically in the center
    justifyContent: 'space-between',
    borderBottomColor: 'gray',
    borderBottomWidth: 1,

  },
  resultItem: {
    marginBottom: 15,
    fontFamily: fontFamily,
  },
  resultLabel: {
    fontSize: 17,
    marginTop: 5, // You can reduce or remove this margin
    color: 'gray',
    fontFamily: fontFamily,
  },
  resultText: {
    fontSize: 17,
    marginTop: 5, // You can reduce or remove this margin
    fontFamily: fontFamily,
  },
});
export default Home;