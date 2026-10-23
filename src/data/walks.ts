// Museum walks (plan: "Museum walk"): six to eight artworks hung in one real gallery,
// strolled past one at a time, each zoomable, with its wall label (the title and maker from
// its museum card in collection.ts) and a few lines on what to look for. A walk is the
// visual of a story (`{ kind: walk, walk: mauritshuis }`), and questions on the walk follow
// it in the lesson. The walk's sources must be listed on that lesson too (a test checks),
// and its texts must not give away a question that comes after it.

import type { PhotoId } from '../photos/ids'

export type WalkStop = { photo: PhotoId; text: string }
export type Walk = {
  museum: string
  city: string
  intro: string
  stops: WalkStop[]
  sources: { title: string; url: string }[]
}

const wiki = (title: string, lang = 'en') => ({
  title: `Wikipedia${lang === 'en' ? '' : ` (${lang === 'nl' ? 'Dutch' : lang})`}, ${title}`,
  url: `https://${lang}.wikipedia.org/wiki/${encodeURIComponent(title.replaceAll(' ', '_')).replaceAll('%2C', ',').replaceAll('%28', '(').replaceAll('%29', ')')}`,
})

export const walks = {
  groeninge: {
    museum: 'The Groeninge Museum',
    city: 'Bruges',
    intro:
      'The city museum of Bruges stands on the site of the medieval Eekhout Abbey. Its paintings run over six centuries, from Jan van Eyck to Marcel Broodthaers, and its first rooms hold the Flemish Primitives, many of them painted in Bruges itself.',
    stops: [
      {
        photo: 'van-der-paele',
        text: 'Saint Donatian on the left, Saint George presenting the old canon on the right, and every wrinkle on his face. Zoom into the carpet, the armour and the glass of the windows.',
      },
      {
        photo: 'margaret-van-eyck',
        text: 'The painter’s wife. The frame says: “My husband Johannes completed me in the year 1439 on 17 June, at the age of 33. As I can.” It is one of the first portraits of a painter’s wife in Europe.',
      },
      {
        photo: 'goes-death-virgin',
        text: 'The twelve apostles crowd round Mary’s deathbed, every face worn with grief, while Christ appears above her in a burst of light, showing his wounds. Hugo van der Goes painted it in about 1472 to 1480.',
      },
      {
        photo: 'moreel-triptych',
        text: 'Saint Christopher carries the Christ Child across a river. On the wings kneel Willem Moreel, a merchant and burgomaster of Bruges, with his five sons, and his wife Barbara with eleven daughters.',
      },
      {
        photo: 'bosch-judgment-bruges',
        text: 'Paradise on the left, hell on the right, and in the middle Christ as judge above a world of sinners and demons. It was made in about 1486, by Hieronymus Bosch or his workshop.',
      },
      {
        photo: 'cambyses',
        text: 'Two panels made for the town hall of Bruges. On the left a judge who took a bribe is arrested; on the right he is flayed alive. It hung where the town’s magistrates met.',
      },
    ],
    sources: [
      wiki('Groeningemuseum'),
      wiki('Madonna with Canon van der Paele'),
      wiki('Portrait of Margaret van Eyck'),
      wiki('Death of the Virgin (van der Goes)'),
      wiki('Moreel Triptych'),
      wiki('The Last Judgment (Bosch, Bruges)'),
      wiki('The Judgement of Cambyses'),
    ],
  },
  mauritshuis: {
    museum: 'The Mauritshuis',
    city: 'The Hague',
    intro:
      'Built from 1636 to 1641 beside the Binnenhof as the home of Johan Maurits of Nassau, governor of Dutch Brazil. Since 1822 it has shown the stadholders’ paintings, given to the state by King William I: a small house full of masterpieces.',
    stops: [
      {
        photo: 'paradise',
        text: 'Two friends painted it in Antwerp: Rubens the figures of Adam and Eve, Jan Brueghel the Elder the garden and all its animals. Zoom in and count the birds.',
      },
      {
        photo: 'peeters-cheese',
        text: 'Clara Peeters, one of the few women painters of her day, painted it in Antwerp. She signed it on the handle of the silver knife, and painted her own face, tiny, in the lid of the jug.',
      },
      {
        photo: 'claesz-vanitas',
        text: 'A skull, a pocket watch, a knocked-over glass and a burned-out lamp: Pieter Claesz painted it in Haarlem to say that life is short.',
      },
      {
        photo: 'anatomy-lesson',
        text: 'Rembrandt’s first big group portrait, painted in Amsterdam for the surgeons’ guild when he was in his mid-twenties. Dr Nicolaes Tulp shows how the muscles of the arm move the fingers.',
      },
      {
        photo: 'goldfinch',
        text: 'Hardly bigger than a sheet of paper. Carel Fabritius painted it in Delft in 1654, the year he died. Lost for two centuries, it was found in Brussels in 1859 and has hung here since 1896.',
      },
      {
        photo: 'view-delft',
        text: 'Vermeer’s home town seen across the harbour, half in the shadow of a cloud, half in the sun. Zoom into the tiny figures on the near bank.',
      },
      {
        photo: 'girl-pearl',
        text: 'Not a portrait of anyone known but a tronie, a study of a head in an exotic costume: a turban, and what looks like a very large pearl. Some think it is polished tin.',
      },
    ],
    sources: [
      wiki('Mauritshuis'),
      wiki('The Garden of Eden with the Fall of Man'),
      wiki('Clara Peeters'),
      wiki('The Anatomy Lesson of Dr. Nicolaes Tulp'),
      wiki('The Goldfinch (painting)'),
      wiki('View of Delft'),
      wiki('Girl with a Pearl Earring'),
    ],
  },
  rijksmuseum: {
    museum: 'The Rijksmuseum',
    city: 'Amsterdam',
    intro:
      'Founded in The Hague in 1798 and moved to Amsterdam ten years later. Pierre Cuypers’ building opened in 1885 and reopened in 2013 after ten years of work. On its first floor the Gallery of Honour leads to the Night Watch.',
    stops: [
      {
        photo: 'avercamp-winter',
        text: 'Hendrick Avercamp, the Mute of Kampen, filled the ice with skaters, rich and poor, in one of the coldest stretches of the Little Ice Age.',
      },
      {
        photo: 'merry-drinker',
        text: 'Frans Hals caught a laugh and a raised hand in Haarlem, with loose, quick strokes you can almost count.',
      },
      {
        photo: 'heda-goblet',
        text: 'A gilt goblet, glass and pewter in soft greys and golds. Willem Claesz Heda painted it in Haarlem in 1635.',
      },
      {
        photo: 'little-street',
        text: 'One of only three views of Delft that Vermeer is known to have painted, and one of two that survive: a quiet street, a house front, brickwork and green shutters.',
      },
      {
        photo: 'milkmaid',
        text: 'A kitchen maid pours milk, slowly, in the light from a window. Zoom into the bread, the jug and the nail holes in the wall.',
      },
      {
        photo: 'steen-nicholas',
        text: 'Sinterklaas has been. The little girl was good all year, and holds the doll he left in her shoe; her naughty brother cries, as he got only a switch of twigs in his.',
      },
      {
        photo: 'jewish-bride',
        text: 'A couple, perhaps painted as Isaac and Rebecca from the Bible, in paint so thick it stands up from the canvas. Nobody knows who they were.',
      },
      {
        photo: 'night-watch',
        text: 'At the end of the Gallery of Honour, in a room of its own: Captain Frans Banninck Cocq’s militia company, painted by Rembrandt in 1642, and not at night at all.',
      },
    ],
    sources: [
      wiki('Rijksmuseum'),
      wiki('Hendrick Avercamp'),
      wiki('The Merry Drinker'),
      wiki('Willem Claesz. Heda'),
      wiki('The Little Street'),
      wiki('The Milkmaid (Vermeer)'),
      wiki('The Feast of Saint Nicholas'),
      { title: 'Rijksmuseum, The Feast of St Nicholas', url: 'https://www.rijksmuseum.nl/en/collection/SK-A-385' },
      wiki('The Jewish Bride'),
      wiki('The Night Watch'),
    ],
  },
  kmska: {
    museum: 'The Royal Museum of Fine Arts',
    city: 'Antwerp',
    intro:
      'Founded in 1810, its collection began with the paintings of Antwerp’s painters’ guild. In 1840 a former mayor, Florent van Ertborn, left it 141 works. Reopened in 2022 after eleven years, it has the world’s largest collections of Ensor and Rik Wouters.',
    stops: [
      {
        photo: 'van-eyck-barbara',
        text: 'Only 34 cm tall, drawn on a chalk ground and dated 1437. Saint Barbara reads while workmen build a Gothic tower behind her. It came to the museum with Van Ertborn’s paintings.',
      },
      {
        photo: 'fouquet-madonna',
        text: 'Half of a pair painted for the French king’s treasurer. The Virgin, among red and blue angels, is said to have the face of Agnès Sorel, the king’s mistress. It has been in Antwerp since 1840.',
      },
      {
        photo: 'memling-angels',
        text: 'Three panels almost seven metres wide, made by Memling for the high altar of a Benedictine abbey far from Flanders. Angels sing and play wind and string instruments around God.',
      },
      {
        photo: 'rubens-magi',
        text: 'Almost four and a half metres tall, painted in 1624 as the altarpiece of St Michael’s Abbey in Antwerp. The Virgin is thought to have the features of Rubens’s first wife, Isabella Brant.',
      },
      {
        photo: 'ensor-oyster',
        text: 'Ensor’s sister Mitche, eating oysters alone at a table laid for a feast in the family home in Ostend. Exhibitions turned it down; now it hangs among the museum’s Ensors.',
      },
      {
        photo: 'ensor-intrigue',
        text: 'Eleven figures in masks, in loud colour against white. The masks show who these people are rather than hide it.',
      },
      {
        photo: 'wouters-eyepatch',
        text: 'Rik Wouters painted himself with a black patch over the eye that cancer took. Interned in the Netherlands as a soldier in 1914, he was let go because of his illness, and died in Amsterdam in July 1916, at 33.',
      },
    ],
    sources: [
      wiki('Royal Museum of Fine Arts Antwerp'),
      { title: 'KMSKA, about the museum', url: 'https://kmska.be/en/about-kmska' },
      wiki('Saint Barbara (van Eyck)'),
      wiki('Melun Diptych'),
      { title: 'KMSKA, God the Father with singing and music-making angels', url: 'https://kmska.be/en/masterpiece/god-father-singing-and-music-making-angels' },
      wiki('Adoration of the Magi (Rubens, Antwerp)'),
      wiki('The Oyster Eater (Ensor)'),
      wiki('The Intrigue (painting)'),
      wiki('Rik Wouters'),
    ],
  },
} satisfies Record<string, Walk>

export type WalkId = keyof typeof walks
export const walkIds = Object.keys(walks) as [WalkId, ...WalkId[]]
