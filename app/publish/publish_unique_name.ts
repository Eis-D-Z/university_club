import * as process from 'child_process';
import * as fs from 'fs';
import { getFullnodeUrl, SuiClient } from '@mysten/sui.js/client';

// this should not work if the package wasn't published
import { network, packageId } from '../src/constants';

/// Script to publish a new unique name.
/// This should be done by every club that intends to use the contract.
/// The example here could have been simpler, we chose this approach to show different aspects of Sui.

const currentPath = process.execSync('echo $PWD');
const resStr = currentPath.toString('utf-8');
const path = resStr.slice(0, resStr.indexOf('_club') + 5);
const responseFilePath = `${path}/app/publish/respPub.json`;
const constantsFilePath = `${path}/app/src/constants.ts`;
const packagePath = `${path}/club_name`;

process.execSync(`sui client publish --json --gas-budget 1000000000 ${packagePath} > ${responseFilePath}`);
const data = fs.readFileSync(responseFilePath, { encoding: 'utf-8' });
const response: any = JSON.parse(data);

const pkgId = response.objectChanges.find((item) => item.type === 'published').packageId;

const findWitness = async () => {
	const client = new SuiClient({ url: getFullnodeUrl(network) });

    const response = await client.getNormalizedMoveModulesByPackage({package: pkgId});
    const clubName = Object.keys(response["unique_name"].structs)[0];
    return clubName
};

findWitness().then(response => {
    const clubNameType = `${pkgId}::unique_name::${response}`;
    const clubType = `${packageId}::club::Club<${clubNameType}>`;
    const clubMemberType = `${packageId}::club::ClubMember<${clubNameType}>`;

    const toWrite = `export const ClubMemberType = "${clubMemberType}";\nexport const ClubType = "${clubType}";\nexport const ClubNameType = "${clubNameType}";\n`;
    fs.appendFileSync(constantsFilePath, toWrite);
})
