import { View, SafeAreaView, Text, FlatList, Image, StyleSheet, ActivityIndicator, TouchableOpacity, ScrollView, Dimensions } from "react-native";
import React, { Component, useEffect, useState } from 'react';
import { HomeHeader, FocusedStatusBar } from "../components";
import { COLORS, FONTS } from "../constants";
import { db } from "./firebase-config";
import { collection, getDocs, query, where, orderBy } from "@firebase/firestore";
import ScreenContainer from "./ScreenContainer";
import { AntDesign, Ionicons } from "@expo/vector-icons";


const fontfamily = FONTS.bold;
const fontSize = Dimensions.get('window').height < 800 ? 13 : 15;

class Leaderboard extends Component {
  state = {
    studentsA: null,
    studentsB: null,
    studentsC: null,
    studentsD: null,
    loading: true,
  }
  //當月最後一天日期計算
  currentDate = new Date();
  currentYear = this.currentDate.getFullYear();
  currentMonth = this.currentDate.getMonth() + 1;
  lastDayOfMonth = new Date(this.currentYear, this.currentMonth, 0).getDate();
  lastDayOfMonthFormatted = this.currentYear + '-' + ('0' + this.currentMonth).slice(-2) + '-' + ('0' + this.lastDayOfMonth).slice(-2);

  //將當月最後一天日期換成Millisecond
  currentDate = new Date();
  currentMonthLastDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 0);
  currentMonthLastDateMs = this.currentMonthLastDate.getTime();

  componentDidMount() {
    try {
      async function getStudents(classParam, orderByParam, monthParam, setStateFunc) {
        // collection(db, "student")
        //   .where('class', '==', classParam)
        //   .where('onlinemonth', '==', monthParam)
        //   .where('totaltimeplayed', '>', 0)
        //   .orderBy(orderByParam, 'desc')
        //   .get()
        //   .then((snapshot) => {
        //     const students = [];
        //     snapshot.forEach((doc) => {
        //       const data = doc.data();
        //       students.push(data);
        //     })
        //     setStateFunc(students);
        //   })
        //   .catch((err) => {
        //     console.log(err)
        //   });
        const q = query(collection(db, 'student'),
          where('class', '==', classParam),
          where('onlinemonth', '==', monthParam),
          where('totaltimeplayed', '>', 0),
          orderBy(orderByParam, 'desc')
        );
        const snapshot = await getDocs(q);
        const students = [];
        snapshot.forEach((doc) => {
          const data = doc.data();
          students.push(data);
        });

        setStateFunc(students);
      }
      // const getOfflineStudents = (classParam, setStateFunc) => {
      //   const db = firebase.firestore();
      //   db.collection("student")
      //     .where('class', '==', classParam)
      //     .where('onlinetime', '<=', offlinelimit)
      //     .get()
      //     .then((snapshot) => {
      //       const students = [];
      //       snapshot.forEach((doc) => {
      //         const data = doc.data();
      //         students.push(data);
      //       })
      //       setStateFunc(students);
      //     })
      //     .catch((err) => {
      //       console.log(err)
      //     });
      // }

      const d = new Date();
      d.setDate(d.getDate() - 3);
      const offlinelimit = d.toJSON().slice(0, 10);
      const currentMonth = new Date().toJSON().slice(0, 7);
      Promise.all([
        getStudents("A", 'totaltimeplayed', currentMonth, (students) => {
          this.setState({ studentsA: students });
        }),
        getStudents("B", 'totaltimeplayed', currentMonth, (students) => {
          this.setState({ studentsB: students });
        }),
        getStudents("C", 'totaltimeplayed', currentMonth, (students) => {
          this.setState({ studentsC: students });
        }),
        getStudents("D", 'totaltimeplayed', currentMonth, (students) => {
          this.setState({ studentsD: students });
        }),
        // getOfflineStudents('A', (students) => {
        //   this.setState({ OfflineA: students });
        // }),

      ])
        .then(() => {
          this.setState({ loading: false });
        })
        .catch((error) => {
          console.log(error);
          this.setState({ loading: false });
        });
    } catch {
      alert('nothing')
    }
  }

  renderClassContainer(classKey, students) {
    const columns = [
      { label: "名次", icon: "Trophy" },
      { label: "姓名", icon: "smileo" },
      { label: "上線日期", icon: "calendar" },
      { label: "播放次數", icon: "playcircleo" }
    ];

    // const columns = ["名次", "姓名", "上線日期", "播放次數"];
    return (
      <View style={styles.container} key={classKey}>
        <Text style={styles.heading}>{`${classKey}班`}</Text>
        {this.state.loading ? (
          <ActivityIndicator
            size="large"
            color={COLORS.primary}
          />
        ) : (
          <>
            <View style={styles.titleBar}>
              {
                columns.map((column, index) => (
                  <Text key={index} style={styles.titleColumn}>
                    {/* <Text>
                      <AntDesign name={column.icon} size={fontSize} color={COLORS.primary} />
                    </Text> */}
                    <Text>
                      {column.label}
                    </Text>
                  </Text>
                ))}
            </View>

            <FlatList
              data={students}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item, index }) => (
                <View style={styles.studentContainer}>
                  <Text style={
                    [
                      styles.place,
                      { textAlign: 'center' }
                    ]}
                  >
                    {index + 1}
                  </Text>
                  <Text style={styles.studentInfo}>{item.name}</Text>
                  <Text style={styles.studentInfo}>{item.onlinetime}</Text>
                  <Text style={styles.studentInfo}>{item.totaltimeplayed}</Text>
                </View>
              )}
              ListEmptyComponent={
                <Text style={styles.noData}>No online students available</Text>
              }
            />
          </>
        )}
      </View>
    );
  }


  render() {
    const { studentsA, studentsB, studentsC, studentsD } = this.state;
    // const allStudents = [
    //   { key: 'A', students: studentsA },
    //   { key: 'B', students: studentsB },
    //   { key: 'C', students: studentsC },
    //   { key: 'D', students: studentsD },
    // ].flatMap(({ key, students }) => students ? students.map(student => ({ ...student, class: key })) : []);
    const classData = [
      { key: 'A', students: studentsA },
      { key: 'B', students: studentsB },
      { key: 'C', students: studentsC },
      { key: 'D', students: studentsD },
    ];
    // const currentDate = new Date();
    // const currentMonthLastDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    // const currentMonthLastDateMs = currentMonthLastDate.getTime();
    return (
      <ScreenContainer>
        <HomeHeader display="none" />
        <View style={{
          alignItems: 'center',
          justifyContent: 'center',
          alignContent: 'center',
          marginTop: 10,
        }}>
          <Text style={{
            fontSize: 40,
            letterSpacing: 1,
            color: '#2d7dd2',
            fontFamily: FONTS.mainFont,
            textShadowColor: '#2d7dd2', // set the color of the outline
            textShadowOffset: { width: 0.6, height: 0 }, // set the offset of the shadow
            textShadowRadius: 0, // set the radius of the shadow
          }}>Leaderboard</Text>
        </View>
        <ScrollView style={{ flex: 1, paddingBottom: 10 }}>
          {classData.map(({ key, students }) =>
            this.renderClassContainer(key, students)
          )}
          <View style={styles.endOfList}>
            <Ionicons
              name="checkmark-done-circle-outline"
              size={30}
              color="rgb(64, 98, 187)"
              style={{}}
            />
            <Text style={styles.endOfListText}>
              這是排行榜的末端了
            </Text>
            <Ionicons
              name="checkmark-done-circle-outline"
              size={30}
              color="rgb(64, 98, 187)"
              style={{}}
            />
          </View>
        </ScrollView>
        {/* <FlatList
          style={{ flex: 1, paddingBottom: 10 }}
          data={allStudents}
          keyExtractor={(item, index) => `${item.name}-${index}`}
          renderItem={({ item }) => (
            <View style={styles.container}>
              <Text style={styles.heading}>{`${item.class}班`}</Text>
              {this.state.loading ? (
                <ActivityIndicator
                  size="large"
                  color={COLORS.primary}
                />
              ) : (
                <>
                  <View style={styles.titleBar}>
                    {columns.map((column, index) => (
                      <Text key={index} style={styles.titleColumn}>
                        {column.label}
                      </Text>
                    ))}
                  </View>

                  <View style={styles.studentContainer}>
                    <Text style={[styles.place, { textAlign: 'center' }]}>
                      {item.name}
                    </Text>
                    <Text style={styles.studentInfo}>{item.onlinetime}</Text>
                    <Text style={styles.studentInfo}>{item.totaltimeplayed}</Text>
                  </View>
                </>
              )}
            </View>
          )}
          ListFooterComponent={
            <View style={styles.endOfList}>
              <Ionicons
                name="checkmark-done-circle-outline"
                size={30}
                color="rgb(64, 98, 187)"
                style={{}}
              />
              <Text style={styles.endOfListText}>
                這是排行榜的末端了
              </Text>
              <Ionicons
                name="checkmark-done-circle-outline"
                size={30}
                color="rgb(64, 98, 187)"
                style={{}}
              />
            </View>
          }
        /> */}
      </ScreenContainer>
    );
  }
}


