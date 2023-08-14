# Brookshear Machine++
An emulation of the theoretical Brookshear Machine with a rudimentary assembly language, implemented in React.JS using TailwindCSS for style. Inspired by the emulator implementation from Joel Edström.

## Features
* Basic assembly debugging features
  - Assemble, Run, Step, and Reset commands
* Simple syntax error handling
* Memory access highlighting

## Contributing
If you'd like to contribute, please fork the repo and make a feature branch. Pull requests are welcome.

## Development
### Setup
```shell
git clone https://github.com/gvbarker/brookshear/
cd brookshear
npm install
```
### Running React Scripts
Running React code
```shell
npm run start
```
Styling via eslint and Prettier configs
```shell
npm run lint:fix
npm run pretty
```
Running predefined testing suites via Jest
```shell
npm run test
```

## Links
* Project page: https://gvbarker.github.io/brookshear/
* Repository: https://github.com/gvbarker/brookshear/
* Related:
  - Joel Edström's implementation: https://github.com/joeledstrom/brookshear-emu

## License
The code in this project is licensed under the MIT license.
