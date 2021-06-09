import React, { useEffect } from "react";
import { View, Text, Button } from "react-native";
import firebase from "firebase";

const AddFriendResults = ({ currentUser, otherUsers }) => {
  const addFriend = (
    otherEmail,
    otherId,
    otherFriends,
    currentEmail,
    currentId,
    currentFriends
  ) => {
    //if temp curr friends include new friend email then alert
    var tempCurrFriends = currentFriends;
    var tempOtherFriends = otherFriends;

    tempCurrFriends.push(otherEmail);
    tempOtherFriends.push(currentEmail);

    addToCurrentUser(currentId, tempCurrFriends);
    addToFriend(otherId, tempOtherFriends);
  };

  const addToCurrentUser = (currentId, currentFriends) => {
    firebase.firestore().collection("users").doc(currentId).update({
      friends: currentFriends,
    });
  };

  const addToFriend = (friendId, otherFriends) => {
    firebase.firestore().collection("users").doc(friendId).update({
      friends: otherFriends,
    });
  };

  //is user already a friend ? true : false
  function isAlreadyFriend(currFriends, otherEmail) {
    return currFriends.includes(otherEmail);
  }

  useEffect(() => {
    console.log(otherUsers);
  }, []);

  return (
    <View>
      {otherUsers
        ? otherUsers.map((otherUser) => (
            <View key={otherUser.id}>
              <Text>{otherUser.friend.name}</Text>
              <Button
                transparent
                disabled={isAlreadyFriend(
                  currentUser.friend.friends,
                  otherUser.friend.email
                )}
                onPress={() =>
                  addFriend(
                    otherUser.friend.email,
                    otherUser.id,
                    otherUser.friend.friends,
                    currentUser.friend.email,
                    currentUser.id,
                    currentUser.friend.friends
                  )
                }
              >
                <Text>Add Friend</Text>
              </Button>
            </View>
          ))
        : React.Fragment}
    </View>
  );
};

export default AddFriendResults;
