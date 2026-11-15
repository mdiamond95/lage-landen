// Checks every source link in the lessons (the `sources:` of each lesson) and lists the
// ones that no longer answer. Run with `node scripts/links/check.mjs`; it exits with 1
// when a link is dead. Sites that turn away scripts (403 or 429 from a firewall) are
// listed apart, as "could not check", since they open fine in a browser.
//
// A dead link is best replaced by the page's new address, or else by an archived copy:
// https://web.archive.org/web/<year>/<url> (the archive's availability API,
// https://archive.org/wayback/available?url=<url>, gives the nearest copy).
import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'

const dir = join(import.meta.dirname, '../../src/content')
const found = new Map() // url -> files
for (const file of readdirSync(dir).filter((f) => f.endsWith('.yaml'))) {
  for (const [, url] of readFileSync(join(dir, file), 'utf8').matchAll(/^\s+url: (https?:\/\/\S+)\s*$/gm)) {
    found.set(url, [...(found.get(url) ?? []), file])
  }
}

// `node scripts/links/check.mjs wikipedia` checks only the links containing that text.
const only = process.argv[2]
if (only) for (const url of [...found.keys()]) if (!url.includes(only)) found.delete(url)

const AGENT = 'LageLandenLinkCheck/1.0 (source link check for a history course)'
// GET, not HEAD: some sites (the Rijksmuseum) answer HEAD with 404 for pages that open.
const check = async (url) => {
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const res = await fetch(url, { redirect: 'follow', headers: { 'user-agent': AGENT, accept: 'text/html,*/*' }, signal: AbortSignal.timeout(25_000) })
      await res.body?.cancel()
      if (res.ok || res.status === 404 || res.status === 410) return { url, status: res.status }
      // Busy or briefly down: wait (as long as the site asks, up to a minute) and try again.
      if (attempt < 2) await new Promise((r) => setTimeout(r, Math.min(60, Number(res.headers.get('retry-after')) || 10) * 1000))
      else return { url, status: res.status }
    } catch (e) {
      if (attempt === 2) return { url, status: 0, error: e.cause?.code ?? e.name }
    }
  }
}

// A few at a time, and one at a time per site.
const byHost = new Map()
for (const url of found.keys()) {
  const host = new URL(url).host
  byHost.set(host, [...(byHost.get(host) ?? []), url])
}
const results = []
const queues = [...byHost.values()]
const worker = async () => {
  for (let q = queues.shift(); q; q = queues.shift()) for (const url of q) results.push(await check(url))
}
await Promise.all(Array.from({ length: 8 }, worker))

const blocked = results.filter((r) => r.status === 403 || r.status === 429)
const dead = results.filter((r) => !r.status || r.status >= 400).filter((r) => !blocked.includes(r))
const line = (r) => `${r.status || r.error || 'no answer'}  ${r.url}  (${found.get(r.url).join(', ')})`
console.log(`${found.size} links checked: ${results.length - dead.length - blocked.length} fine, ${blocked.length} could not check, ${dead.length} dead.`)
if (blocked.length) console.log(`\nCould not check (the site turns away scripts):\n${blocked.map(line).join('\n')}`)
if (dead.length) console.log(`\nDead:\n${dead.map(line).join('\n')}`)
process.exitCode = dead.length ? 1 : 0
