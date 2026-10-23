// The city explorer (plan: "City explorer"): seven old town centres drawn street by street
// from OpenStreetMap (src/data/cities/<city>.topo.json, built by scripts/maps/build.mjs),
// with landmarks to tap. Each landmark says what it is in a line or two; `photo` is one the
// course already credits, or one added for the city (src/content/cities.ts finds the unit
// whose lessons show it).
// The order of the landmarks is a walk through the centre. `bbox` is the map's extent,
// [south, west, north, east], as fetched.

import type { PhotoId } from '../photos/ids'

export type Landmark = { name: string; at: [number, number]; text: string; photo?: PhotoId }
export type City = {
  name: string
  // The name in the city's own language, where it differs.
  local?: string
  bbox: [number, number, number, number]
  intro: string
  landmarks: Record<string, Landmark>
  sources: { title: string; url: string }[]
}

const wiki = (title: string) => ({ title: `Wikipedia, ${title}`, url: `https://en.wikipedia.org/wiki/${title.replace(/ /g, '_')}` })

export const cities = {
  bruges: {
    name: 'Bruges',
    local: 'Brugge',
    bbox: [51.193, 3.205, 51.222, 3.25],
    intro: 'The great market of northern Europe around 1300, ringed by canals. When the Zwin silted up, trade moved to Antwerp and Bruges stood still, which is why so much of it survives.',
    landmarks: {
      'ter-beurze': {
        name: 'Huis ter Beurze',
        at: [3.22375, 51.21125],
        photo: 'ter-beurze',
        text: 'The inn of the Van der Buerse family, where merchants met. Their name gave the stock exchange its word: beurs, bourse, Börse. The building dates from 1453.',
      },
      belfry: {
        name: 'The Belfry',
        at: [3.22479, 51.20823],
        photo: 'bruges-belfry',
        text: 'Begun around 1240 above the market hall on the Markt; the eight-sided top came in the 1480s. 366 steps lead up to a carillon of 47 bells.',
      },
      burg: {
        name: 'The Burg',
        at: [3.2269, 51.2083],
        photo: 'bruges-town-hall',
        text: 'The square of the counts’ old castle. The Town Hall, built from 1376 to 1421, is one of the oldest in the Low Countries; in a corner, the Basilica of the Holy Blood keeps a relic carried through the town every year.',
      },
      stevin: {
        name: 'Simon Stevin',
        at: [3.22275, 51.20658],
        photo: 'stevin-statue',
        text: 'The statue of the engineer and mathematician born in Bruges in 1548, who taught decimal fractions to everyone in De Thiende.',
      },
      'our-lady': {
        name: 'The Church of Our Lady',
        at: [3.22448, 51.20463],
        photo: 'bruges-our-lady',
        text: 'Its brick tower, 115.6 m, is the third tallest brick church tower in the world. Inside is Michelangelo’s Madonna and Child, the only sculpture of his to leave Italy in his lifetime.',
      },
      'st-john': {
        name: 'St John’s Hospital',
        at: [3.22253, 51.20363],
        photo: 'ursula-shrine',
        text: 'A hospital founded in the 1100s, among the oldest hospital buildings left in Europe. Hans Memling’s Shrine of St Ursula, made for it in 1489, is still there.',
      },
      beguinage: {
        name: 'The Beguinage',
        at: [3.22302, 51.20109],
        photo: 'beguinage',
        text: 'Ten Wijngaerde, white houses round a green, founded about 1244 for beguines, single women of faith who took no lifelong vows. Benedictine nuns live there today.',
      },
    },
    sources: [wiki('Belfry of Bruges'), wiki('Bruges City Hall'), { title: 'Wikipedia (Dutch), Begijnhof (Brugge)', url: 'https://nl.wikipedia.org/wiki/Begijnhof_(Brugge)' }, wiki('Basilica of the Holy Blood'), wiki('Church of Our Lady, Bruges'), wiki("Old St. John's Hospital")],
  },
  ghent: {
    name: 'Ghent',
    local: 'Gent',
    bbox: [51.04, 3.7, 51.065, 3.745],
    intro: 'One of the great cloth towns of medieval Flanders, where the Leie meets the Scheldt, and the town where Charles V was born.',
    landmarks: {
      gravensteen: {
        name: 'The Gravensteen',
        at: [3.72077, 51.05718],
        photo: 'gravensteen',
        text: 'The Castle of the Counts, built in 1180 by Philip of Alsace, count of Flanders, on the site of an older fort.',
      },
      prinsenhof: {
        name: 'The Prinsenhof',
        at: [3.7168, 51.05833],
        photo: 'donkere-poort',
        text: 'The court where the counts of Flanders lived after the Gravensteen, and where Charles V was born in 1500. Only a gate, the Donkere Poort, is left.',
      },
      vrijdagmarkt: {
        name: 'The Friday Market',
        at: [3.72625, 51.05679],
        photo: 'artevelde-statue',
        text: 'One of the town’s old market squares. In the middle stands Jacob van Artevelde, who led Ghent from 1338 until he was killed in 1345, in a statue of 1863.',
      },
      graslei: {
        name: 'The Graslei',
        at: [3.72077, 51.05481],
        photo: 'graslei',
        text: 'A quay of guild houses and grain stores on the Leie, facing the Korenlei across the water. Both quays were the medieval port.',
      },
      belfry: {
        name: 'The Belfry',
        at: [3.72468, 51.05363],
        photo: 'ghent-belfry',
        text: 'Begun in 1313 to keep the charters of the town’s rights. A gilded dragon has watched over the town from the top since 1377.',
      },
      'st-bavo': {
        name: 'St Bavo’s Cathedral',
        at: [3.72716, 51.05298],
        photo: 'ghent-open',
        text: 'Home of the Ghent Altarpiece, the Adoration of the Mystic Lamb, by Hubert and Jan van Eyck. Charles V was baptised here.',
      },
      boekentoren: {
        name: 'The Book Tower',
        at: [3.72542, 51.04496],
        photo: 'boekentoren',
        text: 'Henry van de Velde’s library for the university, 64 m tall, built from 1936 to 1942.',
      },
    },
    sources: [wiki('Gravensteen'), wiki('Jacob van Artevelde'), wiki('Prinsenhof (Ghent)'), wiki('Graslei'), wiki('Belfry of Ghent'), wiki("St Bavo's Cathedral, Ghent"), wiki('Boekentoren')],
  },
  antwerp: {
    name: 'Antwerp',
    local: 'Antwerpen',
    bbox: [51.205, 4.385, 51.23, 4.425],
    intro: 'A port on the deep Scheldt that took over from Bruges around 1500 as the great market of northern Europe, until the Spanish took it in 1585.',
    landmarks: {
      steen: {
        name: 'Het Steen',
        at: [4.39742, 51.22277],
        photo: 'het-steen',
        text: 'Antwerp’s oldest building, a gatehouse of the castle on the Scheldt, built from 1200 to 1225.',
      },
      'town-hall': {
        name: 'The Town Hall',
        at: [4.39917, 51.22131],
        photo: 'antwerp-town-hall',
        text: 'Cornelis Floris’s Renaissance town hall on the Grote Markt, built from 1561 to 1565.',
      },
      cathedral: {
        name: 'The Cathedral of Our Lady',
        at: [4.40136, 51.22029],
        photo: 'antwerp-cathedral',
        text: 'Built from 1352 to 1521. Its tower, 123 m, is the tallest church tower in the Benelux, and Rubens’s Raising of the Cross and Descent from the Cross hang inside.',
      },
      plantin: {
        name: 'The Plantin-Moretus Museum',
        at: [4.39816, 51.2185],
        photo: 'plantin-press',
        text: 'Christophe Plantin’s printing house and home, with the two oldest printing presses left in the world. A UNESCO world heritage site since 2005.',
      },
      borromeus: {
        name: 'St Charles Borromeo',
        at: [4.40478, 51.22096],
        photo: 'borromeus',
        text: 'The Jesuits’ church, built from 1615 to 1621, with 39 ceiling paintings designed by Rubens. Lightning set it on fire in 1718 and they were lost.',
      },
      bourse: {
        name: 'The Exchange',
        at: [4.40616, 51.21934],
        photo: 'antwerp-bourse',
        text: 'Opened in 1531, the first building in the world put up for trading goods. Fire destroyed it twice; the hall of today was finished in 1872.',
      },
      rubenshuis: {
        name: 'The Rubens House',
        at: [4.40964, 51.21701],
        photo: 'rubenshuis',
        text: 'Rubens bought the house on the Wapper in 1610 and built his studio there. He died in it in 1640.',
      },
      central: {
        name: 'Antwerp Central',
        at: [4.42107, 51.21622],
        photo: 'antwerp-central',
        text: 'Louis Delacenserie’s station, opened in 1905. Its great dome earned it the name of the railway cathedral.',
      },
    },
    sources: [wiki('Het Steen'), wiki('Antwerp City Hall'), wiki('Cathedral of Our Lady (Antwerp)'), wiki('Plantin-Moretus Museum'), wiki('St. Charles Borromeo Church, Antwerp'), wiki('Antwerp Bourse'), wiki('Rubenshuis'), wiki('Antwerpen-Centraal railway station')],
  },
  brussels: {
    name: 'Brussels',
    local: 'Bruxelles, Brussel',
    bbox: [50.832, 4.335, 50.86, 4.385],
    intro: 'The dukes’ town on the Senne, the capital of the Burgundian and Habsburg Netherlands, of Belgium since 1830 and, in practice, of the European Union.',
    landmarks: {
      'grand-place': {
        name: 'The Grand-Place',
        at: [4.35241, 50.84673],
        photo: 'grand-place',
        text: 'The town hall was built in stages from 1401 to 1455. After the French bombardment of 1695 the guilds rebuilt their houses round it within four years. A UNESCO world heritage site since 1998.',
      },
      'manneken-pis': {
        name: 'Manneken Pis',
        at: [4.34999, 50.84499],
        photo: 'manneken-pis',
        text: 'Jérôme Duquesnoy the Elder’s little bronze fountain of 1619. The one on the corner is a copy; the original is in the Brussels City Museum.',
      },
      galeries: {
        name: 'The Royal Saint-Hubert Galleries',
        at: [4.35513, 50.84819],
        photo: 'galerie-reine',
        text: 'Glass-roofed shopping arcades by Jean-Pierre Cluysenaar, opened in 1847, among the first public covered galleries in Europe.',
      },
      cathedral: {
        name: 'The Cathedral of St Michael and St Gudula',
        at: [4.3601, 50.8479],
        photo: 'st-gudula',
        text: 'Gothic, built over some 300 years and finished just before 1519; its two towers date from 1470 to 1485. Royal weddings and state funerals are held here.',
      },
      cbbd: {
        name: 'The Comic Strip Center',
        at: [4.36018, 50.85125],
        photo: 'cbbd-hall',
        text: 'Victor Horta’s Art Nouveau department store of 1906, the Magasins Waucquez, a museum of Belgian comics since 1989.',
      },
      'congress-column': {
        name: 'The Congress Column',
        at: [4.36345, 50.85011],
        photo: 'congress-column',
        text: 'Raised from 1850 to 1859 for the National Congress of 1830 to 1831, which wrote Belgium’s constitution. The Tomb of the Unknown Soldier lies at its foot.',
      },
      'palace-nation': {
        name: 'The Palace of the Nation',
        at: [4.36486, 50.84692],
        photo: 'palace-nation',
        text: 'Built from 1778 to 1783 for the Council of Brabant; the Belgian federal parliament meets here.',
      },
      'royal-palace': {
        name: 'The Royal Palace',
        at: [4.36227, 50.84193],
        photo: 'royal-palace',
        text: 'The king’s official palace and office. The royal family lives at Laeken, in the north of the city.',
      },
      coudenberg: {
        name: 'The Coudenberg',
        at: [4.3591, 50.84228],
        photo: 'coudenberg-fire',
        text: 'Under the Place Royale lie the cellars of the palace of the dukes of Brabant and Burgundy, where Charles V gave up his crown in 1555. It burned down in 1731.',
      },
      'palace-justice': {
        name: 'The Palace of Justice',
        at: [4.35161, 50.83666],
        photo: 'palace-justice',
        text: 'Joseph Poelaert’s law courts, built from 1866 to 1883, said to be the largest building put up in the 1800s.',
      },
    },
    sources: [wiki('Grand-Place'), wiki('Manneken Pis'), wiki('Royal Galleries of Saint-Hubert'), wiki('St. Michael and St. Gudula Cathedral'), wiki('Belgian Comic Strip Center'), wiki('Congress Column'), wiki('Palace of the Nation'), wiki('Royal Palace of Brussels'), wiki('Palace of Coudenberg'), wiki('Palace of Justice, Brussels')],
  },
  amsterdam: {
    name: 'Amsterdam',
    bbox: [52.355, 4.87, 52.385, 4.92],
    intro: 'A port on the Amstel and the IJ that became the warehouse of the world in the 1600s, and laid out its ring of canals as it grew.',
    landmarks: {
      'royal-palace': {
        name: 'The Royal Palace',
        at: [4.89134, 52.37314],
        photo: 'dam-palace',
        text: 'Jacob van Campen’s town hall on the Dam, opened in 1655. It has been a royal palace since Louis Bonaparte moved in, in 1808.',
      },
      beurs: {
        name: 'The Beurs van Berlage',
        at: [4.89626, 52.37502],
        photo: 'beurs-berlage',
        text: 'Hendrik Petrus Berlage’s exchange, built from 1898 to 1903 in plain brick, a first step towards modern Dutch building.',
      },
      attic: {
        name: 'Our Lord in the Attic',
        at: [4.89929, 52.3751],
        photo: 'attic-church',
        text: 'A Catholic church hidden in the top three floors of a canal house from 1661 to 1663, when Catholics could not worship in public.',
      },
      'east-india': {
        name: 'East India House',
        at: [4.89788, 52.37088],
        photo: 'east-india-house',
        text: 'The headquarters of the Dutch East India Company, the VOC, from 1604.',
      },
      synagogue: {
        name: 'The Portuguese Synagogue',
        at: [4.90536, 52.36753],
        photo: 'synagogue',
        text: 'Built by Amsterdam’s Sephardic Jews from 1671 and opened in 1675. Its floor is still covered in sand.',
      },
      begijnhof: {
        name: 'The Begijnhof',
        at: [4.89004, 52.36943],
        photo: 'houten-huys',
        text: 'A courtyard of houses round a garden, home to beguines from the 1300s. Number 34, from about 1420, is the oldest wooden house in Amsterdam.',
      },
      'golden-bend': {
        name: 'The Golden Bend',
        at: [4.89001, 52.36609],
        photo: 'golden-bend',
        text: 'The grandest stretch of the Herengracht, between the Leidsestraat and the Vijzelstraat, where the richest families built double-width houses after 1663.',
      },
      'anne-frank': {
        name: 'The Anne Frank House',
        at: [4.88408, 52.37516],
        photo: 'anne-frank-house',
        text: 'Anne Frank, her family and four others hid in the back annex of Prinsengracht 263 for two years and a month, until they were found in August 1944.',
      },
      brouwersgracht: {
        name: 'The Brouwersgracht',
        at: [4.88371, 52.38316],
        photo: 'spout-gables',
        text: 'The brewers’ canal, named in 1594 for its breweries, and lined with warehouses with big shutters.',
      },
    },
    sources: [wiki('Royal Palace of Amsterdam'), wiki('Beurs van Berlage'), wiki('Our Lord in the Attic'), { title: 'Wikipedia (Dutch), Oost-Indisch Huis', url: 'https://nl.wikipedia.org/wiki/Oost-Indisch_Huis' }, wiki('Portuguese Synagogue (Amsterdam)'), wiki('Begijnhof, Amsterdam'), wiki('Golden Bend'), wiki('Anne Frank House'), wiki('Brouwersgracht')],
  },
  delft: {
    name: 'Delft',
    bbox: [51.998, 4.345, 52.02, 4.37],
    intro: 'A small canal town between The Hague and Rotterdam, where William of Orange lived and died, Vermeer painted, and potters made Delft blue.',
    landmarks: {
      'oude-kerk': {
        name: 'The Oude Kerk',
        at: [4.35591, 52.0126],
        photo: 'delft-oude-kerk',
        text: 'Delft’s oldest parish church, founded in 1246. Its 75 m brick tower leans about two metres, and Vermeer was buried here in 1675.',
      },
      prinsenhof: {
        name: 'The Prinsenhof',
        at: [4.35486, 52.01237],
        photo: 'prinsenhof-bullet-holes',
        text: 'An old convent where William of Orange lived. He was shot here on 10 July 1584, and the bullet holes are still in the wall.',
      },
      'town-hall': {
        name: 'The Town Hall',
        at: [4.3586, 52.01151],
        photo: 'delft-town-hall',
        text: 'Rebuilt by Hendrick de Keyser after a fire in 1618, round a medieval tower, Het Steen, from about 1300.',
      },
      'nieuwe-kerk': {
        name: 'The Nieuwe Kerk',
        at: [4.36072, 52.01229],
        photo: 'delft-nieuwe-kerk',
        text: 'William of Orange was buried here in 1584, and the House of Orange-Nassau ever since. Its tower, 108.75 m, is the second tallest church tower in the Netherlands.',
      },
      'little-street': {
        name: 'Vermeer’s Little Street',
        at: [4.36168, 52.01346],
        photo: 'little-street',
        text: 'Vlamingstraat 40 and 42, where historians found the houses of The Little Street in 2015. Vermeer’s aunt lived on the right, by a passage called the Tripe Gate.',
      },
      oostpoort: {
        name: 'The Oostpoort',
        at: [4.36847, 52.01087],
        photo: 'delft-oostpoort',
        text: 'The East Gate, from about 1400, the only one of Delft’s eight town gates still standing.',
      },
      view: {
        name: 'The View of Delft',
        at: [4.36055, 52.00463],
        photo: 'view-delft',
        text: 'Across the harbour from here Vermeer painted the south side of the town about 1660. Its gates were pulled down in the 1830s.',
      },
      'porceleyne-fles': {
        name: 'Royal Delft',
        at: [4.36687, 52.00149],
        photo: 'delftware',
        text: 'De Porceleyne Fles, founded in 1653, the only one of the 32 Delftware potteries of the 1600s still working.',
      },
    },
    sources: [wiki('Oude Kerk, Delft'), wiki('Delft City Hall'), wiki('Nieuwe Kerk (Delft)'), wiki('The Little Street'), { title: 'Wikipedia (Dutch), Oostpoort (Delft)', url: 'https://nl.wikipedia.org/wiki/Oostpoort_(Delft)' }, wiki('View of Delft'), wiki('Royal Delft')],
  },
  maastricht: {
    name: 'Maastricht',
    bbox: [50.835, 5.678, 50.857, 5.708],
    intro: 'A Roman crossing on the Maas, long ruled jointly by Brabant and the prince-bishop of Liège, and the town where the treaty founding the European Union was signed.',
    landmarks: {
      servatius: {
        name: 'The Basilica of St Servatius',
        at: [5.68739, 50.84899],
        photo: 'st-servatius',
        text: 'On the Vrijthof, built over the grave of Saint Servatius, said to have died in Maastricht in 384 and remembered as its first bishop.',
      },
      'town-hall': {
        name: 'The Town Hall',
        at: [5.69137, 50.85135],
        photo: 'maastricht-town-hall',
        text: 'Pieter Post’s town hall on the Markt, begun in 1659 by both the town’s lords, the States General and the prince-bishop of Liège.',
      },
      bridge: {
        name: 'The St Servatius Bridge',
        at: [5.69553, 50.8494],
        photo: 'servaasbrug',
        text: 'Built from 1280 to 1298 near the Roman crossing that gave the town its name; thought to be the oldest bridge in the Netherlands.',
      },
      'our-lady': {
        name: 'The Basilica of Our Lady',
        at: [5.69386, 50.8475],
        photo: 'maastricht-our-lady',
        text: 'A Romanesque church whose fortress-like west front dates from the early 1000s. Its statue of Mary, Star of the Sea, is carried through the town twice a year.',
      },
      helpoort: {
        name: 'The Helpoort',
        at: [5.69445, 50.84557],
        photo: 'helpoort',
        text: 'A gate from about 1230, the oldest town gate left in the Netherlands.',
      },
      dartagnan: {
        name: 'D’Artagnan',
        at: [5.68372, 50.8444],
        photo: 'dartagnan-statue',
        text: 'The statue of the real musketeer, killed at the siege of Maastricht on 25 June 1673, in a park by the old walls.',
      },
      gouvernement: {
        name: 'The Gouvernement',
        at: [5.70206, 50.83875],
        photo: 'gouvernement-maastricht',
        text: 'The provincial house of Limburg, partly on an island in the Maas. The Maastricht Treaty, which founded the European Union, was signed here on 7 February 1992.',
      },
    },
    sources: [wiki('Basilica of Saint Servatius'), wiki('Maastricht City Hall'), { title: 'Wikipedia (Dutch), Sint Servaasbrug', url: 'https://nl.wikipedia.org/wiki/Sint_Servaasbrug' }, wiki('Basilica of Our Lady, Maastricht'), { title: 'Wikipedia (Dutch), Helpoort (Maastricht)', url: 'https://nl.wikipedia.org/wiki/Helpoort_(Maastricht)' }, { title: 'Wikipedia (Dutch), Gouvernement aan de Maas', url: 'https://nl.wikipedia.org/wiki/Gouvernement_aan_de_Maas' }],
  },
} satisfies Record<string, City>

export type CityId = keyof typeof cities
export const cityIds = Object.keys(cities) as [CityId, ...CityId[]]
export const landmarkIds = (city: CityId) => Object.keys(cities[city].landmarks)
export const landmarkOf = (city: CityId, id: string): Landmark => (cities[city].landmarks as Record<string, Landmark>)[id]
