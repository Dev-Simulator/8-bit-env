import fs from 'fs'
import prompt from '../prompt'
import mockFs from 'mock-fs'
import {
  MASTER_KEY_PATH,
  MASTER_KEY_RELATIVE_PATH,
  ROOT_ENV_FOLDER_NAME,
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
    expect(gitignoreText).toContain(`${ROOT_ENV_FOLDER_NAME}/*.env`)

    prompt.input = backupInput
  })

  it('uses passed in env names and mater key if present', async () => {
    const backupInput = prompt.input
    prompt.input = () =>
      Promise.resolve('  DevelOPmEnt , pro DUct  ion,  s taging')
    await init('my_master_key', ['custom_env_name'])

    const filesExist = fs.existsSync(
      `${ROOT_ENV_FOLDER_PATH}/custom_env_name.env`
    )

    const masterKeyFileText = fs.readFileSync(MASTER_KEY_PATH, 'utf-8')
    expect(filesExist).toBe(true)
    expect(masterKeyFileText).toBe('my_master_key')
    prompt.input = backupInput
  })

  it(`doesn't add entries to .gitignore if they already exist`, async () => {
    const backupInput = prompt.input
    prompt.input = () => Promise.resolve('')
    mockFs({
      '.gitignore': `node_modules\n${MASTER_KEY_RELATIVE_PATH}\n${ROOT_ENV_FOLDER_NAME}/*.env\ndist`,
    })

    await init()

    const gitignoreText = fs.readFileSync(
      `${ROOT_ENV_FOLDER_PATH}/../.gitignore`,
      'utf-8'
    )
    console.log(gitignoreText)
    expect(gitignoreText).toBe(
      `node_modules\n${MASTER_KEY_RELATIVE_PATH}\n${ROOT_ENV_FOLDER_NAME}/*.env\ndist`
    )
    prompt.input = backupInput
  })

  afterEach(() => {
    mockFs.restore()
  })
})
