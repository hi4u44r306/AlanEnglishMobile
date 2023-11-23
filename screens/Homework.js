import React, { useState, useEffect } from "react";
import { View, SafeAreaView, Text, TextInput, Button, Dimensions } from "react-native";
import { CheckBoxComponent } from "@react-native-community/checkbox";

import { HomeHeader, FocusedStatusBar } from "../components";
import { COLORS } from "../constants";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ScreenContainer from "./ScreenContainer";

import SelectDropdown from 'react-native-select-dropdown'
const { width } = Dimensions.get('window');
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { Ionicons } from "@expo/vector-icons";

const Homework = () => {
    const [isTeacher, setIsTeacher] = useState(true);
    const [booksToRead, setBooksToRead] = useState([]);
    const [bookPages, setBookPages] = useState("");
    const [wordsToWrite, setWordsToWrite] = useState("");
    const [previewResult, setPreviewResult] = useState("");
    const books = [
        "習作本 1",
        "習作本 2",
        "習作本 3",
        "習作本 4",
        "習作本 5",
        "Super Easy Reading 1",
        "Super Easy Reading 2",
        "Super Easy Reading 3",
        "Steam Reading 1",
        "Steam Reading 2",
        "Steam Reading 3",
        "Short Artical Reading 1",
        "Reading Lamp 1",
        "Reading Lamp 2",
        "Reading Lamp 3",
        "Skyline 1",
        "Skyline 2",
        "Skyline 3",
        "Reading Table 1",
        "Reading Table 2",
        "Reading Table 3",
    ];
    const classtype = ["A 班", "B 班", "C 班", "D 班"];

    useEffect(() => {
        const getRole = async () => {
            const role = await AsyncStorage.getItem("ae-class");
            setIsTeacher(role === "Teacher");
        };

        getRole();
    }, []);

    useEffect(() => {
        updatePreviewResult();
    }, [booksToRead, bookPages, wordsToWrite]);

    const handleBookCheck = (book) => {
        const updatedBooks = [...booksToRead];
        const index = updatedBooks.indexOf(book);
        if (index !== -1) {
            updatedBooks.splice(index, 1);
        } else {
            updatedBooks.push(book);
        }
        setBooksToRead(updatedBooks);
    };

    const handleSave = () => {
        // Save data to Firebase Firestore
        // Add your Firestore saving logic here
        console.log("Data saved:", {
            booksToRead,
            bookPages,
            wordsToWrite,
        });
    };

    const updatePreviewResult = () => {
        setPreviewResult(
            `Books: ${booksToRead.join(", ")}\nPages: ${bookPages}\nWords: ${wordsToWrite}`
        );
    };

    return (
        <ScreenContainer>
            <FocusedStatusBar backgroundColor={COLORS.primary} />
            <HomeHeader display="none" />
            <View style={{ flex: 1, padding: 20 }}>
                <View style={{ alignItems: "center", justifyContent: "center", marginTop: 20 }}>
                    <Text
                        style={{
                            fontSize: 26,
                            fontWeight: "bold",
                            marginVertical: 20,
                            color: COLORS.primaryText,
                        }}
                    >
                        Homework
                    </Text>

                    {isTeacher && (
                        <View style={{ width: "95%" }}>
                            {/* <CheckBoxComponent
                                value={booksToRead.includes("Book1")}
                                onValueChange={() => handleBookCheck("Book1")}
                            />
                            <Text style={{ color: COLORS.primaryText }}>Book 1</Text>

                            <CheckBoxComponent
                                value={booksToRead.includes("Book2")}
                                onValueChange={() => handleBookCheck("Book2")}
                            />
                            <Text style={{ color: COLORS.primaryText }}>Book 2</Text> */}
                            <View style={styles.homeworkcontainer}>
                                <Text>班別 : </Text>
                                <SelectDropdown
                                    data={classtype}
                                    // defaultValueByIndex={0}
                                    // defaultValue={'Egypt'}
                                    onSelect={(selectedItem, index) => {
                                        console.log(selectedItem, index);
                                    }}
                                    defaultButtonText={'選擇班別'}
                                    buttonTextAfterSelection={(selectedItem, index) => {
                                        return selectedItem;
                                    }}
                                    rowTextForSelection={(item, index) => {
                                        return item;
                                    }}
                                    buttonStyle={styles.dropdown1BtnStyle}
                                    buttonTextStyle={styles.dropdown1BtnTxtStyle}
                                    renderDropdownIcon={isOpened => {
                                        return <FontAwesome name={isOpened ? 'chevron-up' : 'chevron-down'} color={'#444'} size={18} />;
                                    }}
                                    dropdownIconPosition={'right'}
                                    dropdownStyle={styles.dropdown1DropdownStyle}
                                    rowStyle={styles.dropdown1RowStyle}
                                    rowTextStyle={styles.dropdown1RowTxtStyle}
                                    selectedRowStyle={styles.dropdown1SelectedRowStyle}
                                    search
                                    searchInputStyle={styles.dropdown1searchInputStyleStyle}
                                    searchPlaceHolder={'Search here'}
                                    searchPlaceHolderColor={'darkgrey'}
                                    renderSearchInputLeftIcon={() => {
                                        return <FontAwesome name={'search'} color={'#444'} size={18} />;
                                    }}
                                />
                            </View>

                            <View style={styles.homeworkcontainer}>
                                <View>
                                    <Text>聽力本 : </Text>
                                </View>
                                <SelectDropdown
                                    data={books}
                                    // defaultValueByIndex={1}
                                    // defaultValue={'Egypt'}
                                    onSelect={(selectedItem, index) => {
                                        console.log(selectedItem, index);
                                    }}
                                    defaultButtonText={'選擇聽力本'}
                                    buttonTextAfterSelection={(selectedItem, index) => {
                                        return selectedItem;
                                    }}
                                    rowTextForSelection={(item, index) => {
                                        return item;
                                    }}
                                    buttonStyle={styles.dropdown1BtnStyle}
                                    buttonTextStyle={styles.dropdown1BtnTxtStyle}
                                    renderDropdownIcon={isOpened => {
                                        return <FontAwesome name={isOpened ? 'chevron-up' : 'chevron-down'} color={'#444'} size={18} />;
                                    }}
                                    dropdownIconPosition={'right'}
                                    dropdownStyle={styles.dropdown1DropdownStyle}
                                    rowStyle={styles.dropdown1RowStyle}
                                    rowTextStyle={styles.dropdown1RowTxtStyle}
                                    selectedRowStyle={styles.dropdown1SelectedRowStyle}
                                    search
                                    searchInputStyle={styles.dropdown1searchInputStyleStyle}
                                    searchPlaceHolder={'Search here'}
                                    searchPlaceHolderColor={'darkgrey'}
                                    renderSearchInputLeftIcon={() => {
                                        return <FontAwesome name={'search'} color={'#444'} size={18} />;
                                    }}
                                />
                            </View>
                            <View style={styles.homeworkcontainer}>
                                <View>
                                    <Text>聽力本頁數 : </Text>
                                </View>
                                <View style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    width: '70%',
                                    height: 50,
                                    marginBottom: 5
                                }}>
                                    <TextInput style={styles.input} placeholder="頁數" placeholderTextColor="black" />
                                    <Ionicons name="play-forward-circle-outline" size={25} color="rgb(64, 98, 187)" style={{ marginLeft: 10, marginRight: 10, marginTop: 10 }} />
                                    <TextInput style={styles.input} placeholder="頁數" placeholderTextColor="black" />
                                </View>
                            </View>



                            <View style={styles.homeworkcontainer}>
                                <Text>作業本 : </Text>
                                <SelectDropdown
                                    data={books}
                                    // defaultValueByIndex={1}
                                    // defaultValue={'Egypt'}
                                    onSelect={(selectedItem, index) => {
                                        console.log(selectedItem, index);
                                    }}
                                    defaultButtonText={'選擇作業本'}
                                    buttonTextAfterSelection={(selectedItem, index) => {
                                        return selectedItem;
                                    }}
                                    rowTextForSelection={(item, index) => {
                                        return item;
                                    }}
                                    buttonStyle={styles.dropdown1BtnStyle}
                                    buttonTextStyle={styles.dropdown1BtnTxtStyle}
                                    renderDropdownIcon={isOpened => {
                                        return <FontAwesome name={isOpened ? 'chevron-up' : 'chevron-down'} color={'#444'} size={18} />;
                                    }}
                                    dropdownIconPosition={'right'}
                                    dropdownStyle={styles.dropdown1DropdownStyle}
                                    rowStyle={styles.dropdown1RowStyle}
                                    rowTextStyle={styles.dropdown1RowTxtStyle}
                                    selectedRowStyle={styles.dropdown1SelectedRowStyle}
                                    search
                                    searchInputStyle={styles.dropdown1searchInputStyleStyle}
                                    searchPlaceHolder={'Search here'}
                                    searchPlaceHolderColor={'darkgrey'}
                                    renderSearchInputLeftIcon={() => {
                                        return <FontAwesome name={'search'} color={'#444'} size={18} />;
                                    }}
                                />
                            </View>

                            <View style={styles.homeworkcontainer}>
                                <View>
                                    <Text>作業本頁數 : </Text>
                                </View>
                                <View style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    width: '70%',
                                    height: 50,
                                    marginBottom: 5
                                }}>
                                    <TextInput style={styles.input} placeholder="頁數" placeholderTextColor="black" />
                                    <Ionicons name="play-forward-circle-outline" size={25} color="rgb(64, 98, 187)" style={{ marginLeft: 10, marginRight: 10, marginTop: 10 }} />
                                    <TextInput style={styles.input} placeholder="頁數" placeholderTextColor="black" />
                                </View>
                            </View>

                            {/* 
                            <TextInput
                                style={styles.input}
                                placeholder="Enter pages to read"
                                value={bookPages}
                                onChangeText={(text) => setBookPages(text)}
                            />

                            <TextInput
                                style={styles.input}
                                placeholder="Write down words"
                                value={wordsToWrite}
                                onChangeText={(text) => setWordsToWrite(text)}
                            /> */}

                            <Text style={{ marginTop: 10, color: COLORS.primaryText }}>
                                Preview Result:
                            </Text>
                            <Text style={{ color: COLORS.primaryText }}>{previewResult}</Text>

                            <Button title="Save" onPress={handleSave} color={COLORS.primary} />
                        </View>
                    )}

                    {!isTeacher && (
                        <View style={{ width: "80%" }}>
                            <Text style={{ color: COLORS.primaryText }}>Result:</Text>
                            <Text style={{ color: COLORS.primaryText }}>
                                {/* Display the result here */}
                            </Text>
                        </View>
                    )}
                </View>
            </View>
        </ScreenContainer>
    );
};

