import React from 'react';
import { SafeAreaView, StatusBar, Text, View, FlatList, StyleSheet } from 'react-native';
import { CircleButton, FocusedStatusBar, MusicCard } from '../components';
import { COLORS, assets, musicDB } from '../constants';
import MusicPlayer from '../components/MusicPlayer';
import { useState } from 'react';
import { useRoute, useNavigation } from '@react-navigation/native';

const PlaylistDetail = () => {
    const route = useRoute();
    const navigation = useNavigation();
    const musicType = route.params?.musicType || 'Default Type';
    const [selectedMusic, setSelectedMusic] = useState();

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
            <View style={{ marginTop: 50, flex: 1 }}>
                <View style={styles.typetitle}>
                    <Text style={styles.titletext}>{musicType}</Text>
                </View>
                <FlatList
                    data={filterMusicByType(musicType)}
                    renderItem={({ item }) => (
                        <MusicCard data={item} onclickmusic={handleCardClick} />
                    )}
                    keyExtractor={(item) => item.musicName}
                />
            </View>
            {selectedMusic && (
                <MusicPlayer
                    display="flex"
                    data={selectedMusic}
                    autoPlay={true}
                    onNext={() => {
                        // Handle next song logic
                    }}
                    onPrevious={() => {
                        // Handle previous song logic
                    }}
                />
            )}
            {/* {selectedMusic && (
                <MusicPlayer
                    display="flex"
                    data={selectedMusic}
                    playlistDetailHeight={selectedMusic ? '75%' : '85%'}
                    autoPlay={true} // Set autoPlay to true
                />
            )} */}
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
        padding: 8,
    },
    titletext: {
        fontSize: 18,
        fontWeight: '600',
        color: '#fff4d5',
    }

})

export default PlaylistDetail;
