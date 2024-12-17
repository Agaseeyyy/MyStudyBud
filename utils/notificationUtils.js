import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { getDataFromStorage } from './asyncStorageUtils';

// Configure notification settings
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

// Request notification permissions
export const requestNotificationPermissions = async () => {
  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    
    if (finalStatus !== 'granted') {
      console.log('Permission not granted for notifications');
      return false;
    }
    return true;
  } catch (error) {
    console.error('Error requesting notification permissions:', error);
    return false;
  }
};

// Schedule notifications for upcoming task deadlines
export const scheduleTaskDeadlineNotifications = async (storedData = null) => {
  try {
    // Request permissions first
    const hasPermission = await requestNotificationPermissions();
    if (!hasPermission) return;

    // If no data is passed, retrieve from storage
    if (!storedData) {
      storedData = await getDataFromStorage();
    }

    // Cancel all previous scheduled notifications
    await Notifications.cancelAllScheduledNotificationsAsync();

    // If no data found, return early
    if (!storedData) return;

    // Iterate through all programs, year levels, and subjects
    Object.keys(storedData).forEach(program => {
      Object.keys(storedData[program]).forEach(yearLevel => {
        const subjects = storedData[program][yearLevel].subjects;
        
        if (subjects) {
          Object.keys(subjects).forEach(subjectName => {
            const tasks = subjects[subjectName];
            
            tasks.forEach((task, index) => {
              // Check if task has a deadline and is not completed
              if (task.dateTime && !task.completed) {
                scheduleTaskNotification(
                  task, 
                  index, 
                  subjectName, 
                  program, 
                  yearLevel
                );
              }
            });
          });
        }
      });
    });
  } catch (error) {
    console.error('Error scheduling task notifications:', error);
  }
};

// Schedule a specific notification for a task
const scheduleTaskNotification = async (
  task, 
  taskIndex, 
  subjectName, 
  program, 
  yearLevel
) => {
  const taskDeadline = new Date(task.dateTime);
  
  try {
    // Notification for 1 day before deadline
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Upcoming Task Deadline",
        body: `Your task "${task.name}" in ${subjectName} is due tomorrow!`,
        data: { 
          taskName: task.name, 
          subjectName, 
          program, 
          yearLevel,
          taskIndex 
        }
      },
      trigger: {
        date: new Date(taskDeadline.getTime() - 24 * 60 * 60 * 1000)
      },
    });

    // Notification for 1 hour before deadline
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Task Deadline Soon",
        body: `Your task "${task.name}" in ${subjectName} is due in 1 hour!`,
        data: { 
          taskName: task.name, 
          subjectName, 
          program, 
          yearLevel,
          taskIndex 
        }
      },
      trigger: {
        date: new Date(taskDeadline.getTime() - 60 * 60 * 1000)
      },
    });
  } catch (error) {
    console.error('Error scheduling task notification:', error);
  }
};

// Listen for notification responses
export const setupNotificationListeners = () => {
  // Handle when user taps on a notification
  Notifications.addNotificationResponseReceivedListener(response => {
    const { taskName, subjectName, program, yearLevel, taskIndex } = 
      response.notification.request.content.data;
    
    console.log('Notification tapped:', {
      taskName, 
      subjectName, 
      program, 
      yearLevel, 
      taskIndex
    });
    
    // You could add navigation logic here to open the specific task
  });
};

// Initialize notification setup when app starts
export const initializeNotifications = async () => {
  try {
    // Request permissions
    await requestNotificationPermissions();
    
    // Setup listeners
    setupNotificationListeners();
    
    // Schedule initial notifications
    await scheduleTaskDeadlineNotifications();
  } catch (error) {
    console.error('Error initializing notifications:', error);
  }
};