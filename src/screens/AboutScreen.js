import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
  Dimensions,
  ScrollView,
  Image,
  Share,
  Alert
} from 'react-native';
import { ChevronLeftIcon,  } from 'react-native-heroicons/outline';
const fontOpenSansBold = 'OpenSans-Bold';



const sharingText = `Madeira is an archipelago located in the Atlantic Ocean, about 1,000 kilometers southwest of Portugal. The island of Madeira is the largest and most developed in the archipelago, and it’s often referred to as the "Island of Eternal Spring" due to its temperate climate throughout the year. The islands, which include Porto Santo, Desertas, and Selvagens, are volcanic in origin, boasting stunning landscapes filled with rugged mountains, deep valleys, and dense forests. The fertile soils and mild climate allow for the cultivation of a variety of crops, including sugar cane, bananas, and the famous Madeira wine grapes.
Madeira’s capital, Funchal, is a vibrant city known for its mix of modernity and traditional Portuguese charm. It is a hub for the island's economy and culture, home to beautiful gardens, historic churches, and the iconic Madeira Story Centre, a museum that tells the tale of the island's discovery and history. The region is renowned for its natural beauty and offers a wide range of outdoor activities such as hiking through its UNESCO-listed Laurisilva forests, exploring volcanic caves, or enjoying the scenic coastal views.

The Culture of Madeira
Madeira’s culture is deeply influenced by its historical ties to Portugal and its strategic location in the Atlantic. The island’s culture is a vibrant blend of local traditions, Portuguese heritage, and international influences, particularly from Africa and Europe. One of the most iconic aspects of Madeiran culture is its festivals. The Madeira Carnival, held each year in Funchal, is one of the most significant events on the island. It features colorful parades, lively samba dances, and vibrant costumes that attract tourists from all over the world. The Flower Festival celebrates the arrival of spring, transforming the island with colorful flower displays and showcasing traditional Madeiran art and performances.
In addition to its festivals, Madeira is also known for its local crafts. The island’s embroidery is world-famous, with intricate designs often found on tablecloths, napkins, and clothing. Basket weaving, using local materials like wicker and palm leaves, is another traditional craft that has been passed down through generations. These crafts reflect the island’s deep connection to nature and its artisanal history.
The island’s music and dance are another essential part of its culture. Madeiran folk music is characterized by lively rhythms and melodies, often accompanied by the sounds of accordion and tambourine. Fado, the melancholic Portuguese music style, also holds a special place in Madeira, often performed in intimate settings like taverns and cultural venues. Traditional Madeiran dance, such as the bailinho, is energetic and joyful, performed during festivals and gatherings.
Madeira’s culinary heritage also plays a vital role in its culture. The island’s Madeira wine is internationally renowned, with a unique flavor due to the fortification process and the specific climatic conditions of the region. The island’s cuisine is rich in local produce, with traditional dishes like espetada (grilled beef on skewers), scabbard fish with banana, and bolo do caco (a type of flatbread) offering a taste of the island’s unique flavors. The use of tropical fruits, especially bananas and passion fruit, is common in desserts and drinks.
In summary, Madeira is not only known for its breathtaking natural landscapes but also for its vibrant culture, which includes lively festivals, artistic traditions, rich music, and flavorful cuisine. The island’s culture is a beautiful reflection of its diverse history, making it a fascinating place to explore for anyone interested in both nature and tradition.`;


