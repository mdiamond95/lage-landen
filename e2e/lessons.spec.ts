import { expect, test, type Page } from '@playwright/test'

// Answers whatever is on screen (not always correctly) so a whole lesson can be played.
async function answer(page: Page) {
  const foot = page.locator('.lesson-foot')
  if (await page.locator('.story').count()) return
  if (await page.locator('.content-note').count()) return
  if (await page.locator('.drill').count()) {
    // A map drill: tap the province it asks for, round after round.
    while (await page.locator('.drill[data-target]').count()) {
      const id = await page.locator('.drill').getAttribute('data-target')
      await page.locator(`.drill [data-province="${id}"]`).dispatchEvent('click')
    }
  } else if (await page.locator('.exercise-scrub').count()) {
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
  } else if (await page.locator('.food-pick').count()) {
    await page.locator('.food-pick .food-mark').first().dispatchEvent('click')
  } else if (await page.locator('.wheel-pick').count()) {
    await page.locator('.wheel-pick [role="slider"]').focus()
    await page.keyboard.press('ArrowRight')
  } else if (await page.locator('.dialect-pick').count()) {
    await page.locator('.dialect-pick .dialect').first().dispatchEvent('click')
  } else if (await page.locator('.route-pick').count()) {
    const need = Number(await page.locator('.route-pick').getAttribute('data-need') ?? '1')
    const places = page.locator('.route-pick .route-place:not(.is-end)')
    for (let i = 0; i < need; i++) await places.nth(i).dispatchEvent('click')
  } else if (await page.locator('.panels-pool-order').count()) {
    while (await page.locator('.panels-pool-order .panel-chip').count()) await page.locator('.panels-pool-order .panel-chip').first().click()
  } else if (await page.locator('.exercise-panels').count()) {
    while (await page.locator('.exercise-panels .panel-slot.is-empty').count()) {
      await page.locator('.panels-pool .panel-chip').first().click()
      await page.locator('.exercise-panels .panel-slot.is-empty').first().click()
    }
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

test('the time map steps through 47 snapshots from Caesar to the provinces of today', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('.timemap-teaser')).toContainText('47 snapshots')
  await page.getByRole('button', { name: 'Open the time map' }).click()
  await expect(page.locator('.time-travel-intro')).toContainText('in 47 snapshots')
  const map = page.locator('.time-map')
  const slider = page.getByRole('slider', { name: 'Year' })
  await expect(map.locator('.time-map-title')).toHaveText('57 BCE: Caesar conquers the Belgae')
  await expect(slider).toHaveAttribute('max', '46')

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

  // The thinkers and scientists of Unit 25 in 1656: Huygens's clock, with the universities and
  // printers before it, but not yet Leeuwenhoek.
  await slider.fill('15')
  await expect(map.locator('.time-map-title')).toHaveText('1656: the pendulum clock')
  await expect(map.locator('.hist-lab', { hasText: 'Huygens' })).toHaveCount(1)
  await expect(map.locator('.hist-university', { hasText: 'Leiden' })).toHaveCount(1)
  await expect(map.locator('.hist-lab', { hasText: 'Leeuwenhoek' })).toHaveCount(0)
  await expect(map.locator('.hist-line.hist-survey')).toHaveCount(1)
  await expect(map.locator('.key-swatch.key-university')).toHaveCount(1)

  await slider.fill('18')
  await expect(map.locator('.time-map-title')).toHaveText('1678: The Peace of Nijmegen')
  await expect(map.locator('.hist-voc')).toHaveCount(0)
  await expect(map.locator('.hist-area-france')).not.toHaveCount(0)
  await expect(map.locator('.hist-area-austria')).toHaveCount(0)

  await slider.fill('19')
  await expect(map.locator('.time-map-title')).toHaveText('1714: The Austrian Netherlands')
  await expect(map.locator('.hist-area-austria').first()).toBeVisible()
  await expect(map.locator('.key-swatch.key-austria')).toHaveCount(1)

  await slider.fill('22')
  await expect(map.locator('.time-map-title')).toHaveText('1815: Waterloo and a new kingdom')
  await expect(map.locator('.hist-area-austria')).toHaveCount(0)
  await expect(map.locator('.hist-area-sister')).toHaveCount(0)
  await expect(map.locator('.hist-site', { hasText: 'Waterloo' })).toHaveCount(1)

  await expect(map.locator('.hist-area-belgium')).toHaveCount(0)

  await slider.fill('23')
  await expect(map.locator('.time-map-title')).toHaveText('1830: Revolution in Brussels')
  await expect(map.locator('.hist-area-belgium').first()).toBeVisible()
  await expect(map.locator('.key-swatch.key-belgium')).toHaveCount(1)

  await slider.fill('24')
  await expect(map.locator('.time-map-title')).toHaveText('1839: The Treaty of London')
  await expect(map.locator('.hist-area-duchy').first()).toBeVisible()

  await slider.fill('25')
  await expect(map.locator('.time-map-title')).toHaveText('1843: To France and Prussia')
  await expect(map.locator('.hist-area-coal')).toHaveCount(1)
  await expect(map.locator('.hist-mine').first()).toBeVisible()
  await expect(map.locator('.hist-area-duchy').first()).toBeVisible()
  await expect(map.locator('.key-swatch.key-coal')).toHaveCount(1)

  await slider.fill('26')
  await expect(map.locator('.time-map-title')).toHaveText('1856: Trains to Germany')
  await expect(map.locator('.hist-area-coal')).toHaveCount(0)
  // Only Limburg's old Domaniale mine; Belgium's collieries belong to the 1843 map.
  await expect(map.locator('.hist-mine')).toHaveCount(1)
  await expect(map.locator('.hist-rail').first()).toBeVisible()
  await expect(map.locator('.key-swatch.key-rail')).toHaveCount(1)
  await expect(map.locator('.hist-fort', { hasText: 'Maastricht' })).toHaveCount(0)

  await slider.fill('28')
  await expect(map.locator('.time-map-title')).toHaveText('1890: Luxembourg goes its own way')
  await expect(map.locator('.hist-area-duchy')).toHaveCount(0)

  await slider.fill('30')
  await expect(map.locator('.time-map-title')).toHaveText('1915: An occupied country')
  await expect(map.locator('.hist-front')).toHaveCount(1)
  await expect(map.locator('.hist-line.hist-barrier')).toHaveCount(1)
  await expect(map.locator('.hist-area-occupied').first()).toBeVisible()

  await slider.fill('31')
  await expect(map.locator('.time-map-title')).toHaveText('1917: De Stijl')
  await expect(map.locator('.hist-front')).toHaveCount(0)
  await expect(map.locator('.hist-workshop:not(.hist-gone)', { hasText: 'Theo van Doesburg' })).toHaveCount(1)
  await expect(map.locator('.hist-workshop:not(.hist-gone)', { hasText: 'Piet Mondrian' })).toHaveCount(1)
  await expect(map.locator('.hist-village', { hasText: 'Laren' })).toHaveCount(1)
  await expect(map.locator('.key-swatch.key-workshop')).toHaveCount(1)

  // Sport in 1928: the Games of Antwerp and Amsterdam beside the first races, the modern artists gone.
  await slider.fill('32')
  await expect(map.locator('.time-map-title')).toHaveText('1928: Amsterdam’s Games')
  await expect(map.locator('.hist-games')).toHaveCount(2)
  await expect(map.locator('.hist-workshop')).toHaveCount(0)
  await slider.fill('33')
  await expect(map.locator('.time-map-title')).toHaveText('May 1940: Five days of war')
  await expect(map.locator('.hist-rail')).toHaveCount(0)
  await expect(map.locator('.hist-area-occupied').first()).toBeVisible()
  await expect(map.locator('.hist-area-free')).toHaveCount(0)

  await slider.fill('34')
  await expect(map.locator('.time-map-title')).toHaveText('November 1944: The Scheldt, and the Hunger Winter')
  await expect(map.locator('.hist-area-free').first()).toBeVisible()
  await expect(map.locator('.hist-alert', { hasText: 'HUNGER WINTER' })).toHaveCount(1)
  await expect(map.locator('.key-swatch.key-free')).toHaveCount(1)

  await slider.fill('35')
  await expect(map.locator('.time-map-title')).toHaveText('May 1945: Liberation')
  await expect(map.locator('.hist-area-occupied')).toHaveCount(0)
  await expect(map.locator('.hist-alert', { hasText: 'HUNGER WINTER' })).toHaveCount(0)
  await expect(map.locator('.hist-grave')).toHaveCount(4)

  // Comics in 1946, from Unit 24: speech balloons for the first strips, the war's graves gone.
  await slider.fill('36')
  await expect(map.locator('.time-map-title')).toHaveText('1946: Tintin gets a magazine')
  await expect(map.locator('.hist-site.hist-strip')).toHaveCount(6)
  await expect(map.locator('.hist-grave')).toHaveCount(0)
  await expect(map.locator('.key-swatch.key-strip')).toHaveCount(1)

  await slider.fill('37')
  await expect(map.locator('.time-map-title')).toHaveText('1953: The great flood')
  await expect(map.locator('.hist-site.hist-strip')).toHaveCount(0)
  await expect(map.locator('.hist-area-flooded').first()).toBeVisible()
  await expect(map.locator('.hist-breach')).toHaveCount(4)
  await expect(map.locator('.key-swatch.key-flooded')).toHaveCount(1)

  await expect(map.locator('.hist-area-dutch')).toHaveCount(0)

  await slider.fill('38')
  await expect(map.locator('.time-map-title')).toHaveText('1958: Expo 58 and the Atomium')
  await expect(map.getByText('Atomium', { exact: true })).toBeVisible()
  await expect(map.locator('.key-swatch.key-nouveau')).toHaveCount(1)
  // The Delta Works carry on beside the buildings.
  await expect(map.locator('.hist-area-flooded')).toHaveCount(0)

  await slider.fill('39')
  await expect(map.locator('.time-map-title')).toHaveText('1963: The language border is fixed')
  await expect(map.locator('.hist-area-german')).toHaveCount(2)
  await expect(map.locator('.key-swatch.key-dutch')).toHaveCount(1)
  await expect(map.locator('.key-swatch.key-facility')).toHaveCount(0)

  await slider.fill('40')
  await expect(map.locator('.time-map-title')).toHaveText('1986: Gates for the Oosterschelde')
  await expect(map.locator('.hist-area-flooded')).toHaveCount(0)
  await expect(map.locator('.hist-breach:not(.hist-gone)')).toHaveCount(0)
  // The language areas stay on beside the Delta Works, with their key.
  await expect(map.locator('.hist-area-bilingual')).toHaveCount(1)
  await expect(map.locator('.key-swatch.key-bilingual')).toHaveCount(1)

  await slider.fill('41')
  await expect(map.locator('.time-map-title')).toHaveText('1993: A federal state')

  await slider.fill('42')
  await expect(map.locator('.time-map-title')).toHaveText('1997: The Delta Works are complete')
  await expect(map.locator('.hist-area-free')).toHaveCount(0)
  await expect(map.locator('.hist-rail')).toHaveCount(0)
  await expect(map.locator('.hist-area-belgium')).toHaveCount(0)
  await expect(map.locator('.hist-area-rebel')).toHaveCount(0)
  await expect(map.locator('.hist-dam').first()).toBeVisible()

  await slider.fill('43')
  await expect(map.locator('.time-map-title')).toHaveText('2012: Brussels-Halle-Vilvoorde is split')
  await expect(map.locator('.hist-dam')).toHaveCount(0)
  await expect(map.locator('.hist-area-french').first()).toBeVisible()

  // The food map of Unit 21: every mark at once, unnamed, and the language areas gone.
  await slider.fill('44')
  await expect(map.locator('.time-map-title')).toHaveText('2016: Belgian beer culture')
  await expect(map.locator('.hist-area-french')).toHaveCount(0)
  await expect(map.locator('.hist-site.hist-brewery')).toHaveCount(6)
  await expect(map.locator('.hist-site.hist-cheese').first()).toBeVisible()
  await expect(map.locator('.hist-site-label')).toHaveCount(0)
  await expect(map.locator('.key-swatch.key-distillery')).toHaveCount(1)

  // Then the feast map of Unit 22: its marks unnamed, the food marks gone, the
  // two countries named and the Zwarte Piet debate still open.
  await slider.fill('45')
  await expect(map.locator('.time-map-title')).toHaveText('2023: An apology on Keti Koti')
  await expect(map.locator('.hist-site.hist-brewery')).toHaveCount(0)
  await expect(map.locator('.hist-site.hist-procession').first()).toBeVisible()
  await expect(map.locator('.hist-site.hist-memory').first()).toBeVisible()
  await expect(map.locator('.hist-site-label')).toHaveCount(0)
  await expect(map.locator('.hist-alert', { hasText: 'ZWARTE PIET DEBATE' })).toHaveCount(1)
  await expect(map.locator('.key-swatch.key-procession')).toHaveCount(1)

  // The last snapshot is the state map of Unit 26: twelve Dutch provinces, three Belgian regions and
  // the seats of power, with the feast marks gone.
  await slider.fill('46')
  await expect(map.locator('.time-map-title')).toHaveText('2026: Today')
  await expect(map.locator('.hist-site.hist-procession')).toHaveCount(0)
  await expect(map.locator('.hist-area-nlprov').first()).toBeVisible()
  await expect(map.locator('.hist-area-capital')).toHaveCount(1)
  await expect(map.locator('.hist-site.hist-hq').first()).toBeVisible()
  await expect(map.locator('.key-swatch.key-wallonia')).toHaveCount(1)

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

test('plays all of unit 21 and the checkpoint without errors', async ({ page }) => {
  const errors: string[] = []
  page.on('pageerror', (e) => errors.push(e.message))
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()))
  await page.goto('/')

  const shots = process.env.SHOTS
  for (const name of ['Cheese country', 'Herring and the sea', 'Spices, syrup and sprinkles', 'Frites, waffles and chocolate', 'Beer and jenever', 'The everyday table']) {
    await playLesson(page, name, shots)
    await expect(page.locator('.results h1')).toBeVisible()
    await page.getByRole('button', { name: 'Continue' }).click()
  }
  await playLesson(page, 'Unit 21 checkpoint', shots)
  await page.getByRole('button', { name: 'Continue' }).click()
  expect(errors).toEqual([])
})

