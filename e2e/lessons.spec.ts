import { expect, test, type Page } from '@playwright/test'

// Answers whatever is on screen (not always correctly) so a whole lesson can be played.
async function answer(page: Page) {
  const foot = page.locator('.lesson-foot')
  if (await page.locator('.story').count()) return
  if (await page.locator('.content-note').count()) return
  if (await page.locator('.exercise-scrub').count()) {
    const slider = page.locator('.exercise-scrub input[type="range"]')
    await slider.fill(await slider.getAttribute('max') ?? '0')
  } else if (await page.locator('.hunt-image').count()) {
    const box = (await page.locator('.hunt-image img').boundingBox())!
    await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2)
  } else if (await page.locator('.match-grid').count()) {
    const left = page.locator('.match-col').nth(0).locator('.option')
    const right = page.locator('.match-col').nth(1).locator('.option')
    const n = await left.count()
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        if (await left.nth(i).isDisabled()) break
        if (await right.nth(j).isDisabled()) continue
        await left.nth(i).click()
        await right.nth(j).click()
      }
    }
  } else if (await page.locator('.mode-pin').count()) {
    const box = (await page.locator('.lowlands-map').boundingBox())!
    await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2)
  } else if (await page.locator('.mode-region').count()) {
    await page.locator('.mode-region [role="button"]').last().dispatchEvent('click')
  } else if (await page.locator('.exercise-odd').count()) {
    await page.locator('.exercise-odd .option').first().click()
    await page.locator('.odd-reasons .option').first().click()
  } else if (await page.locator('.sort-groups').count()) {
    while (await page.locator('.sort-pool .sort-card').count()) {
      await page.locator('.sort-pool .sort-card').first().click()
      await page.locator('.sort-group-head').first().click()
    }
  } else if (await page.locator('.exercise-style').count()) {
    for (;;) {
      await page.locator('.style-group:not([disabled])').first().click()
      if (!(await page.locator('.style-next').count())) break
      await page.locator('.style-next').click()
    }
  } else if (await page.locator('.exercise-label').count()) {
    const spots = page.locator('.label-spot')
    const n = await spots.count()
    for (let i = 0; i < n; i++) {
      await page.locator('.label-pool .label-card').first().click()
      await spots.nth(i).click()
    }
  } else if (await page.locator('.dialect-pick').count()) {
    await page.locator('.dialect-pick .dialect').first().dispatchEvent('click')
  } else if (await page.locator('.chip-pool').count()) {
    while (await page.locator('.chip').count()) await page.locator('.chip').first().click()
  } else {
    await page.locator('.option').first().click()
  }
  await foot.getByRole('button', { name: 'Check' }).click()
}

async function playLesson(page: Page, name: string, shots?: string) {
  await page.getByRole('button', { name, exact: true }).click()
  const seen = new Set<string>()
  for (let step = 0; step < 40; step++) {
    if (await page.locator('.results').count()) return
    await answer(page)
    const kind = (await page.locator('.eyebrow').first().textContent()) ?? ''
    if (shots && !seen.has(kind)) {
      seen.add(kind)
      await page.screenshot({ path: `${shots}/${name}-${seen.size}.png` })
    }
    await page.locator('.lesson-foot').getByRole('button', { name: 'Continue' }).click()
  }
  throw new Error(`${name} did not finish`)
}

test.setTimeout(180_000)

test('plays all of unit 1 and the checkpoint without errors', async ({ page }) => {
  const errors: string[] = []
  page.on('pageerror', (e) => errors.push(e.message))
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()))
  await page.goto('/')

  const shots = process.env.SHOTS
  for (const name of ['Two countries, one delta', 'Three rivers', 'Below sea level', 'Holding back the sea', 'Land from the sea']) {
    await playLesson(page, name, shots)
    await expect(page.locator('.results h1')).toBeVisible()
    await page.getByRole('button', { name: 'Continue' }).click()
  }
  await expect(page.locator('.stat-xp')).not.toHaveText('0')
  await playLesson(page, 'Unit 1 checkpoint', shots)
  await page.getByRole('button', { name: 'Continue' }).click()
  await expect(page.locator('.discover p')).toContainText('places discovered')
  expect(errors).toEqual([])
})

test('plays all of unit 2 and the checkpoint without errors', async ({ page }) => {
  const errors: string[] = []
  page.on('pageerror', (e) => errors.push(e.message))
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()))
  await page.goto('/')

  const shots = process.env.SHOTS
  for (const name of [
    'Caesar and the Belgae',
    'The Rhine frontier',
    'Roads, towns and gods',
    'The Franks',
    'Saints and Frisian traders',
    'Charlemagne and the Vikings',
  ]) {
    await playLesson(page, name, shots)
    await expect(page.locator('.results h1')).toBeVisible()
    await page.getByRole('button', { name: 'Continue' }).click()
  }
  await playLesson(page, 'Unit 2 checkpoint', shots)
  await page.getByRole('button', { name: 'Continue' }).click()
  expect(errors).toEqual([])
})

test('the Roman time map follows the year slider and plays', async ({ page }) => {
  await page.goto('/')
  // The frontier story opens the second lesson, unlocked by finishing the first.
  await playLesson(page, 'Caesar and the Belgae')
  await page.getByRole('button', { name: 'Continue' }).click()
  await page.getByRole('button', { name: 'The Rhine frontier', exact: true }).click()

  const map = page.locator('.time-map')
  await expect(map.locator('.time-map-title')).toHaveText('57 BCE: Caesar conquers the Belgae')
  await expect(map.locator('.hist-frontier')).toHaveCount(0)

  await map.getByRole('slider', { name: 'Year' }).fill('47')
  await expect(map.locator('.time-map-title')).toHaveText('47 CE: The Rhine becomes the frontier')
  await expect(map.locator('.hist-frontier')).toHaveCount(1)
  await expect(map.locator('.slider-value')).toHaveText('47 CE')

  await map.getByRole('slider', { name: 'Year' }).fill('450')
  await expect(map.locator('.hist-frontier.hist-gone')).toHaveCount(1)

  await map.getByRole('slider', { name: 'Year' }).fill('69')
  await map.getByRole('button', { name: 'Play the story' }).click()
  await expect(map.locator('.time-map-title')).toHaveText('The quiet centuries', { timeout: 6000 })
})

test('the water works map drains the Zuiderzee and builds the Delta Works', async ({ page }) => {
  await unlock(page, ['u1-l1', 'u1-l2', 'u1-l3', 'u1-l4'])
  await page.getByRole('button', { name: 'Land from the sea', exact: true }).click()

  const map = page.locator('.time-map')
  await expect(map.locator('.time-map-title')).toHaveText('1916: The Zuiderzee floods')
  // Before 1930 the four future polders are still sea, and there are no dams yet.
  await expect(map.locator('.hist-area')).toHaveCount(4)
  await expect(map.locator('.hist-dam')).toHaveCount(0)

  await map.getByRole('slider', { name: 'Year' }).fill('1932')
  await expect(map.locator('.time-map-title')).toHaveText('1932: The Afsluitdijk')
  await expect(map.locator('.hist-dam')).toHaveCount(1)
  await expect(map.locator('.hist-area')).toHaveCount(3)
  await expect(map.locator('.hist-water')).toHaveText('IJSSELMEER')

  // The flood of 1953, from the delta map: flooded land and four breaches, gone by 1958.
  await map.getByRole('slider', { name: 'Year' }).fill('1953')
  await expect(map.locator('.hist-area-flooded').first()).toBeVisible()
  await expect(map.locator('.hist-breach')).toHaveCount(4)
  await map.getByRole('slider', { name: 'Year' }).fill('1958')
  await expect(map.locator('.hist-area-flooded')).toHaveCount(0)

  await map.getByRole('slider', { name: 'Year' }).fill('1997')
  await expect(map.locator('.hist-area')).toHaveCount(0)
  await expect(map.locator('.hist-line.hist-barrier')).toHaveCount(1)
  await expect(map.locator('.hist-site.hist-barrier')).toHaveCount(2)

  await map.getByRole('slider', { name: 'Year' }).fill('1968')
  await map.getByRole('button', { name: 'Play the story' }).click()
  await expect(map.locator('.time-map-title')).toHaveText('1971: Haringvliet and Brouwersdam', { timeout: 6000 })
})

test('plays all of unit 3 and the checkpoint without errors', async ({ page }) => {
  const errors: string[] = []
  page.on('pageerror', (e) => errors.push(e.message))
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()))
  await page.goto('/')

  const shots = process.env.SHOTS
  for (const name of [
    'Counts and bishops',
    'Towns and their freedoms',
    'Wool and cloth',
    'Bruges, market of the world',
    'The Golden Spurs',
    'War, plague and Burgundy',
  ]) {
    await playLesson(page, name, shots)
    await expect(page.locator('.results h1')).toBeVisible()
    await page.getByRole('button', { name: 'Continue' }).click()
  }
  await playLesson(page, 'Unit 3 checkpoint', shots)
  await page.getByRole('button', { name: 'Continue' }).click()
  expect(errors).toEqual([])
})

// Marks lessons as done so a later lesson in a unit can be opened directly.
async function unlock(page: Page, lessonIds: string[]) {
  await page.goto('/')
  await page.evaluate((ids) => {
    const completed = Object.fromEntries(ids.map((id) => [id, { bestXp: 10, perfect: false }]))
    localStorage.setItem(
      'lage-landen:progress:v1',
      JSON.stringify({ xp: 0, streak: 0, lastDay: null, freezeWeek: null, completed, discovered: [] }),
    )
  }, lessonIds)
  await page.reload()
}

test('the cloth trade map follows the year slider and plays', async ({ page }) => {
  await unlock(page, ['u3-l1', 'u3-l2'])
  await page.getByRole('button', { name: 'Wool and cloth', exact: true }).click()

  const map = page.locator('.trade-map')
  await expect(map.locator('.time-map-title')).toHaveText('About 1100: Cloth from Flemish sheep')
  await expect(map.locator('.trade-line.trade-wool')).toHaveCount(0)

  await map.getByRole('slider', { name: 'Year' }).fill('1300')
  await expect(map.locator('.slider-value')).toHaveText('1300')
  await expect(map.locator('.trade-line.trade-wool')).toHaveCount(3)

  // During the wool ban the routes from England turn grey.
  await map.getByRole('slider', { name: 'Year' }).fill('1336')
  await expect(map.locator('.time-map-title')).toHaveText('1336: England stops the wool')
  await expect(map.locator('.trade-line.trade-wool')).toHaveCount(0)
  await expect(map.locator('.trade-gone')).not.toHaveCount(0)

  await map.getByRole('slider', { name: 'Year' }).fill('1370')
  await expect(map.locator('.trade-town-label', { hasText: 'Calais' })).toBeVisible()

  await map.getByRole('slider', { name: 'Year' }).fill('1338')
  await map.getByRole('button', { name: 'Play the story' }).click()
  await expect(map.locator('.time-map-title')).toHaveText('1363: The Calais staple', { timeout: 6000 })
})

