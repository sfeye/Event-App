import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
} from "react-native";
import { primary, secondary, filler_alt } from "../../styles/colors";
import { Ionicons } from "@expo/vector-icons";
import { Button, Input, Icon, Overlay } from "react-native-elements";

import firebase from "firebase";
import DateTimePicker from "@react-native-community/datetimepicker";
import InviteFriendCard from "./InviteFriendCard";

const CreateEvent = ({ route, navigation }) => {
  // --- State ----------------- //
  const [user, setUser] = useState(null);
  const [location, setLocation] = useState("");
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [description, setDescription] = useState("");
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(false);
  const [touchedDescription, setTouchedDescription] = useState(false);
  const [touchedLocation, setTouchedLocation] = useState(false);
  const [open, setOpen] = useState(false);
  const [show, setShow] = useState(false);
  const [mode, setMode] = useState("date");
  // --------------------------- //

  // --- Helpers --------------- //
  const onChangeDate = (event, selectedDate) => {
    setShow(Platform.OS === "ios");
    mode === "date" ? setDate(selectedDate) : setTime(selectedDate);
  };

  const resetState = () => {
    setLocation("");
    setDate(new Date());
    setTime(new Date());
    setDescription("");
    setFriends([]);
    setLoading(false);
    setShow(false);
    setMode("date");
  };

  function arrayRemove(arr, value) {
    return arr.filter(function (ele) {
      return ele != value;
    });
  }

  const addSelected = (selected, friendName) => {
    if (!selected) {
      var tempArr = friends;
      tempArr.push(friendName);
      setFriends(tempArr);
    }

    if (selected && friends.includes(friendName)) {
      var tempArr = friends;
      tempArr = arrayRemove(tempArr, friendName);
      setFriends(tempArr);
    }
  };

  const isDisabled = () => {
    return (
      validate("description", description) !== "" ||
      validate("location", location) !== ""
    );
  };

  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };

  const showDatepicker = () => {
    showMode("date");
  };

  const showTimepicker = () => {
    showMode("time");
  };
  // --------------------------- //

  // --- Post to DB ------------ //
  const createEvent = () => {
    setLoading(true);

    const datetime = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      time.getHours(),
      time.getMinutes(),
      time.getSeconds(),
      time.getMilliseconds()
    );

    if (friends.length === 0) {
      alert("You have not selected any friends...");
      setLoading(false);
      return;
    }
    if (datetime <= new Date()) {
      alert("Please select a date in the future...");
      setLoading(false);
      return;
    }

    firebase
      .firestore()
      .collection("events")
      .add({
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        email: route.params.user,
        // username: route.params.user.username,
        location: location,
        datetime: datetime,
        description: description,
        friends: friends,
        accepted: [],
        declined: [],
      })
      .then(() => {
        alert("Event added!");
        resetState();
        navigation.navigate("Home");
      })
      .catch((error) => {
        alert(error);
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
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.container}>
        <Overlay
          isVisible={open}
          onBackdropPress={() => setOpen(!open)}
          fullScreen
        >
          <TouchableOpacity style={styles.exit} onPress={() => setOpen(false)}>
            <Icon name="cancel" size={25} color="black" />
          </TouchableOpacity>
          <ScrollView>
            {user ? (
              user.map(({ id, u }) =>
                u.friends.map((friend) => (
                  <InviteFriendCard
                    key={id + friend}
                    friend={friend}
                    invitedFriends={friends}
                    addSelected={addSelected}
                  />
                ))
              )
            ) : (
              <React.Fragment />
            )}
          </ScrollView>
        </Overlay>

        <View style={{ marginBottom: 10 }}>
          <Input
            style={styles.input}
            onChangeText={setDescription}
            leftIcon={<Ionicons name="document-text" size={24} color="gray" />}
            placeholder="Name or description"
            value={description}
            onFocus={() => setTouchedDescription(true)}
            errorMessage={
              touchedDescription ? validate("description", description) : ""
            }
          />

          <Input
            style={styles.input}
            leftIcon={<Ionicons name="location" size={24} color="gray" />}
            onChangeText={setLocation}
            placeholder="Location"
            value={location}
            onFocus={() => setTouchedLocation(true)}
            errorMessage={touchedLocation ? validate("location", location) : ""}
          />
        </View>
        <View>
          <View style={styles.datePickers}>
            <Button
              buttonStyle={{ backgroundColor: primary }}
              icon={
                <Icon
                  name="event"
                  size={20}
                  color="white"
                  style={{ marginRight: 5 }}
                />
              }
              title="Pick a date"
              onPress={() => showDatepicker()}
            />
            <Button
              buttonStyle={{ backgroundColor: primary }}
              icon={
                <Icon
                  name="schedule"
                  size={20}
                  color="white"
                  style={{ marginRight: 5 }}
                />
              }
              title="Pick a time"
              onPress={() => showTimepicker()}
            />
          </View>
          <View style={styles.picker}>
            {show && (
              <DateTimePicker
                testID="datePicker"
                value={mode === "date" ? date : time}
                mode={mode}
                is24Hour={true}
                display="default"
                onChange={onChangeDate}
              />
            )}
          </View>
        </View>

        <TouchableOpacity
          style={styles.inviteFriends}
          onPress={() => setOpen(true)}
        >
          <Text style={{ color: filler_alt, fontWeight: "700" }}>
            + Friends {friends.length}
          </Text>
        </TouchableOpacity>

        <Button
          style={styles.createBtn}
          buttonStyle={{ backgroundColor: primary }}
          icon={
            <Ionicons
              name="add-circle"
              size={20}
              color="white"
              style={{ marginRight: 5 }}
            />
          }
          title="Create Event"
          onPress={() => createEvent()}
          disabled={loading || isDisabled()}
        />
        <Button
          style={styles.createBtn}
          buttonStyle={{ backgroundColor: primary }}
          icon={
            <Ionicons
              name="refresh-circle"
              size={20}
              color="white"
              style={{ marginRight: 5 }}
            />
          }
          title="Reset"
          onPress={() => resetState()}
          disabled={loading}
        />
      </View>
    </TouchableWithoutFeedback>
  );
};

const validate = (name, value) => {
  switch (name) {
    case "description":
      if (value === "") {
        return "A description is required";
      }
      break;
    case "location":
      if (value === "") {
        return "A location is required";
      }
      break;
  }

  return "";
};

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: filler_alt,
  },
  title: {
    fontSize: 15,
    fontWeight: "500",
    marginBottom: 10,
    alignSelf: "center",
    padding: 15,
  },
  container: {
    paddingTop: 10,
    flex: 1,
    height: "100%",
    backgroundColor: filler_alt,
  },
  input: {},
  inviteFriends: {
    alignSelf: "center",
    backgroundColor: secondary,
    padding: 10,
    borderRadius: 20,
    marginTop: 25,
    marginBottom: 25,
  },
  createBtn: {
    padding: 10,
    borderRadius: 10,
    alignSelf: "center",
    width: "60%",
  },
  createTxt: {
    justifyContent: "center",
    fontSize: 20,
    alignSelf: "center",
  },
  datePickers: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  exit: {
    alignSelf: "flex-end",
    padding: 5,
  },
  picker: {
    marginTop: 20,
    marginLeft: "35%",
  },
});

export default CreateEvent;