const styles = StyleSheet.create({
  container: {
    // padding: 10,
    paddingTop: 10,
    paddingBottom: 10,
    borderRadius: 8,
  },
  heading: {
    fontSize: 15,
    fontFamily: fontfamily,
    letterSpacing: 2,
    marginBottom: 10,
    textAlign: 'center',
    backgroundColor: '#2ba84a',
    // backgroundColor: 'rgb(0, 91, 127)',
    color: 'white',
    paddingTop: 8,
    paddingBottom: 8,
    borderRadius: 10,
  },
  titleBar: {
    marginBottom: 10,
    flexDirection: 'row',
    marginBottom: 10,
  },
  titleColumn: {
    flex: 1,
    fontSize: fontSize,
    fontWeight: 'bold',
    textAlign: 'center',
    fontFamily: fontfamily,
    // borderBottomColor: 'gray',
    // borderStyle: 'solid',
    // borderBottomWidth: 1,
  },
  studentContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    // borderBottomColor: 'gray',
    // borderStyle: 'solid',
    // borderBottomWidth: 1,
  },
  place: {
    flex: 1,
    fontSize: fontSize,
    textAlign: 'center',
    fontFamily: fontfamily,
  },
  studentInfo: {
    flex: 1,
    fontSize: fontSize,
    color: 'black',
    textAlign: 'center',
    fontFamily: fontfamily,
  },
  noData: {
    fontStyle: 'italic',
    color: '#777',
    textAlign: 'center',
    fontFamily: fontfamily,
  },
  endOfList: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    marginTop: 10, // Add margin or adjust as needed
    marginBottom: 10,
    gap: 5,
  },
  endOfListText: {
    fontSize: 16,
    color: COLORS.gray,
    textTransform: 'uppercase',
  },
})

export default Leaderboard;