test('who am I reveals clues and pays a bonus for an early answer', async ({ page }) => {
  await unlock(page, ['u3-l1', 'u3-l2', 'u3-l3', 'u3-l4', 'u3-l5'])
  await page.getByRole('button', { name: 'War, plague and Burgundy', exact: true }).click()
  await page.locator('.lesson-foot').getByRole('button', { name: 'Continue' }).click()

  await expect(page.locator('.eyebrow').first()).toHaveText('Who am I?')
  await expect(page.locator('.clue')).toHaveCount(1)
  await page.getByRole('button', { name: 'Show clue 2 of 4' }).click()
  await expect(page.locator('.clue')).toHaveCount(2)
  await page.getByRole('button', { name: 'Jacob van Artevelde' }).click()
  await page.locator('.lesson-foot').getByRole('button', { name: 'Check' }).click()
  await expect(page.locator('.feedback-head')).toHaveText('Spot on! +2 XP')
  await expect(page.locator('.clue')).toHaveCount(4)
})

test('plays all of unit 4 and the checkpoint without errors', async ({ page }) => {
  const errors: string[] = []
  page.on('pageerror', (e) => errors.push(e.message))
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()))
  await page.goto('/')

  const shots = process.env.SHOTS
  for (const name of [
    'Burgundy gathers the lands',
    'The court of Burgundy',
    'Van Eyck and the new painters',
    'Charles the Bold and Mary',
    'Antwerp and the new learning',
    'Charles V and the Seventeen Provinces',
  ]) {
    await playLesson(page, name, shots)
    await expect(page.locator('.results h1')).toBeVisible()
    await page.getByRole('button', { name: 'Continue' }).click()
  }
  await playLesson(page, 'Unit 4 checkpoint', shots)
  await page.getByRole('button', { name: 'Continue' }).click()
  expect(errors).toEqual([])
})

test('the Burgundy map fills in as lands join, one by one', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: 'Burgundy gathers the lands', exact: true }).click()

  const map = page.locator('.time-map')
  await expect(map.locator('.time-map-title')).toHaveText('1384: Flanders goes to Burgundy')
  // Flanders, French Flanders and Artois; Holland not yet.
  await expect(map.locator('.hist-area-ruled')).toHaveCount(3)

  await map.getByRole('slider', { name: 'Year' }).fill('1433')
  await expect(map.locator('.time-map-title')).toHaveText('1433: Holland, Zeeland and Hainaut')
  await expect(map.locator('.hist-area-new')).toHaveCount(1)
  await expect(map.locator('.hist-area-ruled')).toHaveCount(7)

  // Liège is under a Burgundian bishop from 1456 until Charles dies in 1477.
  await map.getByRole('slider', { name: 'Year' }).fill('1468')
  await expect(map.locator('.hist-area-client')).toHaveCount(2)
  await map.getByRole('slider', { name: 'Year' }).fill('1477')
  await expect(map.locator('.hist-area-client')).toHaveCount(1)

  await map.getByRole('slider', { name: 'Year' }).fill('1549')
  await expect(map.locator('.hist-water')).toHaveText('THE SEVENTEEN PROVINCES')

  await map.getByRole('slider', { name: 'Year' }).fill('1521')
  await map.getByRole('button', { name: 'Play the story' }).click()
  await expect(map.locator('.time-map-title')).toHaveText('1528: Utrecht and Overijssel', { timeout: 6000 })
})

test('find the year hides the captions and marks the year chosen', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: 'Burgundy gathers the lands', exact: true }).click()
  const foot = page.locator('.lesson-foot')
  await foot.getByRole('button', { name: 'Continue' }).click()
  await page.locator('.option').first().click()
  await foot.getByRole('button', { name: 'Check' }).click()
  await foot.getByRole('button', { name: 'Continue' }).click()

  await expect(page.locator('.eyebrow').first()).toHaveText('Find the year')
  await expect(page.locator('.time-map-title')).toHaveCount(0)
  await expect(foot.getByRole('button', { name: 'Check' })).toBeDisabled()
  await page.getByRole('slider', { name: 'Year' }).fill('1430')
  await foot.getByRole('button', { name: 'Check' }).click()
  await expect(page.locator('.feedback-head')).toHaveText('Not quite')
  await expect(page.locator('.feedback-detail')).toContainText('You chose 1430')
  // The caption comes back once checked.
  await expect(page.locator('.time-map-title')).toHaveText('1430: Brabant and Limburg')
})

// The Utrecht-like tower on the skyline of the Ghent Altarpiece, as in the Unit 4 lesson.
const TOWER = [0.35, 0.07, 0.08, 0.12]

test('a detail hunt scores a tap inside the target and shows where it was', async ({ page }) => {
  await unlock(page, ['u4-l1', 'u4-l2'])
  await page.getByRole('button', { name: 'Van Eyck and the new painters', exact: true }).click()
  const foot = page.locator('.lesson-foot')
  await foot.getByRole('button', { name: 'Continue' }).click()

  await expect(page.locator('.eyebrow').first()).toHaveText('Find the detail')
  const box = (await page.locator('.hunt-image img').boundingBox())!
  const [x, y, w, h] = TOWER
  await page.mouse.click(box.x + box.width * (x + w / 2), box.y + box.height * (y + h / 2))
  await foot.getByRole('button', { name: 'Check' }).click()
  await expect(page.locator('.feedback-head')).toHaveText('Correct!')
  await expect(page.locator('.hunt-target')).toHaveCount(1)
})

test('plays all of unit 5 and the checkpoint without errors', async ({ page }) => {
  const errors: string[] = []
  page.on('pageerror', (e) => errors.push(e.message))
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()))
  await page.goto('/')

  const shots = process.env.SHOTS
  for (const name of [
    'Philip II and the Iconoclastic Fury',
    'Alba and the Council of Blood',
    'William of Orange and the Sea Beggars',
    'Two unions',
    'Antwerp falls, Amsterdam rises',
    'From war to the Peace of Münster',
  ]) {
    await playLesson(page, name, shots)
    await expect(page.locator('.results h1')).toBeVisible()
    await page.getByRole('button', { name: 'Continue' }).click()
  }
  await playLesson(page, 'Unit 5 checkpoint', shots)
  await page.getByRole('button', { name: 'Continue' }).click()
  expect(errors).toEqual([])
})

test('the revolt map splits the provinces and sends refugees north', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: 'Philip II and the Iconoclastic Fury', exact: true }).click()

  const map = page.locator('.time-map')
  const year = map.getByRole('slider', { name: 'Year' })
  await expect(map.locator('.time-map-title')).toHaveText('1555: Philip II takes over')
  await expect(map.locator('.hist-area-rebel')).toHaveCount(0)

  await year.fill('1572')
  // Holland and Zeeland's islands go over, and are outlined as just changed.
  await expect(map.locator('.hist-area-rebel')).toHaveCount(2)
  await expect(map.locator('.hist-area-flash')).toHaveCount(2)

  await year.fill('1585')
  await expect(map.locator('.time-map-title')).toHaveText('1585: Antwerp falls')
  await expect(map.locator('.hist-flow')).toHaveCount(4)
  await expect(map.locator('.hist-area-contested')).not.toHaveCount(0)

  await year.fill('1609')
  await expect(map.locator('.hist-alert')).toHaveText("TWELVE YEARS' TRUCE")
  await expect(map.locator('.hist-flow')).toHaveCount(0)

  await year.fill('1645')
  await map.getByRole('button', { name: 'Play the story' }).click()
  await expect(map.locator('.time-map-title')).toHaveText('1648: The Peace of Münster', { timeout: 6000 })
  await expect(map.locator('.hist-water')).toHaveText('DUTCH REPUBLIC')
})

// Plays on through a lesson until a question of the given kind comes up.
async function skipTo(page: Page, eyebrow: string) {
  const foot = page.locator('.lesson-foot')
  for (let step = 0; step < 20; step++) {
    if ((await page.locator('.eyebrow').first().textContent()) === eyebrow) return
    await answer(page)
    await foot.getByRole('button', { name: 'Continue' }).click()
  }
  throw new Error(`no ${eyebrow} question`)
}

test('fill the gap puts the chosen word in the quote and shows the right one', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: 'Philip II and the Iconoclastic Fury', exact: true }).click()
  await skipTo(page, 'Fill the gap')

  await expect(page.locator('.source-quote cite')).toContainText('1566')
  await page.getByRole('button', { name: 'children' }).click()
  await expect(page.locator('.gap')).toHaveText('children')
  await page.locator('.lesson-foot').getByRole('button', { name: 'Check' }).click()
  await expect(page.locator('.feedback-head')).toHaveText('Not quite')
  await expect(page.locator('.gap')).toHaveText('beggars')
  await expect(page.locator('.feedback-detail')).toContainText('The missing word is "beggars"')
})

test('a chart question and a cause and effect question can be answered', async ({ page }) => {
  await unlock(page, ['u5-l1', 'u5-l2', 'u5-l3', 'u5-l4'])
  await page.getByRole('button', { name: 'Antwerp falls, Amsterdam rises', exact: true }).click()
  await skipTo(page, 'Read the chart')
  await expect(page.locator('.line-chart polyline')).toHaveCount(2)
  await expect(page.locator('.line-chart .chart-label')).toHaveText(['Antwerp', 'Amsterdam'])
  await page.getByRole('button', { name: 'About 100,000' }).click()
  await page.locator('.lesson-foot').getByRole('button', { name: 'Check' }).click()
  await expect(page.locator('.feedback-head')).toHaveText('Correct!')
  await page.locator('.lesson-foot').getByRole('button', { name: 'Continue' }).click()

  await skipTo(page, 'Cause and effect')
  await expect(page.locator('.cause-heads')).toHaveText('CauseEffect')
  await answer(page)
  await expect(page.locator('.feedback-detail')).toContainText('Golden Age')
})

test('a finished lesson comes back in the daily review', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('.review p')).toContainText('Finish a lesson')
  await expect(page.locator('.review .btn-primary')).toBeDisabled()

  await playLesson(page, 'Two countries, one delta')
  await page.getByRole('button', { name: 'Continue' }).click()
  await expect(page.locator('.review p')).toContainText('All caught up on 9 questions. The next ones are due tomorrow.')

  // Two days later, everything from that lesson is due.
  await page.evaluate(() => {
    const p = JSON.parse(localStorage.getItem('lage-landen:progress:v1')!)
    for (const card of Object.values(p.cards) as { due: string }[]) card.due = '2000-01-01'
    localStorage.setItem('lage-landen:progress:v1', JSON.stringify(p))
  })
  await page.reload()
  await expect(page.locator('.review p')).toContainText('9 questions are due')
  const xp = Number(await page.locator('.stat-xp').textContent())
  await page.getByRole('button', { name: 'Review 9' }).click()
  for (let step = 0; step < 40 && !(await page.locator('.results').count()); step++) {
    await answer(page)
    await page.locator('.lesson-foot').getByRole('button', { name: 'Continue' }).click()
  }
  await expect(page.locator('.results .muted')).toHaveText('Daily review')
  await page.getByRole('button', { name: 'Continue' }).click()
  await expect(page.locator('.review .btn-primary')).toHaveText('Nothing due')
  expect(Number(await page.locator('.stat-xp').textContent())).toBeGreaterThan(xp)
})

