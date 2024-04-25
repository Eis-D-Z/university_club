import * as fs from "fs";
import * as process from "child_process";

/// Script that publishes the main contract. This is for testing purposes only!!

// This can be populated with more as the project grows.
const importantTypes = {
    Config: "::club::Config",
}

// Here the assumption is that aliases are contain testnet devnet, mainnet or localnet in their name
const network = process.execSync("sui client active-env").toString("utf-8");
const networkName = ["local", "devnet", "testnet", "mainnet"].find((item) => network.includes(item));

if(networkName === "mainnet") {
    throw new Error("You are trying to publish to mainnet, this module should have already been published!");
    
}

const currentPath = process.execSync("echo $PWD");
const resStr = currentPath.toString("utf-8");
const path = resStr.slice(0, resStr.indexOf("_club") + 5);
const responseFilePath = `${path}/app/publish/respPub.json`
const constantsFilePath = `${path}/app//src/constants.ts`

process.execSync(`sui client publish --json --gas-budget 1000000000 ${path} > ${responseFilePath}`);
const data = fs.readFileSync(responseFilePath, {encoding: "utf-8"});
const response: any = JSON.parse(data);

const constants: any = {};
constants.network = networkName;
response.objectChanges.forEach((item) => {
    Object.entries(importantTypes).forEach(([key, value]) => {
        if(item.objectType && item.objectType.includes(value))
            constants[key] = item.objectId;
    });
    if(item.type === "published")
        constants.packageId = item.packageId;
});

let toWrite = "";
Object.entries(constants).forEach(([key, value]) => {
    toWrite = toWrite + `export const ${key} = "${value}";\n`
});
fs.writeFileSync(constantsFilePath, toWrite);
