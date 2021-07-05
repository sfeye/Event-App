import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { Button, Avatar } from "react-native-elements";
import firebase from "firebase";
import { primary } from "../../styles/colors";

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
    newFriendId,
    currentUserId,
    currentUserEmail
  ) => {
    var otherUser = getOtherUser(newFriendId);

    // Set temp arrays
    var tempCurrUserFriendList = currUserFriendList;
    var tempCurrPendingList = currPendingList;
    var tempOtherUserFriendList = otherUser.u.friends;

    // Modify temp arrays
    tempCurrUserFriendList.push(otherUser.u.email);
    tempCurrPendingList = arrayRemove(tempCurrPendingList, newFriendId);
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

  const declineFriendRequest = (
    currPendingList,
    newFriendId,
    currentUserId
  ) => {
    var tempCurrPendingList = currPendingList;
    //new pending list by removing pending friend after declining
    tempCurrPendingList = arrayRemove(tempCurrPendingList, newFriendId);

    updatePendingListOnDecline(currentUserId, tempCurrPendingList);
  };

  const updatePendingListOnDecline = (currentUserId, newPendingList) => {
    firebase.firestore().collection("users").doc(currentUserId).update({
      pending: newPendingList,
    });
  };

  function displayOtherUser(otherUserId) {
    for (var i = 0; i < user.length; i++) {
      if (user[i].id === otherUserId) {
        return {
          name: user[i].u.name,
          avatar: user[i].u.avatar,
        };
      }
    }
    return {};
  }

  function getOtherUser(otherUserId) {
    for (var i = 0; i < user.length; i++) {
      if (user[i].id === otherUserId) {
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
    <ScrollView style={{ height: "100%" }}>
      <View>
        {user ? (
          user.map(({ id, u }) =>
            u.pending.map((pendingFriend) =>
              u.email === route.params.currentUser ? (
                <View key={id + pendingFriend} style={styles.pendingFriendItem}>
                  <View>
                    <Avatar
                      size="medium"
                      rounded
                      title={displayOtherUser(pendingFriend).name}
                      source={{ uri: displayOtherUser(pendingFriend).avatar }}
                      placeholderStyle={{ backgroundColor: "gray" }}
                    />
                  </View>
                  <View>
                    <Text
                      style={{
                        marginBottom: 5,
                        marginLeft: 10,
                        fontSize: 15,
                        fontWeight: "600",
                      }}
                    >
                      {displayOtherUser(pendingFriend).name}
                    </Text>
                    <View style={styles.accDecView}>
                      <Button
                        buttonStyle={styles.accBtn}
                        title="Accept"
                        titleStyle={{ fontSize: 15, fontWeight: "600" }}
                        onPress={() =>
                          acceptFriendRequest(
                            u.friends,
                            u.pending,
                            pendingFriend,
                            id,
                            route.params.currentUser
                          )
                        }
                      />
                      <Button
                        buttonStyle={styles.decBtn}
                        title="Decline"
                        titleStyle={{ fontSize: 15, fontWeight: "600" }}
                        onPress={() =>
                          declineFriendRequest(u.pending, pendingFriend, id)
                        }
                      />
                    </View>
                  </View>
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
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  pendingFriendItem: {
    alignItems: "center",
    flexDirection: "row",
    margin: 10,
  },
  accDecView: {
    flexDirection: "row",
    justifyContent: "center",
    marginLeft: 10,
  },
  accBtn: {
    backgroundColor: primary,
    marginRight: 5,
  },
  decBtn: {
    backgroundColor: "red",
    marginLeft: 5,
  },
});

export default PendingFriendRequests;
