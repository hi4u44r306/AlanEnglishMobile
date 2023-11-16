import { View, SafeAreaView, Text, FlatList, Image, StyleSheet, ActivityIndicator, TouchableOpacity, ScrollView } from "react-native";
import React, { Component } from 'react';
import { HomeHeader, FocusedStatusBar } from "../components";
import { COLORS } from "../constants";
import firebase from "firebase";
import first from '../assets/img/firstplace.png'
import second from '../assets/img/secondplace.png'
import third from '../assets/img/thirdplace.png'

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


  render() {
    const columns = ["名次", "姓名", "上線日期", "播放次數"];
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>

        {/* FocusedStatusBar and Homeheader always on the top */}
        <FocusedStatusBar backgroundColor={COLORS.primary} />
        <HomeHeader display='none' />
        {/* FocusedStatusBar and Homeheader always on the top */}

        <ScrollView style={{ flex: 1, backgroundColor: 'white' }}
          stickyHeaderIndices={[0]}>
          <View style={{ flex: 1 }}>
            {/* A班 */}
            <View style={styles.container}>
              <Text style={styles.heading}>A班</Text>
              {this.state.loading ? (
                <ActivityIndicator size="large" color={COLORS.primary} />
              ) : (
                <>
                  <FlatList
                    ListHeaderComponent={
                      <View style={styles.titleBar}>
                        {columns.map((column, index) => (
                          <Text key={index} style={styles.titleColumn}>
                            {column}
                          </Text>
                        ))}
                      </View>
                    }
                    data={this.state.studentsA}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item, index }) => (
                      <View style={styles.studentContainer}>
                        <Text style={[styles.place, { textAlign: 'center' }]}>
                          {/* {index < 3 ? (
                            <Image
                              style={{ width: 20, height: 20 }}
                              source={[first, second, third][index]}
                              alt={`${index + 1}st`}
                            />
                          ) : (
                            index + 1
                          )} */}
                          {index + 1}
                        </Text>
                        <Text style={styles.studentName}>{item.name}</Text>
                        <Text style={styles.studentInfo}>{item.onlinetime}</Text>
                        <Text style={styles.studentInfo}>{item.totaltimeplayed}</Text>
                      </View>
                    )}
                    ListEmptyComponent={<Text style={styles.noData}>No online students available</Text>}
                  />
                </>
              )}
            </View>
            {/* B班 */}
            <View style={styles.container}>
              <Text style={styles.heading}>B班</Text>
              {this.state.loading ? (
                <ActivityIndicator size="large" color={COLORS.primary} />
              ) : (
                <>
                  <FlatList
                    ListHeaderComponent={
                      <View style={styles.titleBar}>
                        {columns.map((column, index) => (
                          <Text key={index} style={styles.titleColumn}>
                            {column}
                          </Text>
                        ))}
                      </View>
                    }
                    data={this.state.studentsB}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item, index }) => (
                      <View style={styles.studentContainer}>
                        <Text style={styles.place}>
                          {/* {index < 3 ? (
                            <Image
                              style={{ width: 20, height: 20 }}
                              source={[first, second, third][index]}
                              alt={`${index + 1}st`}
                            />
                          ) : (
                            index + 1
                          )} */}
                          {index + 1}
                        </Text>
                        <Text style={styles.studentName}>{item.name}</Text>
                        <Text style={styles.studentInfo}>{item.onlinetime}</Text>
                        <Text style={styles.studentInfo}>{item.totaltimeplayed}</Text>
                      </View>
                    )}
                    ListEmptyComponent={<Text style={styles.noData}>No online students available</Text>}
                  />
                </>
              )}
            </View>
            {/* C班 */}
            <View style={styles.container}>
              <Text style={styles.heading}>C班</Text>
              {this.state.loading ? (
                <ActivityIndicator size="large" color={COLORS.primary} />
              ) : (
                <>
                  <FlatList
                    ListHeaderComponent={
                      <View style={styles.titleBar}>
                        {columns.map((column, index) => (
                          <Text key={index} style={styles.titleColumn}>
                            {column}
                          </Text>
                        ))}
                      </View>
                    }
                    data={this.state.studentsC}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item, index }) => (
                      <View style={styles.studentContainer}>
                        <Text style={styles.place}>
                          {/* {index < 3 ? (
                            <Image
                              style={{ width: 20, height: 20 }}
                              source={[first, second, third][index]}
                              alt={`${index + 1}st`}
                            />
                          ) : (
                            index + 1
                          )} */}
                          {index + 1}
                        </Text>
                        <Text style={styles.studentName}>{item.name}</Text>
                        <Text style={styles.studentInfo}>{item.onlinetime}</Text>
                        <Text style={styles.studentInfo}>{item.totaltimeplayed}</Text>
                      </View>
                    )}
                    ListEmptyComponent={<Text style={styles.noData}>No online students available</Text>}
                  />
                </>
              )}
            </View>
            {/* D班 */}
            <View style={styles.container}>
              <Text style={styles.heading}>D班</Text>
              {this.state.loading ? (
                <ActivityIndicator size="large" color={COLORS.primary} />
              ) : (
                <>
                  <FlatList
                    ListHeaderComponent={
                      <View style={styles.titleBar}>
                        {columns.map((column, index) => (
                          <Text key={index} style={styles.titleColumn}>
                            {column}
                          </Text>
                        ))}
                      </View>
                    }
                    data={this.state.studentsD}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item, index }) => (
                      <View style={styles.studentContainer}>
                        <Text style={styles.place}>
                          {/* {index < 3 ? (
                            <Image
                              style={{ width: 20, height: 20 }}
                              source={[first, second, third][index]}
                              alt={`${index + 1}st`}
                            />
                          ) : (
                            index + 1
                          )} */}
                          {index + 1}
                        </Text>
                        <Text style={styles.studentName}>{item.name}</Text>
                        <Text style={styles.studentInfo}>{item.onlinetime}</Text>
                        <Text style={styles.studentInfo}>{item.totaltimeplayed}</Text>
                      </View>
                    )}
                    ListEmptyComponent={<Text style={styles.noData}>No online students available</Text>}
                  />
                </>
              )}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: '#fcf8ec',
    borderRadius: 8,
    // marginVertical: 10,
  },
  heading: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    backgroundColor: 'rgb(0, 91, 127)',
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
  },
  studentContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  place: {
    flex: 1,
    textAlign: 'center',
  },
  studentName: {
    flex: 1,
    fontSize: 14,
    textAlign: 'center',
  },
  studentInfo: {
    flex: 1,
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
  },
  noData: {
    fontStyle: 'italic',
    color: '#777',
    textAlign: 'center',
  },
})

export default Leaderboard;

