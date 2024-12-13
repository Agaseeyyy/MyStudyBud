import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from './screens/HomeScreen.js';
import ProfileScreen from './screens/ProfileScreen.js';
import AboutScreen from './screens/AboutScreen.js';
import Ionicons from '@expo/vector-icons/Ionicons';
import HamburgerMenu from './components/HamburgerMenu.js';
import AppLoading from './components/AppLoading.js';
import Onboarding from './components/Onboarding.js';


const Tab = createBottomTabNavigator();
export default function App() {
  const [studentName, setStudentName] = useState('Student');

  return (
    <AppLoading>
      <Onboarding />
        
      <StatusBar style='auto'/>
    </AppLoading>
    
  );
}
