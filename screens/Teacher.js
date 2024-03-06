import React, { useState } from 'react';
import { Button, TextInput, View, Text, StyleSheet } from 'react-native';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import ScreenContainer from './ScreenContainer';
import { HomeHeader } from '../components';

const Teacher = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [classType, setClassType] = useState("");

    const initialData = [
        { id: 1, label: 'Item 1', checked: false },
        { id: 2, label: 'Item 2', checked: false },
        { id: 3, label: 'Item 3', checked: false },
        // Add more items as needed
    ];

    const [data, setData] = useState(initialData);

    const handleCheckboxChange = (id) => {
        const newData = data.map(item =>
            item.id === id ? { ...item, checked: !item.checked } : item
        );
        setData(newData);
    };

    const success = () => {
        alert('創建成功');
    };

    const error = () => {
        alert('失敗');
    };

    const signupUser = async (e) => {
        e.preventDefault();
        const auth = getAuth()
        try {
            const credentials = await createUserWithEmailAndPassword(auth, email, password);
            const useruid = credentials.user.uid;
            // const db = getFirestore();
            // await setDoc(doc(db, 'student', useruid), {
            //     Resetallmusic: '',
            //     class: classtype,
            //     currdatetimeplayed: 0,
            //     email: email,
            //     name: name,
            //     onlinemonth: '',
            //     onlinetime: '',
            //     totaltimeplayed: 0,
            //     userimage: '',
            // });
            const rtdb = getDatabase();
            const currentDate = new Date().toJSON().slice(0, 10);
            const currentMonth = new Date().toJSON().slice(0, 7);
            const databaseRef = ref(rtdb, 'student/' + useruid);
            await update(databaseRef, {
                Resetallmusic: currentMonth + 'alreadyupdated',
                onlinemonth: currentMonth,
                onlinetime: currentDate,
                name: name,
                class: classtype,
                email: email,
                Daytotaltimeplayed: 0,
                Monthtotaltimeplayed: 0,
                userimage: '6C9570CC-B276-424C-857F-11BBDD21C99B.png',
                totaltimeplayed: 0,
            });
            success();
        } catch {
            error();
        }
    };

    return (
        <ScreenContainer>
            <HomeHeader display={'none'} />
            <View style={styles.formContainer}>
                <View style={styles.title}>
                    <Text style={styles.titletext}>新增用戶</Text>
                </View>
                <View style={styles.label}>
                    <Text style={styles.labeltext}>輸入電子郵件或帳號</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="輸入電子郵件或帳號..."
                        onChangeText={(email) => setEmail(email)}
                        value={email}
                    />
                </View>
                <View style={styles.label}>
                    <Text style={styles.labeltext}>輸入密碼</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="輸入密碼..."
                        onChangeText={(password) => setPassword(password)}
                        value={password}
                        secureTextEntry
                    />
                </View>
                <View style={styles.label}>
                    <Text style={styles.labeltext}>輸入姓名</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="輸入姓名..."
                        onChangeText={(name) => setName(name)}
                        value={name}
                    />
                </View>
                <View style={styles.label}>
                    <Text style={styles.labeltext}>輸入Class</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="輸入Class..."
                        onChangeText={(classType) => setClassType(classType)}
                        value={classType}
                    />
                </View>
                {/* <View>
                    {data.map(item => (
                        <View key={item.id} style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <CheckBox
                                value={item.checked}
                                onValueChange={() => handleCheckboxChange(item.id)}
                            />
                            <Text>{item.label}</Text>
                        </View>
                    ))}
                </View> */}
                <Button onPress={signupUser} title="創建" />
            </View>
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
