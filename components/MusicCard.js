import React from "react";
import { StyleSheet, View } from "react-native";
import { COLORS, SIZES } from "../constants";
import { MusicTitle } from "./SubInfo";
import { PlayButton } from "./Button";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentMargin, setCurrentPlaying, setMusicPlayerDisplay } from "./actions/actions";

const MusicCard = ((props) => {

  const dispatch = useDispatch();
  const { playlists, curr_music } = useSelector(state => state.musicReducer);
  const currentTrackID = playlists.findIndex(obj => obj.musicName === props.music.musicName);

  function handlePlay() {
    dispatch(setCurrentMargin(65))
    dispatch(setMusicPlayerDisplay('flex'))
    dispatch(setCurrentPlaying({ ...props.music, index: currentTrackID }));
  }


  return (
    <View style={{ backgroundColor: COLORS.white, }}>
      <View style={styles.musiclist}>
        <View style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          alignContent: 'center',
        }}>
          <MusicTitle
            title={props.music.bookname}
            subTitle={props.music.page}
            titleSize={SIZES.large}
            subTitleSize={SIZES.small}
          />
          <PlayButton handlePress={handlePlay} />
        </View>
      </View>
    </View>
  );
});

export default MusicCard;

const styles = StyleSheet.create({
  musiclist: {
    width: "100%",
    paddingLeft: 10,
    paddingRight: 10,
    justifyContent: 'center',
    alignContent: 'center',
    borderBottomColor: 'gray',
    borderBottomWidth: 1,
    borderBottomStyle: 'solid',
  },
})
