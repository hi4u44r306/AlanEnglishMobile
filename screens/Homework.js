import React, { useState, useEffect } from "react";
import { View, SafeAreaView, Text, TextInput, Button, Dimensions, Alert, TouchableWithoutFeedback, Keyboard, FlatList } from "react-native";

import { FocusedStatusBar } from "../components";
import { COLORS, FONTS } from "../constants";
import ScreenContainer from "./ScreenContainer";

import SelectDropdown from 'react-native-select-dropdown'
const { width } = Dimensions.get('window');
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { Ionicons } from "@expo/vector-icons";

import firebase from "firebase";
import { TouchableOpacity } from "react-native-gesture-handler";
import HomeworkData from "../components/HomeworkData";


const Homework = () => {
    const [codeVisible, setCodeVisible] = useState(false);
    const [isTeacher, setIsTeacher] = useState(true);
    const [teachername, setTeachername] = useState()
    const [selectedClassType, setSelectedClassType] = useState(null);
    const [selectedListeningBook, setSelectedListeningBook] = useState(null);
    const [listeningBookPages, setListeningBookPages] = useState({ start: "", end: "" });
    const [selectedExerciseBook, setSelectedExerciseBook] = useState(null);
    const [exerciseBookPages, setExerciseBookPages] = useState({ start: "", end: "" });
    const [previewResult, setPreviewResult] = useState("");
    const currentDate = new Date().toJSON().slice(0, 10);
    const currentMonth = new Date().toJSON().slice(0, 7);
    const [currentDayOfWeek, setCurrentDayOfWeek] = useState('');

    // CurrentDayofWeek
    useEffect(() => {
        const currentDate = new Date();
        const dayOfWeek = currentDate.getDay();
        const days = ['日', '一', '二', '三', '四', '五', '六'];
        setCurrentDayOfWeek(days[dayOfWeek]);
    }, []);

    // Get Role
    useEffect(() => {
        const getRole = async () => {
            setIsTeacher(role === "Teacher");
        };

        getRole();
    }, []);

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
    const listeningbooks = [
        "聽力本 1",
        "聽力本 2",
        "聽力本 3",
        "聽力本 4",
        "聽力本 5",
    ]
    const classtype = ["A 班", "B 班", "C 班", "D 班"];

    const handleDropdownSelection = (selectedItem, dropdownType) => {
        switch (dropdownType) {
            case 'classType':
                setSelectedClassType(selectedItem);
                break;
            case 'listeningBook':
                setSelectedListeningBook(selectedItem);
                break;
            case 'exerciseBook':
                setSelectedExerciseBook(selectedItem);
                break;
            default:
                break;
        }
    };

    const handleInputChange = (text, inputType) => {
        switch (inputType) {
            case 'listeningBookStart':
                setListeningBookPages(prevState => ({ ...prevState, start: text }));
                break;
            case 'listeningBookEnd':
                setListeningBookPages(prevState => ({ ...prevState, end: text }));
                break;
            case 'exerciseBookStart':
                setExerciseBookPages(prevState => ({ ...prevState, start: text }));
                break;
            case 'exerciseBookEnd':
                setExerciseBookPages(prevState => ({ ...prevState, end: text }));
                break;
            default:
                break;
        }
    };

    const createTwoButtonAlert = () =>
        Alert.alert('再次確認', '確定要上傳聯絡簿嗎', [
            {
                text: '取消',
                onPress: () => {
                    // Add your logic to cancel the data upload here
                    console.log('Data upload cancelled');
                },
                style: 'cancel',
            },
            {
                text: '確定上傳',
                onPress: () => {
                    // Add your logic to proceed with the data upload here
                    console.log('OK Pressed - Uploading data');
                },
            },
        ]);


    const handleSave = () => {
        const homeworkRef = firebase.database().ref(`homework/${selectedClassType}/${currentMonth}`);
        const homeworkData = {
            日期: currentDate,
            星期幾: currentDayOfWeek,
            老師: teachername,
            班別: selectedClassType,
            聽力本: selectedListeningBook,
            聽力本頁數1: listeningBookPages.start,
            聽力本頁數2: listeningBookPages.end,
            習作本: selectedExerciseBook,
            習作本頁數1: exerciseBookPages.start,
            習作本頁數2: exerciseBookPages.end
        };

        // Use push to generate a unique key
        const newHomeworkRef = homeworkRef.push();
        const homeworkkey = newHomeworkRef.key;

        newHomeworkRef.set({
            ...homeworkData,
            homeworkID: homeworkkey,
        })
            .then(() => {
                // Code inside this block will run if the set operation is successful
                console.log("Homework data set successfully!");
                createTwoButtonAlert("Homework data set successfully!");
            })
            .catch((error) => {
                // Code inside this block will run if there is an error in the set operation
                console.error("Error setting homework data: ", error);
                createTwoButtonAlert("Error setting homework data. Please try again.");
            });

        const result = `班別: ${selectedClassType}\n聽力本: ${selectedListeningBook} (${listeningBookPages.start}頁~${listeningBookPages.end}頁)\n習作本: ${selectedExerciseBook} (${exerciseBookPages.start}頁~${exerciseBookPages.end}頁)`;
        setPreviewResult(result);
    };

    const renderContent = () => {
        return (
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={{
                    // width: '100%',
                    padding: 18,
                    margin: 15,
                    fontFamily: fontFamily,
                    backgroundColor: COLORS.main,
                    borderRadius: 20,
                }}>
                    {/* 班別 */}
                    <View style={styles.dropdownContainer}>
                        <Text style={styles.dropdownLabel}>班別 :</Text>
                        <SelectDropdown
                            data={classtype}
                            // defaultValueByIndex={0}
                            // defaultValue={'Egypt'}
                            onSelect={(selectedItem, index) => {
                                handleDropdownSelection(selectedItem, 'classType');
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
                        // search
                        // searchInputStyle={styles.dropdown1searchInputStyleStyle}
                        // searchPlaceHolder={'Search here'}
                        // searchPlaceHolderColor={'darkgrey'}
                        // renderSearchInputLeftIcon={() => {
                        //     return <FontAwesome name={'search'} color={'#444'} size={18} />;
                        // }}
                        />
                    </View>

                    {/* 聽力本 */}
                    <View style={styles.dropdownContainer}>
                        <Text style={styles.dropdownLabel}>聽力本 :</Text>
                        <SelectDropdown
                            data={listeningbooks}
                            // defaultValueByIndex={1}
                            // defaultValue={'Egypt'}
                            onSelect={(selectedItem, index) => {
                                handleDropdownSelection(selectedItem, 'listeningBook');
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
                        // search
                        // searchInputStyle={styles.dropdown1searchInputStyleStyle}
                        // searchPlaceHolder={'Search here'}
                        // searchPlaceHolderColor={'darkgrey'}
                        // renderSearchInputLeftIcon={() => {
                        //     return <FontAwesome name={'search'} color={'#444'} size={18} />;
                        // }}
                        />
                    </View>

                    {/* 聽力本頁數 */}
                    <View style={styles.dropdownContainer}>
                        <Text style={styles.dropdownLabel}>聽力本頁數 :</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="頁數..."
                            placeholderTextColor="black"
                            onChangeText={(text) => handleInputChange(text, 'listeningBookStart')}
                            keyboardType="numeric"
                        />
                        <Ionicons
                            name="play-forward-circle-outline"
                            size={25}
                            color="rgb(64, 98, 187)"
                            style={styles.icon}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="頁數..."
                            placeholderTextColor="black"
                            onChangeText={(text) => handleInputChange(text, 'listeningBookEnd')}
                            keyboardType="numeric"
                        />

                    </View>

                    {/* 習作本 */}
                    <View style={styles.dropdownContainer}>
                        <Text style={styles.dropdownLabel}>習作本 :</Text>
                        <SelectDropdown
                            data={books}
                            // defaultValueByIndex={1}
                            // defaultValue={'Egypt'}
                            onSelect={(selectedItem, index) => {
                                handleDropdownSelection(selectedItem, 'exerciseBook');
                                console.log(selectedItem, index);
                            }}
                            defaultButtonText={'選擇習作本'}
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
                        // search
                        // searchInputStyle={styles.dropdown1searchInputStyleStyle}
                        // searchPlaceHolder={'Search here'}
                        // searchPlaceHolderColor={'darkgrey'}
                        // renderSearchInputLeftIcon={() => {
                        //     return <FontAwesome name={'search'} color={'#444'} size={18} />;
                        // }}
                        />

                    </View>

                    {/* 習作本頁數 */}
                    <View style={styles.dropdownContainer}>
                        <Text style={styles.dropdownLabel}>習作本頁數 :</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="頁數..."
                            placeholderTextColor="black"
                            onChangeText={(text) => handleInputChange(text, 'exerciseBookStart')}
                            keyboardType="numeric"
                        />
                        <Ionicons
                            name="play-forward-circle-outline"
                            size={25}
                            color="rgb(64, 98, 187)"
                            style={styles.icon}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="頁數..."
                            placeholderTextColor="black"
                            onChangeText={(text) => handleInputChange(text, 'exerciseBookEnd')}
                            keyboardType="numeric"
                        />

                    </View>

                    {/* 預覽結果 */}
                    <View style={styles.resultContainer}>
                        <Text style={styles.previewLabel}>聯絡簿預覽結果 : </Text>
                        <View style={styles.resultItem}>
                            <View style={styles.inline}>
                                <Text style={styles.resultLabel}>班別: </Text>
                                <Text style={styles.resultText}>{selectedClassType}</Text>
                            </View>
                        </View>

                        <View style={styles.resultItem}>
                            <View style={styles.inline}>
                                <Text style={styles.resultLabel}>聽力本:</Text>
                                <Text style={styles.resultText}>{selectedListeningBook}</Text>
                            </View>
                            <View style={styles.inline}>
                                <Text style={styles.resultLabel}>聽力本頁數:</Text>
                                <Text style={styles.resultText}>{`${listeningBookPages.start} 頁 ~ ${listeningBookPages.end} 頁`}</Text>
                            </View>
                        </View>

                        <View style={styles.resultItem}>
                            <View style={styles.inline}>
                                <Text style={styles.resultLabel}>習作本:</Text>
                                <Text style={styles.resultText}>{selectedExerciseBook}</Text>
                            </View>
                            <View style={styles.inline}>
                                <Text style={styles.resultLabel}>習作本頁數:</Text>
                                <Text style={styles.resultText}>{`${exerciseBookPages.start} 頁 ~ ${exerciseBookPages.end} 頁`}</Text>
                            </View>
                        </View>

                        <Button title="Save" onPress={handleSave} style={styles.saveButton} />
                    </View>
                </View>
            </TouchableWithoutFeedback>
        );
    };


    return (
        <ScreenContainer>
            <FocusedStatusBar backgroundColor={COLORS.primary} />
            <SafeAreaView>
                <View style={{
                    padding: 20,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}>
                    {
                        codeVisible
                            ?
                            <Text style={{ fontSize: 30, fontFamily: FONTS.bold, color: 'red' }}>出聯絡簿</Text>
                            :
                            <Text style={{ fontSize: 30, fontFamily: FONTS.bold }}>聯絡簿</Text>
                    }
                    {
                        isTeacher === true
                            ?
                            <TouchableOpacity style={{ alignItems: 'center' }} onPress={() => setCodeVisible(!codeVisible)}>
                                {
                                    codeVisible === true ?
                                        <FontAwesome name="close" size={30} color="black" />
                                        :
                                        <FontAwesome name="pencil-square-o" size={30} color="black" />
                                }
                            </TouchableOpacity>
                            :
                            ''
                    }
                </View>
            </SafeAreaView>
            <View style={styles.container}>
                {/* <Text style={styles.heading}>Homework</Text> */}
                {codeVisible && renderContent()}
                {
                    codeVisible === false ?
                        <HomeworkData />
                        :
                        ""
                }
            </View>


        </ScreenContainer>
    );
};

const height = 30;
const fontFamily = FONTS.bold;

const styles = {
    container: {
        alignItems: "center",
        justifyContent: "center",
    },
    heading: {
        fontSize: 26,
        fontWeight: "bold",
        marginVertical: 20,
        color: COLORS.primaryText,
        fontFamily: fontFamily,
    },
    sectionContainer: {
        width: '100%',
        padding: 20,
        fontFamily: fontFamily,
    },
    targetDateStyle: {
        backgroundColor: COLORS.main, // Example: Change the background color
    },
    label: {
        fontSize: 18,
        marginBottom: 10,
        color: COLORS.primaryText,
        fontFamily: fontFamily,
    },

    input: {
        flex: 1,
        padding: 10,
        backgroundColor: '#FFF',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#444',
        fontSize: 16,
        fontFamily: fontFamily,
    },
    icon: {
        marginLeft: 10,
        marginRight: 10,
    },

    // Preview Part
    resultContainer: {
        marginTop: 10,
        padding: 15,
        backgroundColor: COLORS.lightgray,
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
        marginTop: 5,
        fontFamily: fontFamily,
    },
    resultLabel: {
        fontSize: 17,
        color: 'gray',
        fontFamily: fontFamily,
    },
    resultText: {
        fontSize: 17,
        fontFamily: fontFamily,
    },
    saveButton: {
        color: COLORS.primary, // Make sure COLORS is defined in your constants
        fontFamily: fontFamily,
        backgroundColor: 'black'
    },

    // Dropdown Part
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
        height: height,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F6F6F6',
        fontFamily: fontFamily,
    },

    headerTitle: { color: '#000', fontWeight: 'bold', fontSize: 16, fontFamily: fontFamily, },
    saveAreaViewContainer: { flex: 1, backgroundColor: '#FFF' },
    viewContainer: { flex: 1, width, backgroundColor: '#FFF' },
    scrollViewContainer: {
        flexGrow: 1,
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: '10%',
        paddingBottom: '20%',
        fontFamily: fontFamily,
    },

    dropdown1BtnStyle: {
        width: '70%',
        height: height,
        backgroundColor: '#FFF',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#444',
        fontFamily: fontFamily,
    },
    dropdownContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        fontFamily: fontFamily,
    },
    dropdownLabel: {
        width: '30%',
        fontSize: 18,
        fontFamily: fontFamily,
    },
    dropdown: {
        width: '70%',
        backgroundColor: '#FFF',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#444',
        fontFamily: fontFamily,
    },
    dropdown1BtnTxtStyle: { color: '#444', textAlign: 'left', fontFamily: fontFamily, },
    dropdown1DropdownStyle: { backgroundColor: '#EFEFEF', fontFamily: fontFamily, },
    dropdown1RowStyle: { backgroundColor: '#EFEFEF', borderBottomColor: '#C5C5C5', fontFamily: fontFamily, },
    dropdown1RowTxtStyle: { color: '#444', textAlign: 'left', fontFamily: fontFamily, },
    dropdown1SelectedRowStyle: { backgroundColor: 'rgba(0,0,0,0.1)', fontFamily: fontFamily, },
    dropdown1searchInputStyleStyle: {
        height: height,
        backgroundColor: '#EFEFEF',
        borderRadius: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#444',
        fontFamily: fontFamily,
    },
};

export default Homework;
