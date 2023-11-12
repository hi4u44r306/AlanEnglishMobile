import React from 'react';
import { ScrollView, SafeAreaView, StatusBar, Text, View, FlatList, StyleSheet } from 'react-native';
import { CircleButton, FocusedStatusBar, MusicCard } from '../components';
import { COLORS, assets, musicDB } from '../constants';
import { useRoute } from '@react-navigation/native';
import FooterMusicPlayer from '../components/FooterMusicPlayer';
import { useState } from 'react';


function PlaylistDetail() {
    const route = useRoute();
    const musicType = route.params?.musicType || 'Default Type'; // Default value for testing
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
        <SafeAreaView style={{ flex: 1 }}>
            <FocusedStatusBar backgroundColor={COLORS.primary} />
            <View style={styles.test}>
                <CircleButton
                    imgUrl={assets.left}
                    handlePress={() => navigation.navigate("Playlist")} // Go back to the Playlist screen
                    left={15}
                    top={StatusBar.currentHeight + 10}
                    title={musicType}
                />
            </View>
            <View style={{ marginTop: 40 }}>
                <View style={styles.typetitle}>
                    <Text style={styles.titletext}>
                        {musicType}
                    </Text>
                </View>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <FlatList
                        data={filterMusicByType(musicType)}
                        renderItem={({ item }) => (
                            <MusicCard data={item} onclickmusic={() => handleCardClick(item)} />
                        )}
                        keyExtractor={(item) => item.musicName}
                    />
                </ScrollView>
            </View>
            <FooterMusicPlayer display={selectedMusic ? "flex" : "none"} data={selectedMusic} />
        </SafeAreaView>
    );
}


const styles = StyleSheet.create({
    typetitle: {
        display: 'flex',
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center',
        backgroundColor: '#005b7f',
    },
    titletext: {
        fontSize: 18,
        fontWeight: 600,
        color: '#fff4d5',
        fontFamily: "Nunito",
    }

})

export default PlaylistDetail;
