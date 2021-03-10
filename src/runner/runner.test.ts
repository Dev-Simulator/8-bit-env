import * as interactiveShellExports from '../interactive-shell/interactive-shell'
import * as parseCommandsExports from '../parse-commands/parse-commands'
import runner from './runner'

describe('runner', () => {
  it('calls interactive shell when no command line args are passed', async () => {
    const shellSpy = jest.spyOn(interactiveShellExports, 'default')
    shellSpy.mockImplementation(() => new Promise((res) => res()))
    await runner([])
    expect(shellSpy).toHaveBeenCalled()
  })
  it('calls parse commands when command line args are passed', async () => {
    const parseCommandsSpy = jest.spyOn(parseCommandsExports, 'default')
    parseCommandsSpy.mockImplementation(() => new Promise((res) => res()))
    await runner(['save'])
    expect(parseCommandsSpy).toHaveBeenCalled()
  })
})