test('the food map filters by kind and opens a card, and a taste question is answered on it', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: 'Cheese country', exact: true }).click()
  const map = page.locator('.food-map')
  // The first story shows only the cheeses, named.
  await expect(map.locator('.food-mark')).toHaveCount(4)
  await expect(map.locator('.food-label')).toHaveCount(4)
  await map.getByRole('button', { name: 'Everything', exact: true }).click()
  await expect(map.locator('.food-mark')).toHaveCount(30)
  await expect(map.locator('.food-label')).toHaveCount(0)
  await map.locator('.food-mark.hist-brewery').first().dispatchEvent('click')
  await expect(map.locator('.food-card .food-title')).toBeVisible()
  await map.getByRole('button', { name: 'Cheese', exact: true }).click()
  await map.locator('.food-mark[data-food="gouda"]').dispatchEvent('click')
  const card = map.locator('.food-card')
  await expect(card.locator('.food-title')).toContainText('Gouda')
  await expect(card.locator('.food-status')).toContainText('2010')
  await expect(card.getByRole('button', { name: /Play/ })).toBeVisible()

  await unlock(page, ['u21-l1', 'u21-l2'])
  await page.getByRole('button', { name: 'Spices, syrup and sprinkles', exact: true }).click()
  const foot = page.locator('.lesson-foot')
  for (let step = 0; step < 10 && !(await page.locator('.food-pick').count()); step++) {
    await answer(page)
    await foot.getByRole('button', { name: 'Continue' }).click()
  }
  const taste = page.locator('.exercise')
  await expect(taste.locator('.eyebrow')).toHaveText('Taste and find')
  await expect(taste.locator('.taste-photo figcaption')).toHaveText('Caption and credit shown once you answer')
  await expect(taste.locator('.food-label')).toHaveCount(0)
  await taste.locator('.food-mark[data-food="stroopwafel"]').dispatchEvent('click')
  await foot.getByRole('button', { name: 'Check' }).click()
  await expect(foot).toHaveClass(/is-right/)
  await expect(taste.locator('.food-mark.is-right .food-label')).toHaveText('Stroopwafel')
})

