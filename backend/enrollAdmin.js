'use strict';

require('dotenv').config();

const FabricCAServices = require('fabric-ca-client');
const { Wallets } = require('fabric-network');
const fs = require('fs');
const path = require('path');

async function main() {
    try {
        const ccpPath = path.resolve(process.env.CCP_PATH);
        const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

        const caInfo = ccp.certificateAuthorities['ca.org1.example.com'];
        const caTLSCACerts = caInfo.tlsCACerts.pem;
        const ca = new FabricCAServices(caInfo.url, { trustedRoots: caTLSCACerts, verify: false }, caInfo.caName);

        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = await Wallets.newFileSystemWallet(walletPath);

        // Enroll CA admin (bootstrap identity)
        const enrollment = await ca.enroll({ 
            enrollmentID: 'admin', 
            enrollmentSecret: 'adminpw' 
        });
        
        const adminIdentity = {
            credentials: {
                certificate: enrollment.certificate,
                privateKey: enrollment.key.toBytes(),
            },
            mspId: 'Org1MSP',
            type: 'X.509',
        };
        
        await wallet.put('caAdmin', adminIdentity);
        
        const adminUser = await wallet.get('caAdmin');
        const provider = wallet.getProviderRegistry().getProvider(adminUser.type);
        const caAdminUser = await provider.getUserContext(adminUser, 'caAdmin');

        // ✅ Register new admin user với role attribute
        const secret = await ca.register({
            enrollmentID: 'appAdmin',
            enrollmentSecret: 'appAdminpw',
            role: 'client',
            attrs: [
                { name: 'role', value: 'admin', ecert: true }  // ✅ Set role = admin
            ]
        }, caAdminUser);

        console.log(`Successfully registered user "appAdmin" with role=admin`);
        console.log(`Secret: ${secret}`);

        // Enroll the new admin
        const appAdminEnrollment = await ca.enroll({
            enrollmentID: 'appAdmin',
            enrollmentSecret: secret,
            attr_reqs: [
                { name: 'role', optional: false }
            ]
        });

        const appAdminIdentity = {
            credentials: {
                certificate: appAdminEnrollment.certificate,
                privateKey: appAdminEnrollment.key.toBytes(),
            },
            mspId: 'Org1MSP',
            type: 'X.509',
        };

        await wallet.put('appAdmin', appAdminIdentity);
        console.log('Successfully enrolled appAdmin with role attribute');

    } catch (error) {
        console.error(`Failed to register admin: ${error}`);
        process.exit(1);
    }
}

main();