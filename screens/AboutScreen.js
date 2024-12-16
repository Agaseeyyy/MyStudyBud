import React from 'react';
import { Text, View, ScrollView, Image, TouchableOpacity, Linking } from 'react-native';
import { FontAwesome5, Feather, MaterialIcons } from '@expo/vector-icons';

export default function AboutScreen() {
  const openLink = (url) => {
    Linking.openURL(url);
  };

  return (
    <View className='flex-1 bg-slate-50'>
      <ScrollView 
        className='flex-1'
        contentContainerStyle={{ 
          alignItems: 'center', 
          paddingTop: 40, 
          paddingBottom: 30 
        }}
      >
        {/* Header Section */}
        <View className='items-center mb-8'>
          <View className='mb-4 shadow-2xl shadow-green-300'>
            <Image 
              className='w-40 h-40 border-4 border-white rounded-full'
              source={require('../assets/img/cspc.png')}
            />
          </View>
          <Text className='text-5xl tracking-wide text-myPallet-200 font-LexendDecaBold'>
            MyStudy Bud
          </Text>
          <Text className='text-lg text-gray-600 font-LexendDecaRegular'>
            Version 1.0   •   Student Companion App
          </Text>
        </View>

        {/* Information Cards */}
        <View className='w-[90%] gap-5'>
          {/* Security and Privacy Card */}
          <View className='flex-row items-center p-6 bg-white border shadow-md rounded-3xl border-green-50'>
            <View className='mr-4'>
              <MaterialIcons name="security" size={50} color="#A0D683" />
            </View>
            <View className='flex-1'>
              <Text className='mb-2 text-2xl text-myPallet-200 font-LexendDecaBold'>
                Security & Privacy
              </Text>
              <Text className='text-base leading-relaxed text-gray-700 font-LexendDecaRegular'>
                • Local data storage{'\n'}
                • No network connection{'\n'}
                • Zero tracking mechanisms{'\n'}
                • No additional permissions required
              </Text>
            </View>
          </View>

          {/* Author Information Card */}
          <View className='p-6 bg-white border shadow-md rounded-3xl border-green-50'>
            <View className='items-center mb-4'>
              <Text className='text-2xl text-myPallet-200 font-LexendDecaBold'>
                About the Developer
              </Text>
            </View>
            
            <Text className='mb-4 text-base leading-relaxed text-center text-gray-700 font-LexendDecaRegular'>
              © 2024 Agassi Bustarga{'\n'}
              Information Technology Student{'\n'}
              Camarines Sur Polytechnic Colleges
            </Text>

            <Text className='mb-4 text-base italic leading-relaxed text-center text-gray-600 font-LexendDecaRegular'>
              "Crafting solutions that empower students through technology"
            </Text>

            {/* Social Media Links */}
            <View className='flex-row justify-center gap-5 mt-4 '>
              {[
                { 
                  icon: <Feather name="linkedin" size={23} color="#0A66C2" />, 
                  url: 'https://www.linkedin.com/in/agassi-bustarga',
                  bgColor: 'bg-blue-100'
                },
                { 
                  icon: <FontAwesome5 name="github" size={23} color="#333" />, 
                  url: 'https://github.com/Agaseeyyy',
                  bgColor: 'bg-gray-100'
                },
                { 
                  icon: <FontAwesome5 name="instagram" size={23} color="#F72C5B" />, 
                  url: 'https://www.instagram.com/_agaseeyyy/',
                  bgColor: 'bg-rose-100'
                }
              ].map((social, index) => (
                <TouchableOpacity 
                  key={index}
                  onPress={() => openLink(social.url)}
                  className={`items-center justify-center w-12 h-12 rounded-full ${social.bgColor} shadow-sm`}
                >
                  {social.icon}
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Technology Card */}
          <View className='p-6 bg-white border shadow-md rounded-3xl border-green-50'>
            <Text className='mb-4 text-2xl text-center text-myPallet-200 font-LexendDecaBold'>
              Built With
            </Text>
            <View className='flex-row justify-center gap-10'>
              <View className='items-center'>
                <FontAwesome5 name="react" size={40} color="#61DAFB" />
                <Text className='mt-2 text-gray-700 font-LexendDecaRegular'>React Native</Text>
              </View>
              <View className='items-center'>
                <MaterialIcons name="smartphone" size={40} color="#333" />
                <Text className='mt-2 text-gray-700 font-LexendDecaRegular'>Expo</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Footer */}
        <View className='items-center pb-20 mt-6'>
          <Text className='text-sm text-gray-500 font-LexendDecaRegular'>
            Developed with 💚 for Students
          </Text>
        </View>
      </ScrollView>      
    </View>
  );
}