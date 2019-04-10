/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {StyleSheet, Text, View, Button, Image, Linking, TextInput, 
  TouchableOpacity, PermissionsAndroid} from 'react-native';
//import Geolocation from 'react-native-geolocation-service';
import Geocoder from 'react-native-geocoder';
import { Toolbar, Card, Divider } from 'react-native-material-ui';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ProductScanRNCamera from './components/ProductScanRNCamera.js';
import * as Animatable from 'react-native-animatable';
import ebayLogo from './ebaybrands.svg';
import SvgUri from 'react-native-svg-uri';
//import { SearchBar } from 'react-native-elements';
//import SearchBar from 'react-native-material-design-searchbar';
import { showMessage, hideMessage } from "react-native-flash-message";
import FlashMessage from "react-native-flash-message";



import {
  MKTextField, MKSpinner,
} from 'react-native-material-kit';

const urlBase = "https://29508158.ngrok.io";

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

const Winner = () => {
  return (     
    <Animatable.View style={{textAlign: 'center', alignItems: 'center', width: 60}} animation="bounce" iterationCount={2} direction="normal">
            <View style={{alignItems: 'center', width: 60}}>  
                <Icon name='hand-pointing-up' color="#77b300" size={60}/>
            </View>
    </Animatable.View>
  )
}

const ProcessingLocationMessage = (props) => {
  return (
    <View style={styles.processingLocation}>
      <Text style={{fontSize:20, textAlign: 'center'}}>{props.message}</Text>
    </View>
  )
}

const MenuPanel = (props) => {
  return (
  <Toolbar 
    centerElement = {props.title} 
    style={{container: { backgroundColor: '#77b300'}}}
    rightElement={{
      menu: {
          icon: "more-vert",
          labels: ["Help"]
      }
    }}
  />
  )
}

const Greetings = (props) => {
  return (
    <View style={{padding: 30, marginTop: 50}}>
      <Text style = {{fontSize: 30}}>Price Fighter!</Text>
      <Text style = {{fontSize: 20}}>Compare the best price between these two giants of e-commerce</Text>
    </View>
  )
}

const EbayProduct = (props) => {
  return (
        <View style = {{padding: 5}}>
        
        <Card onPress = {()=> { 
             Linking.openURL(props.item.linkUrl).catch((err) => console.error('An error occurred', err));
               }}>
          <View style = {{padding: 10}}>
          <SvgUri style = {{padding: 5, alignItems: 'center', textAlign: 'center'}} width="45" height="45" fill="black" source={require('./ebaybrands.svg')} />
           <Image
             style={{width: 143, height: 143}}
             source={{uri: props.item.picture}}
           />
           <Text>{props.item.title.slice(0,60) + '...'}</Text>
           <Text style = {{fontWeight: "bold"}}>{props.item.condition}</Text>
           <Text style = {{fontSize: 19}}>$USD {props.item.price.amount}</Text>
           {/*<Button title = "Visit" onPress = {()=> { 
             Linking.openURL(props.item.linkUrl).catch((err) => console.error('An error occurred', err));
               }} />*/}
          </View>
        </Card>
        
        </View>
  )
}

const AmazonProduct = (props) => {
  return (
        <View style = {{padding: 5}}>
        <Card onPress = {()=> { 
             Linking.openURL(props.item.linkUrl).catch((err) => console.error('An error occurred', err));
               }}>
          <View style = {{padding: 10}}>
            <Icon style = {{padding: 5, alignItems: 'center', textAlign: 'center'}} name="amazon" size={44} />  
           <Image
             style={{width: 143, height: 143}}
             source={{uri: props.item.picture}}
           />
           <Text>{props.item.title.slice(0,60) + '...'}</Text>
           <Text style = {{fontWeight: "bold"}}>{props.item.condition}</Text>
           <Text style = {{fontSize: 19}}>$USD {props.item.price}</Text>
           {/*<Button title = "Visit" onPress = {()=> { 
             Linking.openURL(props.item.linkUrl).catch((err) => console.error('An error occurred', err));
               }} />*/}
          </View>
        </Card>
        </View>
  )
}

const EbayProducts = (props) => {

  if (props.processing) {

    return (
      <View style={ { margin: 15, padding: 15 } }>        
        <MKSpinner style={styles.spinner}/>
      </View>
    )

  }

  if (props.ebayProducts.length > 0 && !props.processing) {

    return (
        <View style={{width: 190}}>  
          <EbayProduct item = {props.ebayProducts[0]} />
          <View style={{alignItems: 'center'}}>
            { props.winner === true && <Winner /> }
          </View>
        </View>
   
    )

  } 

  return null

}

