import React, { useEffect, useState } from "react";
import { View, Text, SnapshotViewIOSBase } from "react-native";
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
    <View>
      <SearchBar
        placeholder="Search events.."
        onChangeText={setSearchText}
        value={searchText}
      />
      {events ? (
        events.map(({ id, event }) => filterEvents(id, event, searchText))
      ) : (
        <React.Fragment />
      )}
    </View>
  );
};

export default Search;
