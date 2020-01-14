import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  Button,
  View,
  TouchableOpacity,
  Alert,
} from 'react-native';
import 'react-native-gesture-handler';

import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
var leadersScores = [7, 8]; //initialize with 2 scores for example
var mainSequence = [];
var currentstage = 1;
import Sound from 'react-native-sound'
export var appSounds = {};



class HomeScreen extends React.Component { //game screen component
  constructor(props) {
    super(props);
    this.state = { id: 0, Isbuttonenable: true };
    //loading the sounds
    appSounds.a = new Sound('a.mp3', Sound.MAIN_BUNDLE, error => {
      if (error) {
        console.log("failed to load the sound", error);
      }
    });
    appSounds.b = new Sound('b.mp3', Sound.MAIN_BUNDLE, error => {
      if (error) {
        console.log("failed to load the sound", error);
      }
    });
    appSounds.c = new Sound('c.mp3', Sound.MAIN_BUNDLE, error => {
      if (error) {
        console.log("failed to load the sound", error);
      }
    });
    appSounds.d = new Sound('d.mp3', Sound.MAIN_BUNDLE, error => {
      if (error) {
        console.log("failed to load the sound", error);
      }
    });


  }

  render() {
    return <View style={styles.container}>


      <TouchableOpacity onPress={this.StartingTheGame.bind(this)}>

        <View style={styles.button}>
          <Text style={styles.font}>PLAY With Simon!</Text>
        </View>
      </TouchableOpacity>

      {this.creatPart(1, 'red')}
      {this.creatPart(2, 'blue')}
      {this.creatPart(3, 'green')}
      {this.creatPart(4, 'yellow')}

      <View style={styles.leaderbutton}>
        <Button
          title="Leaders board"
          onPress={() => this.props.navigation.navigate('Leaders')}
        />
      </View>



    </View>

  }

  creatPart(id, color) { //creating TouchableOpacity button for the game
    return (
      <TouchableOpacity onPress={() => this.playing(id)} disabled=
        {this.state.Isbuttonenable}>

        <View style={[styles.button, this.state.id == id ? { backgroundColor: 'purple' } : { backgroundColor: color }]}>
          <Text style={styles.font}>{id}</Text>
        </View>
      </TouchableOpacity>)

  }
  StartingTheGame() { //disbleing the buttons and create first seq
    mainSequence = [];    
    currentstage = 1;
    this.setState({ Isbuttonenable: true })
    this.setState({ id: 0 }) //default state, all the button are in original color
    this.CreateSequence(currentstage);

  }

  CreateSequence(numberofmoves) { //creating new seq in the length of the argument, when finish enable the buttons
    this.setState({ Isbuttonenable: true })
    this.setState({ id: 0 })
    for (var i = 0; i < numberofmoves; i++) {
      let randomNumber = random(1, 4);
      mainSequence.push(randomNumber)
    }
    var j = 0;
    var intervalId = setInterval(() => {
      if (mainSequence[j] == 1)
        appSounds.a.play();
      if (mainSequence[j] == 2)
        appSounds.b.play();
      if (mainSequence[j] == 3)
        appSounds.c.play();
      if (mainSequence[j] == 4)
        appSounds.d.play();
      this.setState({ id: mainSequence[j] });
      j++;
      if (j >= mainSequence.length) {
        this.setState({ Isbuttonenable: false })

        clearInterval(intervalId);
        setTimeout(() => { this.setState({ id: 0 }) }, 1000);
      }
    }, 1000);


  }



  playing(buttonpushed) { //checking if the seq of the player is correct, when he failes, instering his last stage to the leader board
    if (mainSequence.length == 0) { // player canot push the button before he press play 
      this.setState({ Isbuttonenable : true })
      Alert.alert("Press Play to Start")
      return;

    }
    if (mainSequence[0] == buttonpushed && mainSequence.length == 1) { // full success seq of player 
      mainSequence = [];
      currentstage++;
      setTimeout(() => { this.CreateSequence(currentstage) }, 500);
      return;
    }
    if (mainSequence[0] == buttonpushed) { // success step
      mainSequence = mainSequence.slice(1);
      return;
    }
    if (mainSequence[0] !== buttonpushed) { // failure case + inserting his last correct seq the leader board
      this.setState({ Isbuttonenable : true })
      Alert.alert("You Failed! Try Again, Press Play To Restart")


      mainSequence = [];
      if (leadersScores.length < 10) {
        currentstag=currentstage--;
        let curr=currentstage;
        let found =leadersScores.find(element => element == curr);
        if (found==curr)
        return;
        else{
        leadersScores.push(curr);
        leadersScores.sort();
        return;
        }
      }
      else {
        var max = Math.max(leadersScores)
        if (max >= (--currentstage))
          return;
        else {
          leadersScores.shift();
          leadersScores.push(--currentstage);
          leadersScores.sort();
        }
      }

    }
  }

}

function random(min, max) { //Radnom num between 1-4
  return (min + Math.floor(Math.random() * (max + 1 - min)));
}




export class LeadersScreen extends React.Component { //leaders screen component

  constructor(props) {
    super(props);
  }

  render() {

    return (
      <View >
        <Text style={styles.font}>The scores of the leaders:</Text>
        {this.scoresTable(leadersScores)}
        <Text style={styles.font}>Go beat them:</Text>


        <Button style={styles.leaderbutton}
          title="Play with Simon"
          onPress={() => this.props.navigation.navigate('Home')}
        />

      </View>
    );
  }
  scoresTable(scores) { //creating score table from the leaders results.
    let resultscores = [];
    let unique = [...new Set(resultscores)];

    for (var i = scores.length; i >= 0; i--) {

      resultscores.push(this.createtext(i, scores[i]));
    }

    return resultscores;
  }
  createtext(i, score) { //creating text to the screen
    return (

      <Text key={i} style={styles.font}> {score}</Text>
    )
  }
}

const AppNavigator = createStackNavigator(
  {
    Home: HomeScreen,
    Leaders: LeadersScreen,
  },
  {
    initialRouteName: 'Home',
  }
);
export default createAppContainer(AppNavigator);

var styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },

  font: {
    color: 'black',
    fontSize: 25,
    textAlign: 'center',

  },
  leaderbutton: {
    position: 'absolute',
    bottom: 0,
    left: 0,

    backgroundColor: 'white',

  },
  button: {
    padding: 5,
    backgroundColor: 'white',
    justifyContent: 'center',
    width: 120,
    height: 120,
    borderRadius: 240,
  }
});