test('pick all that belong marks the right, the wrong and the missed', async ({ page }) => {
  await unlock(page, ['u21-l1', 'u21-l2', 'u21-l3', 'u21-l4'])
  await page.getByRole('button', { name: 'Beer and jenever', exact: true }).click()
  const foot = page.locator('.lesson-foot')
  await foot.getByRole('button', { name: 'Continue' }).click()
  const pick = page.locator('.exercise-pick')
  await expect(pick.locator('.eyebrow')).toHaveText('Pick all that belong')
  await expect(pick.locator('.option')).toHaveCount(6)
  await pick.locator('.option').filter({ hasText: 'Westvleteren' }).click()
  await pick.locator('.option').filter({ hasText: 'Duvel' }).click()
  await expect(pick.locator('.option.picked')).toHaveCount(2)
  await foot.getByRole('button', { name: 'Check' }).click()
  await expect(foot).toHaveClass(/is-wrong/)
  await expect(pick.locator('.option.right')).toHaveCount(1)
  await expect(pick.locator('.option.wrong')).toHaveCount(1)
  await expect(pick.locator('.option.missed')).toHaveCount(3)
  await expect(pick.locator('.hint')).toHaveText('4 of the 6 belong.')
})

test('plays all of unit 22 and the checkpoint without errors', async ({ page }) => {
  const errors: string[] = []
  page.on('pageerror', (e) => errors.push(e.message))
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()))
  await page.goto('/')

  const shots = process.env.SHOTS
  for (const name of ['A year of feasts', 'Sinterklaas', 'Carnival', 'Processions and giants', "King's Day and national days", 'Keti Koti and the days of freedom']) {
    await playLesson(page, name, shots)
    await expect(page.locator('.results h1')).toBeVisible()
    await page.getByRole('button', { name: 'Continue' }).click()
  }
  await playLesson(page, 'Unit 22 checkpoint', shots)
  await page.getByRole('button', { name: 'Continue' }).click()
  expect(errors).toEqual([])
})

test('the calendar wheel filters by country and opens a card', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: 'A year of feasts', exact: true }).click()
  const wheel = page.locator('.feast-wheel')
  await expect(wheel.locator('.wheel-mark')).toHaveCount(27)
  await expect(wheel.locator('.food-card .food-title')).toHaveCount(0)
  await wheel.getByRole('button', { name: 'Netherlands', exact: true }).click()
  const dutch = await wheel.locator('.wheel-mark').count()
  expect(dutch).toBeLessThan(27)
  await expect(wheel.locator('.wheel-mark[data-feast="kings-day"]')).toHaveCount(1)
  await expect(wheel.locator('.wheel-mark[data-feast="national-day"]')).toHaveCount(0)
  await wheel.getByRole('button', { name: 'Belgium', exact: true }).click()
  await expect(wheel.locator('.wheel-mark[data-feast="kings-day"]')).toHaveCount(0)
  await wheel.locator('.wheel-mark[data-feast="national-day"]').dispatchEvent('click')
  const card = wheel.locator('.food-card')
  await expect(card.locator('.food-title')).toContainText('National Day')
  await expect(card.locator('.food-place')).toContainText('21 July')
  await expect(wheel.locator('.wheel-mark.is-selected')).toHaveCount(1)
  // A feast that moves with Easter is drawn as the span of days it can fall on.
  await wheel.getByRole('button', { name: 'Both countries', exact: true }).click()
  await expect(wheel.locator('.wheel-mark[data-feast="easter-fires"] .wheel-span')).toHaveCount(1)
  await expect(wheel.locator('.wheel-mark[data-feast="new-year-dive"] .wheel-span')).toHaveCount(0)
})

