import { View, Text } from 'react-native'
import AudioPlayer, { RHAP_UI } from 'react-h5-audio-player'
import React, {useRef, useState, useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {setCurrentPlaying} from "../../actions/actions";
import { toast, ToastContainer} from "react-toastify"
import Marquee from "react-fast-marquee";
import firebase from 'firebase/app';
import Name from "./Name";
import '../assets/scss/FooterPlayer.scss';
import 'react-h5-audio-player/lib/styles.css';

const FooterMusicPlayer = () => {
  return (
    <View>
      <Text>FooterMusicPlayer</Text>
    </View>
  )
}

export default FooterMusicPlayer