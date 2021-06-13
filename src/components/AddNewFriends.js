import React, { useState, useEffect } from "react";
import { View, Text } from "react-native";
import firebase from "firebase";
import { SearchBar } from "react-native-elements";
import AddFriendResults from "./AddFriendResults";

const AddNewFriends = ({ route, navigation }) => {
  const [inputText, setInputText] = useState("");
  const [friends, setFriends] = useState(null);

  function filterUsers(friends, searchText) {
    var tempArr = [];
    for (var i = 0; i < friends.length; i++) {
      if (
        friends[i].friend.email !== route.params.currentUser &&
        (friends[i].friend.email
          .toLowerCase()
          .includes(searchText.toLowerCase()) ||
          friends[i].friend.name
            .toLowerCase()
            .includes(searchText.toLowerCase()) ||
          friends[i].friend.phone
            .toLowerCase()
            .includes(searchText.toLowerCase()))
      ) {
        tempArr.push(friends[i]);
      }
    }
    return tempArr;
  }

  function getCurrUser(friends) {
    for (var i = 0; i < friends.length; i++) {
      if (friends[i].friend.email === route.params.currentUser) {
        return friends[i];
      }
    }
    return null;
  }

  useEffect(() => {
    const unsubscribe = firebase
      .firestore()
      .collection("users")
      .onSnapshot((snapshot) => {
        setFriends(
          snapshot.docs.map((doc) => ({
            friend: doc.data(),
            id: doc.id,
          }))
        );
      });
    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <View>
      <SearchBar
        placeholder="Search friends.."
        onChangeText={setInputText}
        value={inputText}
      />
      {friends && inputText ? (
        <AddFriendResults
          currentUser={getCurrUser(friends)}
          otherUsers={filterUsers(friends, inputText)}
        />
      ) : (
        React.Fragment
      )}
    </View>
  );
};

export default AddNewFriends;
