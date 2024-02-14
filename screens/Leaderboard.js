import { View, SafeAreaView, Text, FlatList, Image, StyleSheet, ActivityIndicator, TouchableOpacity, ScrollView } from "react-native";
import React, { Component } from 'react';
import { HomeHeader, FocusedStatusBar } from "../components";
import { COLORS, FONTS } from "../constants";
import firebase from "firebase";
import first from '../assets/img/firstplace.png'
import second from '../assets/img/secondplace.png'
import third from '../assets/img/thirdplace.png'
import ScreenContainer from "./ScreenContainer";
import { Ionicons } from "@expo/vector-icons";

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
      const getStudents = (classParam, orderByParam, monthParam, setStateFunc) => {
        const db = firebase.firestore();
        db.collection("student")
          .where('class', '==', classParam)
          .where('onlinemonth', '==', monthParam)
          .where('totaltimeplayed', '>', 0)
          .orderBy(orderByParam, 'desc')
          .get()
          .then((snapshot) => {
            const students = [];
            snapshot.forEach((doc) => {
              const data = doc.data();
              students.push(data);
            })
            setStateFunc(students);
          })
          .catch((err) => {
            console.log(err)
          });
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
    const columns = ["名次", "姓名", "上線日期", "播放次數"];
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
                    {column}
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
                  <Text style={styles.studentName}>{item.name}</Text>
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
        }}>
          <Text style={{
            fontSize: 45,
            color: '#2d7dd2',
            fontFamily: FONTS.VarelaRound,
            fontWeight: '900',
          }}>Leaderboard</Text>
        </View>
        <ScrollView style={{ flex: 1, paddingBottom: 30 }}>
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
    fontSize: 16,
    fontWeight: '900',
    fontFamily: FONTS.VarelaRound,
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
    flexDirection: 'row',
    marginBottom: 10,
  },
  titleColumn: {
    flex: 1,
    fontWeight: 'bold',
    textAlign: 'center',
    fontFamily: FONTS.VarelaRound,
    fontWeight: '800',
    borderBottomColor: 'gray',
    borderStyle: 'solid',
    borderBottomWidth: 1,
  },
  studentContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    borderBottomColor: 'gray',
    borderStyle: 'solid',
    borderBottomWidth: 1,
  },
  place: {
    flex: 1,
    textAlign: 'center',
    fontFamily: FONTS.VarelaRound,
    fontWeight: '800'
  },
  studentName: {
    flex: 1,
    fontSize: 14,
    textAlign: 'center',
    fontFamily: FONTS.VarelaRound,
    fontWeight: '800'
  },
  studentInfo: {
    flex: 1,
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
    fontFamily: FONTS.VarelaRound,
    fontWeight: '800'
  },
  noData: {
    fontStyle: 'italic',
    color: '#777',
    textAlign: 'center',
    fontFamily: FONTS.VarelaRound,
  },
  endOfList: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    marginTop: 10, // Add margin or adjust as needed
    marginBottom: 30,
    gap: 5,
  },
  endOfListText: {
    fontSize: 16,
    color: COLORS.gray,
    textTransform: 'uppercase',
  },
})

export default Leaderboard;

