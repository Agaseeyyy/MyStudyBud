import { saveDataToStorage, getDataFromStorage } from './asyncStorageUtils';
import { scheduleTaskDeadlineNotifications } from './notificationUtils';

// Add notification scheduling to existing functions

export const addTaskToSubject = async (
  taskName, 
  selectedProgram, 
  selectedYrLevel, 
  selectedSubject,
  dateTime = null
) => {
  try {
    // Get current stored data
    const storedData = await getDataFromStorage() || {};

    // Create new task with optional dateTime
    const newTask = { 
      name: taskName, 
      completed: false,
      ...(dateTime && { dateTime: dateTime.toISOString() }) 
    };

    // Ensure the program, year level, and subject exist in the data structure
    const updatedData = {
      ...storedData,
      [selectedProgram]: {
        ...storedData[selectedProgram],
        [selectedYrLevel]: {
          ...storedData[selectedProgram]?.[selectedYrLevel],
          subjects: {
            ...storedData[selectedProgram]?.[selectedYrLevel]?.subjects,
            [selectedSubject]: [
              ...(storedData[selectedProgram]?.[selectedYrLevel]?.subjects?.[selectedSubject] || []),
              newTask
            ]
          }
        }
      }
    };

    // Save updated data to storage
    await saveDataToStorage(updatedData);

    // Reschedule notifications
    await scheduleTaskDeadlineNotifications();

    // Return the updated subjects for the current program and year level
    return updatedData[selectedProgram][selectedYrLevel].subjects;
  } catch (error) {
    console.error('Error adding task:', error);
    return null;
  }
};

export const toggleTaskCompletion = async (
  taskIndex, 
  selectedProgram, 
  selectedYrLevel, 
  selectedSubject
) => {
  try {
    // Get current stored data
    const storedData = await getDataFromStorage() || {};

    // Get current tasks for the subject
    const currentTasks = 
      storedData[selectedProgram]?.[selectedYrLevel]?.subjects?.[selectedSubject] || [];

    // Create updated tasks with toggled completion
    const updatedTasks = currentTasks.map((task, index) => 
      index === taskIndex ? { ...task, completed: !task.completed } : task
    );

    // Create updated data structure
    const updatedData = {
      ...storedData,
      [selectedProgram]: {
        ...storedData[selectedProgram],
        [selectedYrLevel]: {
          ...storedData[selectedProgram]?.[selectedYrLevel],
          subjects: {
            ...storedData[selectedProgram]?.[selectedYrLevel]?.subjects,
            [selectedSubject]: updatedTasks
          }
        }
      }
    };

    // Save updated data to storage
    await saveDataToStorage(updatedData);

    // Reschedule notifications
    await scheduleTaskDeadlineNotifications();

    // Return the updated tasks
    return updatedTasks;
  } catch (error) {
    console.error('Error toggling task completion:', error);
    return null;
  }
};

export const deleteTaskFromSubject = async (
  taskIndex, 
  selectedProgram, 
  selectedYrLevel, 
  selectedSubject
) => {
  try {
    // Get current stored data
    const storedData = await getDataFromStorage() || {};

    // Get current tasks for the subject
    const currentTasks = 
      storedData[selectedProgram]?.[selectedYrLevel]?.subjects?.[selectedSubject] || [];

    // Create updated tasks by removing the specified task
    const updatedTasks = currentTasks.filter((_, index) => index !== taskIndex);

    // Create updated data structure
    const updatedData = {
      ...storedData,
      [selectedProgram]: {
        ...storedData[selectedProgram],
        [selectedYrLevel]: {
          ...storedData[selectedProgram]?.[selectedYrLevel],
          subjects: {
            ...storedData[selectedProgram]?.[selectedYrLevel]?.subjects,
            [selectedSubject]: updatedTasks
          }
        }
      }
    };

    // Save updated data to storage
    await saveDataToStorage(updatedData);

    // Reschedule notifications
    await scheduleTaskDeadlineNotifications();

    // Return the updated tasks
    return updatedTasks;
  } catch (error) {
    console.error('Error deleting task:', error);
    return null;
  }
};

export const editTaskInSubject = async (
  taskIndex, 
  newTaskName,
  selectedProgram, 
  selectedYrLevel, 
  selectedSubject,
  newDateTime = null
) => {
  try {
    // Get current stored data
    const storedData = await getDataFromStorage() || {};

    // Get current tasks for the subject
    const currentTasks = 
      storedData[selectedProgram]?.[selectedYrLevel]?.subjects?.[selectedSubject] || [];

    // Create updated tasks with edited task
    const updatedTasks = currentTasks.map((task, index) => 
      index === taskIndex 
        ? { 
            ...task, 
            name: newTaskName,
            ...(newDateTime ? { dateTime: newDateTime.toISOString() } : {}) 
          } 
        : task
    );

    // Create updated data structure
    const updatedData = {
      ...storedData,
      [selectedProgram]: {
        ...storedData[selectedProgram],
        [selectedYrLevel]: {
          ...storedData[selectedProgram]?.[selectedYrLevel],
          subjects: {
            ...storedData[selectedProgram]?.[selectedYrLevel]?.subjects,
            [selectedSubject]: updatedTasks
          }
        }
      }
    };

    // Save updated data to storage
    await saveDataToStorage(updatedData);

    // Reschedule notifications
    await scheduleTaskDeadlineNotifications();

    // Return the updated tasks
    return updatedTasks;
  } catch (error) {
    console.error('Error editing task:', error);
    return null;
  }
};