test('a when-is-it question is answered by turning the wheel', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: 'A year of feasts', exact: true }).click()
  const foot = page.locator('.lesson-foot')
  await foot.getByRole('button', { name: 'Continue' }).click()
  const when = page.locator('.exercise-when')
  await expect(when.locator('.eyebrow')).toHaveText('When is it?')
  await expect(when.locator('figcaption')).toHaveText('Caption and credit shown once you answer')
  // No feast is marked until the answer is checked.
  await expect(when.locator('.wheel-mark')).toHaveCount(0)
  await expect(when.locator('.wheel-date')).toHaveText('Drag')
  // Turn the hand with the pointer to 11 November, the day of Saint Martin.
  const box = (await when.locator('.wheel-face').boundingBox())!
  const day = 315
  const a = ((day - 0.5) / 365) * 2 * Math.PI - Math.PI / 2
  const at = (r: number) => [box.x + box.width * (0.5 + (r / 400) * Math.cos(a)), box.y + box.height * (0.5 + (r / 400) * Math.sin(a))]
  const [x, y] = at(120)
  await page.mouse.move(x, y)
  await page.mouse.down()
  await page.mouse.up()
  await expect(when.locator('.wheel-date')).toHaveText('11 November')
  // A day either side still counts; the buttons step it.
  await when.getByRole('button', { name: 'A day earlier' }).click()
  await expect(when.getByRole('slider', { name: 'Date' })).toHaveAttribute('aria-valuetext', '10 November')
  await foot.getByRole('button', { name: 'Check' }).click()
  await expect(foot).toHaveClass(/is-right/)
  await expect(when.locator('.wheel-mark.is-right[data-feast="st-martin"]')).toHaveCount(1)
  await expect(when.locator('.wheel-hand.is-right')).toHaveCount(1)
  await expect(when.locator('figcaption')).not.toHaveText('Caption and credit shown once you answer')

  // The next when-question is answered wrong with the keyboard: one step back from the start is 31 December.
  await foot.getByRole('button', { name: 'Continue' }).click()
  await answer(page).catch(() => {})
  await foot.getByRole('button', { name: 'Continue' }).click()
  await expect(when.locator('.eyebrow')).toHaveText('When is it?')
  await when.getByRole('slider', { name: 'Date' }).focus()
  await page.keyboard.press('ArrowLeft')
  await expect(when.locator('.wheel-date')).toHaveText('31 December')
  await foot.getByRole('button', { name: 'Check' }).click()
  await expect(foot).toHaveClass(/is-wrong/)
  await expect(foot).toContainText('It falls on Easter Sunday')
  await expect(when.locator('.wheel-mark.is-right[data-feast="easter-fires"] .wheel-span')).toHaveCount(1)
  await expect(when.locator('.wheel-hand.is-wrong')).toHaveCount(1)
})

test('plays all of unit 23 and the checkpoint without errors', async ({ page }) => {
  const errors: string[] = []
  page.on('pageerror', (e) => errors.push(e.message))
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()))
  await page.goto('/')

  const shots = process.env.SHOTS
  for (const name of ['A country of bicycles', 'The Tour of Flanders', 'The Cannibal and the classics', 'Total Football', 'Two Games and a disaster', 'Ice and the Elfstedentocht']) {
    await playLesson(page, name, shots)
    await expect(page.locator('.results h1')).toBeVisible()
    await page.getByRole('button', { name: 'Continue' }).click()
  }
  await playLesson(page, 'Unit 23 checkpoint', shots)
  await page.getByRole('button', { name: 'Continue' }).click()
  expect(errors).toEqual([])
})

test('a route map steps a rider over the climbs, and a ride-the-route question is answered on it', async ({ page }) => {
  await unlock(page, ['u23-l1'])
  await page.getByRole('button', { name: 'The Tour of Flanders', exact: true }).click()
  const route = page.locator('.route-explore')
  await expect(route.locator('.route-title')).toHaveText('Tour of Flanders, 2025: the last 92 km')
  await expect(route.locator('.route-stop')).toContainText('Berendries')
  await expect(route.locator('.route-stop')).toContainText('91.5 km to go')
  await expect(route.locator('.route-ridden')).toHaveCount(0)
  // Tap the Koppenberg: the rider jumps there, the route behind turns red, and its card gives the gradient.
  await route.locator('.route-place[data-place="koppenberg"]').dispatchEvent('click')
  await expect(route.locator('.route-stop')).toContainText('44.6 km to go')
  await expect(route.locator('.climb-stats')).toContainText('22%')
  await expect(route.locator('.route-ridden')).toHaveCount(6)
  // The Kwaremont is climbed twice: a tap goes to its next ascent.
  await route.locator('.route-place[data-place="kwaremont"]').dispatchEvent('click')
  await expect(route.locator('.route-stop')).toContainText('16.7 km to go')
  await page.getByRole('button', { name: 'On along the route' }).click()
  await expect(route.locator('.route-stop')).toContainText('Paterberg')

  await page.locator('.lesson-foot').getByRole('button', { name: 'Continue' }).click()
  const ride = page.locator('.exercise-ride')
  await expect(ride.locator('.eyebrow')).toHaveText('Ride the route')
  // Only the finish is named before the answer.
  await expect(ride.locator('.route-name')).toHaveText(['Oudenaarde'])
  await ride.locator('.route-place[data-place="paterberg"]').dispatchEvent('click')
  await ride.locator('.route-place[data-place="kwaremont"]').dispatchEvent('click')
  await expect(ride.locator('.route-order')).toHaveText(['2', '1'])
  // Take the Paterberg back, and the Kwaremont after it, then pick them the right way round.
  await ride.locator('.route-place[data-place="paterberg"]').dispatchEvent('click')
  await expect(ride.locator('.route-order')).toHaveCount(0)
  await ride.locator('.route-place[data-place="kwaremont"]').dispatchEvent('click')
  await ride.locator('.route-place[data-place="paterberg"]').dispatchEvent('click')
  await page.locator('.lesson-foot').getByRole('button', { name: 'Check' }).click()
  await expect(ride.locator('.route-place.is-right')).toHaveCount(2)
  await expect(ride.locator('.route-place.is-right .route-name')).toHaveText(['Oude Kwaremont', 'Paterberg'])
})

