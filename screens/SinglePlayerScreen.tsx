import { View, Text, TouchableOpacity, Image, StyleSheet, Dimensions, ScrollView, SafeAreaView } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Icon as ThemedIcon } from '@rneui/themed';
import { RootStackParamList } from '../navigator/RootNavigator';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation, RouteProp, useRoute } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Entypo from 'react-native-vector-icons/Entypo';


// Définition des types pour la navigation et la route
type SinglePlayerScreenNavigationProp =  NativeStackNavigationProp<RootStackParamList, 'SinglePlayer'>;

type SingleScreenRouteProp = RouteProp<RootStackParamList,'SinglePlayer'>

const SinglePlayerScreen = () => {

// Définition des icônes pour les cartes
  const icons = [
    {name: 'strategy', type: 'MaterialCommunityIcons', size: Dimensions.get('window').width * 0.04 },
    {name: 'progress-star', type: 'MaterialCommunityIcons', size: Dimensions.get('window').width * 0.04 },
    {name: 'sports-club', type: 'Entypo', size: Dimensions.get('window').width * 0.04 },
    {name: 'soccer-field', type: 'MaterialCommunityIcons', size: Dimensions.get('window').width * 0.04 },
    {name: 'calendar', type: 'MaterialCommunityIcons', size: Dimensions.get('window').width * 0.04 },
    {name: 'soccer', type: 'MaterialCommunityIcons', size: Dimensions.get('window').width * 0.04 },
    {name: 'run-fast', type: 'MaterialCommunityIcons', size: Dimensions.get('window').width * 0.04 },
    {name: 'play', type: 'MaterialCommunityIcons', size: Dimensions.get('window').width * 0.04 }
  ];


    // Utilisation du useState pour les données du joueur
    const [playerData,setPlayerData] = useState<any>(null);
    // Initialisation des hooks de navigation et de route
    const navigation = useNavigation<SinglePlayerScreenNavigationProp>();
    //Paramètres infos du joueur 
    const {params: {firstName,lastName,ultraPosition,playerId,defaultJerseyUrl,stats,clubName,clubId}} = useRoute<SingleScreenRouteProp>()

    // Correspondance pour les positions
    const ultraPositionMap: {[key: number]: string} = {
        10: "Gardien - G",
        20: "Defenseur - D",
        21: "Lateral - L",
        30: "Milieu défensif - MD",
        31: "Milieu offensif - MO",
        40: "Attaquant - A",
      };

    // Appel de l'API
    useEffect(()=>{
        getPlayerDetails(playerId).catch(error => console.error(error));;
    },[]);

    // Fonction pour récupérer les détails du joueur depuis l'API
    const getPlayerDetails = async (playerId: string) => {
      try {
          const response = await fetch(`https://api.mpg.football/api/data/championship-player-stats/${playerId}/2022`, {
              method: 'GET',
              headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json',
              },
          });
    
          if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
          }
  
          const json = await response.json();
  
          setPlayerData(json);
      } catch (error) {
          console.error(`Failed to fetch player details: ${error}`);
      }
  }
  

    // Données pour afficher les détails du joueur
    const data = [
      {title: 'Position', value: ultraPositionMap[ultraPosition]},
      {title: 'Note Moyenne', value: stats['averageRating']?.toFixed(2)},
      {title: 'Club', value: clubName['fr-FR']},
      {title: 'Total de Matchs', value: playerData?.championships[1]?.total?.matches?.length},
      {title: "Date d'adhésion au club", value: playerData?.championships[1][clubId]?.joinDate},
      {title: 'Total des Buts', value: stats['totalGoals']},
      {title: 'Matchs Joués', value: stats['totalPlayedMatches']},
      {title: 'Matchs commencés', value: stats['totalStartedMatches']},
    ];

    return (
      <LinearGradient
      colors={['#FFFFFF', 'rgb(226,226,226)']} 
      style={styles.container}>
      <SafeAreaView style={styles.container}>
        <TouchableOpacity onPress={navigation.goBack} style={styles.closeIcon}>
            <ThemedIcon name='closecircle' type='antdesign' size={24}/>
        </TouchableOpacity>
        <ScrollView contentContainerStyle={styles.contentContainer}>
          <Text style={styles.playerName}>{firstName} {lastName}</Text>
          <Image source={{uri: defaultJerseyUrl}} style={styles.playerImage} />
          <View style={styles.cardsContainer}>
            {data.map((item, index) => (
              <View key={item.title} style={styles.card}>
                <Text style={styles.title}>{item.title}</Text>
                <View style={styles.iconContainer}>
                  {icons[index % icons.length].type === 'MaterialCommunityIcons' ? 
                    <MaterialCommunityIcons name={icons[index % icons.length].name} size={icons[index % icons.length].size} color="#fff"/>
                  :
                    <Entypo name={icons[index % icons.length].name} size={icons[index % icons.length].size}color="#fff"/>
                  }
                </View>
                <Text style={styles.info}>{item.value}</Text>
              </View>
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
    )
    
    
    
}

const styles = StyleSheet.create({

  // Conteneur principal
  container: {
    flex: 1,
    width:'100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Icone de fermeture
  closeIcon: {
    position: 'absolute',
    top: Dimensions.get('window').height * 0.05, 
    right: Dimensions.get('window').width * 0.05, 
    zIndex: 1,
  },
  // Conteneur du contenu
  contentContainer: {
    padding: Dimensions.get('window').width * 0.05, 
    alignItems: 'center',
    width: '100%',
  },
  // Nom du joueur
  playerName: {
    fontSize: Dimensions.get('window').width * 0.05,
    marginVertical: Dimensions.get('window').height * 0.02,
    textAlign: 'center', 
    alignSelf: 'center',
    maxWidth: '90%',
  },
  // Image du joueur
  playerImage: {
    width: Dimensions.get('window').width * 0.6,
    height: Dimensions.get('window').width * 0.6, 
    marginVertical: Dimensions.get('window').height * 0.02, 
  },
  // Conteneur pour les cartes d'infos'
  cardsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around'
  },
  // Style pour chaque carte
  card: {
    backgroundColor: 'rgb(55,172,67)',
    width: Dimensions.get('window').width * 0.4,
    height: Dimensions.get('window').height * 0.12,
    borderRadius: 10,
    padding: 10,
    margin: 5,
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    elevation: 10,
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.30, 
    shadowRadius: 4, 
  },
  // Style pour les infos dans chaque carte
  info: {
    fontSize: Dimensions.get('window').width * 0.04,
    color: '#fff',
  },
  // Conteneur du titre et l'icone
  titleAndIconContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
    // Style pour le titre dans chaque carte
  title: {
    fontSize: Dimensions.get('window').width * 0.03,
    color: '#fff',
    fontWeight: 'bold',
    paddingRight: 30,
  },
  // Conteneur pour l'icone
  iconContainer: {
    position: 'absolute',
    top: 10,
    right: 10,
    paddingLeft:10
  },
});






export default SinglePlayerScreen