const AmazonProducts = (props) => {

  if (props.processing) {

    return (
      <View style={ { margin: 15, padding: 15 } }>        
        <MKSpinner style={styles.spinner}/>
      </View>
    )

  }

  if (props.amazonProducts && !props.processing) {

    return (
      
        <View style={{width: 190}}>  
          <AmazonProduct item = {props.amazonProducts} />
          <View style={{alignItems: 'center'}}>
            { props.winner === true && <Winner /> }
          </View>
        </View>
 
    )

  } 

  return null

}

export default class App extends Component {

  state = {
    latitude: null,
    longitude: null,
    fullAddress: null,
    zipCode: null,
    country: null,
    city: null,
    error: null,
    processing: true,
    scanning: false,
    productId: null,
    ebayProducts: [],
    amazonProducts: null,  
    processingEbayProducts: false,  
    processingAmazonProducts: false,
    toggleSearch: false,  
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
                  city: res[0].locality,
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

    onSelectSearch = () => {
      this.setState({
        toggleSearch: !this.state.toggleSearch,
        productId: null,
      })
    }

    findEbayProducts = (productId, zipCode) => {
      
      this.setState({
        processingEbayProducts: true,
        scanning: false,
      })      
      
      //let url = urlBase + '/findebayproducts/' + productId.replace(/ /g,'+') + '/' + zipCode;
      let url = urlBase + '/findebayproducts/' + productId + '/' + zipCode;

      fetch(url, {
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          }
          
      }).then((response) => response.json())
      .then((responseJson) => 
      { 
        this.setState({
          productId,
          ebayProducts: responseJson.filter(item => item.condition === "New").length > 0 ?
          responseJson.filter(item => item.condition === "New") : 
          responseJson.filter(item => item.condition !== "For parts or not working"),
          processingEbayProducts: false,
        })

        if (!this.state.amazonProducts && 
          responseJson.filter(item => item.condition !== "For parts or not working").length === 0){
            
            this.setState({
              toggleSearch: true,
              productId: null,

            })

            showMessage({
              message: "Product not found",
              description: "Try again using other keywords",
              type: "warning",
              icon: "auto",
              duration: 3000,
            });
          }




      }).catch(error => {
        //console.warn(error);
        this.setState({
          //scanning: false,
          ebayProducts: [],
          processingEbayProducts: false,
        })
      })
    }

    onSearchProduct = () => {

      this.setState({
        toggleSearch: false,
        ebayProducts: [],
        amazonProducts: null,

      })

      if (this.state.productId && this.state.productId.length > 0){
        this.findAmazonProducts(this.state.productId, this.state.zipCode);
      }
    }

