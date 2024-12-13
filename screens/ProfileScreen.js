import React, { useState, useEffect } from 'react';
import { Text, TextInput, View, TouchableOpacity, KeyboardAvoidingView } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import MaterialIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { 
  saveUserProfile, 
  getUserProfile, 
  clearUserProfile 
} from '../utils/asyncStorageUtils';

export default function ProfileScreen({ navigation }) {
  const [studentName, setStudentName] = useState('');
  const [selectedProgram, setSelectedProgram] = useState('BSIT');
  const [selectedYrLevel, setSelectedYrLevel] = useState('1'); 

  // Program and Year Level options remain the same
  const program = [
    { label: 'BS Information Technology', value: 'BSIT' },
    { label: 'BS Computer Science', value: 'BSCS' },
    { label: 'BS Information System', value: 'BSIS' },
  ];

  const yearLevel = [
    { label: '1st Year', value: '1' },
    { label: '2nd Year', value: '2' },
    { label: '3rd Year', value: '3' },
    { label: '4th Year', value: '4' },
  ];

  // Load saved profile when component mounts
  useEffect(() => {
    const loadSavedProfile = async () => {
      try {
        // Uncomment the next line if you want to clear saved profile (for debugging)
        // await clearUserProfile();

        const savedProfile = await getUserProfile();
        if (savedProfile) {
          setStudentName(savedProfile.studentName || '');
          setSelectedProgram(savedProfile.selectedProgram || '');
          setSelectedYrLevel(savedProfile.selectedYrLevel || '');
        }
      } catch (error) {
        console.error('Error loading saved profile:', error);
      }
    };

    loadSavedProfile();
  }, []);

  // Handle saving profile
  const handleSaveProfile = async () => {
    // Prepare profile data
    const profileData = {
      studentName,
      selectedProgram,
      selectedYrLevel
    };

    // Save to AsyncStorage
    await saveUserProfile(profileData);

    // Navigate to Home screen with profile data
    navigation.navigate('Home', profileData);
  };

  return (
    <KeyboardAvoidingView behavior='padding' className='flex-1 px-5 py-14 bg-slate-100'>
      <Text className='mb-1 font-LexendDecaBold text-myPallet-100'>DISPLAY NAME</Text>
      <View className='flex flex-row items-center w-full py-1 pl-2 pr-8 bg-white border border-opacity-50 rounded-lg border-myPallet-100'>
        <TextInput 
          className='w-full p-2 text-base font-LexendDecaRegular'
          value={studentName}
          onChangeText={setStudentName}
          placeholder='Enter display name'
        />

        {studentName.length > 0 && (
          <TouchableOpacity
            onPress={() => {
              setStudentName('')
            }}
          >
            <MaterialIcons 
              name='close-circle' 
              size={20}  
              color={'gray'}
            />
          </TouchableOpacity>
        )}
      </View>

      <Text className='mt-6 mb-1 font-LexendDecaBold text-myPallet-100'>PROGRAM</Text>
      <Dropdown
        className='w-full p-3 bg-white border rounded-lg border-myPallet-100'
        data={program}
        labelField="label"
        valueField="value"
        placeholder="Select an option"
        value={selectedProgram}
        onChange={item => {
          setSelectedProgram(item.value);
        }}
        renderRightIcon={() => (
          <MaterialIcons name='chevron-down' size={25} color={'gray'} />
        )}
        style={{
          borderColor: '#A0D683',
          borderWidth: 1,
          borderRadius: 10,
          paddingVertical: 10,
          paddingHorizontal: 15,
        }}
        placeholderStyle={{
          color: 'gray',
          fontSize: 16,
          fontFamily: 'LexendDeca-Regular',
        }}
        selectedTextStyle={{
          color: '#333',
          fontSize: 16,
          fontFamily: 'LexendDeca-Regular',
        }}
        dropdownPosition="auto"
      />

      <Text className='mt-6 mb-1 font-LexendDecaBold text-myPallet-100'>YEAR LEVEL</Text>
      <Dropdown
        className='w-full p-3 bg-white border rounded-lg border-myPallet-100'
        data={yearLevel}
        labelField="label"
        valueField="value"
        placeholder="Select an option"
        value={selectedYrLevel}
        onChange={item => {
          setSelectedYrLevel(item.value);
        }}
        renderRightIcon={() => (
          <MaterialIcons name='chevron-down' size={25} color={'gray'} />
        )}
        style={{
          borderColor: '#A0D683',
          borderWidth: 1,
          borderRadius: 10,
          paddingVertical: 10,
          paddingHorizontal: 15,
        }}
        placeholderStyle={{
          color: 'gray',
          fontSize: 16,
          fontFamily: 'LexendDeca-Regular',
        }}
        selectedTextStyle={{
          color: '#333',
          fontSize: 16,
          fontFamily: 'LexendDeca-Regular',
        }}
        dropdownPosition="auto"
      />

      <View className='flex-[0.5] justify-center items-center'>
        <TouchableOpacity 
          onPress={handleSaveProfile}
          className='flex items-center justify-center h-12 w-28 rounded-2xl bg-myPallet-100'
          activeOpacity={0.8} 
        >
          <Text className='text-white font-base font-LexendDecaSemiBold'>DONE</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}