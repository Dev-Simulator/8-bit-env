import save from '../save/save'
import update from '../update/update'
import expose from '../expose/expose'
import init from '../init/init'
import create, { formatRawEnvironmentNamesList } from '../create/create'
import { hasEncryptedFiles, hasEnvFiles, rootFolderInitialized } from '../utils'

const parseCommands = async (args: string[]) => {
  if (!rootFolderInitialized() && args[0] !== 'init')
    throw `\n\nLooks like 8 Bit Env is not set up properly in your codebase. Please run the 'init' command first to set everything up before running '${args[0]}'\n\n`
  else if (
    rootFolderInitialized() &&
    !hasEncryptedFiles() &&
    !hasEnvFiles() &&
    !['init', 'create'].includes(args[0])
  )
    throw `\n\nYou need to create some environment files before you can '${args[0]}'\n\n`
  else if (
    rootFolderInitialized() &&
    !hasEncryptedFiles() &&
    hasEnvFiles() &&
    !['save', 'create', 'init'].includes(args[0])
  )
    throw `\n\nYou don't have any encrypted environment files to '${args[0]}'\n\n`
  else if (
    rootFolderInitialized() &&
    hasEncryptedFiles() &&
    !hasEnvFiles() &&
    !['expose', 'update', 'create'].includes(args[0])
  ) {
    if (args[0] === 'init') throw `\n\n8 Bit Env is already initialized\n\n`
    else throw `\n\nYou don't have any environment files to '${args[0]}'\n\n`
  }

  switch (args[0]) {
    case 'save':
      save()
      break
    case 'update':
      update()
      break
    case 'init':
      console.log(args[1])
      if (args[1])
        init(args[1], args[2] ? formatRawEnvironmentNamesList(args[2]) : [])
      else
        throw '\n\nYou need to provide a master key and optional environment names (comma separated: envName1,envName2,envName3)\n\n'
      break
    case 'create':
      if (args[1]) create(formatRawEnvironmentNamesList(args[1]))
      else
        throw '\n\nYou need to provide a comma separated list of environment names to create, ex: "8bitenv create development,staging,production"\n\n'
      break
    case 'expose':
      if (args[1] && args[2]) expose(args[1], args[2])
      else
        throw '\n\nInvalid args for expose, you need to pass in the environment you want to expose and a path to where you want to expose it. Ex: "8bitenv expose staging .env"\n\n'
      break
    default:
      'Invalid arguments'
  }
}

export default parseCommands
