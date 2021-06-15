import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Overlay } from "react-native-elements";
import { Ionicons } from "@expo/vector-icons";
import firebase from "firebase";
import FriendCards from "./FriendPageComponents/FriendCards";
import { useNavigation } from "@react-navigation/native";

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
  const [going, setGoing] = useState(active1);
  const [notGoing, setNotGoing] = useState(active2);
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
        alert("Success!");
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
  });
  // --------------------------- //

  return (
    <View style={styles.container}>
      <Overlay
        isVisible={open}
        overlayStyle={styles.overlay}
        onBackdropPress={() => setOpen(!open)}
      >
        <ScrollView>
          {invitedFriends.map((email) => (
            <FriendCards
              friendEmail={email}
              key={email}
              screenToNav="HomeFriendProfile"
            />
          ))}
        </ScrollView>
      </Overlay>

      <View style={styles.header}>
        <Text style={styles.postedBy}>Posted by: {postedBy}</Text>
        {isPostedBy ? (
          <TouchableOpacity onPress={() => deleteEvent()} disabled={loading}>
            <Ionicons name={"trash"} size={20} color={"red"} />
          </TouchableOpacity>
        ) : (
          <React.Fragment />
        )}
      </View>

      <Text style={styles.description}>Description: {description}</Text>

      <Text style={styles.location}>Location: {location}</Text>

      <Text style={styles.dateTime}>Date: {date}</Text>

      <Text style={styles.dateTime}>Time: {time}</Text>

      <TouchableOpacity
        style={styles.invitedFriends}
        onPress={() => setOpen(true)}
        disabled={loading}
      >
        <Text>Invited Friends</Text>
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderStyle: "solid",
    borderWidth: 1,
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  invitedFriends: {
    borderRadius: 20,
    marginTop: 10,
    margin: 2.5,
    backgroundColor: "#add8e6",
    padding: 10,
    maxWidth: "50%",
    alignSelf: "flex-start",
  },
  postedBy: {
    fontWeight: "600",
  },
  location: {},
  dateTime: {},
  description: {},
  overlay: {
    width: "80%",
    height: "80%",
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
  // --------------------------- //
});

export default EventCard;
