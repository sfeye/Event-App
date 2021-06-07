import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { CheckBox, Card } from "react-native-elements";

const InviteFriendCard = ({
  addSelected,
  removeSelected,
  friend,
  invitedFriends,
}) => {
  // --- State ----------------- //
  const [selected, setSelected] = useState(isAlreadyInvited(friend));
  // --------------------------- //

  // --- Helpers --------------- //
  const select = () => {
    if (!selected) {
      setSelected(!selected);
      addSelected(friend);
    } else {
      setSelected(!selected);
      removeSelected(friend);
    }
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
          <CheckBox checked={selected} onPress={() => select()} />
          <Text style={styles.cardText}>{friend}</Text>
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
