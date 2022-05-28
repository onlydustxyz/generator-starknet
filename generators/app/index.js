/**
 * @fileOverview The main code for this generator.
 *
 * @author Abdelhamid Bakhta
 *
 * @requires NPM:yeoman-generator
 * @requires NPM:chalk
 * @requires NPM:yosay
 */

"use strict";
const Generator = require("yeoman-generator");
const chalk = require("chalk");
const yosay = require("yosay");
const { cwd } = require("process");

const { NILE, HARDHAT, PROTOSTAR } = require("./constants");
const { erc20prompts, erc20print } = require("./erc20");
const { erc721prompts, erc721print } = require("./erc721");
const { getERC20ConstructorProps } = require("./erc20-test-props");
const { getERC721ConstructorProps } = require("./erc721-test-props");

const noMarkup = {
  escape: (markup) => {
    return markup;
  },
};

module.exports = class extends Generator {
  async initializing() {
    await this._greetings();
    this.cwd = cwd();
    this.dirName = this.cwd.substring(this.cwd.lastIndexOf("/") + 1);
    this.supportedFrameworks = [NILE, HARDHAT, PROTOSTAR];
  }

  // Prompt user for configuration choices
  async prompting() {
    const autoInstallPrompt = {
      type: "confirm",
      name: "wantInstall",
      message: "Do you want to automatically install dependencies?",
      default: false,
    };
    const includeAutoInstallPrompt = false;

    const prompts = [
      {
        type: "input",
        name: "projectName",
        message: "What is the project name?",
        default: this.dirName,
        store: true,
      },
      {
        type: "input",
        name: "outputDir",
        message: "What is the root directory for the generated project?",
        default: this.cwd,
        store: true,
      },
      {
        type: "list",
        name: "framework",
        message: "What framework do you want to use?",
        choices: [NILE, PROTOSTAR, HARDHAT],
        default: NILE,
        store: true,
      },
      {
        type: "confirm",
        name: "wantERC20",
        message: "Do you want to add an ERC20 token contract?",
        store: true,
      },
    ];
    await this._processPrompts(prompts);

    if (this.props.wantERC20) {
      await this._processPrompts({
        type: "confirm",
        name: "customizeERC20",
        message: "Use OpenZeppelin Contracts Wizard to customize ERC20?",
        default: true,
      });
      if (this.props.customizeERC20) {
        await this._processPrompts(erc20prompts);
      }
    }

    await this._processPrompts({
      type: "confirm",
      name: "wantERC721",
      message: "Do you want to add an ERC721 NFT contract?",
      store: true,
    });

    if (this.props.wantERC721) {
      await this._processPrompts({
        type: "confirm",
        name: "customizeERC721",
        message: "Use OpenZeppelin Contracts Wizard to customize ERC721?",
        store: true,
      });
      if (this.props.customizeERC721) {
        await this._processPrompts(erc721prompts);
      }
    }

    if (includeAutoInstallPrompt) {
      await this._processPrompts(autoInstallPrompt);
    }
  }

  async _processPrompts(questions) {
    this.props = {
      ...this.props,
      ...(await this.prompt(questions)),
    };
  }

  // Write the generated files
  writing() {
    // Check if framework is supported
    if (!this.supportedFrameworks.includes(this.props.framework)) {
      console.error(chalk.red(`${this.props.framework} is not supported yet.`));
      process.exit(1);
    }

    this.props.srcDir = `${this.props.outputDir}/src`;

    if (this.props.framework === NILE) {
      this._copyNileSpecificFiles();
    }

    if (this.props.framework === HARDHAT) {
      this._copyHardhatSpecificFiles();
    }

    if (this.props.framework === PROTOSTAR) {
      this._copyProtostarSpecificFiles();
    }

    this._copyReadme();
    this._copyGitIgnore();

    // Smart contracts files
    if (this.props.wantERC20) {
      this._copyERC20();
    }

    if (this.props.wantERC721) {
      this._copyERC721();
    }
  }

  _copyNileSpecificFiles() {
    this.fs.copyTpl(
      this.templatePath(`${NILE}/requirements.txt`),
      this.destinationPath(`${this.props.outputDir}/requirements.txt`),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath(`${NILE}/pytest.ini`),
      this.destinationPath(`${this.props.outputDir}/pytest.ini`),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath(`${NILE}/tests/utils.py`),
      this.destinationPath(`${this.props.outputDir}/tests/utils.py`),
      this.props
    );
    if (this.props.wantERC20) {
      this.props = {
        ...this.props,
        ...getERC20ConstructorProps(this.props),
      };
      const templateFile = this.props.customizeERC20
        ? this.props.erc20upgradeable
          ? "test_ERC20_Upgradeable.py"
          : "test_ERC20_Custom.py"
        : "test_ERC20_Default.py";
      this.fs.copyTpl(
        this.templatePath(`${NILE}/tests/${templateFile}`),
        this.destinationPath(`${this.props.outputDir}/tests/test_ERC20.py`),
        this.props,
        noMarkup
      );
    }

    if (this.props.wantERC721) {
      this.props = {
        ...this.props,
        ...getERC721ConstructorProps(this.props),
      };
      const templateFile = this.props.customizeERC721
        ? this.props.erc721upgradeable
          ? "test_ERC721_Upgradeable.py"
          : "test_ERC721_Custom.py"
        : "test_ERC721_Default.py";
      this.fs.copyTpl(
        this.templatePath(`${NILE}/tests/${templateFile}`),
        this.destinationPath(`${this.props.outputDir}/tests/test_ERC721.py`),
        this.props,
        noMarkup
      );
    }

    if (this.props.wantERC20 || this.props.wantERC721) {
      this.fs.copyTpl(
        this.templatePath(`${NILE}/.github/workflows/python-app.yml`),
        this.destinationPath(
          `${this.props.outputDir}/.github/workflows/python-app.yml`
        ),
        this.props
      );
    }
  }

  _copyHardhatSpecificFiles() {
    this.fs.copyTpl(
      this.templatePath(`${HARDHAT}/hardhat.config.js`),
      this.destinationPath(`${this.props.outputDir}/hardhat.config.js`),
      this.props
    );

    this.fs.copyTpl(
      this.templatePath(`${HARDHAT}/package.json`),
      this.destinationPath(`${this.props.outputDir}/package.json`),
      this.props
    );

    if (this.props.wantERC20) {
      this.props = {
        ...this.props,
        ...getERC20ConstructorProps(this.props),
      };
      const templateFile = this.props.customizeERC20
        ? this.props.erc20upgradeable
          ? "ERC20_Upgradeable.js"
          : "ERC20_Custom.js"
        : "ERC20_Default.js";
      this.fs.copyTpl(
        this.templatePath(`${HARDHAT}/tests/${templateFile}`),
        this.destinationPath(`${this.props.outputDir}/tests/ERC20.js`),
        this.props,
        noMarkup
      );
    }

    if (this.props.wantERC721) {
      this.props = {
        ...this.props,
        ...getERC721ConstructorProps(this.props),
      };
      const templateFile = this.props.customizeERC721
        ? this.props.erc721upgradeable
          ? "ERC721_Upgradeable.js"
          : "ERC721_Custom.js"
        : "ERC721_Default.js";
      this.fs.copyTpl(
        this.templatePath(`${HARDHAT}/tests/${templateFile}`),
        this.destinationPath(`${this.props.outputDir}/tests/ERC721.js`),
        this.props,
        noMarkup
      );
    }

    if (this.props.erc20upgradeable || this.props.erc721upgradeable) {
      this.fs.copyTpl(
        this.templatePath("contracts/Proxy.cairo"),
        this.destinationPath(`${this.props.srcDir}/Proxy.cairo`),
        this.props
      );
    }
  }

  _copyProtostarSpecificFiles() {
    this.fs.copyTpl(
      this.templatePath(`${PROTOSTAR}/protostar.toml`),
      this.destinationPath(`${this.props.outputDir}/template.protostar.toml`),
      this.props
    );

    if (this.props.wantERC20) {
      this.props = {
        ...this.props,
        ...getERC20ConstructorProps(this.props),
      };
      const templateFile = this.props.customizeERC20
        ? this.props.erc20upgradeable
          ? "test_ERC20_Upgradeable.cairo"
          : "test_ERC20_Custom.cairo"
        : "test_ERC20_Default.cairo";
      this.fs.copyTpl(
        this.templatePath(`${PROTOSTAR}/tests/${templateFile}`),
        this.destinationPath(`${this.props.outputDir}/tests/test_ERC20.cairo`),
        this.props,
        noMarkup
      );
    }

    if (this.props.wantERC721) {
      this.props = {
        ...this.props,
        ...getERC721ConstructorProps(this.props),
      };
      const templateFile = this.props.customizeERC721
        ? this.props.erc721upgradeable
          ? "test_ERC721_Upgradeable.cairo"
          : "test_ERC721_Custom.cairo"
        : "test_ERC721_Default.cairo";
      this.fs.copyTpl(
        this.templatePath(`${PROTOSTAR}/tests/${templateFile}`),
        this.destinationPath(`${this.props.outputDir}/tests/test_ERC721.cairo`),
        this.props,
        noMarkup
      );
    }

    if (this.props.erc20upgradeable || this.props.erc721upgradeable) {
      this.fs.copyTpl(
        this.templatePath("contracts/Proxy.cairo"),
        this.destinationPath(`${this.props.srcDir}/Proxy.cairo`),
        this.props
      );
    }
  }

  _copyReadme() {
    this.fs.copyTpl(
      this.templatePath(`${this.props.framework}/README.md`),
      this.destinationPath(`${this.props.outputDir}/README.md`),
      this.props
    );
  }

  _copyGitIgnore() {
    this.fs.copyTpl(
      this.templatePath("gitignore.template"),
      this.destinationPath(`${this.props.outputDir}/.gitignore`),
      this.props
    );
  }

  _copyERC20() {
    if (this.props.customizeERC20) {
      this.fs.write(
        this.destinationPath(`${this.props.srcDir}/ERC20.cairo`),
        erc20print(this.props)
      );
    } else {
      this.fs.copyTpl(
        this.templatePath("contracts/ERC20.cairo"),
        this.destinationPath(`${this.props.srcDir}/ERC20.cairo`),
        this.props
      );
    }
  }

  _copyERC721() {
    if (this.props.customizeERC721) {
      this.fs.write(
        this.destinationPath(`${this.props.srcDir}/ERC721.cairo`),
        erc721print(this.props)
      );
    } else {
      this.fs.copyTpl(
        this.templatePath("contracts/ERC721.cairo"),
        this.destinationPath(`${this.props.srcDir}/ERC721.cairo`),
        this.props
      );
    }
  }

  install() {}

  end() {
    this._goodbye();
  }

  async _greetings() {
    let starknetStr = "";
    starknetStr +=
      "  ██████ ▄▄▄█████▓ ▄▄▄       ██▀███   ██ ▄█▀ ███▄    █ ▓█████▄▄▄█████▓\n";
    starknetStr +=
      "▒██    ▒ ▓  ██▒ ▓▒▒████▄    ▓██ ▒ ██▒ ██▄█▒  ██ ▀█   █ ▓█   ▀▓  ██▒ ▓▒\n";
    starknetStr +=
      "░ ▓██▄   ▒ ▓██░ ▒░▒██  ▀█▄  ▓██ ░▄█ ▒▓███▄░ ▓██  ▀█ ██▒▒███  ▒ ▓██░ ▒░\n";
    starknetStr +=
      "  ▒   ██▒░ ▓██▓ ░ ░██▄▄▄▄██ ▒██▀▀█▄  ▓██ █▄ ▓██▒  ▐▌██▒▒▓█  ▄░ ▓██▓ ░\n";
    starknetStr +=
      "▒██████▒▒  ▒██▒ ░  ▓█   ▓██▒░██▓ ▒██▒▒██▒ █▄▒██░   ▓██░░▒████▒ ▒██▒ ░\n";
    starknetStr +=
      "▒ ▒▓▒ ▒ ░  ▒ ░░    ▒▒   ▓▒█░░ ▒▓ ░▒▓░▒ ▒▒ ▓▒░ ▒░   ▒ ▒ ░░ ▒░ ░ ▒ ░░\n";
    starknetStr +=
      "░ ░▒  ░ ░    ░      ▒   ▒▒ ░  ░▒ ░ ▒░░ ░▒ ▒░░ ░░   ░ ▒░ ░ ░  ░   ░\n";
    starknetStr +=
      "░  ░  ░    ░        ░   ▒     ░░   ░ ░ ░░ ░    ░   ░ ░    ░    ░\n";
    starknetStr +=
      "      ░                 ░  ░   ░     ░  ░            ░    ░  ░\n";

    let generatorStr = "";
    generatorStr +=
      "  ▄████ ▓█████  ███▄    █ ▓█████  ██▀███   ▄▄▄     ▄▄▄█████▓ ▒█████   ██▀███\n";
    generatorStr +=
      " ██▒ ▀█▒▓█   ▀  ██ ▀█   █ ▓█   ▀ ▓██ ▒ ██▒▒████▄   ▓  ██▒ ▓▒▒██▒  ██▒▓██ ▒ ██▒\n";
    generatorStr +=
      "▒██░▄▄▄░▒███   ▓██  ▀█ ██▒▒███   ▓██ ░▄█ ▒▒██  ▀█▄ ▒ ▓██░ ▒░▒██░  ██▒▓██ ░▄█ ▒\n";
    generatorStr +=
      "░▓█  ██▓▒▓█  ▄ ▓██▒  ▐▌██▒▒▓█  ▄ ▒██▀▀█▄  ░██▄▄▄▄██░ ▓██▓ ░ ▒██   ██░▒██▀▀█▄\n";
    generatorStr +=
      "░▒▓███▀▒░▒████▒▒██░   ▓██░░▒████▒░██▓ ▒██▒ ▓█   ▓██▒ ▒██▒ ░ ░ ████▓▒░░██▓ ▒██▒\n";
    generatorStr +=
      " ░▒   ▒ ░░ ▒░ ░░ ▒░   ▒ ▒ ░░ ▒░ ░░ ▒▓ ░▒▓░ ▒▒   ▓▒█░ ▒ ░░   ░ ▒░▒░▒░ ░ ▒▓ ░▒▓░\n";
    generatorStr +=
      "  ░   ░  ░ ░  ░░ ░░   ░ ▒░ ░ ░  ░  ░▒ ░ ▒░  ▒   ▒▒ ░   ░      ░ ▒ ▒░   ░▒ ░ ▒░\n";
    generatorStr +=
      "░ ░   ░    ░      ░   ░ ░    ░     ░░   ░   ░   ▒    ░      ░ ░ ░ ▒    ░░   ░\n";
    generatorStr +=
      "      ░    ░  ░         ░    ░  ░   ░           ░  ░            ░ ░     ░\n";

    this.log("\n");
    this.log(`${chalk.magenta(starknetStr)}`);
    this.log(`${chalk.cyan(generatorStr)}`);
    this.log(
      yosay(`${chalk.magenta("GM")} from ${chalk.green("starknet")} generator!`)
    );
  }

  _goodbye() {
    this.log(yosay(`Bye! Enjoy building on ${chalk.green("starknet")}!`));
    this.log(`Go to project: ${chalk.green(`cd ${this.props.outputDir}`)}`);
    this.log(
      `Follow the instructions on ${chalk.blue(
        "README.md"
      )} to setup, compile and tests the contracts.`
    );
  }
};
