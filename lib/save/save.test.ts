import fs from 'fs'
import mockFs from 'mock-fs'
import { ROOT_ENV_FOLDER_NAME, ROOT_ENV_FOLDER_PATH } from '../utils'
import save from './save'

describe('save', () => {
  beforeEach(() => {
    mockFs({
      [ROOT_ENV_FOLDER_NAME]: {
        '.enc': {},
        'master.key': 'my fake key',
        'development.env': 'dev',
        'production.env': 'prod',
      },
    })
  })

  it('decrypts files to correct location', async () => {
    await save()

    const oldEnvironmentFilesExist =
      fs.existsSync(`${ROOT_ENV_FOLDER_PATH}/development.env`) ||
      fs.existsSync(`${ROOT_ENV_FOLDER_PATH}/production.env`)

    expect(oldEnvironmentFilesExist).toBe(false)

    const encryptedDevelopmentFile = fs.readFileSync(
      `${ROOT_ENV_FOLDER_PATH}/.enc/development.enc`,
      'utf-8'
    )
    expect(encryptedDevelopmentFile).not.toEqual('dev')

    const encryptedProductionFile = fs.readFileSync(
      `${ROOT_ENV_FOLDER_PATH}/.enc/production.enc`,
      'utf-8'
    )
    expect(encryptedProductionFile).not.toEqual('prod')
  })

  afterEach(() => {
    mockFs.restore()
  })
})
