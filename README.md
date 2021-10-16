# EntiTree.com

This project was bootstrapped with Next.js + Typescript (https://github.com/jpedroschmitz/typescript-nextjs-starter).

Live website here https://www.entitree.com/

Test website here https://entitree-next.herokuapp.com/

![Interface example](https://github.com/codeledge/entitree-next/blob/main/public/examples/interface.png)

## User instructions

Search for items (people, organizations, anything!) from the top search bar and then select a property from the dropdown.
Language can be changed from the top right 'settings' button.

## Install

For new coders:

```
sudo apt install git
sudo apt install npm

curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list
sudo apt-get update
sudo apt-get install yarn -y

```

reopen the terminal:

```
git clone https://github.com/codeledge/entitree-next
cd entitree-next/
yarn
```

## Run

If you want the app served by node.js do:

```
yarn dev
```

Open [localhost:3009](http://localhost:3009/)

## ENV

set: NEXT_PUBLIC_GENI_APP_ID
562: https://www.entitree.com/geni
563: http://localhost:3009/geni
564: https://entitree-test.herokuapp.com/geni

## Authors

- **Orlando Groppo** - [ogroppo](https://github.com/ogroppo)
- **Martin Schibel** - [mshd](https://github.com/mshd)

## Acknowledgments

- Wikidata community

## License

Copyright (c) 2021, Codeledge
