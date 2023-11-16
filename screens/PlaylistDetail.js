import React from 'react';
import { SafeAreaView, StatusBar, Text, View, FlatList, StyleSheet } from 'react-native';
import { CircleButton, FocusedStatusBar, MusicCard } from '../components';
import { COLORS, assets, musicDB } from '../constants';
import MusicPlayer from '../components/MusicPlayer';
import { useState } from 'react';
import { useRoute, useNavigation } from '@react-navigation/native';
import MusicPlayerScreen from './MusicPlayerScreen';


const PlaylistDetail = () => {
    const route = useRoute();
    const navigation = useNavigation();
    const musicType = route.params?.musicType || 'Default Type';
    // const [selectedMusic, setSelectedMusic] = useState(null);

    const handleCardClick = (data) => {
        setSelectedMusic(data);
    };

    const filterMusicByType = (type) => {
        if (type === musicType) {
            return musicDB.filter((item) => item.type === type);
        }
        return musicDB; /* Display all types */
    };






    const [selectedMusic, setSelectedMusic] = useState(null);
    const [selectedMusicIndex, setSelectedMusicIndex] = useState(null);
    const [isPlayerModalVisible, setisPlayerModalVisible] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    // const [timestamp, setTimestamp] = useState(0);
    const [mode, setMode] = useState('shuffle')
    const PlaylistImageView = () => (
        <>
            <LinearGradient
                colors={['#0000ff', '#00005f', '#191414']}
                style={styles.linearGradient}>
                <Image
                    style={{ width: 200, height: 200 }}
                    source={{ uri: 'https://www.bensound.com/bensound-img/punky.jpg' }}
                />
            </LinearGradient>
            <TouchableOpacity style={styles.shuffleButtonContainer}>
                <Text style={[styles.shuffleButton]}>SHUFFLE PLAY</Text>
            </TouchableOpacity>
        </>
    );
    const onSelectTrack = async (selectedTrack, index) => {
        setSelectedMusic(selectedTrack);
        // setTimestamp(0);
        setSelectedMusicIndex(index);
        // remove TrackPlayer.skip(index);
        // playOrPause();
    };
    const playOrPause = async () => {
        setIsPlaying(!isPlaying);
    };
    // const onSeekTrack = newTimeStamp => {
    //     setTimestamp(newTimeStamp);
    // };
    const onPressNext = () => {
        // setTimestamp(0);
        setSelectedMusic(
            musiclibrary[(selectedMusicIndex + 1) % musiclibrary.length],
        );
        setSelectedMusicIndex(selectedMusicIndex + 1);
    };
    const onPressPrev = () => {
        if (selectedMusicIndex === 0) {
            return;
        }
        // setTimestamp(0);
        setSelectedMusic(
            musiclibrary[(selectedMusicIndex - 1) % musiclibrary.length],
        );
        setSelectedMusicIndex(selectedMusicIndex - 1);
    };

    const renderSingleMusic = ({ item, index }) => {
        return (
            <>
                {index === 0 && <PlaylistImageView />}
                <Pressable onPress={() => onSelectTrack(item, index)}>
                    <View>
                        <Text style={styles.musicTitle}>{item.title}</Text>
                        <Text style={styles.artisteTitle}>{item.artist}</Text>
                    </View>
                </Pressable>
            </>
        );
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
                <MusicPlayer
                    display="flex"
                    data={selectedMusic}
                    playlistDetailHeight={selectedMusic ? '75%' : '85%'} // Adjust the percentage as needed
                />
            )}
            {selectedMusic && (
                <MusicPlayerScreen
                    onCloseModal={() => setisPlayerModalVisible(false)}
                    isVisible={isPlayerModalVisible}
                    isPlaying={isPlaying}
                    playOrPause={playOrPause}
                    selectedMusic={selectedMusic}
                    // onSeekTrack={onSeekTrack}
                    // timestamp={timestamp}
                    onPressNext={onPressNext}
                    onPressPrev={onPressPrev}
                    playbackMode={mode}
                    onClickLoop={() => mood === "loop" ? setMode("loop") : setMode("off")}
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
