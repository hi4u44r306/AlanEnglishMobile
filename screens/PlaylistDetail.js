import React, { useState, useEffect } from 'react';
import { SafeAreaView, StatusBar, Text, View, FlatList, StyleSheet, Dimensions } from 'react-native';
import { CircleButton, FocusedStatusBar, HomeHeader, MusicCard } from '../components';
import { COLORS, FONTS, assets } from '../constants';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import ScreenContainer from './ScreenContainer';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { onValue, ref } from 'firebase/database';
import { rtdb } from './firebase-config';

const PlaylistDetail = () => {
    const route = useRoute();
    const navigation = useNavigation();
    const musicType = route.params?.musicType || 'Default Type';
    const [selectedMusic, setSelectedMusic] = useState();
    const { playing, screenmargin } = useSelector(state => state.musicReducer);
    const [currMusic, setCurrMusic] = useState(null);

    const [dimensions, setDimesions] = useState({ window: Dimensions.get('window') });

    const [playlists, setPlaylists] = useState([]); // Initialize as an empty array
    useEffect(() => {
        const FetchMusicData = async () => {
            try {
                const dbRef = ref(rtdb, 'Music');
                onValue(dbRef, (snapshot) => {
                    if (snapshot.exists()) {
                        const data = snapshot.val();
                        setPlaylists(data);
                    }
                });
            } catch (error) {
                console.error('Failed to load user data:', error);
            }
        }
        FetchMusicData();
    }, []); // Run only once on component mount



    useEffect(() => {
        const subscription = Dimensions.addEventListener("change", ({ window }) => {
            setDimesions({ window });
        });
        return () => subscription?.remove();
    });

    const { window } = dimensions;
    const windowWidth = window.width;
    const windowHeight = window.height;


    useEffect(() => {
        setCurrMusic(playing);
    }, [playing]);

    const handleCardClick = (data) => {
        setSelectedMusic(data);
    };


    return (
        <ScreenContainer>
            {/* <View style={styles.typetitle}>
                <Text style={styles.titletext}>{musicType}</Text>
            </View> */}
            <FlatList
                style={{ paddingBottom: windowHeight < 800 ? 20 : 30 }}
                data={playlists[`${musicType}`]}
                renderItem={({ item }) => (
                    <MusicCard music={item} onclickmusic={handleCardClick} />
                )}
                keyExtractor={(item) => item.musicName}
                ListFooterComponent={() => (
                    <View style={styles.endOfList}>
                        <Ionicons name="checkmark-done-circle-outline" size={30} color="rgb(64, 98, 187)" />
                        <Text style={styles.endOfListText}>
                            這是播放列表的末端了
                        </Text>
                        <Ionicons name="checkmark-done-circle-outline" size={30} color="rgb(64, 98, 187)" />
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
        backgroundColor: '#ebc0a7',
        padding: 10,
    },
    titletext: {
        fontSize: 18,
        fontWeight: 'bold',
        fontFamily: "Nunito",
    },
    endOfList: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 30,
        gap: 5,
    },
    endOfListText: {
        fontSize: 16,
        color: COLORS.gray,
        textTransform: 'uppercase',
    },
});

export default PlaylistDetail;
