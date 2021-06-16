import React from "react";
import { View, Text } from "react-native";
import { ListItem, Avatar } from "react-native-elements";

const SearchResults = ({ searchResult }) => {
  return (
    <View>
      <ListItem>
        <ListItem.Content>
          <Avatar
            size="small"
            rounded
            overlayContainerStyle={{ backgroundColor: "gray" }}
            title="MT"
            source={{ uri: null }}
          />
          <ListItem.Title>
            {searchResult.description} - {searchResult.location}
          </ListItem.Title>
        </ListItem.Content>
      </ListItem>
    </View>
  );
};

export default SearchResults;
