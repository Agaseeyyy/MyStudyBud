import { Text, TouchableOpacity, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import AddItem from './AddItem.js';
import { useState } from 'react';

export default function AddButton({ name, className, addItem }) { 
  const [showAddItem, setShowAddItem] = useState(false);
  return (
    <View>
    <TouchableOpacity 
      activeOpacity={0.8} 
      className={`flex flex-row items-center justify-center h-9 max-w-[170] rounded-full bg-myPallet-100 px-8 active:bg-myPallet-200 ${className}` }
      onPress={() => {
        setShowAddItem(true);
      }}
    >
       <Ionicons name="add-sharp" size={24} color="white" /> 
      <Text className='text-sm text-white font-LexendDecaRegular'>{'ADD ' + name.toUpperCase()}</Text>
    </TouchableOpacity>
    
    <AddItem 
      modalVisible={showAddItem} 
      setModalVisible={setShowAddItem} 
      type={name} 
      addItem={addItem} 
    />
    </View>
  );
}