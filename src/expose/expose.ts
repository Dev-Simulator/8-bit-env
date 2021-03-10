import fs from 'fs'
import prompt from '../prompt'
import {
  decrypt,
  ENC_FOLDER_PATH,
  errorText,
  getEncryptedEnvironments,
  successText,
} from '../utils'

export const getExposeOptionsFromUser = async (): Promise<{
  fileToDecrypt: string
  outputFilePath: string
}> => {
  const encryptedEnvironments = getEncryptedEnvironments()
  const fileToDecrypt = await prompt.list(
    'Which environment do you want to expose?',
    encryptedEnvironments.map((ee) => ({
      name: ee,
      value: ee,
    }))
  )
  const outputFilePath = await prompt.input(
    'Path to export environment file (relative to root dir): '
  )

  return { fileToDecrypt, outputFilePath }
}

const expose = (environmentName: string, exportPath: string): void => {
  const encryptedFileData = fs.readFileSync(
    `${ENC_FOLDER_PATH}/${environmentName}.enc`,
    'utf-8'
  )

  try {
    fs.writeFileSync(exportPath, decrypt(environmentName, encryptedFileData))
    console.log(
      `Decrypting ${successText(environmentName)} to ${errorText(exportPath)}`
    )
  } catch (e) {
    console.log(errorText(e))
  }
}

export default expose
