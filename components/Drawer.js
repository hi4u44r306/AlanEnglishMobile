import { AntDesign, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { Dimensions, TouchableOpacity, View } from "react-native";
import { Text, StyleSheet } from "react-native";
import { COLORS, FONTS, SIZES } from "../constants";
import { getAuth } from "firebase/auth";
import { onValue, ref as rtdbRef } from "firebase/database";
import { rtdb } from "../screens/firebase-config";

const Drawer = ({ onClose }) => {
    const iconcolor = 'black';

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
        <View style={styles.container}>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <AntDesign name="close" color={'black'} size={35} />
            </TouchableOpacity>
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
            {/* <View style={styles.item}>
                <AntDesign style={styles.itemimage} name="setting" color={iconcolor} size={25} />
                <Text style={styles.itemtext}>
                    {設定}
                </Text>
            </View>
            <View style={styles.item}>
                <AntDesign style={styles.itemimage} name="user" color={iconcolor} size={25} />
                <Text style={styles.itemtext}>
                    隱私
                </Text>
            </View>
            <View style={styles.item}>
                <Ionicons style={styles.itemimage} name="notifications-outline" color={iconcolor} size={25} />
                <Text style={styles.itemtext}>
                    通知
                </Text>
            </View> */}
        </View>
    );
};

export default Drawer;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.ricewhite,
        padding: 20,
    },
    closeButton: {
        alignSelf: 'flex-start',
        padding: 10,
    },
    userInfoContainer: {
        margin: 15,
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        padding: SIZES.base, // You can adjust this padding as needed
        borderRadius: SIZES.base,
    },
    userinfo: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 10,
    },
    userinfolabel: {
        fontSize: 16,
        fontFamily: FONTS.bold,
    },
    secondtitleText: {
        fontSize: 16,
        fontFamily: FONTS.bold,
    },
    // item: {
    //     flexDirection: 'row',
    //     alignContent: 'center',
    //     alignItems: 'center',
    //     justifyContent: 'center',
    //     marginTop: 25,
    //     // marginLeft: 20,
    //     gap: 30,
    // },
    // itemtext: {
    //     color: 'black',
    //     fontSize: 20,
    // },
    // itemimage: {
    //     // marginRight: 20,
    // }
})