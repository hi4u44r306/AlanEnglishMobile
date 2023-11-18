import React, { useState, useEffect } from "react";
import { View, SafeAreaView, Text, TextInput, CheckBox, Button } from "react-native";

import { HomeHeader, FocusedStatusBar } from "../components";
import { COLORS } from "../constants";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Homework = () => {
    const [isTeacher, setIsTeacher] = useState(true);
    const [booksToRead, setBooksToRead] = useState([]);
    const [bookPages, setBookPages] = useState("");
    const [wordsToWrite, setWordsToWrite] = useState("");
    const [previewResult, setPreviewResult] = useState("");

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
        <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
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
                        <View style={{ width: "80%" }}>
                            <CheckBox
                                value={booksToRead.includes("Book1")}
                                onValueChange={() => handleBookCheck("Book1")}
                            />
                            <Text style={{ color: COLORS.primaryText }}>Book 1</Text>

                            <CheckBox
                                value={booksToRead.includes("Book2")}
                                onValueChange={() => handleBookCheck("Book2")}
                            />
                            <Text style={{ color: COLORS.primaryText }}>Book 2</Text>

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
                            />

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
        </SafeAreaView>
    );
};

const styles = {
    input: {
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 5,
        padding: 10,
        marginTop: 10,
        marginBottom: 10,
        color: COLORS.primaryText,
    },
};

export default Homework;
