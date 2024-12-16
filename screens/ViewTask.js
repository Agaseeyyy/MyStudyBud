import React, { useState, useMemo, useLayoutEffect } from 'react';
import { View, Text, Alert, TextInput, Pressable, ScrollView } from 'react-native';
import { Swipeable, GestureHandlerRootView } from 'react-native-gesture-handler';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import DateTimePicker from '@react-native-community/datetimepicker';

// Component imports
import AddButton from '../components/AddButton';
import ContextMenu from '../components/ContextMenu';

// Utility imports for task management
import { 
  addTaskToSubject, 
  toggleTaskCompletion, 
  deleteTaskFromSubject,
  editTaskInSubject 
} from '../utils/taskUtils';

export default function ViewTask({ route, navigation }) {
  // Destructure route parameters
  const { 
    selectedSubject, 
    currentSubjects, 
    selectedProgram, 
    selectedYrLevel 
  } = route.params;

  // State Management
  // Main tasks state for the current subject
  const [tasks, setTasks] = useState(currentSubjects[selectedSubject] || []);
  
  // Task editing states
  const [editingTaskIndex, setEditingTaskIndex] = useState(null);
  const [editedTaskName, setEditedTaskName] = useState('');
  const [editingTaskDateTime, setEditingTaskDateTime] = useState(null);

  // UI and Interaction States
  const [sortOption, setSortOption] = useState('default');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  // Memoized sorting function for tasks
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

  // Sorting options for context menu
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

  // Task Management Handlers
  /**
   * Adds a new task to the current subject
   * @param {string} taskName - Name of the task
   * @param {Date} taskDateTime - Optional date and time for the task
   */
  const handleAddTask = async (taskName, taskDateTime) => {
    const updatedSubjects = await addTaskToSubject(
      taskName, 
      selectedProgram, 
      selectedYrLevel, 
      selectedSubject,
      taskDateTime
    );
  
    if (updatedSubjects) {
      setTasks(updatedSubjects[selectedSubject]);
    }
  };

  /**
   * Toggles the completion status of a task
   * @param {number} taskIndex - Index of the task to toggle
   */
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

  /**
   * Deletes a task from the current subject
   * @param {number} taskIndex - Index of the task to delete
   */
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

  /**
   * Edits an existing task
   */
  const handleEditTask = async () => {
    if (editingTaskIndex !== null && editedTaskName.trim()) {
      const updatedTasks = await editTaskInSubject(
        editingTaskIndex,
        editedTaskName,
        selectedProgram, 
        selectedYrLevel, 
        selectedSubject,
        editingTaskDateTime
      );
  
      if (updatedTasks) {
        setTasks(updatedTasks);
        resetEditingState();
      }
    }
  };

  /**
   * Resets the task editing state
   */
  const resetEditingState = () => {
    setEditingTaskIndex(null);
    setEditedTaskName('');
    setEditingTaskDateTime(null);
  };

  // Swipe Action Renderers
  /**
   * Renders delete action for swipeable task item
   * @param {Object} progress - Swipe progress
   * @param {Object} dragX - Drag x position
   * @param {number} taskIndex - Index of the task
   */
  const renderDeleteAction = (progress, dragX, taskIndex) => {
    return (
      <View className="items-center justify-center w-20 mb-2 bg-red-500 rounded-md">
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

  /**
   * Renders edit action for swipeable task item
   * @param {Object} progress - Swipe progress
   * @param {Object} dragX - Drag x position
   * @param {number} taskIndex - Index of the task
   */
  const renderEditAction = (progress, dragX, taskIndex) => {
    return (
      <View className="items-center justify-center w-20 mb-2 bg-green-500 rounded-md">
        <MaterialIcons 
          name="edit" 
          size={24} 
          color="white" 
          onPress={() => {
            setEditingTaskIndex(taskIndex);
            setEditedTaskName(tasks[taskIndex].name);
            setEditingTaskDateTime(
              tasks[taskIndex].dateTime 
                ? new Date(tasks[taskIndex].dateTime) 
                : new Date()
            );
          }} 
        />
      </View>
    );
  };

  // Utility Functions
  /**
   * Formats date and time string
   * @param {string} dateTimeString - Date time to format
   * @returns {string} Formatted date and time
   */
  const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return '';
    
    const dateTime = new Date(dateTimeString);
    const formattedDate = dateTime.toLocaleDateString();
    const formattedTime = dateTime.toLocaleTimeString([], {
      hour: '2-digit', 
      minute: '2-digit'
    });
    
    return `${formattedDate} ${formattedTime}`;
  };

  // Render Functions
  /**
   * Renders individual task item
   * @param {Object} item - Task item
   * @param {number} index - Task index
   */
  const renderTaskItem = (item, index) => {
    // Editing mode for the task
    if (editingTaskIndex === index) {
      return (
        <View 
          className="p-4 mb-2 bg-white border rounded-lg shadow-sm"
          style={{ 
            borderColor: '#A0D683', 
            shadowColor: '#A0D683',
            shadowOpacity: 0.1 
          }}
        >
          {/* Task name editing input */}
          <TextInput
            className="mb-2 text-base font-semibold"
            style={{ color: '#333333' }}
            value={editedTaskName}
            onChangeText={setEditedTaskName}
            autoFocus={true}
            onBlur={handleEditTask}
            onSubmitEditing={handleEditTask}
            placeholder="Edit task name"
          />

          {/* Date and Time Selection */}
          <View className='flex flex-row justify-between'>
            <Pressable 
              className='flex-1 px-3 py-2 mr-2 rounded-lg'
              style={{ backgroundColor: '#F7F9FC' }}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={{ color: '#666666', textAlign: 'center' }}>
                {editingTaskDateTime.toLocaleDateString()}
              </Text>
            </Pressable>
            <Pressable 
              className='flex-1 px-3 py-2 ml-2 rounded-lg'
              style={{ backgroundColor: '#F7F9FC' }}
              onPress={() => setShowTimePicker(true)}
            >
              <Text style={{ color: '#666666', textAlign: 'center' }}>
                {editingTaskDateTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
              </Text>
            </Pressable>
          </View>
    
          {/* Time Picker */}          
          {showTimePicker && (
            <DateTimePicker
              testID="timePicker"
              value={editingTaskDateTime}
              mode="time"
              is24Hour={false}
              display="default"
              onChange={(event, selectedTime) => {
                setShowTimePicker(false);
                setEditingTaskDateTime(selectedTime || editingTaskDateTime);
              }}
            />
          )}
        </View>
      );
    }

    // Regular task item display
    return (
      <Swipeable
        renderLeftActions={(progress, dragX) => renderDeleteAction(progress, dragX, index)}
        renderRightActions={(progress, dragX) => renderEditAction(progress, dragX, index)}
      >
        <View 
          className="flex-row items-center justify-between p-4 mb-2 rounded-lg shadow-sm"
          style={{ 
            backgroundColor: item.completed ? '#E9F5E5' : 'white',
            shadowColor: '#A0D683',
            shadowOpacity: 0.1 
          }}
        >
          <View className="flex-1 pr-4">
            <Text
              className="text-base font-semibold"
              style={{ 
                color: item.completed ? '#AAAAAA' : '#333333',
                textDecorationLine: item.completed ? 'line-through' : 'none'
              }}
            >
              {item.name}
            </Text>
            {item.dateTime && (
              <Text 
                className="mt-1 text-sm"
                style={{ 
                  color: item.completed ? '#AAAAAA' : '#666666' 
                }}
              >
                {formatDateTime(item.dateTime)}
              </Text>
            )}
          </View>
          <MaterialIcons
            name={item.completed ? 'check-circle' : 'radio-button-unchecked'}
            size={24}
            color={'#A0D683'}
            onPress={() => handleToggleTask(index)}
          />
        </View>
      </Swipeable>
    );
  };

  // Navigation Header Setup
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text 
            style={{ 
              fontSize: 18, 
              fontWeight: 'bold', 
              color: 'white',
              marginRight: 10 
            }}
          >
            {selectedSubject}
          </Text>
          <Text 
            style={{ 
              fontSize: 14, 
              color: 'rgba(255,255,255,0.7)' 
            }}
          >
            {`${tasks.length} Tasks`}
          </Text>
        </View>
      ),
      headerRight: () => (
        <ContextMenu 
          icon="sort" 
          color="white" 
          options={sortOptions} 
        />
      ),
    });
  }, [navigation, selectedSubject, tasks, sortOptions]);

  // Main Render
  return (
    <View className="flex-1">
      <GestureHandlerRootView style={{ flex: 1 }}>
        <ScrollView 
          contentContainerStyle={{ 
            padding: 16, 
            paddingBottom: 80 
          }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          nestedScrollEnabled={true}
        >
          {/* Empty State */}
          {sortedTasks.length === 0 ? (
            <View className="items-center justify-center h-64 opacity-50" >
              <MaterialIcons 
                name="check" 
                size={64} 
                color={'#6b7280'} 
              />
              <Text className="mt-4 text-base text-gray-500">
                No tasks yet. Add your first task!
              </Text>
            </View>
          ) : (
            // Task List
            sortedTasks.map((item, index) => (
              <View key={`${selectedSubject}-${index}`}>
                {renderTaskItem(item, index)}
              </View>
            ))
          )}
        </ScrollView>

        {/* Floating Add Task Button */}
        <View 
          className="absolute self-center bottom-5"
          style={{ 
            shadowColor: '#A0D683',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 4.65,
            elevation: 8 
          }}
        >
          <AddButton 
            name="task" 
            addItem={handleAddTask} 
          />
        </View>
      </GestureHandlerRootView>
    </View>
  );
}