const AboutScreen = ({ setSelectedScreen }) => {
  const [dimensions, setDimensions] = useState(Dimensions.get('window'));


  const shareText = async () => {
    try {
      if (!sharingText) {
        Alert.alert('Error', 'No text to share');
        return;
      }
      await Share.share({
        message: `Read info about Madeira in Culture Da Madeira: ${sharingText}`,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  return (
    <SafeAreaView style={{
      marginBottom: 80,
      display: 'flex',
      alignSelf: 'center',
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
      <View style={{
        zIndex: 50,
        alignSelf: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        width: '95%',
        maxWidth: '95%'

      }}>
        <TouchableOpacity
          onPress={() => {
            setSelectedScreen('Home');
          }}
          style={{
            borderRadius: dimensions.width * 0.5,
            zIndex: 100,
            padding: dimensions.width * 0.04,
            paddingLeft: dimensions.width * 0.01,
            alignSelf: 'flex-start',
          }}>
          <ChevronLeftIcon size={dimensions.width * 0.07} color='white' />
        </TouchableOpacity>
        <Text
          style={{
            fontFamily: fontOpenSansBold,
            textAlign: "left",
            fontSize: dimensions.width * 0.055,
            alignSelf: 'center',
            fontWeight: 700,
            color: 'white',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: dimensions.width * 0.05,
            flexShrink: 1
          }}
        >
          General Information About Madeira
        </Text>
        <View>
          <Text></Text>
        </View>
      </View>

      <ScrollView style={{ width: '100%' }}>
        <View style={{
          width: '95%',
          marginBottom: dimensions.height * 0.16,
          alignSelf: 'center',
          paddingHorizontal: dimensions.width * 0.019,
        }}>
          <Text
            style={{
              fontFamily: fontOpenSansBold,
              textAlign: "left",
              fontSize: dimensions.width * 0.04,
              alignSelf: 'center',
              fontWeight: 400,
              color: 'white',
              marginTop: dimensions.height * 0.016,
            }}
          >
            {`Madeira is an archipelago located in the Atlantic Ocean, about 1,000 kilometers southwest of Portugal. The island of Madeira is the largest and most developed in the archipelago, and it’s often referred to as the "Island of Eternal Spring" due to its temperate climate throughout the year. The islands, which include Porto Santo, Desertas, and Selvagens, are volcanic in origin, boasting stunning landscapes filled with rugged mountains, deep valleys, and dense forests. The fertile soils and mild climate allow for the cultivation of a variety of crops, including sugar cane, bananas, and the famous Madeira wine grapes.
Madeira’s capital, Funchal, is a vibrant city known for its mix of modernity and traditional Portuguese charm. It is a hub for the island's economy and culture, home to beautiful gardens, historic churches, and the iconic Madeira Story Centre, a museum that tells the tale of the island's discovery and history. The region is renowned for its natural beauty and offers a wide range of outdoor activities such as hiking through its UNESCO-listed Laurisilva forests, exploring volcanic caves, or enjoying the scenic coastal views.`}
          </Text>
          <Image
            source={require('../assets/images/aboutImage.png')}
            style={{
              width: '100%',
              height: dimensions.height * 0.21,
              borderRadius: dimensions.width * 0.05,
              marginTop: dimensions.height * 0.025,
            }}
            resizeMode="stretch"
          />
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
            The Culture of Madeira
          </Text>
          <Text
            style={{
              fontFamily: fontOpenSansBold,
              textAlign: "left",
              fontSize: dimensions.width * 0.04,
              alignSelf: 'center',
              fontWeight: 400,
              color: 'white',


            }}
          >
            {`Madeira’s culture is deeply influenced by its historical ties to Portugal and its strategic location in the Atlantic. The island’s culture is a vibrant blend of local traditions, Portuguese heritage, and international influences, particularly from Africa and Europe. One of the most iconic aspects of Madeiran culture is its festivals. The Madeira Carnival, held each year in Funchal, is one of the most significant events on the island. It features colorful parades, lively samba dances, and vibrant costumes that attract tourists from all over the world. The Flower Festival celebrates the arrival of spring, transforming the island with colorful flower displays and showcasing traditional Madeiran art and performances.
In addition to its festivals, Madeira is also known for its local crafts. The island’s embroidery is world-famous, with intricate designs often found on tablecloths, napkins, and clothing. Basket weaving, using local materials like wicker and palm leaves, is another traditional craft that has been passed down through generations. These crafts reflect the island’s deep connection to nature and its artisanal history.
The island’s music and dance are another essential part of its culture. Madeiran folk music is characterized by lively rhythms and melodies, often accompanied by the sounds of accordion and tambourine. Fado, the melancholic Portuguese music style, also holds a special place in Madeira, often performed in intimate settings like taverns and cultural venues. Traditional Madeiran dance, such as the bailinho, is energetic and joyful, performed during festivals and gatherings.
Madeira’s culinary heritage also plays a vital role in its culture. The island’s Madeira wine is internationally renowned, with a unique flavor due to the fortification process and the specific climatic conditions of the region. The island’s cuisine is rich in local produce, with traditional dishes like espetada (grilled beef on skewers), scabbard fish with banana, and bolo do caco (a type of flatbread) offering a taste of the island’s unique flavors. The use of tropical fruits, especially bananas and passion fruit, is common in desserts and drinks.
In summary, Madeira is not only known for its breathtaking natural landscapes but also for its vibrant culture, which includes lively festivals, artistic traditions, rich music, and flavorful cuisine. The island’s culture is a beautiful reflection of its diverse history, making it a fascinating place to explore for anyone interested in both nature and tradition.`}
          </Text>




          <View style={{
            width: '100%',
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
              onPress={() => shareText()}

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

    </SafeAreaView>
  );
};

export default AboutScreen;