test('plays all of unit 24 and the checkpoint without errors', async ({ page }) => {
  const errors: string[] = []
  page.on('pageerror', (e) => errors.push(e.message))
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()))
  await page.goto('/')

  const shots = process.env.SHOTS
  for (const name of ['Tintin and the clear line', 'Spirou, the Smurfs and Marcinelle', 'Spike and Suzy and the Flemish strips', 'Miffy, Bommel and the Dutch strips', 'Saxophones, chansons and Eurovision', 'Film and the small screen']) {
    await playLesson(page, name, shots)
    await expect(page.locator('.results h1')).toBeVisible()
    await page.getByRole('button', { name: 'Continue' }).click()
  }
  await playLesson(page, 'Unit 24 checkpoint', shots)
  await page.getByRole('button', { name: 'Continue' }).click()
  expect(errors).toEqual([])
})

test('a comic strip tells a story in panels, and the panels of a strip are put in order', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: 'Tintin and the clear line', exact: true }).click()
  const foot = page.locator('.lesson-foot')
  // The content note comes first.
  if (await page.locator('.content-note').count()) await foot.getByRole('button', { name: 'Continue' }).click()
  const strip = page.locator('.comic-strip-figure')
  await expect(strip.locator('.comic-panel')).toHaveCount(3)
  await expect(strip.locator('.balloon-caption').first()).toContainText('Le Petit Vingtième')
  await expect(strip.locator('.strip-credits')).toBeVisible()
  // Skip to the ordering: a Who am I?, a true or myth, a gap and a choice come first.
  for (let i = 0; i < 5; i++) {
    await answer(page)
    await foot.getByRole('button', { name: 'Continue' }).click()
  }
  const ex = page.locator('.exercise-panels')
  await expect(ex.locator('.eyebrow')).toHaveText('Comic panels')
  await expect(ex.locator('.panel-slots .panel-slot.is-empty')).toHaveCount(4)
  const pool = ex.locator('.panels-pool-order .panel-chip')
  await pool.filter({ hasText: 'museum' }).click()
  await expect(ex.locator('.panel-placed')).toHaveCount(1)
  // Tap the placed panel to take it back, then place them all in order.
  await ex.locator('.panel-placed').first().click()
  await expect(ex.locator('.panel-placed')).toHaveCount(0)
  for (const text of ['America', 'Moon', 'Canadian', 'museum']) await pool.filter({ hasText: text }).click()
  await foot.getByRole('button', { name: 'Check' }).click()
  await expect(foot).toHaveClass(/is-right/)
  await expect(ex.locator('.panel-placed.is-right')).toHaveCount(4)
})

test('a balloon question puts each balloon in its panel, and marks the wrong ones', async ({ page }) => {
  await unlock(page, ['u24-l1'])
  await page.getByRole('button', { name: 'Spirou, the Smurfs and Marcinelle', exact: true }).click()
  const foot = page.locator('.lesson-foot')
  for (let i = 0; i < 2; i++) {
    await answer(page)
    await foot.getByRole('button', { name: 'Continue' }).click()
  }
  const ex = page.locator('.exercise-panels')
  await expect(ex.locator('.panel-slot.is-empty')).toHaveCount(3)
  // Three panels and one spare balloon, for a hero who isn't there.
  await expect(ex.locator('.panels-pool .panel-chip')).toHaveCount(4)
  const chip = (text: string) => ex.locator('.panels-pool .panel-chip', { hasText: text })
  const slot = (n: number) => ex.locator('.panel-slot').nth(n)
  // Put the spare in the first panel, then move a balloon there: it leaves its old panel.
  await chip('lonesome cowboy').click()
  await slot(0).click()
  await expect(slot(0)).toHaveAttribute('aria-label', "Panel 1: I'm a poor lonesome cowboy…")
  await chip('Houba').click()
  await slot(1).click()
  await chip("M'enfin").click()
  await slot(1).click()
  await expect(slot(1)).toHaveAttribute('aria-label', "Panel 2: M'enfin !")
  await expect(chip('Houba')).toHaveCount(1)
  await chip('Mille sabords').click()
  await slot(2).click()
  await expect(ex.locator('.panels-pool')).toHaveCount(1)
  await foot.getByRole('button', { name: 'Check' }).click()
  await expect(foot).toHaveClass(/is-wrong/)
  await expect(foot).toContainText("Panel 1 says “M'enfin !”")
  await expect(ex.locator('.comic-panel.is-wrong')).toHaveCount(2)
  await expect(ex.locator('.comic-panel.is-right')).toHaveCount(1)
  await expect(ex.locator('.balloon-right')).toHaveCount(2)
  await expect(ex.locator('.panels-pool')).toHaveCount(0)
})

test('plays all of unit 25 and the checkpoint without errors', async ({ page }) => {
  const errors: string[] = []
  page.on('pageerror', (e) => errors.push(e.message))
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()))
  await page.goto('/')

  const shots = process.env.SHOTS
  for (const name of ['Erasmus and the printers', 'Vesalius and the body', 'Mercator and the map-makers', 'Stevin, Snellius and Huygens', 'Leeuwenhoek and the small world', 'Lorentz, Lemaître and the Nobel years']) {
    await playLesson(page, name, shots)
    await expect(page.locator('.results h1')).toBeVisible()
    await page.getByRole('button', { name: 'Continue' }).click()
  }
  await playLesson(page, 'Unit 25 checkpoint', shots)
  await page.getByRole('button', { name: 'Continue' }).click()
  expect(errors).toEqual([])
})

