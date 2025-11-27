'use strict';
const { ClientIdentity } = require('fabric-shim');
const crypto = require('crypto');

function hashPassword(password) {
    return crypto.createHash('sha256').update(password).digest('hex');
}

async function requireAdmin(ctx) {
    const cid = new ClientIdentity(ctx.stub);
    try {
        const role = cid.getAttributeValue('role');
        if (role === 'admin') return true;
    } catch(e) {}
    throw new Error('Permission denied: admin role required');
}

module.exports = { hashPassword, requireAdmin };
