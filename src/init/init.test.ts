import fs from 'fs'
import prompt from '../prompt'
import mockFs from 'mock-fs'
import {
  MASTER_KEY_PATH,
  MASTER_KEY_RELATIVE_PATH,
  ROOT_ENV_FOLDER_PATH,
} from '../utils'
import init from './init'

describe('init', () => {
  beforeEach(() => {
    mockFs({})
  })

  it('gets environment files names from user, creates formatted .env files, creates master.key file, adds master.key to .gitignore', async () => {
    const backupInput = prompt.input
    prompt.input = () =>
      Promise.resolve('  DevelOPmEnt , pro DUct  ion,  s taging')
    await init()

    const filesExist =
      fs.existsSync(`${ROOT_ENV_FOLDER_PATH}/development.env`) &&
      fs.existsSync(`${ROOT_ENV_FOLDER_PATH}/s-taging.env`) &&
      fs.existsSync(`${ROOT_ENV_FOLDER_PATH}/pro-duct--ion.env`) &&
      fs.existsSync(MASTER_KEY_PATH)

    expect(filesExist).toBe(true)

    const gitignoreText = fs.readFileSync(
      `${ROOT_ENV_FOLDER_PATH}/../.gitignore`,
      'utf-8'
    )
    expect(gitignoreText).toContain(`${MASTER_KEY_RELATIVE_PATH}`)
    prompt.input = backupInput
  })

  afterEach(() => {
    mockFs.restore()
  })
})
