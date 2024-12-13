import React, { useState, useEffect } from 'react';
import * as Font from 'expo-font';
import { View, ActivityIndicator } from 'react-native';

export default function AppLoading({ children }) {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    const loadFonts = async () => {
      await Font.loadAsync({
        'LexendDeca-Regular': require('../assets/fonts/LexendDecaRegular.ttf'), // Example font
        'LexendDeca-Medium': require('../assets/fonts/LexendDecaMedium.ttf'),
        'LexendDeca-SemiBold': require('../assets/fonts/LexendDecaSemiBold.ttf'),
        'LexendDeca-Bold': require('../assets/fonts/LexendDecaBold.ttf'),
        'LexendDeca-Black': require('../assets/fonts/LexendDecaBlack.ttf'),
      });
      setFontsLoaded(true);
    };

    loadFonts();
  }, []);

  if (!fontsLoaded) {
    return (
      <View className="items-center justify-center flex-1">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return children;
}
