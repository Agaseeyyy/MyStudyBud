import { Modal, Text, View, Pressable, TextInput, TouchableOpacity } from 'react-native';
import { useState, useEffect } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function AddItem({ 
  route, 
  modalVisible, 
  setModalVisible, 
  type, 
  addItem, 
  initialValue = '',
  initialDateTime = null 
}) {
  const displayType = type ? type.toUpperCase() : 'DEFAULT'; 
  const [itemInput, setItemInput] = useState(initialValue);
  
  // State for date and time picker
  const [selectedDate, setSelectedDate] = useState(initialDateTime || new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  // Reset input when the modal is opened, using initialValue and initialDateTime
  useEffect(() => {
    if (modalVisible) {
      setItemInput(initialValue);
      setSelectedDate(initialDateTime || new Date());
    }
  }, [modalVisible, initialValue, initialDateTime]);

  // Handle date change
  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || selectedDate;
    setShowDatePicker(false);
    setSelectedDate(currentDate);
  };

  // Handle time change
  const onTimeChange = (event, selectedTime) => {
    const currentTime = selectedTime || selectedDate;
    setShowTimePicker(false);
    setSelectedDate(currentTime);
  };

  // Format date and time for display
  const formatDateTime = (date) => {
    return date.toLocaleString('en-US', {
      date: 'short',
      time: 'short'
    });
  };

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

          {/* Task Name Input */}
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

          {/* Date and Time Selection (only for tasks) */}
          {type === 'task' && (
            <View className='w-full'>
              <Text className='mb-1 font-LexendDecaBold text-myPallet-100'>
                DATE AND TIME
              </Text>
              <View className='flex flex-row justify-between'>
                <Pressable 
                  className='flex-1 px-3 py-2 mr-2 bg-gray-100 rounded-lg'
                  onPress={() => setShowDatePicker(true)}
                >
                  <Text className='text-center'>
                    {selectedDate.toLocaleDateString()}
                  </Text>
                </Pressable>
                <Pressable 
                  className='flex-1 px-3 py-2 ml-2 bg-gray-100 rounded-lg'
                  onPress={() => setShowTimePicker(true)}
                >
                  <Text className='text-center'>
                    {selectedDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </Text>
                </Pressable>
              </View>

              {/* Date Picker */}
              {showDatePicker && (
                <DateTimePicker
                  testID="datePicker"
                  value={selectedDate}
                  mode="date"
                  is24Hour={false}
                  display="default"
                  onChange={onDateChange}
                />
              )}

              {/* Time Picker */}
              {showTimePicker && (
                <DateTimePicker
                  testID="timePicker"
                  value={selectedDate}
                  mode="time"
                  is24Hour={false}
                  display="default"
                  onChange={onTimeChange}
                />
              )}
            </View>
          )}

          {/* Action Buttons */}
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
                // If it's a task and input is not empty, pass both item name and selected date
                if (type === 'task') {
                  if (itemInput.trim()) {
                    // Pass only the item name as a string
                    addItem(itemInput, selectedDate);
                    setModalVisible(false);        
                    setItemInput('');
                  }
                } else {
                  // For non-task items, pass just the item name
                  addItem(itemInput);
                  setModalVisible(false);        
                  setItemInput('');
                }
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