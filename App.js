/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {StyleSheet, Text, View, Button, TouchableOpacity, PermissionsAndroid} from 'react-native';
//import Geolocation from 'react-native-geolocation-service';
import Geocoder from 'react-native-geocoder';
import { Toolbar } from 'react-native-material-ui';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ProductScanRNCamera from './components/ProductScanRNCamera.js'

import {
  MKTextField, MKSpinner,
} from 'react-native-material-kit';

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
    fullAddress: null,
    zipCode: null,
    country: null,
    error: null,
    processing: true,
    scanning: false,
    productId: null,    
  }  
  
  componentDidMount() {

          navigator.geolocation.getCurrentPosition(
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
                  fullAddress: res[0].formattedAddress,
                  country: res[0].countryCode,
                  //country: 'VE',
                  processing: false,
                });
              }).catch(error => {
                this.setState({
                  error: error,
                  processing: false,
                })
              })
            },
            (error) => this.setState({ error: error.message, processing: false }),
            { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 },
          );
        
        
    }

    onProductScanned = (productId) => {
      this.setState({
        productId,
        scanning: false,
      })
    }

    onScanProduct = () => {
      this.setState({
        scanning: true,
      })
    }

    onCloseScanner = () => {
      this.setState({
        scanning: false,
      })
    }

    findLocation = () => {
      
      this.setState({
        processing: true
      })

      navigator.geolocation.getCurrentPosition(
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
              fullAddress: res[0].formattedAddress,
              country: res[0].countryCode,
              processing: false,
              //country: 'VE',
            });
          }).catch(error => {
            this.setState({
              error: error,
              processing: false,
            })
          })
        },
        (error) => this.setState({ error: error.message }),
        { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 },
      );    

    }

        

    

  render() {
    
    if (this.state.processing === true){
      return (
        <Container>
          <MenuPanel title = 'Price Fighter!' /> 
          <ProcessingLocationMessage message = "Checking your Location..." />
          <MKSpinner style={styles.spinner}/>
        </Container>
      )
    }

    if (this.state.country !== 'US' && !this.state.error){
      return (
        <Container>
          <MenuPanel title = 'Price Fighter!' /> 
          <ProcessingLocationMessage message = "Your are not located in United States!" />
          <Button onPress = {this.findLocation} title="Try again" />
        </Container>
      )
    }
    
    if (this.state.error){
      return (
      <Container>
          <MenuPanel title = 'Price Fighter!' /> 
          <ProcessingLocationMessage message = "Ummmm, something is wrong..." />
          <Button onPress = {this.findLocation} title="Try again" />
      </Container>
      )
    }

    if (this.state.scanning){
      return (
        <ProductScanRNCamera 
            onCloseScanner = {this.onCloseScanner} 
            onProductScanned = {this.onProductScanned}
        />
      )
    }


    return (
      <View>
      <Container>
          <MenuPanel title = 'Price Fighter!' />
          
          <View style = {styles.currentLocation}>
            <Icon color='#00bfff' name="map-marker" size={50} onPress = {this.findLocation} />            
            <Text>{this.state.fullAddress}</Text>
          </View>

          <Button onPress = {this.findLocation} title="Get my location" />

          <View style = {styles.barcodeScannerButton}>
            <Icon onPress = {this.onScanProduct} name='barcode-scan' size={80}/>
          </View>

          <Button color='#a3c639' onPress = {this.onScanProduct} title="Scan Product" />

          <Text style = {styles.currentLocation}>{this.state.productId}</Text>

         
          
      </Container>
     

       </View>
    );

    /*return (
      <ProductScanRNCamera />
    )*/

    


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
  currentLocation: {
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 25,
    textAlign: 'center',
    padding: 10,
  },
  barcodeScannerButton: {
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 25,
    textAlign: 'center',
    padding: 25,
  },
  spinner: {
    margin: 30,
    width: 35,
    height: 35,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  barcode: {
    flex: 15,
    alignItems: 'center',
    textAlign: 'center',
    paddingTop: 150,
  },
  capture: {
    flex: 0,
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 15,
    paddingHorizontal: 20,
    alignSelf: 'center',
    margin: 20,
  },

  
});
