import { View, Text, Image, Dimensions, TouchableOpacity, ScrollView, Alert, Share } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import traditionsAndCustomsData from '../components/traditionsAndCustomsData'
import artAndLiteratureData from '../components/artAndLiteratureData'
import musicAndDanceData from '../components/musicAndDanceData'
import CuisineData from '../components/CuisineData'
import { it } from 'date-fns/locale'


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


const fontOpenSansBold = 'OpenSans-Bold';
const fontOpenSansRegular = 'OpenSans-Regular';
const fontOpenSansSemiBold = 'OpenSans-SemiBold';

const BookScreen = ({ selectedCategory, setSelectedCategory, setSelectedScreen }) => {
    const dimensions = Dimensions.get('window');
    const [data, setData] = useState([]);


    useEffect(() => {
        if (selectedCategory === 'Traditions and customs') {
            setData(traditionsAndCustomsData);
        } else if (selectedCategory === 'Art and literature') {
            setData(artAndLiteratureData);
        } else if (selectedCategory === 'Music and dancing') {
            setData(musicAndDanceData);
        } else if (selectedCategory === 'Local cuisine') {
            setData(CuisineData);
        } else {
            setData([]);
        }
    }, [selectedCategory])


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



    return (
        <SafeAreaView style={{
            width: '100%',
        }}>
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
            <ScrollView style={{ width: '100%' }}>
                <View style={{
                    width: '100%',
                    marginBottom: dimensions.height * 0.25,
                    alignSelf: 'center',
                    paddingHorizontal: dimensions.width * 0.025,
                }}>


                    <Text style={{
                        marginTop: dimensions.height * 0.025,
                        fontFamily: fontOpenSansSemiBold,
                        fontWeight: 700,
                        textAlign: 'center',
                        alignSelf: 'center',
                        fontSize: dimensions.width * 0.05,
                        color: 'white',
                    }}>
                        Culture Da Madeira
                    </Text>


                    <View style={{
                        width: '85%',
                        flexDirection: 'row',
                        flexWrap: 'wrap',
                        justifyContent: 'space-between',
                        alignSelf: 'center',
                        marginTop: dimensions.height * 0.025,
                    }}>
                        {categoryButtons.map((button, index) => (
                            <TouchableOpacity
                                onPress={() => setSelectedCategory(button.title)}
                                key={index} style={{
                                    backgroundColor: '#111111',
                                    borderRadius: dimensions.width * 0.05,
                                    borderWidth: selectedCategory === button.title ? 1.6 : 0,
                                    borderColor: selectedCategory === button.title ? '#F15257' : 'transparent',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    width: '48%', 
                                    padding: dimensions.width * 0.035,
                                    marginBottom: dimensions.width * 0.04, 
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

                    {data.map((item, index) => (
                        <View key={index} style={{
                            width: '100%',
                            paddingHorizontal: dimensions.width * 0.037,
                            alignSelf: 'center',
                        }}>
                            <Text
                                style={{
                                    fontFamily: fontOpenSansBold,
                                    textAlign: "left",
                                    fontSize: dimensions.width * 0.05,
                                    paddingVertical: dimensions.height * 0.014,
                                    alignSelf: 'flex-start',
                                    fontWeight: 700,
                                    color: 'white',

                                }}
                            >
                                {item.title}
                            </Text>
                            <Text
                                style={{
                                    fontFamily: fontOpenSansBold,
                                    textAlign: "left",
                                    fontSize: dimensions.width * 0.04,
                                    alignSelf: 'flex-start',
                                    fontWeight: 400,
                                    color: 'white',

                                }}
                            >
                                {item.text}
                            </Text>

                            <Image
                                source={item.image}
                                style={{
                                    width: '100%',
                                    height: dimensions.height * 0.21,
                                    borderRadius: dimensions.width * 0.05,
                                    marginTop: dimensions.height * 0.025,
                                    marginBottom: dimensions.height * 0.016,
                                }}
                                resizeMode="stretch"
                            />
                        </View>


                    ))}
                    <View style={{
                        width: '91%',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        alignSelf: 'center',
                        marginTop: dimensions.height * 0.05,
                    }}>
                        <TouchableOpacity
                            onPress={() => setSelectedScreen('Home')}
                            style={{
                                padding: dimensions.width * 0.04,
                                backgroundColor: '#F15257',
                                borderRadius: dimensions.width * 0.055,
                            }}>
                            <Image
                                source={require('../assets/icons/homeAboutIcon.png')}
                                style={{
                                    width: dimensions.width * 0.055,
                                    height: dimensions.width * 0.055,
                                    textAlign: 'center',
                                }}
                                resizeMode="contain"
                            />
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => shareText(selectedCategory)}

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
                                    fontSize: dimensions.width * 0.046,

                                    alignSelf: 'center',
                                    fontWeight: 700,
                                    color: 'white',


                                }}
                            >
                                Share This
                            </Text>
                        </TouchableOpacity>


                        <TouchableOpacity
                            onPress={() => {
                                Alert.alert('Thanks', 'You liked this info');
                            }}
                            style={{
                                padding: dimensions.width * 0.04,
                                backgroundColor: '#F15257',
                                borderRadius: dimensions.width * 0.055,
                            }}>
                            <Image
                                source={require('../assets/icons/heartIcon.png')}
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


            </ScrollView>


            <View style={{
                width: '85%',
                flexDirection: 'row',
                alignSelf: 'center',
                marginTop: dimensions.height * 0.025,
            }}>



            </View>
        </SafeAreaView>
    )
}

export default BookScreen