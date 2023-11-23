// import React from 'react';
// import { SafeAreaView } from 'react-native';
// import { useSelector } from 'react-redux';

// const ScreenContainer = ({ children }) => {
//     const { screenmargin } = useSelector(state => state.musicReducer);

//     return (
//         <SafeAreaView style={{ flex: 1, backgroundColor: 'white', marginBottom: screenmargin }}>
//             {children}
//         </SafeAreaView>

//     )
// }

// export default ScreenContainer;

import React, { useEffect, useRef } from 'react';
import { SafeAreaView, Animated } from 'react-native';
import { useSelector } from 'react-redux';

const ScreenContainer = ({ children }) => {
    const { screenmargin } = useSelector(state => state.musicReducer);
    const { duration } = useSelector(state => state.screenReducer);

    // Create a useRef for the Animated.Value
    const animatedMarginBottom = useRef(new Animated.Value(screenmargin)).current;

    useEffect(() => {
        // Use timing function for a smooth animation
        Animated.timing(animatedMarginBottom, {
            toValue: screenmargin,
            duration: duration, // Adjust the duration as needed
            useNativeDriver: false, // Ensure this is set to false for margin animations
        }).start();
    }, [screenmargin]);

    return (
        <Animated.View style={{ flex: 1, backgroundColor: 'white', marginBottom: animatedMarginBottom }}>
            {children}
        </Animated.View>
    );
};

export default ScreenContainer;
