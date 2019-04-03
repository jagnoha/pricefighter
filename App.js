/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import Geocoder from 'react-native-geocoder';
import { Toolbar } from 'react-native-material-ui';
import {
  MKTextField,
} from 'react-native-material-kit';
//import { TextField } from 'react-native-material-textfield';

const Textfield = MKTextField.textfield()
  .withPlaceholder('Text...')
  .build();

const Container = (props) => {
  return (
    <View style={styles.container}>
      {props.children}
    </View>
  )
}

const ProcessingLocationMessage = (props) => {
  return (
    <View style={styles.processingLocation}>
      <Text>{props.message}</Text>
    </View>
  )
}

const MenuPanel = (props) => {
  return (
  <Toolbar centerElement = {props.title} />
  )
}

export default class App extends Component {

  state = {
    latitude: null,
    longitude: null,
    zipCode: null,
    country: null,
    error: null,
  }

  componentDidMount() {
    Geolocation.getCurrentPosition(
      (position) => {
        
        let coordenates = { 
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        }

        Geocoder.geocodePosition(coordenates).then(res => {
          this.setState({
            latitude: res[0].position.lat,
            longitude: res[0].position.lng,
            zipCode: res[0].postalCode,
            country: res[0].countryCode,
            //country: 'VE',
          });
        }).catch(error => {
          this.setState({
            error: error,
          })
        })
      },
      (error) => this.setState({ error: error.message }),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 },
    );
  }   


  render() {
    
    if (this.state.latitude === null && !this.state.error){
      return (
        <Container>
          <MenuPanel title = 'Price Fighter!' /> 
          <ProcessingLocationMessage message = "Checking your Location..." />
        </Container>
      )
    }

    if (this.state.country !== 'US' && !this.state.error){
      return (
        <Container>
          <MenuPanel title = 'Price Fighter!' /> 
          <ProcessingLocationMessage message = "Your are not located in United States!" />
        </Container>
      )
    }
    
    if (this.state.error){
      return (
      <Container>
          <MenuPanel title = 'Price Fighter!' /> 
          <ProcessingLocationMessage message = "ohhh, I think you are offline" />
      </Container>
      )
    }


    return (
      <Container>
          <MenuPanel title = 'Price Fighter!' />
          
          <View style = {styles.zipCode}>
            <Text>Zip Code</Text>
            <Textfield
              value = {this.state.zipCode}
              onChangeText = {(zipCode) => this.setState({zipCode})}
            />
          </View>

          
          <ProcessingLocationMessage message = {JSON.stringify(this.state)} />
      </Container>
       
    );
  }
}

const styles = StyleSheet.create({
  container: {
    //flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  processingLocation: {
    flex: 2,
    fontSize: 20,
    textAlign: 'center',
    padding: 30,
  },
  zipCode: {
    fontSize: 25,
    textAlign: 'center',
    padding: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
