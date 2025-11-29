const { Wallets, Gateway } = require('fabric-network');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function connectToNetwork(contractName, isAdmin = false) {
    const user = isAdmin ? 'appAdmin' : 'appUser';
    const ccpPath = path.resolve(process.env.CCP_PATH);
    const chaincodeName = process.env.CHAINCODE_NAME || 'qlthongtindat';
    const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));
    const wallet = await Wallets.newFileSystemWallet(path.join(process.cwd(), 'wallet'));

    const identity = await wallet.get(user);
    if (!identity) throw new Error('User identity not found in wallet');

    const gateway = new Gateway();
    await gateway.connect(ccp, {
        wallet,
        identity: user,
        discovery: { enabled: true, asLocalhost: true }
    });

    const network = await gateway.getNetwork(process.env.CHANNEL_NAME || 'mychannel');
    const contract = network.getContract(chaincodeName, contractName);
    return { gateway, contract };
}

module.exports = { connectToNetwork };
