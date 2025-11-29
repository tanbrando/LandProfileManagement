'use strict';
const { Contract } = require('fabric-contract-api');
const { requireAdmin } = require('./utils');

function landKey(maSo) { return `DAT_${maSo}`; }
function userKey(userId) { return `USER_${userId}`; }
function transKey(txId) { return `TRANS_${txId}`; }

const transferTypes = ['transfer', 'mortgage', 'inheritance', 'gift'];

class QLChuyenNhuong extends Contract {
    constructor() { super('QLChuyenNhuong'); }

    async _getActiveUser(ctx, userId) {
        const u = await ctx.stub.getState(userKey(userId));
        if (!u || u.length===0) throw new Error(`User ${userId} khong ton tai`);
        const user = JSON.parse(u.toString());
        if (!user.active) throw new Error(`User ${userId} bi khoa`);
        return user;
    }

    async createTransaction(ctx, maSo, chuSoHuuCu, chuSoHuuMoi, giaTri, loaiGiaoDich, thoiGian) {
        if (!transferTypes.includes(loaiGiaoDich)) throw new Error(`Loai giao dich khong hop le`);
        const landBytes = await ctx.stub.getState(landKey(maSo));
        if (!landBytes || landBytes.length===0) throw new Error(`Dat ${maSo} khong ton tai`);
        const land = JSON.parse(landBytes.toString());
        if (land.trangThai!=='active') throw new Error(`Dat ${maSo} khong o trang thai active`);
        land.trangThai = 'inactive';
        await ctx.stub.putState(landKey(maSo), Buffer.from(JSON.stringify(land)));

        await this._getActiveUser(ctx, chuSoHuuCu);
        if (land.chuSoHuu !== chuSoHuuCu) throw new Error('Chu so huu hien tai khong dung');

        await this._getActiveUser(ctx, chuSoHuuMoi);
        if (land.chuSoHuu === chuSoHuuMoi) throw new Error('Nguoi nhan trung voi chu so huu hien tai');

        const txId = ctx.stub.getTxID();
        const txRecord = { 
            docType:'giaodich', 
            txId, 
            maSo, 
            from:chuSoHuuCu, 
            to:chuSoHuuMoi, 
            giaTri:parseFloat(giaTri)|| land.giaTriDat, 
            loaiGiaoDich:loaiGiaoDich, 
            thoiGian:thoiGian, 
            status:'pending' };
        await ctx.stub.putState(transKey(txId), Buffer.from(JSON.stringify(txRecord)));
        return txRecord;
    }

    async approveTransaction(ctx, txId) {
        await requireAdmin(ctx);
        const txBytes = await ctx.stub.getState(transKey(txId));
        if (!txBytes || txBytes.length===0) throw new Error(`Transaction ${txId} not found`);
        const txRecord = JSON.parse(txBytes.toString());
        if (txRecord.status !== 'pending') throw new Error(`Transaction ${txId} khong o trang thai pending`);
        const landBytes = await ctx.stub.getState(landKey(txRecord.maSo));
        if (!landBytes || landBytes.length===0) throw new Error(`Dat ${txRecord.maSo} khong ton tai`);
        const land = JSON.parse(landBytes.toString());
        land.chuSoHuu = txRecord.to;
        land.giaTriDat = txRecord.giaTri;
        land.trangThai = 'active';
        await ctx.stub.putState(landKey(txRecord.maSo), Buffer.from(JSON.stringify(land)));
        txRecord.status = 'approved';
        await ctx.stub.putState(transKey(txId), Buffer.from(JSON.stringify(txRecord)));

        ctx.stub.setEvent('ChuyenNhuongDat', Buffer.from(JSON.stringify(txRecord)));
    }

    async rejectTransaction(ctx, txId) {
        await requireAdmin(ctx);
        const txBytes = await ctx.stub.getState(transKey(txId));
        if (!txBytes || txBytes.length===0) throw new Error(`Transaction ${txId} not found`);
        const txRecord = JSON.parse(txBytes.toString());
        if (txRecord.status !== 'pending') throw new Error(`Transaction ${txId} khong o trang thai pending`);
        const landBytes = await ctx.stub.getState(landKey(txRecord.maSo));
        if (!landBytes || landBytes.length===0) throw new Error(`Dat ${txRecord.maSo} khong ton tai`);
        const land = JSON.parse(landBytes.toString());
        land.trangThai = 'active';
        await ctx.stub.putState(landKey(txRecord.maSo), Buffer.from(JSON.stringify(land)));
        txRecord.status = 'rejected';
        await ctx.stub.putState(transKey(txId), Buffer.from(JSON.stringify(txRecord)));
    }

    async cancelTransaction(ctx, txId, userId) {
        const txBytes = await ctx.stub.getState(transKey(txId));
        if (!txBytes || txBytes.length===0) throw new Error(`Transaction ${txId} not found`);
        const txRecord = JSON.parse(txBytes.toString());
        if (txRecord.from !== userId) throw new Error(`User ${userId} khong co quyen huy giao dich nay`);
        if (txRecord.status !== 'pending') throw new Error(`Transaction ${txId} khong o trang thai pending`);
        const landBytes = await ctx.stub.getState(landKey(txRecord.maSo));
        if (!landBytes || landBytes.length===0) throw new Error(`Dat ${txRecord.maSo} khong ton tai`);
        const land = JSON.parse(landBytes.toString());
        land.trangThai = 'active';
        await ctx.stub.putState(landKey(txRecord.maSo), Buffer.from(JSON.stringify(land)));
        txRecord.status = 'cancelled';
        await ctx.stub.putState(transKey(txId), Buffer.from(JSON.stringify(txRecord)));
    }

    async queryTransaction(ctx, txId) {
        const b = await ctx.stub.getState(transKey(txId));
        if (!b || b.length===0) throw new Error(`Transaction ${txId} not found`);
        return b.toString();
    }

    async queryAllTransactions(ctx) {
        await requireAdmin(ctx);
        const startKey='TRANS_'; const endKey='TRANS_\uFFFF';
        const allResults=[];
        for await (const {key,value} of ctx.stub.getStateByRange(startKey,endKey)) {
            allResults.push({ Key:key, Record:JSON.parse(value.toString('utf8')) });
        }
        return JSON.stringify(allResults);
    }

    async queryTransactionsByUser(ctx, userId) {
        const startKey='TRANS_'; const endKey='TRANS_\uFFFF';
        const allResults=[];
        for await (const {key,value} of ctx.stub.getStateByRange(startKey,endKey)) {
            const record = JSON.parse(value.toString('utf8'));
            if (record.from === userId || record.to === userId) {
                allResults.push({ Key:key, Record:record });
            }
        }
        return JSON.stringify(allResults);
    }

}

module.exports = QLChuyenNhuong;
