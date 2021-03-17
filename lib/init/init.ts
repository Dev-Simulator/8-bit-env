import fs from 'fs'
import {
  boldText,
  clearConsole,
  create8BitEnvFolderIfNotPresent,
  GITIGNORE_PATH,
  MASTER_KEY_PATH,
  MASTER_KEY_RELATIVE_PATH,
  ROOT_ENV_FOLDER_NAME,
  ROOT_ENV_FOLDER_PATH,
  successText,
} from '../utils'

import prompt from '../prompt'
import { getEnvironmentNamesFromUser } from '../create/create'

export default async (
  masterKey?: string,
  environments?: string[]
): Promise<void> => {
  if (!masterKey) {
    clearConsole()
    console.log(boldText('Step 1: Create a Master Key'))

    console.log(
      'The master key will be used to encrypt all your environment data, you can think of it like a password\n'
    )
    masterKey = await prompt.input('Master Key: ')
  }

  create8BitEnvFolderIfNotPresent()
  fs.writeFileSync(MASTER_KEY_PATH, masterKey || '')
  console.log(`\n- Created ${successText(MASTER_KEY_RELATIVE_PATH)} file`)

  const hasGitignore = fs.existsSync(GITIGNORE_PATH)
  if (!hasGitignore) {
    fs.appendFileSync(
      GITIGNORE_PATH,
      `\n${MASTER_KEY_RELATIVE_PATH}\n${ROOT_ENV_FOLDER_NAME}/*.env`
    )
  } else {
    const gitignoreText = fs.readFileSync(GITIGNORE_PATH)
    if (gitignoreText.indexOf(MASTER_KEY_RELATIVE_PATH) === -1) {
      fs.appendFileSync(GITIGNORE_PATH, MASTER_KEY_RELATIVE_PATH)
    }
    if (gitignoreText.indexOf(`${ROOT_ENV_FOLDER_NAME}/*.env`) === -1) {
      fs.appendFileSync(GITIGNORE_PATH, `\n${ROOT_ENV_FOLDER_NAME}/*.env`)
    }
  }

  console.log(`- Added ${successText(MASTER_KEY_RELATIVE_PATH)} to .gitignore`)

  if (environments === undefined) {
    console.log(
      boldText('\n\nStep 2: Define your execution environments (optional)')
    )
    console.log(
      'All the different environments where your app will run (eg. development, staging, production)\n'
    )
    environments = await getEnvironmentNamesFromUser()
  }

  environments.forEach((environment: string) => {
    fs.writeFileSync(`${ROOT_ENV_FOLDER_PATH}/${environment}.env`, '')
    console.log(
      `- Created ${successText(`${ROOT_ENV_FOLDER_NAME}/${environment}.env`)}`
    )
  })
}
