import { expect, test, type Page } from '@playwright/test'

// Answers whatever is on screen (not always correctly) so a whole lesson can be played.
async function answer(page: Page) {
  const foot = page.locator('.lesson-foot')
  if (await page.locator('.story').count()) return
  if (await page.locator('.exercise-scrub').count()) {
    const slider = page.getByRole('slider', { name: 'Year' })
    await slider.fill(await slider.getAttribute('max') ?? '0')
  } else if (await page.locator('.hunt-image').count()) {
    const box = (await page.locator('.hunt-image').boundingBox())!
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
  const box = (await page.locator('.hunt-image').boundingBox())!
  const [x, y, w, h] = TOWER
  await page.mouse.click(box.x + box.width * (x + w / 2), box.y + box.height * (y + h / 2))
  await foot.getByRole('button', { name: 'Check' }).click()
  await expect(page.locator('.feedback-head')).toHaveText('Correct!')
  await expect(page.locator('.hunt-target')).toHaveCount(1)
})
