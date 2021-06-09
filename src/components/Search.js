import React, { useEffect, useState } from "react";
import { View } from "react-native";
import {
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
} from "react-native";
import { SearchBar } from "react-native-elements";
import SearchResults from "./SearchResults";
import firebase from "firebase";

function filterEvents(id, singleEvent, searchText) {
  if (searchText === "") {
    return;
  }
  if (
    singleEvent.location.toLowerCase().includes(searchText.toLowerCase()) ||
    singleEvent.description.toLowerCase().includes(searchText.toLowerCase()) ||
    singleEvent.email.toLowerCase().includes(searchText.toLowerCase())
  ) {
    return <SearchResults key={id} searchResult={singleEvent} />;
  }
}

const Search = ({ navigation }) => {
  const [searchText, setSearchText] = useState("");
  const [events, setEvents] = useState(null);

  useEffect(() => {
    const unsubscribe = firebase
      .firestore()
      .collection("events")
      .onSnapshot((snapshot) => {
        setEvents(
          snapshot.docs.map((doc) => ({
            event: doc.data(),
            id: doc.id,
          }))
        );
      });
    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={true}>
      <View style={styles.container}>
        <SearchBar
          placeholder="Search events.."
          onChangeText={setSearchText}
          value={searchText}
        />
        <ScrollView>
          {events ? (
            events.map(({ id, event }) => filterEvents(id, event, searchText))
          ) : (
            <React.Fragment />
          )}
        </ScrollView>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: "100%",
  },
});

export default Search;
