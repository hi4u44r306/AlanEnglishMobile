import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  TextInput,
  ScrollView,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import Toast from "react-native-toast-message";
import ScreenContainer from "./ScreenContainer";
import { rtdb } from "./firebase-config";
import { onValue, off, ref as rtdbRef, set } from "firebase/database";

// 偵測書本的結構：回傳 "unit" 或 "page"
const detectBookStructure = (book) => {
  return new Promise((resolve, reject) => {
    const bookDetailRef = rtdbRef(rtdb, `Music/${book}`);
    onValue(
      bookDetailRef,
      (snapshot) => {
        const bookData = snapshot.val();
        if (bookData) {
          const keys = Object.keys(bookData);
          // 若其中有鍵名符合 "unit"（不論大小寫）則視為單元分類
          const isUnitBased = keys.some((key) => /^unit/i.test(key));
          resolve(isUnitBased ? "unit" : "page");
        } else {
          resolve("page"); // 預設 page-based
        }
      },
      (error) => {
        reject(error);
      }
    );
  });
};

// 若是 unit-based，可以取得所有單元的列表
const getUnitsForBook = (book) => {
  return new Promise((resolve, reject) => {
    const bookDetailRef = rtdbRef(rtdb, `Music/${book}`);
    onValue(
      bookDetailRef,
      (snapshot) => {
        const bookData = snapshot.val();
        if (bookData) {
          const unitKeys = Object.keys(bookData).filter((key) =>
            /^unit/i.test(key)
          );
          resolve(unitKeys);
        } else {
          resolve([]);
        }
      },
      (error) => {
        reject(error);
      }
    );
  });
};

