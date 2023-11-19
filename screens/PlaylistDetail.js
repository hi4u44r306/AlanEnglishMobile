import React from 'react';
import { SafeAreaView, StatusBar, Text, View, FlatList, StyleSheet } from 'react-native';
import { CircleButton, FocusedStatusBar, HomeHeader, MusicCard } from '../components';
import { COLORS, assets, musicDB } from '../constants';
import { useState } from 'react';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import ScreenContainer from './ScreenContainer';
import { Ionicons } from '@expo/vector-icons';


const PlaylistDetail = () => {
    const route = useRoute();
    const navigation = useNavigation();
    const musicType = route.params?.musicType || 'Default Type';
    const [selectedMusic, setSelectedMusic] = useState();
    const { playing, screenmargin } = useSelector(state => state.musicReducer);
    const [currMusic, setCurrMusic] = useState(null);

    useEffect(() => {
        setCurrMusic(playing)
    }, [playing]);


    const handleCardClick = (data) => {
        setSelectedMusic(data);
    };


    const filterMusicByType = (type) => {
        if (type === musicType) {
            return musicDB.filter((item) => item.type === type);
        }
        return musicDB; /* Display all types */
    };

    return (
        <ScreenContainer>
            <View style={styles.typetitle}>
                <Text style={styles.titletext}>{musicType}</Text>
            </View>
            <FlatList
                style={{ paddingTop: 10, paddingBottom: 30 }}
                data={filterMusicByType(musicType)}
                renderItem={({ item }) => (
                    <MusicCard music={item} onclickmusic={handleCardClick} />
                )}
                keyExtractor={(item) => item.musicName}
                ListFooterComponent={() => (
                    <View style={styles.endOfList}>
                        <Ionicons name="checkmark-done-circle-outline" size={30} color="rgb(64, 98, 187)" style={{}} />
                        <Text style={styles.endOfListText}>
                            這是播放列表的末端了
                        </Text>
                        <Ionicons name="checkmark-done-circle-outline" size={30} color="rgb(64, 98, 187)" style={{}} />
                    </View>
                )}
            />
        </ScreenContainer>
    );
};


const styles = StyleSheet.create({
    typetitle: {
        display: 'flex',
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center',
        backgroundColor: '#005b7f',
        padding: 5,
    },
    titletext: {
        fontSize: 18,
        fontWeight: '600',
        color: '#fff4d5',
    },
    endOfList: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center',
        marginTop: 10, // Add margin or adjust as needed
        marginBottom: 30, // Add margin or adjust as needed
        gap: 5,
    },
    endOfListText: {
        fontSize: 16,
        color: COLORS.gray,
        textTransform: 'uppercase',
    },

})

export default PlaylistDetail;
