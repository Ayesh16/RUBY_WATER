import { useRouter } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { View, Image, StyleSheet, Text, Dimensions, TouchableOpacity } from 'react-native';

// Get the screen width and height
const { width, height } = Dimensions.get('window');

export default function Login() {
  // State to hold the current slogan
  const [currentSlogan, setCurrentSlogan] = useState('');

  useEffect(() => {
    const getRandomSlogan = () => {
      const slogans = [
        "நீர் உயிர்க்காக அவசியம். அதை விரயம் செய்யாமல், தகுந்த விதத்தில் பயன்படுத்துவோம்.",
        "ஒவ்வொரு துளியும் முக்கியம், எதிர்காலத்தைப் பாதுகாக்க நீரை சிக்கனமாக பயன்படுத்துங்கள்!",
        "நீர் தகுந்த முறையில் பயன்படுத்துங்கள், நம் உலகத்தை பாதுகாப்போம்.",
        "நீர் வளங்களை பெருக்க, ஒவ்வொருவரும் சிந்தித்து செயல் படுவோம்!",
        "நீர் சேமிப்பு என்பது வாழ்க்கையின் முக்கிய பங்கு."
      ];
      return slogans[Math.floor(Math.random() * slogans.length)];
    };

    // Set the initial random slogan
    setCurrentSlogan(getRandomSlogan());

    // Optionally, change the slogan every 5 seconds
    const interval = setInterval(() => {
      setCurrentSlogan(getRandomSlogan());
    }, 5000); // Change slogan every 5 seconds

    // Cleanup interval on unmount
    return () => clearInterval(interval);
  }, []);

  const router = useRouter();
  
  return (
    <View style={styles.container}>
      {/* Background Image */}
      <Image 
        source={require('../assets/images/water1.png')} 
        style={styles.backgroundImage}
      />

      {/* Overlay to darken the background and improve text readability */}
      <View style={styles.overlay} />

      {/* Displaying the dynamic slogan text */}
      <View style={styles.textContainer}>
        <Text style={styles.text}>
          {currentSlogan}
        </Text>
      </View>

      {/* Get Started Button */}
      <TouchableOpacity 
        style={styles.button}
        onPress={() => router.push('/auth/signin')}

      >
        {/* Ensure Text inside TouchableOpacity is wrapped */}
        <Text style={styles.buttonText}>Get Started</Text>
      </TouchableOpacity>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1, // Adjusted to take full height of the screen
    justifyContent: 'center', // Center the content vertically
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%', // Full width
    height: '65%', // Full height
    resizeMode: 'cover', // Ensure the image covers the screen
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: width,
    height: height,
    backgroundColor: 'rgba(197, 193, 193, 0.3)', // Dark overlay to improve text readability
  },
  textContainer: {
    paddingHorizontal: 20,
    marginBottom: 90, // Space between the text and the button
    zIndex: 1, // Ensure text appears above the overlay
  },
  text: {
    fontSize: 18,
    textAlign: 'center',
    color: '#0e0c0c', // Make text white for better contrast
    zIndex: 2, 
    marginTop: 480  // Ensure text appears above the overlay
  },
  button: {
    backgroundColor: '#051939', // Button color
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 90,
    alignItems: 'center',
    justifyContent: 'center',
    width: width - 150, // Full width button minus padding
    position: 'absolute', // Fixed position at the bottom of the screen
    bottom: 30, // Add some space from the bottom edge
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

