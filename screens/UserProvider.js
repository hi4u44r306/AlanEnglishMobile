// UserContext.js
import React, { createContext, useState, useEffect } from "react";
import { getAuth } from "firebase/auth";
import { onValue, ref as rtdbRef } from "firebase/database";
import { rtdb } from "./firebase-config"; // 根據實際路徑調整

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        const auth = getAuth();
        const user = auth.currentUser;
        let unsubscribe;

        if (user) {
            const userRef = rtdbRef(rtdb, `student/${user.uid}`);
            unsubscribe = onValue(
                userRef,
                (snapshot) => {
                    const data = snapshot.val();
                    setUserData({
                        username: data?.name || "Guest",
                        classname: data?.class || "N/A",
                        useruid: user.uid,
                        dayplaytime: data?.Daytotaltimeplayed || "0",
                        monthplaytime: data?.Monthtotaltimeplayed || "0",
                    });
                },
                (error) => {
                    console.error("Error fetching realtime user data:", error);
                }
            );
        }

        return () => {
            if (unsubscribe) unsubscribe();
        };
    }, []);
    return (
        <UserContext.Provider value={userData}>
            {children}
        </UserContext.Provider>
    );
};
