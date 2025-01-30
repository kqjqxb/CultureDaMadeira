import React, { useEffect, useState, useMemo, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  Share,
  Animated,
  Easing,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AboutScreen from './AboutScreen';
import { styled } from 'nativewind';
import { useDispatch, useSelector } from 'react-redux';
import { updateUserData, saveUserData } from '../redux/userSlice';
import SelectInterestsScreen from './SelectInterestsScreen';
import SavedScreen from './SavedScreen';
import MapScreen from './MapScreen';
import SettingsScreen from './SettingsScreen';
import { ArrowUpOnSquareIcon } from 'react-native-heroicons/solid';
import { ScrollView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import { id, is } from 'date-fns/locale';
import BookScreen from './BookScreen';
import CoinScreen from './CoinScreen';

import places from '../components/placesData';



const categories = [
  { id: 2, name: 'Nature & Parks' },
  { id: 1, name: 'Scenic Sports' },
  { id: 3, name: 'Art & Culture' },
];


const fontOpenSansBold = 'OpenSans-Bold';
const fontOpenSansRegular = 'OpenSans-Regular';
const fontOpenSansSemiBold = 'OpenSans-SemiBold';


const categoryButtons = [
  {
    id: 1,
    title: 'Traditions and customs',
    icon: require('../assets/icons/bottomMapButtonIcons/icon1.png'),
  },
  {
    id: 2,
    title: 'Art and literature',
    icon: require('../assets/icons/bottomMapButtonIcons/icon2.png'),
  },
  {
    id: 3,
    title: 'Music and dancing',
    icon: require('../assets/icons/bottomMapButtonIcons/icon3.png'),
  },
  {
    id: 4,
    title: 'Local cuisine',
    icon: require('../assets/icons/bottomMapButtonIcons/icon4.png'),
  },
]


const buttons = [
  { screen: 'Map', notSelectedIcon: require('../assets/icons/simpleIcons/mapIcon.png'), selectedIcon: require('../assets/icons/selectedIcons/mapIcon.png') },
  { screen: 'About', notSelectedIcon: require('../assets/icons/simpleIcons/infoIcon.png'), selectedIcon: require('../assets/icons/selectedIcons/infoIcon.png') },
  { screen: 'Home', notSelectedIcon: require('../assets/icons/simpleIcons/homeIcon.png'), selectedIcon: require('../assets/icons/selectedIcons/homeIcon.png') },
  { screen: 'Book', notSelectedIcon: require('../assets/icons/simpleIcons/bookIcon.png'), selectedIcon: require('../assets/icons/selectedIcons/bookIcon.png') },
  { screen: 'Coin', notSelectedIcon: require('../assets/icons/simpleIcons/coinIcon.png'), selectedIcon: require('../assets/icons/selectedIcons/coinIcon.png') }, // Зміна тут
];



const HomeScreen = () => {

  const [dimensions, setDimensions] = useState(Dimensions.get('window'));
  const [selectedScreen, setSelectedScreen] = useState('Home');
  const [currentUser, setCurrentUser] = useState(null);
  const [todayDay, setTodayDay] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedInterest, setSelectedInterest] = useState(null);
  const [generatedLocation, setGeneratedLocation] = useState(null);
  const [routedLocation, setRoutedLocation] = useState(null);
  const [dots, setDots] = useState('');

  const [isLocationGenerated, setIsLocationGenerated] = useState(false);
  const [isGeneratingNow, setIsGeneratingNow] = useState(false);
  const [generatedCoinLocation, setGeneratedCoinLocation] = useState(null);
  const spinValue = useRef(new Animated.Value(0)).current;
  const [isRoutedLocationVisible, setIsRoutedLocationVisible] = useState(false);
  useEffect(() => {
    if (isGeneratingNow) {
      spinValue.setValue(0);
      const spinAnimation = Animated.timing(spinValue, {
        toValue: 1,
        duration: 500,
        easing: Easing.linear,
        useNativeDriver: true,
      });

      Animated.loop(spinAnimation, {
        iterations: 6,
      }).start();
    } else {
      spinValue.setValue(0);
    }
  }, [isGeneratingNow]);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prevDots => (prevDots.length < 3 ? prevDots + '.' : ''));
    }, 250);

    return () => clearInterval(interval);
  }, []);


  const [selectedCategory, setSelectedCategory] = useState('Traditions and customs');

  const [savedLocations, setSavedLocations] = useState([]);

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

      return randomLocation;
    } catch (error) {
      console.error('Error fetching random location:', error);
    }
  };

  const handleGenerateLocation = async () => {
    const randomLocation = await getRandomLocation(selectedInterest);
    setGeneratedLocation(randomLocation);
  };

  useEffect(() => {
    const fetchSelectedInterest = async () => {
      try {
        const savedInterest = await AsyncStorage.getItem('selectedInterest');
        if (savedInterest) {
          setSelectedInterest(parseInt(savedInterest, 10));
        }
      } catch (error) {
        console.error('Помилка отримання інтересу:', error);
      }
    };

    fetchSelectedInterest();
  }, []);


  useEffect(() => {
    const fetchSavedLocations = async () => {
      try {
        const saved = await AsyncStorage.getItem('savedLocations');
        setSavedLocations(saved ? JSON.parse(saved) : []);
      } catch (error) {
        console.error('Помилка завантаження збережених локацій:', error);
      }
    };

    fetchSavedLocations();
  }, [selectedScreen,]);

  useEffect(() => {
    const fetchTodayDay = async () => {
      try {
        const savedDay = await AsyncStorage.getItem('todayDay');
        if (savedDay !== null) {
          setTodayDay(parseInt(savedDay, 10));
        }
      } catch (error) {
        console.error('Помилка при завантаженні todayDay:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTodayDay();
  }, []);

  useEffect(() => {
    console.log(`today is: ${todayDay}`)
  }, [todayDay])



  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('currentUser');
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setCurrentUser(parsedUser);
        }
      } catch (error) {
        console.error('Error fetching current user:', error);
      }
    };

    fetchCurrentUser();
  }, []);


  useEffect(() => {
    console.log("generated location savedId is " + generatedLocation?.savedId)
  }, [generatedLocation])


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
    <View style={{
      flex: 1,
      alignItems: 'center',
      backgroundColor: '#242424',
    }}>



      {selectedScreen === 'Home' ? (
        <SafeAreaView className="flex-1 px-5  " style={{ width: '100%', }}>

          <Image
            source={require('../assets/images/homeImage.png')}
            style={{
              width: '100%',
              height: dimensions.height * 0.35,

              position: 'absolute',
              top: 0,

            }}
            resizeMode="stretch"
          />
          <Text style={{
            paddingBottom: 5,
            marginTop: dimensions.height * 0.025,
            fontFamily: fontOpenSansBold,
            fontWeight: 700,
            textAlign: 'center',
            alignSelf: 'center',
            fontSize: dimensions.width * 0.05,
            color: 'white',
            marginBottom: dimensions.height * 0.025,
          }}>
            What to visit today?
          </Text>

          {isLocationGenerated ? (
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
                        setIsLocationGenerated(false);
                        setIsGeneratingNow(true);
                        handleGenerateLocation();
                        setTimeout(() => {
                          setIsGeneratingNow(false);
                          setIsLocationGenerated(true);
                        }, 3000);
                        // setIsGeneratingPlacesNow(false);
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
                        setRoutedLocation(generatedLocation);
                        setSelectedScreen('Map');
                        if (!isRoutedLocationVisible) {
                          setIsRoutedLocationVisible(true);
                        }
                        // shareText(selectedCategory)
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
                        Open location
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

              <TouchableOpacity
                style={{
                  marginTop: dimensions.height * 0.025,
                }}
                onPress={() => {
                  setIsLocationGenerated(false);
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
                  Close
                </Text>
              </TouchableOpacity>


            </View>
          ) : (

            <View style={{
              width: '85%',
              alignItems: 'center',
              alignSelf: 'center',
              backgroundColor: '#111111',
              padding: dimensions.width * 0.07,
              borderRadius: dimensions.width * 0.05,
            }}>
              <Animated.Image
                source={require('../assets/icons/spinIcon.png')}
                style={{
                  width: dimensions.width * 0.19,
                  height: dimensions.width * 0.19,
                  marginTop: dimensions.width * 0.01,
                  textAlign: 'center',
                  transform: [{ rotate: spin }], // Apply rotation animation
                }}
                resizeMode="contain"
              />
              <TouchableOpacity
                disabled={isGeneratingNow}
                onPress={() => {
                  setIsGeneratingNow(true);
                  handleGenerateLocation();
                  setTimeout(() => {
                    setIsGeneratingNow(false);
                    setIsLocationGenerated(true);
                    // handleGenerateLocation();
                  }, 3000);
                }}
                style={{
                  marginTop: dimensions.width * 0.05,
                  backgroundColor: '#F15257',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '70%',
                  alignSelf: 'center',
                  padding: dimensions.width * 0.034,
                  borderRadius: dimensions.width * 0.04,
                }}>
                <Text style={{
                  fontFamily: fontOpenSansRegular,
                  fontWeight: 700,
                  textAlign: 'center',
                  alignSelf: 'center',
                  fontSize: dimensions.width * 0.043,
                  color: 'white',
                }}>
                  {isGeneratingNow ? 'Please wait' + dots : 'Surprise Me'}
                </Text>
              </TouchableOpacity>
            </View>
          )}


          {!isGeneratingNow && !isLocationGenerated && (
            <>
              <Text style={{
                marginTop: dimensions.height * 0.03,
                fontFamily: fontOpenSansBold,
                fontWeight: 700,
                textAlign: 'center',
                alignSelf: 'center',
                fontSize: dimensions.width * 0.05,
                color: 'white',
              }}>
                Culture da Madeira
              </Text>

              <View style={{
                width: '85%',
                flexDirection: 'row',
                flexWrap: 'wrap',
                justifyContent: 'space-between',
                alignSelf: 'center',
                marginTop: dimensions.height * 0.019,
              }}>
                {categoryButtons.map((button, index) => (
                  <TouchableOpacity
                    onPress={() => { setSelectedCategory(button.title); setSelectedScreen('Book'); }}
                    key={index} style={{
                      backgroundColor: '#111111',
                      borderRadius: dimensions.width * 0.05,
                      borderWidth: selectedCategory === button.title ? 1.6 : 0,
                      borderColor: selectedCategory === button.title ? '#F15257' : 'transparent',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '48%', // Зміна тут для розміщення двох кнопок у рядку
                      padding: dimensions.width * 0.035,
                      marginBottom: dimensions.width * 0.04, // Додаємо відступ між рядками
                    }}>
                    <Image
                      source={button.icon}
                      style={{
                        width: dimensions.width * 0.07,
                        height: dimensions.width * 0.07,
                        textAlign: 'center',
                        marginTop: dimensions.height * 0.016,
                      }}
                      resizeMode="contain"
                    />
                    <Text style={{
                      marginTop: dimensions.height * 0.019,
                      fontFamily: fontOpenSansSemiBold,
                      fontWeight: 600,
                      textAlign: 'center',
                      alignSelf: 'center',
                      fontSize: dimensions.width * 0.034,
                      color: 'white',
                    }}>
                      {button.title}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </>
          )}






        </SafeAreaView>

      ) : selectedScreen === 'About' ? (
        <AboutScreen setSelectedScreen={setSelectedScreen} />
      ) : selectedScreen === 'Book' ? (
        <BookScreen setSelectedScreen={setSelectedScreen} selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />
      ) : selectedScreen === 'Saved' ? (
        <SavedScreen selectedScreen={selectedScreen} setRoutedLocation={setRoutedLocation} setSelectedScreen={setSelectedScreen} routedLocation={routedLocation} />
      ) : selectedScreen === 'Map' ? (
        <MapScreen generatedLocation={generatedLocation} setSelectedScreen={setSelectedScreen} selectedScreen={selectedScreen}
          isRoutedLocationVisible={isRoutedLocationVisible} setIsRoutedLocationVisible={setIsRoutedLocationVisible}
        />
      ) : selectedScreen === 'Coin' ? (
        <CoinScreen setSelectedScreen={setSelectedScreen} selectedScreen={setSelectedScreen} generatedCoinLocation={generatedCoinLocation}
          setGeneratedLocation={setGeneratedLocation} places={places} selectedInterest={selectedInterest} setIsRoutedLocationVisible={setIsRoutedLocationVisible}
        />
      ) : null}

      <View
        style={{
          position: 'absolute',
          bottom: '3%',
          backgroundColor: '#F15257',
          width: '86%',
          paddingHorizontal: dimensions.width * 0.03,
          borderRadius: dimensions.width * 0.055,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          alignSelf: 'center',
          paddingVertical: dimensions.height * 0.01,

        }}
      >
        {buttons.map((button, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => setSelectedScreen(button.screen)}
            style={{
              borderRadius: dimensions.width * 0.028,
              padding: dimensions.width * 0.04,
              alignItems: 'center',
              marginHorizontal: 5,
              backgroundColor: selectedScreen === button.screen ? 'white' : '#242424',
            }}
          >
            <Image
              source={selectedScreen === button.screen ? button.selectedIcon : button.notSelectedIcon}
              style={{
                width: dimensions.width * 0.055,
                height: dimensions.width * 0.055,
                textAlign: 'center'
              }}
              resizeMode="contain"
            />
          </TouchableOpacity>
        ))}
      </View>

    </View>
  );
};

export default HomeScreen;
