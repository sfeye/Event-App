import React, { useState, useEffect } from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import firebase from "firebase";
import { Card, ListItem, Button, Icon } from "react-native-elements";
import FriendCard from "./FriendCard";

const FriendCards = ({ friendEmail }) => {
  // --- State ----------------- //
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  // --------------------------- //

  // --- Read DB --------------- //
  useEffect(() => {
    const unsubscribe = firebase
      .firestore()
      .collection("users")
      .where("email", "==", friendEmail)
      .onSnapshot((snapshot) => {
        setUser(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            u: doc.data(),
          }))
        );
      });
    return () => {
      unsubscribe();
    };
  }, []);
  // --------------------------- //

  return (
    <View>
      {user ? (
        user.map(({ id, u }) => (
          <FriendCard
            key={id}
            name={u.name}
            email={u.email}
            avatar={u.avatar}
            phone={u.phone}
            friendArr={u.friends.length}
          />
        ))
      ) : (
        <React.Fragment />
      )}
    </View>
  );
};

const styles = StyleSheet.create({});

export default FriendCards;