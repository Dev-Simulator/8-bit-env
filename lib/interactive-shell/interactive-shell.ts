import {
  clearConsole,
  hasEncryptedFiles,
  hasEnvFiles,
  rootFolderInitialized,
} from '../utils'
import save from '../save/save'
import update from '../update/update'
import init from '../init/init'
import expose, { getExposeOptionsFromUser } from '../expose/expose'
import create from '../create/create'
import prompt from '../prompt'

const SHELL_OPTIONS = {
  init: { name: 'init - Initialize 8 Bit Env', value: 'i' },
  create: {
    name: 'create - Create a new environment file to store variable in',
    value: 'c',
  },
  save: {
    name: 'save - Save & encrypt your env files',
    value: 's',
  },
  update: {
    name: 'update - Decrypt all env files for modification',
    value: 'u',
  },
  expose: {
    name: 'expose - Decrypt a specified env file to a specific location',
    value: 'e',
  },
  quit: { name: 'quit', value: 'q' },
}

const promptExpose = async () => {
  clearConsole()
  const { fileToDecrypt, outputFilePath } = await getExposeOptionsFromUser()
  expose(fileToDecrypt, outputFilePath)
}

export const handleUserOptionSelection = async (
  selection: string
): Promise<boolean> => {
  if (selection !== 'q') {
    switch (selection) {
      case 'i':
        clearConsole()
        await init()
        break
      case 's':
        save()
        break
      case 'u':
        update()
        break
      case 'c':
        clearConsole()
        await create()
        break
      case 'e':
        await promptExpose()
        break
      default:
        console.log('Invalid Selection')
    }
    return true
  }
  return false
}

export const getSelectionOptions = () => {
  if (!rootFolderInitialized()) return [SHELL_OPTIONS.init, SHELL_OPTIONS.quit]
  else if (!hasEncryptedFiles() && !hasEnvFiles())
    return [SHELL_OPTIONS.create, SHELL_OPTIONS.quit]
  else if (hasEnvFiles() && !hasEncryptedFiles())
    return [SHELL_OPTIONS.create, SHELL_OPTIONS.save, SHELL_OPTIONS.quit]
  else if (!hasEnvFiles() && hasEncryptedFiles())
    return [
      SHELL_OPTIONS.create,
      SHELL_OPTIONS.update,
      SHELL_OPTIONS.expose,
      SHELL_OPTIONS.quit,
    ]
  return [
    SHELL_OPTIONS.save,
    SHELL_OPTIONS.update,
    SHELL_OPTIONS.create,
    SHELL_OPTIONS.expose,
    SHELL_OPTIONS.quit,
  ]
}

const interactiveShell = async (): Promise<void> => {
  clearConsole()
  let promptUser = true
  while (promptUser) {
    const choice = await prompt.list(
      'What would you like to do?',
      getSelectionOptions()
    )
    promptUser = await handleUserOptionSelection(choice)
    console.log()
  }
}

export default interactiveShell
