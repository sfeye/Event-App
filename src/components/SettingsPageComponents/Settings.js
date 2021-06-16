import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableWithoutFeedback,
  Keyboard,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { secondary, filler_alt } from "../../styles/colors";
import { Avatar, Input } from "react-native-elements";
import firebase from "firebase";

const Settings = ({ route, navigation }) => {
  // --- State ----------------- //
  const [user, setUser] = useState(null);
  const [userEdit, setUserEdit] = useState(false);
  const [phoneEdit, setPhoneEdit] = useState(false);
  const [userInput, setUserInput] = useState("");
  const [phoneInput, setPhoneInput] = useState("");
  const [touchedUser, setTouchedUser] = useState(false);
  const [touchedPhone, setTouchedPhone] = useState(false);
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

  function isDisabledName() {
    return validate("name", userInput) !== "";
  }

  function isDisabledPhone() {
    return validate("phone", phoneInput) !== "";
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

  const setPhoneNormal = (value) => {
    setPhoneInput(normalizeInput(value, phoneInput));
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
                  placeholderStyle={{ backgroundColor: secondary }}
                />
              </View>
              <View style={styles.infoContainer}>
                <View style={styles.infoNoneditable}>
                  <Text style={styles.infoEmail}>{info.email}</Text>
                </View>
                {userEdit ? (
                  <View style={styles.infoEditable}>
                    <Input
                      style={styles.input}
                      placeholder={info.name}
                      value={userInput}
                      onChangeText={setUserInput}
                      onFocus={() => setTouchedUser(true)}
                      errorMessage={
                        touchedUser ? validate("name", userInput) : ""
                      }
                      placeholderTextColor="red"
                    />
                    <TouchableOpacity
                      onPress={() => updateNameField(id, userInput)}
                      style={styles.acceptBtn}
                      disabled={isDisabledName()}
                    >
                      <Ionicons
                        name={"checkmark-circle"}
                        size={30}
                        color={isDisabledName() ? "gray" : "green"}
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
                    <Input
                      style={styles.input}
                      placeholder={info.phone}
                      value={phoneInput}
                      onChangeText={setPhoneNormal}
                      onFocus={() => setTouchedPhone(true)}
                      keyboardType="numeric"
                      errorMessage={
                        touchedPhone ? validate("phone", phoneInput) : ""
                      }
                      placeholderTextColor="red"
                    />
                    <TouchableOpacity
                      onPress={() => updatePhoneField(id, phoneInput)}
                      style={styles.acceptBtn}
                      disabled={isDisabledPhone()}
                    >
                      <Ionicons
                        name={"checkmark-circle"}
                        size={30}
                        color={isDisabledPhone() ? "gray" : "green"}
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

const normalizeInput = (value, previousValue) => {
  if (!value) return value;
  const currentValue = value.replace(/[^\d]/g, "");
  const cvLength = currentValue.length;

  if (!previousValue || value.length > previousValue.length) {
    if (cvLength < 4) return value;
    if (cvLength < 7)
      return `(${currentValue.slice(0, 3)}) ${currentValue.slice(3)}`;
    return `(${currentValue.slice(0, 3)}) ${currentValue.slice(
      3,
      6
    )}-${currentValue.slice(6, 10)}`;
  } else {
    return value;
  }
};

const validate = (name, value) => {
  const regexPhone = /^(\()?[2-9]{1}\d{2}(\))?(-|\s)?[2-9]{1}\d{2}(-|\s)\d{4}$/;

  switch (name) {
    case "name":
      if (value === "") {
        return "A name is required";
      } else if (value.length < 3) {
        return "Name must be more than 3 characters";
      } else if (!String(value).includes(" ")) {
        return "Please enter a first and last name";
      }
      break;
    case "phone":
      if (value === "") {
        return "A phone number is required";
      } else if (!regexPhone.test(String(value).toLowerCase())) {
        return "Invalid phone number format";
      }
      break;
  }
  return "";
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
    width: "60%",
    alignSelf: "center",
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
