import React, { Component } from 'react';
import { Button, Text, View } from 'react-native';
import { RNCamera } from 'react-native-camera';
import BarcodeMask from 'react-native-barcode-mask';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

class ProductScanRNCamera extends Component {

  constructor(props) {
    super(props);
    this.camera = null;
    this.barcodeCodes = [];

    this.state = {
      camera: {
        type: RNCamera.Constants.Type.back,
	    flashMode: RNCamera.Constants.FlashMode.auto,
	    barcodeFinderVisible: true,
      barcode: null
      }
    };
  }

  render() {
    return (
      <View style={styles.container}>
        <RNCamera
            ref={ref => {
              this.camera = ref;
            }}
            barcodeFinderVisible={this.state.camera.barcodeFinderVisible}
            barcodeFinderWidth={280}
            barcodeFinderHeight={100}
            
            //barcodeFinderHeight={220}
            barcodeFinderBorderColor="white"
            barcodeFinderBorderWidth={2}
            defaultTouchToFocus
            flashMode={this.state.camera.flashMode}
            mirrorImage={false}
            //onBarCodeRead={this.onBarCodeRead}
            onGoogleVisionBarcodesDetected={ ( { barcodes } ) => {
                /*this.setState({
                  barcode: barcodes[0].rawData,
                })*/
                this.props.onProductScanned(barcodes[0].rawData);
            } }
            onFocusChanged={() => {}}
            onZoomChanged={() => {}}
            permissionDialogTitle={'Permission to use camera'}
            permissionDialogMessage={'We need your permission to use your camera phone'}
            style={styles.preview}
            type={this.state.camera.type}
        />
        <BarcodeMask width={300} height={100} />
        <View style={[styles.overlay, styles.topOverlay]}>
	  <Text style={styles.scanScreenMessage}>Please scan the barcode.</Text>
    
    <Icon style={styles.closeScanner} color="white" name="close-outline" size={100} onPress={this.props.onCloseScanner}/>
    
	</View>
	
    {/*<View style={[styles.overlay, styles.bottomOverlay]}>
          <Button
            onPress={() => { console.log('scan clicked'); }}
            style={styles.enterBarcodeManualButton}
            title="Enter Barcode"
           />
        </View>*/}
    
    
    </View>
    );
  }
}

const styles = {
  container: {
    flex: 1
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  overlay: {
    position: 'absolute',
    padding: 16,
    right: 0,
    left: 0,
    alignItems: 'center'
  },
  topOverlay: {
    top: 0,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  bottomOverlay: {
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  enterBarcodeManualButton: {
    padding: 15,
    backgroundColor: 'white',
    borderRadius: 40
  },
  scanScreenMessage: {
    fontSize: 14,
    color: 'white',
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center'
  },
  closeScanner: {
    fontSize: 30,
  }
};

export default ProductScanRNCamera;