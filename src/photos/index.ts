import aachenChapel from './aachen-chapel.jpg'
import abdication from './abdication.jpg'
import afsluitdijk from './afsluitdijk.jpg'
import ambiorixStatue from './ambiorix-statue.jpg'
import antwerpBourse from './antwerp-bourse.jpg'
import antwerpCathedral from './antwerp-cathedral.jpg'
import arnolfini from './arnolfini.jpg'
import arteveldeStatue from './artevelde-statue.jpg'
import beguinage from './beguinage.jpg'
import bonifaceFulda from './boniface-fulda.jpg'
import breydelStatue from './breydel-statue.jpg'
import brugesBelfry from './bruges-belfry.jpg'
import brusselsTownHall from './brussels-town-hall.jpg'
import charlemagneDurer from './charlemagne-durer.jpg'
import charlesBold from './charles-bold.jpg'
import charlesVTitian from './charles-v-titian.jpg'
import charlesVYoung from './charles-v-young.jpg'
import childericBees from './childeric-bees.jpg'
import chroniquesHainaut from './chroniques-hainaut.jpg'
import claudiusCivilis from './claudius-civilis.jpg'
import clovisBaptism from './clovis-baptism.jpg'
import courtraiChest from './courtrai-chest.jpg'
import cruquius from './cruquius.jpg'
import descentCross from './descent-cross.jpg'
import deurneHelmet from './deurne-helmet.jpg'
import dorestadBrooch from './dorestad-brooch.jpg'
import drielandenpunt from './drielandenpunt.jpg'
import erasmus from './erasmus.jpg'
import flood1953Map from './flood-1953-map.jpg'
import flood1953Rilland from './flood-1953-rilland.jpg'
import ghentAltarpiece from './ghent-altarpiece.jpg'
import ghentLamb from './ghent-lamb.jpg'
import goldenSpursChronicle from './golden-spurs-chronicle.jpg'
import gravensteen from './gravensteen.jpg'
import hansjeBrinker from './hansje-brinker.jpg'
import heerlenThermen from './heerlen-thermen.jpg'
import jacoba from './jacoba.jpg'
import kinderdijk from './kinderdijk.jpg'
import lelyStatue from './lely-statue.jpg'
import leoBelgicus from './leo-belgicus.jpg'
import leuvenTownHall from './leuven-town-hall.jpg'
import luttrellSheep from './luttrell-sheep.jpg'
import margaretAustria from './margaret-austria.jpg'
import maryBurgundy from './mary-burgundy.jpg'
import maryTomb from './mary-tomb.jpg'
import memlingJudgment from './memling-judgment.jpg'
import nancyBattle from './nancy-battle.jpg'
import nehalenniaAltar from './nehalennia-altar.jpg'
import oosterscheldekering from './oosterscheldekering.jpg'
import peutingerMap from './peutinger-map.jpg'
import philipGood from './philip-good.jpg'
import plagueTournai from './plague-tournai.jpg'
import polderBeemster from './polder-beemster.jpg'
import portRotterdam from './port-rotterdam.jpg'
import ridderzaal from './ridderzaal.jpg'
import sluysBattle from './sluys-battle.jpg'
import terBeurze from './ter-beurze.jpg'
import terpHogebeintum from './terp-hogebeintum.jpg'
import tongerenWall from './tongeren-wall.jpg'
import utrechtDom from './utrecht-dom.jpg'
import utrechtPsalter from './utrecht-psalter.jpg'
import vanEyckTurban from './van-eyck-turban.jpg'
import ypresClothHall from './ypres-cloth-hall.jpg'
import { credits } from './credits'
import type { PhotoId } from './ids'

export type { PhotoId } from './ids'

// Photos and maps from Wikimedia Commons, resized to 880 px and bundled with the app.
// Credits (author, licence, source page) live in credits.ts so tests can check them.
const files: Record<PhotoId, string> = {
  kinderdijk,
  'terp-hogebeintum': terpHogebeintum,
  'polder-beemster': polderBeemster,
  afsluitdijk,
  oosterscheldekering,
  'flood-1953-rilland': flood1953Rilland,
  'flood-1953-map': flood1953Map,
  cruquius,
  'port-rotterdam': portRotterdam,
  drielandenpunt,
  'lely-statue': lelyStatue,
  'hansje-brinker': hansjeBrinker,
  'ambiorix-statue': ambiorixStatue,
  'claudius-civilis': claudiusCivilis,
  'deurne-helmet': deurneHelmet,
  'tongeren-wall': tongerenWall,
  'heerlen-thermen': heerlenThermen,
  'nehalennia-altar': nehalenniaAltar,
  'peutinger-map': peutingerMap,
  'childeric-bees': childericBees,
  'clovis-baptism': clovisBaptism,
  'dorestad-brooch': dorestadBrooch,
  'boniface-fulda': bonifaceFulda,
  'aachen-chapel': aachenChapel,
  'charlemagne-durer': charlemagneDurer,
  'utrecht-psalter': utrechtPsalter,
  gravensteen,
  'bruges-belfry': brugesBelfry,
  beguinage,
  'luttrell-sheep': luttrellSheep,
  'ypres-cloth-hall': ypresClothHall,
  'ter-beurze': terBeurze,
  'golden-spurs-chronicle': goldenSpursChronicle,
  'courtrai-chest': courtraiChest,
  'breydel-statue': breydelStatue,
  'sluys-battle': sluysBattle,
  'artevelde-statue': arteveldeStatue,
  'plague-tournai': plagueTournai,
  ridderzaal,
  'utrecht-dom': utrechtDom,
  jacoba,
  'philip-good': philipGood,
  'chroniques-hainaut': chroniquesHainaut,
  'brussels-town-hall': brusselsTownHall,
  'leuven-town-hall': leuvenTownHall,
  'ghent-altarpiece': ghentAltarpiece,
  'ghent-lamb': ghentLamb,
  arnolfini,
  'van-eyck-turban': vanEyckTurban,
  'descent-cross': descentCross,
  'memling-judgment': memlingJudgment,
  'charles-bold': charlesBold,
  'nancy-battle': nancyBattle,
  'mary-burgundy': maryBurgundy,
  'mary-tomb': maryTomb,
  'antwerp-bourse': antwerpBourse,
  'antwerp-cathedral': antwerpCathedral,
  erasmus,
  'charles-v-young': charlesVYoung,
  'margaret-austria': margaretAustria,
  'leo-belgicus': leoBelgicus,
  'charles-v-titian': charlesVTitian,
  abdication,
}

export const photo = (id: PhotoId) => ({ src: files[id], ...credits[id] })