test("Mercator's map swells Greenland, shrinks it on the way south, and a true-size question shows the real sizes", async ({ page }) => {
  await unlock(page, ['u25-l1', 'u25-l2'])
  await page.getByRole('button', { name: 'Mercator and the map-makers', exact: true }).click()
  const map = page.locator('.projection-map')
  await expect(map).toHaveAttribute('data-view', 'mercator')
  await expect(map.locator('.projection-shape')).toHaveCount(2)
  await expect(map.locator('.course-rhumb')).toHaveCount(1)
  await expect(map.locator('.projection-trip')).toContainText('258° all the way')
  const greenland = map.locator('.projection-sizes li[data-shape="greenland"]')
  await expect(greenland).toContainText('at 73° north')
  const times = async () => Number(/([\d.]+) times too big/.exec((await greenland.textContent()) ?? '')![1])
  const before = await times()
  expect(before).toBeGreaterThan(5)
  // Move Greenland south with the arrow keys: it keeps its true size, but is drawn smaller.
  const shape = map.locator('.projection-shape[data-shape="greenland"] path')
  await shape.focus()
  for (let i = 0; i < 15; i++) await page.keyboard.press('ArrowDown')
  await expect(greenland).toContainText('at 28° north')
  expect(await times()).toBeLessThan(2)
  await map.getByRole('button', { name: 'Put back' }).click()
  await expect(greenland).toContainText('at 73° north')
  // Drag it by pointer, too.
  const box = (await shape.boundingBox())!
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2)
  await page.mouse.down()
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2 + 120, { steps: 8 })
  await page.mouse.up()
  expect(await times()).toBeLessThan(before)
  // On the equal-area map and the globe, sizes are true.
  await map.getByRole('button', { name: 'Equal area' }).click()
  await expect(map).toHaveAttribute('data-view', 'equal')
  await expect(greenland).not.toContainText('times too big')
  await map.getByRole('button', { name: 'Globe' }).click()
  await expect(map).toHaveAttribute('data-view', 'globe')

  await page.locator('.lesson-foot').getByRole('button', { name: 'Continue' }).click()
  const q = page.locator('.exercise-truesize')
  await expect(q.locator('.eyebrow')).toHaveText('True size')
  // Before the check the map stays on Mercator, and no sizes are shown.
  await expect(q.locator('.projection-views')).toHaveCount(0)
  await expect(q.locator('.projection-size')).toHaveCount(0)
  await q.locator('.truesize-option[data-shape="greenland"]').click()
  await page.locator('.lesson-foot').getByRole('button', { name: 'Check' }).click()
  await expect(page.locator('.lesson-foot')).toHaveClass(/is-wrong/)
  await expect(page.locator('.lesson-foot')).toContainText('Africa is bigger')
  await expect(q.locator('.truesize-option.right')).toHaveText('Africa')
  await expect(q.locator('.projection-size').first()).toContainText('really')
  await expect(q.locator('.projection-views')).toHaveCount(1)
})

test('plays all of unit 26 and the checkpoint without errors', async ({ page }) => {
  const errors: string[] = []
  page.on('pageerror', (e) => errors.push(e.message))
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()))
  await page.goto('/')

  const shots = process.env.SHOTS
  for (const name of ['Two kings, no crowns', 'Parliaments and votes', 'Twelve provinces', "Belgium's provinces and regions", 'Benelux, Europe and NATO', 'Capitals and the map today']) {
    await playLesson(page, name, shots)
    await expect(page.locator('.results h1')).toBeVisible()
    await page.getByRole('button', { name: 'Continue' }).click()
  }
  await playLesson(page, 'Unit 26 checkpoint', shots)
  await page.getByRole('button', { name: 'Continue' }).click()
  expect(errors).toEqual([])
})

test('the seat chart picks out a party and shows whether the government has a majority', async ({ page }) => {
  await unlock(page, ['u26-l1'])
  await page.getByRole('button', { name: 'Parliaments and votes', exact: true }).click()
  const chart = page.locator('.seat-chart')
  await expect(chart.locator('circle.seat')).toHaveCount(150)
  await expect(chart.locator('.seat-total')).toHaveText('150 seats')
  await chart.getByRole('button', { name: /^D66/ }).click()
  await expect(chart.locator('.seat-total')).toHaveText('26 seats')
  await expect(chart.locator('circle.seat:not(.is-dim)')).toHaveCount(26)
  await chart.getByRole('button', { name: /^D66/ }).click()
  await chart.getByRole('checkbox').check()
  await expect(chart.locator('.seat-total')).toHaveText('66 seats')
  await expect(chart.locator('.seat-sub')).toHaveText('short of a majority: 76 needed')

  // In the questions the government stays hidden.
  await page.locator('.lesson-foot').getByRole('button', { name: 'Continue' }).click()
  await expect(page.locator('.seat-chart')).toBeVisible()
  await expect(page.locator('.seat-chart').getByRole('checkbox')).toHaveCount(0)
  await page.locator('.option', { hasText: '76' }).click()
  await page.locator('.lesson-foot').getByRole('button', { name: 'Check' }).click()
  await expect(page.locator('.lesson-foot')).toHaveClass(/is-right/)
  await page.locator('.lesson-foot').getByRole('button', { name: 'Continue' }).click()
  // Belgium's parties say which side of the language border they stand on.
  await expect(page.locator('.seat-chart .seat-parties')).toContainText('N-VA 24 · Dutch-speaking')
  await expect(page.locator('.seat-chart .seat-parties')).toContainText('PVDA-PTB 15 · both sides')
})

test('the province map opens a card for each province, and the drill marks right, wrong and missed', async ({ page }) => {
  await unlock(page, ['u26-l1', 'u26-l2'])
  await page.getByRole('button', { name: 'Twelve provinces', exact: true }).click()
  const map = page.locator('.province-explore')
  await expect(map.locator('path[data-province]')).toHaveCount(12)
  await map.locator('[data-province="NL-NH"]').dispatchEvent('click')
  await expect(map.locator('.province-card')).toContainText('North Holland')
  await expect(map.locator('.province-card')).toContainText('Capital: Haarlem')
  await expect(map.locator('.province-flag')).toBeVisible()
  await map.getByRole('button', { name: 'Belgium' }).click()
  await expect(map.locator('path[data-province]')).toHaveCount(11)
  await expect(map.locator('.province-card')).not.toContainText('North Holland')

  await page.locator('.lesson-foot').getByRole('button', { name: 'Continue' }).click()
  const drill = page.locator('.drill')
  await expect(drill.locator('.drill-count')).toHaveText('1 of 6')
  // No names on the map until a province is found.
  await expect(drill.locator('.prov-label')).toHaveCount(0)
  const first = (await drill.getAttribute('data-target'))!
  await drill.locator(`[data-province="${first}"]`).dispatchEvent('click')
  await expect(drill.locator(`[data-province="${first}"]`)).toHaveClass(/is-right/)
  await expect(drill.locator('.prov-label')).toHaveCount(1)
  // A wrong tap shows the right one in orange and the tapped one in red.
  const second = (await drill.getAttribute('data-target'))!
  const wrong = second === 'NL-UT' ? 'NL-ZE' : 'NL-UT'
  await drill.locator(`[data-province="${wrong}"]`).dispatchEvent('click')
  await expect(drill.locator(`[data-province="${second}"]`)).toHaveClass(/is-missed/)
  await expect(drill.locator(`[data-province="${wrong}"]`)).toHaveClass(/is-wrong/)
  await expect(drill.locator('.drill-said')).toContainText('is the one in orange')
  // Two misses fail the drill, which allows one.
  const third = (await drill.getAttribute('data-target'))!
  await drill.locator(`[data-province="${third === 'NL-UT' ? 'NL-ZE' : 'NL-UT'}"]`).dispatchEvent('click')
  while (await page.locator('.drill[data-target]').count()) {
    const id = await drill.getAttribute('data-target')
    await drill.locator(`[data-province="${id}"]`).dispatchEvent('click')
  }
  await expect(drill.locator('.drill-ask')).toHaveText('4 of 6 right')
  await page.locator('.lesson-foot').getByRole('button', { name: 'Check' }).click()
  await expect(page.locator('.lesson-foot')).toHaveClass(/is-wrong/)
  await expect(page.locator('.lesson-foot')).toContainText('Missed:')
  // After the check the map can be explored.
  await expect(page.locator('.province-explore')).toBeVisible()
})

