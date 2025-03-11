import { useRouter } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { View, Image, StyleSheet, Text, Dimensions, TouchableOpacity } from 'react-native';

const { width, height } = Dimensions.get('window');

export default function Welcome() {
  const [currentSlogan, setCurrentSlogan] = useState('');
  const router = useRouter();

  useEffect(() => {
    const slogans = [
      "நீர் உயிர்க்காக அவசியம். அதை விரயம் செய்யாமல், தகுந்த விதத்தில் பயன்படுத்துவோம்.",
      "ஒவ்வொரு துளியும் முக்கியம், எதிர்காலத்தைப் பாதுகாக்க நீரை சிக்கனமாக பயன்படுத்துங்கள்!",
      "நீர் தகுந்த முறையில் பயன்படுத்துங்கள், நம் உலகத்தை பாதுகாப்போம்.",
      "நீர் வளங்களை பெருக்க, ஒவ்வொருவரும் சிந்தித்து செயல் படுவோம்!",
      "நீர் சேமிப்பு என்பது வாழ்க்கையின் முக்கிய பங்கு."
    ];
    setCurrentSlogan(slogans[Math.floor(Math.random() * slogans.length)]);

    const interval = setInterval(() => {
      setCurrentSlogan(slogans[Math.floor(Math.random() * slogans.length)]);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.container}>
      <Image source={require('../assets/images/water1.png')} style={styles.backgroundImage} />
      <View style={styles.overlay} />
      <View style={styles.textContainer}>
        <Text style={styles.text}>{currentSlogan}</Text>
      </View>
      <TouchableOpacity style={styles.button} onPress={() => router.push('/auth/signup')}>
        <Text style={styles.buttonText}>Get Started</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  backgroundImage: { position: 'absolute', width: '100%', height: '65%', resizeMode: 'cover' },
  overlay: { position: 'absolute', width, height, backgroundColor: 'rgba(197, 193, 193, 0.3)' },
  textContainer: { marginBottom: 90, zIndex: 1 },
  text: { fontSize: 18, textAlign: 'center', color: '#0e0c0c', marginTop: 480 },
  button: { backgroundColor: '#051939', padding: 12, borderRadius: 90, width: width - 150, position: 'absolute', bottom: 30, alignItems: 'center' },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' }
});
