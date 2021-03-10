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

const promptExpose = async () => {
  clearConsole()
  const { fileToDecrypt, outputFilePath } = await getExposeOptionsFromUser()
  expose(fileToDecrypt, outputFilePath)
}

// const confirm = async () => {
//   await prompt.input('Press Enter to continue')
//   clearConsole()
// }

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
  if (!rootFolderInitialized())
    return [{ name: 'init - Iniialize 8 Bit Env', value: 'i' }]
  else if (!hasEncryptedFiles() && !hasEnvFiles())
    return [
      {
        name: 'create - Create a new environment file to store variable in',
        value: 'c',
      },
    ]
  else if (hasEnvFiles() && !hasEncryptedFiles())
    return [
      {
        name: 'create - Create a new environment file to store variable in',
        value: 'c',
      },
      {
        name: 'save - Save & encrypt your env files',
        value: 's',
      },
    ]
  else if (!hasEnvFiles() && hasEncryptedFiles())
    return [
      {
        name: 'create - Create a new environment file to store variable in',
        value: 'c',
      },
      {
        name: 'update - Decrypt all env files for modification',
        value: 'u',
      },
      {
        name: 'expose - Decrypt a specified env file to a specific location',
        value: 'e',
      },
    ]
  return [
    {
      name: 'save - Save & encrypt your env files',
      value: 's',
    },
    {
      name: 'update - Decrypt all env files for modification',
      value: 'u',
    },
    {
      name: 'create - Create a new environment file to store variable in',
      value: 'c',
    },
    {
      name: 'expose - Decrypt a specified env file to a specific location',
      value: 'e',
    },
    {
      name: 'quit',
      value: 'q',
    },
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
  }
}

export default interactiveShell
