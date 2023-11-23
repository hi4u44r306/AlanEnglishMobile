// BigScreen.js

import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { AntDesign } from '@expo/vector-icons';

const BigScreen = ({ music, onClose }) => {
    return (
        <View style={styles.container}>
            {/* Display big screen content */}
            <Text style={styles.title}>{music.bookname}</Text>
            <Text style={styles.subtitle}>{`Page ${music.page}`}</Text>
            {/* Add additional information or components as needed */}

            {/* Close button */}
            <AntDesign name="close" size={24} color="black" style={styles.closeButton} onPress={onClose} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    subtitle: {
        fontSize: 18,
    },
    closeButton: {
        position: 'absolute',
        top: 10,
        right: 10,
    },
});

export default BigScreen;