const AddHomework = () => {
  const [classValue, setClassValue] = useState("");
  const [bookList, setBookList] = useState([]);
  // 每筆作業項目除了書本、頁數資訊，另外加上 structure 與（若單元分類）unit 選擇與列表
  const [assignments, setAssignments] = useState([
    { book: "", start: "", end: "", times: "1", classification: "page" }, // classification 可為 'page' 或 'unit'
  ]);

  console.log(assignments)

  const fetchBookClassification = (bookName, index) => {
    const bookRef = rtdbRef(rtdb, `Music/${bookName}`);
    onValue(bookRef, (snapshot) => {
      const bookData = snapshot.val();
      if (bookData) {
        // 將所有 child 轉成陣列
        const childArray = Object.values(bookData);
        let classification = "page"; // 預設為 page
  
        // 如果有任一筆 page 包含 "unit"，則分類為 unit
        if (
          childArray.some(
            (child) =>
              child.page &&
              typeof child.page === "string" &&
              child.page.toLowerCase().includes("unit")
          )
        ) {
          classification = "unit";
        }
        // 如果沒有 unit，但有包含 "track"，則分類為 track
        else if (
          childArray.some(
            (child) =>
              child.page &&
              typeof child.page === "string" &&
              child.page.toLowerCase().includes("track")
          )
        ) {
          classification = "track";
        }
  
        setAssignments((prev) =>
          prev.map((item, i) =>
            i === index ? { ...item, classification } : item
          )
        );
      } else {
        // 如果沒有資料，預設 classification 為 page
        setAssignments((prev) =>
          prev.map((item, i) =>
            i === index ? { ...item, classification: "page" } : item
          )
        );
      }
    });
  };
  
  

  useEffect(() => {
    const bookRef = rtdbRef(rtdb, "Music/");
    const handleValueChange = (snapshot) => {
      const fetchedData = snapshot.val();
      if (fetchedData) {
        const parsedData = Object.keys(fetchedData);
        setBookList(parsedData);
      }
    };

    onValue(bookRef, handleValueChange);
    return () => {
      off(bookRef, "value", handleValueChange);
    };
  }, []);

  // 更新單一 assignment 的資料
  const handleUpdateAssignment = (index, field, value) => {
    setAssignments((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  };

  // 當使用者選擇書本時，偵測該書本的分類結構
  const handleBookSelection = async (index, book) => {
    handleUpdateAssignment(index, "book", book);
    if (book) {
      try {
        const structure = await detectBookStructure(book);
        handleUpdateAssignment(index, "structure", structure);
        // 如果是 unit-based，就取得單元列表，並重置 unit 選項
        if (structure === "unit") {
          const units = await getUnitsForBook(book);
          handleUpdateAssignment(index, "units", units);
          handleUpdateAssignment(index, "unit", ""); // 重置選擇
        } else {
          // 若是 page-based，清空單元相關資料
          handleUpdateAssignment(index, "units", []);
          handleUpdateAssignment(index, "unit", "");
        }
      } catch (error) {
        console.error("偵測書本結構錯誤：", error);
      }
    } else {
      // 若未選書本，清除結構資訊
      handleUpdateAssignment(index, "structure", "");
      handleUpdateAssignment(index, "units", []);
      handleUpdateAssignment(index, "unit", "");
    }
  };

  // 動態增減作業項目
  const handleAddAssignment = () => {
    setAssignments((prev) => [
      ...prev,
      { book: "", structure: "", startPage: "", endPage: "", times: "1", unit: "", units: [] },
    ]);
  };

  const handleRemoveAssignment = (index) => {
    setAssignments((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmitHomework = async () => {
    console.log("handleSubmitHomework called");
    console.log("classValue:", classValue);
    console.log("assignments:", assignments);
  
    if (!classValue) {
      console.log("班級尚未選擇");
      Toast.show({
        type: "error",
        text1: "請先選擇班級",
        position: "top",
        visibilityTime: 2000,
      });
      return;
    }
  
    for (const item of assignments) {
      console.log("檢查作業項目:", item);
      if (!item.book || !item.times) {
        console.log("書本或聽力次數未填寫");
        Toast.show({
          type: "error",
          text1: "請確認書本與聽力次數都已填寫",
          position: "top",
          visibilityTime: 2000,
        });
        return;
      }
      if (item.structure === "page" && (!item.start || !item.end)) {
        console.log("頁數範圍未填寫，item:", item);
        Toast.show({
          type: "error",
          text1: "請填寫頁數範圍",
          position: "top",
          visibilityTime: 2000,
        });
        return;
      }
      if (item.structure === "unit" && !item.unit) {
        console.log("單元未選擇，item:", item);
        Toast.show({
          type: "error",
          text1: "請選擇單元",
          position: "top",
          visibilityTime: 2000,
        });
        return;
      }
    }
  
    // 取得今日日期，格式 YYYY-MM-DD
    const todayDate = new Date().toISOString().split("T")[0];
  
    // 建構要上傳的資料物件
    const homeworkData = {
      assignments, // 存放多筆作業項目
      createdAt: new Date().getTime(),
    };
  
    try {
      // 寫入路徑： homeworkAssignments/{班級}/{今日日期}
      await set(rtdbRef(rtdb, `HomeworkAssignments/${classValue}/${todayDate}`), homeworkData);
      Toast.show({
        type: "success",
        text1: "作業已建立！",
        position: "top",
        visibilityTime: 2000,
      });
    } catch (error) {
      console.error("Error uploading homework: ", error);
      Toast.show({
        type: "error",
        text1: "上傳作業失敗！",
        position: "top",
        visibilityTime: 2000,
      });
    }
  };
  
  

  return (
    <ScreenContainer>
      <ScrollView style={styles.container}>
        <Text style={styles.title}>新增課後聽力作業</Text>
        {/* 選擇班級 */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>班級</Text>
          <Picker
            selectedValue={classValue}
            style={styles.input}
            onValueChange={(value) => setClassValue(value)}
          >
            <Picker.Item label="選擇班級..." value="" />
            <Picker.Item label="E1" value="E1" />
            <Picker.Item label="E3" value="E3" />
            <Picker.Item label="E5" value="E5" />
            <Picker.Item label="E7" value="E7" />
            <Picker.Item label="Teacher" value="Teacher" />
          </Picker>
        </View>

        {/* 動態顯示作業項目 */}
        {assignments.map((item, index) => (
          <View key={index} style={styles.assignmentContainer}>
            <Text style={styles.assignmentTitle}>書本 {index + 1}</Text>

            {/* 書本選擇 */}
            <Text style={styles.label}>書本名稱</Text>
            <Picker
            selectedValue={item.book}
            style={styles.input}
            onValueChange={(value) => {
                handleUpdateAssignment(index, "book", value);
                if (value) {
                fetchBookClassification(value, index);
                }
            }}
            >
            <Picker.Item label="選擇書本..." value="" />
            {bookList.map((book) => (
                <Picker.Item key={book} label={book} value={book} />
            ))}
            </Picker>

            <View style={styles.pageRangeContainer}>
  <View style={{ flex: 1, marginRight: 8 }}>
    <Text style={styles.label}>
      {item.classification === "unit"
        ? "起始 Unit"
        : item.classification === "track"
        ? "起始 Track"
        : "起始頁數"}
    </Text>
    <TextInput
      style={styles.textInput}
      keyboardType="numeric"
      value={item.start}
      onChangeText={(value) =>
        handleUpdateAssignment(index, "start", value)
      }
    />
  </View>
  <View style={{ flex: 1, marginLeft: 8 }}>
    <Text style={styles.label}>
      {item.classification === "unit"
        ? "結束 Unit"
        : item.classification === "track"
        ? "結束 Track"
        : "結束頁數"}
    </Text>
    <TextInput
      style={styles.textInput}
      keyboardType="numeric"
      value={item.end}
      onChangeText={(value) =>
        handleUpdateAssignment(index, "end", value)
      }
    />
  </View>
</View>



            {/* 聽力次數 */}
            <Text style={styles.label}>需要聽幾次才算完成</Text>
            <TextInput
              style={styles.textInput}
              keyboardType="numeric"
              value={item.times}
              onChangeText={(value) =>
                handleUpdateAssignment(index, "times", value)
              }
            />

            {/* 刪除按鈕 */}
            {assignments.length > 1 && (
              <Button
                title="刪除這本書"
                color="#FF5252"
                onPress={() => handleRemoveAssignment(index)}
              />
            )}
          </View>
        ))}

        {/* 新增一本書 */}
        <View style={{ marginVertical: 10 }}>
          <Button title="新增一本書" onPress={handleAddAssignment} />
        </View>

        {/* 送出作業 */}
        <Button title="建立作業" onPress={handleSubmitHomework} color="#2196F3" />
      </ScrollView>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  inputContainer: {
    marginBottom: 15,
  },
  assignmentContainer: {
    backgroundColor: "#fff",
    padding: 15,
    marginBottom: 15,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  assignmentTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
  },
  label: {
    fontSize: 14,
    marginTop: 8,
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    fontSize: 16,
    backgroundColor: "#fff",
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  pageRangeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});

export default AddHomework;
