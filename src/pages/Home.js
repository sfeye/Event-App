import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import firebase from "firebase";
import EventCard from "../components/EventCard";

const Home = ({ route, navigation }) => {
  // --- State ----------------- //
  const [eventCards, setEventCards] = useState(null);
  const [loading, setLoading] = useState(false);
  // --------------------------- //

  // --- Helpers --------------- //
  function isPostedByCurrentUser(postedBy) {
    if (postedBy === route.params.user) {
      return true;
    }
    return false;
  }
  function isCurrentUserInvited(invitedFriends, postedBy) {
    if (
      invitedFriends.includes(route.params.user) ||
      isPostedByCurrentUser(postedBy)
    ) {
      return true;
    }
    return false;
  }

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

  // --- Read DB --------------- //
  useEffect(() => {
    const today = new Date();
    today.setHours(0);

    const unsubscribe = firebase
      .firestore()
      .collection("events")
      .where("datetime", ">=", today)
      .orderBy("datetime", "asc")
      .onSnapshot((snapshot) => {
        setEventCards(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            eventCard: doc.data(),
          }))
        );
      });
    return () => {
      unsubscribe();
    };
  }, []);
  // --------------------------- //

  return (
    <SafeAreaView style={styles.safeView}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.headerTxt}>
              Logged in as {route.params.user}
            </Text>

            <TouchableOpacity
              style={styles.headerBtn}
              onPress={() => firebase.auth().signOut()}
            >
              <Text>Log Out</Text>
            </TouchableOpacity>
          </View>

          {eventCards ? (
            eventCards.map(({ id, eventCard }) =>
              isCurrentUserInvited(eventCard.friends, eventCard.email) ? (
                <EventCard
                  key={id}
                  username={route.params.user}
                  eventId={id}
                  postedBy={eventCard.email}
                  location={eventCard.location}
                  date={processDate(eventCard.datetime)}
                  time={processTime(eventCard.datetime)}
                  description={eventCard.description}
                  accepted={eventCard.accepted}
                  declined={eventCard.declined}
                  isPostedBy={isPostedByCurrentUser(eventCard.email)}
                />
              ) : (
                <React.Fragment />
              )
            )
          ) : (
            <ActivityIndicator color="black" size="large" />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeView: {
    flex: 1,
    paddingTop: StatusBar.currentHeight,
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: "2.5%",
  },
  headerTxt: {
    paddingTop: 7,
    fontWeight: "700",
  },
  headerBtn: {
    backgroundColor: "#fff",
    borderRadius: 30,
    padding: 7,
    borderStyle: "solid",
    borderWidth: 1,
  },
  scrollView: {
    marginHorizontal: 20,
  },
});

export default Home;
