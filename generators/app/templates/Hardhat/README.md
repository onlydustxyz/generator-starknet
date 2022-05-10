# <%= projectName %>

### Set up the project

#### 📦 Install the requirements
For this part we consider you have docker installed. If not click [here.](https://docs.docker.com/engine/install/)
```bash
npm install
docker run -it -p 127.0.0.1:5000:5000 shardlabs/starknet-devnet &
```

### ⛏️ Compile

```bash
npx hardhat starknet-compile
```
Thanks to the [configuration file](./hardhat.config.js) it'll automatically compile the contracts existing in [src.](./src)

You can either use ``npx hardhat`` or install the shorthand:
```bash
npm i -g hardhat-shorthand
```
Now intead of typing ``npx hardhat`` you can just use ``hh``

### 🌡️ Test

Thanks to the [configuration file](./hardhat.config.js) it'll automatically run the tests on a local network using the docker environment we set up earlier.

```bash
# Run all tests
npx hardhat test
```

## 📄 License


**<%= projectName %>** is released under the [MIT](LICENSE).
