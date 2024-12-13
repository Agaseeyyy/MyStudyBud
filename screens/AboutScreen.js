import { Text, View, ScrollView, Image } from 'react-native';

export default function AboutScreen() {
  return (
    <View className='items-center flex-1 gap-10 py-10 bg-slate-100'>
      <Image 
        className='rounded-full w-36 h-36 mt'
        source={require('../assets/img/cspc.png')}
        />

      <ScrollView className='flex px-5 mb-10 gap-y-5'>
        <Text className='text-3xl font-LexendDecaBold'>MyStudy Bud</Text>
        <Text className='text-lg font-LexendDecaRegular'>Version 1.0</Text>

        <Text className='text-3xl font-LexendDecaBold'>Security and Privacy</Text>
        <Text className='text-lg font-LexendDecaRegular'>MyStudy Bud does not connect to the network and the data is saved only on your device.{'\n\n'} 
        This application does not require any permission and waives advertising and tracking mechanisms.</Text>
        <Text className='text-3xl font-LexendDecaBold'>Author</Text>
        <Text className='pb-10 text-lg font-LexendDecaRegular'>© 2024 Agassi Bustarga, Camarines Sur Polytechnic Colleges.{"\n\n"}
        This application is built using React Native, allowing for a seamless and efficient cross-platform experience. It leverages modern mobile development capabilities to deliver a smooth user interface and essential functionality.
        </Text>
      </ScrollView>

    </View>

  );
}