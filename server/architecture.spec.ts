import { execFileSync } from 'child_process'
import fs from 'fs'
import os from 'os'
import path from 'path'

const DEPCRUISE = path.resolve(__dirname, 'node_modules', '.bin', 'depcruise')
const CONFIG_PATH = path.resolve(__dirname, '.dependency-cruiser.js')

interface I_Violation {
  rule: { name: string }
  from: string
  to: string
}

function hasStdout(value: unknown): value is { stdout: string } {
  return typeof value === 'object' && value !== null && 'stdout' in value && typeof Reflect.get(value, 'stdout') === 'string'
}

function cruise(configPath: string): I_Violation[] {
  let stdout = ''

  try {
    stdout = execFileSync(DEPCRUISE, ['.', '--config', configPath, '--output-type', 'json'], {
      cwd: __dirname,
      encoding: 'utf8',
    })
  } catch (error) {
    // depcruise exits non-zero once it finds a violation, and still prints the report.
    if (!hasStdout(error)) {
      throw error
    }

    stdout = error.stdout
  }

  return JSON.parse(stdout).summary.violations
}

/**
 * A config that matches nothing reports zero exactly like a clean tree does. This
 * widens every rule until it must match something, so a rule that has stopped
 * working shows up.
 */
function writeWidenedConfig() {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const config = require(CONFIG_PATH)

  const widened: Record<string, (rule: Record<string, any>) => void> = {
    'no-circular': () => undefined,
    'entities-know-no-outer-layer': (rule) => { rule.from.path = '^controllers/' },
    'entities-use-no-packages': (rule) => { rule.from.path = '^controllers/' },
    'services-know-no-transport': (rule) => { rule.from.path = '^controllers/' },
    'prisma-stays-in-db': (rule) => { delete rule.from.pathNot },
    'storage-stays-behind-the-port': (rule) => { rule.from.path = '^(app|entities|services|controllers|routes)' },
    'express-stays-at-the-edge': (rule) => { rule.from.pathNot = '^nothing$' },
  }

  config.forbidden.forEach((rule: Record<string, any>) => widened[rule.name](rule))
  delete config.options.exclude

  const filePath = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'arch-')), 'widened.js')

  fs.writeFileSync(filePath, `module.exports = ${JSON.stringify(config)}`)

  return filePath
}

describe('architecture rules', () => {
  it('reports nothing on the tree as it stands', () => {
    expect(cruise(CONFIG_PATH)).toEqual([])
  })

  it('still fires, every rule of it', () => {
    const violations = cruise(writeWidenedConfig())
    const firedRules = [...new Set(violations.map((violation) => violation.rule.name))].sort()

    expect(firedRules).toEqual([
      'entities-know-no-outer-layer',
      'entities-use-no-packages',
      'express-stays-at-the-edge',
      'no-circular',
      'prisma-stays-in-db',
      'services-know-no-transport',
      'storage-stays-behind-the-port',
    ])
  })
})
