import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Card, Avatar } from "react-native-elements";
import { Ionicons } from "@expo/vector-icons";
import { secondary } from "../../styles/colors";
import { useNavigation } from "@react-navigation/native";

const FriendCard = ({
  currUser,
  id,
  name,
  email,
  avatar,
  phone,
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
          <View style={{ flexDirection: "row" }}>
            <Avatar
              size="small"
              rounded
              title={initials.shift().charAt(0) + initials.pop().charAt(0)}
              source={{ uri: avatar }}
              placeholderStyle={{ backgroundColor: secondary }}
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
            <Text style={{ alignSelf: "center", marginLeft: 10 }}>{name}</Text>
          </View>
          <View style={{ flexDirection: "row", marginTop: 10, marginLeft: 8 }}>
            <Ionicons name={"mail"} size={18} color={secondary} />
            <Text style={{ alignSelf: "center", marginLeft: 8 }}>{email}</Text>
          </View>

          <View style={{ flexDirection: "row", marginTop: 5, marginLeft: 8 }}>
            <Ionicons name={"call"} size={18} color={secondary} />
            <Text style={{ alignSelf: "center", marginLeft: 8 }}>{phone}</Text>
          </View>
        </View>
      </Card>
    </View>
  );
};

export default FriendCard;

const styles = StyleSheet.create({});
