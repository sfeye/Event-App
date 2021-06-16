import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { primary, secondary, filler_alt } from "../../styles/colors";
import { Ionicons } from "@expo/vector-icons";
import { Avatar, Button } from "react-native-elements";
import firebase from "firebase";

const FriendProfile = ({ route, navigation }) => {
  const initials = route.params.name.split(" ");

  // --- Helpers --------------- //
  function arrayRemove(arr, value) {
    return arr.filter(function (ele) {
      return ele != value;
    });
  }
  // --------------------------- //

  // --- Write DB -------------- //
  const addFriend = () => {
    var newPending = route.params.pendingArr;
    newPending.push(route.params.currUser);

    firebase.firestore().collection("users").doc(route.params.id).update({
      pending: newPending,
    });
  };

  const cancelRequest = () => {
    var newPending = route.params.pendingArr;
    newPending = arrayRemove(newPending, route.params.currUser);

    firebase.firestore().collection("users").doc(route.params.id).update({
      pending: newPending,
    });
  };
  // --------------------------- //

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.container}>
        <View>
          <View style={styles.avatar}>
            <Avatar
              size="xlarge"
              rounded
              title={initials.shift().charAt(0) + initials.pop().charAt(0)}
              source={{ uri: route.params.avatar }}
              placeholderStyle={{ backgroundColor: secondary }}
            />
          </View>
          <View style={styles.infoContainer}>
            <View style={styles.infoNoneditable}>
              <Text style={styles.infoEmail}>{route.params.email}</Text>
            </View>
            <View style={styles.infoEditable}>
              <Text style={styles.infoOther}>{route.params.name}</Text>
            </View>
            <View style={styles.infoEditable}>
              <Text style={styles.infoOther}>{route.params.phone}</Text>
            </View>
            {!route.params.pendingArr.includes(route.params.currUser) &&
            !route.params.friendArr.includes(route.params.currUser) ? (
              <Button
                style={styles.btn}
                buttonStyle={{ backgroundColor: primary }}
                icon={
                  <Ionicons
                    name="person-add"
                    size={15}
                    color="white"
                    style={{ marginRight: 5 }}
                  />
                }
                title="Add Friend"
                onPress={() => addFriend()}
              />
            ) : route.params.pendingArr.includes(route.params.currUser) ? (
              <Button
                style={styles.btn}
                buttonStyle={{ backgroundColor: primary }}
                icon={
                  <Ionicons
                    name="ban"
                    size={15}
                    color="white"
                    style={{ marginRight: 5 }}
                  />
                }
                title="Cancel Request"
                onPress={() => cancelRequest()}
              />
            ) : (
              <React.Fragment />
            )}
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: filler_alt,
  },
  avatar: {
    alignSelf: "center",
    marginTop: 20,
  },
  infoContainer: {
    alignSelf: "center",
    marginTop: 20,
    width: "100%",
  },
  infoEmail: {
    fontSize: 25,
    fontWeight: "400",
  },
  infoOther: {
    fontSize: 20,
    alignSelf: "center",
    textAlign: "center",
    padding: 10,
    paddingRight: 20,
  },
  infoEditable: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  infoNoneditable: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 40,
    marginTop: 10,
  },
  btn: {
    marginTop: 20,
    width: "50%",
    alignSelf: "center",
  },
});

export default FriendProfile;
