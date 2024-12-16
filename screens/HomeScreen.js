import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Alert, SafeAreaView } from 'react-native';
import AddButton from '../components/AddButton';
import SubjectList from '../components/SubjectList';
import ContextMenu from '../components/ContextMenu';
import { saveDataToStorage, getDataFromStorage } from '../utils/asyncStorageUtils';

// Initial data structure for different programs and year levels
const initialData = {};

export default function HomeScreen({ route, navigation }) {
  // Extract program and year level from route params or use defaults
  const { 
    selectedProgram = 'BSIT', 
    selectedYrLevel = '1' 
  } = route.params || {};

  // State management
  const [data, setData] = useState(initialData);
  const [isLoading, setIsLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState('name');

  // ---------- DATA INITIALIZATION AND STRUCTURE MANAGEMENT ----------

  // Ensure the selected program and year level exist in the data structure
  useEffect(() => {
    setData(prevData => {
      // Create a deep copy to avoid direct mutation
      const newData = JSON.parse(JSON.stringify(prevData));
      
      // Validate and create program if it doesn't exist
      if (!newData[selectedProgram]) {
        newData[selectedProgram] = {};
      }
      
      // Validate and create year level if it doesn't exist
      if (!newData[selectedProgram][selectedYrLevel]) {
        newData[selectedProgram][selectedYrLevel] = { subjects: {} };
      }
      
      return newData;
    });
  }, [selectedProgram, selectedYrLevel]);

  // ---------- DATA LOADING AND STORAGE ----------

  // Load stored data when component mounts or navigates back
  useEffect(() => {
    const loadStoredData = async () => {
      try {
        const storedData = await getDataFromStorage();
        
        if (storedData) {
          // Merge stored data with initial data
          setData(prevData => ({
            ...prevData,
            ...storedData
          }));
        }
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading stored data:', error);
        Alert.alert('Error', 'Failed to load saved data');
        setIsLoading(false);
      }
    };

    // Add listener for navigation focus to reload data
    const unsubscribe = navigation.addListener('focus', loadStoredData);

    // Initial load
    loadStoredData();

    return unsubscribe;
  }, [navigation]);

  // Automatically save data to storage when data changes
  useEffect(() => {
    if (!isLoading) {
      saveDataToStorage(data);
    }
  }, [data, isLoading]);

  // ---------- DATA MANIPULATION HANDLERS ----------

  // Add a new subject to the current program and year level
  const handleAddSubject = (subjectName) => {
    if (subjectName.trim()) {
      setData((prevData) => {
        // Ensure the structure exists before modifying
        const updatedData = { 
          ...prevData,
          [selectedProgram]: {
            ...prevData[selectedProgram],
            [selectedYrLevel]: {
              subjects: {
                ...(prevData[selectedProgram]?.[selectedYrLevel]?.subjects || {}),
                [subjectName]: [],
              },
            },
          },
        };
        return updatedData;
      });
    }
  };

  // Update subjects for the current program and year level
  const handleUpdateSubjects = (updatedSubjects) => {
    setData(prevData => ({
      ...prevData,
      [selectedProgram]: {
        ...prevData[selectedProgram],
        [selectedYrLevel]: {
          subjects: updatedSubjects
        }
      }
    }));
  };

  // Delete a subject from the current program and year level
  const handleDeleteSubject = (subjectToDelete) => {
    setData(prevData => {
      const updatedData = { ...prevData };
      
      // Remove the subject from the current program and year level
      if (
        updatedData[selectedProgram] && 
        updatedData[selectedProgram][selectedYrLevel] &&
        updatedData[selectedProgram][selectedYrLevel].subjects
      ) {
        delete updatedData[selectedProgram][selectedYrLevel].subjects[subjectToDelete];
      }

      return updatedData;
    });
  };

  // Edit a subject name in the current program and year level
  const handleEditSubject = (oldSubjectName, newSubjectName) => {
    setData(prevData => {
      const updatedData = { ...prevData };
      
      // Ensure the program and year level exist
      if (
        updatedData[selectedProgram] && 
        updatedData[selectedProgram][selectedYrLevel] &&
        updatedData[selectedProgram][selectedYrLevel].subjects
      ) {
        // Get the tasks associated with the old subject name
        const tasks = updatedData[selectedProgram][selectedYrLevel].subjects[oldSubjectName] || [];
        
        // Remove old subject and add new subject with the same tasks
        delete updatedData[selectedProgram][selectedYrLevel].subjects[oldSubjectName];
        updatedData[selectedProgram][selectedYrLevel].subjects[newSubjectName] = tasks;
      }

      return updatedData;
    });
  };

  // ---------- SORTING METHODS ----------

  // Sort subjects based on selected sort order
  const sortSubjects = (subjects) => {
    const subjectsArray = Object.entries(subjects);

    switch (sortOrder) {
      case 'name':
        return Object.fromEntries(
          subjectsArray.sort(([a], [b]) => a.localeCompare(b))
        );
      
      case 'tasks':
        return Object.fromEntries(
          subjectsArray.sort(([, tasksA], [, tasksB]) => 
            (tasksB?.length || 0) - (tasksA?.length || 0)
          )
        );
      
      case 'random':
        return Object.fromEntries(
          subjectsArray.sort(() => Math.random() - 0.5)
        );
      
      default:
        return subjects;
    }
  };

  // ---------- NAVIGATION EFFECTS ----------

  // Set up sorting options in navigation header
  useEffect(() => {
    const sortingOptions = [
      { 
        label: 'Sort by Name', 
        onSelect: () => setSortOrder('name') 
      },
      { 
        label: 'Sort by Number of Tasks', 
        onSelect: () => setSortOrder('tasks') 
      },
      { 
        label: 'Random Order', 
        onSelect: () => setSortOrder('random') 
      }
    ];

    navigation.setOptions({
      headerRight: () => (
        <ContextMenu 
          icon='sort' 
          color='#fff' 
          options={sortingOptions} 
        />
      )
    });
  }, [navigation, sortOrder]);

  // ---------- RENDERING METHODS ----------

  // Show loading state while data is being initialized
  if (isLoading) {
    return (
      <View className='items-center justify-center flex-1 bg-slate-100'>
        <Text className='text-lg text-gray-500 font-LexendDecaSemiBold'>
          Loading your courses...
        </Text>
      </View>
    );
  }

  // Get current subjects for the selected program and year level
  const currentSubjects = 
    data[selectedProgram]?.[selectedYrLevel]?.subjects || {};

  // Sort subjects based on current sort order
  const sortedSubjects = sortSubjects(currentSubjects);
  const subjectCount = Object.keys(sortedSubjects).length;

  return (
    <SafeAreaView className='flex-1 bg-slate-100'>
      <View className='flex-1 px-4 pt-4'>
        {/* Program and Year Level Header */}
        <View className='flex-row items-center justify-between mb-4'>
          <Text className='text-2xl font-LexendDecaBold text-myPallet-100'>
            {selectedProgram} - Year {selectedYrLevel}
          </Text>
          <Text className='text-base text-gray-600 font-LexendDecaRegular'>
            {subjectCount} {subjectCount === 1 ? 'Course' : 'Courses'}
          </Text>
        </View>

        {/* Empty State */}
        {subjectCount === 0 && (
          <View className='items-center justify-center flex-1 opacity-50'>
            <Text className='text-lg text-center text-gray-500 font-LexendDecaSemiBold'>
              No courses added yet.{'\n'}Tap "ADD COURSE" to get started!
            </Text>
          </View>
        )}

        {/* Subject List */}
        <FlatList
          data={Object.keys(sortedSubjects)}
          keyExtractor={(item) => item}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
          renderItem={({ item }) => (
            <SubjectList
              subjectName={item}
              selectedProgram={selectedProgram}
              selectedYrLevel={selectedYrLevel}
              onTaskAdded={handleUpdateSubjects}
              onSubjectDeleted={handleDeleteSubject}
              onSubjectEdited={handleEditSubject}
              onPress={() =>
                navigation.navigate('Task', {
                  selectedSubject: item,
                  currentSubjects: currentSubjects,
                  selectedProgram,
                  selectedYrLevel
                })
              }
            />
          )}
        />
      </View>

      {/* Floating Add Button */}
      <View className='absolute self-center bottom-28'>
        <AddButton 
          name='course' 
          addItem={handleAddSubject} 
          className='shadow-lg'
        />
      </View>
    </SafeAreaView>
  );
}