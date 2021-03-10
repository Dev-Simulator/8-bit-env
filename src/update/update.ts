import fs from 'fs'
import {
  decrypt,
  ENC_FOLDER_PATH,
  errorText,
  ROOT_ENV_FOLDER_PATH,
  successText,
} from '../utils'

const update = (): void => {
  fs.readdirSync(ENC_FOLDER_PATH).forEach((file) => {
    const indexOfFileExtension = file.lastIndexOf('.')
    const fileName = file.substring(0, indexOfFileExtension)

    const encryptedFileData = fs.readFileSync(
      `${ENC_FOLDER_PATH}/${file}`,
      'utf-8'
    )

    try {
      fs.writeFileSync(
        `${ROOT_ENV_FOLDER_PATH}/${fileName}.env`,
        decrypt(fileName, encryptedFileData)
      )
      console.log(`Decrypting ${successText(fileName)}`)
    } catch (e) {
      console.log(errorText(e))
    }
  })
}

export default update
