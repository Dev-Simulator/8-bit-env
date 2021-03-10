import mockFs from 'mock-fs'
import * as saveExports from '../save/save'
import * as updateExports from '../update/update'
import * as createExports from '../create/create'
import * as exposeExports from '../expose/expose'
import * as initExports from '../init/init'
import parseCommands from './parse-commands'
import { ROOT_ENV_FOLDER_NAME } from '../utils'

describe('parseCommands', () => {
  beforeEach(() => {
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
  })

  it('calls save when selection is save', async () => {
    const saveSpy = jest.spyOn(saveExports, 'default')
    saveSpy.mockImplementation(() => {})

    await parseCommands(['save'])
    expect(saveSpy).toHaveBeenCalled()
  })
  it('calls update when selection is update', async () => {
    const updateSpy = jest.spyOn(updateExports, 'default')
    updateSpy.mockImplementation(() => {})
    await parseCommands(['update'])
    expect(updateSpy).toHaveBeenCalled()
  })
  it('calls create when selection is create', async () => {
    const createSpy = jest.spyOn(createExports, 'default')
    createSpy.mockImplementation(() => new Promise((res) => res()))
    await parseCommands(['create', 'staging,production'])
    expect(createSpy).toHaveBeenCalled()
  })
  it('create throws error when no environment names are passed in', async () => {
    let errorThrew = false
    try {
      await parseCommands(['create'])
    } catch (e) {
      errorThrew = true
    }
    expect(errorThrew).toBe(true)
  })
  it('calls expose when selection is expose', async () => {
    const exposeSpy = jest.spyOn(exposeExports, 'default')
    exposeSpy.mockImplementation(() => {})
    await parseCommands(['expose', 'development', '.env'])
    expect(exposeSpy).toHaveBeenCalled()
  })
  it('throws invalid expose error when no args are passed in', async () => {
    const exposeSpy = jest.spyOn(exposeExports, 'default')
    exposeSpy.mockImplementation(() => {})
    let errorThrew = false
    try {
      await parseCommands(['expose'])
    } catch (e) {
      errorThrew = true
    }
    expect(errorThrew).toBe(true)
  })
  it('calls init when selection is i', async () => {
    const initSpy = jest.spyOn(initExports, 'default')
    initSpy.mockImplementation(() => new Promise((res) => res()))
    await parseCommands(['init'])
    expect(initSpy).toHaveBeenCalled()
  })

  afterEach(() => {
    mockFs.restore()
  })
})

describe('when root dir is not initialized', () => {
  beforeEach(() => {
    mockFs({})
  })
  it('can call init', async () => {
    const initSpy = jest.spyOn(initExports, 'default')
    initSpy.mockImplementation(() => new Promise((res) => res()))
    await parseCommands(['init'])
    expect(initSpy).toHaveBeenCalled()
  })

  it('throws error when save is called', async () => {
    let errorThrew = false
    try {
      await parseCommands(['save'])
    } catch (e) {
      errorThrew = true
    }
    expect(errorThrew).toBe(true)
  })

  it('throws error when update is called', async () => {
    let errorThrew = false
    try {
      await parseCommands(['update'])
    } catch (e) {
      errorThrew = true
    }
    expect(errorThrew).toBe(true)
  })

  it('throws error when create is called', async () => {
    let errorThrew = false
    try {
      await parseCommands(['create', 'staging,production'])
    } catch (e) {
      errorThrew = true
    }
    expect(errorThrew).toBe(true)
  })

  it('throws error when expose is called', async () => {
    let errorThrew = false
    try {
      await parseCommands(['expose'])
    } catch (e) {
      errorThrew = true
    }
    expect(errorThrew).toBe(true)
  })

  afterEach(() => {
    mockFs.restore()
  })
})

