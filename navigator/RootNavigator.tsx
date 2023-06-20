import { View, Text } from 'react-native'
import React from 'react'
import {createNativeStackNavigator} from '@react-navigation/native-stack'
import JoueursScreen from '../screens/PlayersScreen';
import SinglePlayerScreen from '../screens/SinglePlayerScreen';


// Définit le type des paramètres pour les différentes routes du stack de navigation
export type RootStackParamList = {
    Main : undefined;   // La route 'Main' n'a aucun paramètre
    SinglePlayer : {    playerId:string; //  paramètres du route SinglePlayer
                        firstName:string;
                        lastName:string;
                        position:number;
                        ultraPosition:number;
                        stats:Stats;
                        clubId:string;
                        defaultJerseyUrl:string;
                        clubName:Name;
                        clubShortName:string;}
                    }

// Crée un stack de navigation avec les types de paramètres définis précédemment
const RootStack = createNativeStackNavigator<RootStackParamList>();

const RootNavigator = () => {
  return (
    <RootStack.Navigator>
        <RootStack.Group>
            <RootStack.Screen name='Main' component={JoueursScreen}/>
        </RootStack.Group>

        <RootStack.Group screenOptions={{presentation:'fullScreenModal'}}>
            <RootStack.Screen options={{headerShown:false}} name='SinglePlayer' component={SinglePlayerScreen}/>
        </RootStack.Group>
        
    </RootStack.Navigator>
  )
}

export default RootNavigator