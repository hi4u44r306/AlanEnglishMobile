import React from 'react';
import { SafeAreaView, StatusBar, Text, View, FlatList, StyleSheet } from 'react-native';
import { CircleButton, FocusedStatusBar, HomeHeader, MusicCard } from '../components';
import { COLORS, assets, musicDB } from '../constants';
import { useState } from 'react';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';


const PlaylistDetail = () => {
    const route = useRoute();
    const navigation = useNavigation();
    const musicType = route.params?.musicType || 'Default Type';
    const [selectedMusic, setSelectedMusic] = useState();
    const { playing } = useSelector(state => state.musicReducer);
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
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
            <FocusedStatusBar backgroundColor={COLORS.primary} />
            <View>
                <CircleButton
                    imgUrl={assets.left}
                    handlePress={() => navigation.goBack()}
                    left={15}
                    top={StatusBar.currentHeight}
                    text={"回播放列表"}
                />
            </View>
            <View style={{ flex: 1, marginBottom: 75 }}>
                <View style={styles.typetitle}>
                    <Text style={styles.titletext}>{musicType}</Text>
                </View>
                <FlatList
                    data={filterMusicByType(musicType)}
                    renderItem={({ item }) => (
                        <MusicCard music={item} onclickmusic={handleCardClick} />
                    )}
                    keyExtractor={(item) => item.musicName}
                />
            </View>
        </SafeAreaView>
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
    }

})

export default PlaylistDetail;
