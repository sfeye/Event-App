import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, ActivityIndicator } from "react-native";
import { Avatar, CheckBox, Card } from "react-native-elements";
import { Ionicons } from "@expo/vector-icons";
import firebase from "firebase";
import { useNavigation } from "@react-navigation/native";

const InviteFriendCard = ({ friend, invitedFriends, addSelected }) => {
  const navigation = useNavigation();
  // --- State ----------------- //
  const [friendName, setFriendName] = useState(friend);
  const [invitedFriend, setInvitedFriend] = useState(null);
  const [selected, setSelected] = useState(isAlreadyInvited(friendName));
  // --------------------------- //

  // --- Helpers --------------- //
  const select = (friend) => {
    setSelected(!selected);
    setFriendName(friend);
    addSelected(selected, friendName);
  };

  function isAlreadyInvited(friend) {
    if (invitedFriends.includes(friend)) {
      return true;
    }
    return false;
  }

  function getInitials() {
    var initials = invitedFriend[0].user.name.split(" ");
    return initials.shift().charAt(0) + initials.pop().charAt(0);
  }
  // --------------------------- //

  // --- Read DB --------------- //
  useEffect(() => {
    const unsubscribe = firebase
      .firestore()
      .collection("users")
      .where("email", "==", friend)
      .onSnapshot((snapshot) => {
        setInvitedFriend(
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
    <View>
      <Card style={styles.alreadyInvited}>
        {invitedFriend ? (
          <View style={styles.card}>
            <Avatar
              size="small"
              rounded
              title={getInitials()}
              source={{ uri: invitedFriend[0].user.avatar }}
            />
            <Text style={styles.cardText}>{invitedFriend[0].user.name}</Text>
            <CheckBox
              containerStyle={{ marginLeft: "auto" }}
              checked={selected}
              onPress={() => select(friend)}
            />
          </View>
        ) : (
          <ActivityIndicator color="black" size="small" />
        )}
      </Card>
    </View>
  );
};

export default InviteFriendCard;

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
  },
  cardText: {
    alignContent: "center",
    marginLeft: 10,
  },
  alreadyInvited: {
    backgroundColor: "green",
  },
});
