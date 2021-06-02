import 'react-native-gesture-handler';
import React, {useEffect, useState} from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer, TabActions } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createStackNavigator } from '@react-navigation/stack';
import firebase from 'firebase';
import { firebaseConfig } from './firebase';
import Login from './pages/Login';
import CreateAccount from './pages/CreateAccount';
import Dashboard from './pages/Dashboard';
import Friends from './components/Friends';
import Search from './components/Search';
import CreateEvent from './components/CreateEvent';
import Settings from './components/Settings';
import InviteFriends from './components/InviteFriends';


export default function App() {

  // --- Initialize Firebase --- //
  if (!firebase.apps.length) { firebase.initializeApp(firebaseConfig); }
  else { firebase.app(); }
  // --------------------------- //

  // --- Authenticate User ----- //
  const [authUser, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged(user => {
      (user ? setUser(user) : setUser(null));
    });
    return () => {
      unsubscribe();
    }
  })
  // --------------------------- //

  
  // --- Stacks ---------------- //
  const CreateEventStackScreen = () => (
    <CreateEventStack.Navigator>
      <CreateEventStack.Screen name="Create" component={CreateEvent} options={{title:"Create Event"}} initialParams={{user: authUser}}/>
      <CreateEventStack.Screen name="InviteFriends" component={InviteFriends} options={{title:"Invite Friends"}} />
    </CreateEventStack.Navigator>
  );

  const SearchStackScreen = () => (
    <SearchStack.Navigator>
      <SearchStack.Screen name="Search" component={Search}/>
    </SearchStack.Navigator>
  );
  
  const FriendStackScreen = () => (
    <FriendStack.Navigator>
      <FriendStack.Screen name="Friends" component={Friends}/>
    </FriendStack.Navigator>
  );
  
  const SettingStackScreen = () => (
    <SettingStack.Navigator>
      <SettingStack.Screen name="Settings" component={Settings}/>
    </SettingStack.Navigator>
  );
  // --------------------------- //


  return (
    authUser ? (
    <NavigationContainer>
      <Tabs.Navigator>
        <Tabs.Screen name="Home" component={Dashboard} initialParams={{user: authUser}}/>
        <Tabs.Screen name="Search" component={SearchStackScreen} />
        <Tabs.Screen name="CreateEvent" component={CreateEventStackScreen} options={{title: "Create Event"}}/>
        <Tabs.Screen name="Friends" component={FriendStackScreen} />
        <Tabs.Screen name="Settings" component={SettingStackScreen} />
      </Tabs.Navigator>
    </NavigationContainer>
    ) : (
    <NavigationContainer>
      <AuthStack.Navigator>
        <AuthStack.Screen name="Login" component={Login}/>
        <AuthStack.Screen name="CreateAccount" component={CreateAccount} options={{title: "Create Account"}}/>
      </AuthStack.Navigator>
    </NavigationContainer>)
  );
}

const AuthStack = createStackNavigator();
const CreateEventStack = createStackNavigator();
const SearchStack = createStackNavigator();
const FriendStack = createStackNavigator();
const SettingStack = createStackNavigator();

const Tabs = createBottomTabNavigator();

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
