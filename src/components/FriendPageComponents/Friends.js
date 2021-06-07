import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  SafeAreaView,
  ScrollView,
  StatusBar,
} from "react-native";
import { Card, ListItem, Button, Icon } from "react-native-elements";
import firebase from "firebase";
import FriendCards from "./FriendCards";

const Friends = ({ route, navigation }) => {
  // --- State ----------------- //
  const [friendCards, setFriendResults] = useState(null);
  const [loading, setLoading] = useState(false);
  // --------------------------- //

  // --- Helpers --------------- //
  // --------------------------- //

  // --- Read DB --------------- //
  useEffect(() => {
    const unsubscribe = firebase
      .firestore()
      .collection("users")
      .where("email", "==", route.params.user)
      .onSnapshot((snapshot) => {
        setFriendResults(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            user: doc.data(),
          }))
        );
      });
    return () => {
      unsubscribe();
    };
  }, []);
  // --------------------------- //

  return (
    <SafeAreaView style={styles.safeView}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.container}>
          {friendCards
            ? friendCards.map(({ id, user }) =>
                user.friends
                  ? user.friends.map((friend) => (
                      <FriendCards key={id} friendEmail={friend} />
                    ))
                  : React.Fragment
              )
            : React.Fragment}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeView: {
    flex: 1,
    paddingTop: StatusBar.currentHeight,
  },
  container: {
    flex: 1,
  },
  scrollView: {
    marginHorizontal: 20,
  },
  user: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  name: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default Friends;
