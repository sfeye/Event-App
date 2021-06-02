import React, {useState} from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, InputAccessoryView, ScrollView } from 'react-native';
import firebase from 'firebase';

const CreateEvent = ({route, navigation}) => {

    // --- State ----------------- //
    const [location, setLocation] = useState('');
    const [datetime, setDatetime] = useState('');
    const [description, setDescription] = useState('');
    const [friends, setFriends] = useState([]);
    // --------------------------- //

    // --- Post to DB ------------ //
    const createEvent = () => {
        
        firebase
        .firestore()
        .collection('events')
        .add({
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            email: route.params.user.email,
            // username: route.params.user.username,
            location: location,
            datetime: datetime,
            description: description,
            friends: friends,
        })
        .then(() => {
            alert('Event added!');
        })
        .catch(error => {
            alert(error);
        });
    }
    // --------------------------- //

    
    return (
        <ScrollView style={styles.scrollView} keyboardDismissMode="interactive">
            <View style={styles.container}>

                <Text style={styles.title}>Create Event by {route.params.user.email}</Text>

                <TextInput
                style={styles.input}
                onChangeText={setLocation}
                placeholder="Location"
                value={location}
                />

                <TextInput
                style={styles.input}
                onChangeText={setDatetime}
                placeholder="Date & Time"
                value={datetime}
                />

                <TextInput
                style={styles.input}
                onChangeText={setDescription}
                placeholder="Description"
                value={description}
                />

                <TouchableOpacity style={styles.inviteFriends} onPress={() => navigation.push("InviteFriends")}>
                    <Text>+Friends {friends.length}</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.createBtn} onPress={() => createEvent()}>
                    <Text style={styles.createTxt}>Create Event</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    scrollView: {
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 15,
        fontWeight: '500',
        marginBottom: 10
    },
    container: {
        marginTop: 50,
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%'
    },
    input: {
        margin: 5,
        height: 45,
        borderWidth: 1,
        width: '80%',
        padding: 10
    },
    inviteFriends: {
        alignSelf: "flex-start",
        marginLeft: '10%',
        backgroundColor: '#ECECEC',
        padding: 10,
        borderRadius: 20,
        marginTop: 10
    },
    createBtn: {
        backgroundColor: '#add8e6',
        padding: 10,
        borderRadius: 10,
        marginTop: 10
    },
    createTxt: {
        justifyContent: 'center',
        fontSize: 20,
        alignSelf: 'center'
    }
  });

export default CreateEvent