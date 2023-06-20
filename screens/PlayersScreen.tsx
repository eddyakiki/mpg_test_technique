import { SafeAreaView,TouchableOpacity, Animated,Dimensions,Image,FlatList, View,StatusBar } from 'react-native';
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
    
            // Wrap playersWithClub in an object with key 'playersWithClubs'
            setFilteredData({playersWithClubs: playersWithClub});
            setFullData({playersWithClubs: playersWithClub});
            
        } catch (error) {
            console.error(`Fetch and processing failed: ${error}`);
        }
    }

    // Référence pour le composant ScrollView
    const scrollViewRef = useRef<FlatList>(null);
    
    // Fonction pour défiler jusqu'en haut de l'écran
    const scrollToTop = () => {
      scrollViewRef.current?.scrollToOffset({ offset: 0, animated: true });
    }


    // Filtrage des joueurs en fonction de l'entrée de recherche

    const handleSearch = (query:string) =>{
      setSearchInput(query);
      let result;
      const filteredPlayers = fullData?.playersWithClubs?.filter((player) => {
        const firstName = player.firstName?.toLowerCase().replace(/[^\w\s]/gi, '');
        const lastName = player.lastName.toLocaleLowerCase().replace(/[^\w\s]/gi, '');
        const position = ultraPositionMap[player.ultraPosition].toLowerCase();
        const cleanedInput = query.toLowerCase().replace(/[^\w\s]/gi, '');
        
        return firstName?.includes(cleanedInput) || lastName.includes(cleanedInput) || position.includes(cleanedInput);
    });
  
        result = { playersWithClubs: filteredPlayers || [] };
        setFilteredData(result);     
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
/>

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