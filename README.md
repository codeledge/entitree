# EntiTree.com

This project was bootstrapped with Next.js + Typescript (https://github.com/jpedroschmitz/typescript-nextjs-starter).

Live website here https://www.entitree.com/

Test website here https://entitree-next.herokuapp.com/

![Interface example](https://github.com/codeledge/entitree-next/blob/main/public/examples/interface.png)

## User instructions

Search for items (people, organizations, anything!) from the top search bar and then select a property from the dropdown.
Language can be changed from the top right 'settings' button.

## Install yarn

You need `yarn` to be installed.

For linux users:

```
sudo apt install git
sudo apt install npm

curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list
sudo apt-get update
sudo apt-get install yarn -y
```

## Clone the project

```
git clone https://github.com/codeledge/entitree-next
cd entitree-next/
yarn
```

## Run in the browser

Run the development environment

```
yarn dev
```

Open [localhost:3009](http://localhost:3009/)

## ENV vars

### Live Site

```
NEXT_PUBLIC_GENI_APP_ID=562
```

### Testing Website

```
NEXT_PUBLIC_GENI_APP_ID=563
```

### Local development

```
NEXT_PUBLIC_GENI_APP_ID=564
```

## Authors

- **Orlando Groppo** - [ogroppo](https://github.com/ogroppo)
- **Martin Schibel** - [mshd](https://github.com/mshd)

## Acknowledgments

- Wikidata community

## License

GNU General Public License v3.0

Copyright (c) 2022, Codeledge
