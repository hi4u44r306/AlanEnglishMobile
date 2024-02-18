import React from "react";
import { StyleSheet, View } from "react-native";
import { COLORS, SIZES } from "../constants";
import { MusicTitle } from "./SubInfo";
import { PlayButton } from "./Button";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentMargin, setCurrentPlaying, setMusicPlayerDisplay } from "./actions/actions";

const MusicCard = React.memo((props) => {

  const { music } = props;
  // const { playing } = useSelector(state => state.musicReducer);
  const dispatch = useDispatch();
  function handlePlay() {
    console.log(props.music)
    dispatch(setMusicPlayerDisplay('flex'))
    dispatch(setCurrentPlaying(props.music));
    dispatch(setCurrentMargin(65))
  }


  return (
    <View
      style={{
        backgroundColor: COLORS.white,
      }}
    >
      <View style={styles.musiclist}>
        <View style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          alignContent: 'center',
        }}>
          <MusicTitle
            title={music.bookname}
            subTitle={music.page}
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
