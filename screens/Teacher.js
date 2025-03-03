import React, { useState } from 'react';
import { Button, TextInput, View, Text, StyleSheet } from 'react-native';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import ScreenContainer from './ScreenContainer';
import { FocusedStatusBar, HomeHeader } from '../components';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { COLORS, SHADOWS, SIZES } from '../constants';
import { useNavigation } from "@react-navigation/native";
import { AntDesign, Feather, Fontisto, MaterialCommunityIcons } from '@expo/vector-icons';

const Teacher = () => {
    const navigation = useNavigation();
    // const [email, setEmail] = useState("");
    // const [password, setPassword] = useState("");
    // const [name, setName] = useState("");
    // const [classType, setClassType] = useState("");

    // const initialData = [
    //     { id: 1, label: 'Item 1', checked: false },
    //     { id: 2, label: 'Item 2', checked: false },
    //     { id: 3, label: 'Item 3', checked: false },
    //     // Add more items as needed
    // ];

    // const [data, setData] = useState(initialData);

    // const handleCheckboxChange = (id) => {
    //     const newData = data.map(item =>
    //         item.id === id ? { ...item, checked: !item.checked } : item
    //     );
    //     setData(newData);
    // };

    // const success = () => {
    //     alert('創建成功');
    // };

    // const error = () => {
    //     alert('失敗');
    // };

    // const signupUser = async (e) => {
    //     e.preventDefault();
    //     const auth = getAuth()
    //     try {
    //         const credentials = await createUserWithEmailAndPassword(auth, email, password);
    //         const useruid = credentials.user.uid;

    //         const rtdb = getDatabase();
    //         const currentDate = new Date().toJSON().slice(0, 10);
    //         const currentMonth = new Date().toJSON().slice(0, 7);
    //         const databaseRef = ref(rtdb, 'student/' + useruid);
    //         await update(databaseRef, {
    //             Resetallmusic: currentMonth + 'alreadyupdated',
    //             onlinemonth: currentMonth,
    //             onlinetime: currentDate,
    //             name: name,
    //             class: classtype,
    //             email: email,
    //             Daytotaltimeplayed: 0,
    //             Monthtotaltimeplayed: 0,
    //             userimage: '6C9570CC-B276-424C-857F-11BBDD21C99B.png',
    //             totaltimeplayed: 0,
    //         });
    //         success();
    //     } catch {
    //         error();
    //     }
    // };

    const iconsize = 24;

    return (
        <ScreenContainer>
            <FocusedStatusBar backgroundColor={COLORS.black} />
            <HomeHeader display="none" />
            {/* 設定通知 */}
            <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => navigation.navigate("SetNotification")}
                style={{
                    display: 'flex',
                    alignContent: 'center',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    flexDirection: 'row',
                    padding: 15,
                    backgroundColor: 'rgb(244, 244, 244)',
                    borderRadius: SIZES.font,
                    marginBottom: SIZES.extraLarge,
                    margin: SIZES.base,
                    gap: 20,
                }}
            >
                <MaterialCommunityIcons name="alarm-plus" size={iconsize} color="black" />
                <Text style={{ fontWeight: '600', fontSize: 15, display: 'flex', alignItems: 'center' }}>設定通知</Text>
            </TouchableOpacity>
            {/* 新增課後聽力內容 */}
            <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => navigation.navigate("AddHomework")}
                style={{
                    display: 'flex',
                    alignContent: 'center',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    flexDirection: 'row',
                    padding: 15,
                    backgroundColor: 'rgb(244, 244, 244)',
                    borderRadius: SIZES.font,
                    marginBottom: SIZES.extraLarge,
                    margin: SIZES.base,
                    gap: 20,
                }}
            >
                <MaterialCommunityIcons name="book-education-outline" size={iconsize} color="black" />
                <Text style={{ fontWeight: '600', fontSize: 15, display: 'flex', alignItems: 'center' }}>新增課後聽力內容</Text>
            </TouchableOpacity>

            {/* 查看課後聽力內容 */}
            <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => navigation.navigate("HomeworkList")}
                style={{
                    display: 'flex',
                    alignContent: 'center',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    flexDirection: 'row',
                    padding: 15,
                    backgroundColor: 'rgb(244, 244, 244)',
                    borderRadius: SIZES.font,
                    marginBottom: SIZES.extraLarge,
                    margin: SIZES.base,
                    gap: 20,
                }}
            >
                <MaterialCommunityIcons name="book-check-outline" size={iconsize} color="black" />
                <Text style={{ fontWeight: '600', fontSize: 15, display: 'flex', alignItems: 'center' }}>查看課後聽力內容</Text>
            </TouchableOpacity>

            {/* 新增用戶 */}
            <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => navigation.navigate("AddUser")}
                style={{
                    display: 'flex',
                    alignContent: 'center',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    flexDirection: 'row',
                    padding: 15,
                    backgroundColor: 'rgb(244, 244, 244)',
                    borderRadius: SIZES.font,
                    marginBottom: SIZES.extraLarge,
                    margin: SIZES.base,
                    gap: 20,
                }}
            >
                <MaterialCommunityIcons name="account-multiple-plus" size={iconsize} color="black" />
                <Text style={{ fontWeight: '600', fontSize: 15, display: 'flex', alignItems: 'center' }}>新增用戶</Text>
            </TouchableOpacity>

            {/* 控制台 */}
            <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => navigation.navigate("StudentControl")}
                style={{
                    display: 'flex',
                    alignContent: 'center',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    flexDirection: 'row',
                    padding: 15,
                    backgroundColor: 'rgb(244, 244, 244)',
                    borderRadius: SIZES.font,
                    marginBottom: SIZES.extraLarge,
                    margin: SIZES.base,
                    gap: 20,
                }}
            >
                <Feather name="edit" size={iconsize} color="black" />
                <Text style={{ fontWeight: '600', fontSize: 15, display: 'flex', alignItems: 'center' }}>控制台</Text>
            </TouchableOpacity>

            {/* 新增音樂 */}
            <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => navigation.navigate("AddUser")}
                style={{
                    display: 'flex',
                    alignContent: 'center',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    flexDirection: 'row',
                    padding: 15,
                    backgroundColor: 'rgb(244, 244, 244)',
                    borderRadius: SIZES.font,
                    marginBottom: SIZES.extraLarge,
                    margin: SIZES.base,
                    gap: 20,
                }}
            >
                <MaterialCommunityIcons name="book-music-outline" size={iconsize} color="black" />
                <Text style={{ fontWeight: '600', fontSize: 15, display: 'flex', alignItems: 'center' }}>新增音樂</Text>
            </TouchableOpacity>

        </ScreenContainer>
    );
};

export default Teacher;

const styles = StyleSheet.create({
    formContainer: {
        padding: 20,
    },
    title: {
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center',
        fontSize: 20,
        marginBottom: 10,
    },
    titletext: {
        fontSize: 20,
    },
    label: {
        marginTop: 10,
        marginBottom: 10,
    },
    labeltext: {
        marginBottom: 10,
        fontSize: 16,
    },
    input: {
        height: 50,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 10,
        paddingHorizontal: 10,
    },
});
