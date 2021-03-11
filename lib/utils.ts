import fs from 'fs'
import crypto from 'crypto'
import Cryptr from 'cryptr'
// @ts-ignore
import colors from 'colors' // eslint-disable-line @typescript-eslint/no-unused-vars

export const ROOT_ENV_FOLDER_NAME = '.8-bit-env'
export const ROOT_ENV_FOLDER_PATH = `${process.cwd()}/${ROOT_ENV_FOLDER_NAME}`
export const MASTER_KEY_PATH = `${ROOT_ENV_FOLDER_PATH}/master.key`
export const MASTER_KEY_RELATIVE_PATH = `${ROOT_ENV_FOLDER_NAME}/master.key`
export const ENC_FOLDER_PATH = `${ROOT_ENV_FOLDER_PATH}/.enc/`
export const GITIGNORE_PATH = `${process.cwd()}/.gitignore`

const getKey = () => {
  if (fs.existsSync(MASTER_KEY_PATH)) {
    const key = fs.readFileSync(`${MASTER_KEY_PATH}`, 'utf8')
    return crypto
      .createHash('sha256')
      .update(key)
      .digest('base64')
      .substr(0, 32)
  }
  throw 'No master.key file present, have you run the init script?'
}

export const encrypt = (value: string): string => {
  const { encrypt: cryptrEncrypt } = new Cryptr(getKey())
  return cryptrEncrypt(value)
}

export const decrypt = (envName: string, value: string): string => {
  const { decrypt: cryptrDecrypt } = new Cryptr(getKey())
  try {
    return cryptrDecrypt(value)
  } catch (e) {
    throw `Unable to decrypt ${envName}, has your master key changed since you last encrypted it?`
  }
}

export const create8BitEnvFolderIfNotPresent = (): void => {
  if (!fs.existsSync(ROOT_ENV_FOLDER_PATH)) {
    fs.mkdirSync(ROOT_ENV_FOLDER_PATH)
  }
  if (!fs.existsSync(ENC_FOLDER_PATH)) {
    fs.mkdirSync(ENC_FOLDER_PATH)
  }
}

export const clearConsole = () => {
  console.log(
    '\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n'
  )
  console.clear()
  console.log(colors.bold(colors.rainbow(`8 Bit Env\n`)))
}

export const getEncryptedEnvironments = () => {
  return fs
    .readdirSync(ENC_FOLDER_PATH)
    .map((file) => file.substring(0, file.lastIndexOf('.')))
}

export const boldText = (value: string) => {
  return colors.bold(value)
}

export const successText = (value: string) => {
  return colors.bold(colors.green(value))
}

export const errorText = (value: string) => {
  return colors.bold(colors.red(value))
}

export const rootFolderInitialized = () => {
  return fs.existsSync(ROOT_ENV_FOLDER_PATH) && fs.existsSync(MASTER_KEY_PATH)
}

export const hasEncryptedFiles = () => {
  return (
    fs.existsSync(ENC_FOLDER_PATH) && fs.readdirSync(ENC_FOLDER_PATH).length > 0
  )
}

export const hasEnvFiles = () => {
  return !!fs.readdirSync(ROOT_ENV_FOLDER_PATH).find((f) => f.includes('.env'))
}