test('the time map steps through 41 snapshots from Caesar to the federal Belgium of 2012', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('.timemap-teaser')).toContainText('41 snapshots')
  await page.getByRole('button', { name: 'Open the time map' }).click()
  await expect(page.locator('.time-travel-intro')).toContainText('in 41 snapshots')
  const map = page.locator('.time-map')
  const slider = page.getByRole('slider', { name: 'Year' })
  await expect(map.locator('.time-map-title')).toHaveText('57 BCE: Caesar conquers the Belgae')
  await expect(slider).toHaveAttribute('max', '40')

  await slider.fill('3')
  await expect(map.locator('.time-map-title')).toHaveText('About 1100: Hebban olla vogala')
  await expect(map.locator('.hist-area-frisian').first()).toBeVisible()
  await expect(map.locator('.key-swatch.key-saxon')).toHaveCount(1)

  await slider.fill('4')
  await expect(map.locator('.time-map-title')).toHaveText('1302: A patchwork of lands')
  await expect(map.locator('.hist-area-frisian')).toHaveCount(0)
  await expect(map.locator('.hist-battle')).toHaveCount(1)
  await expect(map.locator('.hist-frontier')).toHaveCount(0)

  await slider.fill('7')
  await expect(map.locator('.time-map-title')).toHaveText('1520: Dürer comes to see')
  await expect(map.locator('.hist-flow')).toHaveCount(1)
  await expect(map.locator('.hist-site.hist-workshop', { hasText: 'Quinten Metsys' })).toHaveCount(1)
  await expect(map.locator('.key-swatch.key-workshop')).toHaveCount(1)
  // Burgundy's lands stay on behind the painters, with their key.
  await expect(map.locator('.key-swatch.key-ruled')).toHaveCount(1)

  await slider.fill('9')
  await expect(map.locator('.time-map-title')).toHaveText('1579: Two unions')
  await expect(map.locator('.hist-area-rebel').first()).toBeVisible()
  await expect(map.locator('.key-swatch.key-rebel')).toHaveCount(1)

  await slider.fill('12')
  await expect(map.locator('.time-map-title')).toHaveText('1621: Two trading companies')
  await expect(map.locator('.hist-voc')).toHaveCount(6)
  await expect(map.locator('.hist-wic')).toHaveCount(6)
  await expect(map.locator('.key-swatch.key-voc')).toHaveCount(1)

  await slider.fill('13')
  await expect(map.locator('.time-map-title')).toHaveText('1642: The Night Watch')
  await expect(map.locator('.hist-voc')).toHaveCount(0)
  await expect(map.locator('.hist-workshop:not(.hist-gone)', { hasText: 'Rembrandt' })).toHaveCount(1)
  await expect(map.locator('.hist-workshop:not(.hist-gone)', { hasText: 'Frans Hals' })).toHaveCount(1)
  await expect(map.locator('.key-swatch.key-workshop')).toHaveCount(1)
  // The Republic and the Spanish Netherlands stay on behind the painters, with their key.
  await expect(map.locator('.hist-area-rebel').first()).toBeVisible()
  await expect(map.locator('.key-swatch.key-rebel')).toHaveCount(1)

  await slider.fill('17')
  await expect(map.locator('.time-map-title')).toHaveText('1678: The Peace of Nijmegen')
  await expect(map.locator('.hist-voc')).toHaveCount(0)
  await expect(map.locator('.hist-area-france')).not.toHaveCount(0)
  await expect(map.locator('.hist-area-austria')).toHaveCount(0)

  await slider.fill('18')
  await expect(map.locator('.time-map-title')).toHaveText('1714: The Austrian Netherlands')
  await expect(map.locator('.hist-area-austria').first()).toBeVisible()
  await expect(map.locator('.key-swatch.key-austria')).toHaveCount(1)

  await slider.fill('21')
  await expect(map.locator('.time-map-title')).toHaveText('1815: Waterloo and a new kingdom')
  await expect(map.locator('.hist-area-austria')).toHaveCount(0)
  await expect(map.locator('.hist-area-sister')).toHaveCount(0)
  await expect(map.locator('.hist-site', { hasText: 'Waterloo' })).toHaveCount(1)

  await expect(map.locator('.hist-area-belgium')).toHaveCount(0)

  await slider.fill('22')
  await expect(map.locator('.time-map-title')).toHaveText('1830: Revolution in Brussels')
  await expect(map.locator('.hist-area-belgium').first()).toBeVisible()
  await expect(map.locator('.key-swatch.key-belgium')).toHaveCount(1)

  await slider.fill('23')
  await expect(map.locator('.time-map-title')).toHaveText('1839: The Treaty of London')
  await expect(map.locator('.hist-area-duchy').first()).toBeVisible()

  await slider.fill('24')
  await expect(map.locator('.time-map-title')).toHaveText('1843: To France and Prussia')
  await expect(map.locator('.hist-area-coal')).toHaveCount(1)
  await expect(map.locator('.hist-mine').first()).toBeVisible()
  await expect(map.locator('.hist-area-duchy').first()).toBeVisible()
  await expect(map.locator('.key-swatch.key-coal')).toHaveCount(1)

  await slider.fill('25')
  await expect(map.locator('.time-map-title')).toHaveText('1856: Trains to Germany')
  await expect(map.locator('.hist-area-coal')).toHaveCount(0)
  // Only Limburg's old Domaniale mine; Belgium's collieries belong to the 1843 map.
  await expect(map.locator('.hist-mine')).toHaveCount(1)
  await expect(map.locator('.hist-rail').first()).toBeVisible()
  await expect(map.locator('.key-swatch.key-rail')).toHaveCount(1)
  await expect(map.locator('.hist-fort', { hasText: 'Maastricht' })).toHaveCount(0)

  await slider.fill('27')
  await expect(map.locator('.time-map-title')).toHaveText('1890: Luxembourg goes its own way')
  await expect(map.locator('.hist-area-duchy')).toHaveCount(0)

  await slider.fill('29')
  await expect(map.locator('.time-map-title')).toHaveText('1915: An occupied country')
  await expect(map.locator('.hist-front')).toHaveCount(1)
  await expect(map.locator('.hist-line.hist-barrier')).toHaveCount(1)
  await expect(map.locator('.hist-area-occupied').first()).toBeVisible()

  await slider.fill('30')
  await expect(map.locator('.time-map-title')).toHaveText('1917: De Stijl')
  await expect(map.locator('.hist-front')).toHaveCount(0)
  await expect(map.locator('.hist-workshop:not(.hist-gone)', { hasText: 'Theo van Doesburg' })).toHaveCount(1)
  await expect(map.locator('.hist-workshop:not(.hist-gone)', { hasText: 'Piet Mondrian' })).toHaveCount(1)
  await expect(map.locator('.hist-village', { hasText: 'Laren' })).toHaveCount(1)
  await expect(map.locator('.key-swatch.key-workshop')).toHaveCount(1)

  await slider.fill('31')
  await expect(map.locator('.time-map-title')).toHaveText('May 1940: Five days of war')
  await expect(map.locator('.hist-rail')).toHaveCount(0)
  await expect(map.locator('.hist-area-occupied').first()).toBeVisible()
  await expect(map.locator('.hist-area-free')).toHaveCount(0)

  await slider.fill('32')
  await expect(map.locator('.time-map-title')).toHaveText('November 1944: The Scheldt, and the Hunger Winter')
  await expect(map.locator('.hist-area-free').first()).toBeVisible()
  await expect(map.locator('.hist-alert', { hasText: 'HUNGER WINTER' })).toHaveCount(1)
  await expect(map.locator('.key-swatch.key-free')).toHaveCount(1)

  await slider.fill('33')
  await expect(map.locator('.time-map-title')).toHaveText('May 1945: Liberation')
  await expect(map.locator('.hist-area-occupied')).toHaveCount(0)
  await expect(map.locator('.hist-alert', { hasText: 'HUNGER WINTER' })).toHaveCount(0)
  await expect(map.locator('.hist-grave')).toHaveCount(4)

  await slider.fill('34')
  await expect(map.locator('.time-map-title')).toHaveText('1953: The great flood')
  await expect(map.locator('.hist-area-flooded').first()).toBeVisible()
  await expect(map.locator('.hist-breach')).toHaveCount(4)
  await expect(map.locator('.key-swatch.key-flooded')).toHaveCount(1)

  await expect(map.locator('.hist-area-dutch')).toHaveCount(0)

  await slider.fill('35')
  await expect(map.locator('.time-map-title')).toHaveText('1958: Expo 58 and the Atomium')
  await expect(map.getByText('Atomium', { exact: true })).toBeVisible()
  await expect(map.locator('.key-swatch.key-nouveau')).toHaveCount(1)
  // The Delta Works carry on beside the buildings.
  await expect(map.locator('.hist-area-flooded')).toHaveCount(0)

  await slider.fill('36')
  await expect(map.locator('.time-map-title')).toHaveText('1963: The language border is fixed')
  await expect(map.locator('.hist-area-german')).toHaveCount(2)
  await expect(map.locator('.key-swatch.key-dutch')).toHaveCount(1)
  await expect(map.locator('.key-swatch.key-facility')).toHaveCount(0)

  await slider.fill('37')
  await expect(map.locator('.time-map-title')).toHaveText('1986: Gates for the Oosterschelde')
  await expect(map.locator('.hist-area-flooded')).toHaveCount(0)
  await expect(map.locator('.hist-breach:not(.hist-gone)')).toHaveCount(0)
  // The language areas stay on beside the Delta Works, with their key.
  await expect(map.locator('.hist-area-bilingual')).toHaveCount(1)
  await expect(map.locator('.key-swatch.key-bilingual')).toHaveCount(1)

  await slider.fill('38')
  await expect(map.locator('.time-map-title')).toHaveText('1993: A federal state')

  await slider.fill('39')
  await expect(map.locator('.time-map-title')).toHaveText('1997: The Delta Works are complete')
  await expect(map.locator('.hist-area-free')).toHaveCount(0)
  await expect(map.locator('.hist-rail')).toHaveCount(0)
  await expect(map.locator('.hist-area-belgium')).toHaveCount(0)
  await expect(map.locator('.hist-area-rebel')).toHaveCount(0)
  await expect(map.locator('.hist-dam').first()).toBeVisible()

  await slider.fill('40')
  await expect(map.locator('.time-map-title')).toHaveText('2012: Brussels-Halle-Vilvoorde is split')
  await expect(map.locator('.hist-dam')).toHaveCount(0)
  await expect(map.locator('.hist-area-french').first()).toBeVisible()

  await page.getByRole('button', { name: 'Back to the course' }).click()
  await expect(page.locator('.review')).toBeVisible()
})

test('plays all of unit 6 and the checkpoint without errors', async ({ page }) => {
  const errors: string[] = []
  page.on('pageerror', (e) => errors.push(e.message))
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()))
  await page.goto('/')

  const shots = process.env.SHOTS
  for (const name of [
    'Amsterdam, warehouse of the world',
    'The VOC and tulip mania',
    'A republic of provinces',
    'Rembrandt and Frans Hals',
    'Vermeer, Delft and the microscope',
    'Rubens and the Spanish Netherlands',
  ]) {
    await playLesson(page, name, shots)
    await expect(page.locator('.results h1')).toBeVisible()
    await page.getByRole('button', { name: 'Continue' }).click()
  }
  await playLesson(page, 'Unit 6 checkpoint', shots)
  await page.getByRole('button', { name: 'Continue' }).click()
  expect(errors).toEqual([])
})

