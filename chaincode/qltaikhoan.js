'use strict';
const { Contract } = require('fabric-contract-api');
const { hashPassword, requireAdmin } = require('./utils');

function userKey(userId) { return `USER_${userId}`; }

const userRoles = ['admin', 'user'];

class QLTaiKhoan extends Contract {
    constructor() { super('QLTaiKhoan'); }

    async initLedger(ctx) {
        const admin = { userId:'admin', name:'Administrator', passwordHash:hashPassword('adminpw'),email: 'admin@qlthongtindat.com', phone: '1234567890', role:'admin', active:true, createdAt:new Date().toISOString() };
        await ctx.stub.putState(userKey(admin.userId), Buffer.from(JSON.stringify(admin)));

        const user1 = { userId:'user1', name:'Nguyen Van A', passwordHash:hashPassword('user1pw'), email: 'user1@example.com', phone: '0987654321', role:'user', active:true, createdAt:new Date().toISOString() };
        await ctx.stub.putState(userKey(user1.userId), Buffer.from(JSON.stringify(user1)));

        return 'Initialized 2 users';
    }

    async createUser(ctx, userId, name, password, email, phone) {
        const exists = await ctx.stub.getState(userKey(userId));
        if (exists && exists.length > 0) throw new Error(`User ${userId} already exists`);

        const user = {
            userId,
            name,
            passwordHash: hashPassword(password),
            email,
            phone,
            role: 'user', 
            active: true,
            createdAt: new Date().toISOString()
        };

        await ctx.stub.putState(userKey(userId), Buffer.from(JSON.stringify(user)));
        return JSON.stringify(user);
    }

    async updateUserRole(ctx, userId, newRole) {
        await requireAdmin(ctx);  // chỉ admin được nâng quyền
        if (!userRoles.includes(newRole)) throw new Error(`Role ${newRole} is not valid`);
        const userBytes = await ctx.stub.getState(userKey(userId));
        if (!userBytes || userBytes.length === 0) throw new Error(`User ${userId} not found`);
        const user = JSON.parse(userBytes.toString());
        user.role = newRole;
        user.updatedAt = new Date().toISOString();
        await ctx.stub.putState(userKey(userId), Buffer.from(JSON.stringify(user)));
        return JSON.stringify(user);
    }

    async authenticate(ctx, userId, password) {
        const userBytes = await ctx.stub.getState(userKey(userId));
        if (!userBytes || userBytes.length===0) throw new Error('Authentication failed');
        const user = JSON.parse(userBytes.toString());
        if (!user.active) throw new Error('User is deactivated');
        if (hashPassword(password) !== user.passwordHash) throw new Error('Authentication failed');
        delete user.passwordHash;
        return JSON.stringify(user);
    }

    async queryUser(ctx, userId) {
        const userBytes = await ctx.stub.getState(userKey(userId));
        if (!userBytes || userBytes.length===0) throw new Error(`User ${userId} not found`);
        return userBytes.toString();
    }

    async queryUserByEmail(ctx, email) {
        const startKey = 'USER_';
        const endKey = 'USER_\uFFFF';
        for await (const { key,value } of ctx.stub.getStateByRange(startKey,endKey)) {
            const record = JSON.parse(value.toString('utf8'));
            if (record.email === email) {
                return JSON.stringify(record);
            }
        }
        throw new Error(`User with email ${email} not found`);
    }

    async queryAllUsers(ctx) {
        const startKey = 'USER_';
        const endKey = 'USER_\uFFFF';
        const allResults = [];
        for await (const { key,value } of ctx.stub.getStateByRange(startKey,endKey)) {
            const record = JSON.parse(value.toString('utf8'));
            allResults.push({ Key:key, Record:record });
        }
        return JSON.stringify(allResults);
    }

    async deactivateUser(ctx, userId) {
        await requireAdmin(ctx);
        const userBytes = await ctx.stub.getState(userKey(userId));
        if (!userBytes || userBytes.length===0) throw new Error(`User ${userId} not found`);
        const user = JSON.parse(userBytes.toString());
        user.active = false;
        user.updatedAt = new Date().toISOString();
        await ctx.stub.putState(userKey(userId), Buffer.from(JSON.stringify(user)));
        return JSON.stringify(user);
    }

    async activateUser(ctx, userId) {
        await requireAdmin(ctx);
        const userBytes = await ctx.stub.getState(userKey(userId));
        if (!userBytes || userBytes.length===0) throw new Error(`User ${userId} not found`);
        const user = JSON.parse(userBytes.toString());
        user.active = true;
        user.updatedAt = new Date().toISOString();
        await ctx.stub.putState(userKey(userId), Buffer.from(JSON.stringify(user)));
        return JSON.stringify(user);
    }

    async updatePassword(ctx, userId, oldPassword, newPassword) {
        const userBytes = await ctx.stub.getState(userKey(userId));
        if (!userBytes || userBytes.length===0) throw new Error(`User ${userId} not found`);
        const user = JSON.parse(userBytes.toString());
        if (hashPassword(oldPassword) !== user.passwordHash) throw new Error('Old password is incorrect');
        user.passwordHash = hashPassword(newPassword);
        user.updatedAt = new Date().toISOString();
        await ctx.stub.putState(userKey(userId), Buffer.from(JSON.stringify(user)));
        return JSON.stringify(user);
    }

    async updateUserProfile(ctx, userId, name, email, phone) {
        const userBytes = await ctx.stub.getState(userKey(userId));
        if (!userBytes || userBytes.length===0) throw new Error(`User ${userId} not found`);
        const user = JSON.parse(userBytes.toString());
        user.name = name;
        user.email = email;
        user.phone = phone;
        user.updatedAt = new Date().toISOString();
        await ctx.stub.putState(userKey(userId), Buffer.from(JSON.stringify(user)));
        return JSON.stringify(user);
    }
}

module.exports = QLTaiKhoan;
