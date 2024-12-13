import { Modal, Text, View, Pressable, TextInput, TouchableOpacity } from 'react-native';
import { useState, useEffect } from 'react';

export default function AddItem({ 
  route, 
  modalVisible, 
  setModalVisible, 
  type, 
  addItem, 
  initialValue = '' 
}) {
  const displayType = type ? type.toUpperCase() : 'DEFAULT'; 
  const [itemInput, setItemInput] = useState(initialValue);

  // Reset input when the modal is opened, using initialValue
  useEffect(() => {
    if (modalVisible) {
      setItemInput(initialValue);
    }
  }, [modalVisible, initialValue]);

  return (
    <Modal
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)} 
      animationType="fade"
      transparent={true}
    >
      <TouchableOpacity 
        className='items-center justify-center flex-1 bg-[rgba(0,0,0,0.5)]'
        activeOpacity={1}
        onPress={() => setModalVisible(false)}
      >
      
        <View className='items-center gap-3 p-5 bg-white w-80 rounded-xl shadow-black drop-shadow-md elevation-md'>
          <Text className='text-base font-LexendDecaSemiBold'>
            {initialValue ? 'EDIT ' + displayType : 'ADD ' + displayType}
          </Text>
          <View className='w-full'>
            <Text className='mb-1 font-LexendDecaBold text-myPallet-100'>
              {displayType + ' NAME'}
            </Text>
            <View className='flex flex-row items-center w-full py-1 pl-2 pr-8 bg-white border border-opacity-50 rounded-lg border-myPallet-100'>
              <TextInput 
                className='w-full'
                value={itemInput}
                onChangeText={setItemInput}
                placeholder={'Enter ' + type + ' name'}
              />
            </View>
          </View>
          <View className='flex flex-row gap-2'>
            <Pressable
              className='h-10 p-2 mt-3 bg-red-500 rounded-md'
              onPress={() => setModalVisible(false)} 
            >
              <Text className='text-center text-white font-LexendDecaSemiBold'>Close</Text>
            </Pressable>

            <Pressable
              className='h-10 p-2 mt-3 bg-blue-400 rounded-md '
              onPress={() => {
                addItem(itemInput)
                setModalVisible(false)        
                setItemInput('')       
              }} 
            >
              <Text className='text-center text-white font-LexendDecaSemiBold'>Save</Text>
            </Pressable>
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}