test('the Amsterdam map grows ring by ring on its canals', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: 'Amsterdam, warehouse of the world', exact: true }).click()

  const map = page.locator('.time-map')
  const year = map.getByRole('slider', { name: 'Year' })
  await expect(map.locator('.city-map')).toBeVisible()
  await expect(map.locator('.city-water')).toBeVisible()
  await expect(map.locator('.time-map-title')).toHaveText('About 1550: A walled town on the IJ')
  await expect(map.locator('.hist-area-city')).toHaveCount(1)

  await year.fill('1613')
  await expect(map.locator('.time-map-title')).toHaveText('1613: The canal ring')
  await expect(map.locator('.hist-area-city')).toHaveCount(3)
  // Only the newest ring is marked as just added.
  await expect(map.locator('.hist-area-new')).toHaveCount(1)

  await year.fill('1663')
  await expect(map.locator('.hist-area-city')).toHaveCount(4)
  await expect(map.locator('.hist-wall').first()).toBeVisible()
})

test('the Spanish Netherlands shrink as France takes town after town', async ({ page }) => {
  await unlock(page, ['u6-l1', 'u6-l2', 'u6-l3', 'u6-l4', 'u6-l5'])
  await page.getByRole('button', { name: 'Rubens and the Spanish Netherlands', exact: true }).click()
  await skipTo(page, 'Find the year')

  const map = page.locator('.time-map')
  const year = map.getByRole('slider', { name: 'Year' })
  await year.fill('1648')
  await expect(map.locator('.hist-area-france')).toHaveCount(0)
  await year.fill('1668')
  await expect(map.locator('.hist-area-france')).toHaveCount(4)
  await page.locator('.lesson-foot').getByRole('button', { name: 'Check' }).click()
  await expect(page.locator('.feedback-head')).toHaveText('Correct!')
})

test('odd one out needs the right picture and the right reason', async ({ page }) => {
  await unlock(page, ['u6-l1', 'u6-l2', 'u6-l3'])
  await page.getByRole('button', { name: 'Rembrandt and Frans Hals', exact: true }).click()
  await skipTo(page, 'Odd one out')

  const foot = page.locator('.lesson-foot')
  await page.locator('.exercise-odd .option', { hasText: 'The Arnolfini Portrait' }).click()
  await page.locator('.odd-reasons .option', { hasText: 'It is a portrait of real people' }).click()
  await foot.getByRole('button', { name: 'Check' }).click()
  await expect(page.locator('.feedback-head')).toHaveText('Not quite')
  await expect(page.locator('.feedback-detail')).toContainText('Right one, wrong reason.')
})

test('a painting can be zoomed into, and a detail hunt still scores when zoomed', async ({ page }) => {
  await unlock(page, ['u6-l1', 'u6-l2', 'u6-l3'])
  await page.getByRole('button', { name: 'Rembrandt and Frans Hals', exact: true }).click()
  const foot = page.locator('.lesson-foot')
  await expect(page.locator('.zoom-frame')).toBeVisible()
  await page.getByRole('button', { name: 'Zoom in' }).click()
  await expect(page.locator('.zoom-frame.is-zoomed')).toBeVisible()
  await page.getByRole('button', { name: 'Whole picture' }).click()
  await expect(page.locator('.zoom-frame.is-zoomed')).toHaveCount(0)
  await foot.getByRole('button', { name: 'Continue' }).click()

  // The girl with the chicken in the Night Watch.
  await expect(page.locator('.eyebrow').first()).toHaveText('Find the detail')
  await page.getByRole('button', { name: 'Zoom in' }).click()
  const box = (await page.locator('.hunt-image img').boundingBox())!
  await page.mouse.click(box.x + box.width * 0.31, box.y + box.height * 0.72)
  await foot.getByRole('button', { name: 'Check' }).click()
  await expect(page.locator('.feedback-head')).toHaveText('Correct!')
})

test('once loaded, the app and its pictures work offline', async ({ page, context }) => {
  await page.goto('/')
  await page.evaluate(async () => {
    await navigator.serviceWorker.ready
  })
  await page.reload()
  await expect.poll(() => page.evaluate(() => !!navigator.serviceWorker.controller)).toBe(true)

  await context.setOffline(true)
  await page.reload()
  await expect(page.locator('.brand')).toHaveText('Lage Landen')
  await page.getByRole('button', { name: 'Philip II and the Iconoclastic Fury', exact: true }).click()
  await page.locator('.lesson-foot').getByRole('button', { name: 'Continue' }).click()
  const img = page.locator('.lesson-body img').first()
  await expect(img).toBeVisible()
  await expect.poll(() => img.evaluate((el: HTMLImageElement) => el.complete && el.naturalWidth > 0)).toBe(true)
})

test('plays all of unit 7 and the checkpoint without errors', async ({ page }) => {
  const errors: string[] = []
  page.on('pageerror', (e) => errors.push(e.message))
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()))
  await page.goto('/')

  const shots = process.env.SHOTS
  for (const name of [
    'Round the Cape to the spice islands',
    'Japan, Ceylon and the Cape',
    'The West India Company',
    'The Atlantic slave trade',
    'Suriname, Curaçao and resistance',
    'Keti Koti: the end of slavery',
  ]) {
    await playLesson(page, name, shots)
    await expect(page.locator('.results h1')).toBeVisible()
    await page.getByRole('button', { name: 'Continue' }).click()
  }
  await playLesson(page, 'Unit 7 checkpoint', shots)
  await page.getByRole('button', { name: 'Continue' }).click()
  expect(errors).toEqual([])
})

test('the world map follows the ships from Asia to the Caribbean', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: 'Round the Cape to the spice islands', exact: true }).click()
  await page.locator('.lesson-foot').getByRole('button', { name: 'Continue' }).click()

  const map = page.locator('.time-map')
  const year = map.getByRole('slider', { name: 'Year' })
  await expect(map.locator('.world-map')).toBeVisible()
  await expect(map.locator('.time-map-title')).toHaveText('1602: The VOC is founded')
  await expect(map.locator('.hist-flow-asia')).toHaveCount(1)
  await expect(map.locator('.hist-wic')).toHaveCount(0)

  await year.fill('1640')
  await expect(map.locator('.time-map-title')).toHaveText('1640: Galle on Ceylon')
  await expect(map.locator('.hist-flow-enslaved')).toHaveCount(1)
  await expect(map.locator('.hist-wic')).not.toHaveCount(0)
  await expect(map.locator('.key-swatch.key-enslaved')).toHaveCount(1)

  // New Amsterdam is English from 1664, so its post greys out.
  await year.fill('1664')
  await expect(map.locator('.hist-wic.hist-gone')).not.toHaveCount(0)

  await year.fill('1863')
  await expect(map.locator('.time-map-title')).toHaveText('1863: Keti Koti')
  await expect(map.locator('.hist-flow-enslaved')).toHaveCount(0)
})

test('a lesson with a content note shows it first and ends calmly', async ({ page }) => {
  await unlock(page, ['u7-l1', 'u7-l2', 'u7-l3', 'u7-l4', 'u7-l5'])
  const foot = page.locator('.lesson-foot')
  await page.getByRole('button', { name: 'Keti Koti: the end of slavery', exact: true }).click()
  await expect(page.locator('.eyebrow').first()).toHaveText('Content note')
  await expect(page.locator('.content-note')).toContainText('end of slavery')
  await foot.getByRole('button', { name: 'Continue' }).click()
  await expect(page.locator('.story')).toBeVisible()
  await foot.getByRole('button', { name: 'Continue' }).click()

  // True or myth: the freed people had to work on under state supervision.
  await page.getByRole('button', { name: 'Myth' }).click()
  await foot.getByRole('button', { name: 'Check' }).click()
  await expect(page.locator('.feedback-head')).toHaveText(/^Correct/)
  await expect(page.locator('.feedback-head')).not.toContainText('!')
  await foot.getByRole('button', { name: 'Continue' }).click()

  await skipTo(page, 'Two voices')
  await expect(page.locator('.exercise-voices .voice')).toHaveCount(2)
  await expect(page.locator('.exercise-voices cite').first()).toContainText('Mark Rutte')
  await page.locator('.exercise-voices .option', { hasText: 'Concrete steps' }).click()
  await foot.getByRole('button', { name: 'Check' }).click()
  await expect(page.locator('.feedback-head')).toHaveText(/^Correct/)

  for (let step = 0; step < 10 && !(await page.locator('.results').count()); step++) {
    await foot.getByRole('button', { name: 'Continue' }).click()
    if (await page.locator('.results').count()) break
    await answer(page)
  }
  await expect(page.locator('.results h1')).toHaveText('Lesson complete')
})

test('plays all of unit 8 and the checkpoint without errors', async ({ page }) => {
  const errors: string[] = []
  page.on('pageerror', (e) => errors.push(e.message))
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()))
  await page.goto('/')

  const shots = process.env.SHOTS
  for (const name of [
    'The Disaster Year',
    'A Dutch king for England',
    'The Austrian Netherlands',
    'Patriots and Brabanters',
    'Under French rule',
    'Orange returns, and Waterloo',
  ]) {
    await playLesson(page, name, shots)
    await expect(page.locator('.results h1')).toBeVisible()
    await page.getByRole('button', { name: 'Continue' }).click()
  }
  await playLesson(page, 'Unit 8 checkpoint', shots)
  await page.getByRole('button', { name: 'Continue' }).click()
  expect(errors).toEqual([])
})

test('the border map changes hands year by year from 1672 to 1815', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: 'The Disaster Year', exact: true }).click()

  const map = page.locator('.time-map')
  const year = map.getByRole('slider', { name: 'Year' })
  await expect(map.locator('.time-map-title')).toHaveText('1672: The Disaster Year')
  await expect(map.locator('.hist-area-france')).not.toHaveCount(0)
  await expect(map.locator('.hist-area-austria')).toHaveCount(0)

  // Utrecht hands the south from Spain to Austria.
  await year.fill('1714')
  await expect(map.locator('.time-map-title')).toHaveText('1714: The Austrian Netherlands')
  await expect(map.locator('.hist-area-austria').first()).toBeVisible()
  await expect(map.locator('.hist-area-ruled')).toHaveCount(0)
  await expect(map.locator('.key-swatch.key-austria')).toHaveCount(1)

  await year.fill('1795')
  await expect(map.locator('.time-map-title')).toHaveText('1795: The Batavian Republic')
  await expect(map.locator('.hist-area-sister').first()).toBeVisible()
  await expect(map.locator('.hist-area-austria')).toHaveCount(0)

  // In 1810 Napoleon annexes Holland, so the sister republic is gone.
  await year.fill('1810')
  await expect(map.locator('.time-map-title')).toHaveText('1810: Part of France')
  await expect(map.locator('.hist-area-sister')).toHaveCount(0)

  await year.fill('1815')
  await expect(map.locator('.time-map-title')).toHaveText('1815: Waterloo and a new kingdom')
  await expect(map.locator('.hist-site', { hasText: 'Waterloo' })).toHaveCount(1)
})

test('plays all of unit 9 and the checkpoint without errors', async ({ page }) => {
  const errors: string[] = []
  page.on('pageerror', (e) => errors.push(e.message))
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()))
  await page.goto('/')

  const shots = process.env.SHOTS
  for (const name of [
    'One kingdom',
    'The merchant king',
    'The September Days',
    'A king for the Belgians',
    'Ten days and nine years',
    'The line is drawn',
  ]) {
    await playLesson(page, name, shots)
    await expect(page.locator('.results h1')).toBeVisible()
    await page.getByRole('button', { name: 'Continue' }).click()
  }
  await playLesson(page, 'Unit 9 checkpoint', shots)
  await page.getByRole('button', { name: 'Continue' }).click()
  expect(errors).toEqual([])
})

