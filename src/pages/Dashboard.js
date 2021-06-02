import React, {useEffect, useState} from 'react';
import { StyleSheet, Text, View, SafeAreaView, Button } from 'react-native';
import firebase from 'firebase';
import EventCard from '../components/EventCard';

const Dashboard = ({route, navigation}) => {
  // --- State ----------------- //
  const [eventCards, setEventCards] = useState(null);
  const [loading, setLoading] = useState(false);
  var today = new Date();
  // --------------------------- //

  // --- Read DB --------------- //
  useEffect(() => {

    firebase
    .firestore()
    .collection('events')
    .onSnapshot(snapshot => {
      setEventCards(snapshot.docs.map(doc => ({
        id: doc.id,
        eventCard: doc.data()
      })));
    })

  }, []);
  // --------------------------- //


  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <Text>Welcome to the dashboard {route.params.user.email}!</Text>
        <Button title="Log Off" onPress={() => firebase.auth().signOut()}/>
        {eventCards ? (eventCards.map(({id, eventCard}) => (
          <View>
            <EventCard 
              key={id}
              username={eventCard.email}
              eventId={id}
              postedBy={eventCard.email}
              location={eventCard.location}
              datetime={"time"}
              description={eventCard.description}
              accepted={eventCard.accepted}
              declined={eventCard.declined}
            />
          </View>
        ))) : (React.Fragment)}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
});

export default Dashboard;

