import "react-native-gesture-handler";
import React, { useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { Ionicons } from "@expo/vector-icons";
import { Icon, Badge, withBadge } from "react-native-elements";
import firebase from "firebase";
import { firebaseConfig } from "./firebase";
import { primary, primary_alt, filler_alt } from "./styles/colors";
import Login from "./pages/Login";
import CreateAccount from "./components/LoginPageComponents/CreateAccount";
import Home from "./pages/Home";
import Friends from "./components/FriendPageComponents/Friends";
import Search from "./components/SearchPageComponents/Search";
import CreateEvent from "./components/CreateEventComponents/CreateEvent";
import Settings from "./components/SettingsPageComponents/Settings";
import ForgotPassword from "./components/LoginPageComponents/ForgotPassword";
import AddNewFriends from "./components/FriendPageComponents/AddNewFriends";
import EditFriends from "./components/SettingsPageComponents/EditFriends";
import PendingFriendRequests from "./components/FriendPageComponents/PendingFriendRequests";
import FriendProfile from "./components/FriendPageComponents/FriendProfile";

export default function App() {
  const [userData, setUserData] = useState();
  const BadgedIcon = withBadge(userData ? userData[0].user.pending.length : 0, {
    badgeStyle: { top: -1 },
    textStyle: { fontSize: 8 },
    hidden: userData
      ? userData[0].user.pending.length === 0
        ? true
        : false
      : true,
  })(Icon);
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

  useEffect(() => {
    authUser
      ? firebase
          .firestore()
          .collection("users")
          .where("email", "==", authUser.email)
          .onSnapshot((snapshot) => {
            setUserData(
              snapshot.docs.map((doc) => ({
                id: doc.id,
                user: doc.data(),
              }))
            );
          })
      : setUserData(undefined);
  }, [authUser]);
  // --------------------------- //

  // --- Stacks ---------------- //
  const HomeStackScreen = () => (
    <HomeStack.Navigator>
      <HomeStack.Screen
        name="HomeStack"
        component={Home}
        options={{
          title: "Welcome " + authUser.email,
          headerTitleAlign: "left",
          headerTitleStyle: {
            fontSize: 15,
            color: filler_alt,
          },
          headerTintColor: filler_alt,
          headerStyle: {
            backgroundColor: primary,
          },
          headerRight: () => (
            <TouchableOpacity
              onPress={() => firebase.auth().signOut()}
              style={{ maginBottom: 10, marginRight: 20 }}
            >
              <Ionicons name={"power"} size={20} color={filler_alt} />
            </TouchableOpacity>
          ),
        }}
        initialParams={{ user: authUser.email }}
      />
      <HomeStack.Screen
        name="HomeFriendProfile"
        component={FriendProfile}
        options={({ route }) => ({
          title: route.params.name + "'s Profile",
          headerTitleStyle: {
            color: filler_alt,
          },
          headerTintColor: filler_alt,
          headerStyle: {
            backgroundColor: primary,
          },
        })}
      />
    </HomeStack.Navigator>
  );

  const CreateEventStackScreen = () => (
    <CreateEventStack.Navigator>
      <CreateEventStack.Screen
        name="Create Page"
        component={CreateEvent}
        options={{
          title: "Create Event",
          headerTitleStyle: {
            color: filler_alt,
            textAlign: "center",
          },
          headerTintColor: filler_alt,
          headerStyle: {
            backgroundColor: primary,
          },
        }}
        initialParams={{ user: authUser.email }}
      />
    </CreateEventStack.Navigator>
  );

  const SearchStackScreen = () => (
    <SearchStack.Navigator>
      <SearchStack.Screen
        name="SearchStack"
        component={Search}
        options={{
          title: "Search",
          headerTitleStyle: {
            color: filler_alt,
            textAlign: "center",
          },
          headerTintColor: filler_alt,
          headerStyle: {
            backgroundColor: primary,
          },
        }}
      />
    </SearchStack.Navigator>
  );

  const FriendStackScreen = () => (
    <FriendStack.Navigator>
      <FriendStack.Screen
        name="FriendStack"
        component={Friends}
        options={({ navigation }) => ({
          title: "Friends",
          headerTitleStyle: {
            color: filler_alt,
            textAlign: "center",
          },
          headerTintColor: filler_alt,
          headerStyle: {
            backgroundColor: primary,
          },
          headerLeft: () => (
            <TouchableOpacity
              onPress={() =>
                navigation.push("AddNewFriends", {
                  currentUser: authUser.email,
                })
              }
              style={{ maginBottom: 10, marginLeft: 20 }}
            >
              <Icon
                name={"user-plus"}
                type="font-awesome-5"
                size={20}
                color={filler_alt}
              />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity
              onPress={() =>
                navigation.push("PendingFriendRequests", {
                  currentUser: authUser.email,
                })
              }
              style={{ maginBottom: 10, marginRight: 20 }}
            >
              <BadgedIcon
                type="font-awesome-5"
                name="user-clock"
                size={20}
                color={filler_alt}
              />
            </TouchableOpacity>
          ),
        })}
        initialParams={{ user: authUser.email }}
      />
      <FriendStack.Screen
        name="AddNewFriends"
        component={AddNewFriends}
        options={{
          title: "Add Friends",
          headerTitleStyle: {
            color: filler_alt,
          },
          headerTintColor: filler_alt,
          headerStyle: {
            backgroundColor: primary,
          },
        }}
      />
      <FriendStack.Screen
        name="PendingFriendRequests"
        component={PendingFriendRequests}
        options={{
          title: "Pending Friends",
          headerTitleStyle: {
            color: filler_alt,
          },
          headerTintColor: filler_alt,
          headerStyle: {
            backgroundColor: primary,
          },
        }}
      />
      <FriendStack.Screen
        name="FriendProfile"
        component={FriendProfile}
        options={({ route }) => ({
          title: route.params.name + "'s Profile",
          headerTitleStyle: {
            color: filler_alt,
            textAlign: "center",
          },
          headerTintColor: filler_alt,
          headerStyle: {
            backgroundColor: primary,
          },
        })}
      />
    </FriendStack.Navigator>
  );

  const SettingStackScreen = () => (
    <SettingStack.Navigator>
      <SettingStack.Screen
        name="ProfileSettings"
        component={Settings}
        options={{
          title: "Profile",
          headerTitleStyle: {
            color: filler_alt,
            textAlign: "center",
          },
          headerTintColor: filler_alt,
          headerStyle: {
            backgroundColor: primary,
          },
        }}
        initialParams={{ user: authUser.email }}
      />
      <SettingStack.Screen
        name="EditFriends"
        component={EditFriends}
        options={{
          title: "Edit Friends",
          headerTitleStyle: {
            color: filler_alt,
          },
          headerTintColor: filler_alt,
          headerStyle: {
            backgroundColor: primary,
          },
        }}
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
                  size={size}
                  color={color}
                />
              );
            } else if (route.name === "Friends") {
              return (
                <BadgedIcon
                  type="ionicons"
                  name={focused ? "people" : "people-outline"}
                  size={size}
                  color={color}
                />
              );
            }
          },
        })}
        tabBarOptions={{
          activeTintColor: primary_alt,
          inactiveTintColor: "gray",
        }}
      >
        <Tabs.Screen
          name="Home"
          component={HomeStackScreen}
          initialParams={{ user: authUser.email }}
        />
        {/*<Tabs.Screen name="Search" component={SearchStackScreen} />*/}
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
        <AuthStack.Screen
          name="Login"
          component={Login}
          options={{
            headerTitleStyle: {
              color: filler_alt,
              textAlign: "center",
            },
            headerTintColor: filler_alt,
            headerStyle: {
              backgroundColor: primary,
            },
          }}
        />
        <AuthStack.Screen
          name="CreateAccount"
          component={CreateAccount}
          options={{
            title: "Create Account",
            headerTitleStyle: {
              color: filler_alt,
            },
            headerTintColor: filler_alt,
            headerStyle: {
              backgroundColor: primary,
            },
          }}
        />
        <AuthStack.Screen
          name="ForgotPassword"
          component={ForgotPassword}
          options={{
            title: "Forgot Password",
            headerTitleStyle: {
              color: filler_alt,
            },
            headerTintColor: filler_alt,
            headerStyle: {
              backgroundColor: primary,
            },
          }}
        />
      </AuthStack.Navigator>
    </NavigationContainer>
  );
}

const AuthStack = createStackNavigator();
const HomeStack = createStackNavigator();
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
