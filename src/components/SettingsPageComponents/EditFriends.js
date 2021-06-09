import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { Card, Avatar } from "react-native-elements";
import { Ionicons } from "@expo/vector-icons";

const EditFriends = ({ route, navigation }) => {
  // --- Helpers --------------- //
  const submit = (friend) => {
    alert("but he was such a nice guy... 😢");
    route.params.removeFriend(route.params.id, route.params.friends, friend);
    navigation.goBack();
  };
  // --------------------------- //
  return (
    <View>
      {route.params.friends ? (
        route.params.friends.map((friend) => (
          <Card>
            <View key={friend} style={styles.cardContainer}>
              <Text>{friend}</Text>
              <TouchableOpacity
                onPress={() => submit(friend)}
                style={styles.trashBtn}
              >
                <Ionicons name={"trash"} size={25} color={"red"} />
              </TouchableOpacity>
            </View>
          </Card>
        ))
      ) : (
        <Text>You have no friends, go to Friends page to add more!</Text>
      )}
    </View>
  );
};

export default EditFriends;

const styles = StyleSheet.create({
  cardContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
