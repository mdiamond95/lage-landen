import { expect, test, type Page } from '@playwright/test'

// Answers whatever is on screen (not always correctly) so a whole lesson can be played.
async function answer(page: Page) {
  const foot = page.locator('.lesson-foot')
  if (await page.locator('.story').count()) return
  if (await page.locator('.content-note').count()) return
  if (await page.locator('.exercise-scrub').count()) {
    const slider = page.getByRole('slider', { name: 'Year' })
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

test('the time map steps through 22 snapshots from Caesar to the Delta Works', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: 'Open the time map' }).click()
  const map = page.locator('.time-map')
  const slider = page.getByRole('slider', { name: 'Year' })
  await expect(map.locator('.time-map-title')).toHaveText('57 BCE: Caesar conquers the Belgae')
  await expect(slider).toHaveAttribute('max', '21')

  await slider.fill('3')
  await expect(map.locator('.time-map-title')).toHaveText('1302: A patchwork of lands')
  await expect(map.locator('.hist-battle')).toHaveCount(1)
  await expect(map.locator('.hist-frontier')).toHaveCount(0)

  await slider.fill('7')
  await expect(map.locator('.time-map-title')).toHaveText('1579: Two unions')
  await expect(map.locator('.hist-area-rebel').first()).toBeVisible()
  await expect(map.locator('.key-swatch.key-rebel')).toHaveCount(1)

  await slider.fill('10')
  await expect(map.locator('.time-map-title')).toHaveText('1621: Two trading companies')
  await expect(map.locator('.hist-voc')).toHaveCount(6)
  await expect(map.locator('.hist-wic')).toHaveCount(6)
  await expect(map.locator('.key-swatch.key-voc')).toHaveCount(1)

  await slider.fill('14')
  await expect(map.locator('.time-map-title')).toHaveText('1678: The Peace of Nijmegen')
  await expect(map.locator('.hist-voc')).toHaveCount(0)
  await expect(map.locator('.hist-area-france')).not.toHaveCount(0)
  await expect(map.locator('.hist-area-austria')).toHaveCount(0)

  await slider.fill('15')
  await expect(map.locator('.time-map-title')).toHaveText('1714: The Austrian Netherlands')
  await expect(map.locator('.hist-area-austria').first()).toBeVisible()
  await expect(map.locator('.key-swatch.key-austria')).toHaveCount(1)

  await slider.fill('18')
  await expect(map.locator('.time-map-title')).toHaveText('1815: Waterloo and a new kingdom')
  await expect(map.locator('.hist-area-austria')).toHaveCount(0)
  await expect(map.locator('.hist-area-sister')).toHaveCount(0)
  await expect(map.locator('.hist-site', { hasText: 'Waterloo' })).toHaveCount(1)

  await expect(map.locator('.hist-area-belgium')).toHaveCount(0)

  await slider.fill('19')
  await expect(map.locator('.time-map-title')).toHaveText('1830: Revolution in Brussels')
  await expect(map.locator('.hist-area-belgium').first()).toBeVisible()
  await expect(map.locator('.key-swatch.key-belgium')).toHaveCount(1)

  await slider.fill('20')
  await expect(map.locator('.time-map-title')).toHaveText('1839: The Treaty of London')
  await expect(map.locator('.hist-area-duchy').first()).toBeVisible()

  await slider.fill('21')
  await expect(map.locator('.time-map-title')).toHaveText('1997: The Delta Works are complete')
  await expect(map.locator('.hist-area-belgium')).toHaveCount(0)
  await expect(map.locator('.hist-area-rebel')).toHaveCount(0)
  await expect(map.locator('.hist-dam').first()).toBeVisible()

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
