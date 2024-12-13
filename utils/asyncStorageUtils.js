import AsyncStorage from '@react-native-async-storage/async-storage';

// Save entire data structure to AsyncStorage
export const saveDataToStorage = async (data) => {
  try {
    // Stringify the entire data object
    const dataJson = JSON.stringify(data);
    await AsyncStorage.setItem('appTaskData', dataJson);
  } catch (error) {
    console.error('Error saving data to storage:', error);
  }
};

// Retrieve entire data structure from AsyncStorage
export const getDataFromStorage = async () => {
  try {
    const dataJson = await AsyncStorage.getItem('appTaskData');
    return dataJson ? JSON.parse(dataJson) : null;
  } catch (error) {
    console.error('Error retrieving data from storage:', error);
    return null;
  }
};

// Clear all stored data (optional, for debugging)
export const clearStoredData = async () => {
  try {
    await AsyncStorage.removeItem('appTaskData');
  } catch (error) {
    console.error('Error clearing storage:', error);
  }
};

// Save user profile to AsyncStorage
export const saveUserProfile = async (profileData) => {
  try {
    await AsyncStorage.setItem('userProfile', JSON.stringify(profileData));
  } catch (error) {
    console.error('Error saving user profile:', error);
  }
};

// Retrieve user profile from AsyncStorage
export const getUserProfile = async () => {
  try {
    const profileJson = await AsyncStorage.getItem('userProfile');
    return profileJson ? JSON.parse(profileJson) : null;
  } catch (error) {
    console.error('Error retrieving user profile:', error);
    return null;
  }
};

// Clear user profile (for debugging or reset)
export const clearUserProfile = async () => {
  try {
    await AsyncStorage.removeItem('userProfile');
  } catch (error) {
    console.error('Error clearing user profile:', error);
  }
};