test('the map drill screen drills every province and keeps the best score', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('.drill-teaser')).toContainText('22 provinces')
  await page.getByRole('button', { name: 'Open the map drill' }).click()
  await expect(page.locator('.drill-best')).toHaveText('No score yet for this drill.')
  await page.locator('.map-drill').getByRole('button', { name: 'Belgium' }).click()
  await page.locator('.map-drill').getByRole('button', { name: 'By flag' }).click()
  const drill = page.locator('.drill')
  await expect(drill.locator('.drill-count')).toHaveText('1 of 11')
  await expect(drill.locator('.drill-flag')).toBeVisible()
  while (await page.locator('.drill[data-target]').count()) {
    const id = await drill.getAttribute('data-target')
    await drill.locator(`[data-province="${id}"]`).dispatchEvent('click')
  }
  await expect(drill.locator('.drill-ask')).toHaveText('11 of 11 right')
  await expect(page.locator('.drill-best')).toHaveText('Your best: 11 of 11')
  await page.getByRole('button', { name: 'Start again' }).click()
  await expect(drill.locator('.drill-count')).toHaveText('1 of 11')
  await page.reload()
  await page.getByRole('button', { name: 'Open the map drill' }).click()
  await page.locator('.map-drill').getByRole('button', { name: 'Belgium' }).click()
  await page.locator('.map-drill').getByRole('button', { name: 'By flag' }).click()
  await expect(page.locator('.drill-best')).toHaveText('Your best: 11 of 11')
})

test('the state map joins Holland and Brabant, dries Flevoland and makes the Belgian regions', async ({ page }) => {
  await unlock(page, ['u26-l1', 'u26-l2', 'u26-l3', 'u26-l4', 'u26-l5'])
  await page.getByRole('button', { name: 'Capitals and the map today', exact: true }).click()
  const map = page.locator('.time-map')
  const slider = map.getByRole('slider', { name: 'Year' })
  await expect(map.locator('.time-map-title')).toHaveText('2026: Today')
  await expect(map.locator('.hist-area-joined')).toHaveCount(0)
  await expect(map.locator('.hist-area-capital')).toHaveCount(1)
  await expect(map.locator('.hist-area-flanders')).toHaveCount(5)
  await expect(map.locator('.hist-area-wallonia')).toHaveCount(5)

  await slider.fill('1839')
  await expect(map.locator('.time-map-title')).toHaveText('1839: Two kingdoms, nineteen provinces')
  // Holland and Brabant, each one province.
  await expect(map.locator('.hist-area-joined')).toHaveCount(2)
  await expect(map.locator('.hist-area-polder')).toHaveCount(1)
  await expect(map.locator('.hist-area-flanders')).toHaveCount(0)
  await expect(map.locator('.hist-site.hist-hq')).toHaveCount(0)

  // In 1980 the regions come, but Brabant still spans them.
  await slider.fill('1980')
  await expect(map.locator('.hist-area-joined')).toHaveCount(3)
  await expect(map.locator('.hist-area-flanders')).toHaveCount(5)
  await expect(map.locator('.hist-area-polder')).toHaveCount(1)
  await expect(map.locator('.hist-site.hist-hq')).toHaveCount(2)

  await slider.fill('1995')
  await expect(map.locator('.time-map-title')).toHaveText('1995: Brabant in three')
  await expect(map.locator('.hist-area-joined')).toHaveCount(0)
  await expect(map.locator('.hist-area-polder')).toHaveCount(0)
  await expect(map.locator('.hist-area-capital')).toHaveCount(1)
})

// Plays placement blocks until the test ends, going on after a miss as well, and
// returns the units the summary says it opened.
async function playPlacement(page: Page) {
  const foot = page.locator('.lesson-foot')
  for (let block = 0; block < 30; block++) {
    for (let step = 0; step < 8; step++) {
      if (await page.locator('.placement-verdict').count()) break
      await answer(page)
      // Each question is asked once: a placement test doesn't bring misses back.
      await expect(page.locator('.feedback-note')).toHaveCount(0)
      await foot.getByRole('button', { name: 'Continue' }).click()
    }
    await expect(page.locator('.placement-score')).toHaveText(/^[0-5] of 5 right$/)
    const next = page.getByRole('button', { name: /^(Next: Unit|Try Unit) \d+/ })
    if (await next.count()) await next.click()
    else break
  }
  await page.getByRole('button', { name: 'See your results' }).click()
  return page.locator('.placement-list li.is-open').count()
}

test('the placement test plays a block for every unit and opens the units it passes', async ({ page }) => {
  test.setTimeout(600_000)
  const errors: string[] = []
  page.on('pageerror', (e) => errors.push(e.message))
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()))
  await page.goto('/')

  let opened = 0
  for (const [track, units] of [
    ['Shared history, to 1830', 9],
    ['The Netherlands, 1830 to today', 3],
    ['Belgium, 1830 to today', 3],
    ['Culture', 11],
  ] as const) {
    await page.getByRole('button', { name: 'Placement test', exact: true }).click()
    const card = page.locator('.placement-track', { has: page.getByRole('heading', { name: track }) })
    const start = card.getByRole('button')
    if (await start.isDisabled()) continue
    await start.click()
    const passed = await playPlacement(page)
    await expect(page.locator('.placement-list li')).toHaveCount(units)
    opened += passed
    await page.getByRole('button', { name: 'Continue' }).click()
  }
  await expect(page.locator('.tag-placed')).toHaveCount(opened)
  expect(errors).toEqual([])
})

