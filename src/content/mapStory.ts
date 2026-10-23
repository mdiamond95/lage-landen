import { shuffle } from '../lesson/shuffle'
import { mapStories, type MapStory } from '../data/mapStories'
import { frameOf } from '../data/stories'
import type { Exercise, Unit } from './schema'

export const mapStoryId = (unit: Unit) => `${unit.id}-map-story`

// A stage's title without the date in front: "1916: The Zuiderzee floods" asks as
// "The Zuiderzee floods", and "1575: Leiden" as "Leiden".
export const bareTitle = (title: string) => {
  const i = title.indexOf(': ')
  if (i < 0 || !/\d/.test(title.slice(0, i))) return title
  const rest = title.slice(i + 2)
  return rest.charAt(0).toUpperCase() + rest.slice(1)
}

type Ask = { title: string; answer: [number, number]; explain: string }

// The steps a find-the-year question can ask about: any but the first (the slider
// starts there), whose title gives no date away (nor says "Today"). The answer is the whole stage the
// step opens, up to the year before the next one.
export const askable = (story: MapStory): Ask[] => {
  const { events, max } = frameOf(story.map)
  return story.steps.slice(1).flatMap((step) => {
    const i = events.findIndex((e) => e.from === step.at)
    const title = bareTitle(events[i].title)
    if (/\d/.test(title) || title.startsWith('Today')) return []
    const to = i + 1 < events.length ? events[i + 1].from - 1 : max
    return [{ title, answer: [step.at, to] as [number, number], explain: step.say }]
  })
}

// A map story session: the narrated map, then three find-the-year questions on it,
// drawn afresh each time.
export const buildMapStory = (unit: Unit, random = Math.random): Exercise[] => {
  const story = mapStories[unit.id]
  const { min } = frameOf(story.map)
  const asks = shuffle(askable(story), random).slice(0, 3)
  return [
    {
      type: 'story',
      title: `${unit.title}, on the map`,
      body: 'The whole unit in a minute and a half. Press play, then listen or read along as the map moves through time.',
      visual: { kind: 'map-story', unit: unit.id },
    },
    ...asks.map(
      (a): Exercise => ({
        type: 'scrub',
        prompt: `Drag the slider to this part of the story: “${a.title}”.`,
        map: story.map,
        start: min,
        answer: a.answer,
        explain: a.explain,
      }),
    ),
  ]
}
