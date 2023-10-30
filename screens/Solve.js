import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { FONTS } from '../constants';

const SolvePage = () => {
    return (
        <View style={styles.solvePageContainer}>

            <View style={styles.solvePage}>
                <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                    <Text style={styles.linkText}>回到登入頁面</Text>
                </TouchableOpacity>
                <Text style={styles.headerText}>疑難排解</Text>
                <Text style={styles.normalText}>
                    <Text style={styles.labelText}>帳號:</Text>
                    <Text style={styles.normalText}>
                        英文名字姓@gmail.com
                    </Text>
                </Text>
                <Text style={styles.normalText}>例如: victorhsu@gmail.com</Text>
                <Text style={styles.normalText}>（請記得在英文名字後面加上自己的姓）</Text>
                <Text style={styles.normalText}>
                    <Text style={styles.labelText}>密碼:</Text>
                    <Text style={styles.normalText}>
                        123456
                    </Text>
                </Text>
                <Text style={styles.normalText}>聯絡工程師: 0908525057</Text>
                <Text style={styles.normalText}>連絡時間: 上午9:00 ~ 下午9:00</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    solvePageContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f2f2f2',
        fontFamily: FONTS.VarelaRound,
    },
    solvePage: {
        width: 400,
        padding: 30,
        borderRadius: 5,
        backgroundColor: 'white',
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
    },
    linkText: {
        display: 'block',
        marginBottom: 20,
        color: '#0077cc',
        textDecorationLine: 'none',
        fontSize: 16,
        fontWeight: 900,
        transition: 'all 0.2s ease-in-out',
    },
    linkTextHover: {
        textDecorationLine: 'underline',
    },
    headerText: {
        marginBottom: 10,
        fontSize: 24,
        fontWeight: 'bold',
    },
    labelText: {
        marginBottom: 10,
        fontSize: 16,
        color: 'red',
        fontWeight: '700',
    },
    normalText: {
        marginBottom: 10,
        fontSize: 16,
        fontWeight: '700',
    }
});

export default SolvePage;
