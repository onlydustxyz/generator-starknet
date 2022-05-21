# <%= projectName %>

### Set up the project

#### Create a Python virtual environment

```bash
python3 -m venv env
source env/bin/activate
```

#### 📦 Install the requirements

```bash
curl -L https://raw.githubusercontent.com/software-mansion/protostar/master/install.sh | bash
```
Then you have to restart the terminal.  
Since protostar uses git submodules under the hood, you have to initialize a protostar project so execute the command: 
```bash
protostar init
```
And press 'y' and name the library directory **protostar**.  
Once that is done you you have to install the OpenZeppelin lib and update the config file:
```bash
protostar install OpenZeppelin/cairo-contracts@0.1.0 --name open_zeppelin
mv template.protostar.toml protostar.toml  
```
If it crashes when executing the command to install the library OpenZeppelin make sure that you have no .git folder located in a folder above.

### ⛏️ Compile

```bash
protostar build
```

### 🌡️ Test

```bash
# Run all tests
protostar test
```

## 📄 License

**<%= projectName %>** is released under the [MIT](LICENSE).