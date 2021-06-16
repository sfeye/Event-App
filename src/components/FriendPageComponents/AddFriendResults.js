import React, { useEffect } from "react";
import { View, Text, Button } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import firebase from "firebase";

const AddFriendResults = ({ currentUser, otherUsers }) => {
  const addFriend = (otherId, otherFriends, currentEmail) => {
    //if temp curr friends include new friend email then alert
    var tempOtherFriends = otherFriends;
    tempOtherFriends.push(currentEmail);

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

  return (
    <View>
      {otherUsers
        ? otherUsers.map((otherUser) => (
            <View key={otherUser.id}>
              <Text>{otherUser.friend.name}</Text>
              {otherUser.friend.pending.includes(currentUser.friend.email) ? (
                <Text>Pending...</Text>
              ) : isAlreadyFriend(
                  currentUser.friend.friends,
                  otherUser.friend.email
                ) ? (
                <Ionicons size={20} name="checkmark-circle" color="green" />
              ) : (
                <Button
                  transparent
                  title="Add"
                  onPress={() =>
                    addFriend(
                      otherUser.id,
                      otherUser.friend.pending,
                      currentUser.friend.email
                    )
                  }
                ></Button>
              )}
            </View>
          ))
        : React.Fragment}
    </View>
  );
};

export default AddFriendResults;
