import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import firebase from 'firebase';

const Event = ({username, eventId, postedBy, location, datetime, description, accepted, decined}) => {
  // --- State ----------------- //
    const [accept, setAccept] = useState(null);
    const [loading, setLoading] = useState(false);
  // --------------------------- //

  // --- Helpers --------------- //
    const acceptEvent = () => {
        setLoading(true);
        setAccept(true);
        writeToDb();
    }
    const declineEvent = () => {
        setLoading(true);
        setAccept(false);
        writeToDb();
    }
  // --------------------------- //


  // --- Write DB --------------- //
    const writeToDb = () => {
        if(accept) {
            accepted.push(username);
            for( var i = 0; i < declined.length; i++) { 
                if (decined[i] === username) { declined.splice(i, 1); }
            }
        } else {
            declined.push(username);
            for( var i = 0; i < accepted.length; i++) { 
                if (accepted[i] === username) { accepted.splice(i, 1); }
            }
        }

        firebase
        .firestore()
        .collection('events')
        .doc(eventId)
        .update({
            accepted: accepted,
            decined: declined
        });

        setLoading(false);
    }
  // --------------------------- //


    return (
        <View style={styles.container}>
            <Text style={styles.postedBy}>Posted by: {postedBy}</Text>

            <Text style={styles.location}>Location: {location}</Text>

            <Text style={styles.dateTime}>Date & Time: {datetime}</Text>

            <Text style={styles.description}>Description: {description}</Text>

            <TouchableOpacity style={styles.invitedFriends} onPress={() => alert('todo')} disabled={loading}>
                <Text>Invited Friends</Text>
            </TouchableOpacity>

            <TouchableOpacity style={(accept ? styles.goingBold : styles.going)} onPress={() => acceptEvent()} disabled={loading}>
                <Text>Going? +{accepted.length}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={(accept ? styles.decline : styles.declineBold)} onPress={() => declineEvent()} disabled={loading}>
                <Text>Decline? +{decined.length}</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
      borderStyle: 'solid',
      borderWidth: 2,
    },
  });

export default Event