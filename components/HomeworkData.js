// import { FontAwesome } from '@expo/vector-icons';
// import React from 'react'
// import { useEffect } from 'react';
// import { useState } from 'react';
// import { FlatList, View, Text, Dimensions } from 'react-native';
// import firebase from 'firebase';
// import { COLORS, FONTS } from '../constants';

// function HomeworkData() {
//     const [homeworkdata, setHomeworkData] = useState([]);
//     const currentMonth = new Date().toJSON().slice(0, 7);

//     useEffect(() => {
//         fetchDatafromRealtimeDB();
//     }, []);

//     const fetchDatafromRealtimeDB = () => {
//         var PostRef = firebase.database().ref(`homework/${'A 班'}/${currentMonth}`);
//         PostRef.on('value', (snapshot) => {
//             const data = snapshot.val();
//             const dataArray = Object.entries(data).map(([date, details]) => ({
//                 date,
//                 ...details,
//             }));
//             setHomeworkData(dataArray);
//         }
//         );
//     }
//     return (
//         <View style={styles.sectionContainer}>
//             <FlatList
//                 data={homeworkdata}
//                 keyExtractor={(item) => item.homeworkID.toString()}
//                 renderItem={({ item }) => {
//                     const isTargetDate = item.日期 === '2023-11-27';
//                     return (
//                         <View
//                             style={[styles.resultContainer, isTargetDate ? styles.targetDateStyle : null]}
//                         >
//                             <View>
//                                 <View style={{
//                                     flexDirection: 'row',
//                                     alignItems: 'center',
//                                 }}>
//                                     <FontAwesome name="pencil-square" size={25} color="rgb(64, 98, 187)" />
//                                     <Text style={{ fontSize: 18, marginLeft: 25, fontFamily: FONTS.bold }}>
//                                         {item.日期} ( {item.星期幾} ) 聯絡簿
//                                     </Text>
//                                 </View>
//                                 <View style={styles.resultItem}>
//                                     <View style={styles.inline}>
//                                         <Text style={styles.resultLabel}>班別: </Text>
//                                         <Text style={styles.resultText}>{item.班別}</Text>
//                                     </View>
//                                 </View>

//                                 <View style={styles.resultItem}>
//                                     <View style={styles.inline}>
//                                         <Text style={styles.resultLabel}>聽力本:</Text>
//                                         <Text style={styles.resultText}>( {item.聽力本} ) {`P.${item.聽力本頁數1} ~ P.${item.聽力本頁數2}`}</Text>
//                                     </View>
//                                 </View>

//                                 <View style={styles.resultItem}>
//                                     <View style={styles.inline}>
//                                         <Text style={styles.resultLabel}>習作本:</Text>
//                                         <Text style={styles.resultText}>( {item.習作本} ) {`P.${item.習作本頁數1} ~ P.${item.習作本頁數2}`}</Text>
//                                     </View>
//                                 </View>
//                             </View>
//                         </View>
//                     )
//                 }}
//             />
//         </View>
//     )
// }

// const fontFamily = FONTS.bold;

// const styles = {
//     sectionContainer: {
//         width: '100%',
//         padding: 20,
//         fontFamily: fontFamily,
//     },
//     targetDateStyle: {
//         backgroundColor: COLORS.main, // Example: Change the background color
//     },
//     resultContainer: {
//         marginTop: 10,
//         padding: 15,
//         backgroundColor: COLORS.lightgray,
//         borderRadius: 10,
//         fontFamily: fontFamily,
//     },
//     inline: {
//         flexDirection: 'row',
//         alignItems: 'center', // Optional: Align items vertically in the center
//         justifyContent: 'space-between',
//         borderBottomColor: 'gray',
//         borderBottomWidth: 1,
//     },
//     resultItem: {
//         marginTop: 5,
//         fontFamily: fontFamily,
//     },
//     resultLabel: {
//         fontSize: 17,
//         color: 'gray',
//         fontFamily: fontFamily,
//     },
//     resultText: {
//         fontSize: 17,
//         fontFamily: fontFamily,
//     },

// };

// export default HomeworkData