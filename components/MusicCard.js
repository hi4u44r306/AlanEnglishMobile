import React, { useEffect, useState } from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import { COLORS, SIZES } from "../constants";
import { MusicTitle } from "./SubInfo";
import { PlayButton, PlayingButton } from "./Button";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentMargin, setCurrentPlaying, setMusicPlayerDisplay } from "./actions/actions";

const MusicCard = ((props) => {

  const dispatch = useDispatch();
  const { playlists, curr_music } = useSelector(state => state.musicReducer);
  const currentTrackID = playlists.findIndex(obj => obj.musicName === props.music.musicName);

  const [dimensions, setDimesions] = useState({ window: Dimensions.get('window') });

  useEffect(() => {
    const subscription = Dimensions.addEventListener("change", ({ window }) => {
      setDimesions({ window });
    });
    return () => subscription?.remove();
  })

  const { window } = dimensions;
  const windowWidth = window.width;
  const windowHeight = window.height;

  function handlePlay() {
    dispatch(setMusicPlayerDisplay('flex'))
    dispatch(setCurrentPlaying({ ...props.music, index: currentTrackID }));
    if (windowHeight < 900) {
      dispatch(setCurrentMargin(65))
    } else {
      dispatch(setCurrentMargin(70))
    }
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

          {/* {props.music === curr_music ? (
            <PlayingButton />
          ) : (
            <PlayButton handlePress={handlePlay} />
          )} */}
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
