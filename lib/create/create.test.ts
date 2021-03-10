import fs from 'fs'
import prompt from '../prompt'
import mockFs from 'mock-fs'
import create, {
  formatEnvironmentName,
  formatRawEnvironmentNamesList,
} from './create'
import { ROOT_ENV_FOLDER_NAME, ROOT_ENV_FOLDER_PATH } from '../utils'

describe('formatEnvironmentName', () => {
  it('returns empty string when given empty string', () => {
    const formattedEnvironmentName = formatEnvironmentName('')
    expect(formattedEnvironmentName).toBe('')
  })
  it('lower cases everything, trims whitespace, replaces spaces with hyphens', () => {
    const formattedEnvironmentName = formatEnvironmentName(
      '  heLLo  World 99 OKay    '
    )
    expect(formattedEnvironmentName).toBe('hello--world-99-okay')
  })
})

describe('formatRawEnvironmentNamesList', () => {
  it('returns empty list for empty string', () => {
    const formattedRawEnvironmentNamesList = formatRawEnvironmentNamesList('')
    expect(formattedRawEnvironmentNamesList).toEqual([])
  })
  it('formats raw list properly', () => {
    const formattedRawEnvironmentNamesList = formatRawEnvironmentNamesList(
      '  heLLo  World 99 OKay    , , one, fi v 3,   two, '
    )
    expect(formattedRawEnvironmentNamesList).toEqual([
      'hello--world-99-okay',
      'one',
      'fi-v-3',
      'two',
    ])
  })
})

describe('create', () => {
  beforeEach(() => {
    mockFs({
      [ROOT_ENV_FOLDER_NAME]: {},
    })
  })

  it('creates .env files for each passed in environment', async () => {
    await create(['development', 'staging', 'production'])

    const filesExist =
      fs.existsSync(`${ROOT_ENV_FOLDER_PATH}/development.env`) &&
      fs.existsSync(`${ROOT_ENV_FOLDER_PATH}/staging.env`) &&
      fs.existsSync(`${ROOT_ENV_FOLDER_PATH}/production.env`)
    expect(filesExist).toBe(true)
  })

  it('gets environment files names from user and creates formatted .env files for each one', async () => {
    const backupInput = prompt.input
    prompt.input = () =>
      Promise.resolve('  DevelOPmEnt , pro DUct  ion,  s taging')
    await create()

    const filesExist =
      fs.existsSync(`${ROOT_ENV_FOLDER_PATH}/development.env`) &&
      fs.existsSync(`${ROOT_ENV_FOLDER_PATH}/s-taging.env`) &&
      fs.existsSync(`${ROOT_ENV_FOLDER_PATH}/pro-duct--ion.env`)
    expect(filesExist).toBe(true)
    prompt.input = backupInput
  })

  afterEach(() => {
    mockFs.restore()
  })
})
