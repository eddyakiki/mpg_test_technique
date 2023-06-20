# MPG Test Technique

L'application a été développée avec React Native et TypeScript. Elle affiche une liste de joueurs de football et offre la possibilité d'effectuer des recherches parmi ces joueurs. Elle permet également d’afficher une fiche détaillée pour chaque joueur. L'interface utilisateur est entièrement adaptif, s'adaptant donc à toutes les tailles d'écran pour une expérience optimale sur tous les appareils.

## Comment exécuter l'application

Pour exécuter cette application sur votre machine locale, suivez les étapes ci-dessous :

1. **Clonez le dépôt**

2. **Naviguez dans le répertoire du projet**
3. **Installez les dépendances :** Installez les dépendances du projet en utilisant la commande suivante :
   ```npm install```
4. **Lancez l'application :** Assurez-vous d'avoir un émulateur Android ou iOS en cours d'exécution, ou un appareil connecté. Ensuite, pour lancer l'application, exécutez l'une des commandes suivantes :
   ```
   npm run android // Pour Android
   npm run ios // Pour iOS
   npm start
   ```
   Vous devriez maintenant voir l'application s'exécuter sur votre émulateur ou appareil connecté.

## Écran Joueurs (PlayersScreen)

Sur l'écran Joueurs, l'application affiche une liste de joueurs dans un composant `FlatList`. Cela optimise les performances, en particulier pour les grandes listes.

<img src="./resources/main.png" width="600" height="1000">

La liste des joueurs peut maintenant être filtrée en utilisant la barre de recherche située en haut de l'écran. Non seulement la recherche est insensible à la casse, permettant de rechercher soit par le nom du joueur soit par sa position, mais elle gère également des entrées avec des espaces multiples. J'ai également ajouté une gestion des erreurs afin d'assurer que la recherche est toujours efficace et précise. De plus, avant que les données ne soient rendues, un composant de chargement est affiché pour indiquer que les données sont en cours de récupération. Si aucune correspondance n'est trouvée pour la requête de recherche entrée, le message "Désolé, aucun résultat trouvé" s'affiche.

<img src="./resources/filtre_nom.png" width="600" height="1000">
<img src="./resources/filtre_position.png" width="600" height="1000">

Une fois que vous avez commencé à faire défiler la liste, un bouton apparaît en bas à droite pour vous permettre de revenir rapidement en haut de la page.

<img src="./resources/bouton_scroll.png" width="600" height="1000">

## Écran du Joueur Individuel (SinglePlayerScreen)

Lorsque vous cliquez sur un joueur dans la liste, vous êtes redirigé vers une fiche détaillée pour ce joueur. Cet écran affiche des informations supplémentaires sur le joueur, qui sont récupérées à partir de trois API.


<img src="./resources/fiche_det.png" width="600" height="1000">

## Cartes de Joueurs (JoueursCards)

Le composant JoueursCards est utilisé pour afficher les informations sur chaque joueur dans la liste sur l'écran Joueurs. Il affiche le nom du joueur, sa position, et l'image du maillot par défaut de leur club.

