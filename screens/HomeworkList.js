import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ScrollView,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { onValue, off, ref as rtdbRef, update, remove } from "firebase/database";
import { rtdb } from "./firebase-config";
import Toast from "react-native-toast-message";
import ScreenContainer from "./ScreenContainer";

const HomeworkList = () => {
  const [selectedClass, setSelectedClass] = useState("E1");
  const [homeworkEntries, setHomeworkEntries] = useState([]);
  // editingEntries: 用來儲存每個日期的編輯資料
  const [editingEntries, setEditingEntries] = useState({});

  // 讀取指定班級的所有作業（依日期分類）
  useEffect(() => {
    if (selectedClass) {
      const classRef = rtdbRef(rtdb, `HomeworkAssignments/${selectedClass}`);
      const handleValueChange = (snapshot) => {
        const data = snapshot.val();
        if (data) {
          // 轉換成陣列格式，每筆資料包含日期與內容
          const entries = Object.keys(data).map((date) => ({
            date,
            ...data[date],
          }));
          setHomeworkEntries(entries);
        } else {
          setHomeworkEntries([]);
        }
      };
      onValue(classRef, handleValueChange);
      return () => off(classRef, "value", handleValueChange);
    }
  }, [selectedClass]);

  // 切換編輯模式
  const toggleEditMode = (date, entry) => {
    if (editingEntries[date]) {
      // 若已在編輯狀態則取消
      setEditingEntries((prev) => {
        const newEditing = { ...prev };
        delete newEditing[date];
        return newEditing;
      });
    } else {
      // 初始化編輯資料：複製原本的 entry
      setEditingEntries((prev) => ({ ...prev, [date]: { ...entry } }));
    }
  };

  // 處理編輯時內部 assignments 陣列的修改（例如針對單筆作業項目）
  const handleAssignmentChange = (date, index, field, value) => {
    setEditingEntries((prev) => {
      const entry = prev[date];
      if (entry) {
        const newAssignments = entry.assignments.map((item, i) => {
          if (i === index) {
            return { ...item, [field]: value };
          }
          return item;
        });
        return { ...prev, [date]: { ...entry, assignments: newAssignments } };
      }
      return prev;
    });
  };

  // 更新作業資料到 Firebase
  const handleSave = async (date) => {
    const updatedEntry = editingEntries[date];
    try {
      await update(
        rtdbRef(rtdb, `HomeworkAssignments/${selectedClass}/${date}`),
        updatedEntry
      );
      Toast.show({ type: "success", text1: "更新成功！" });
      // 移除編輯狀態
      setEditingEntries((prev) => {
        const newEditing = { ...prev };
        delete newEditing[date];
        return newEditing;
      });
    } catch (error) {
      console.error("更新失敗：", error);
      Toast.show({ type: "error", text1: "更新失敗！" });
    }
  };

  // 刪除作業資料
  const handleDelete = async (date) => {
    try {
      await remove(rtdbRef(rtdb, `HomeworkAssignments/${selectedClass}/${date}`));
      Toast.show({ type: "success", text1: "刪除成功！" });
    } catch (error) {
      console.error("刪除失敗：", error);
      Toast.show({ type: "error", text1: "刪除失敗！" });
    }
  };

  return (
    <ScreenContainer>
      <ScrollView style={styles.container}>
        <Text style={styles.title}>作業列表</Text>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>班級</Text>
          <Picker
            selectedValue={selectedClass}
            style={styles.input}
            onValueChange={(value) => setSelectedClass(value)}
          >
            <Picker.Item label="選擇班級..." value="" />
            <Picker.Item label="E1" value="E1" />
            <Picker.Item label="E3" value="E3" />
            <Picker.Item label="E5" value="E5" />
            <Picker.Item label="E7" value="E7" />
            <Picker.Item label="Teacher" value="Teacher" />
          </Picker>
          {homeworkEntries.length === 0 && (
            <Text style={styles.noDataText}>目前沒有作業</Text>
          )}

          {homeworkEntries.map((entry) => {
            const { date, assignments, createdAt } = entry;
            const isEditing = !!editingEntries[date];
            return (
              <View key={date} style={styles.entryContainer}>
                <Text style={styles.entryDate}>日期：{date}</Text>
                <Text style={styles.entryCreatedAt}>
                  建立時間：{new Date(createdAt).toLocaleString()}
                </Text>

                {assignments && assignments.map((item, index) => (
                  <View key={index} style={styles.assignmentItem}>
                    {isEditing ? (
                      <>
                        <TextInput
                          style={styles.textInput}
                          value={editingEntries[date].assignments[index].book}
                          onChangeText={(value) =>
                            handleAssignmentChange(date, index, "book", value)
                          }
                          placeholder="書本名稱"
                        />
                        <View style={styles.row}>
                          <TextInput
                            style={[styles.textInput, styles.flexInput]}
                            value={editingEntries[date].assignments[index].start}
                            onChangeText={(value) =>
                              handleAssignmentChange(date, index, "start", value)
                            }
                            placeholder="起始"
                          />
                          <TextInput
                            style={[styles.textInput, styles.flexInput]}
                            value={editingEntries[date].assignments[index].end}
                            onChangeText={(value) =>
                              handleAssignmentChange(date, index, "end", value)
                            }
                            placeholder="結束"
                          />
                        </View>
                        <TextInput
                          style={styles.textInput}
                          value={editingEntries[date].assignments[index].times.toString()}
                          onChangeText={(value) =>
                            handleAssignmentChange(date, index, "times", value)
                          }
                          placeholder="次數"
                          keyboardType="numeric"
                        />
                      </>
                    ) : (
                      <>
                      <View style={styles.homeworkcontainer}>
                        <Text>書本：{item.book}</Text>
                        <Text>
                          {item.structure === "unit"
                            ? "單元"
                            : item.structure === "track"
                            ? "Track"
                            : "頁數"}
                          ：{item.start} - {item.end}
                        </Text>
                        <Text>次數：{item.times}</Text>
                      </View>
                      </>
                    )}
                  </View>
                ))}

                <View style={styles.buttonRow}>
                  {isEditing ? (
                    <>
                      <Button title="儲存" onPress={() => handleSave(date)} />
                      <Button title="取消" onPress={() => toggleEditMode(date, entry)} />
                    </>
                  ) : (
                    <>
                      <Button title="編輯" onPress={() => toggleEditMode(date, entry)} />
                      <Button title="刪除" onPress={() => handleDelete(date)} />
                    </>
                  )}
                </View>
              </View>
            );
          })}
        </View>
      
      </ScrollView>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#f5f5f5",
    flex: 1,
  },
  homeworkcontainer:{
    display:'flex',
    flexDirection:'row',
    justifyContent:'space-around',
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  picker: {
    height: 50,
    width: "100%",
    marginBottom: 20,
  },
  noDataText: {
    textAlign: "center",
    color: "#666",
    marginTop: 20,
  },
  entryContainer: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  entryDate: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 5,
  },
  entryCreatedAt: {
    fontSize: 14,
    color: "#888",
    marginBottom: 10,
  },
  assignmentItem: {
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    paddingBottom: 5,
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 5,
    marginBottom: 5,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  flexInput: {
    flex: 1,
    marginHorizontal: 5,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 10,
  },
});

export default HomeworkList;
