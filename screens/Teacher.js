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

    const signupUser = () => {
        const auth = getAuth();
        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const useruid = userCredential.user.uid;
                const db = getFirestore();
                setDoc(doc(db, 'student', useruid), {
                    name: name,
                    class: classType,
                    email: email,
                    totaltimeplayed: 0
                });
                success();
            })
            .catch(() => {
                error();
            });
    };

    return (
        <ScreenContainer>
            <HomeHeader display={'none'} />
            <View style={styles.formContainer}>
                <View style={styles.label}>
                    <Text style={styles.labeltext}>新增用戶</Text>
                </View>
                <TextInput
                    style={styles.input}
                    placeholder="輸入電子郵件或帳號..."
                    onChangeText={(email) => setEmail(email)}
                    value={email}
                />
                <TextInput
                    style={styles.input}
                    placeholder="輸入密碼..."
                    onChangeText={(password) => setPassword(password)}
                    value={password}
                    secureTextEntry
                />
                <TextInput
                    style={styles.input}
                    placeholder="輸入姓名..."
                    onChangeText={(name) => setName(name)}
                    value={name}
                />
                <TextInput
                    style={styles.input}
                    placeholder="輸入Class..."
                    onChangeText={(classType) => setClassType(classType)}
                    value={classType}
                />
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
    label: {
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center',
        fontSize: 20,
        marginBottom: 10,
    },
    labeltext: {
        fontSize: 20,
    },
    input: {
        marginTop: 20,
        height: 50,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 10,
        paddingHorizontal: 10,
    },
});