test('the kingdom map splits in 1830 and is settled in 1839', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: 'One kingdom', exact: true }).click()

  const map = page.locator('.time-map')
  const year = map.getByRole('slider', { name: 'Year' })
  await expect(map.locator('.time-map-title')).toHaveText('1815: One kingdom')
  await expect(map.locator('.hist-area-belgium')).toHaveCount(0)
  await expect(map.locator('.hist-area-duchy').first()).toBeVisible()

  await year.fill('1830')
  await expect(map.locator('.time-map-title')).toHaveText('1830: Revolution in Brussels')
  await expect(map.locator('.hist-area-belgium').first()).toBeVisible()
  await expect(map.locator('.hist-area-duchy')).toHaveCount(0)
  await expect(map.locator('.key-swatch.key-belgium')).toHaveCount(1)

  // The Treaty of London gives half of Limburg and half of Luxembourg back.
  await year.fill('1839')
  await expect(map.locator('.time-map-title')).toHaveText('1839: The Treaty of London')
  await expect(map.locator('.hist-area-duchy').first()).toBeVisible()
  await expect(map.locator('.hist-area-belgium').first()).toBeVisible()
})

test('a before and after map wipes from one year to the other', async ({ page }) => {
  await unlock(page, ['u9-l1', 'u9-l2', 'u9-l3', 'u9-l4', 'u9-l5'])
  await page.getByRole('button', { name: 'The line is drawn', exact: true }).click()

  const compare = page.locator('.compare-map')
  await expect(compare.locator('.compare-tag-before')).toHaveText('1815')
  await expect(compare.locator('.compare-tag-after')).toHaveText('1839')
  await expect(compare.locator('.compare-captions')).toContainText('1815: One kingdom')
  await expect(compare.locator('.compare-captions')).toContainText('1839: The Treaty of London')
  // The earlier map, on top, has no Belgium; the later one, underneath, does.
  await expect(compare.locator('.compare-before .hist-area-belgium')).toHaveCount(0)
  await expect(compare.locator('.compare-layer').first().locator('.hist-area-belgium').first()).toBeAttached()

  const wipe = compare.getByRole('slider', { name: 'Before and after' })
  await expect(wipe).toHaveValue('50')
  await wipe.fill('10')
  await expect(compare.locator('.compare-before')).toHaveAttribute('style', /inset\(0px 90% 0px 0px\)|inset\(0 90% 0 0\)/)
  await wipe.focus()
  await page.keyboard.press('ArrowRight')
  await expect(wipe).toHaveValue('11')
})

test('plays all of unit 10 and the checkpoint without errors', async ({ page }) => {
  const errors: string[] = []
  page.on('pageerror', (e) => errors.push(e.message))
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()))
  await page.goto('/')

  const shots = process.env.SHOTS
  for (const name of [
    "Thorbecke's constitution",
    'Coffee, sugar and Max Havelaar',
    'Schools and pillars',
    'Workers, women and the vote',
    'A modern country',
    'Van Gogh and the painters of his time',
  ]) {
    await playLesson(page, name, shots)
    await expect(page.locator('.results h1')).toBeVisible()
    await page.getByRole('button', { name: 'Continue' }).click()
  }
  await playLesson(page, 'Unit 10 checkpoint', shots)
  await page.getByRole('button', { name: 'Continue' }).click()
  expect(errors).toEqual([])
})

test('the pillar diagram brings one pillar forward at a time', async ({ page }) => {
  await unlock(page, ['u10-l1', 'u10-l2'])
  await page.getByRole('button', { name: 'Schools and pillars', exact: true }).click()

  const diagram = page.locator('figure.pillars')
  await expect(diagram.locator('.pillar')).toHaveCount(4)
  await expect(diagram.locator('.pillar-dim')).toHaveCount(0)
  await expect(diagram.locator('.pillar-catholic')).toContainText('KRO')

  await diagram.getByRole('button', { name: 'Socialist' }).click()
  await expect(diagram.getByRole('button', { name: 'Socialist' })).toHaveAttribute('aria-pressed', 'true')
  await expect(diagram.locator('.pillar-dim')).toHaveCount(3)
  await diagram.getByRole('button', { name: 'Socialist' }).click()
  await expect(diagram.locator('.pillar-dim')).toHaveCount(0)
})

test('the railway map connects the country from 1839 to 1914', async ({ page }) => {
  await unlock(page, ['u10-l1', 'u10-l2', 'u10-l3', 'u10-l4'])
  await page.getByRole('button', { name: 'A modern country', exact: true }).click()

  const map = page.locator('.time-map')
  const year = map.getByRole('slider', { name: 'Year' })
  await expect(map.locator('.time-map-title')).toHaveText('1839: The first train')
  await expect(map.locator('.hist-area-duchy').first()).toBeVisible()
  // The Haarlemmermeer is still water, and drained by 1852.
  await expect(map.locator('.hist-area-sea')).toHaveCount(2)

  await year.fill('1852')
  await expect(map.locator('.time-map-title')).toHaveText('1852: The Haarlemmermeer is dry')
  await expect(map.locator('.hist-area-sea')).toHaveCount(1)

  await year.fill('1890')
  await expect(map.locator('.time-map-title')).toHaveText('1890: Luxembourg goes its own way')
  await expect(map.locator('.hist-area-duchy')).toHaveCount(0)
  await expect(map.locator('.key-swatch.key-rail')).toHaveCount(1)

  await year.fill('1914')
  await expect(map.locator('.time-map-title')).toHaveText('1914: Neutral in a world war')
})

test('plays all of unit 11 and the checkpoint without errors', async ({ page }) => {
  const errors: string[] = []
  page.on('pageerror', (e) => errors.push(e.message))
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()))
  await page.goto('/')

  const shots = process.env.SHOTS
  for (const name of [
    'Neutral in the Great War',
    'Five days in May',
    'Persecution and Anne Frank',
    'Hiding, resistance and hunger',
    'Liberation',
    "Indonesia's war of independence",
  ]) {
    await playLesson(page, name, shots)
    await expect(page.locator('.results h1')).toBeVisible()
    await page.getByRole('button', { name: 'Continue' }).click()
  }
  await playLesson(page, 'Unit 11 checkpoint', shots)
  await page.getByRole('button', { name: 'Continue' }).click()
  expect(errors).toEqual([])
})

test('the occupation map moves month by month from May 1940 to liberation', async ({ page }) => {
  await unlock(page, ['u11-l1'])
  await page.getByRole('button', { name: 'Five days in May', exact: true }).click()

  const map = page.locator('.time-map')
  const month = map.getByRole('slider', { name: 'Month' })
  await expect(map.locator('.time-map-title')).toHaveText('May 1940: Five days of war')
  await expect(month).toHaveAttribute('aria-valuetext', 'May 1940')
  await expect(map.locator('.hist-area-occupied').first()).toBeVisible()
  await expect(map.locator('.hist-area-free')).toHaveCount(0)

  // The slider counts months: year * 12 + month - 1.
  await month.fill(String(1944 * 12 + 8))
  await expect(map.locator('.time-map-title')).toHaveText('September 1944: Belgium is free, and Market Garden')
  await expect(month).toHaveAttribute('aria-valuetext', 'September 1944')
  await expect(map.locator('.hist-area-free').first()).toBeVisible()
  await expect(map.locator('.key-swatch.key-free')).toHaveCount(1)

  await month.fill(String(1944 * 12 + 10))
  await expect(map.locator('.hist-alert', { hasText: 'HUNGER WINTER' })).toHaveCount(1)

  await month.fill(String(1945 * 12 + 4))
  await expect(map.locator('.time-map-title')).toHaveText('May 1945: Liberation')
  await expect(map.locator('.hist-area-occupied')).toHaveCount(0)
  // The Canadian war cemeteries, from Unit 14's war-graves layer.
  await expect(map.locator('.hist-grave')).toHaveCount(4)
  await expect(map.locator('.key-swatch.key-grave')).toHaveCount(1)
})

test('plays all of unit 12 and the checkpoint without errors', async ({ page }) => {
  const errors: string[] = []
  page.on('pageerror', (e) => errors.push(e.message))
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()))
  await page.goto('/')

  const shots = process.env.SHOTS
  for (const name of [
    'A dam, a slump and a safety net',
    'The night of the flood',
    'The Delta Works',
    'Pillars crumble, Provo plays',
    'Suriname and the Caribbean',
    'Tolerance and its limits',
  ]) {
    await playLesson(page, name, shots)
    await expect(page.locator('.results h1')).toBeVisible()
    await page.getByRole('button', { name: 'Continue' }).click()
  }
  await playLesson(page, 'Unit 12 checkpoint', shots)
  await page.getByRole('button', { name: 'Continue' }).click()
  expect(errors).toEqual([])
})

test('the delta map floods in 1953 and closes the sea arms one by one', async ({ page }) => {
  await unlock(page, ['u12-l1'])
  await page.getByRole('button', { name: 'The night of the flood', exact: true }).click()

  const map = page.locator('.time-map')
  const year = map.getByRole('slider', { name: 'Year' })
  await expect(map.locator('.delta-map')).toBeVisible()
  await expect(map.locator('.time-map-title')).toHaveText('1952: Open to the sea')
  await expect(map.locator('.hist-area-flooded')).toHaveCount(0)

  await year.fill('1953')
  await expect(map.locator('.time-map-title')).toHaveText('1953: The flood')
  await expect(map.locator('.hist-area-flooded').first()).toBeVisible()
  await expect(map.locator('.hist-breach')).toHaveCount(4)
  await expect(map.locator('.key-swatch.key-flooded')).toHaveCount(1)
  await expect(map.locator('.hist-dam')).toHaveCount(0)

  await year.fill('1971')
  await expect(map.locator('.hist-area-flooded')).toHaveCount(0)
  await expect(map.locator('.hist-breach:not(.hist-gone)')).toHaveCount(0)
  await expect(map.locator('.hist-dam')).toHaveCount(6)

  await year.fill('1997')
  await expect(map.locator('.time-map-title')).toHaveText("1997: Rotterdam's gates")
  await expect(map.locator('.hist-dam')).toHaveCount(8)
  await expect(map.locator('.hist-barrier')).not.toHaveCount(0)
})

test('the storm barrier drops its gates at 3 metres, and the polder floods without it', async ({ page }) => {
  await unlock(page, ['u12-l1', 'u12-l2'])
  const foot = page.locator('.lesson-foot')
  await page.getByRole('button', { name: 'The Delta Works', exact: true }).click()
  for (let step = 0; step < 10 && !(await page.locator('.storm-barrier').count()); step++) {
    await answer(page)
    await foot.getByRole('button', { name: 'Continue' }).click()
  }
  const barrier = page.locator('.storm-barrier')
  const sea = barrier.getByRole('slider', { name: 'Sea level in metres above NAP' })
  await expect(barrier.getByRole('img')).toHaveAttribute('aria-label', /gates are open/)

  await sea.fill('3')
  await expect(barrier.getByRole('img')).toHaveAttribute('aria-label', /gates are closed/)
  await expect(barrier.getByRole('img')).not.toHaveAttribute('aria-label', /floods the polder/)

  await sea.fill('5')
  await barrier.getByRole('button', { name: 'Take the barrier away' }).click()
  await expect(barrier.getByRole('img')).toHaveAttribute('aria-label', /no barrier.*floods the polder/)
  await barrier.getByRole('button', { name: 'Put the barrier back' }).click()
  await expect(barrier.getByRole('img')).not.toHaveAttribute('aria-label', /floods the polder/)
})

