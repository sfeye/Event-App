import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Card } from "react-native-elements";
import { Ionicons } from "@expo/vector-icons";
import { filler_alt } from "../../styles/colors";
import firebase from "firebase";

const EditFriends = ({ route, navigation }) => {
  // --- State ----------------- //
  const [docs, setDocs] = useState([]);
  // --------------------------- //

  // --- Helpers --------------- //
  const submit = (friend) => {
    var docIndex = loopThroughDocs(friend);
    alert("but he was such a nice guy... 😢");

    route.params.removeFriend(route.params.id, route.params.friends, friend);
    if (docIndex !== -1) {
      route.params.removeFriend(
        docs[docIndex].id,
        docs[docIndex].info.friends,
        route.params.currentUser
      );
    }
    navigation.goBack();
  };

  function loopThroughDocs(friend) {
    for (var i = 0; i < docs.length; i++) {
      if (docs[i].info.email === friend) {
        return i;
      }
    }
    return -1;
  }
  // --------------------------- //

  // --- Read DB --------------- //
  useEffect(() => {
    const unsubscribe = firebase
      .firestore()
      .collection("users")
      .onSnapshot((snapshot) => {
        setDocs(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            info: doc.data(),
          }))
        );
      });
    return () => {
      unsubscribe();
    };
  }, []);
  // --------------------------- //
  return (
    <View style={{ backgroundColor: filler_alt, minHeight: "100%" }}>
      <ScrollView>
        {route.params.friends ? (
          route.params.friends.map((friend) => (
            <Card key={friend}>
              <View style={styles.cardContainer}>
                <Text>{friend}</Text>
                <TouchableOpacity
                  onPress={() => submit(friend)}
                  style={styles.trashBtn}
                >
                  <Ionicons name={"trash"} size={25} color={"red"} />
                </TouchableOpacity>
              </View>
            </Card>
          ))
        ) : (
          <Text>You have no friends, go to Friends page to add more!</Text>
        )}
      </ScrollView>
    </View>
  );
};

export default EditFriends;

const styles = StyleSheet.create({
  cardContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
