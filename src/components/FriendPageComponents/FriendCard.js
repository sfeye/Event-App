import React from "react";
import { StyleSheet, Text, View, Image } from "react-native";
import { Card, ListItem, Button, Icon } from "react-native-elements";
import { Ionicons } from "@expo/vector-icons";

const FriendCard = ({ name, email, avatar, phone, friendArr }) => {
  return (
    <View>
      <Card>
        <View>
          <Ionicons
            style={{ fontSize: 30 }}
            name="person-circle"
            color="gray"
          />
          <Text>{name}</Text>
          <Text>{email}</Text>
          <Text>{phone}</Text>
          <Text>
            {name} has {friendArr} friend(s)
          </Text>
        </View>
      </Card>
    </View>
  );
};

export default FriendCard;

const styles = StyleSheet.create({});
