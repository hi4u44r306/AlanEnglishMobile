import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from "@react-navigation/native";
import { authentication } from './firebase-config';

const AuthCheck = () => {
    const navigation = useNavigation();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkLogin = async () => {
            const userId = await AsyncStorage.getItem('userId');
            if (userId) {
                navigation.replace("Root"); // 直接導航到主畫面
            } else {
                navigation.replace("Login"); // 導航到登入畫面
            }
            setLoading(false);
        };

        checkLogin();
    }, []);

    if (loading) {
        return <ActivityIndicator size="large" color="#0000ff" />;
    }

    return <View />;
};

export default AuthCheck;
