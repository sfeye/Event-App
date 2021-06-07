import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Card, Avatar } from "react-native-elements";

const FriendCard = ({ name, email, avatar, phone, friendArr }) => {
  const initials = name.split(" ");
  return (
    <View>
      <Card>
        <View>
          <Avatar
            size="small"
            rounded
            title={initials.shift().charAt(0) + initials.pop().charAt(0)}
            source={{ uri: avatar }}
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
