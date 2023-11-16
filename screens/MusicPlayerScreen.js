import React from 'react';
import { View, Text, Modal, Image, StyleSheet, Pressable } from 'react-native';
import Slider from '@react-native-community/slider';
import { AntDesign } from '@expo/vector-icons';

export default function MusicPlayerScreen({
    route,
    isVisible,
    onCloseModal,
    // selectedMusic,
    isPlaying,
    playOrPause,
    onSeekTrack,
    onPressNext,
    onPressPrev,
    playbackMode,
    onClickShuffle,
    onClickLoop,
}) {
    return (
        <Modal
            animationType="slide"
            visible={isVisible}
            presentationStyle="fullScreen">
            {/* <View
                colors={['#0000ff', '#00005f', '#191414']}
                style={styles.container}>
                <Pressable
                    onPress={onCloseModal}
                    style={{
                        position: 'absolute',
                        top: 45,
                        left: 30,
                    }}>
                    <Image
                        source={
                            <AntDesign name="home" size={24} color="black" style={styles.controlIcon} />
                        }
                        style={{
                            width: 15,
                            height: 15,
                            tintColor: '#fff',
                        }}
                    />
                </Pressable>
                <Text style={styles.mainText}>Playing from My Playlist</Text>
                <Text style={[styles.mainText, { fontWeight: 'bold' }]}>
                    {data.bookname}
                </Text>

                <View style={{ justifyContent: 'space-between', width: '100%' }}>
                    <View>
                        <Text style={styles.boldMainText}>{data.bookname}</Text>
                        <Text style={styles.mainText}>{data.page}</Text>
                    </View>
                    <Text>Like</Text>
                </View>

                <View style={styles.timeStampHolder}>
                    <View />
                    <Pressable onPress={onPressPrev}>
                        <Image style={styles.iconWidth} source={<AntDesign name="stepbackward" size={24} color="black" style={styles.controlIcon} />} />
                    </Pressable>

                    <Pressable onPress={playOrPause} style={styles.playButtonHolder}>
                        <Image
                            style={[styles.iconWidth, { tintColor: '#000' }]}
                            source={
                                isPlaying
                                    ?
                                    <AntDesign name="pause" size={24} color="black" style={styles.controlIcon} />
                                    :
                                    <AntDesign name="play" size={24} color="black" style={styles.controlIcon} />
                            } />
                    </Pressable>
                    <Pressable onPress={onPressNext}>
                        <Image style={styles.iconWidth} source={<AntDesign name="stepforward" size={24} color="black" style={styles.controlIcon} />} />
                    </Pressable>
                    <Pressable onPress={onClickLoop}>
                        <Image
                            style={[
                                styles.iconWidth,
                                { tintColor: playbackMode === 'loop' ? '#1DB954' : '#fff' },
                            ]}
                            source={<AntDesign name="retweet" size={24} color="black" style={styles.controlIcon} />}
                        />
                    </Pressable>
                </View>
            </View> */}
            <View><Text>Test</Text></View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#191414',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingTop: 40,
        paddingBottom: 20,
    },
    boldMainText: {
        fontSize: 22,
        color: '#fff',
        fontWeight: '500',
        marginTop: 12,
        marginHorizontal: 20,
        marginBottom: 1,
    },
    mainText: {
        fontSize: 16,
        color: '#fff',
        opacity: 0.8,
        marginHorizontal: 20,
        // marginBottom: 12,
        // marginTop: 1,
    },
    linearGradient: {
        width: '100%',
        height: 250,
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconWidth: {
        width: 30,
        height: 30,
        tintColor: '#fff',
    },
    timeStampHolder: {
        width: '100%',
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
        paddingHorizontal: 10,
    },
    playButtonHolder: {
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});