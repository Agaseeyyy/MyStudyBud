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
import AppLoading from './components/AppLoading';
import { getUserProfile } from './utils/asyncStorageUtils';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

export default function App() {
  const [initialProfileParams, setInitialProfileParams] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load saved profile when app starts
  useEffect(() => {
    const loadSavedProfile = async () => {
      try {
        const savedProfile = await getUserProfile();
        if (savedProfile) {
          setInitialProfileParams(savedProfile);
        }
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading saved profile in App.js:', error);
        setIsLoading(false);
      }
    };

    loadSavedProfile();
  }, []);

  // Show loading state if profile is being loaded
  if (isLoading) {
    return <AppLoading><View /></AppLoading>;
  }

  return (
    <AppLoading>
      <MenuProvider>
        <NavigationContainer className='flex-1 bg-light'>
          <Stack.Navigator 
            initialRouteName={initialProfileParams ? 'HomeStack' : 'Profile'}
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
            <Stack.Screen
              options={{headerShown: false}}
              name="HomeStack"
              component={BottomBar}
              initialParams={initialProfileParams || {}}
            />
            <Stack.Screen
              name="Profile"
              component={ProfileScreen}
              options={{headerShown: false}}
            />
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

function BottomBar({ route }) {
  const [studentName, setStudentName] = useState(route.params?.studentName || 'Student');
  
  return (
    <View style={{ flex: 1 }}>
      <Tab.Navigator 
        screenOptions={({ route }) => ({
          headerTintColor: '#fff',
          headerStyle: {
            backgroundColor: '#A0D683',
            height: 100,
          },
          headerTitleStyle: {
            fontFamily: 'LexendDeca-Bold',                
            fontSize: 20,
          },
          tabBarStyle: {
            marginHorizontal: 10,
            height: 55,
            position: 'absolute',
            bottom: 25,
            left: 0,
            right: 0,
            backgroundColor: '#fff',
            borderRadius: 100,
            elevation: 4, 
            shadowOpacity: 4,
            paddingBottom: 10,
            paddingTop: 10,         
          },
          tabBarActiveTintColor: '#A0D683',
          tabBarIcon: ({ color }) => {
            let iconName;

            if (route.name == 'Home') {
              iconName = 'home-outline';
              setStudentName(route.params?.studentName || 'Student');
            } else if (route.name === 'Profile') {
              iconName = 'person-outline';
            } else if (route.name === 'About us') {
              iconName = 'code-slash';
            }

            return <Ionicons name={iconName} size={20} color={color} />;
          },
          tabBarLabelStyle: {
            fontFamily: 'LexendDeca-Bold',
          },
        })}
      >
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

        <Tab.Screen 
          name='Profile' 
          component={ProfileScreen}
          options={{
            tabBarLabel: 'Profile',
          }}   
        />
        
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