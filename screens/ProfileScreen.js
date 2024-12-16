import React, { useState, useEffect } from 'react';
import { Text, TextInput, View, TouchableOpacity, KeyboardAvoidingView, Alert } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import MaterialIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { 
  saveUserProfile, 
  getUserProfile, 
} from '../utils/asyncStorageUtils';

export default function ProfileScreen({ navigation, route }) {
  // State Management: Profile Configuration
  const [studentName, setStudentName] = useState('');
  const [selectedProgram, setSelectedProgram] = useState('BSIT');
  const [selectedYrLevel, setSelectedYrLevel] = useState('1'); 

  // Determine if this is the first app launch
  const isFirstLaunch = route.params?.isFirstLaunch || false;

  // Dropdown Configuration: Academic Programs
  const program = [
    { label: 'BS Information Technology', value: 'BSIT' },
    { label: 'BS Computer Science', value: 'BSCS' },
    { label: 'BS Information System', value: 'BSIS' },
    { label: 'Others', value: 'Program' },
  ];

  // Dropdown Configuration: Year Levels
  const yearLevel = [
    { label: '1st Year', value: '1' },
    { label: '2nd Year', value: '2' },
    { label: '3rd Year', value: '3' },
    { label: '4th Year', value: '4' },
  ];

  // Lifecycle Hook: Load Saved Profile
  // Retrieves and populates user's previously saved profile data
  useEffect(() => {
    const loadSavedProfile = async () => {
      try {
        const savedProfile = await getUserProfile();
        if (savedProfile) {
          // Populate state with saved profile or default values
          setStudentName(savedProfile.studentName || '');
          setSelectedProgram(savedProfile.selectedProgram || 'BSIT');
          setSelectedYrLevel(savedProfile.selectedYrLevel || '1');
        }
      } catch (error) {
        console.error('Error loading saved profile:', error);
        // Optional: Show user-friendly error message
        Alert.alert('Profile Load Error', 'Could not load previous profile settings.');
      }
    };

    loadSavedProfile();
  }, []);

  // Profile Save Handler
  // Validates and saves user profile, then navigates to home screen
  const handleSaveProfile = async () => {
    // Use default name if input is empty
    const finalStudentName = studentName.trim() || 'Student';

    try {
      // Prepare profile data object
      const profileData = {
        studentName: finalStudentName,
        selectedProgram,
        selectedYrLevel
      };

      // Persist profile to AsyncStorage
      await saveUserProfile(profileData);

      // Navigate to HomeStack with new profile parameters
      navigation.navigate('HomeStack', {
        screen: 'Home',
        params: profileData
      });
    } catch (error) {
      console.error('Error saving profile:', error);
      Alert.alert('Save Error', 'Unable to save profile. Please try again.');
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior='padding' 
      className='flex-1 bg-slate-100'
    >
      <View className='flex-1 px-6 py-10'>
        {/* Decorative Background Header */}
        <View className='absolute top-0 left-0 right-0 h-40 bg-myPallet-100 rounded-b-3xl' />
        
        {/* Profile Setup Container */}
        <View className='p-6 mt-10 bg-white shadow-lg rounded-2xl'>
          {/* Profile Setup Header */}
          <View className='items-center mb-6'>
            <MaterialIcons 
              name='account-circle' 
              size={80} 
              color='#A0D683' 
            />
            <Text className='mt-2 text-2xl font-LexendDecaBold text-myPallet-100'>
              Set Up Your Profile
            </Text>
            <Text className='text-gray-500 font-LexendDecaRegular'>
              Help us personalize your experience
            </Text>
          </View>

          {/* Display Name Input Section */}
          <View className='mb-4'>
            <Text className='mb-2 font-LexendDecaBold text-myPallet-100'>Display Name</Text>
            <View className='flex-row items-center px-3 py-2 rounded-lg bg-slate-100'>
              <MaterialIcons 
                name='account-outline' 
                size={24} 
                color='#A0D683' 
                className='mr-2' 
              />
              <TextInput 
                className='flex-1 text-base font-LexendDecaRegular'
                value={studentName}
                onChangeText={setStudentName}
                placeholder='Enter your name'
                placeholderTextColor='#888'
              />
              {/* Clear Input Button */}
              {studentName.length > 0 && (
                <TouchableOpacity onPress={() => setStudentName('')}>
                  <MaterialIcons 
                    name='close-circle' 
                    size={20}  
                    color='#888'
                  />
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Program Dropdown */}
          <View className='mb-4'>
            <Text className='mb-2 font-LexendDecaBold text-myPallet-100'>Program</Text>
            <Dropdown
              className='px-3 py-2 rounded-lg bg-slate-100'
              data={program}
              labelField="label"
              valueField="value"
              placeholder="Select Program"
              value={selectedProgram}
              onChange={item => {
                setSelectedProgram(item.value);
              }}
              renderLeftIcon={() => (
                <MaterialIcons 
                  name='school-outline' 
                  size={24} 
                  color='#A0D683' 
                  className='mr-2' 
                />
              )}
              renderRightIcon={() => (
                <MaterialIcons 
                  name='chevron-down' 
                  size={24} 
                  color='#888' 
                />
              )}
            />
          </View>

          {/* Year Level Dropdown */}
          <View className='mb-6'>
            <Text className='mb-2 font-LexendDecaBold text-myPallet-100'>Year Level</Text>
            <Dropdown
              className='px-3 py-2 rounded-lg bg-slate-100'
              data={yearLevel}
              labelField="label"
              valueField="value"
              placeholder="Select Year Level"
              value={selectedYrLevel}
              onChange={item => {
                setSelectedYrLevel(item.value);
              }}
              renderLeftIcon={() => (
                <MaterialIcons 
                  name='calendar-today' 
                  size={24} 
                  color='#A0D683' 
                  className='mr-2' 
                />
              )}
              renderRightIcon={() => (
                <MaterialIcons 
                  name='chevron-down' 
                  size={24} 
                  color='#888' 
                />
              )}
            />
          </View>

          {/* Save Profile Button */}
          <TouchableOpacity 
            onPress={handleSaveProfile}
            className='items-center py-3 shadow-md bg-myPallet-100 rounded-2xl'
            activeOpacity={0.8}
          >
            <Text className='text-lg text-white font-LexendDecaSemiBold'>
              Save Profile
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}