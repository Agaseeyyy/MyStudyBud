import { StatusBar } from 'expo-status-bar';
import { useState, useEffect } from 'react';
import { Text, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import './global.css';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MenuProvider } from 'react-native-popup-menu';
import HomeScreen from './screens/HomeScreen';
import ProfileScreen from './screens/ProfileScreen';
import AboutScreen from './screens/AboutScreen';
import ViewTask from './screens/ViewTask';
import Onboarding from './screens/Onboarding';
import AppLoading from './components/AppLoading';
import { getUserProfile } from './utils/asyncStorageUtils';
import { initializeNotifications } from './utils/notificationUtils';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Create navigation stacks
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

export default function App() {
  // State variables for managing app initialization and user profile
  const [initialProfileParams, setInitialProfileParams] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFirstLaunch, setIsFirstLaunch] = useState(null);

  // Initialize notifications on app startup
  useEffect(() => {
    initializeNotifications();
  }, []);

  // Check if this is the first app launch
  useEffect(() => {
    const checkFirstLaunch = async () => {
      try {
        const hasLaunchedBefore = await AsyncStorage.getItem('hasLaunchedBefore');
        
        // Set first launch status and store launch information
        if (hasLaunchedBefore === null) {
          setIsFirstLaunch(true);
          await AsyncStorage.setItem('hasLaunchedBefore', 'true');
        } else {
          setIsFirstLaunch(false);
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error checking first launch:', error);
        setIsFirstLaunch(false);
        setIsLoading(false);
      }
    };

    checkFirstLaunch();
  }, []);

  // Load saved user profile when app starts
  useEffect(() => {
    const loadSavedProfile = async () => {
      try {
        const savedProfile = await getUserProfile();
        
        // Define default profile in case no saved profile exists
        const defaultProfile = {
          studentName: 'Student',
          selectedProgram: 'BSIT',
          selectedYrLevel: '1'
        };
  
        // Set initial profile params with saved or default profile
        setInitialProfileParams(
          savedProfile && 
          savedProfile.studentName && 
          savedProfile.selectedProgram && 
          savedProfile.selectedYrLevel 
            ? savedProfile 
            : defaultProfile
        );
      } catch (error) {
        console.error('Error loading saved profile in App.js:', error);
        
        // Set default profile in case of error
        setInitialProfileParams({
          studentName: 'Student',
          selectedProgram: 'BSIT',
          selectedYrLevel: '1'
        });
      }
    };
  
    // Only load profile if not first launch
    if (!isFirstLaunch) {
      loadSavedProfile();
    }
  }, [isFirstLaunch]);

  // Show loading screen while determining first launch status and profile
  if (isLoading) {
    return <AppLoading><View /></AppLoading>;
  }

  return (
    <AppLoading>
      <MenuProvider>
        <NavigationContainer className='flex-1 bg-light'>
          {/* Main Stack Navigator */}
          <Stack.Navigator 
            initialRouteName={isFirstLaunch ? 'Onboarding' : (initialProfileParams ? 'HomeStack' : 'Profile')}
            screenOptions={{
              headerTintColor: '#fff',
              headerStyle: {
                backgroundColor: '#A0D683',
                height: 100,
              },
              headerTitleStyle: {
                fontFamily: 'LexendDeca-Bold',                
                fontSize: 20,
              },
            }}
          >
            {/* Conditional Onboarding Screen */}
            {isFirstLaunch && (
              <Stack.Screen
                name="Onboarding"
                component={Onboarding}
                options={{headerShown: false}}
              />
            )}

            {/* Profile Setup Screen */}
            <Stack.Screen
              name="Profile"
              component={ProfileScreen}
              options={{headerShown: false}}
              initialParams={{ isFirstLaunch }}
            />

            {/* Home Stack with Bottom Tab Navigation */}
            <Stack.Screen
              options={{headerShown: false}}
              name="HomeStack"
              component={BottomBar}
              initialParams={initialProfileParams || {}}
            />

            {/* Individual Task View Screen */}
            <Stack.Screen
              name="Task"
              component={ViewTask}
              options={({ route }) => ({
                headerTitle: () => (
                  <Text className="text-xl text-white font-LexendDecaBold">
                    {route.params?.selectedSubject || 'Task'}
                  </Text>
                ),
              })}
            />
          </Stack.Navigator>

          <StatusBar style="auto" />
        </NavigationContainer>
      </MenuProvider>
    </AppLoading>
  );
}

// Bottom Tab Navigation Component
function BottomBar({ route }) {
  const [studentName, setStudentName] = useState(route.params?.studentName || 'Student');

  return (
    <View style={{ flex: 1 }}>
      {/* Bottom Tab Navigator */}
      <Tab.Navigator 
        screenOptions={({ route }) => ({
          // Tab Navigator styling and configuration
          headerTintColor: '#fff',
          headerStyle: {
            backgroundColor: '#A0D683',
            height: 100,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 5,
          },
          headerTitleStyle: {
            fontFamily: 'LexendDeca-Bold',                
            fontSize: 20,
          },
          tabBarStyle: {
            marginHorizontal: 20,
            height: 60,
            position: 'absolute',
            bottom: 25,
            left: 0,
            right: 0,
            backgroundColor: '#fff',
            borderRadius: 30, 
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.1,
            shadowRadius: 6,
            elevation: 6, 
            paddingBottom: 5,
            paddingTop: 5,
            borderWidth: 1, 
            borderColor: '#E5E7EB', 
          },
          tabBarActiveTintColor: '#A0D683',
          tabBarInactiveTintColor: '#9CA3AF', 
          tabBarIcon: ({ color, focused, size }) => {
            let iconName;
            let iconSize = 22;
          
            if (route.name == 'Home') {
              iconName = focused ? 'home' : 'home-outline';
            } else if (route.name === 'Profile') {
              iconName = focused ? 'person' : 'person-outline';
            } else if (route.name === 'About us') {
              iconName = focused ? 'code-slash' : 'code-outline';
            }
            
            return (
              <View style={{
                justifyContent: 'center', 
                alignItems: 'center', 
                paddingTop: 5, 
              }}>
                <Ionicons 
                  name={iconName} 
                  size={iconSize} 
                  color={color} 
                />
              </View>
            );
          },
          tabBarLabelStyle: {
            fontFamily: 'LexendDeca-Bold',
            fontSize: 10,
            marginBottom: 4,
          },
          tabBarItemStyle: {
            borderRadius: 30,
          },
        })}
      >
        {/* Home Tab */}
        <Tab.Screen 
          name='Home' 
          component={HomeScreen}   
          initialParams={route.params}       
          options={{
            tabBarLabel: 'Home',
            headerTitle: () => (
              <Text className="text-xl text-white font-LexendDecaBold">
                Hello, {studentName}
              </Text>
            ),                          
          }}   
        />

        {/* Profile Tab */}
        <Tab.Screen 
          name='Profile' 
          component={ProfileScreen}
          options={{
            tabBarLabel: 'Profile',
          }}   
        />
        
        {/* About Tab */}
        <Tab.Screen 
          name='About us'
          component={AboutScreen}
          options={{
            tabBarLabel: 'About',
          }}
        />
      </Tab.Navigator>
    </View>
  )
}