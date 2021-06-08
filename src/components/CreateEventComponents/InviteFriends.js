import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import InviteFriendCard from "./InviteFriendCard";
import firebase from "firebase";

const InviteFriends = ({ route, navigation }) => {
  // --- State ----------------- //
  const [user, setUser] = useState(null);
  const [selectedArr, setSelectedArr] = useState(route.params.friends);
  const [loading, setLoading] = useState(false);
  // --------------------------- //

  // --- Helpers --------------- //

  const confirm = () => {
    route.params.paramAddFriend(selectedArr.length, selectedArr);
    navigation.goBack();
  };

  function arrayRemove(arr, value) {
    return arr.filter(function (ele) {
      return ele != value;
    });
  }

  const addSelected = (selected, friendName) => {
    if (!selected) {
      var tempArr = selectedArr;
      tempArr.push(friendName);
      setSelectedArr(tempArr);
    }

    if (selected && selectedArr.includes(friendName)) {
      var tempArr = selectedArr;
      tempArr = arrayRemove(tempArr, friendName);
      setSelectedArr(tempArr);
    }
  };
  // --------------------------- //

  // --- Read DB --------------- //
  useEffect(() => {
    const unsubscribe = firebase
      .firestore()
      .collection("users")
      .where("email", "==", route.params.email)
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
    <View style={styles.container}>
      <ScrollView>
        {user ? (
          user.map(({ id, u }) =>
            u.friends ? (
              u.friends.map((friend) => (
                <InviteFriendCard
                  key={friend}
                  addSelected={addSelected}
                  friend={friend}
                  invitedFriends={route.params.friends}
                />
              ))
            ) : (
              <React.Fragment />
            )
          )
        ) : (
          <React.Fragment />
        )}
      </ScrollView>
      <TouchableOpacity
        style={styles.confirmBtn}
        onPress={() => confirm()}
        disabled={loading}
      >
        <Text style={styles.confirmTxt}>Confirm</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  confirmBtn: {
    backgroundColor: "#ececec",
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    alignSelf: "center",
    width: "60%",
  },
  confirmTxt: {
    justifyContent: "center",
    fontSize: 20,
    alignSelf: "center",
  },
});

export default InviteFriends;
