type JerseyYear = {
    [key: string]: string;
  }
  
  type Championship = {
    jerseys: JerseyYear;
    active: boolean;
  }
  
  type Championships = {
    [key: string]: Championship;
  }
  
  type Name = {
    "fr-FR": string;
    "en-GB": string;
    "es-ES": string;
  }
  
  type Club = {
    championships: Championships;
    id: string;
    name: Name;
    shortName: string;
    defaultJerseyUrl: string;
    defaultAssets: any;
  }
  
  type ChampionshipClubs = {
    [key: string]: Club;
  }
  
  type RootObjectClubs = {
    championshipClubs: ChampionshipClubs;
  }

  type Stats = {
    averageRating: number;
    totalGoals: number;
    totalMatches: number;
    totalStartedMatches: number;
    totalPlayedMatches: number;
  }
  
  type PoolPlayer = {
    id: string;
    firstName: string;
    lastName: string;
    position: number;
    ultraPosition: number;
    quotation: number;
    clubId: string;
    stats: Stats;
  }

  type PoolPlayers ={
    [key:string]:PoolPlayer;
  }
  
  type RootObjectPlayers = {
    poolPlayers: PoolPlayer[];
  }
  
  type PlayerWithClub={
    id: string;
    firstName: string;
    lastName: string;
    position: number;
    ultraPosition: number;
    quotation: number;
    clubId: string;
    stats: Stats;
    defaultJerseyUrl: string;
    clubName: Name;
    clubShortName: string;
  }

  type PlayersWithClubs = {
    [key:string]: PlayerWithClub[];
  } 
  
  type RootObjectPlayersWithClubs = {
    playersWithClubs: PlayerWithClub[];
  }