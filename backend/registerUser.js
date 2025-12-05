const { Wallets } = require('fabric-network');
const FabricCAServices = require('fabric-ca-client');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const USER_NAME = "appUser";
const ADMIN_NAME = "caAdmin";  // ✅ Dùng caAdmin thay vì appAdmin

async function registerUser() {
    try {
        const ccpPath = path.resolve(process.env.CCP_PATH);
        const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check if user already exists
        const userIdentity = await wallet.get(USER_NAME);
        if (userIdentity) {
            console.log(`User "${USER_NAME}" already exists in wallet`);
            return;
        }

        // Dùng caAdmin (có full registrar rights)
        const adminIdentity = await wallet.get(ADMIN_NAME);
        if (!adminIdentity) {
            console.log(`${ADMIN_NAME} identity not found`);
            return;
        }

        const caInfo = ccp.certificateAuthorities['ca.org1.example.com'];
        const caTLSCACerts = caInfo.tlsCACerts.pem;
        const ca = new FabricCAServices(caInfo.url, { 
            trustedRoots: caTLSCACerts, 
            verify: false 
        }, caInfo.caName);

        const provider = wallet.getProviderRegistry().getProvider(adminIdentity.type);
        const adminUser = await provider.getUserContext(adminIdentity, ADMIN_NAME);

        // Register user
        const secret = await ca.register({
            affiliation: 'org1.department1',
            enrollmentID: USER_NAME,
            role: 'client',
            attrs: [
                { name: 'role', value: 'user', ecert: true }
            ]
        }, adminUser);

        console.log(`✅ User "${USER_NAME}" registered with secret: ${secret}`);

        // Enroll user
        const enrollment = await ca.enroll({
            enrollmentID: USER_NAME,
            enrollmentSecret: secret,
            attr_reqs: [
                { name: 'role', optional: false }
            ]
        });

        const x509Identity = {
            credentials: {
                certificate: enrollment.certificate,
                privateKey: enrollment.key.toBytes(),
            },
            mspId: 'Org1MSP',
            type: 'X.509',
        };

        await wallet.put(USER_NAME, x509Identity);
        console.log(`✅ Successfully registered and enrolled user "${USER_NAME}"`);

    } catch (error) {
        console.error(`❌ Failed to register user: ${error}`);
        process.exit(1);
    }
}

registerUser();