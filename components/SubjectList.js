import { View, Text, TouchableOpacity, Alert } from 'react-native';
import AddButton from './AddButton';
import HamburgerMenu from './ContextMenu';
import AddItem from './AddItem';
import { addTaskToSubject } from '../utils/taskUtils';
import { useState } from 'react';

export default function SubjectList({
  subjectName, 
  onPress, 
  selectedProgram, 
  selectedYrLevel,
  onTaskAdded,
  onSubjectDeleted,
  onSubjectEdited
}) {
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);

  const handleAddTask = async (taskName) => {
    try {
      const updatedSubjects = await addTaskToSubject(
        taskName, 
        selectedProgram, 
        selectedYrLevel, 
        subjectName
      );

      if (onTaskAdded && updatedSubjects) {
        onTaskAdded(updatedSubjects);
      }
    } catch (error) {
      console.error('Error adding task in SubjectList:', error);
    }
  };

  const handleDeleteSubject = () => {
    Alert.alert(
      'Delete Course',
      `Are you sure you want to delete the course "${subjectName}"?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            if (onSubjectDeleted) {
              onSubjectDeleted(subjectName);
            }
          },
        },
      ]
    );
  };

  const handleEditSubject = (newSubjectName) => {
    if (onSubjectEdited && newSubjectName.trim() !== '') {
      onSubjectEdited(subjectName, newSubjectName);
      setIsEditModalVisible(false);
    }
  };

  const menuOptions = [
    { 
      label: 'Edit', 
      onSelect: () => setIsEditModalVisible(true) 
    },
    { 
      label: 'Delete', 
      onSelect: handleDeleteSubject 
    },
  ];

  return (
    <>
      <TouchableOpacity   
        onPress={onPress}
        activeOpacity={0.8} 
        className='flex justify-between item pb-4 w-full h-auto pl-5 mb-5 rounded-lg drop-shadow-xl bg-[#fff] shadow'
      >
        <View className='flex flex-row items-center justify-between w-full '>
          <Text className='text-lg font-LexendDecaSemiBold '>{subjectName}</Text> 
          <View>
            <HamburgerMenu icon={'dots-vertical'} options={menuOptions} />
          </View>    
        </View>
        <AddButton 
          name='task' 
          addItem={handleAddTask} 
        />
      </TouchableOpacity>

      <AddItem
        type='course'
        modalVisible={isEditModalVisible}
        setModalVisible={setIsEditModalVisible}
        addItem={handleEditSubject}
        initialValue={subjectName}
      />
    </>
  );
}