import React, { useEffect, useState } from "react";
import { View, SafeAreaView, Text, StyleSheet, Alert, Image, RefreshControl, ScrollView, TouchableOpacity, Button } from "react-native";
import { useNavigation } from '@react-navigation/native';
import { HomeHeader, FocusedStatusBar, LogoutButton } from "../components";
import { COLORS, FONTS, SIZES } from "../constants";
import ScreenContainer from "./ScreenContainer";
import { ProgressBar } from 'react-native-paper';
import { signOut } from "@firebase/auth";
import { authentication, getstorage } from "./firebase-config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from 'expo-image-picker';
// import * as FileSystem from 'expo-file-system';
import { getStorage, uploadBytes } from "firebase/storage";
import { ref as storageref } from "firebase/storage";
import { child, get, getDatabase, onValue, ref, update } from 'firebase/database';
import { AntDesign, Feather } from "@expo/vector-icons";


const Setting = () => {
  const navigation = useNavigation();
  const [userData, setUserData] = useState({
    username: '',
    classname: '',
    useruid: '',
    dayplaytime: '',
    monthplaytime: '',
  });

  const Month = new Date().toJSON().slice(5, 7);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const username = await AsyncStorage.getItem('ae-username');
        const classname = await AsyncStorage.getItem('ae-class');
        const useruid = await AsyncStorage.getItem('ae-useruid');
        const dayplaytime = await AsyncStorage.getItem('ae-daytotal');
        const monthplaytime = await AsyncStorage.getItem('ae-monthtotal');

        setUserData({
          username: username || 'Guest', // Fallback if null
          classname: classname || 'N/A',
          useruid: useruid || 'Unknown',
          dayplaytime: dayplaytime || '0',
          monthplaytime: monthplaytime || '0',
        });
      } catch (error) {
        console.error('Failed to load user data:', error);
      }
    };

    fetchUserData();
  }, []); // Empty dependency array to run only on mount


  // const onRefresh = () => {
  //   setRefreshing(true);
  //   getUserInfo();
  //   setRefreshing(false);
  // }


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
            alert('登出成功');
            signOut(authentication)
              .then(async () => {
                await AsyncStorage.removeItem('ae-username');
                await AsyncStorage.removeItem('ae-class');
                await AsyncStorage.removeItem('ae-useruid');
                await AsyncStorage.removeItem('ae-daytotal');
                await AsyncStorage.removeItem('ae-monthtotal');
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

  // Function to handle choosing an image
  const handleChooseImage = async () => {
    try {
      // Open image picker
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      // Check if image was picked
      if (!result.canceled) {
        // Image URI
        const imageUri = result.assets[0].uri;

        // Upload the image to Firebase Storage
        await handleImageUpload(imageUri);
      }
    } catch (error) {
      console.error('Error choosing image:', error);
    }
  };


  // Function to handle image upload
  const handleImageUpload = async (imageUri) => {
    setUploading(true);
    try {
      // Create a reference to the file to delete
      const desertRef = ref(getstorage, `UserimageFile/${data}`);
      // Delete the file
      deleteObject(desertRef).then(() => {
        alert('deleted successfully')
      }).catch((error) => {

      });
    } catch (e) {

    }
    try {
      const storage = getStorage();
      const filename = imageUri.substring(imageUri.lastIndexOf('/') + 1); // Corrected
      const storageRef = storageref(storage, `UserimageFile/${filename}`);
      const response = await fetch(imageUri);
      const blob = await response.blob();
      const db = getDatabase();
      await update(ref(db, 'student/' + useruid), {
        userimage: filename,
      });
      await uploadBytes(storageRef, blob);
      Alert.alert('Success', 'Image uploaded successfully');
      getUserInfo();
    } catch (error) {
      console.error('Error uploading image:', error);
      Alert.alert('Error', 'Failed to upload image');
    } finally {
      setUploading(false);
    }
  };




  return (
    <ScreenContainer>
      <FocusedStatusBar backgroundColor={COLORS.primary} />
      <HomeHeader display='none' />

      <View style={styles.Upper}>
        <Text style={styles.titleText}>{userData.username || 'NONE'}</Text>
        <View style={styles.userInfoContainer}>
          <View style={styles.userinfo}>
            <Text style={styles.userinfolabel}>班級</Text>
            <Text style={styles.secondtitleText}>{userData.classname || ''} 班</Text>
          </View>
          <View style={styles.userinfo}>
            <Text style={styles.userinfolabel}>{Month} 月聽力次數 </Text>
            <Text style={styles.secondtitleText}>{userData.monthplaytime || '0'} 次</Text>
          </View>
          <View style={styles.userinfo}>
            <Text style={styles.userinfolabel}>今日聽力次數 </Text>
            <Text style={styles.secondtitleText}>{userData.dayplaytime || '0'} 次</Text>
            {/* <Text style={styles.secondtitleText}>{dailytimeplayed}</Text> */}
          </View>
        </View>
        <LogoutButton
          fontSize={20}
          handlePress={Logout}
        />
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

        </View>
      </View>

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
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 10,
    marginBottom: 20,
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
    width: '50%',
    backgroundColor: 'white',
    margin: 15,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    padding: SIZES.base, // You can adjust this padding as needed
    borderRadius: SIZES.base,
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

export default Setting;
