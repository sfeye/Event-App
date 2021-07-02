import React, { useEffect } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { Button, Avatar } from "react-native-elements";
import { Ionicons } from "@expo/vector-icons";
import firebase from "firebase";

const AddFriendResults = ({ currentUser, otherUsers }) => {
  const addFriend = (otherId, otherFriends, currentId) => {
    //if temp curr friends include new friend email then alert
    var tempOtherFriends = otherFriends;
    tempOtherFriends.push(currentId);

    addToPending(otherId, tempOtherFriends);
  };

  const addToPending = (friendId, otherFriends) => {
    firebase.firestore().collection("users").doc(friendId).update({
      pending: otherFriends,
    });
  };

  //is user already a friend ? true : false
  function isAlreadyFriend(currFriends, otherEmail) {
    return currFriends.includes(otherEmail);
  }

  function getInitials(name) {
    var initials = name.split(" ");
    return initials.shift().charAt(0) + initials.pop().charAt(0);
  }

  //update the below to check if added user's pending has the id instead of email
  //line 35 changes from currenUser.friend.email to currentUser.id
  return (
    <ScrollView style={{ height: "100%" }}>
      <View>
        {otherUsers
          ? otherUsers.map((otherUser) => (
              <View key={otherUser.id} style={styles.possibleFriendItem}>
                <View>
                  <Avatar
                    size="medium"
                    rounded
                    title={getInitials(otherUser.friend.name)}
                    source={{ uri: otherUser.friend.avatar }}
                    placeholderStyle={{ backgroundColor: "gray" }}
                  />
                </View>
                <Text
                  style={{
                    marginLeft: 10,
                    fontSize: 15,
                    fontWeight: "600",
                    width: "40%",
                  }}
                >
                  {otherUser.friend.name}
                </Text>
                {otherUser.friend.pending.includes(currentUser.id) ? (
                  <Text
                    style={{
                      fontSize: 14,
                      marginLeft: "auto",
                    }}
                  >
                    Pending...
                  </Text>
                ) : isAlreadyFriend(
                    currentUser.friend.friends,
                    otherUser.friend.email
                  ) ? (
                  <Ionicons
                    size={30}
                    name="checkmark-circle"
                    color="green"
                    style={{ marginLeft: "auto" }}
                  />
                ) : (
                  <View style={{ marginLeft: "auto" }}>
                    <Button
                      buttonStyle={styles.addBtn}
                      transparent
                      title="Add"
                      titleStyle={{ fontSize: 15, fontWeight: "600" }}
                      onPress={() =>
                        addFriend(
                          otherUser.id,
                          otherUser.friend.pending,
                          currentUser.id
                        )
                      }
                    />
                  </View>
                )}
              </View>
            ))
          : React.Fragment}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  possibleFriendItem: {
    alignItems: "center",
    flexDirection: "row",
    margin: 10,
    //width: "80%",
  },
  addBtn: {
    backgroundColor: "#46B1C9",
  },
});

export default AddFriendResults;
