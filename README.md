[![NPM version][npm-image]][npm-url] [![Downloads][npmcharts-image]][npmcharts-url] 
[![generator-starknet-ci Actions Status](https://github.com/abdelhamidbakhta/generator-starknet/workflows/generator-starknet-ci/badge.svg)](https://github.com/onlydustxyz/generator-starknet/actions)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](https://github.com/onlydustxyz/generator-starknet/blob/main/LICENSE)
[![sonar-quality-gate][sonar-quality-gate]][sonar-url][![sonar-bugs][sonar-bugs]][sonar-url] [![sonar-vulnerabilities][sonar-vulnerabilities]][sonar-url]

<p align="center">
    <img src="./resources/StarkNet_logo.png"
        height="130">
</p>
<p align="center">
    <a href="https://twitter.com/intent/follow?screen_name=onlydust_xyz">
        <img src="https://img.shields.io/twitter/follow/onlydust_xyz?style=social&logo=twitter"
            alt="follow on Twitter"></a>
</p>

# generator-starknet

> This is a development platform to quickly generate, develop, &amp; deploy smart contract based apps on StarkNet.

![StarkNet Generator Demo](resources/demo.gif)

## Installation

First, install [Yeoman](http://yeoman.io) and generator-starknet using [npm](https://www.npmjs.com/) (we assume you have pre-installed [node.js](https://nodejs.org/)).  
Make sure you are using a python 3.7.

With NPM:

```bash
npm install -g yo
npm install -g generator-starknet
```

With Yarn:

```bash
yarn global add yo
yarn global add generator-starknet
```

Then generate your new project:

```bash
yo starknet
```

Now follow what is written in the console

## Want to get involved?
If you are reading this part it is probably because you want to get involve and help us expand this git repository.  
First you can have a look at the [issues open](https://github.com/onlydustxyz/generator-starknet/issues). Read them and try to find one you think you can help on.  
If you don't find any issue that you can work on but still find anything that can be improved, feel free to make a PR!  

The first step should always be to fork this repository.  
If you didn't change the [yeoman app](./generators/app/index.js) then you can probably stop reading and just make a pull request (make sure what you are submitting is working).    

If you are updating the yeoman application it would be better that you test it locally first.  
So install yeoman and yeoman-generator and link the current repository as the yeoman instance:
```bash
npm install -g yo
npm install -g yeoman-generator
npm install -g yosay
npm link
```
Npm link will allow to link a module to a local directory. So whenever you'll run  
```bash
yo starknet
```
It'll use the app present in the folder you were when doing the command instead of looking into the node_modules directory .  
You can now try it locally!  
Once you are sure your dev is over just submit a pull request.  


**Don't forget to insert the issue you are trying to solve in the name (#issueNumber), and add a small description with the relevant tags.**


## License

MIT © [Only Dust](https://onlydust.xyz/)

[sonar-url]: https://sonarcloud.io/dashboard?id=abdelhamidbakhta_generator-starknet
[sonar-quality-gate]: https://sonarcloud.io/api/project_badges/measure?project=abdelhamidbakhta_generator-starknet&metric=alert_status
[sonar-coverage]: https://sonarcloud.io/api/project_badges/measure?project=abdelhamidbakhta_generator-starknet&metric=coverage
[sonar-bugs]: https://sonarcloud.io/api/project_badges/measure?project=abdelhamidbakhta_generator-starknet&metric=bugs
[sonar-vulnerabilities]: https://sonarcloud.io/api/project_badges/measure?project=abdelhamidbakhta_generator-starknet&metric=vulnerabilities
[npmcharts-image]: https://img.shields.io/npm/dm/generator-starknet.svg?label=Downloads&style=flat
[npmcharts-url]: https://npmcharts.com/compare/generator-starknet
[npm-image]: https://badge.fury.io/js/generator-starknet.svg
[npm-url]: https://npmjs.org/package/generator-starknet
