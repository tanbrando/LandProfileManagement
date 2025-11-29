'use strict';
const { Contract } = require('fabric-contract-api');
const { requireAdmin } = require('./utils');

function landKey(maSo) { return `DAT_${maSo}`; }

const landStatuses = ['active', 'inactive', 'removed'];
const landTypes = ['ONT', 'ODT', 'LUC', 'CLN', 'RSX', 'NTS', 'SKC', 'TMD', 'DGT', 'DKV'];

class QLThongTinDat extends Contract {
    constructor() { super('QLThongTinDat'); }

    async initLedger(ctx) {
        const lands = [
            { maSo:'DAT001', chuSoHuu:'user001', diaChi:'Phuong 1', dienTich:100.5, loaiDat:'ONT', soGiayTo:'GCN001', ngayCapGiayTo:'2020-01-15', giaTriDat:5000000000, docType:'thongtindat', trangThai:'active' },
            { maSo:'DAT002', chuSoHuu:'user001', diaChi:'Phuong 2', dienTich:250, loaiDat:'LUC', soGiayTo:'GCN002', ngayCapGiayTo:'2019-05-20', giaTriDat:2500000000, docType:'thongtindat', trangThai:'active' }
        ];
        for (const d of lands) { await ctx.stub.putState(landKey(d.maSo), Buffer.from(JSON.stringify(d))); }
        return 'Initialized 2 sample lands';
    }

    async createLandProfile(ctx, maSo, chuSoHuu, diaChi, dienTich, loaiDat, soGiayTo, ngayCapGiayTo, giaTriDat) {
        await requireAdmin(ctx);
        const exists = await ctx.stub.getState(landKey(maSo));
        if (exists && exists.length>0) throw new Error(`Dat ${maSo} da ton tai`);
        const userBytes = await ctx.stub.getState(`USER_${chuSoHuu}`);
        if (!userBytes || userBytes.length===0) throw new Error(`Chu so huu ${chuSoHuu} khong ton tai`);
        if (!landTypes.includes(loaiDat)) throw new Error(`Loai dat ${loaiDat} khong hop le`);
        const land = { docType:'thongtindat', maSo, chuSoHuu, diaChi, dienTich:parseFloat(dienTich), loaiDat, soGiayTo, ngayCapGiayTo, giaTriDat:parseFloat(giaTriDat), trangThai:'active' };
        await ctx.stub.putState(landKey(maSo), Buffer.from(JSON.stringify(land)));
        return JSON.stringify(land);
    }   

    async updateLandProfile(ctx, maSo, diaChi, dienTich, loaiDat, soGiayTo, ngayCapGiayTo, giaTriDat) {
        await requireAdmin(ctx);
        const b = await ctx.stub.getState(landKey(maSo));
        if (!b || b.length===0) throw new Error(`Dat ${maSo} khong ton tai`);
        const dat = JSON.parse(b.toString());
        if (!landTypes.includes(loaiDat)) throw new Error(`Loai dat ${loaiDat} khong hop le`);
        dat.diaChi = diaChi; dat.dienTich=parseFloat(dienTich); dat.loaiDat=loaiDat;
        dat.soGiayTo=soGiayTo; dat.ngayCapGiayTo=ngayCapGiayTo; dat.giaTriDat=parseFloat(giaTriDat);
        await ctx.stub.putState(landKey(maSo), Buffer.from(JSON.stringify(dat)));
        return JSON.stringify(dat);
    }

    async deleteLandProfile(ctx, maSo) {
        await requireAdmin(ctx);
        const b = await ctx.stub.getState(landKey(maSo));
        if (!b || b.length===0) throw new Error(`Dat ${maSo} khong ton tai`);
        await ctx.stub.deleteState(landKey(maSo));
        return `Deleted ${maSo}`;
    }

    async queryLandProfile(ctx, maSo) {
        const b = await ctx.stub.getState(landKey(maSo));
        if (!b || b.length===0) throw new Error(`Dat ${maSo} khong ton tai`);
        return b.toString();
    }

    async queryAllLandProfiles(ctx) {
        const startKey = 'DAT_'; const endKey = 'DAT_\uFFFF';
        const allResults=[];
        for await (const {key,value} of ctx.stub.getStateByRange(startKey,endKey)) {
            allResults.push({ Key:key, Record:JSON.parse(value.toString('utf8')) });
        }
        return JSON.stringify(allResults);
    }

    async updateLandStatus(ctx, maSo, trangThai) {
        await requireAdmin(ctx);
        if (!landStatuses.includes(trangThai)) throw new Error(`Trang thai ${trangThai} khong hop le`);
        const b = await ctx.stub.getState(landKey(maSo));
        if (!b || b.length===0) throw new Error(`Dat ${maSo} khong ton tai`);
        const dat = JSON.parse(b.toString());
        dat.trangThai = trangThai;
        await ctx.stub.putState(landKey(maSo), Buffer.from(JSON.stringify(dat)));
        return JSON.stringify(dat);
    }

}

module.exports = QLThongTinDat;
