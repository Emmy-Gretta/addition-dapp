const Adder = artifacts.require("Adder");

module.exports = function (deployer) {
  deployer.deploy(Adder);
};
