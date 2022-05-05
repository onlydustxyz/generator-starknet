# <%= projectName %>

### Set up the project

#### Create a Python virtual environment

```bash
python3 -m venv env
source env/bin/activate
```

#### 📦 Install the requirements
For this part we consider you have docker installed. If not click [here.](hhttps://docs.docker.com/engine/install/)
```bash
npm install
docker run -it -p 127.0.0.1:5000:5000 shardlabs/starknet-devnet
```

### ⛏️ Compile

```bash
npx hardhat starknet-compile src/
```

### 🌡️ Test

```bash
# Run all tests
npx hardhat test
```

## 📄 License

**<%= projectName %>** is released under the [MIT](LICENSE).