test('a unit the placement test opened has every lesson and its checkpoint open', async ({ page }) => {
  await page.goto('/')
  await page.evaluate(() => {
    localStorage.setItem(
      'lage-landen:progress:v1',
      JSON.stringify({ xp: 0, streak: 0, lastDay: null, freezeWeek: null, completed: {}, discovered: [], placed: ['unit-10'] }),
    )
  })
  await page.reload()
  const unit = page.locator('.unit', { has: page.getByRole('heading', { name: 'Constitution and pillars' }) })
  await expect(unit.locator('.tag-placed')).toHaveText('Opened by the placement test')
  // Every lesson and the checkpoint; the Legendary challenge still waits for level 4.
  await expect(unit.locator('.path-node .node:not(.legendary):disabled')).toHaveCount(0)
  await expect(unit.locator('.node.legendary')).toBeDisabled()
  await expect(unit.locator('.node-start')).toHaveCount(1)
  await expect(page.getByRole('button', { name: 'Unit 10 checkpoint', exact: true })).toBeEnabled()
  // The unit before it is untouched.
  await expect(page.getByRole('button', { name: 'Unit 9 checkpoint, locked', exact: true })).toBeDisabled()

  // A new run skips the opened unit and says so.
  await page.getByRole('button', { name: 'Placement test', exact: true }).click()
  const card = page.locator('.placement-track', { has: page.getByRole('heading', { name: 'The Netherlands, 1830 to today' }) })
  await expect(card).toContainText('1 of 3 already open')
  await expect(card.getByRole('button')).toHaveText('Start at Unit 11')

  // Leaving before a unit is finished opens nothing.
  await card.getByRole('button').click()
  await page.getByRole('button', { name: 'Leave lesson' }).click()
  await expect(page.locator('.placement-track')).toHaveCount(4)
})

// Saves lessons as finished at a crown level, and units whose Legendary is passed.
async function crowns(page: Page, levels: Record<string, number>, legendary: string[] = []) {
  await page.goto('/')
  await page.evaluate(
    ([levels, legendary]) => {
      const completed = Object.fromEntries(Object.entries(levels).map(([id, level]) => [id, { bestXp: 10, perfect: false, level }]))
      localStorage.setItem(
        'lage-landen:progress:v1',
        JSON.stringify({ xp: 0, streak: 0, lastDay: null, freezeWeek: null, completed, discovered: [], placed: [], legendary }),
      )
    },
    [levels, legendary] as const,
  )
  await page.reload()
}

// Plays whatever is on screen through to the results.
async function playThrough(page: Page) {
  const foot = page.locator('.lesson-foot')
  for (let step = 0; step < 40; step++) {
    if (await page.locator('.results').count()) return
    await answer(page)
    await foot.getByRole('button', { name: 'Continue' }).click()
  }
  throw new Error('did not finish')
}

const unit2 = ['u2-l1', 'u2-l2', 'u2-l3', 'u2-l4', 'u2-l5', 'u2-l6']

test('a finished lesson shows its crown and plays for the next level', async ({ page }) => {
  await crowns(page, { 'u1-l1': 1 })
  await expect(page.locator('.stat-crowns')).toHaveText('1')
  await page.getByRole('button', { name: 'Two countries, one delta, completed, level 1', exact: true }).click()
  await expect(page.getByRole('progressbar', { name: 'Two countries, one delta, level 2 progress' })).toBeVisible()
  await playThrough(page)
  await expect(page.locator('.crown-head')).toHaveText(/^(Level 2 reached|Still level 1)$/)
  const reached = (await page.locator('.crown-head').textContent()) === 'Level 2 reached'
  await page.getByRole('button', { name: 'Continue' }).click()
  await expect(page.locator('.path-node .crown-badge').first()).toHaveText(reached ? '2' : '1')
})

test('level 3 asks the questions alone, and level 4 asks each once', async ({ page }) => {
  await crowns(page, { 'u1-l1': 2 })
  await page.getByRole('button', { name: 'Two countries, one delta, completed, level 2', exact: true }).click()
  await expect(page.locator('.story')).toHaveCount(0)
  await playThrough(page)

  await crowns(page, { 'u1-l1': 3 })
  await page.getByRole('button', { name: 'Two countries, one delta, completed, level 3', exact: true }).click()
  const foot = page.locator('.lesson-foot')
  for (let step = 0; step < 20 && !(await page.locator('.results').count()); step++) {
    await expect(page.locator('.story')).toHaveCount(0)
    await answer(page)
    await expect(page.locator('.feedback-note')).toHaveCount(0)
    await foot.getByRole('button', { name: 'Continue' }).click()
  }
  await expect(page.locator('.crown-head')).toHaveText(/^(Level 4 reached|Still level 3)$/)
})

test('the Legendary challenge opens at level 4, runs a clock and turns the crowns gold', async ({ page }) => {
  const errors: string[] = []
  page.on('pageerror', (e) => errors.push(e.message))
  await crowns(page, Object.fromEntries(unit2.slice(0, 5).map((id) => [id, 4])))
  await expect(page.getByRole('button', { name: 'Unit 2 Legendary, locked', exact: true })).toBeDisabled()
  // Unit 7's lessons are mostly about slavery and conquest: no clock on those.
  await expect(page.getByRole('button', { name: /^Unit 7 Legendary/ })).toHaveCount(0)

  await crowns(page, Object.fromEntries(unit2.map((id) => [id, 4])))
  await page.getByRole('button', { name: 'Unit 2 Legendary', exact: true }).click()
  await expect(page.getByRole('timer')).toHaveText(/^\d+:\d\d$/)
  await playThrough(page)
  await expect(page.locator('.crown-head')).toHaveText(/^(Legendary|Not this time)$/)
  const passed = (await page.locator('.crown-head').textContent()) === 'Legendary'
  await page.getByRole('button', { name: 'Continue' }).click()
  await expect(page.locator('.stat-crowns')).toHaveText(String((passed ? 5 : 4) * 6))
  if (passed) await expect(page.getByRole('button', { name: 'Unit 2 Legendary, passed', exact: true })).toBeVisible()

  // Gold crowns everywhere once passed.
  await crowns(page, Object.fromEntries(unit2.map((id) => [id, 4])), ['unit-02'])
  await expect(page.locator('.crown-badge.level-5')).toHaveCount(6)
  expect(errors).toEqual([])
})

test('the Legendary clock ends the challenge when it runs out', async ({ page }) => {
  await page.clock.install()
  await crowns(page, Object.fromEntries(unit2.map((id) => [id, 4])))
  await page.getByRole('button', { name: 'Unit 2 Legendary', exact: true }).click()
  await expect(page.getByRole('timer')).toBeVisible()
  await page.clock.runFor(20 * 60 * 1000)
  await expect(page.locator('.results h1')).toHaveText("Time's up")
  await expect(page.locator('.crown-head')).toHaveText("Time's up")
})
