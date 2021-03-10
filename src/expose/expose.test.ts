import fs from 'fs'
import mockFs from 'mock-fs'
import prompt from '../prompt'
import { encrypt, ROOT_ENV_FOLDER_NAME, ROOT_ENV_FOLDER_PATH } from '../utils'
import expose, { getExposeOptionsFromUser } from './expose'

describe('getExposeParamsFromUser', () => {
  beforeEach(() => {
    mockFs({
      [ROOT_ENV_FOLDER_NAME]: {
        '.enc': {
          'development.enc': 'encrypted data',
          'production.enc': 'encrypted data',
        },
        'master.key': 'my fake key',
      },
    })
  })

  it('prompts a list of encrypted development options and returns expose params ', async () => {
    const backupInput = prompt.input
    const backupList = prompt.list
    prompt.list = () => Promise.resolve('development')
    prompt.input = () => Promise.resolve('.env')

    const { fileToDecrypt, outputFilePath } = await getExposeOptionsFromUser()

    expect(fileToDecrypt).toBe('development')
    expect(outputFilePath).toBe('.env')

    prompt.input = backupInput
    prompt.list = backupList
  })

  afterEach(() => {
    mockFs.restore()
  })
})

describe('expose', () => {
  beforeEach(() => {
    mockFs({
      [ROOT_ENV_FOLDER_NAME]: {
        '.enc': {},
        'master.key': 'my fake key',
      },
    })
  })

  it('decrypts file to correct location', async () => {
    fs.writeFileSync(
      `${ROOT_ENV_FOLDER_PATH}/.enc/development.enc`,
      encrypt('value to encrypt')
    )
    await expose('development', '.env')

    const fileExists = fs.existsSync(`${ROOT_ENV_FOLDER_PATH}/../.env`)
    expect(fileExists).toBe(true)
  })

  afterEach(() => {
    mockFs.restore()
  })
})
