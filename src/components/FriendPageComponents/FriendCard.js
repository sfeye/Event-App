import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Card, Avatar } from "react-native-elements";
import { useNavigation } from "@react-navigation/native";

const FriendCard = ({
  currUser,
  id,
  name,
  email,
  avatar,
  phone,
  friendLength,
  friendArr,
  pendingArr,
  screenToNav,
}) => {
  const navigation = useNavigation();
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
            onPress={() =>
              navigation.navigate(screenToNav, {
                currUser: currUser,
                id: id,
                name: name,
                email: email,
                avatar: avatar,
                phone: phone,
                friendArr: friendArr,
                pendingArr: pendingArr,
              })
            }
          />
          <Text>{name}</Text>
          <Text>{email}</Text>
          <Text>{phone}</Text>
          <Text>
            {name} has {friendLength} friend(s)
          </Text>
        </View>
      </Card>
    </View>
  );
};

export default FriendCard;

const styles = StyleSheet.create({});
