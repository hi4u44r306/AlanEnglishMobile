import React, { useEffect, useState } from "react";
import { View, SafeAreaView, Text, StyleSheet, Alert, Image, RefreshControl, ScrollView, TouchableOpacity, Button } from "react-native";
import { useNavigation } from '@react-navigation/native';
import { HomeHeader, FocusedStatusBar, LogoutButton } from "../components";
import { COLORS, FONTS, SIZES } from "../constants";
import ScreenContainer from "./ScreenContainer";
import { ProgressBar } from 'react-native-paper';
import { getAuth, signOut } from "@firebase/auth";
import { authentication, getstorage, rtdb } from "./firebase-config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from 'expo-image-picker';
// import * as FileSystem from 'expo-file-system';
import { getStorage, uploadBytes } from "firebase/storage";
import { ref as storageref } from "firebase/storage";
import { getDatabase, onValue, ref as rtdbRef, update } from 'firebase/database';
import { AntDesign, Feather } from "@expo/vector-icons";
import { remove } from "firebase/database";



const Profile = () => {
  const navigation = useNavigation();
  const [userData, setUserData] = useState({
    username: '',
    classname: '',
    useruid: '',
    dayplaytime: '',
    monthplaytime: '',
  });

  const Month = new Date().toJSON().slice(5, 7);

  const auth = getAuth();
  const user = auth.currentUser;
  useEffect(() => {
    // 用來存放解除監聽的函數
    let unsubscribe;

    const fetchRealtimeUserData = async () => {
      try {
        if (user.uid) {
          const userRef = rtdbRef(rtdb, `student/${user.uid}`);

          // 監聽資料變化
          unsubscribe = onValue(
            userRef,
            (snapshot) => {
              const data = snapshot.val();
              if (data) {
                setUserData({
                  username: data.name || 'Guest',
                  classname: data.class || 'N/A',
                  useruid: user.uid,
                  dayplaytime: data.Daytotaltimeplayed || '0',
                  monthplaytime: data.Monthtotaltimeplayed || '0',
                });
              }
            },
            (error) => {
              console.error("Error fetching realtime user data:", error);
            }
          );
        }
      } catch (error) {
        console.error('Failed to retrieve user uid from AsyncStorage:', error);
      }
    };

    fetchRealtimeUserData();

    // 清除監聽器
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);


  // const onRefresh = () => {
  //   setRefreshing(true);
  //   getUserInfo();
  //   setRefreshing(false);
  // }


  async function removePushToken() {
    try {
      await remove(rtdbRef(rtdb, `pushTokens/${user.uid}`));
      console.log("推播 token 已移除");
    } catch (error) {
      console.error("移除 token 時發生錯誤：", error);
    }
  }



  // const Logout = () => {
  //   Alert.alert(
  //     '登出',
  //     '確定要登出嗎 ?',
  //     [
  //       {
  //         text: '取消',
  //         style: 'cancel',
  //       },
  //       {
  //         text: '確定',

  //         onPress: async () => {
  //           await AsyncStorage.removeItem('userId'); // 清除儲存的用戶 UID
  //           navigation.replace("Login"); // 導回登入頁面
  //           // Handle the confirmation action
  //           removePushToken();
  //           alert('登出成功');
  //           signOut(authentication)
  //             .then(async () => {
  //               await AsyncStorage.removeItem('ae-username');
  //               await AsyncStorage.removeItem('ae-class');
  //               await AsyncStorage.removeItem('ae-useruid');
  //               await AsyncStorage.removeItem('ae-daytotal');
  //               await AsyncStorage.removeItem('ae-monthtotal');
  //               navigation.navigate("Login");
  //             }).catch((error) => {
  //               alert(error);
  //             });
  //         },
  //       },
  //     ],
  //     { cancelable: false } // Prevents the user from dismissing the dialog by tapping outside it
  //   );
  // };

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
      {/* <ScrollView
        contentContainerStyle={styles.Upper}
      // refreshControl={
      //   <RefreshControl
      //     refreshing={refreshing}
      //     onRefresh={onRefresh}
      //   />
      // }
      >
      </ScrollView> */}
      <View style={styles.Upper}>
        {/* <View style={styles.titleContainer}>

          <View style={{
            backgroundColor: 'white',
            top: 20,
          }}>
            {
              image ?
                (
                  <Image source={{ uri: image }} style={{
                    width: 150,
                    height: 150,
                    borderRadius: 100,
                  }} />
                ) : (
                  <Text>Loading...</Text>
                )
            }
            <TouchableOpacity onPress={handleChooseImage} disabled={uploading} style={{
              backgroundColor: '#2d7dd2',
              padding: 10,
              borderRadius: 10,
              position: 'absolute',
              right: 0,
              bottom: 0,
            }}>
              <Feather name="edit" size={20} color={'white'} />
            </TouchableOpacity>
          </View>
          {uploading && <Text style={{ justifyContent: 'center', alignContent: 'center', alignItems: 'center', marginTop: 50 }}>上傳中...</Text>}
        </View> */}

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
          </View>
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

export default Profile;
