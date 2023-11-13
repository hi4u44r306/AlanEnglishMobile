import React from 'react';
import { SafeAreaView, StatusBar, Text, View, FlatList, StyleSheet } from 'react-native';
import { CircleButton, FocusedStatusBar, MusicCard } from '../components';
import { COLORS, assets, musicDB } from '../constants';
import FooterMusicPlayer from '../components/FooterMusicPlayer';
import { useState } from 'react';
import { useRoute, useNavigation } from '@react-navigation/native';


const PlaylistDetail = () => {
    const route = useRoute();
    const navigation = useNavigation();
    const musicType = route.params?.musicType || 'Default Type';
    const [selectedMusic, setSelectedMusic] = useState(null);

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
                        <MusicCard data={item} onclickmusic={() => handleCardClick(item)} />
                    )}
                    keyExtractor={(item) => item.musicName}
                />
            </View>
            {selectedMusic && (
                <FooterMusicPlayer
                    display="flex"
                    data={selectedMusic}
                    playlistDetailHeight={selectedMusic ? '75%' : '85%'} // Adjust the percentage as needed
                />
            )}
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
