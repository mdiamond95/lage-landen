import afLekker from './af-lekker.mp3'
import brabanconne from './brabanconne.mp3'
import deHallo from './de-hallo.mp3'
import frBe71 from './fr-be-71.mp3'
import frBruxelles from './fr-bruxelles.mp3'
import fyBoalsert from './fy-boalsert.mp3'
import fyFryslan from './fy-fryslan.mp3'
import fyHarns from './fy-harns.mp3'
import fyLjouwert from './fy-ljouwert.mp3'
import fySnits from './fy-snits.mp3'
import fyStarum from './fy-starum.mp3'
import gezelligHard from './gezellig-hard.mp3'
import gezelligSoft from './gezellig-soft.mp3'
import kiek1944 from './kiek-1944.mp3'
import lbMoien from './lb-moien.mp3'
import liIch from './li-ich.mp3'
import liVastelaovend from './li-vastelaovend.mp3'
import nlAlsjeblieft from './nl-alsjeblieft.mp3'
import nlAlstublieft from './nl-alstublieft.mp3'
import nlBedankt from './nl-bedankt.mp3'
import nlBrussel from './nl-brussel.mp3'
import nlBrusselWoon from './nl-brussel-woon.mp3'
import nlDankJeWel from './nl-dank-je-wel.mp3'
import nlDoei from './nl-doei.mp3'
import nlEetSmakelijk from './nl-eet-smakelijk.mp3'
import nlFiets from './nl-fiets.mp3'
import nlFrieten from './nl-frieten.mp3'
import nlGezellig from './nl-gezellig.mp3'
import nlGezondheid from './nl-gezondheid.mp3'
import nlGoedemorgen from './nl-goedemorgen.mp3'
import nlGoedenavond from './nl-goedenavond.mp3'
import nlGoedendag from './nl-goedendag.mp3'
import nlGoesting from './nl-goesting.mp3'
import nlHallo from './nl-hallo.mp3'
import nlJammer from './nl-jammer.mp3'
import nlKoekje from './nl-koekje.mp3'
import nlLekker from './nl-lekker.mp3'
import nlPardon from './nl-pardon.mp3'
import nlPatat from './nl-patat.mp3'
import nlProost from './nl-proost.mp3'
import nlScheveningen from './nl-scheveningen.mp3'
import nlSinterklaas from './nl-sinterklaas.mp3'
import nlSorry from './nl-sorry.mp3'
import nlStroopwafel from './nl-stroopwafel.mp3'
import nlTotZiens from './nl-tot-ziens.mp3'
import nlTwintigMinuten from './nl-twintig-minuten.mp3'
import nlUitwaaien from './nl-uitwaaien.mp3'
import nlWelterusten from './nl-welterusten.mp3'
import pcdPigs from './pcd-pigs.mp3'
import vlsTaele from './vls-taele.mp3'
import waBondjou from './wa-bondjou.mp3'
import waLidje from './wa-lidje.mp3'
import waOutremeuse from './wa-outremeuse.mp3'
import waSeptante from './wa-septante.mp3'
import wilhelmina1940 from './wilhelmina-1940.mp3'
import wilhelmus1899 from './wilhelmus-1899.mp3'
import wilhelmusCarillon from './wilhelmus-carillon.mp3'
import nlGouda from './nl-gouda.mp3'
import nlEdammer from './nl-edammer.mp3'
import nlHutspot from './nl-hutspot.mp3'
import nlOliebol from './nl-oliebol.mp3'
import nlJenever from './nl-jenever.mp3'
import nlWaterzooi from './nl-waterzooi.mp3'
import nlLambiek from './nl-lambiek.mp3'
import nlRijsttafel from './nl-rijsttafel.mp3'
import nlSpeculaas from './nl-speculaas.mp3'
import nlSinterklaasSong from './nl-sinterklaas-song.mp3'
import { soundCredits } from './credits'
import type { SoundId } from './ids'

export type { SoundId } from './ids'

// Recordings from Wikimedia Commons, cut and evened out on the runner (scripts/photos/fetch.py).
const files: Record<SoundId, string> = {
  'gezellig-hard': gezelligHard,
  'gezellig-soft': gezelligSoft,
  'fy-ljouwert': fyLjouwert,
  'fy-snits': fySnits,
  'fy-harns': fyHarns,
  'fy-starum': fyStarum,
  'fy-boalsert': fyBoalsert,
  'fy-fryslan': fyFryslan,
  'li-ich': liIch,
  'li-vastelaovend': liVastelaovend,
  'vls-taele': vlsTaele,
  'wa-bondjou': waBondjou,
  'wa-lidje': waLidje,
  'wa-outremeuse': waOutremeuse,
  'wa-septante': waSeptante,
  'pcd-pigs': pcdPigs,
  'lb-moien': lbMoien,
  'de-hallo': deHallo,
  'fr-be-71': frBe71,
  'fr-bruxelles': frBruxelles,
  'nl-brussel': nlBrussel,
  'nl-scheveningen': nlScheveningen,
  'af-lekker': afLekker,
  'nl-lekker': nlLekker,
  'nl-goedemorgen': nlGoedemorgen,
  'nl-goedendag': nlGoedendag,
  'nl-goedenavond': nlGoedenavond,
  'nl-welterusten': nlWelterusten,
  'nl-hallo': nlHallo,
  'nl-doei': nlDoei,
  'nl-tot-ziens': nlTotZiens,
  'nl-dank-je-wel': nlDankJeWel,
  'nl-bedankt': nlBedankt,
  'nl-alstublieft': nlAlstublieft,
  'nl-alsjeblieft': nlAlsjeblieft,
  'nl-sorry': nlSorry,
  'nl-pardon': nlPardon,
  'nl-gezondheid': nlGezondheid,
  'nl-proost': nlProost,
  'nl-eet-smakelijk': nlEetSmakelijk,
  'nl-jammer': nlJammer,
  'nl-uitwaaien': nlUitwaaien,
  'nl-goesting': nlGoesting,
  'nl-frieten': nlFrieten,
  'nl-patat': nlPatat,
  'nl-stroopwafel': nlStroopwafel,
  'nl-fiets': nlFiets,
  'nl-koekje': nlKoekje,
  'nl-sinterklaas': nlSinterklaas,
  'nl-gezellig': nlGezellig,
  'nl-brussel-woon': nlBrusselWoon,
  'nl-twintig-minuten': nlTwintigMinuten,
  'wilhelmus-1899': wilhelmus1899,
  'wilhelmus-carillon': wilhelmusCarillon,
  brabanconne: brabanconne,
  'wilhelmina-1940': wilhelmina1940,
  'kiek-1944': kiek1944,
  'nl-gouda': nlGouda,
  'nl-edammer': nlEdammer,
  'nl-hutspot': nlHutspot,
  'nl-oliebol': nlOliebol,
  'nl-jenever': nlJenever,
  'nl-waterzooi': nlWaterzooi,
  'nl-lambiek': nlLambiek,
  'nl-rijsttafel': nlRijsttafel,
  'nl-speculaas': nlSpeculaas,
  'nl-sinterklaas-song': nlSinterklaasSong,
}

export const sound = (id: SoundId) => ({ src: files[id], ...soundCredits[id] })
