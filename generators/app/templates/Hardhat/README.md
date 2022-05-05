# <%= projectName %>

### Set up the project

#### Create a Python virtual environment

```bash
python3 -m venv env
source env/bin/activate
```

#### 📦 Install the requirements

```bash
npm install @shardlabs/starknet-hardhat-plugin --save-dev
```

### ⛏️ Compile

```bash
npx hardhat starknet-compile
```

### 🌡️ Test

```bash
# Run all tests
pytest tests
```

## 📄 License

**<%= projectName %>** is released under the [MIT](LICENSE).
