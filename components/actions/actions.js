export const setPlaylist = (playlist) => {
    return {
        type: "SET_PLAYLIST",
        payload: playlist
    };
};
export const setCurrentMargin = (curr_margin) => {
    return {
        type: "SET_CURR_MARGIN",
        payload: curr_margin
    };
}
export const setMusicPlayerDisplay = (musicplayerdisplay) => {
    return {
        type: "SET_MUSIC_PLAYER_DISPLAY",
        payload: musicplayerdisplay
    };
}
export const setAutoPlay = (autoplay) => {
    return {
        type: "SET_AUTOPLAY",
        payload: autoplay
    };
}
export const setCurrentPlaying = (curr_music) => {
    return {
        type: "SET_CURR_PLAYING",
        payload: curr_music
    };
}
export const setBannerOpen = (isOpen) => {
    return {
        type: "SET_BANNER_OPEN",
        payload: isOpen
    };
};

export const increaseTimesPlayed = (id) => {
    return {
        type: "INC_TIMES_PLAYED",
        payload: id
    };
};

export const setSearch = (searchQuery) => {
    return {
        type: "SET_SEARCH_QUERY",
        payload: searchQuery
    };
};

export const setMusicLang = (langList) => {
    return {
        type: "SET_MUSIC_LIST",
        payload: langList
    };
};

export const setUserID = (useruid) => {
    return {
        type: "USER_NAME",
        payload: useruid
    };
};

export const setUsername = (username) => {
    return {
        type: "USER_NAME",
        payload: username
    };
};

export const setUserclass = (userclass) => {
    return {
        type: "USER_CLASS",
        payload: userclass
    };
};

export const setUsertodaytimeplayed = (usertodaytimeplayed) => {
    return {
        type: "USER_TOTAL_TIME_PLAYED",
        payload: usertodaytimeplayed
    };
};
export const setUsertotaltimeplayed = (usertotaltimeplayed) => {
    return {
        type: "USER_TOTAL_TIME_PLAYED",
        payload: usertotaltimeplayed
    };
};

export const setTeacherschool = (teacherschool) => {
    return {
        type: "TEACHER_SCHOOL",
        payload: teacherschool
    };
};
export const setSidebar = (sidebarshow) => {
    return {
        type: "SIDEBAR_SHOW",
        payload: sidebarshow
    };
};

export const setDuration = (duration) => {
    return {
        type: "ANIMATION_DURATION",
        payload: duration
    };
};
