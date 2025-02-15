import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Button, FlatList, StyleSheet, Alert } from "react-native";
import { Picker } from "@react-native-picker/picker"; // Import Picker component
import { rtdb } from "./firebase-config";
import { onValue, ref, update, remove } from "firebase/database";

const StudentControl = () => {
    const [students, setStudents] = useState([]);
    const [editStudentId, setEditStudentId] = useState(null);
    const [editableStudent, setEditableStudent] = useState(null);
    const [filter, setFilter] = useState({
        class: "",
        nameOrder: "",
        totaltimeplayedOrder: "",
    });

    useEffect(() => {
        const studentsRef = ref(rtdb, "student");
        onValue(studentsRef, (snapshot) => {
            const studentsData = [];
            snapshot.forEach((childSnapshot) => {
                const studentData = childSnapshot.val();
                studentsData.push({ id: childSnapshot.key, ...studentData });
            });
            setStudents(studentsData);
        });
    }, []);

    const handleEditStudent = (student) => {
        setEditStudentId(student.id);
        setEditableStudent({ ...student });
    };

    const handleSaveStudent = () => {
        if (editableStudent) {
            const updateStudentRef = ref(rtdb, `student/${editStudentId}`);
            update(updateStudentRef, editableStudent)
                .then(() => {
                    Alert.alert("Success", "Student data updated successfully!");
                    setEditStudentId(null);
                    setEditableStudent(null);
                })
                .catch((error) => {
                    Alert.alert("Error", "Failed to update student data.");
                    console.error(error);
                });
        }
    };

    const handleCancelEdit = () => {
        setEditStudentId(null);
        setEditableStudent(null);
    };

    const handleFilterChange = (key, value) => {
        setFilter({ ...filter, [key]: value });
    };

    const filteredStudents = students
        .filter((student) => {
            return filter.class === "" || student.class === filter.class;
        })
        .sort((a, b) => {
            if (filter.nameOrder === "ascending") {
                return a.name.localeCompare(b.name);
            }
            if (filter.nameOrder === "descending") {
                return b.name.localeCompare(a.name);
            }
            return 0;
        })
        .sort((a, b) => {
            if (filter.totaltimeplayedOrder === "ascending") {
                return a.Monthtotaltimeplayed - b.Monthtotaltimeplayed;
            }
            if (filter.totaltimeplayedOrder === "descending") {
                return b.Monthtotaltimeplayed - a.Monthtotaltimeplayed;
            }
            return 0;
        });

    const renderStudent = ({ item: student }) => (
        <View style={styles.studentRow}>
            {editStudentId === student.id ? (
                <View style={styles.editContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="班級"
                        value={editableStudent?.class || ""}
                        onChangeText={(text) =>
                            setEditableStudent({ ...editableStudent, class: text })
                        }
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="月播放次數"
                        value={editableStudent?.Monthtotaltimeplayed?.toString() || ""}
                        onChangeText={(text) =>
                            setEditableStudent({ ...editableStudent, Monthtotaltimeplayed: text })
                        }
                        keyboardType="numeric"
                    />
                    <View style={styles.buttonRow}>
                        <Button title="確認" onPress={handleSaveStudent} />
                        <Button title="取消" onPress={handleCancelEdit} />
                    </View>
                </View>
            ) : (
                <View style={styles.studentRowContent}>
                    {/* <Text style={styles.text}>ID: {student.id}</Text> */}
                    <View style={styles.studentRowContentItems}>
                        <Text style={styles.text}>姓名: {student.name}</Text>
                        <Text style={styles.text}>班級: {student.class}</Text>
                        <Text style={styles.text}>次數: {student.Monthtotaltimeplayed}</Text>
                    </View>
                    <View style={styles.buttonRow}>
                        <Button title="Edit" onPress={() => handleEditStudent(student)} />
                        <Button
                            title="Delete"
                            color="red"
                            onPress={() =>
                                Alert.alert(
                                    "Confirm Delete",
                                    "Are you sure you want to delete this student?",
                                    [
                                        { text: "Cancel", style: "cancel" },
                                        {
                                            text: "Delete",
                                            style: "destructive",
                                            onPress: () => {
                                                const deleteStudentRef = ref(rtdb, `student/${student.id}`);
                                                remove(deleteStudentRef).catch((error) => console.error(error));
                                            },
                                        },
                                    ]
                                )
                            }
                        />
                    </View>
                </View>
            )}
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>學生資料控制台</Text>

            <View style={styles.filterContainer}>
                <View style={styles.filterItems}>
                    <Text>班級</Text>
                    <Picker
                        selectedValue={filter.class}
                        onValueChange={(value) => handleFilterChange("class", value)}
                        style={styles.input}
                    >
                        <Picker.Item label="全部" value="" />
                        <Picker.Item label="A班" value="A" />
                        <Picker.Item label="B班" value="B" />
                        <Picker.Item label="C班" value="C" />
                        <Picker.Item label="D班" value="D" />
                    </Picker>
                </View>

                <View style={styles.filterItems}>
                    <Text>姓名</Text>
                    <Picker
                        selectedValue={filter.nameOrder}
                        onValueChange={(value) => handleFilterChange("nameOrder", value)}
                        style={styles.input}
                    >
                        <Picker.Item label="None" value="" />
                        <Picker.Item label="A到Z" value="ascending" />
                        <Picker.Item label="Z到A" value="descending" />
                    </Picker>
                </View>

                <View style={styles.filterItems}>
                    <Text>次數</Text>
                    <Picker
                        selectedValue={filter.totaltimeplayedOrder}
                        onValueChange={(value) => handleFilterChange("totaltimeplayedOrder", value)}
                        style={styles.input}
                    >
                        <Picker.Item label="None" value="" />
                        <Picker.Item label="少到多" value="ascending" />
                        <Picker.Item label="多到少" value="descending" />
                    </Picker>
                </View>
            </View>

            <FlatList
                data={filteredStudents}
                keyExtractor={(item) => item.id}
                renderItem={renderStudent}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: "#fff",
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 20,
    },
    filterContainer: {
        display: 'flex',
        marginBottom: 20,
        justifyContent: 'space-evenly',
        flexDirection: 'row',
    },
    filterItems: {
        flexDirection: 'column',
    },
    studentRow: {
        padding: 10,
        marginVertical: 8,
        borderRadius: 8,
        backgroundColor: "#f9f9f9",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    studentRowContent: {
        flexDirection: 'column',

    },
    studentRowContentItems: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    text: {
        fontSize: 16,
        marginBottom: 5,
    },
    buttonRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 10,
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
        fontSize: 16,
    },
    editContainer: {
        backgroundColor: "#e0f7fa",
        padding: 10,
        borderRadius: 5,
    },
});

export default StudentControl;
