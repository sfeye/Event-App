import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { Button, Input, Icon, Overlay } from "react-native-elements";
import firebase from "firebase";
import DateTimePicker from "@react-native-community/datetimepicker";
import InviteFriendCard from "./InviteFriendCard";

const CreateEvent = ({ route, navigation }) => {
  // --- State ----------------- //
  const [user, setUser] = useState(null);
  const [location, setLocation] = useState("");
  const [datetime, setDateTime] = useState(new Date());
  const [description, setDescription] = useState("");
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  // --------------------------- //

  // --- Helpers --------------- //
  const onChangeDate = (event, selectedDate) => {
    setDateTime(selectedDate);
  };

  const resetState = () => {
    setLocation("");
    setDateTime(new Date());
    setDescription("");
    setFriends([]);
    setLoading(false);
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
  // --------------------------- //

  // --- Post to DB ------------ //
  const createEvent = () => {
    setLoading(true);

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
        <Text style={styles.title}>
          Hi {route.params.user}, let's create an event!
        </Text>
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

        <Input
          style={styles.input}
          onChangeText={setDescription}
          placeholder="Name or description"
          value={description}
          errorMessage={validate("description", description)}
        />

        <Input
          style={styles.input}
          onChangeText={setLocation}
          placeholder="Location"
          value={location}
          errorMessage={validate("location", location)}
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
          onPress={() => setOpen(true)}
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
        <TouchableOpacity
          style={styles.createBtn}
          onPress={() => resetState()}
          disabled={loading}
        >
          <Text style={styles.createTxt}>Reset</Text>
        </TouchableOpacity>
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
    marginTop: "10%",
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
  exit: {
    alignSelf: "flex-end",
    padding: 5,
  },
});

export default CreateEvent;