test('plays all of unit 13 and the checkpoint without errors', async ({ page }) => {
  const errors: string[] = []
  page.on('pageerror', (e) => errors.push(e.message))
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()))
  await page.goto('/')

  const shots = process.env.SHOTS
  for (const name of [
    'The first trains on the continent',
    'Coal country',
    "Leopold's Congo",
    'The Belgian Congo',
    'Independence and Lumumba',
    'Statues, museums and apologies',
  ]) {
    await playLesson(page, name, shots)
    await expect(page.locator('.results h1')).toBeVisible()
    await page.getByRole('button', { name: 'Continue' }).click()
  }
  await playLesson(page, 'Unit 13 checkpoint', shots)
  await page.getByRole('button', { name: 'Continue' }).click()
  expect(errors).toEqual([])
})

test("Belgium's railway map grows out of Mechelen, over the coal belt", async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: 'The first trains on the continent', exact: true }).click()

  const map = page.locator('.time-map')
  const year = map.getByRole('slider', { name: 'Year' })
  await expect(map.locator('.time-map-title')).toHaveText('1835: The first train on the continent')
  await expect(map.locator('.hist-rail')).toHaveCount(1)
  await expect(map.locator('.hist-area-coal')).toHaveCount(1)
  await expect(map.locator('.hist-mine')).toHaveCount(5)
  await expect(map.locator('.key-swatch.key-mine')).toHaveCount(1)

  await year.fill('1843')
  await expect(map.locator('.time-map-title')).toHaveText('1843: To France and Prussia')
  await expect(map.locator('.hist-rail')).toHaveCount(11)
  await expect(map.locator('.hist-alert', { hasText: 'STRIKES' })).toHaveCount(0)

  await year.fill('1886')
  await expect(map.locator('.hist-alert', { hasText: 'STRIKES' })).toHaveCount(1)
  await expect(map.locator('.hist-people', { hasText: 'GERMANY' })).toHaveCount(1)
  await expect(map.locator('.hist-people', { hasText: 'PRUSSIA' })).toHaveCount(0)
})

test('the Congo map goes from the Free State to the Belgian Congo to independence', async ({ page }) => {
  await unlock(page, ['u13-l1', 'u13-l2'])
  await page.getByRole('button', { name: "Leopold's Congo", exact: true }).click()
  // The content note comes first.
  await expect(page.locator('.content-note')).toBeVisible()
  await page.locator('.lesson-foot').getByRole('button', { name: 'Continue' }).click()

  const map = page.locator('.time-map')
  const year = map.getByRole('slider', { name: 'Year' })
  await expect(map.locator('.africa-map')).toBeVisible()
  await expect(map.locator('.time-map-title')).toHaveText('1876: Kingdoms and peoples')
  await expect(map.locator('.hist-area-ruled')).toHaveCount(0)

  await year.fill('1885')
  await expect(map.locator('.hist-area-ruled')).toHaveCount(1)
  await expect(map.locator('.key-swatch.key-ruled')).toHaveCount(1)

  await year.fill('1908')
  await expect(map.locator('.time-map-title')).toHaveText('1908: The Belgian Congo')
  await expect(map.locator('.hist-area-ruled')).toHaveCount(0)
  await expect(map.locator('.hist-area-belgium')).toHaveCount(1)
  await expect(map.locator('.hist-alert', { hasText: 'RUBBER QUOTAS' })).toHaveCount(0)

  await year.fill('1960')
  await expect(map.locator('.hist-area-free')).toHaveCount(1)
  await expect(map.locator('.hist-area-contested')).toHaveCount(1)
  await expect(map.locator('.hist-alert', { hasText: 'KATANGA' })).toHaveCount(1)
})

test('plays all of unit 14 and the checkpoint without errors', async ({ page }) => {
  const errors: string[] = []
  page.on('pageerror', (e) => errors.push(e.message))
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()))
  await page.goto('/')

  const shots = process.env.SHOTS
  for (const name of [
    'Brave little Belgium',
    'Holding the Yser',
    'Ypres, gas and In Flanders Fields',
    'Passchendaele and the war graves',
    'Eighteen days and four years',
    'Liberation, the Bulge and the king',
  ]) {
    await playLesson(page, name, shots)
    await expect(page.locator('.results h1')).toBeVisible()
    await page.getByRole('button', { name: 'Continue' }).click()
  }
  await playLesson(page, 'Unit 14 checkpoint', shots)
  await page.getByRole('button', { name: 'Continue' }).click()
  expect(errors).toEqual([])
})

test('the Westhoek map holds the Yser, moves the salient and fills with war graves', async ({ page }) => {
  await unlock(page, ['u14-l1'])
  await page.getByRole('button', { name: 'Holding the Yser', exact: true }).click()

  const map = page.locator('.time-map')
  const month = map.getByRole('slider', { name: 'Month' })
  await expect(map.locator('.westhoek-map')).toBeVisible()
  await expect(map.locator('.time-map-title')).toHaveText('October 1914: The Yser and Ypres')
  await expect(map.locator('.hist-area-flooded')).toHaveCount(1)
  await expect(map.locator('.hist-front')).toHaveCount(3)
  await expect(map.locator('.key-swatch.key-front')).toHaveCount(1)
  await expect(map.locator('.hist-grave')).toHaveCount(0)

  await month.fill(String(1915 * 12 + 3))
  await expect(map.locator('.time-map-title')).toHaveText('April 1915: Gas')
  await expect(map.locator('.hist-alert', { hasText: 'GAS' })).toHaveCount(1)

  await month.fill(String(1917 * 12 + 10))
  await expect(map.locator('.time-map-title')).toHaveText('November 1917: Passchendaele')
  await expect(map.locator('.hist-grave')).toHaveCount(4)
  await expect(map.locator('.hist-memorial')).toHaveCount(0)

  // Cemeteries and memorials laid out after the war appear with the Armistice.
  await month.fill(String(1918 * 12 + 10))
  await expect(map.locator('.hist-grave')).toHaveCount(5)
  await expect(map.locator('.hist-memorial')).toHaveCount(5)
  await expect(map.locator('.hist-alert', { hasText: 'GAS' })).toHaveCount(0)
})

test('plays all of unit 15 and the checkpoint without errors', async ({ page }) => {
  const errors: string[] = []
  page.on('pageerror', (e) => errors.push(e.message))
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()))
  await page.goto('/')

  const shots = process.env.SHOTS
  for (const name of [
    'A language of their own',
    'Drawing the line',
    'Leuven Vlaams',
    'Six state reforms',
    'Brussels, capital of Europe',
    'One country, three languages',
  ]) {
    await playLesson(page, name, shots)
    await expect(page.locator('.results h1')).toBeVisible()
    await page.getByRole('button', { name: 'Continue' }).click()
  }
  await playLesson(page, 'Unit 15 checkpoint', shots)
  await page.getByRole('button', { name: 'Continue' }).click()
  expect(errors).toEqual([])
})

test('the language map draws the line of 1963, facilities and Brussels-Halle-Vilvoorde', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: 'A language of their own', exact: true }).click()

  const map = page.locator('.time-map')
  const year = map.getByRole('slider', { name: 'Year' })
  await expect(map.locator('.belgium-map')).toBeVisible()
  await expect(map.locator('.time-map-title')).toHaveText('1830: One state, one language of power')
  await expect(map.locator('.hist-area-abroad')).toHaveCount(1)
  await expect(map.locator('.hist-area-german')).toHaveCount(0)

  await year.fill('1920')
  await expect(map.locator('.time-map-title')).toHaveText('1920: The East Cantons join Belgium')
  await expect(map.locator('.hist-area-abroad')).toHaveCount(0)
  await expect(map.locator('.hist-area-german')).toHaveCount(1)

  await year.fill('1963')
  await expect(map.locator('.time-map-title')).toHaveText('1963: The language border is fixed')
  await expect(map.locator('.hist-area-facility')).toHaveCount(2)
  await expect(map.locator('.hist-area-bhv')).toHaveCount(1)
  await expect(map.locator('.key-swatch.key-bhv')).toHaveCount(1)

  await year.fill('2012')
  await expect(map.locator('.time-map-title')).toHaveText('2012: Brussels-Halle-Vilvoorde is split')
  await expect(map.locator('.hist-area-bhv')).toHaveCount(0)
  await expect(map.locator('.hist-alert', { hasText: 'BHV SPLIT' })).toHaveCount(1)
})

test('the diagram of regions and communities says who runs what, and shares Brussels', async ({ page }) => {
  await unlock(page, ['u15-l1', 'u15-l2', 'u15-l3'])
  await page.getByRole('button', { name: 'Six state reforms', exact: true }).click()

  const diagram = page.locator('.federal')
  await expect(diagram.locator('.federal-panel')).toHaveCount(2)
  const communities = diagram.locator('.federal-panel').nth(1)
  await expect(communities.locator('.federal-runs')).toHaveText('Tap one to see what it runs.')
  await communities.getByRole('button', { name: 'Flemish Community' }).click()
  await expect(communities.getByRole('button', { name: 'Flemish Community' })).toHaveAttribute('aria-pressed', 'true')
  await expect(communities.locator('.federal-runs')).toContainText('Schools')
  await expect(communities.locator('.federal-runs')).toContainText('in Flanders and in Brussels')
  // Brussels is striped, as it belongs to two communities, and not dimmed when one of them is picked.
  await expect(communities.locator('.federal-part[style*="url"]')).toHaveCount(4)
  await expect(communities.locator('.federal-dim')).not.toHaveCount(0)

  const regions = diagram.locator('.federal-panel').first()
  await regions.getByRole('button', { name: 'Walloon Region' }).click()
  await expect(regions.locator('.federal-runs')).toContainText('Parliament in Namur')
})

test('plays all of unit 16 and the checkpoint without errors', async ({ page }) => {
  const errors: string[] = []
  page.on('pageerror', (e) => errors.push(e.message))
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()))
  await page.goto('/')

  const shots = process.env.SHOTS
  for (const name of [
    'The Ghent Altarpiece up close',
    'Tournai, Brussels and Leuven',
    'Bruges, market for masterpieces',
    "Bosch's dreams and nightmares",
    'Antwerp, the art market of Europe',
    "Bruegel's world",
  ]) {
    await playLesson(page, name, shots)
    await expect(page.locator('.results h1')).toBeVisible()
    await page.getByRole('button', { name: 'Continue' }).click()
  }
  await playLesson(page, 'Unit 16 checkpoint', shots)
  await page.getByRole('button', { name: 'Continue' }).click()
  expect(errors).toEqual([])
})

