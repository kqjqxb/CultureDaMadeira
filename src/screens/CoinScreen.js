import { View, Text, SafeAreaView, Dimensions, Image, TouchableOpacity, Alert, Share } from 'react-native'
import React, { useEffect, useState, useRef } from 'react'
import { ChevronLeftIcon } from 'react-native-heroicons/outline';
import { set } from 'date-fns';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Animated } from 'react-native';

const fontOpenSansBold = 'OpenSans-Bold';
const fontOpenSansRegular = 'OpenSans-Regular';
const fontOpenSansSemiBold = 'OpenSans-SemiBold';



const CoinScreen = ({ setSelectedScreen, setGeneratedLocation, generatedLocation, selectedInterest, places, setIsRoutedLocationVisible }) => {
    const dimensions = Dimensions.get('window');
    const [isSpinStarted, setIsSpinStarted] = useState(false);
    const [isTryed, setIsTryed] = useState(false);
    const [isGeneratingPlacesNow, setIsGeneratingPlacesNow] = useState(false);
    const [dots, setDots] = useState('');
    const [isSpinFinished, setIsSpinFinished] = useState(false);
    const [thisGeneratedLocation, setThisGeneratedLocation] = useState(null);
    const spinValue = useRef(new Animated.Value(0)).current;



    useEffect(() => {
        if (isGeneratingPlacesNow) {
            const spinAnimation = Animated.timing(spinValue, {
                toValue: 1,
                duration: 500,
                useNativeDriver: true,
            });

            Animated.loop(spinAnimation, {
                iterations: 6, 
            }).start();
        } else {
            spinValue.setValue(0);
        }
    }, [isGeneratingPlacesNow]);

    const spin = spinValue.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    const progress1 = useRef(new Animated.Value(0)).current;
    const progress2 = useRef(new Animated.Value(0)).current;

    useEffect(() => {

        if (isGeneratingPlacesNow) {
            Animated.timing(progress1, {
                toValue: 1,
                duration: 3000,
                useNativeDriver: false,
            }).start();

            Animated.timing(progress2, {
                toValue: 1,
                duration: 3000,
                useNativeDriver: false,
            }).start();
        } else {
            progress1.setValue(0);
            progress2.setValue(0);
        }
    }, [isGeneratingPlacesNow]);

    const progressBarStyle = (progress) => ({
        width: progress.interpolate({
            inputRange: [0, 1],
            outputRange: ['0%', '100%'],
        }),
        height: 10,
        backgroundColor: 'white',
        alignSelf: 'flex-start',
        marginTop: dimensions.height * 0.03,
        maxWidth: dimensions.width * 0.4, 
        borderRadius: dimensions.width * 0.07,
    });

    useEffect(() => {
        const interval = setInterval(() => {
            setDots(prevDots => (prevDots.length < 3 ? prevDots + '.' : ''));
        }, 250);

        return () => clearInterval(interval);
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


    useEffect(() => {
        console.log('generatedLocation', generatedLocation);
    }, [generatedLocation])


    const shareText = async (title) => {
        try {
            if (!title) {
                Alert.alert('Error', 'No text to share');
                return;
            }
            await Share.share({
                message: `Read more info about '${title}' in Culture Da Madeira!`,
            });
        } catch (error) {
            console.error('Error sharing:', error);
        }
    };

    const getRandomLocation = async () => {
        try {
            const usedLocationsKey = 'usedLocations';
            const usedLocations = JSON.parse(await AsyncStorage.getItem(usedLocationsKey)) || [];

            const availableLocations = places.filter(
                (loc) => !usedLocations.includes(loc.id)
            );

            if (availableLocations.length === 0) {
                await AsyncStorage.removeItem(usedLocationsKey);
                return getRandomLocation();
            }

            const randomIndex = Math.floor(Math.random() * availableLocations.length);
            const randomLocation = availableLocations[randomIndex];

            usedLocations.push(randomLocation.id);
            await AsyncStorage.setItem(usedLocationsKey, JSON.stringify(usedLocations));

            setGeneratedLocation(randomLocation);
            return randomLocation;
        } catch (error) {
            console.error('Error fetching random location:', error);
        }
    };

    const handleGenerateLocation = async () => {
        const randomLocation = await getRandomLocation(selectedInterest);
        setGeneratedLocation(randomLocation);
        setThisGeneratedLocation(randomLocation);
    };

    return (
        <SafeAreaView style={{
            width: '100%',
        }}>
            <View style={{
                zIndex: 50,
                alignSelf: 'center',
                alignItems: 'center',
                flexDirection: 'row',
                width: '100%',

            }}>
                <TouchableOpacity
                    onPress={() => {
                        if (isSpinStarted) setIsSpinStarted(false);
                        else if (isTryed) {
                            setIsTryed(false);
                        } else setSelectedScreen('Home');
                        setIsSpinFinished(false);
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
                    Location Randomizer
                </Text>
            </View>

            {isTryed && isSpinStarted && isSpinFinished ? (
                <View style={{
                    width: '100%',
                    alignSelf: 'center',
                    alignItems: 'center',
                    justifyContent: 'center',

                }}>
                    <View style={{
                        width: dimensions.width * 0.86,
                        alignSelf: 'center',
                        borderRadius: dimensions.width * 0.07,
                        backgroundColor: '#111111',
                    }}>

                        <Image
                            source={thisGeneratedLocation?.image}
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
                                {thisGeneratedLocation?.title}
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
                                {thisGeneratedLocation?.description}
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
                                        setIsSpinStarted(false);
                                        setIsSpinFinished(false);
                                        setIsGeneratingPlacesNow(false);
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
                                    onPress={() => {setIsRoutedLocationVisible(true); setSelectedScreen('Map')}}

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
                                        Open location
                                    </Text>
                                </TouchableOpacity>


                                <TouchableOpacity
                                    onPress={() => {
                                        shareApp(thisGeneratedLocation?.title);
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

                    <TouchableOpacity
                        style={{
                            marginTop: dimensions.height * 0.025,
                        }}
                        onPress={() => {
                            progress1.setValue(0);
                            handleGenerateLocation();
                            setIsSpinStarted(false);
                            setIsSpinFinished(false);
                            // setIsGeneratingPlacesNow(false);
                        }}>
                        <Text
                            style={{
                                fontFamily: fontOpenSansBold,
                                textAlign: "left",
                                fontSize: dimensions.width * 0.046,
                                alignSelf: 'flex-start',
                                fontWeight: 700,
                                color: 'white',
                                alignItems: 'center',
                                justifyContent: 'center',


                            }}
                        >
                            One more time
                        </Text>
                    </TouchableOpacity>


                </View>
            ) : !isTryed ? (
                <View style={{
                    width: '100%',
                    alignSelf: 'center',
                    marginTop: dimensions.height * 0.05,
                }}>

                    <Image
                        source={require('../assets/icons/coinIcon.png')}
                        style={{
                            width: dimensions.width * 0.25,
                            height: dimensions.width * 0.25,
                            textAlign: 'center',
                            alignSelf: 'center',

                        }}
                        resizeMode="contain"
                    />


                    <Text
                        style={{
                            fontFamily: fontOpenSansBold,
                            textAlign: "center",
                            fontSize: dimensions.width * 0.057,
                            alignSelf: 'center',
                            fontWeight: 700,
                            color: 'white',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginTop: dimensions.height * 0.05,
                            paddingHorizontal: dimensions.width * 0.05

                        }}
                    >
                        Location Coinflip is a mode where 2 cultural places are randomly selected, and a coin decides which one we recommend you visit today
                    </Text>


                    <TouchableOpacity
                        onPress={() => { setIsTryed(true) }}

                        style={{
                            padding: dimensions.width * 0.04,
                            backgroundColor: '#F15257',
                            borderRadius: dimensions.width * 0.07,
                            width: dimensions.width * 0.7,
                            alignSelf: 'center',
                            marginTop: dimensions.height * 0.05,
                        }}>
                        <Text
                            style={{
                                fontFamily: fontOpenSansBold,
                                textAlign: "center",
                                fontSize: dimensions.width * 0.046,

                                alignSelf: 'center',
                                fontWeight: 700,
                                color: 'white',
                                padding: dimensions.width * 0.01


                            }}
                        >
                            Try this
                        </Text>
                    </TouchableOpacity>
                </View>

            ) : (
                <View style={{
                    width: '100%',

                }}>
                    <View style={{
                        width: dimensions.width * 0.8,
                        alignSelf: 'center',
                        borderRadius: dimensions.width * 0.07,
                        backgroundColor: '#111111',
                        paddingHorizontal: dimensions.width * 0.05,
                        paddingVertical: dimensions.width * 0.095,
                    }}>
                        <Image
                            source={require('../assets/icons/questionIcon.png')}
                            style={{
                                width: dimensions.width * 0.07,
                                height: dimensions.width * 0.07,
                                textAlign: 'center',
                                alignSelf: 'center',

                            }}
                            resizeMode="contain"
                        />

                        {!isGeneratingPlacesNow ? (

                            <Text
                                style={{
                                    fontFamily: fontOpenSansBold,
                                    textAlign: "center",
                                    fontSize: dimensions.width * 0.05,

                                    alignSelf: 'center',
                                    fontWeight: 600,
                                    color: 'white',
                                    padding: dimensions.width * 0.01,
                                    marginTop: dimensions.height * 0.03


                                }}
                            >
                                Place #1
                            </Text>
                        ) : (
                            <View style={{
                                alignItems: 'center',
                                paddingHorizontal: dimensions.width * 0.14,
                            }}>

                                <Animated.View style={progressBarStyle(progress1)} />
                            </View>
                        )}
                    </View>


                    <Animated.Image
                        source={require('../assets/icons/coinIcon.png')}
                        style={{
                            width: dimensions.height * 0.1,
                            height: dimensions.height * 0.1,
                            textAlign: 'center',
                            alignSelf: 'center',
                            marginVertical: dimensions.height * 0.035,
                            transform: [{ rotateX: spin }], // Rotate around the horizontal axis
                        }}
                        resizeMode="contain"
                    />


                    <View style={{
                        width: dimensions.width * 0.8,
                        alignSelf: 'center',
                        borderRadius: dimensions.width * 0.07,
                        backgroundColor: '#111111',
                        paddingHorizontal: dimensions.width * 0.05,
                        paddingVertical: dimensions.width * 0.095,
                    }}>
                        <Image
                            source={require('../assets/icons/questionIcon.png')}
                            style={{
                                width: dimensions.width * 0.07,
                                height: dimensions.width * 0.07,
                                textAlign: 'center',
                                alignSelf: 'center',

                            }}
                            resizeMode="contain"
                        />

                        {!isGeneratingPlacesNow ? (

                            <Text
                                style={{
                                    fontFamily: fontOpenSansBold,
                                    textAlign: "center",
                                    fontSize: dimensions.width * 0.05,

                                    alignSelf: 'center',
                                    fontWeight: 600,
                                    color: 'white',
                                    padding: dimensions.width * 0.01,
                                    marginTop: dimensions.height * 0.03


                                }}
                            >
                                Place #2
                            </Text>
                        ) : (
                            <View style={{
                                alignItems: 'center',
                                paddingHorizontal: dimensions.width * 0.14,
                            }}>

                                <Animated.View style={progressBarStyle(progress1)} />
                            </View>
                        )}

                    </View>


                    <TouchableOpacity
                        onPress={() => {
                            handleGenerateLocation();
                            setTimeout(() => {
                                setIsSpinFinished(true);
                                setIsGeneratingPlacesNow(false);
                            }, 3000)
                            setIsSpinStarted(true); setIsGeneratingPlacesNow(true)
                        }}

                        style={{
                            padding: dimensions.width * 0.04,
                            backgroundColor: !isSpinStarted ? '#f15257' : 'rgba(241, 82, 87, 0.3)',
                            borderRadius: dimensions.width * 0.07,
                            width: dimensions.width * 0.59,
                            alignSelf: 'center',
                            marginTop: dimensions.height * 0.04,
                        }}>
                        <Text
                            style={{
                                fontFamily: fontOpenSansBold,
                                textAlign: "center",
                                fontSize: dimensions.width * 0.046,

                                alignSelf: 'center',
                                fontWeight: 700,
                                color: 'white',
                                padding: dimensions.width * 0.01


                            }}
                        >
                            {!isSpinStarted ? 'Start' : 'Wait' + dots}
                        </Text>
                    </TouchableOpacity>

                </View>
            )}

        </SafeAreaView>
    )
}

export default CoinScreen