import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { CheckBox, Card } from "react-native-elements";

const InviteFriendCard = ({ friend, invitedFriends, addSelected }) => {
  // --- State ----------------- //
  const [friendName, setFriendName] = useState(friend);
  const [selected, setSelected] = useState(isAlreadyInvited(friendName));
  // --------------------------- //

  // --- Helpers --------------- //
  const select = (friend) => {
    setSelected(!selected);
    setFriendName(friend);
    addSelected(selected, friendName);
  };

  function isAlreadyInvited(friend) {
    if (invitedFriends.includes(friend)) {
      return true;
    }
    return false;
  }
  // --------------------------- //

  return (
    <View>
      <Card style={styles.alreadyInvited}>
        <View style={styles.card}>
          <Text style={styles.cardText}>{friend}</Text>
          <CheckBox checked={selected} onPress={() => select(friend)} />
        </View>
      </Card>
    </View>
  );
};

export default InviteFriendCard;

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardText: {},
  alreadyInvited: {
    backgroundColor: "green",
  },
});
