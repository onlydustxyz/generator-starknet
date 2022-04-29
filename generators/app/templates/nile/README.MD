# <%= projectName %>

### Set up the project

#### Create a Python virtual environment

```bash
python3 -m venv env
source env/bin/activate
```

#### 📦 Install the requirements

```bash
pip install -r requirements.txt
```

### ⛏️ Compile

```bash
nile compile --directory src
```

### 🌡️ Test

```bash
# Run all tests
pytest tests
```

## 📄 License

**<%= projectName %>** is released under the [MIT](LICENSE).