import React, { useState } from 'react';
import {
SafeAreProvider,
ScrollView,
StyleSheet,
Text,
Button,
View,
 useWindowDimensions } from 'react-native';
import { TabView, SceneMap } from 'react-native-tab-view';
import { TabBar } from 'react-native-tab-view';
import Realm from "realm";
import { Header, Body, Title, Left, Right, Icon } from 'native-base';
import Dialog from "react-native-dialog";

const App: () => Node = () => {

  const [addDialogVisible, setAddDialogVisible] = React.useState(false);
  const [name, setName] = React.useState("");
  const [players, setPlayers] = React.useState([]);

  const Realm = require('realm');

  const Player = {
    name: 'Player',
    properties: {
        name: 'string',
        score: {type: 'int', default: 0},
    },
  };

  const realm = new Realm({schema: [Player]});

  const [timeOne, setTimeOne] = React.useState(0);
  const [score, setScore] = React.useState(0);

  const okClicked = () => {
    setAddDialogVisible(false);
    realm.write(() => {
      const player = realm.create('Player', {
        name: name,
        score: score,
      });
    });
  }
  
  const circlePressed = () => {
    // get start time - first press
    if (timeOne === 0) {
      const date = new Date();
      setTimeOne(date.getTime());
      setScore(0);
    // second press, calc time and store
    } else {
      const date = new Date();
      setScore(date.getTime() - timeOne);
    } 
  }

  const resetTime =  () => {
    setScore(0);
  }

const [index, setIndex] = React.useState(0);
const [routes] = React.useState([
  { key: 'first', title: 'Game' },
  { key: 'second', title: 'Highscores' },
]);
const indexChange = (index) => {
 
  setIndex(index);

  if (index === 1) {
    let players = realm.objects('Player').sorted('score');
    let playersArray = Array.from(players);
    setPlayers(playersArray);
  }
}

const layout = useWindowDimensions();

const FirstRoute = () => (
  <View style={[styles.scene, { backgroundColor: '#013220' }]}>
  <View style={[styles.scene, { backgroundColor: '#013220', marginTop: 90 }]}>
  <Text style={styles.text}>Double tap the circle as fast as you can!</Text>
  <View style={styles.circle} onTouchStart={CirclePressed}/>
  <Text style={{paddingTop: 50, textAlign: "center"}}>Time: {score}</Text> 
  <View style={styles.row}>
  <View style={styles.button}>
  <View style={{marginRight: 20, width: 150}}>
  <Button title="Add highscores" onPress={() => setAddDialogVisible(true)} />
  </View> 
  <View style={{width: 150}}>
  <Button title="Reset time" onPress={() => setAddDialogVisible(true)} /> 
  </View> 
  </View> 
  </View>
  </View> 
  </View>
  );


const SecondRoute = () => (
  <View style={[ styles.scene, { backgroundColor: '#3ab1b7' }]}>
  <View style={[ styles.scene, { backgroundColor: '#3ab1b7' }]}>
  <ScrollView>
      {players.map((player, index) => {
        return (
          <View key={index} style={styles.highscore}>
            <Text style={styles.highscoreName}>{player.name}</Text>
            <Text style={styles.highscoreScore}>{player.score}</Text>
          </View>
        )
      })}
  </ScrollView>
</View></View>
);

const renderScene = SceneMap({
  first: FirstRoute,
  second: SecondRoute,
});

  return (
    <ScrollView style={{flex: 1}} contentContainerStyle={{flex:1}}>
    <Header style={{ backgroundColor: '#7521f3' }}>
  <Left><Icon name='menu' style={{ color: '#013220' }} /></Left>
  <Body>
    <Title>SPEEDGAME</Title>
  </Body>
  <Right/>
  </Header>
    <TabView
      navigationState={{ index, routes }}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={{ width: layout.width }}
    />
    <Dialog.Container visible={addDialogVisible}>
  <Dialog.Title>Add a new highscore</Dialog.Title>
  <Dialog.Input label="Name" placeholder="Click and type your name here" onChangeText={text => setName(text)}/>
  <Dialog.Button label="Ok" onPress={okClicked} />
  </Dialog.Container>
  </ScrollView>
  );
}

const styles = StyleSheet.create({
  scene: {
    flex: 1,
  },
  circle: {
    width: 150,
    height: 150,
    borderRadius: 150/2,
    backgroundColor: 'red',
    alignSelf : "center",
    marginTop: 100
  },
  text: {
    marginTop: 50,
    alignSelf : "center"
  },
  button: {
    marginRight: 20,
    marginTop: 50,
    alignSelf : "center",
    width: 150
  },
  row: {
    flexDirection: 'row',
    alignSelf : "center"
  },
  highscore: {
    flexDirection: 'row',
    margin: 10,
  },
  highscoreName: {
    fontSize: 20,
    color: 'black',
    width: '50%',
    textAlign: 'right',
    marginRight: 5
  },
  highscoreScore: {
    fontSize: 20,
    color: 'gray',
    width: '50%',
    marginLeft: 5
  }
});

export default App;
