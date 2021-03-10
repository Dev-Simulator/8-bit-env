import interactiveShell from '../interactive-shell/interactive-shell'
import parseCommands from '../parse-commands/parse-commands'

const runner = async (cliArgs: string[]): Promise<void> => {
  if (cliArgs.length === 0) interactiveShell()
  else parseCommands(cliArgs)
}

export default runner