describe('when no encrypted or env files are present', () => {
  beforeEach(() => {
    mockFs({
      [ROOT_ENV_FOLDER_NAME]: {
        '.enc': {},
        'master.key': 'my fake key',
      },
    })
  })
  it('can call create', async () => {
    const createSpy = jest.spyOn(createExports, 'default')
    createSpy.mockImplementation(() => new Promise((res) => res()))
    await parseCommands(['create', 'staging,production'])
    expect(createSpy).toHaveBeenCalled()
  })

  it('can call init', async () => {
    const initSpy = jest.spyOn(initExports, 'default')
    initSpy.mockImplementation(() => new Promise((res) => res()))
    await parseCommands(['init'])
    expect(initSpy).toHaveBeenCalled()
  })

  it('throws error when save is called', async () => {
    let errorThrew = false
    try {
      await parseCommands(['save'])
    } catch (e) {
      errorThrew = true
    }
    expect(errorThrew).toBe(true)
  })

  it('throws error when update is called', async () => {
    let errorThrew = false
    try {
      await parseCommands(['update'])
    } catch (e) {
      errorThrew = true
    }
    expect(errorThrew).toBe(true)
  })

  it('throws error when expose is called', async () => {
    let errorThrew = false
    try {
      await parseCommands(['expose'])
    } catch (e) {
      errorThrew = true
    }
    expect(errorThrew).toBe(true)
  })

  afterEach(() => {
    mockFs.restore()
  })
})

describe('when no encrypted files are present', () => {
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
  it('can call create', async () => {
    const createSpy = jest.spyOn(createExports, 'default')
    createSpy.mockImplementation(() => new Promise((res) => res()))
    await parseCommands(['create', 'staging,production'])
    expect(createSpy).toHaveBeenCalled()
  })

  it('can call init', async () => {
    const initSpy = jest.spyOn(initExports, 'default')
    initSpy.mockImplementation(() => new Promise((res) => res()))
    await parseCommands(['init'])
    expect(initSpy).toHaveBeenCalled()
  })

  it('can call save', async () => {
    const saveSpy = jest.spyOn(saveExports, 'default')
    saveSpy.mockImplementation(() => {})
    await parseCommands(['save'])
    expect(saveSpy).toHaveBeenCalled()
  })

  it('throws error when update is called', async () => {
    let errorThrew = false
    try {
      await parseCommands(['update'])
    } catch (e) {
      errorThrew = true
    }
    expect(errorThrew).toBe(true)
  })

  it('throws error when expose is called', async () => {
    let errorThrew = false
    try {
      await parseCommands(['expose'])
    } catch (e) {
      errorThrew = true
    }
    expect(errorThrew).toBe(true)
  })

  afterEach(() => {
    mockFs.restore()
  })
})

describe('when no environment files are present', () => {
  beforeEach(() => {
    mockFs({
      [ROOT_ENV_FOLDER_NAME]: {
        '.enc': {
          'development.enc': 'dev',
          'production.enc': 'prod',
        },
        'master.key': 'my fake key',
      },
    })
  })
  it('can call create', async () => {
    const createSpy = jest.spyOn(createExports, 'default')
    createSpy.mockImplementation(() => new Promise((res) => res()))
    await parseCommands(['create', 'staging,production'])
    expect(createSpy).toHaveBeenCalled()
  })

  it('throws error when init is called', async () => {
    let errorThrew = false
    try {
      await parseCommands(['init'])
    } catch (e) {
      errorThrew = true
    }
    expect(errorThrew).toBe(true)
  })

  it('throws error when save is called', async () => {
    let errorThrew = false
    try {
      await parseCommands(['save'])
    } catch (e) {
      errorThrew = true
    }
    expect(errorThrew).toBe(true)
  })

  it('can call update', async () => {
    const updateSpy = jest.spyOn(updateExports, 'default')
    updateSpy.mockImplementation(() => {})
    await parseCommands(['update'])
    expect(updateSpy).toHaveBeenCalled()
  })

  it('can call expose', async () => {
    const exposeSpy = jest.spyOn(exposeExports, 'default')
    exposeSpy.mockImplementation(() => {})
    await parseCommands(['update'])
    expect(exposeSpy).toHaveBeenCalled()
  })

  afterEach(() => {
    mockFs.restore()
  })
})
