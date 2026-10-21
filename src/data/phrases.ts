// The phrasebook of Unit 20: 100 everyday phrases in ten sets, each with what it means and,
// where it helps, when to say it. A phrase plays its Commons recording where there is one,
// and otherwise the device's own Dutch or French voice, labelled as a computer voice.
// Words marked Flemish or Netherlands follow Wikipedia's Belgisch-Nederlands and Friet
// articles and Wiktionary; the Belgian French follows Wikipedia's Belgian French article.

import type { SoundId } from '../sounds/ids'

export type Phrase = {
  say: string
  means: string
  // When or where to use it, or the word used on the other side of the border.
  note?: string
  sound?: SoundId
}

export type PhraseSet = { title: string; lang: 'nl-NL' | 'nl-BE' | 'fr-BE'; phrases: Phrase[] }

export const phraseSetIds = ['hello', 'polite', 'talk', 'table', 'out', 'time', 'help', 'words', 'flemish', 'french'] as const
export type PhraseSetId = (typeof phraseSetIds)[number]

export const phraseSets: Record<PhraseSetId, PhraseSet> = {
  hello: {
    title: 'Hello and goodbye',
    lang: 'nl-NL',
    phrases: [
      { say: 'Goedemorgen', means: 'Good morning', note: 'Until about noon.', sound: 'nl-goedemorgen' },
      { say: 'Goedemiddag', means: 'Good afternoon' },
      { say: 'Goedenavond', means: 'Good evening', sound: 'nl-goedenavond' },
      { say: 'Goedendag', means: 'Good day', note: 'A little formal, and in Flanders also a way to say goodbye.', sound: 'nl-goedendag' },
      { say: 'Hallo', means: 'Hello', sound: 'nl-hallo' },
      { say: 'Hoi', means: 'Hi', note: 'Casual, mostly in the Netherlands.' },
      { say: 'Dag!', means: 'Hi! or Bye!', note: 'Both, in both countries.' },
      { say: 'Doei!', means: 'Bye!', note: 'Casual, in the Netherlands.', sound: 'nl-doei' },
      { say: 'Tot ziens', means: 'Goodbye', note: 'Literally "until we see each other".', sound: 'nl-tot-ziens' },
      { say: 'Welterusten', means: 'Sleep well, good night', sound: 'nl-welterusten' },
    ],
  },
  polite: {
    title: 'Please, thanks and sorry',
    lang: 'nl-NL',
    phrases: [
      { say: 'Alstublieft', means: 'Please, or here you are', note: 'Polite form. Said when you ask for something and when you hand something over.', sound: 'nl-alstublieft' },
      { say: 'Alsjeblieft', means: 'Please, or here you are', note: 'To a friend, or anyone your own age, in the Netherlands.', sound: 'nl-alsjeblieft' },
      { say: 'Dank u wel', means: 'Thank you very much', note: 'Polite form.' },
      { say: 'Dank je wel', means: 'Thank you very much', note: 'Familiar form.', sound: 'nl-dank-je-wel' },
      { say: 'Bedankt', means: 'Thanks', sound: 'nl-bedankt' },
      { say: 'Merci', means: 'Thanks', note: 'Borrowed from French, and very common in Flanders.' },
      { say: 'Graag gedaan', means: "You're welcome", note: 'Literally "gladly done".' },
      { say: 'Sorry', means: 'Sorry', sound: 'nl-sorry' },
      { say: 'Pardon', means: 'Excuse me', note: 'To get past someone, or to ask them to say it again.', sound: 'nl-pardon' },
      { say: 'Geen probleem', means: 'No problem' },
    ],
  },
  talk: {
    title: 'Getting to know someone',
    lang: 'nl-NL',
    phrases: [
      { say: 'Hoe gaat het?', means: 'How are you?' },
      { say: 'Goed, en met jou?', means: 'Fine, and you?' },
      { say: 'Hoe heet je?', means: "What's your name?" },
      { say: 'Ik heet Mark', means: 'My name is Mark' },
      { say: 'Waar kom je vandaan?', means: 'Where are you from?' },
      { say: 'Ik kom uit Canada', means: "I'm from Canada" },
      { say: 'Spreekt u Engels?', means: 'Do you speak English?' },
      { say: 'Ik spreek een beetje Nederlands', means: 'I speak a little Dutch' },
      { say: 'Ik begrijp het niet', means: "I don't understand" },
      { say: 'Kunt u dat herhalen?', means: 'Could you say that again?' },
    ],
  },
  table: {
    title: 'At the table',
    lang: 'nl-NL',
    phrases: [
      { say: 'Eet smakelijk', means: 'Enjoy your meal', note: 'Said before everyone starts eating.', sound: 'nl-eet-smakelijk' },
      { say: 'Proost!', means: 'Cheers!', sound: 'nl-proost' },
      { say: 'Een koffie, alstublieft', means: 'A coffee, please' },
      { say: 'Een pintje', means: 'A glass of beer', note: 'In Flanders; in the Netherlands, een biertje.' },
      { say: 'Lekker!', means: 'Tasty!', note: 'Also nice, comfortable, or just good: lekker weer, lovely weather.', sound: 'nl-lekker' },
      { say: 'Ik heb honger', means: "I'm hungry" },
      { say: 'Frieten', means: 'Fries', note: 'In Flanders and the south of the Netherlands friet or frieten; in the rest of the Netherlands, patat.', sound: 'nl-frieten' },
      { say: 'Patat', means: 'Fries', note: 'In most of the Netherlands. In Flanders a patat is a raw potato!', sound: 'nl-patat' },
      { say: 'De rekening, alstublieft', means: 'The bill, please' },
      { say: 'Mag ik pinnen?', means: 'Can I pay by card?', note: 'In the Netherlands; pinnen comes from the PIN you type in.' },
    ],
  },
  out: {
    title: 'Out and about',
    lang: 'nl-NL',
    phrases: [
      { say: 'Waar is het station?', means: 'Where is the station?' },
      { say: 'Hoe kom ik bij het museum?', means: 'How do I get to the museum?' },
      { say: 'Links, rechts, rechtdoor', means: 'Left, right, straight on' },
      { say: 'Is het ver?', means: 'Is it far?' },
      { say: 'Het is twintig minuten met de fiets', means: "It's twenty minutes by bike", sound: 'nl-twintig-minuten' },
      { say: 'De fiets', means: 'The bike', sound: 'nl-fiets' },
      { say: 'Een kaartje naar Amsterdam', means: 'A ticket to Amsterdam' },
      { say: 'Overstappen in Utrecht', means: 'Change trains at Utrecht' },
      { say: 'Hoeveel kost dit?', means: 'How much is this?' },
      { say: 'Ingang, uitgang', means: 'Entrance, exit' },
    ],
  },
  time: {
    title: 'Time and weather',
    lang: 'nl-NL',
    phrases: [
      { say: 'Vandaag', means: 'Today' },
      { say: 'Morgen', means: 'Tomorrow', note: 'Also "morning", as in goedemorgen.' },
      { say: 'Gisteren', means: 'Yesterday' },
      { say: 'Hoe laat is het?', means: 'What time is it?' },
      { say: 'Half drie', means: 'Half past two', note: 'Dutch counts the half hour towards the next hour: half three is 2:30.' },
      { say: 'Kwart over vijf', means: 'Quarter past five' },
      { say: 'Het regent', means: "It's raining" },
      { say: 'Lekker weer', means: 'Lovely weather' },
      { say: 'Het waait', means: "It's windy" },
      { say: 'Uitwaaien', means: 'To clear your head in the wind', note: 'A walk on the beach or a dike in a stiff breeze.', sound: 'nl-uitwaaien' },
    ],
  },
  help: {
    title: 'Help and health',
    lang: 'nl-NL',
    phrases: [
      { say: 'Help!', means: 'Help!' },
      { say: 'Kunt u mij helpen?', means: 'Can you help me?' },
      { say: 'Ik ben de weg kwijt', means: "I'm lost", note: 'Literally "I have lost the way".' },
      { say: 'Waar is het toilet?', means: 'Where is the toilet?' },
      { say: 'Waar is de apotheek?', means: 'Where is the pharmacy?' },
      { say: 'Ik voel me niet lekker', means: "I don't feel well" },
      { say: 'Bel 112', means: 'Call 112', note: 'The emergency number in both countries, as in the rest of the European Union.' },
      { say: 'Pas op!', means: 'Watch out!' },
      { say: 'Gezondheid!', means: 'Bless you!', note: 'After a sneeze. Literally "health!"', sound: 'nl-gezondheid' },
      { say: 'Beterschap!', means: 'Get well soon!' },
    ],
  },
  words: {
    title: 'Words with no English twin',
    lang: 'nl-NL',
    phrases: [
      { say: 'Gezellig', means: 'Cosy, sociable, a good time together', note: 'A full café, a long dinner with friends, a warm living room: all gezellig.', sound: 'nl-gezellig' },
      { say: 'Jammer', means: "What a pity, too bad", sound: 'nl-jammer' },
      { say: 'Hè?', means: "Isn't it? Right? or What?", note: 'Tagged onto sentences: mooi weer, hè?' },
      { say: 'Hèhè', means: 'At last!', note: 'A sigh of relief when something is finally done.' },
      { say: 'Een borrel', means: 'Drinks and snacks', note: 'After work, or to celebrate.' },
      { say: 'Gedogen', means: 'To tolerate what is officially forbidden', note: 'The policy behind the coffee shops (Unit 12).' },
      { say: 'Polderen', means: 'To talk it through until everyone agrees', note: 'Named, it is said, after the polders, whose neighbours had to agree to keep the dikes up.' },
      { say: 'Doe normaal', means: 'Act normal', note: 'Do not show off.' },
      { say: 'Stroopwafel', means: 'Syrup waffle', note: 'Two thin wafers with syrup between them.', sound: 'nl-stroopwafel' },
      { say: 'Goesting', means: 'Appetite, desire', note: 'Flemish: ik heb er goesting in, I fancy it.', sound: 'nl-goesting' },
    ],
  },
  flemish: {
    title: 'Said in Flanders',
    lang: 'nl-BE',
    phrases: [
      { say: 'Een gsm', means: 'A mobile phone', note: 'In the Netherlands, een mobiel.' },
      { say: 'Plezant', means: 'Fun, nice', note: 'In the Netherlands, leuk.' },
      { say: 'De beenhouwer', means: 'The butcher', note: 'In the Netherlands, de slager.' },
      { say: 'Kuisen', means: 'To clean', note: 'In the Netherlands, schoonmaken.' },
      { say: 'Een kleedje', means: 'A dress', note: 'In the Netherlands, een jurk.' },
      { say: 'Het rondpunt', means: 'The roundabout', note: 'In the Netherlands, de rotonde.' },
      { say: 'Verwittigen', means: 'To warn, to let someone know', note: 'In the Netherlands, waarschuwen.' },
      { say: 'De droogkuis', means: 'The dry cleaner', note: 'In the Netherlands, de stomerij.' },
      { say: 'Een kriek', means: 'A sour cherry, and the cherry beer made with it', note: 'In the Netherlands, a sour cherry is a morel.' },
      { say: 'Ik woon in Brussel', means: 'I live in Brussels', sound: 'nl-brussel-woon' },
    ],
  },
  french: {
    title: 'Belgian French',
    lang: 'fr-BE',
    phrases: [
      { say: 'Septante', means: 'Seventy', note: 'In France, soixante-dix.' },
      { say: 'Septante-et-un', means: 'Seventy-one', sound: 'fr-be-71' },
      { say: 'Nonante', means: 'Ninety', note: 'In France, quatre-vingt-dix.' },
      { say: 'Quatre-vingts', means: 'Eighty', note: 'As in France: Belgians never say huitante, as some Swiss do.' },
      { say: 'Le dîner', means: 'Lunch, the midday meal', note: 'As in Switzerland and Canada. In France, the evening meal.' },
      { say: 'Viens une fois!', means: 'Come here a moment!', note: 'Une fois, "once", used like Dutch eens, especially in Brussels.' },
      { say: "S'il vous plaît", means: 'Please, or here you are', note: 'Said when handing something over, like Dutch alstublieft.' },
      { say: 'Un kot', means: 'A student room', note: 'Borrowed from Dutch kot.' },
      { say: 'Une dringuelle', means: 'A tip', note: 'From Dutch drinkgeld.' },
      { say: 'Le bourgmestre', means: 'The mayor', note: 'In France, le maire. From Dutch burgemeester.' },
    ],
  },
}

export const allPhrases = phraseSetIds.flatMap((id) => phraseSets[id].phrases.map((p) => ({ ...p, set: id })))
