"use strict";
const Generator = require("yeoman-generator");
const chalk = require("chalk");
const yosay = require("yosay");

module.exports = class extends Generator {
  initializing() {
    this._greetings();
  }

  // Prompt user for configuration choices
  prompting() {
    const prompts = [
      {
        type: "input",
        name: "outputDir",
        message: "What is the root directory for the generated project?",
        default: "."
      }
    ];

    return this.prompt(prompts).then(props => {
      this.props = props;
    });
  }

  // Write the generated files
  writing() {
    const outputDir = this.props.outputDir;
    this.fs.copy(
      this.templatePath("nile/README.md"),
      this.destinationPath(`${outputDir}/README.md`)
    );
  }

  install() {}

  end() {
    this._goodbye();
  }

  _greetings() {
    this.log(yosay(`GM from ${chalk.green("starknet")} generator!`));
  }

  _goodbye() {
    this.log(yosay(`Bye! Enjoy building on ${chalk.green("starknet")}!`));
  }
};
