import fs from 'fs'
import {
  encrypt,
  ENC_FOLDER_PATH,
  errorText,
  ROOT_ENV_FOLDER_PATH,
  successText,
} from '../utils'

export default (): void => {
  const filesInFolder = fs.readdirSync(ROOT_ENV_FOLDER_PATH)
  const hasEnvFiles = !!filesInFolder.find((f) => f.includes('.env'))
  if (hasEnvFiles) {
    filesInFolder.forEach((file) => {
      const indexOfFileExtension = file.lastIndexOf('.')
      const fileExtension = file.substring(indexOfFileExtension + 1)
      const fileName = file.substring(0, indexOfFileExtension)

      if (fileExtension === 'env') {
        const fileDataToEncrypt = fs.readFileSync(
          `${ROOT_ENV_FOLDER_PATH}/${file}`,
          'utf-8'
        )
        fs.writeFileSync(
          `${ENC_FOLDER_PATH}/${fileName}.enc`,
          encrypt(fileDataToEncrypt)
        )
        console.log(`Encrypting ${successText(fileName)}`)
        fs.unlinkSync(`${ROOT_ENV_FOLDER_PATH}/${file}`)
      }
    })
  } else {
    console.log(errorText('No .env files present to save'))
  }
}
