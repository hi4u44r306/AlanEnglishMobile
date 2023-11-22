import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Animated } from 'react-native';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import { setSidebar } from './actions/actions';
import ScreenContainer from '../screens/ScreenContainer';
import FocusedStatusBar from './FocusedStatusBar';
import { COLORS } from '../constants';
import HomeHeader from './HomeHeader';
import { useEffect } from 'react';
import { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firebase from 'firebase';

const Sidebar = ({ navigation }) => {
    const { sidebarshow } = useSelector(state => state.screenReducer);
    const dispatch = useDispatch();
    const db = firebase.firestore();
    const [useruid, setUserUID] = useState();
    const [username, setUsername] = useState();
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
            // dispatch(setUsertodaytimeplayed(doc.data().todaytotaltimeplayed))
            setDailyTimeplayed(doc.data().todaytotaltimeplayed);
        }).catch(() => {
            // dispatch(setUsertodaytimeplayed(doc.data().todaytotaltimeplayed))
            setDailyTimeplayed("0");
        });
        firebase.auth().onAuthStateChanged(user => {
            if (!user) return error();
        });
    }, [currentDate, currentMonth, db, useruid]);

    const translateY = new Animated.Value(1000);

    Animated.timing(translateY, {
        toValue: sidebarshow ? 0 : 1000, // Adjust the values based on your requirement
        duration: 500,
        useNativeDriver: false,
    }).start();

    const menuItems = [
        { label: 'Home', screen: 'HomeScreen' },
        { label: 'Profile', screen: 'ProfileScreen' },
        // Add more menu items as needed
    ];

    const handleMenuItemPress = (screen) => {
        // Navigate to the selected screen
        navigation.navigate(screen);
    };

    const closesidebar = () => {
        dispatch(setSidebar('none'))
    }

    return (
        <Animated.View style={{
            display: sidebarshow,
            flex: 1,
            transform: [{ translateY }],
            bottom: 0,
            position: 'absolute',
            width: '100%',
            height: '100%',
            justifyContent: 'flex-start',
            alignItems: 'flex-start',
            backgroundColor: 'white',
            paddingTop: 55,
            paddingLeft: 20,
        }}>
            <View>
                <TouchableOpacity onPress={closesidebar} style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', alignContent: 'center' }}>
                    <Ionicons name="close" size={35} color="black" />
                    <Text style={{ marginLeft: 25, fontSize: 20 }}>帳戶</Text>
                </TouchableOpacity>
            </View>
            <View style={{ flexDirection: 'row' }}>
                <Image source={require('../assets/img/headphone.png')} style={styles.image} />
                <View>
                    <Text>{username}</Text>
                    <Text>{useruid}</Text>
                    <Text>{usertimeplayed}</Text>
                    <Text>{dailytimeplayed}</Text>
                </View>
            </View>
            <View>
                {menuItems.map((item, index) => (
                    <TouchableOpacity
                        key={index}
                        style={styles.menuItem}
                        onPress={() => handleMenuItemPress(item.screen)}
                    >
                        <Text style={styles.menuText}>{item.label}</Text>
                    </TouchableOpacity>
                ))}
            </View>

        </Animated.View>
    );
};

const styles = StyleSheet.create({
    menuItem: {
        marginBottom: 10,
        padding: 10,
        borderRadius: 5,
        backgroundColor: '#eee', // Set your desired menu item background color
    },
    menuText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333', // Set your desired text color
    },
    image: {
        width: 50,
        height: 50,
        marginRight: 10,
    },
});

export default Sidebar;
