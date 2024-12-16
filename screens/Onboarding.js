import React, { useState } from 'react';
import { Text, TouchableOpacity, View, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather'; // Using Feather icons as an alternative

export default function Onboarding() {
  const navigation = useNavigation();
  const [features] = useState([
    'Organize Tasks Project-Wise',
    'Track Progress Seamlessly',
    'Boost Your Productivity'
  ]);

  const handleStart = () => {
    navigation.navigate('Profile');
  };

  return (
    <View className='flex-1 bg-white'>
      {/* Top Section with Gradient Background */}
      <View className='absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-br from-myPallet-100 to-blue-400 rounded-b-[40px]' />
      
      {/* Main Content Container */}
      <View className='items-center justify-center flex-1 px-6'>
        {/* Floating Card */}
        <View className='items-center w-full p-6 mt-12 bg-white shadow-2xl rounded-3xl'>
          {/* App Logo and Title */}
          <Image 
            className= 'mb-4 w-80 h-80'
            source={require('../assets/img/onboarding-icon.png')}
            resizeMode='contain'
          />
          <Text className='mb-4 text-4xl text-center font-LexendDecaBold text-myPallet-100'>MyStudy Bud</Text>
          
          {/* Features List */}
          <View className='w-full mb-6'>
            {features.map((feature, index) => (
              <View key={index} className='flex-row items-center mb-3'>
                <Icon name="check-circle" size={24} color="#4CAF50" style={{ marginRight: 10 }} />
                <Text className='text-lg text-gray-700 font-LexendDecaRegular'>{feature}</Text>
              </View>
            ))}
          </View>
          
          {/* Description */}
          <Text className='px-4 mb-6 text-sm text-center text-gray-500 font-LexendDecaRegular'>
            Transform your study and task management with an intelligent, 
            project-focused productivity companion.
          </Text>
          
          {/* Call to Action Button */}
          <TouchableOpacity 
            onPress={handleStart}
            className='flex items-center justify-center w-full shadow-md h-14 rounded-2xl bg-myPallet-100'
          >
            <Text className='text-lg text-white font-LexendDecaSemiBold'>Get Started</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}