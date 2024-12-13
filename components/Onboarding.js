import { Text, TouchableOpacity, View, Image } from 'react-native';
import { useState } from 'react'

export default function Onboarding() {
  return (
    <View className='items-center justify-center flex-1 bg-white'>

      <View className='flex-[0.8]'>
        <Image 
          className='h-64 mb-3 w-80'
          source={require('../assets/img/onboarding-icon.png')}
        />
        <Text className='text-4xl text-center font-LexendDecaBold text-myPallet-100'>MyStudy Bud</Text>
      </View>
      
      <View className='flex items-center justify-center gap-y-7'>
        <Text className='w-64 text-2xl text-center font-LexendDecaBold text-bl'>Task Management & To-Do List</Text>
        <Text className='text-sm font-LexendDecaRegular text-center text-[#6E6A7C] w-80'>This productive tool is designed to help you better manage your task  project-wise conveniently!</Text>

        <TouchableOpacity className='flex items-center justify-center h-12 w-28 rounded-2xl bg-myPallet-100 '>
          <Text className='text-white font-base font-LexendDecaSemiBold'>Let's Start</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}


