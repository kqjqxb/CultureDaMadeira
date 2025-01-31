import React, { useEffect, useMemo, useState } from 'react';
import {
    View,
    Text,
    Image,
    Dimensions,
    TouchableOpacity,
    SafeAreaView,
    Share,
    Linking,
    Alert,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { styled } from 'nativewind';
import placesData from '../components/placesData';
import { ChevronLeftIcon } from 'react-native-heroicons/outline';


const fontOpenSansBold = 'OpenSans-Bold';
const fontOpenSansRegular = 'OpenSans-Regular';
const fontOpenSansSemiBold = 'OpenSans-SemiBold';

const MapScreen = ({ generatedLocation, setSelectedScreen, isRoutedLocationVisible, setIsRoutedLocationVisible }) => {
    const [dimensions, setDimensions] = useState(Dimensions.get('window'));


    useEffect(() => {
        console.log('routed loc savedId is ' + generatedLocation?.savedId);
    }, []);




  const shareApp = async (title) => {
    try {
      if (!title) {
        Alert.alert('Error', 'No link to share');
        return;
      }
      console.log('Sharing URL:', title);
      await Share.share({
        message: `Do you now ${title}? No? Read about it in Culture da Madeira app!`,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };


    return (
        <SafeAreaView style={{ width: '100%' }}>
            <View style={{
                zIndex: 50,
                alignSelf: 'center',
                alignItems: 'center',
                flexDirection: 'row',
                width: '100%',

            }}>
                <TouchableOpacity
                    onPress={() => {
                        setSelectedScreen('Home');
                    }}
                    style={{
                        borderRadius: dimensions.width * 0.5,
                        zIndex: 100,
                        padding: dimensions.width * 0.04,
                        alignSelf: 'flex-start',
                    }}>
                    <ChevronLeftIcon size={dimensions.width * 0.07} color='white' />
                </TouchableOpacity>
                <Text
                    style={{
                        fontFamily: fontOpenSansBold,
                        textAlign: "left",
                        fontSize: dimensions.width * 0.064,
                        alignSelf: 'center',
                        fontWeight: 700,
                        color: 'white',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginRight: dimensions.width * 0.05

                    }}
                >
                    Cultural Places
                </Text>
            </View>
            <MapView
                style={{
                    width: '100%',
                    height: dimensions.height,
                    alignSelf: 'center',
                    marginTop: dimensions.height * 0.01,
                    zIndex: 50
                }}
                region={{
                    latitude: generatedLocation ? generatedLocation.coordinates.latitude : placesData[0].coordinates.latitude,
                    longitude: generatedLocation ? generatedLocation.coordinates.longitude : placesData[0].coordinates.longitude,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                }}
            >
                
                {placesData.map((location, index) => (
                    <Marker
                        key={index}
                        coordinate={location.coordinates}
                        title={location.title}
                        description={location.description}
                        pinColor={generatedLocation && location.coordinates === generatedLocation.coordinates ? "#FFCC4D" : "#DA553E"}
                    />
                ))}
            </MapView>
            {isRoutedLocationVisible && (
                    <View style={{
                        width: '100%',
                        alignSelf: 'center',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 100,
                        position: 'absolute',
                        top: dimensions.height * 0.25,

                    }}>
                        <View style={{
                            width: dimensions.width * 0.86,
                            alignSelf: 'center',
                            borderRadius: dimensions.width * 0.07,
                            backgroundColor: '#111111',
                        }}>

                            <Image
                                source={generatedLocation?.image}
                                style={{
                                    width: '100%',
                                    height: dimensions.height * 0.25,
                                    borderTopLeftRadius: dimensions.width * 0.07,
                                    borderTopRightRadius: dimensions.width * 0.07,

                                }}
                                resizeMode="stretch"
                            />
                            <View style={{
                                alignItems: 'center',
                                alignSelf: 'center',
                                padding: dimensions.width * 0.05,
                            }}>

                                <Text
                                    style={{
                                        fontFamily: fontOpenSansBold,
                                        textAlign: "left",
                                        fontSize: dimensions.width * 0.05,
                                        alignSelf: 'flex-start',
                                        fontWeight: 600,
                                        color: 'white',
                                        alignItems: 'center',
                                        justifyContent: 'center',


                                    }}
                                >
                                    {generatedLocation?.title}
                                </Text>
                                <Text
                                    style={{
                                        fontFamily: fontOpenSansBold,
                                        textAlign: "left",
                                        fontSize: dimensions.width * 0.037,
                                        alignSelf: 'flex-start',
                                        fontWeight: 400,
                                        color: 'white',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        marginRight: dimensions.width * 0.05,
                                        marginTop: dimensions.height * 0.005

                                    }}
                                >
                                    {generatedLocation?.description}
                                    {/* Learn about the history and process of Madeira wine production, with a chance to taste different varieties. */}
                                </Text>


                                <View style={{
                                    width: '100%',
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    alignSelf: 'center',
                                    marginTop: dimensions.height * 0.025,
                                    marginBottom: dimensions.height * 0.028,
                                }}>
                                    <TouchableOpacity
                                        onPress={() => {
                                            setSelectedScreen('Home');
                                        }}
                                        style={{
                                            padding: dimensions.width * 0.04,
                                            backgroundColor: '#F15257',
                                            borderRadius: dimensions.width * 0.055,
                                        }}>
                                        <Image
                                            source={require('../assets/icons/reloadIcon.png')}
                                            style={{
                                                width: dimensions.width * 0.055,
                                                height: dimensions.width * 0.055,
                                                textAlign: 'center',
                                            }}
                                            resizeMode="contain"
                                        />
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        onPress={() => {
                                            setIsRoutedLocationVisible(false);
                                        }}

                                        style={{
                                            padding: dimensions.width * 0.04,
                                            backgroundColor: '#F15257',
                                            borderRadius: dimensions.width * 0.055,
                                            flex: 1,
                                            marginHorizontal: dimensions.width * 0.025,
                                        }}>
                                        <Text
                                            style={{
                                                fontFamily: fontOpenSansBold,
                                                textAlign: "center",
                                                fontSize: dimensions.width * 0.035,

                                                alignSelf: 'center',
                                                fontWeight: 700,
                                                color: 'white',


                                            }}
                                        >
                                            Close location
                                        </Text>
                                    </TouchableOpacity>


                                    <TouchableOpacity
                                        onPress={() => {
                                            shareApp(generatedLocation?.title);
                                        }}
                                        style={{
                                            padding: dimensions.width * 0.04,
                                            backgroundColor: '#F15257',
                                            borderRadius: dimensions.width * 0.055,
                                        }}>
                                        <Image
                                            source={require('../assets/icons/shareIcon.png')}
                                            style={{
                                                width: dimensions.width * 0.055,
                                                height: dimensions.width * 0.055,
                                                textAlign: 'center',
                                            }}
                                            resizeMode="contain"
                                        />
                                    </TouchableOpacity>

                                </View>
                            </View>
                        </View>
                    </View>
                )}
        </SafeAreaView>
    );
};

export default MapScreen;
