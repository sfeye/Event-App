import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableWithoutFeedback,
  Keyboard,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Avatar, Input } from "react-native-elements";
import firebase from "firebase";

const FriendProfile = ({ route, navigation }) => {
  const initials = route.params.name.split(" ");

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.container}>
        <View>
          <View style={styles.avatar}>
            <Avatar
              size="xlarge"
              rounded
              title={initials.shift().charAt(0) + initials.pop().charAt(0)}
              source={{ uri: route.params.avatar }}
            />
          </View>
          <View style={styles.infoContainer}>
            <View style={styles.infoNoneditable}>
              <Text style={styles.infoEmail}>{route.params.email}</Text>
            </View>
            <View style={styles.infoEditable}>
              <Text style={styles.infoOther}>{route.params.name}</Text>
            </View>
            <View style={styles.infoEditable}>
              <Text style={styles.infoOther}>{route.params.phone}</Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  avatar: {
    alignSelf: "center",
    marginTop: 20,
  },
  infoContainer: {
    alignSelf: "center",
    marginTop: 20,
    width: "100%",
  },
  infoEmail: {
    fontSize: 25,
    fontWeight: "400",
  },
  infoOther: {
    fontSize: 20,
    alignSelf: "center",
    textAlign: "center",
    padding: 10,
    paddingRight: 20,
  },
  infoEditable: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  infoNoneditable: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 40,
    marginTop: 10,
  },
});

export default FriendProfile;
