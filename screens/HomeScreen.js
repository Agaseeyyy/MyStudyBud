import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Alert } from 'react-native';
import AddButton from '../components/AddButton';
import SubjectList from '../components/SubjectList';
import ContextMenu from '../components/ContextMenu';
import { saveDataToStorage, getDataFromStorage, clearStoredData } from '../utils/asyncStorageUtils';

const initialData = {
  BSIT: { 1: { subjects: {} } },
  BSCS: { 1: { subjects: {} }, 2: { subjects: {} } },
  BSIS: { 1: { subjects: {} } }
};

export default function HomeScreen({ route, navigation }) {
  // Provide default values to prevent undefined errors
  const { 
    selectedProgram = 'BSIT', 
    selectedYrLevel = '1' 
  } = route.params || {};

  const [data, setData] = useState(initialData);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState('name'); // Default sort order

  // Ensure the selected program and year level exist in the data
  useEffect(() => {
    setData(prevData => {
      // Create a deep copy to avoid mutation
      const newData = JSON.parse(JSON.stringify(prevData));
      
      // Ensure the selected program exists
      if (!newData[selectedProgram]) {
        newData[selectedProgram] = {};
      }
      
      // Ensure the selected year level exists
      if (!newData[selectedProgram][selectedYrLevel]) {
        newData[selectedProgram][selectedYrLevel] = { subjects: {} };
      }
      
      return newData;
    });
  }, [selectedProgram, selectedYrLevel]);

  // Load data from AsyncStorage when component mounts and when navigating back
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

    const unsubscribe = navigation.addListener('focus', loadStoredData);

    // Initial load
    loadStoredData();

    return unsubscribe;
  }, [navigation]);

  // Save data to storage whenever data changes
  useEffect(() => {
    if (!isLoading) {
      saveDataToStorage(data);
    }
  }, [data, isLoading]);

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

 // Sorting function
 const sortSubjects = (subjects) => {
  const subjectsArray = Object.entries(subjects);

  switch (sortOrder) {
    case 'name':
      // Sort alphabetically by subject name
      return Object.fromEntries(
        subjectsArray.sort(([a], [b]) => a.localeCompare(b))
      );
    
    case 'tasks':
      // Sort by number of tasks (descending)
      return Object.fromEntries(
        subjectsArray.sort(([, tasksA], [, tasksB]) => 
          (tasksB?.length || 0) - (tasksA?.length || 0)
        )
      );
    
    case 'random':
      // Randomize order
      return Object.fromEntries(
        subjectsArray.sort(() => Math.random() - 0.5)
      );
    
    default:
      return subjects;
  }
};

// Navigation effect to set header right component
useEffect(() => {
  // Sorting menu options
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

if (isLoading) {
  return <View><Text>Loading...</Text></View>;
}

const currentSubjects = 
  data[selectedProgram]?.[selectedYrLevel]?.subjects || {};

// Apply sorting to current subjects
const sortedSubjects = sortSubjects(currentSubjects);
  
  return (
    <View className='flex-col items-center justify-center flex-[0.91] p-5 bg-slate-100'>
      <FlatList
        data={Object.keys(sortedSubjects)}
        keyExtractor={(item) => item}
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

      <View>
        <AddButton 
          name='course' 
          addItem={handleAddSubject} 
        />
      </View>
    </View>
  );
}