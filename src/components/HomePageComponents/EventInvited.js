import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Avatar, Card } from "react-native-elements";
import { Ionicons } from "@expo/vector-icons";
import firebase from "firebase";
import { useNavigation } from "@react-navigation/native";

const EventInvited = ({ currUser, email, going }) => {
  const navigation = useNavigation();
  // --- State ----------------- //
  const [invitedFriend, setInvitedFriend] = useState(null);
  const [loading, setLoading] = useState(false);
  // --------------------------- //

  // --- Helpers --------------- //
  function isGoing() {
    return going.includes(email);
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
      .where("email", "==", email)
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
      {invitedFriend ? (
        <Card>
          <View style={{ flexDirection: "row" }}>
            <Avatar
              size="small"
              rounded
              title={getInitials()}
              source={{ uri: invitedFriend[0].user.avatar }}
              onPress={() =>
                navigation.navigate("HomeFriendProfile", {
                  currUser: currUser,
                  id: invitedFriend[0].id,
                  name: invitedFriend[0].user.name,
                  email: email,
                  avatar: invitedFriend[0].user.avatar,
                  phone: invitedFriend[0].user.phone,
                  friendArr: invitedFriend[0].user.friends,
                  pendingArr: invitedFriend[0].user.pending,
                })
              }
            />
            <Text style={{ alignSelf: "center", marginLeft: 10 }}>
              {invitedFriend[0].user.name}
            </Text>
            {isGoing() ? (
              <Ionicons
                name="checkmark-circle"
                color="green"
                size={20}
                style={{ alignSelf: "center", marginLeft: "auto" }}
              />
            ) : (
              <Ionicons
                name="close-circle"
                color="red"
                size={20}
                style={{ alignSelf: "center", marginLeft: "auto" }}
              />
            )}
          </View>
        </Card>
      ) : (
        <React.Fragment />
      )}
    </View>
  );
};

export default EventInvited;

const styles = StyleSheet.create({});
