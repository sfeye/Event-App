import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { secondary, filler_alt, primary } from "../../styles/colors";
import { Overlay, Card, Input, Button, Icon } from "react-native-elements";
import { Ionicons } from "@expo/vector-icons";
import firebase from "firebase";
import { useNavigation } from "@react-navigation/native";
import EventInvited from "./EventInvited";
import DateTimePicker from "@react-native-community/datetimepicker";

const EventCard = ({
  username,
  eventId,
  postedBy,
  location,
  date,
  time,
  description,
  invitedFriends,
  accepted,
  declined,
  isPostedBy,
}) => {
  const active1 = accepted.includes(username.toString());
  const active2 = declined.includes(username.toString());
  const navigation = useNavigation();
  // --- State ----------------- //
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [edit, setEdit] = useState(false);
  const [invite, setInvite] = useState(false);
  const [show, setShow] = useState(false);
  const [mode, setMode] = useState("date");
  const [going, setGoing] = useState(active1);
  const [notGoing, setNotGoing] = useState(active2);
  // --- Edit ------------------ //
  const [eLocation, setLocation] = useState(location);
  const [eDate, setDate] = useState(new Date(date.seconds * 1000));
  const [eTime, setTime] = useState(new Date(time.seconds * 1000));
  const [eDescription, setDescription] = useState(description);
  // --------------------------- //

  // --- Helpers --------------- //
  const acceptEvent = () => {
    setLoading(true);

    //add user to going list
    accepted.push(username);

    //remove user from decline list
    for (var i = 0; i < declined.length; i++) {
      if (declined[i] === username) {
        declined.splice(i, 1);
      }
    }

    writeToDb();
    setGoing(true);
    setNotGoing(false);
  };
  const declineEvent = () => {
    setLoading(true);

    //add user to not going list
    declined.push(username);

    //remove user from going list
    for (var i = 0; i < accepted.length; i++) {
      if (accepted[i] === username) {
        accepted.splice(i, 1);
      }
    }

    writeToDb();
    setGoing(false);
    setNotGoing(true);
  };

  const onChangeDate = (event, selectedDate) => {
    setShow(Platform.OS === "ios");
    mode === "date" ? setDate(selectedDate) : setTime(selectedDate);
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

  function processDate(datetime) {
    var temp = new Date(datetime.seconds * 1000);
    return (
      temp.getMonth() + 1 + "/" + temp.getDate() + "/" + temp.getFullYear()
    );
  }

  function processTime(datetime) {
    var temp = new Date(datetime.seconds * 1000);
    return (
      processHour(temp.getHours()) +
      ":" +
      temp.getMinutes().toString().padEnd(2, "0") +
      " " +
      processAMPM(temp.getHours())
    );
  }

  function processHour(hour) {
    if (hour === "24") {
      return "12";
    } else if (hour < 13) {
      return hour;
    } else {
      return hour - 12;
    }
  }

  function processAMPM(hour) {
    if (hour === 12) {
      return "PM";
    } else if (hour === 24) {
      return "AM";
    } else if (hour < 13) {
      return "AM";
    } else {
      return "PM";
    }
  }
  // --------------------------- //

  // --- Write DB --------------- //
  const writeToDb = () => {
    firebase.firestore().collection("events").doc(eventId).update({
      accepted: accepted,
      declined: declined,
    });

    setLoading(false);
  };

  const deleteEvent = () => {
    firebase
      .firestore()
      .collection("events")
      .doc(eventId)
      .delete()
      .then(() => {
        alert("Event was deleted!");
      })
      .catch((error) => {
        alert(error);
      });
  };

  const updateEvent = () => {
    firebase
      .firestore()
      .collection("events")
      .doc(eventId)
      .update({
        description: eDescription,
        location: eLocation,
        date: eDate,
        time: eTime,
      })
      .then(() => {
        setEdit(false);
      })
      .catch((error) => {
        alert(error);
      });
  };
  // --------------------------- //

  // --- Blur ------------------- //
  useEffect(() => {
    const unsubscribe = navigation.addListener("blur", () => {
      setOpen(false);
    });
    return () => {
      unsubscribe();
    };
  });
  // --------------------------- //

  return (
    <View style={styles.container}>
      <Overlay
        isVisible={edit}
        overlayStyle={styles.overlayEdit}
        onBackdropPress={() => setEdit(!edit)}
      >
        <ScrollView>
          <Input
            style={styles.input}
            onChangeText={setDescription}
            leftIcon={<Ionicons name="document-text" size={24} color="gray" />}
            placeholder="Name or description"
            value={eDescription}
          />
          <Input
            style={styles.input}
            leftIcon={<Ionicons name="location" size={24} color="gray" />}
            onChangeText={setLocation}
            placeholder="Location"
            value={eLocation}
          />
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
              raised
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
              raised
              onPress={() => showTimepicker()}
            />
          </View>
          <View style={styles.picker}>
            {show && (
              <DateTimePicker
                testID="datePicker"
                value={mode === "date" ? eDate : eTime}
                mode={mode}
                is24Hour={true}
                display="default"
                onChange={onChangeDate}
              />
            )}
          </View>

          <Button
            style={styles.createBtn}
            buttonStyle={{ backgroundColor: primary }}
            icon={
              <Ionicons
                name="repeat"
                size={20}
                color="white"
                style={{ marginRight: 5 }}
              />
            }
            title="Update Event"
            onPress={() => updateEvent()}
          />
          <Button
            style={styles.createBtn}
            buttonStyle={{ backgroundColor: primary }}
            icon={
              <Ionicons
                name="close-circle"
                size={20}
                color="white"
                style={{ marginRight: 5 }}
              />
            }
            title="Cancel"
            onPress={() => setEdit(false)}
          />
        </ScrollView>
      </Overlay>

      <Overlay
        isVisible={open}
        overlayStyle={styles.overlay}
        onBackdropPress={() => setOpen(!open)}
      >
        <ScrollView>
          {invitedFriends.map((email) => (
            <EventInvited
              key={email}
              currUser={username}
              email={email}
              going={accepted}
              declined={declined}
            />
          ))}
        </ScrollView>
      </Overlay>

      <Card
        containerStyle={{
          backgroundColor: filler_alt,
          width: "100%",
          alignSelf: "center",
        }}
      >
        <View style={styles.header}>
          <Text style={styles.postedBy}>Posted by: {postedBy}</Text>
          {isPostedBy ? (
            <View style={{ flexDirection: "row" }}>
              <TouchableOpacity
                onPress={() => setEdit(true)}
                disabled={loading}
                style={{ marginRight: 10 }}
              >
                <Ionicons name={"create"} size={20} color={"gray"} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => deleteEvent()}
                disabled={loading}
              >
                <Ionicons name={"trash"} size={20} color={"red"} />
              </TouchableOpacity>
            </View>
          ) : (
            <React.Fragment />
          )}
        </View>

        <View style={styles.viewText}>
          <Text style={styles.description}>{description}</Text>
        </View>

        <View style={styles.viewText}>
          <Ionicons
            name={"location"}
            size={20}
            color={secondary}
            style={{ marginRight: 5 }}
          />
          <Text style={styles.location}>{location}</Text>
        </View>

        <View style={styles.viewText}>
          <Ionicons
            name={"time"}
            size={20}
            color={secondary}
            style={{ marginRight: 5 }}
          />
          <Text style={styles.dateTime}>
            {processDate(date)} at {processTime(time)}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.invitedFriends}
          onPress={() => setOpen(true)}
          disabled={loading}
        >
          <Text style={{ color: filler_alt, fontWeight: "700" }}>
            Invited Friends
          </Text>
        </TouchableOpacity>

        <View style={styles.btnContainer}>
          <TouchableOpacity
            style={going ? styles.goingBoldBtn : styles.goingBtn}
            onPress={() => acceptEvent()}
            disabled={loading || going}
          >
            <Text style={going ? styles.goingBoldTxt : styles.goingTxt}>
              Going? +{accepted.length}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={notGoing ? styles.declineBoldBtn : styles.declineBtn}
            onPress={() => declineEvent()}
            disabled={loading || notGoing}
          >
            <Text style={notGoing ? styles.declineBoldTxt : styles.declineTxt}>
              Decline? +{declined.length}
            </Text>
          </TouchableOpacity>
        </View>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  viewText: {
    flexDirection: "row",
    marginBottom: 5,
  },
  invitedFriends: {
    marginTop: 10,
    margin: 2.5,
    backgroundColor: secondary,
    padding: 10,
    maxWidth: "50%",
    alignSelf: "flex-start",
  },
  createBtn: {
    margin: 10,
    alignSelf: "center",
    width: "60%",
  },
  postedBy: {
    fontWeight: "600",
    alignSelf: "center",
  },
  location: {
    alignSelf: "center",
  },
  dateTime: {
    alignSelf: "center",
  },
  description: {},
  overlay: {
    width: "90%",
    height: "50%",
  },
  inviteFriends: {
    alignSelf: "center",
    backgroundColor: secondary,
    padding: 10,
    borderRadius: 20,
    marginTop: 25,
    marginBottom: 25,
  },
  overlayEdit: {
    width: "90%",
    padding: 20,
    alignContent: "center",
  },
  // --- Accept/Decline BTNS --- //
  btnContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  goingBtn: {
    backgroundColor: "#c8f7c8",
    padding: 5,
    borderRadius: 20,
    marginTop: 10,
    margin: 3,
  },
  goingBoldBtn: {
    backgroundColor: "#9bf09b",
    padding: 5,
    borderRadius: 20,
    marginTop: 10,
    margin: 3,
  },
  goingTxt: {
    fontWeight: "300",
  },
  goingBoldTxt: {
    fontWeight: "600",
  },
  declineBtn: {
    backgroundColor: "#ffa3a6",
    padding: 5,
    borderRadius: 20,
    marginTop: 10,
    margin: 2.5,
  },
  declineBoldBtn: {
    backgroundColor: "#ff595e",
    padding: 5,
    borderRadius: 20,
    marginTop: 10,
    margin: 2.5,
  },
  declineTxt: {
    fontWeight: "300",
  },
  declineBoldTxt: {
    fontWeight: "600",
  },
  datePickers: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  picker: {
    marginTop: 20,
    marginLeft: "35%",
  },
  // --------------------------- //
});

export default EventCard;
