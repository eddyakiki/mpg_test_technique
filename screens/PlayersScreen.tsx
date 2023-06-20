import { SafeAreaView,TouchableOpacity, Animated,Dimensions,Image,FlatList, View,StatusBar,Text } from 'react-native';
import React, { FunctionComponent, useLayoutEffect, useState, useEffect,useRef } from 'react';
import { useNavigation} from '@react-navigation/native';
import { RootStackParamList } from '../navigator/RootNavigator';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import JoueursCards from '../components/JoueursCards';
import { TextInput } from "@react-native-material/core";
import Icon from 'react-native-vector-icons/Ionicons';


export type JoueursScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>


const JoueursScreen:FunctionComponent = () => {

    // Initialisation de l'objet de navigation
    const navigation = useNavigation<JoueursScreenNavigationProp>();
    // state pour l'entrée de recherche
    const [searchInput, setSearchInput] = useState<string>('');
    // state pour les données des joueurs et des clubs
    const [fullData,setFullData] = useState<RootObjectPlayersWithClubs | null>(null);
    // state pour les donnés filtrées
    const [filteredData,setFilteredData] = useState<RootObjectPlayersWithClubs | null>(null);
    // Référence pour le défilement de l'écran
    const scrollY = useRef(new Animated.Value(0)).current;
    const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);
    // State pour vérifier si les données sont toujours en cours de récupération
    const [loading, setLoading] = useState<boolean>(true);


    // Définition de l'opacité du bouton en fonction du défilement de l'écran
    const buttonOpacity = scrollY.interpolate({
        inputRange: [0, Dimensions.get('window').height/2, Dimensions.get('window').height],
        outputRange: [0, 0, 1],
        extrapolate: 'clamp',
    });

    //Mapping des positions
    const ultraPositionMap: {[key: number]: string} = {
        10: "Gardien - G",
        20: "Defenseur - D",
        21: "Lateral - L",
        30: "Milieu défensif - MD",
        31: "Milieu offensif - MO",
        40: "Attaquant - A",
      };

    // Mise à jour de l'option de navigation pour cacher l'en-tête
    useLayoutEffect(() => {
        navigation.setOptions({
          headerShown: false,
        });
      }, []);

    // Appel de l'API
    useEffect(() => {
      fetchPlayerData().catch(error => console.error(error));
    }, []);
      
      // Fonction pour récupérer les données des joueurs et des clubs
      const fetchPlayerData = async () => {
        try {
            setLoading(true);
            const [playersRes, clubsRes] = await Promise.all([
                fetch('https://api.mpg.football/api/data/championship-players-pool/1'),
                fetch('https://api.mpg.football/api/data/championship-clubs'),
            ]);
    
            if (!playersRes.ok || !clubsRes.ok) {
                throw new Error(`HTTP error! status: ${playersRes.status}, ${clubsRes.status}`);
            }
    
            const playersJson: RootObjectPlayers = await playersRes.json();
            const clubsJson: RootObjectClubs = await clubsRes.json();
        
            const playersWithClub: PlayerWithClub[] = Object.values(playersJson.poolPlayers).map((player: PoolPlayer) => {
                const club: Club = clubsJson.championshipClubs[player.clubId];
                if (!club) {
                    throw new Error(`No club found with id: ${player.clubId}`);
                }
                return {
                    ...player,
                    defaultJerseyUrl: club.defaultJerseyUrl,
                    clubName: club.name,
                    clubShortName: club.shortName
                }
            });
    
            //Pour chaque joueur on ajoute les infos suivants: nom de son club, le nom court de son club, lien vers l'image du maillot de son club, en se basant sur clubId
            setFilteredData({playersWithClubs: playersWithClub});
            setFullData({playersWithClubs: playersWithClub});
            setLoading(false);
            
        } catch (error) {
            console.error(`Fetch and processing failed: ${error}`);
            setLoading(false);
        }
    }

    // Référence pour le composant ScrollView
    const scrollViewRef = useRef<FlatList>(null);
    
    // Fonction pour défiler jusqu'en haut de l'écran
    const scrollToTop = () => {
      scrollViewRef.current?.scrollToOffset({ offset: 0, animated: true });
    }


    
    // Filtrage des joueurs en fonction de l'entrée de recherche
      const handleSearch = (query:string) => {
        try {
            setSearchInput(query);
            let result;
        
            const cleanedInput = query.trim().toLowerCase().replace(/\s+/g, ' ');
        
            const filteredPlayers = fullData?.playersWithClubs?.filter((player) => {
                const firstName = player.firstName?.toLowerCase().replace(/\s+/g, ' ');
                const lastName = player.lastName?.toLowerCase().replace(/\s+/g, ' ');
                const fullName = `${firstName} ${lastName}`;
                const reverseFullName = `${lastName} ${firstName}`;
                const position = ultraPositionMap[player.ultraPosition]?.toLowerCase();
      
                //Cherche si le textInput fait partie d'un nom, prenom, nom complet, nom a l'inverse, ou position
                return fullName.includes(cleanedInput) || reverseFullName.includes(cleanedInput) || firstName?.includes(cleanedInput) || lastName.includes(cleanedInput) || position?.includes(cleanedInput);
            });
        
            result = { playersWithClubs: filteredPlayers || [] };
            setFilteredData(result);     
        } catch (error) {
            console.error("An error occurred during search: ", error);
        }
      };



    
    
    

    return (
      <>
      <StatusBar backgroundColor="#000" barStyle="light-content" />
      <SafeAreaView style={{ flex: 1, backgroundColor: '#000' }}>
                      <View style={{ width: '100%', alignItems: 'center' }}>
                <Image style={{ width: '50%', aspectRatio: 1 ,margin:10}} source={{uri:'https://github.com/eddyakiki/technical_resources/blob/main/football_field_logo_1.png?raw=true'}}/>
              </View>
              <View>
                <TextInput 
                  variant="standard" 
                  style={{ margin: 16 }}
                  placeholder='Chercher'
                  value={searchInput}
                  onChangeText={(query:string)=>handleSearch(query)}
                  color='rgb(33,211,63)'
                  inputStyle={{color:'rgb(33,211,63)'}}
                />
              </View>
              {loading && <Text style={{color:'rgb(33,211,63)', flex:1,flexWrap:'wrap',textAlign:'center'}}>Chargement...</Text>}
              {!loading && (filteredData?.playersWithClubs?.length || 0) === 0 && <Text style={{color:'rgb(33,211,63)', flex:1,flexWrap:'wrap',textAlign:'center'}}>Désolé, aucun résultat trouvé.</Text>}
              {!loading && (filteredData?.playersWithClubs?.length || 0) > 0 && 
              <AnimatedFlatList
  ref={scrollViewRef}
  data={filteredData?.playersWithClubs}
  onScroll={Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    { useNativeDriver: true }
  )}
  ListHeaderComponent={
    <></>
  }
  renderItem={({ item, index }: { item: PlayerWithClub; index: number }) => (
    <JoueursCards
      key={index}
      playerId={item.id}
      firstName={item.firstName}
      lastName={item.lastName}
      ultraPosition={item.ultraPosition}
      position={item.position}
      clubId={item.clubId}
      stats={item.stats}
      clubName={item.clubName}
      clubShortName={item.clubShortName}
      defaultJerseyUrl={item.defaultJerseyUrl}
    />
  )}
  keyExtractor={(item: PlayerWithClub, index) => item.id + index.toString()}
/>}

        <Animated.View
          style={{
            opacity: buttonOpacity,
            position: 'absolute',
            right: Dimensions.get('window').width * 0.05,
            bottom: Dimensions.get('window').height * 0.05,
            width: 50,
            height: 50,
            borderRadius: 25,
            backgroundColor: '#000',
            justifyContent: 'center',
            alignItems: 'center',
            shadowColor: '#000',
            shadowOffset: {
                width: 0,
                height: 1,
            },
            shadowOpacity: 0.22,
            shadowRadius: 2.22,
            elevation: 3,
          }}
        >
          <TouchableOpacity onPress={scrollToTop} style={{width:'50%',height:'50%',flex:1,alignContent:'center',justifyContent:'center'}}>
            <Icon name="arrow-up" size={24} color="rgb(33,211,63)" />
          </TouchableOpacity>
        </Animated.View>
      </SafeAreaView>
      </>
    );
}

export default JoueursScreen
