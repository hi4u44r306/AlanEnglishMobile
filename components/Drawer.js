import { AntDesign, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { Dimensions, TouchableOpacity, View } from "react-native";
import { Text, StyleSheet } from "react-native";
import { COLORS } from "../constants";

const Drawer = () => {
    const iconcolor = 'black';
    return (
        <View style={styles.container}>
            <View style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                gap: 10,
                marginBottom: 10,
            }}>
                {/* <AntDesign name="close" color={'white'} size={35} /> */}
                <MaterialCommunityIcons name="arrow-down" color={iconcolor} size={35} />
                <Text style={{ color: 'black' }}>往下滑即可關閉</Text>
            </View>
            <View style={styles.item}>
                <AntDesign style={styles.itemimage} name="setting" color={iconcolor} size={25} />
                <Text style={styles.itemtext}>
                    設定
                </Text>
            </View>
            <View style={styles.item}>
                <AntDesign style={styles.itemimage} name="user" color={iconcolor} size={25} />
                <Text style={styles.itemtext}>
                    隱私
                </Text>
            </View>
            <View style={styles.item}>
                <Ionicons style={styles.itemimage} name="notifications-outline" color={iconcolor} size={25} />
                <Text style={styles.itemtext}>
                    通知
                </Text>
            </View>
        </View>
    );
};

export default Drawer;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.ricewhite,
        padding: 20,
    },
    item: {
        flexDirection: 'row',
        alignContent: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 25,
        // marginLeft: 20,
        gap: 30,
    },
    itemtext: {
        color: 'black',
        fontSize: 20,
    },
    itemimage: {
        // marginRight: 20,
    }
})