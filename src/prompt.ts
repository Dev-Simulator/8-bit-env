import inquirer from 'inquirer'

const input = async (message: string) => {
  const { data } = await inquirer.prompt([
    {
      type: 'input',
      name: 'data',
      message,
    },
  ])
  return data
}

const list = async (
  message: string,
  choices: { name: string; value: string }[]
) => {
  const { choice } = await inquirer.prompt([
    { type: 'list', name: 'choice', message, choices },
  ])
  return choice
}

export default {
  input,
  list,
}
