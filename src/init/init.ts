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

export default async (): Promise<void> => {
  clearConsole()
  console.log(boldText('Step 1: Create a Master Key'))

  console.log(
    'The master key will be used to encrypt all your environment data, you can think of it like a password\n'
  )

  const masterKey = await prompt.input('Master Key: ')

  create8BitEnvFolderIfNotPresent()
  fs.writeFileSync(MASTER_KEY_PATH, masterKey)
  console.log(`\n- Created ${successText(MASTER_KEY_RELATIVE_PATH)} file`)

  fs.appendFileSync(GITIGNORE_PATH, `\n${MASTER_KEY_RELATIVE_PATH}`)
  console.log(`- Added ${successText(MASTER_KEY_RELATIVE_PATH)} to .gitignore`)

  console.log(boldText('\n\nStep 2: Define your execution environments'))

  console.log(
    'All the different environments where your app will run (eg. development, staging, production)\n'
  )

  const environments = await getEnvironmentNamesFromUser()

  environments.forEach((environment: string) => {
    fs.writeFileSync(`${ROOT_ENV_FOLDER_PATH}/${environment}.env`, '')
    console.log(
      `- Created ${successText(`${ROOT_ENV_FOLDER_NAME}/${environment}.env`)}`
    )
  })
}
