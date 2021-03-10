import fs from 'fs'
import prompt from '../prompt'
import {
  ROOT_ENV_FOLDER_NAME,
  ROOT_ENV_FOLDER_PATH,
  successText,
} from '../utils'

export const formatEnvironmentName = (rawEnvironmentName: string): string => {
  return rawEnvironmentName.trim().toLowerCase().replace(/ /g, '-')
}

export const formatRawEnvironmentNamesList = (
  rawEnvironmentNamesList: string
): string[] => {
  return rawEnvironmentNamesList
    .trim()
    .split(',')
    .filter((e) => !!e.trim())
    .map(formatEnvironmentName)
}

export const getEnvironmentNamesFromUser = async (): Promise<string[]> => {
  const environmentNames = await prompt.input(
    'Enter the new env names (comma, separated, list): '
  )

  console.log(environmentNames)
  return formatRawEnvironmentNamesList(environmentNames)
}

const create = async (environmentNames?: string[]): Promise<void> => {
  if (!environmentNames) environmentNames = await getEnvironmentNamesFromUser()

  environmentNames.forEach((environmentName: string) => {
    fs.writeFileSync(`${ROOT_ENV_FOLDER_PATH}/${environmentName}.env`, '')
    console.log(
      `- Created ${successText(
        `${ROOT_ENV_FOLDER_NAME}/${environmentName}.env`
      )}`
    )
  })
}

export default create
