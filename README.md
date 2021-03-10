# 8 Bit Env

8 Bit Env helps you easily manage, securely store and expose all of the environment variables and sensitive keys you need for your app.

```bash
# with npm
npm i -D 8-bit-env

# or with yarn
yarn add -D 8-bit-env
```

## Usage

Run the init script at the root directory of your project. It will create an `.8bitenv` folder and a `.8bitenv/master.key` file:

```bash
8bitenv init
```

Inside `.8bitenv/master.key`, add a string of text which will be used as a key for encrypting/decrypting your environment variable files. You'll also want to add `.8bitenv/master.key` to your `.gitignore` (**do not check this file into version control**)

```bash
# adds the key to master.key
printf "your_secret_key" > .8bitenv/master.key

# adds master.key to your .gitignore file
printf ".8bitenv/master.key" >> .gitignore

```

> Make sure you remember this key, you'll need it anytime you or anyone else sets up your codebase in the future.

### Adding Environment Variables

For the purposes of this example, we'll assume your project has 3 execution environments that you'll need to set variables for, `development`, `staging` & `production`.

Inside `.8bitenv/` create 3 files:

- `development.env`
- `staging.env`
- `production.env`

Inside each file, place any relevant environment variables for your codebase:

**development.env**

```env
BASE_URL=http://localhost:4000
STRIPE_KEY=sk_1234
```

**staging.env**

```env
BASE_URL=https://staging.myapp.com/
STRIPE_KEY=sk_1234
```

**production.env**

```env
BASE_URL=https://myapp.com/
STRIPE_KEY=sk_5678
```

Each file should have a descriptive name which describes the environment it's storing values for.

### Encrypting Environment Variables

Once you have your environment variables inside their appropriate `*.env` files, it's time to encrypt everything. You want to encrypt all this information so that it can be stored in version control along with the rest of your code.

```bash
8bitenv save
```

The `save` command above will encrypt, and then delete each `*.env` file you created in the previous step.

Each encrypted file will be stored in `.8bitenv/.enc/` and will have the same name as it did before being encrypted, but with a `.enc` extension instead of `.env`.

- `.8bitenv/development.env` -> `.8bitenv/.enc/development.enc`
- `.8bitenv/staging.env` -> `.8bitenv/.enc/staging.enc`
- `.8bitenv/production.env` -> `.8bitenv/.enc/production.enc`

All of these files can now be safely check into version control

### Updating Environment Variables

```
8bitenv update
```

The `update` command will decrypt all the encrypted files in `.8bitenv/.enc` and convert them back into editable `*.env` files.

All you need to do is update each file with the new values and the run `8bitenv save` again.

### Exposing Environment Variables

The `expose` command will decrypt variables from one environment and place them into a file at a specified location.

```bash
8bitenv expose env_name path/to/env/file
```

`expose` takes two arguments:

- `env_name` - The name of the environment who's variables you want to expose. This is just the name of the file that you stored them in (eg. `development`, `staging`, `production`).
- `path/to/env/file` - Path of the file you want the exposed variables to be stored in, relative to the root directory of the project.

So:

```bash
# places the staging variables into a file
# called .env at the root dir of the project
8bitenv expose staging .env
```

Once the variables are exposed, a library like [dotenv](https://www.npmjs.com/package/dotenv) can be used to load them into your app inside `process.env`, or you can simply copy them into your hosting platform's environment variables section.
