import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { secondary, filler_alt } from "../../styles/colors";
import { Overlay, Card } from "react-native-elements";
import { Ionicons } from "@expo/vector-icons";
import firebase from "firebase";
import { useNavigation } from "@react-navigation/native";
import EventInvited from "./EventInvited";

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

      <Card containerStyle={{ backgroundColor: filler_alt }}>
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
            {date} at {time}
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
