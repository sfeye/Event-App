import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  InputAccessoryView,
  ScrollView,
} from "react-native";
import firebase from "firebase";
import DateTimePicker from "@react-native-community/datetimepicker";

const CreateEvent = ({ route, navigation }) => {
  // --- State ----------------- //
  const [location, setLocation] = useState("");
  const [datetime, setDate] = useState(new Date());
  const [description, setDescription] = useState("");
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(false);
  // --------------------------- //

  // --- Helpers --------------- //
  const onChangeDate = (event, selectedDate) => {
    setDate(selectedDate);
  };

  const resetState = () => {
    setLocation("");
    setDate(new Date());
    setDescription("");
    setFriends([]);
    setLoading(false);
  };
  // --------------------------- //

  // --- Post to DB ------------ //
  const createEvent = () => {
    setLoading(true);

    firebase
      .firestore()
      .collection("events")
      .add({
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        email: route.params.user.email,
        // username: route.params.user.username,
        location: location,
        date: datetime,
        description: description,
        friends: friends,
        accepted: [],
        declined: [],
      })
      .then(() => {
        alert("Event added!");
        resetState();
      })
      .catch((error) => {
        alert(error);
      });
  };
  // --------------------------- //

  return (
    <ScrollView style={styles.scrollView} keyboardDismissMode="interactive">
      <View style={styles.container}>
        <Text style={styles.title}>
          Hi {route.params.user.email}, let's create an event!
        </Text>

        <TextInput
          style={styles.input}
          onChangeText={setDescription}
          placeholder="Name or description"
          value={description}
        />

        <TextInput
          style={styles.input}
          onChangeText={setLocation}
          placeholder="Location"
          value={location}
        />

        <View style={styles.datePickers}>
          <DateTimePicker
            testID="datePicker"
            value={datetime}
            mode={"datetime"}
            is24Hour={true}
            display="default"
            onChange={onChangeDate}
          />
        </View>

        <TouchableOpacity
          style={styles.inviteFriends}
          onPress={() => navigation.push("InviteFriends")}
        >
          <Text>+Friends {friends.length}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.createBtn}
          onPress={() => createEvent()}
          disabled={loading}
        >
          <Text style={styles.createTxt}>Create Event</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 15,
    fontWeight: "500",
    marginBottom: 10,
    alignSelf: "center",
    padding: 15,
  },
  container: {
    marginTop: "15%",
    flex: 1,
    height: "100%",
  },
  input: {
    margin: 5,
    height: 45,
    borderWidth: 1,
    width: "80%",
    padding: 10,
    alignSelf: "center",
  },
  inviteFriends: {
    alignSelf: "center",
    backgroundColor: "#c8f7c8",
    padding: 10,
    borderRadius: 20,
    marginTop: 25,
    marginBottom: 25,
  },
  createBtn: {
    backgroundColor: "#ececec",
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
    alignSelf: "center",
    width: "60%",
  },
  createTxt: {
    justifyContent: "center",
    fontSize: 20,
    alignSelf: "center",
  },
  datePickers: {
    alignSelf: "center",
    marginTop: 10,
    width: "60%",
  },
});

export default CreateEvent;
