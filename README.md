![logo](https://user-images.githubusercontent.com/13106307/110695039-00589f80-81af-11eb-8f04-dcfca384075f.png)

<br />

8 Bit Env helps you easily manage, securely store and expose all of the environment variables and sensitive keys you need for your app. It also let's you store all your environment data next to your code in version control.

## Installation

```bash
# with npm
npm i -D 8-bit-env

# or with yarn
yarn add -D 8-bit-env
```

<br />

## Usage

8 Bit Env has an interactive command line tool which is the easiest way to use it:

```bash
npx 8-bit-env
```

<br />

## Initializing 8 Bit Env

<br />

![8-bit-env-init](https://user-images.githubusercontent.com/13106307/110694325-1023b400-81ae-11eb-8c73-2e63c1fee516.gif)

When you run the init script you'll first be asked to provide a master key. The master key is what 8 Bit Env uses to encrypt all of your environment data, it's essentially a password.

Once you enter your master key, 8 Bit Env will create a folder at the root directory of your project called `.8bitenv` and put the master key inside in a file called `master.key`. This file will then be added to your .gitignore file along with an entry for any environment files.

You'll then be asked to enter the names of the environments you want to store environment data for. In the example above, we're creating two, `development` and `staging`.

A `*.env` file will be created for each environment and stored inside the `.8bitenv` folder.

<br />

## Adding & Saving Environment Variables

<br />

![8-bit-env-save](https://user-images.githubusercontent.com/13106307/110694356-187bef00-81ae-11eb-8f7c-5e36df0885eb.gif)

Inside the `*.env` files you created in the last step, you can place any environment variables or pieces of info you need to keep track of. Once it's all in there, run the `save` command.

When you save the files, they will be encrypted using the key inside `master.key` and stored as `*.enc` files in the `.enc/` folder. The original `*.env` files will then be deleted (better not to have these lying around).

These encrypted files can be safely checked into version control.

<br />

## Updating Environment Variables

<br />

![8-bit-env-update](https://user-images.githubusercontent.com/13106307/110694384-1fa2fd00-81ae-11eb-9b49-fac0b08c0334.gif)

When it's time to update your environment variables, simply run the `update` function which will decrypt all of the encrypted environment files using the key inside `master.key`, and output them as `*.env` files in the `.8bitenv` folder.

> When decrypting these files, it's important the the key inside `master.key` is the same as when you encrypted them.

Once you have the `*.env` files, you can make any changes you need to make and then run the save function again.

<br />

## Exposing Environment Variables

<br />

![8-bit-env-expose](https://user-images.githubusercontent.com/13106307/110694400-2598de00-81ae-11eb-9cf4-aebecb0a0650.gif)

Eventually, you'll want to use these environment variables when you run your code, and depending on the environment you're running in, you'll want to use different ones.

Running `expose` will allow you to export the variables for a specific environment into a file of your choosing.

A common situation where this will come in handy is when using [dotenv](https://www.npmjs.com/package/dotenv). Dotenv expects a file called `.env` at the root directory of your project, which it will load environment variables from. You can, for example, use `expose` to place all your development variables in a `.env` file, which `dotenv` will pick up on.

<br />

## Creating new Environments

<br />

![8-bit-env-create](https://user-images.githubusercontent.com/13106307/110694421-2c275580-81ae-11eb-8afc-3785b2f711d4.gif)

If you want to add a new environment, simply run the `create` command, which will create a `*.env` file for you in the `.8bitenv` folder.

<br />

## Running from the command line

The usage section above demonstrates how to use 8 Bit Env with the interactive terminal app, but it can also be run with simple command line commands.

```bash
npx 8-bit-env init <master_key> [envName1,envName2,envName3]
npx 8-bit-env save
npx 8-bit-env update
npx 8-bit-env expose <envNameToExpose> <targetFile>
npx 8-bit-env create <envName1,envName2,envName3>
```

Depending on the state of your environment files, you may not be able to perform all of these. For example, if you don't have any encrypted environment files, you can't `expose` or `update`.

<br />

## Running in Code

8 Bit Env exports functions for `init`, `save`, `update`, `expose` and `create`.

```js
import { init, save, update, expose, create } from '8-bit-env'

// initialize 8 bit env
init()

// save any *.env files
save()

// decrypt all encrypted environment files
update()

// export a particular environments variables to a file
expose('environmentName', 'path/to/export')

// create new environment files
create(['envName1', 'envName2'])
```

<br />

## Managing the Master Key

Anytime your code is pulled down from version control, you'll have to add in the master key again. It's important that the master key is consistant, whetever key you used when you saved the environment files, is the one you need to decrypt them.

Easily add the master key back in by running the `init` command, or simply adding a file called `master.key` to `.8bitenv`

If you want to change the master key, simply run the `update` command to decrypt all your environment files, then change the key and run `save`.
