import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { CheckBox, Card } from "react-native-elements";

const InviteFriendCard = ({ friend, invitedFriends, addSelected }) => {
  // --- State ----------------- //
  const [invite, setInvite] = useState({
    friend: friend,
    selected: false,
  });
  // --------------------------- //

  // --- Helpers --------------- //
  const select = () => {
    setInvite({ selected: !invite.selected });
    addSelected(invite);
  };

  function isAlreadyInvited(friend) {
    if (invitedFriends.includes(friend)) {
      setInvite({ selected: true });
    } else {
      setInvite({ selected: false });
    }
  }

  useEffect(() => {
    isAlreadyInvited(friend);
  }, []);
  // --------------------------- //

  return (
    <View>
      <Card style={styles.alreadyInvited}>
        <View style={styles.card}>
          <CheckBox checked={invite.selected} onPress={() => select()} />
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
