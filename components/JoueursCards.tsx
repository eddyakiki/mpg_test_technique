import { View, Text ,PixelRatio,TouchableOpacity, Image } from 'react-native'
import React from 'react'
import {useNavigation} from '@react-navigation/native'
import { JoueursScreenNavigationProp } from '../screens/PlayersScreen';
import {Card} from '@rneui/themed'


// Définition du type des props attendues par le composant JoueursCards
type Props = {
    playerId:string;
    firstName:string;
    lastName:string;
    position:number;
    ultraPosition:number;
    stats:Stats;
    clubId:string;
    defaultJerseyUrl:string;
    clubName:Name;
    clubShortName:string;
    };

const JoueursCards = ({playerId,firstName,lastName,position,ultraPosition,stats,clubId,clubName,clubShortName,defaultJerseyUrl}:Props) => {
    // Utilisation du hook useNavigation pour naviguer entre les écrans
    const navigation = useNavigation<JoueursScreenNavigationProp>();

    //Utilisation de PixelRatio pour un FontSize adaptif
    const fontScale = PixelRatio.getFontScale();
    const getFontSize = (size: number) => size / fontScale;

    //correspondance des positions des joueurs
    const ultraPositionMap: {[key: number]: string} = {
        10: "Gardien - G",
        20: "Defenseur - D",
        21: "Lateral - L",
        30: "Milieu défensif - MD",
        31: "Milieu offensif - MO",
        40: "Attaquant - A",
      };

        return (
            // Le composant TouchableOpacity permet d'ouvrir la fiche détaillé du joueur lorsqu'on le touche
            <TouchableOpacity 
                onPress={()=>navigation.navigate('SinglePlayer',{
                    playerId:playerId,
                    firstName:firstName,
                    lastName:lastName,
                    position:position,
                    ultraPosition:ultraPosition,
                    stats:stats,
                    clubId:clubId,
                    defaultJerseyUrl:defaultJerseyUrl,
                    clubName:clubName,
                    clubShortName:clubShortName
                })}
                style={{
                    borderRadius: 5,
                    padding: 20,
                    backgroundColor: '#F2F2F2',
                    shadowColor: 'blue',
                    shadowOffset: {width: 0, height: 2},
                    shadowOpacity: 0.3,
                    shadowRadius: 3,
                    elevation: 5,
                    margin:7,
                }}
            >
                <Card containerStyle={{marginBottom:15}}>
                    <View style={{ flexDirection: 'row'}}>
                        <View style={{ flex: 1 }}>
                            <View style={{ flexDirection: 'row'}}>
                                <Text style={{ fontWeight: 'bold', fontSize: getFontSize(14) , color: 'black', flex: 1 , flexWrap: 'wrap' }}>{firstName} {lastName} </Text>
                            </View>
                            <View>
                                <Text style={{ color: 'rgb(33,211,63)' , flex: 1 , flexWrap: 'wrap'}}>{clubName['fr-FR']}</Text>
                                <Text style={{ color: 'rgb(33,211,63)', flex: 1 , flexWrap: 'wrap' }}>{ultraPositionMap[ultraPosition]}</Text>
                            </View>
                        </View>
                        <View>
                            <Image
                                style={{ width: 50, height: 50 ,  justifyContent: 'center'}}
                                source={{ uri: defaultJerseyUrl }}
                            />
                        </View>
                    </View>
                </Card>
            </TouchableOpacity>
        )
}


export default JoueursCards