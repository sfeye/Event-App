import React, { useState, useEffect } from "react";
import { View, Text, Button } from "react-native";
import firebase from "firebase";

const PendingFriendRequests = ({ route, navigation }) => {
  const [user, setUser] = useState(null);

  function arrayRemove(arr, value) {
    return arr.filter(function (ele) {
      return ele != value;
    });
  }

  const acceptFriendRequest = (
    currUserFriendList,
    currPendingList,
    newFriendEmail,
    currentUserId,
    currentUserEmail
  ) => {
    var otherUser = getOtherUser(newFriendEmail);

    // Set temp arrays
    var tempCurrUserFriendList = currUserFriendList;
    var tempCurrPendingList = currPendingList;
    var tempOtherUserFriendList = otherUser.u.friends;

    // Modify temp arrays
    tempCurrUserFriendList.push(newFriendEmail);
    tempCurrPendingList = arrayRemove(tempCurrPendingList, newFriendEmail);
    tempOtherUserFriendList.push(currentUserEmail);

    // Update friends list and pending list of current user
    updateCurrentUserFriendList(
      currentUserId,
      tempCurrUserFriendList,
      tempCurrPendingList
    );

    updateOtherUserFriendList(otherUser.id, tempOtherUserFriendList);
  };

  const updateCurrentUserFriendList = (
    currentUserId,
    newFriendsList,
    newPendingList
  ) => {
    firebase.firestore().collection("users").doc(currentUserId).update({
      friends: newFriendsList,
      pending: newPendingList,
    });
  };

  const updateOtherUserFriendList = (friendId, otherFriendList) => {
    firebase.firestore().collection("users").doc(friendId).update({
      friends: otherFriendList,
    });
  };

  function getOtherUser(otherUserEmail) {
    for (var i = 0; i < user.length; i++) {
      if (user[i].u.email === otherUserEmail) {
        return user[i];
      }
    }
    alert("Something went wrong...");
    return [];
  }

  useEffect(() => {
    const unsubscribe = firebase
      .firestore()
      .collection("users")
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

  return (
    <View>
      {user ? (
        user.map(({ id, u }) =>
          u.pending.map((pendingFriend) =>
            u.email === route.params.currentUser ? (
              <View key={id + pendingFriend}>
                <Text>{pendingFriend}</Text>
                <Button
                  title="Accept"
                  onPress={() =>
                    acceptFriendRequest(
                      u.friends,
                      u.pending,
                      pendingFriend,
                      id,
                      route.params.currentUser
                    )
                  }
                ></Button>
              </View>
            ) : (
              <React.Fragment key={id + pendingFriend} />
            )
          )
        )
      ) : (
        <React.Fragment />
      )}
    </View>
  );
};

export default PendingFriendRequests;
