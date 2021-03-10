import save from './save/save'
import update from './update/update'
import expose from './expose/expose'
import init from './init/init'
import { Command } from 'commander'
import create from './create/create'
import runner from './runner/runner'

const program = new Command()
program
  .option('init', 'initialize 8 Bit Env')
  .option('save', 'save & encrypt your env files')
  .option('update', 'decrypt your env files for modification')
  .option(
    'create <env1,env2,env3,...>',
    'create a new env file where you can store variables'
  )
  .option(
    'expose <envName> <outPath>',
    'decrypt a specified env file to a specific location'
  )
program.parse(process.argv)
runner(program.args)

export { save, update, expose, init, create }