    findAmazonProducts = (productId, zipCode) => {
      
      this.setState({
        processingAmazonProducts: true,
        scanning: false,
      })      
      
      //console.warn(productId.replace(/ /g,'+'));

      let url = urlBase + '/amazonsearch/' + productId.replace(/ /g,'+');

      

      fetch(url, {
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          }
          
      }).then((response) => response.json())
      .then((responseJson) => 
      {
        //console.warn(responseJson);
        this.setState({
          productId,
          amazonProducts: responseJson,
          //scanning: false,
          processingAmazonProducts: false,
        })
        //console.warn(responseJson);
        if (responseJson) {

          //this.findEbayProducts(productId + ' ' + responseJson.title.split(' ')[0] + ' ' + responseJson.title.split(' ')[1], zipCode);
          this.findEbayProducts(productId, zipCode);

        } else {
          this.findEbayProducts(productId, zipCode);
        }

      }).catch(error => {
        console.warn(error);
        this.setState({
          //scanning: false,
          amazonProducts: null,
          processingAmazonProducts: false,
        })
      })
    }


    findProduct = (productId, zipCode) => {
      
      this.findAmazonProducts(productId, zipCode);
      //this.findEbayProducts(productId, zipCode);
   
    }

    updateSearch = search => {
      this.setState({ productId: search });
    };
  

    /*findProduct = (productId, zipCode) => {
      
      const promiseChaining = (req, res, next) => {
        
        this.findAmazonProducts(productId).then(amazonProducts => {

          if (amazonProducts){
            this.findEbayProducts(productId + ' ' + amazonProducts.title.split(' ')[0] + ' ' + amazonProducts.title.split(' ')[1], zipCode);
          } else {
            this.findAmazonProducts(productId);
          }
        }).catch(err => {
            console.warn(err)
          }
        );

      }

      promiseChaining();
      
    }*/

    onProductScanned = (productId) => {
      
      //this.findEbayProducts(productId, this.state.zipCode);
      this.findAmazonProducts(productId, this.state.zipCode);

    }

    onScanProduct = () => {
      this.setState({
        scanning: true,
        productId: null,
        ebayProducts: [],
        amazonProducts: null,
        toggleSearch: false,
      })
    }

    onCloseScanner = () => {
      this.setState({
        scanning: false,
      })
    }

    findLocation = () => {
      
      this.setState({
        processing: true,
        toggleSearch: false,
      })

      navigator.geolocation.getCurrentPosition(
        (position) => {
          
          let coordenates = { 
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          }
  
          Geocoder.geocodePosition(coordenates).then(res => {
            //console.warn(res[0]);

            this.setState({
              latitude: res[0].position.lat,
              longitude: res[0].position.lng,
              zipCode: res[0].postalCode,
              fullAddress: res[0].formattedAddress,
              city: res[0].locality,
              country: res[0].countryCode,
              processing: false,
              productId: null,
              ebayProducts: [],
              amazonProducts: null,  
              processingEbayProducts: false,
              processingAmazonProducts: false,
              //country: 'VE',
            });

            /*if (this.state.productId){
              //this.findProduct(this.state.productId, res[0].postalCode);
              this.findAmazonProducts(this.state.productId, res[0].postalCode);
            }*/

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
          <ProcessingLocationMessage message = "Updating your new location..." />
          <MKSpinner style={styles.spinner}/>
        </Container>
      )
    }

    /*if (this.state.country !== 'US' && !this.state.error){
      return (
        <Container>
          <MenuPanel title = 'Price Fighter!' /> 
          <ProcessingLocationMessage message = "Your are not located in United States!" />
          <Button onPress = {this.findLocation} title="Try again" />
        </Container>
      )
    }*/
    
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
            <Icon color='#00bfff' name="map-marker" size={30} onPress = {this.findLocation} />            
            <Text style = {{fontSize: 22}}>I'm in {this.state.city}</Text>
           </View>

          <Divider />
          

          {/*<Button onPress = {this.findLocation} title="Get my location" />*/}

    

          <View style={{flexDirection: 'row'}}>
          
        <View style={{alignItems: 'center', width: 100}}>  
            <Icon name="crosshairs-gps" size={35} onPress = {this.findLocation} />           
            
        </View>

        <Animatable.View animation="rubberBand" iterationCount={3} direction="alternate">
            <View style={{alignItems: 'center', width: 100}}>  
                <Icon onPress = {this.onScanProduct} name='barcode-scan' size={35}/>
            </View>
        </Animatable.View>

        <View style={{alignItems: 'center', width: 100}}>  
            <Icon name="magnify" size={35} onPress = {this.onSelectSearch} />           
            
        </View>

        


        
      </View>

      { this.state.toggleSearch &&
      <View style={{marginTop: 100}}>
      <Animatable.View animation="tada" iterationCount={1} direction="alternate">
            <TextInput
              style={{borderRadius: 25, height: 50, backgroundColor: '#e6e6e6' /*borderColor: 'gray', borderWidth: 1*/}}
              onChangeText={this.updateSearch}
              onEndEditing={this.onSearchProduct}
              value={!this.state.productId ? "" : this.state.productId}
              placeholder= "                Search Product ...                "  
            />
      </Animatable.View>
      </View>
      }
         
          { !this.state.toggleSearch &&
          <View style={{flexDirection: 'row', marginTop: 10}}>
            <EbayProducts 
                winner = { this.state.ebayProducts.length > 0 && this.state.amazonProducts 
                  && Number(this.state.ebayProducts[0].price.amount) < Number(this.state.amazonProducts.price) ? true : false } 
                ebayProducts = {this.state.ebayProducts} processing = {this.state.processingEbayProducts} />
            <AmazonProducts 
              winner = { this.state.ebayProducts.length > 0 && this.state.amazonProducts 
                && Number(this.state.ebayProducts[0].price.amount) > Number(this.state.amazonProducts.price) ? true : false } 
              amazonProducts = {this.state.amazonProducts} processing = {this.state.processingAmazonProducts} />
          </View>        
          }

          { !this.state.amazonProducts && this.state.ebayProducts.length === 0 
          && !this.state.toggleSearch && !this.state.processingEbayProducts && !this.state.processingAmazonProducts &&
            <Greetings />
          }

        
      </Container>
      <FlashMessage position="top" />  
     
      
       </View>
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
    fontSize: 25,
    alignItems: 'center',
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
