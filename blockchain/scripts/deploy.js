const hre = require("hardhat");

async function main() {
    const [deployer] = await hre.ethers.getSigners();
    console.log("Deploying contracts with the account:", deployer.address);

    const HealthRecord = await hre.ethers.getContractFactory("HealthRecord");
    const healthRecord = await HealthRecord.deploy();
    await healthRecord.waitForDeployment();
    console.log("HealthRecord deployed to:", await healthRecord.getAddress());

    const ConsentManager = await hre.ethers.getContractFactory("ConsentManager");
    const consentManager = await ConsentManager.deploy();
    await consentManager.waitForDeployment();
    console.log("ConsentManager deployed to:", await consentManager.getAddress());

    const InsuranceClaim = await hre.ethers.getContractFactory("InsuranceClaim");
    const insuranceClaim = await InsuranceClaim.deploy();
    await insuranceClaim.waitForDeployment();
    console.log("InsuranceClaim deployed to:", await insuranceClaim.getAddress());

    console.log("\n--- CONTRACT ADDRESSES ---");
    console.log("HealthRecord:   ", await healthRecord.getAddress());
    console.log("ConsentManager: ", await consentManager.getAddress());
    console.log("InsuranceClaim: ", await insuranceClaim.getAddress());
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