test('a painting tour glides from detail to detail, and a question opens on one detail', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: 'The Ghent Altarpiece up close', exact: true }).click()
  const foot = page.locator('.lesson-foot')
  const panel = page.locator('.tour-panel')

  await expect(page.locator('.tour-marker')).toHaveCount(7)
  await expect(page.locator('.zoom-frame.is-zoomed')).toHaveCount(0)
  await panel.getByRole('button', { name: 'Start the tour' }).click()
  await expect(panel.locator('.tour-title')).toHaveText('1. The king of heaven')
  await expect(page.locator('.zoom-frame.is-zoomed')).toBeVisible()
  await panel.getByRole('button', { name: 'Back' }).click()
  await expect(panel.locator('.tour-title')).toHaveCount(0)
  await expect(page.locator('.zoom-frame.is-zoomed')).toHaveCount(0)

  // A number tapped on the whole painting glides to its detail.
  await page.getByRole('button', { name: 'Detail 5: The Lamb on the altar' }).click()
  await expect(panel.locator('.tour-title')).toHaveText('5. The Lamb on the altar')
  await panel.getByRole('button', { name: 'Next detail' }).click()
  await panel.getByRole('button', { name: 'Next detail' }).click()
  await expect(panel.locator('.tour-title')).toHaveText('7. The Just Judges, a copy')
  await panel.getByRole('button', { name: 'Whole painting' }).click()
  await expect(panel.locator('.tour-title')).toHaveCount(0)
  await expect(page.locator('.zoom-frame.is-zoomed')).toHaveCount(0)
  await foot.getByRole('button', { name: 'Continue' }).click()

  // The question opens zoomed in on the lamb, without the numbers that would name it.
  await expect(page.locator('.tour-marker')).toHaveCount(0)
  await expect(page.locator('.zoom-frame.is-zoomed')).toBeVisible()
  await expect(page.locator('.tour .hint')).toBeVisible()
  await page.getByRole('button', { name: 'Whole picture' }).click()
  await expect(page.locator('.zoom-frame.is-zoomed')).toHaveCount(0)
})

test("the painters' map follows the workshops from Bruges to Antwerp, and Dürer's journey", async ({ page }) => {
  await unlock(page, ['u16-l1', 'u16-l2', 'u16-l3', 'u16-l4'])
  await page.getByRole('button', { name: 'Antwerp, the art market of Europe', exact: true }).click()

  const map = page.locator('.time-map')
  const year = map.getByRole('slider', { name: 'Year' })
  await expect(map.locator('.time-map-title')).toHaveText('1491: Metsys in Antwerp')
  await expect(map.locator('.hist-workshop:not(.hist-gone)', { hasText: 'Hans Memling' })).toHaveCount(1)

  await year.fill('1520')
  await expect(map.locator('.time-map-title')).toHaveText('1520: Dürer comes to see')
  await expect(map.locator('.hist-flow')).toHaveCount(1)
  await expect(map.locator('.key-swatch.key-flow')).toHaveCount(1)

  await year.fill('1566')
  await expect(map.locator('.time-map-title')).toHaveText('1566: The Iconoclastic Fury')
  await expect(map.locator('.hist-alert', { hasText: 'ICONOCLASTIC FURY' })).toHaveCount(1)
  await expect(map.locator('.hist-workshop:not(.hist-gone)', { hasText: 'Pieter Bruegel' })).toHaveCount(1)
  await expect(map.locator('.key-swatch.key-market')).toHaveCount(1)
})

test('plays all of unit 17 and the checkpoint without errors', async ({ page }) => {
  const errors: string[] = []
  page.on('pageerror', (e) => errors.push(e.message))
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()))
  await page.goto('/')

  const shots = process.env.SHOTS
  for (const name of [
    'Rubens and his workshop',
    'Candlelight from Utrecht',
    "Rembrandt's light and shadow",
    "Vermeer's quiet rooms",
    'A painting in every house',
    'Skies, seas and the end of an age',
  ]) {
    await playLesson(page, name, shots)
    await expect(page.locator('.results h1')).toBeVisible()
    await page.getByRole('button', { name: 'Continue' }).click()
  }
  await playLesson(page, 'Unit 17 checkpoint', shots)
  await page.getByRole('button', { name: 'Continue' }).click()
  expect(errors).toEqual([])
})

test('two paintings side by side glide to the same detail, and a question opens on one', async ({ page }) => {
  await unlock(page, ['u17-l1'])
  await page.getByRole('button', { name: 'Candlelight from Utrecht', exact: true }).click()
  const pair = page.locator('.pair')
  const looks = pair.getByRole('group', { name: 'Compare' })

  await expect(pair.locator('.pair-side')).toHaveCount(2)
  await expect(pair.locator('.zoom-frame.is-zoomed')).toHaveCount(0)
  await expect(looks.getByRole('button', { name: 'Side by side' })).toHaveAttribute('aria-pressed', 'true')
  await looks.getByRole('button', { name: 'The light' }).click()
  await expect(looks.getByRole('button', { name: 'The light' })).toHaveAttribute('aria-pressed', 'true')
  // Both paintings glide in together.
  await expect(pair.locator('.zoom-frame.is-zoomed')).toHaveCount(2)
  await expect(pair.locator('.tour-text')).toContainText('light')
  await looks.getByRole('button', { name: 'Side by side' }).click()
  await expect(pair.locator('.zoom-frame.is-zoomed')).toHaveCount(0)
  await page.locator('.lesson-foot').getByRole('button', { name: 'Continue' }).click()

  // The question opens on Matthew in both, without the buttons or the words that would answer it.
  await expect(page.locator('.pair .pair-looks')).toHaveCount(0)
  await expect(page.locator('.pair .zoom-frame.is-zoomed')).toHaveCount(2)
  await expect(page.locator('.pair .hint')).toBeVisible()
})

test("the Golden Age painters' map follows the painters north, and Rembrandt to Amsterdam", async ({ page }) => {
  await unlock(page, ['u17-l1', 'u17-l2', 'u17-l3', 'u17-l4'])
  await page.getByRole('button', { name: 'A painting in every house', exact: true }).click()
  await page.locator('.lesson-foot').getByRole('button', { name: 'Continue' }).click()

  const map = page.locator('.time-map')
  const year = map.getByRole('slider', { name: 'Year' })
  await expect(map.getByRole('img', { name: /1641: Pictures at the fair$/ })).toHaveCount(1)
  await expect(map.locator('.hist-market:not(.hist-gone)', { hasText: 'Rotterdam fair' })).toHaveCount(1)
  await expect(map.locator('.key-swatch.key-market')).toHaveCount(1)

  await year.fill('1585')
  await expect(map.getByRole('img', { name: /1585: Antwerp falls$/ })).toHaveCount(1)
  await expect(map.locator('.hist-flow')).toHaveCount(3)
  await expect(map.locator('.hist-alert', { hasText: 'FALL OF ANTWERP' })).toHaveCount(1)

  await year.fill('1632')
  await expect(map.getByRole('img', { name: /1632: To Amsterdam and London$/ })).toHaveCount(1)
  await expect(map.locator('.hist-workshop:not(.hist-gone)', { hasText: 'Rembrandt' })).toHaveCount(1)
  await expect(map.locator('.hist-flow')).toHaveCount(2)

  await year.fill('1672')
  await expect(map.getByRole('img', { name: /1672: The Disaster Year$/ })).toHaveCount(1)
  await expect(map.locator('.hist-alert', { hasText: 'THE DISASTER YEAR' })).toHaveCount(1)
  await expect(map.locator('.hist-workshop:not(.hist-gone)', { hasText: 'Johannes Vermeer' })).toHaveCount(1)
})

test('plays all of unit 18 and the checkpoint without errors', async ({ page }) => {
  const errors: string[] = []
  page.on('pageerror', (e) => errors.push(e.message))
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()))
  await page.goto('/')

  const shots = process.env.SHOTS
  for (const name of [
    'Learning to paint',
    'Colour in the south',
    'Masks and the Twenty',
    'From a tree to a grid',
    'Pictures that play tricks',
    'Collectors and museums',
  ]) {
    await playLesson(page, name, shots)
    await expect(page.locator('.results h1')).toBeVisible()
    await page.getByRole('button', { name: 'Continue' }).click()
  }
  await playLesson(page, 'Unit 18 checkpoint', shots)
  await page.getByRole('button', { name: 'Continue' }).click()
  expect(errors).toEqual([])
})

test("a painter's road steps through his pictures, and the modern artists' map follows Van Gogh", async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: 'Learning to paint', exact: true }).click()
  const road = page.locator('.road')
  const slider = road.getByRole('slider', { name: 'Vincent van Gogh, picture by picture' })
  await expect(road.locator('.road-year')).toHaveText('1882: Sorrow, The Hague')
  await expect(slider).toHaveAttribute('max', '7')
  await slider.fill('4')
  await expect(road.locator('.road-year')).toHaveText('1887: Flowering plum orchard, after Hiroshige, Paris')
  await expect(road.locator('.road-ticks .is-active')).toHaveCount(1)
  await expect(road.locator('figcaption')).toContainText('Hiroshige')
  await slider.fill('7')
  await expect(road.locator('.road-year')).toHaveText('1890: The church at Auvers')
  await page.locator('.lesson-foot').getByRole('button', { name: 'Continue' }).click()

  const map = page.locator('.time-map')
  const year = map.getByRole('slider', { name: 'Year' })
  // The scrub hides the captions; the map's label still names the stage.
  await expect(map.getByRole('img', { name: /1880: Van Gogh begins to draw$/ })).toHaveCount(1)
  await expect(map.locator('.hist-workshop:not(.hist-gone)', { hasText: 'James Ensor' })).toHaveCount(1)
  await year.fill('1886')
  await expect(map.getByRole('img', { name: /1886: To Antwerp and Paris$/ })).toHaveCount(1)
  await expect(map.locator('.hist-flow')).toHaveCount(1)
  await expect(map.locator('.hist-market:not(.hist-gone)', { hasText: 'Les XX' })).toHaveCount(1)
  await expect(map.locator('.key-swatch.key-flow')).toHaveCount(1)
  await year.fill('1898')
  await expect(map.getByRole('img', { name: /1898: Two boys born$/ })).toHaveCount(1)
  await expect(map.locator('.hist-museum', { hasText: 'Stedelijk Museum' })).toHaveCount(1)
  await expect(map.locator('.hist-village', { hasText: 'Sint-Martens-Latem' })).toHaveCount(1)
  await expect(map.locator('.hist-market:not(.hist-gone)', { hasText: /^Les XX/ })).toHaveCount(0)
})

test('a style sorter names one painting at a time, then glides to what gives the style away', async ({ page }) => {
  await unlock(page, ['u18-l1', 'u18-l2'])
  await page.getByRole('button', { name: 'Masks and the Twenty', exact: true }).click()
  await skipTo(page, 'Style sorter')
  const sorter = page.locator('.exercise-style')
  const styles = sorter.getByRole('group', { name: 'Styles' })
  const check = page.locator('.lesson-foot').getByRole('button', { name: 'Check' })

  await expect(sorter.locator('.style-count')).toContainText('Painting 1 of 6')
  // The title and credit would name the painter, so they wait for the pick.
  await expect(sorter.locator('figcaption')).toContainText('shows once you have chosen')
  await expect(sorter.locator('.zoom-frame.is-zoomed')).toHaveCount(0)
  await expect(check).toBeDisabled()

  await styles.getByRole('button', { name: 'Pointillism' }).click()
  await expect(sorter.locator('.style-tell')).toBeVisible()
  await expect(sorter.locator('.style-group.right')).toHaveCount(1)
  await expect(sorter.locator('.zoom-frame.is-zoomed')).toHaveCount(1)
  await expect(sorter.locator('figcaption .photo-credit')).toBeVisible()
  await expect(styles.getByRole('button', { name: 'Realism' })).toBeDisabled()

  for (let i = 2; i <= 6; i++) {
    await sorter.locator('.style-next').click()
    await expect(sorter.locator('.style-count')).toContainText(`Painting ${i} of 6`)
    await expect(sorter.locator('.zoom-frame.is-zoomed')).toHaveCount(0)
    await styles.getByRole('button', { name: 'Symbolism' }).click()
  }
  await expect(sorter.locator('.style-next')).toHaveCount(0)
  await check.click()
  await expect(page.locator('.feedback')).toContainText('is Realism')
})

