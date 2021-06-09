import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Avatar } from "react-native-elements";
import firebase from "firebase";

const Settings = ({ route, navigation }) => {
  // --- State ----------------- //
  const [user, setUser] = useState(null);
  const [userEdit, setUserEdit] = useState(false);
  const [phoneEdit, setPhoneEdit] = useState(false);
  const [userInput, setUserInput] = useState("");
  const [phoneInput, setPhoneInput] = useState("");
  // --------------------------- //

  // --- Helpers --------------- //
  function getInitials(name) {
    const initials = name.split(" ");
    return initials.shift().charAt(0) + initials.pop().charAt(0);
  }

  function arrayRemove(arr, value) {
    return arr.filter(function (ele) {
      return ele != value;
    });
  }
  // --------------------------- //

  // --- Write DB -------------- //
  const updateNameField = (id, name) => {
    firebase.firestore().collection("users").doc(id).update({
      name: name,
    });
    setUserEdit(!userEdit);
  };

  const updatePhoneField = (id, phone) => {
    firebase.firestore().collection("users").doc(id).update({
      phone: phone,
    });
    setPhoneEdit(!phoneEdit);
  };

  const updateFriends = (id, friendArr, removedFriend) => {
    var temp = arrayRemove(friendArr, removedFriend);
    firebase.firestore().collection("users").doc(id).update({
      friends: temp,
    });
  };
  // --------------------------- //

  // --- Read DB --------------- //
  useEffect(() => {
    const unsubscribe = firebase
      .firestore()
      .collection("users")
      .where("email", "==", route.params.user)
      .onSnapshot((snapshot) => {
        setUser(
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
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.container}>
        {user ? (
          user.map(({ id, info }) => (
            <View key={id}>
              <View style={styles.avatar}>
                <Avatar
                  size="xlarge"
                  rounded
                  title={getInitials(info.name)}
                  source={{ uri: info.avatar }}
                />
              </View>
              <View style={styles.infoContainer}>
                <View style={styles.infoNoneditable}>
                  <Text style={styles.infoEmail}>{info.email}</Text>
                </View>
                {userEdit ? (
                  <View style={styles.infoEditable}>
                    <TextInput
                      style={styles.input}
                      placeholder={info.name}
                      value={userInput}
                      onChangeText={setUserInput}
                      placeholderTextColor="red"
                    />
                    <TouchableOpacity
                      onPress={() => updateNameField(id, userInput)}
                      style={styles.acceptBtn}
                    >
                      <Ionicons
                        name={"checkmark-circle"}
                        size={30}
                        color={"green"}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => setUserEdit(!userEdit)}
                      style={styles.trashBtn}
                    >
                      <Ionicons name={"trash"} size={30} color={"red"} />
                    </TouchableOpacity>
                  </View>
                ) : (
                  <View style={styles.infoEditable}>
                    <Text style={styles.infoOther}>{info.name}</Text>
                    <TouchableOpacity onPress={() => setUserEdit(!userEdit)}>
                      <Ionicons
                        name={"create-outline"}
                        size={30}
                        color={"gray"}
                      />
                    </TouchableOpacity>
                  </View>
                )}
                {phoneEdit ? (
                  <View style={styles.infoEditable}>
                    <TextInput
                      style={styles.input}
                      placeholder={info.phone}
                      value={phoneInput}
                      onChangeText={setPhoneInput}
                      placeholderTextColor="red"
                    />
                    <TouchableOpacity
                      onPress={() => updatePhoneField(id, phoneInput)}
                      style={styles.acceptBtn}
                    >
                      <Ionicons
                        name={"checkmark-circle"}
                        size={30}
                        color={"green"}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => setPhoneEdit(!phoneEdit)}
                      style={styles.trashBtn}
                    >
                      <Ionicons name={"trash"} size={30} color={"red"} />
                    </TouchableOpacity>
                  </View>
                ) : (
                  <View style={styles.infoEditable}>
                    <Text style={styles.infoOther}>{info.phone}</Text>
                    <TouchableOpacity onPress={() => setPhoneEdit(!phoneEdit)}>
                      <Ionicons
                        name={"create-outline"}
                        size={30}
                        color={"gray"}
                      />
                    </TouchableOpacity>
                  </View>
                )}
              </View>
              <View style={styles.editBtnsContainer}>
                <TouchableOpacity
                  onPress={() =>
                    navigation.push("EditFriends", {
                      currentUser: info.email,
                      friends: info.friends,
                      id: id,
                      removeFriend: updateFriends,
                    })
                  }
                  style={styles.editBtnFriend}
                >
                  <Text>Edit Friends ({info.friends.length})</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => alert("todo")}
                  style={styles.editBtnDelete}
                >
                  <Text>Delete Account</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        ) : (
          <ActivityIndicator color="black" size="large" />
        )}
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  avatar: {
    alignSelf: "center",
    marginTop: 20,
  },
  infoContainer: {
    alignSelf: "center",
    marginTop: 20,
    width: "90%",
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
  input: {
    color: "red",
    fontSize: 20,
    alignSelf: "center",
    textAlign: "center",
    padding: 10,
    backgroundColor: "white",
    borderRadius: 10,
    marginRight: 20,
  },
  acceptBtn: {
    marginRight: 5,
  },
  trashBtn: {
    marginLeft: 5,
  },
  editBtnsContainer: {
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  editBtnFriend: {
    margin: 20,
    backgroundColor: "#c8f7c8",
    padding: 10,
    borderRadius: 10,
  },
  editBtnDelete: {
    margin: 20,
    backgroundColor: "#ffa3a6",
    padding: 10,
    borderRadius: 10,
  },
});

export default Settings;
