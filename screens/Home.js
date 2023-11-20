import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

import { HomeHeader, FocusedStatusBar } from "../components";
import { COLORS } from "../constants";
import ScreenContainer from "./ScreenContainer";

const Home = () => {
  // const [musicData, setMusicData] = useState(musicDB);

  // const handleSearch = (value) => {
  //   if (value.length === 0) {
  //     setMusicData(musicData);
  //   }

  //   const filteredData = musicData.filter((item) =>
  //     item.bookname.toLowerCase().includes(value.toLowerCase())
  //   );

  //   if (filteredData.length === 0) {
  //     setMusicData(musicData);
  //   } else {
  //     setMusicData(filteredData);
  //   }
  // };

  return (
    <ScreenContainer>
      <FocusedStatusBar backgroundColor={COLORS.primary} />
      <HomeHeader display="none" />
      <View style={styles.container}>
        {/* Header Section */}
        <View style={styles.header}>
          {/* <Image source={require('./assets/app_logo.png')} style={styles.logo} /> */}
          <Text style={styles.appName}>English Listening App</Text>
        </View>

        {/* App Features Section */}
        <View style={styles.features}>
          <Text style={styles.featureText}>Improve Your Listening Skills</Text>
          <Text style={styles.featureText}>Diverse Content for Every Level</Text>
          <Text style={styles.featureText}>Personalized Learning Paths</Text>
        </View>

        {/* Call-to-Action Button */}
        <TouchableOpacity style={styles.ctaButton}>
          <Text style={styles.ctaButtonText}>Start Listening Now</Text>
        </TouchableOpacity>

        {/* Footer Section */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Download the app now and enhance your English listening skills!</Text>
        </View>
      </View>
    </ScreenContainer>
  );
};



const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'center',
    marginTop: 30,
  },
  logo: {
    width: 100,
    height: 100,
  },
  appName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 10,
  },
  features: {
    marginTop: 30,
  },
  featureText: {
    fontSize: 16,
    marginBottom: 10,
  },
  ctaButton: {
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  ctaButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  footer: {
    marginBottom: 30,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 16,
    textAlign: 'center',
  },
});
export default Home;