test('plays all of unit 19 and the checkpoint without errors', async ({ page }) => {
  const errors: string[] = []
  page.on('pageerror', (e) => errors.push(e.message))
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()))
  await page.goto('/')

  const shots = process.env.SHOTS
  for (const name of ['Towers of the towns', 'Churches and courts', 'Gables on the canals', 'Mills and pumps', 'Whiplash lines', 'Lines and planes']) {
    await playLesson(page, name, shots)
    await expect(page.locator('.results h1')).toBeVisible()
    await page.getByRole('button', { name: 'Continue' }).click()
  }
  await playLesson(page, 'Unit 19 checkpoint', shots)
  await page.getByRole('button', { name: 'Continue' }).click()
  expect(errors).toEqual([])
})

test('a building front names its parts and glides to each, and the buildings map grows tower by tower', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: 'Towers of the towns', exact: true }).click()
  const front = page.locator('.facade')
  await expect(front.locator('.facade-spot')).toHaveCount(4)
  await expect(front.getByRole('button', { name: '1: Market hall' })).toBeVisible()
  await expect(front.locator('.zoom-frame.is-zoomed')).toHaveCount(0)
  await front.getByRole('button', { name: 'Walk along the front' }).click()
  await expect(front.locator('.tour-title')).toHaveText('Market hall')
  await expect(front.locator('.zoom-frame.is-zoomed')).toHaveCount(1)
  // Zoomed in on the hall, the other hotspots are out of view; Next part walks on to them.
  for (const part of ['Gateway', 'Square tower', 'Eight-sided top']) {
    await front.getByRole('button', { name: 'Next part' }).click()
    await expect(front.locator('.tour-title')).toHaveText(part)
  }
  await expect(front.locator('.tour-text')).toContainText('87 centimetres')
  await front.getByRole('button', { name: 'Whole front' }).click()
  await expect(front.locator('.tour-title')).toHaveCount(0)
  await expect(front.locator('.zoom-frame.is-zoomed')).toHaveCount(0)
  await page.locator('.lesson-foot').getByRole('button', { name: 'Continue' }).click()

  const map = page.locator('.time-map')
  const year = map.getByRole('slider', { name: 'Year' })
  await expect(map.getByRole('img', { name: /1240: The belfry of Bruges$/ })).toHaveCount(1)
  await expect(map.locator('.hist-gothic', { hasText: 'Belfry of Ghent' })).toHaveCount(0)
  await year.fill('1382')
  await expect(map.locator('.hist-gothic', { hasText: 'Belfry of Ghent' })).toHaveCount(1)
  await expect(map.locator('.key-swatch.key-gothic')).toHaveCount(1)
  await year.fill('1920')
  await expect(map.locator('.hist-gothic.hist-gone', { hasText: 'Cloth Hall of Ypres' })).toHaveCount(1)
  await expect(map.locator('.hist-nouveau', { hasText: 'Hôtel Tassel' })).toHaveCount(1)
})

test('label the parts puts each name on its numbered spot, and a building front can open on one part', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: 'Towers of the towns', exact: true }).click()
  await skipTo(page, 'Label the parts')
  const label = page.locator('.exercise-label')
  const check = page.locator('.lesson-foot').getByRole('button', { name: 'Check' })
  await expect(label.locator('.label-spot')).toHaveCount(4)
  await expect(label.locator('.label-pool .label-card')).toHaveCount(5)
  const names = ['Belfry', 'Cloth hall', 'Nieuwerck', "St Martin's tower"]
  for (const [i, name] of names.entries()) {
    await label.locator('.label-pool').getByRole('button', { name, exact: true }).click()
    await label.getByRole('button', { name: `Spot ${i + 1}: empty` }).click()
    await expect(label.getByRole('button', { name: `Spot ${i + 1}: ${name}` })).toBeVisible()
    if (i < names.length - 1) await expect(check).toBeDisabled()
  }
  // A placed label comes off its spot again with a tap.
  await label.getByRole('button', { name: 'Spot 4: St Martin' }).click()
  await expect(label.getByRole('button', { name: 'Spot 4: empty' })).toBeVisible()
  await expect(check).toBeDisabled()
  await label.getByRole('button', { name: 'Spot 4: empty' }).click()
  await label.locator('.label-pool').getByRole('button', { name: "St Martin's tower" }).click()
  await check.click()
  await expect(page.locator('.feedback')).toContainText('Every label in its place')
  await expect(label.locator('.label-spot.right')).toHaveCount(4)

  await unlock(page, ['u19-l1', 'u19-l2'])
  await page.getByRole('button', { name: 'Gables on the canals', exact: true }).click()
  await page.locator('.lesson-foot').getByRole('button', { name: 'Continue' }).click()
  const front = page.locator('.facade')
  await expect(front.locator('.facade-spot')).toHaveCount(0)
  await expect(front.locator('.zoom-frame.is-zoomed')).toHaveCount(1)
  await expect(front.locator('.hint')).toContainText('Zoomed in on one part')
})

test('a building style sorter names one front at a time', async ({ page }) => {
  await unlock(page, ['u19-l1', 'u19-l2', 'u19-l3', 'u19-l4', 'u19-l5'])
  await page.getByRole('button', { name: 'Lines and planes', exact: true }).click()
  await skipTo(page, 'Style sorter')
  const sorter = page.locator('.exercise-style')
  const styles = sorter.getByRole('group', { name: 'Styles' })
  await expect(sorter.locator('.style-count')).toContainText('Building 1 of 5')
  await styles.getByRole('button', { name: 'Gothic' }).click()
  await expect(sorter.locator('.style-tell')).toBeVisible()
  await expect(sorter.locator('.style-next')).toHaveText(/Next building/)
})

test('plays all of unit 20 and the checkpoint without errors', async ({ page }) => {
  const errors: string[] = []
  page.on('pageerror', (e) => errors.push(e.message))
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()))
  await page.goto('/')

  const shots = process.env.SHOTS
  for (const name of ['Hebban olla vogala', 'One language, two countries', 'The dialect map', 'Frisian', 'French, German and Walloon', 'Dutch around the world', 'Everyday phrases']) {
    await playLesson(page, name, shots)
    await expect(page.locator('.results h1')).toBeVisible()
    await page.getByRole('button', { name: 'Continue' }).click()
  }
  await playLesson(page, 'Unit 20 checkpoint', shots)
  await expect(page.locator('.results')).toContainText('Recordings')
  await page.getByRole('button', { name: 'Continue' }).click()
  expect(errors).toEqual([])
})

test('the dialect map tells about each region and plays its speakers, and a listening question is answered on it', async ({ page }) => {
  await unlock(page, ['u20-l1', 'u20-l2'])
  await page.getByRole('button', { name: 'The dialect map', exact: true }).click()
  const map = page.locator('.dialect-map')
  await expect(map.locator('.dialect-label')).toHaveCount(16)
  await map.locator('.dialect-frisian').first().dispatchEvent('click')
  const card = map.locator('.dialect-card')
  await expect(card.locator('.dialect-title')).toContainText('Frisian')
  await expect(card.locator('.dialect-own')).toContainText('Frysk')
  await expect(card.locator('.dialect-sounds .play-btn')).toHaveCount(2)
  await expect(map.locator('.dialect.is-dim').first()).toBeVisible()
  const play = card.getByRole('button', { name: 'Play Ljouwert' })
  await play.click()
  await expect(card.getByRole('button', { name: 'Stop Ljouwert' })).toHaveAttribute('aria-pressed', 'true')
  // A one-second recording ends by itself, and the button goes back to Play.
  await expect(play).toHaveAttribute('aria-pressed', 'false', { timeout: 5000 })
  await map.locator('.dialect-key').getByRole('button', { name: 'Walloon' }).click()
  await expect(card.locator('.dialect-title')).toContainText('Walloon')
  await page.locator('.lesson-foot').getByRole('button', { name: 'Continue' }).click()

  const listen = page.locator('.exercise')
  await expect(listen.locator('.eyebrow')).toHaveText('Listen and find')
  await expect(listen.locator('.sound-words')).toHaveText('Listen')
  await expect(listen.locator('.dialect-label')).toHaveCount(0)
  await listen.locator('.dialect-limburgish').first().dispatchEvent('click')
  await page.locator('.lesson-foot').getByRole('button', { name: 'Check' }).click()
  await expect(page.locator('.lesson-foot')).toHaveClass(/is-right/)
  await expect(listen.locator('.sound-words')).toHaveText('ich')
  await expect(listen.locator('.dialect.is-right').first()).toBeVisible()
  await expect(listen.locator('.dialect-label')).toHaveText('Limburgish')
})

test('the language map shows Frisian shrinking, and a choice between recordings names them once checked', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: 'Hebban olla vogala', exact: true }).click()
  const map = page.locator('.time-map')
  await expect(map.locator('.time-map-title')).toHaveText('About 800: Frisians, Saxons and Franks')
  await expect(map.locator('.hist-area-frisian path')).toHaveCount(3)
  await map.getByRole('slider', { name: 'Year' }).fill('1637')
  await expect(map.locator('.time-map-title')).toHaveText('1637: The States Bible')
  await expect(map.locator('.hist-area-frisian path')).toHaveCount(1)
  await expect(map.locator('.key-swatch.key-saxon')).toHaveCount(1)

  await unlock(page, ['u20-l1'])
  await page.getByRole('button', { name: 'One language, two countries', exact: true }).click()
  await expect(page.locator('.sound-figure .sound-words')).toHaveText('gezellig')
  await page.locator('.lesson-foot').getByRole('button', { name: 'Continue' }).click()
  await expect(page.locator('.eyebrow').first()).toHaveText('Listen and choose')
  const options = page.locator('.option-sound')
  await expect(options).toHaveCount(2)
  await expect(options.locator('.option')).toHaveText(['Recording 1', 'Recording 2'])
  await options.filter({ hasText: 'Recording 1' }).locator('.option').click()
  await page.locator('.lesson-foot').getByRole('button', { name: 'Check' }).click()
  await expect(options.locator('.option').filter({ hasText: 'soft g' })).toHaveClass(/right/)
})

test('the phrasebook has 100 phrases in ten sets, and searches in English or Dutch', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('.home')).toContainText('100 everyday phrases')
  await page.getByRole('button', { name: 'Open the phrasebook' }).click()
  const book = page.locator('.phrasebook')
  await expect(book.getByRole('tab')).toHaveCount(10)
  await expect(book.locator('.phrase')).toHaveCount(10)
  await expect(book.getByRole('button', { name: 'Play Goedemorgen' })).toBeVisible()
  await book.getByRole('tab', { name: 'Belgian French' }).click()
  await expect(book.locator('.phrase-say').first()).toHaveText('Septante')
  await book.getByRole('searchbox').fill('bike')
  await expect(book.locator('.phrase-say')).toHaveText(['Het is twintig minuten met de fiets', 'De fiets'])
  await book.getByRole('searchbox').fill('xyzzy')
  await expect(book.locator('.phrase-empty')).toBeVisible()
  await book.getByRole('button', { name: 'Back to the course' }).click()
  await expect(page.locator('.phrasebook-teaser')).toBeVisible()
})
