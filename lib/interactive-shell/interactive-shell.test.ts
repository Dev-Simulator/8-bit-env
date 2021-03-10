import mockFs from 'mock-fs'
import {
  getSelectionOptions,
  handleUserOptionSelection,
} from './interactive-shell'
import * as saveExports from '../save/save'
import * as updateExports from '../update/update'
import * as createExports from '../create/create'
import * as exposeExports from '../expose/expose'
import * as initExports from '../init/init'
import prompt from '../prompt'
import { ROOT_ENV_FOLDER_NAME } from '../utils'

describe('handleUserOptionSelection', () => {
  it('calls save when selection is s', async () => {
    const saveSpy = jest.spyOn(saveExports, 'default')
    saveSpy.mockImplementation(() => {})
    await handleUserOptionSelection('s')
    expect(saveSpy).toHaveBeenCalled()
  })
  it('calls update when selection is u', async () => {
    const updateSpy = jest.spyOn(updateExports, 'default')
    updateSpy.mockImplementation(() => {})
    await handleUserOptionSelection('u')
    expect(updateSpy).toHaveBeenCalled()
  })
  it('calls create when selection is c', async () => {
    const createSpy = jest.spyOn(createExports, 'default')
    createSpy.mockImplementation(() => new Promise((res) => res()))
    await handleUserOptionSelection('c')
    expect(createSpy).toHaveBeenCalled()
  })
  it('calls expose when selection is e', async () => {
    mockFs({
      [ROOT_ENV_FOLDER_NAME]: {
        '.enc': {},
        'master.key': 'my fake key',
      },
    })
    const backupList = prompt.list
    const backupInput = prompt.input
    prompt.list = () => Promise.resolve('development')
    prompt.input = () => Promise.resolve('.env')
    const exposeSpy = jest.spyOn(exposeExports, 'default')
    exposeSpy.mockImplementation(() => {})
    await handleUserOptionSelection('e')
    expect(exposeSpy).toHaveBeenCalled()
    prompt.list = backupList
    prompt.input = backupInput
    mockFs.restore()
  })
  it('calls init when selection is i', async () => {
    const initSpy = jest.spyOn(initExports, 'default')
    initSpy.mockImplementation(() => new Promise((res) => res()))
    await handleUserOptionSelection('i')
    expect(initSpy).toHaveBeenCalled()
  })
})

describe('getSelectionOptions', () => {
  it('returns init option only when root folder does not exist', () => {
    mockFs({})
    const options = getSelectionOptions()
    expect(options.length).toBe(2)
    expect(options[0].name).toContain('init')
    expect(options[1].name).toContain('quit')
  })

  it('returns init option only when no master.key is present', () => {
    mockFs({
      [ROOT_ENV_FOLDER_NAME]: {},
    })
    const options = getSelectionOptions()
    expect(options.length).toBe(2)
    expect(options[0].name).toContain('init')
    expect(options[1].name).toContain('quit')
  })

  it('returns create option only when no encrypted or env files exist', () => {
    mockFs({
      [ROOT_ENV_FOLDER_NAME]: {
        'master.key': 'my fake key',
      },
    })
    const options = getSelectionOptions()
    expect(options.length).toBe(2)
    expect(options[0].name).toContain('create')
    expect(options[1].name).toContain('quit')
  })

  it('returns create & save options only when no encrypted files exist', () => {
    mockFs({
      [ROOT_ENV_FOLDER_NAME]: {
        'master.key': 'my fake key',
        'development.env': 'dev',
        'production.env': 'prod',
      },
    })
    const options = getSelectionOptions()
    expect(options.length).toBe(3)
    expect(options[0].name).toContain('create')
    expect(options[1].name).toContain('save')
    expect(options[2].name).toContain('quit')
  })

  it('returns create, expose & update options only when no env files exist', () => {
    mockFs({
      [ROOT_ENV_FOLDER_NAME]: {
        '.enc': {
          'development.enc': 'dev',
          'production.enc': 'prod',
        },
        'master.key': 'my fake key',
      },
    })
    const options = getSelectionOptions()
    expect(options.length).toBe(4)
    expect(options[0].name).toContain('create')
    expect(options[1].name).toContain('update')
    expect(options[2].name).toContain('expose')
    expect(options[3].name).toContain('quit')
  })

  it('returns all other options when folder does exist', () => {
    mockFs({
      [ROOT_ENV_FOLDER_NAME]: {
        '.enc': {
          'development.enc': 'dev',
          'production.enc': 'prod',
        },
        'master.key': 'my fake key',
        'development.env': 'dev',
        'production.env': 'prod',
      },
    })
    const options = getSelectionOptions()
    expect(options.length).toBeGreaterThan(1)
  })

  afterEach(() => {
    mockFs.restore()
  })
})
