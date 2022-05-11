# <%= projectName %>

### Set up the project

#### 📦 Install the requirements

For this part we consider you have docker installed. If not click [here.](https://docs.docker.com/engine/install/).
Make sure you have a version 16.XX of node installed.

```bash
npm install
docker run -it -p 127.0.0.1:5050:5050 shardlabs/starknet-devnet &
```

If you are facing an issue telling you that you can't connect to docker.sock check [here.](https://stackoverflow.com/questions/52364905/after-executing-following-code-of-dockerode-npm-getting-error-connect-eacces-v)

### ⛏️ Compile

```bash
npx hardhat starknet-compile
```

Thanks to the [configuration file](./hardhat.config.js) it'll automatically compile the contracts existing in [src.](./src)

You can either use `npx hardhat` or install the shorthand:

```bash
npm i -g hardhat-shorthand
```

Now intead of typing `npx hardhat` you can just use `hh`
If you have an error here and can be one of the two:

- Make sure you are using the correct node version 16.XX.X
- Make sure you are using the correct python version (you need 3.7 or 3.9)

### 🌡️ Test

Thanks to the [configuration file](./hardhat.config.js) it'll automatically run the tests on a local network using the docker environment we set up earlier.

```bash
# Run all tests
npx hardhat test
```

## 📄 License

**<%= projectName %>** is released under the [MIT](LICENSE).
