/* Javascipt
 * Chaincode Quan Ly Thong Tin Dat
 * Export module
 */

'use strict';

const QLThongTinDat = require('./qlthongtindat');
const QLTaiKhoan = require('./qltaikhoan');
const QLChuyenNhuong = require('./qlchuyennhuong');

module.exports.QLThongTinDat = QLThongTinDat;
module.exports.QLTaiKhoan = QLTaiKhoan;
module.exports.QLChuyenNhuong = QLChuyenNhuong;

module.exports.contracts = [QLThongTinDat, QLTaiKhoan, QLChuyenNhuong];