const styles = {
    input: {
        marginTop: 10,
        width: '25%',
        padding: 10,
        height: 50,
        backgroundColor: '#FFF',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#444',
        fontSize: 16,
    },
    homeworkcontainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 10,
    },


    shadow: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 10,
    },
    header: {
        flexDirection: 'row',
        width,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F6F6F6',
    },
    headerTitle: { color: '#000', fontWeight: 'bold', fontSize: 16 },
    saveAreaViewContainer: { flex: 1, backgroundColor: '#FFF' },
    viewContainer: { flex: 1, width, backgroundColor: '#FFF' },
    scrollViewContainer: {
        flexGrow: 1,
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: '10%',
        paddingBottom: '20%',
    },

    dropdown1BtnStyle: {
        width: '70%',
        height: 50,
        backgroundColor: '#FFF',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#444',
    },
    dropdown1BtnTxtStyle: { color: '#444', textAlign: 'left' },
    dropdown1DropdownStyle: { backgroundColor: '#EFEFEF' },
    dropdown1RowStyle: { backgroundColor: '#EFEFEF', borderBottomColor: '#C5C5C5' },
    dropdown1RowTxtStyle: { color: '#444', textAlign: 'left' },
    dropdown1SelectedRowStyle: { backgroundColor: 'rgba(0,0,0,0.1)' },
    dropdown1searchInputStyleStyle: {
        backgroundColor: '#EFEFEF',
        borderRadius: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#444',
    },
};

export default Homework;
