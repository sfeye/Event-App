import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  StatusBar,
} from "react-native";
import { primary, filler, filler_alt } from "../styles/colors";
import firebase from "firebase";
import EventCard from "../components/HomePageComponents/EventCard";

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
          {eventCards ? (
            eventCards.map(({ id, eventCard }) =>
              isCurrentUserInvited(eventCard.friends, eventCard.email) ? (
                <EventCard
                  key={id}
                  username={route.params.user}
                  eventId={id}
                  postedBy={eventCard.email}
                  location={eventCard.location}
                  date={eventCard.datetime}
                  time={eventCard.datetime}
                  description={eventCard.description}
                  invitedFriends={eventCard.friends}
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
    backgroundColor: filler_alt,
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
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
    marginBottom: 10,
  },
});

export default Home;
