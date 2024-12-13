import React, { useState, useMemo, useLayoutEffect } from 'react';
import { View, Text, Alert, TextInput } from 'react-native';
import { Swipeable, GestureHandlerRootView } from 'react-native-gesture-handler';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import AddButton from '../components/AddButton';
import ContextMenu from '../components/ContextMenu';
import { 
  addTaskToSubject, 
  toggleTaskCompletion, 
  deleteTaskFromSubject,
  editTaskInSubject 
} from '../utils/taskUtils';

export default function ViewTask({ route, navigation }) {
  const { selectedSubject, currentSubjects, selectedProgram, selectedYrLevel } = route.params;

  const [tasks, setTasks] = useState(currentSubjects[selectedSubject] || []);
  const [editingTaskIndex, setEditingTaskIndex] = useState(null);
  const [editedTaskName, setEditedTaskName] = useState('');
  const [sortOption, setSortOption] = useState('default');

  // Sorting function
  const sortedTasks = useMemo(() => {
    switch(sortOption) {
      case 'name':
        return [...tasks].sort((a, b) => a.name.localeCompare(b.name));
      case 'completed':
        return [...tasks].sort((a, b) => b.completed - a.completed);
      case 'uncompleted':
        return [...tasks].sort((a, b) => a.completed - b.completed);
      default:
        return tasks;
    }
  }, [tasks, sortOption]);

  // Sorting options for ContextMenu
  const sortOptions = [
    { 
      label: 'Default Order', 
      onSelect: () => setSortOption('default') 
    },
    { 
      label: 'Sort by Name', 
      onSelect: () => setSortOption('name') 
    },
    { 
      label: 'Sort by Completed', 
      onSelect: () => setSortOption('completed') 
    },
    { 
      label: 'Sort by Uncompleted', 
      onSelect: () => setSortOption('uncompleted') 
    }
  ];

  // Handle adding a new task
  const handleAddTask = async (taskName) => {
    const updatedSubjects = await addTaskToSubject(
      taskName, 
      selectedProgram, 
      selectedYrLevel, 
      selectedSubject
    );

    if (updatedSubjects) {
      setTasks(updatedSubjects[selectedSubject]);
    }
  };

  // Handle toggling task completion
  const handleToggleTask = async (taskIndex) => {
    const updatedTasks = await toggleTaskCompletion(
      taskIndex, 
      selectedProgram, 
      selectedYrLevel, 
      selectedSubject
    );

    if (updatedTasks) {
      setTasks(updatedTasks);
    }
  };

  // Handle deleting a task
  const handleDeleteTask = async (taskIndex) => {
    const updatedTasks = await deleteTaskFromSubject(
      taskIndex, 
      selectedProgram, 
      selectedYrLevel, 
      selectedSubject
    );

    if (updatedTasks) {
      setTasks(updatedTasks);
    }
  };

  // Handle editing a task
  const handleEditTask = async () => {
    if (editingTaskIndex !== null && editedTaskName.trim()) {
      const updatedTasks = await editTaskInSubject(
        editingTaskIndex,
        editedTaskName,
        selectedProgram, 
        selectedYrLevel, 
        selectedSubject
      );

      if (updatedTasks) {
        setTasks(updatedTasks);
        setEditingTaskIndex(null);
        setEditedTaskName('');
      }
    }
  };

  // Render delete action for swipe
  const renderDeleteAction = (progress, dragX, taskIndex) => {
    return (
      <View className="items-center justify-center w-20 h-full bg-red-500">
        <MaterialIcons 
          name="delete" 
          size={24} 
          color="white" 
          onPress={() => {
            Alert.alert(
              "Delete Task",
              "Are you sure you want to delete this task?",
              [
                { 
                  text: "Cancel", 
                  style: "cancel" 
                },
                { 
                  text: "Delete", 
                  style: "destructive", 
                  onPress: () => handleDeleteTask(taskIndex) 
                }
              ]
            );
          }} 
        />
      </View>
    );
  };

  // Render edit action for swipe
  const renderEditAction = (progress, dragX, taskIndex) => {
    return (
      <View className="items-center justify-center w-20 h-full bg-green-500">
        <MaterialIcons 
          name="edit" 
          size={24} 
          color="white" 
          onPress={() => {
            setEditingTaskIndex(taskIndex);
            setEditedTaskName(tasks[taskIndex].name);
          }} 
        />
      </View>
    );
  };

  // Render task item
  const renderTaskItem = (item, index) => {
    if (editingTaskIndex === index) {
      return (
        <View className="bg-white border-b border-gray-200">
          <TextInput
            className="p-4 text-base font-semibold text-gray-700"
            value={editedTaskName}
            onChangeText={setEditedTaskName}
            autoFocus={true}
            onBlur={handleEditTask}
            onSubmitEditing={handleEditTask}
          />
        </View>
      );
    }

    return (
      <Swipeable
        renderLeftActions={(progress, dragX) => renderDeleteAction(progress, dragX, index)}
        renderRightActions={(progress, dragX) => renderEditAction(progress, dragX, index)}
      >
        <View 
          className={`flex-row items-center justify-between p-4 border-b border-gray-200 
            ${item.completed ? 'bg-gray-100' : 'bg-white'}`}
        >
          <Text
            className={`flex-1 text-base font-semibold 
              ${item.completed ? 'text-gray-400 line-through' : 'text-gray-700'}`}
          >
            {item.name}
          </Text>
          <MaterialIcons
            name={item.completed ? 'check-circle' : 'radio-button-unchecked'}
            size={24}
            color="#A0D683"
            onPress={() => handleToggleTask(index)}
          />
        </View>
      </Swipeable>
    );
  };

   // Set up navigation header
   useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <ContextMenu 
          icon="sort" 
          color="white" 
          options={sortOptions} 
        />
      )
    });
  }, [navigation, selectedSubject, sortOptions]);

  return (
    <View className="flex-1 bg-gray-100">
      <GestureHandlerRootView>
        <View className="flex-1 p-4">
          {sortedTasks.map((item, index) => (
            <View className="pb-1" key={`${selectedSubject}-${index}`}>
              {renderTaskItem(item, index)}
            </View>
          ))}
        </View>
        <View className="m-auto mb-5">
          <AddButton 
            name="task" 
            addItem={handleAddTask} 
          />
        </View>
      </GestureHandlerRootView>
    </View>
  );
}