import fs from 'fs'
import mockFs from 'mock-fs'
import { encrypt, ROOT_ENV_FOLDER_NAME, ROOT_ENV_FOLDER_PATH } from '../utils'
import update from './update'

describe('create', () => {
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
      encrypt('development env')
    )
    fs.writeFileSync(
      `${ROOT_ENV_FOLDER_PATH}/.enc/production.enc`,
      encrypt('production env')
    )
    await update()

    const developmentText = fs.readFileSync(
      `${ROOT_ENV_FOLDER_PATH}/development.env`,
      'utf-8'
    )
    const productionText = fs.readFileSync(
      `${ROOT_ENV_FOLDER_PATH}/production.env`,
      'utf-8'
    )

    expect(developmentText).toBe('development env')
    expect(productionText).toBe('production env')
  })

  afterEach(() => {
    mockFs.restore()
  })
})
