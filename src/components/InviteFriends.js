import React from "react";
import { View, Text, StyleSheet } from "react-native";

const InviteFriends = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text>Hey I want to be invited...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default InviteFriends;
