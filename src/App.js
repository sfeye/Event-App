import "react-native-gesture-handler";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { NavigationContainer, TabActions } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { Ionicons } from "@expo/vector-icons";
import firebase from "firebase";
import { firebaseConfig } from "./firebase";
import Login from "./pages/Login";
import CreateAccount from "./pages/CreateAccount";
import Home from "./pages/Home";
import Friends from "./components/FriendPageComponents/Friends";
import Search from "./components/Search";
import CreateEvent from "./components/CreateEventComponents/CreateEvent";
import Settings from "./components/SettingsPageComponents/Settings";
import InviteFriends from "./components/CreateEventComponents/InviteFriends";
import ForgotPassword from "./components/ForgotPassword";
import AddNewFriends from "./components/AddNewFriends";
import EditFriends from "./components/SettingsPageComponents/EditFriends";

export default function App() {
  // --- Initialize Firebase --- //
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  } else {
    firebase.app();
  }
  // --------------------------- //

  // --- Authenticate User ----- //
  const [authUser, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      user ? setUser(user) : setUser(null);
    });
    return () => {
      unsubscribe();
    };
  });
  // --------------------------- //

  // --- Stacks ---------------- //
  const CreateEventStackScreen = () => (
    <CreateEventStack.Navigator>
      <CreateEventStack.Screen
        name="Create Page"
        component={CreateEvent}
        options={{ title: "Create Event" }}
        initialParams={{ user: authUser.email }}
      />
      <CreateEventStack.Screen
        name="InviteFriends"
        component={InviteFriends}
        options={{ title: "Invite Friends" }}
      />
    </CreateEventStack.Navigator>
  );

  const SearchStackScreen = () => (
    <SearchStack.Navigator>
      <SearchStack.Screen
        name="SearchStack"
        component={Search}
        options={{ title: "Search" }}
      />
    </SearchStack.Navigator>
  );

  const FriendStackScreen = () => (
    <FriendStack.Navigator>
      <FriendStack.Screen
        name="FriendStack"
        component={Friends}
        options={{ title: "Your Friends" }}
        initialParams={{ user: authUser.email }}
      />
      <FriendStack.Screen
        name="AddNewFriends"
        component={AddNewFriends}
        options={{ title: "Add Friends" }}
      />
    </FriendStack.Navigator>
  );

  const SettingStackScreen = () => (
    <SettingStack.Navigator>
      <SettingStack.Screen
        name="ProfileSettings"
        component={Settings}
        options={{ title: "Profile" }}
        initialParams={{ user: authUser.email }}
      />
      <SettingStack.Screen
        name="EditFriends"
        component={EditFriends}
        options={{ title: "Edit Friends" }}
      />
    </SettingStack.Navigator>
  );
  // --------------------------- //

  return authUser ? (
    <NavigationContainer>
      <Tabs.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            if (route.name === "Home") {
              return (
                <Ionicons
                  name={focused ? "home" : "home-outline"}
                  size={size}
                  color={color}
                />
              );
            } else if (route.name === "Settings") {
              return (
                <Ionicons
                  name={focused ? "settings" : "settings-outline"}
                  size={size}
                  color={color}
                />
              );
            } else if (route.name === "Search") {
              return (
                <Ionicons
                  name={focused ? "search" : "search-outline"}
                  size={size}
                  color={color}
                />
              );
            } else if (route.name === "CreateEvent") {
              return (
                <Ionicons
                  name={focused ? "add-circle" : "add-circle-outline"}
                  size={30}
                  color={color}
                />
              );
            } else if (route.name === "Friends") {
              return (
                <Ionicons
                  name={focused ? "people" : "people-outline"}
                  size={size}
                  color={color}
                />
              );
            }
          },
        })}
        tabBarOptions={{
          activeTintColor: "tomato",
          inactiveTintColor: "gray",
        }}
      >
        <Tabs.Screen
          name="Home"
          component={Home}
          initialParams={{ user: authUser.email }}
        />
        <Tabs.Screen name="Search" component={SearchStackScreen} />
        <Tabs.Screen
          name="CreateEvent"
          component={CreateEventStackScreen}
          options={{ title: "Create Event" }}
        />
        <Tabs.Screen name="Friends" component={FriendStackScreen} />
        <Tabs.Screen name="Settings" component={SettingStackScreen} />
      </Tabs.Navigator>
    </NavigationContainer>
  ) : (
    <NavigationContainer>
      <AuthStack.Navigator>
        <AuthStack.Screen name="Login" component={Login} />
        <AuthStack.Screen
          name="CreateAccount"
          component={CreateAccount}
          options={{ title: "Create Account" }}
        />
        <AuthStack.Screen
          name="ForgotPassword"
          component={ForgotPassword}
          options={{ title: "Forgot Password" }}
        />
      </AuthStack.Navigator>
    </NavigationContainer>
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
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
