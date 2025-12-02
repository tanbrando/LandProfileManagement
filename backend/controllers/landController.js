const {connectToNetwork} = require('../fabric/network');
const contractName = 'QLThongTinDat';

async function initLedger(req, res) {
    let gateway;
    try {
        const connection = await connectToNetwork(contractName, true);
        gateway = connection.gateway;
        const contract = connection.contract;

        await contract.submitTransaction('initLedger');
        res.status(200).json({ success: true, message: 'Đã khởi tạo dữ liệu thành công' });
    } catch (error) {
        console.error(`Lỗi khi khởi tạo dữ liệu: ${error}`);
        res.status(500).json({ success: false, message: `Lỗi khi khởi tạo dữ liệu: ${error.message}` });
    } finally {
        if (gateway) {
            try {
                gateway.disconnect(); 
            } catch (err) {
                console.error('Lỗi khi ngắt kết nối gateway:', err);
            }
        }
    }
}

async function getAllLandProfiles(req, res) {
    let gateway;
    try {
        const connection = await connectToNetwork(contractName);
        gateway = connection.gateway;
        const contract = connection.contract;
        const result = await contract.evaluateTransaction('queryAllLandProfiles');
        res.status(200).json({ success: true, data: JSON.parse(result.toString()) });
    } catch (error) {
        console.error(`Lỗi khi lấy danh sách đất: ${error}`);
        res.status(500).json({ success: false, message: `Lỗi khi lấy danh sách đất: ${error.message}` });
    } finally {
        if (gateway) {  
            try {
                gateway.disconnect(); 
            } catch (err) {
                console.error('Lỗi khi ngắt kết nối gateway:', err);
            }
        }
    }
}

async function getLandProfileById(req, res) {
    let gateway;
    try {
        const { maSo } = req.params;
        const connection = await connectToNetwork(contractName);
        gateway = connection.gateway;
        const contract = connection.contract;
        const result = await contract.evaluateTransaction('queryLandProfile', maSo);
        res.status(200).json({ success: true, data: JSON.parse(result.toString()) });
    } catch (error) {
        console.error(`Lỗi khi lấy thông tin đất: ${error}`);
        res.status(500).json({ success: false, message: `Lỗi khi lấy thông tin đất: ${error.message}` });
    } finally {
        if (gateway) {
            try {
                gateway.disconnect(); 
            } catch (err) {
                console.error('Lỗi khi ngắt kết nối gateway:', err);
            }
        }
    }
}

async function createLandProfile(req, res) {
    let gateway;
    try {
        const {
            maSo, chuSoHuu, diaChi, dienTich,
            loaiDat, soGiayTo, ngayCapGiayTo, giaTriDat
        } = req.body;
        const connection = await connectToNetwork(contractName, true);
        gateway = connection.gateway;
        const contract = connection.contract;

        await contract.submitTransaction(
            'createLandProfile',
            maSo, chuSoHuu, diaChi, dienTich.toString(),
            loaiDat, soGiayTo, ngayCapGiayTo, giaTriDat.toString()
        );
        res.status(201).json({ success: true, message: `Đã tạo thông tin đất ${maSo} thành công` });
    } catch (error) {
        console.error(`Lỗi khi tạo thông tin đất: ${error}`);
        res.status(500).json({ success: false, message: `Lỗi khi tạo thông tin đất: ${error.message}` });
    } finally {
        if (gateway) {
            try {
                gateway.disconnect(); 
            } catch (err) {
                console.error('Lỗi khi ngắt kết nối gateway:', err);
            }
        }
    }
}

async function updateLandProfile(req, res) {
    let gateway;
    try {
        const { maSo } = req.params;
        const { diaChi, dienTich, loaiDat, soGiayTo, ngayCapGiayTo, giaTriDat } = req.body;
        const connection = await connectToNetwork(contractName, true);
        gateway = connection.gateway;
        const contract = connection.contract;   
        await contract.submitTransaction(
            'updateLandProfile',
            maSo, diaChi, dienTich.toString(),
            loaiDat, soGiayTo, ngayCapGiayTo, giaTriDat.toString()
        );
        res.status(200).json({ success: true, message: `Đã cập nhật thông tin đất ${maSo} thành công` });
    } catch (error) {
        console.error(`Lỗi khi cập nhật thông tin đất: ${error}`);
        res.status(500).json({ success: false, message: `Lỗi khi cập nhật thông tin đất: ${error.message}` });
    } finally {
        if (gateway) {
            try {
                gateway.disconnect(); 
            } catch (err) {
                console.error('Lỗi khi ngắt kết nối gateway:', err);
            }
        }
    }
}

async function deleteLandProfile(req, res) {
    let gateway;
    try {
        const { maSo } = req.params;
        const connection = await connectToNetwork(contractName, true);
        gateway = connection.gateway;
        const contract = connection.contract;   
        await contract.submitTransaction('deleteLandProfile', maSo);
        res.status(200).json({ success: true, message: `Đã xóa thông tin đất ${maSo} thành công` });
    } catch (error) {
        console.error(`Lỗi khi xóa thông tin đất: ${error}`);
        res.status(500).json({ success: false, message: `Lỗi khi xóa thông tin đất: ${error.message}` });
    } finally {
        if (gateway) {
            try {
                gateway.disconnect(); 
            } catch (err) {
                console.error('Lỗi khi ngắt kết nối gateway:', err);
            }
        }
    }
}

async function getUserLandProfiles(req, res) {
    let gateway;
    try {
        const userId = req.params.chuSoHuu || req.user?.userId;
        const connection = await connectToNetwork(contractName);
        gateway = connection.gateway;
        const contract = connection.contract;
        const result = await contract.evaluateTransaction('queryAllLandProfiles');
        const allLands = JSON.parse(result.toString());
        const userLands = allLands.filter(land => land.Record.chuSoHuu === userId);
        res.status(200).json({ success: true, data: userLands });
    } catch (error) {
        console.error(`Lỗi khi lấy danh sách đất của người dùng: ${error}`);
        res.status(500).json({ success: false, message: `Lỗi khi lấy danh sách đất của người dùng: ${error.message}` });
    } finally {
        if (gateway) {
            try {
                gateway.disconnect(); 
            } catch (err) {
                console.error('Lỗi khi ngắt kết nối gateway:', err);
            }
        }
    }
}

async function getLandProfilesByStatus(req, res) {
    let gateway;
    try {
        const { trangThai } = req.params;
        const connection = await connectToNetwork(contractName);
        gateway = connection.gateway;
        const contract = connection.contract;
        const result = await contract.evaluateTransaction('queryAllLandProfiles');
        const allLands = JSON.parse(result.toString());
        const filteredLands = allLands.filter(land => land.Record.trangThai === trangThai);
        res.status(200).json({ success: true, data: filteredLands });
    } catch (error) {
        console.error(`Lỗi khi lấy danh sách đất theo trạng thái: ${error}`);
        res.status(500).json({ success: false, message: `Lỗi khi lấy danh sách đất theo trạng thái: ${error.message}` });
    } finally {
        if (gateway) {
            try {
                gateway.disconnect(); 
            } catch (err) {
                console.error('Lỗi khi ngắt kết nối gateway:', err);
            }
        }
    }
}

async function getLandProfilesByRange(req, res) {
    let gateway;
    try {
        const { minGiaTri, maxGiaTri } = req.params;
        const connection = await connectToNetwork(contractName);
        gateway = connection.gateway;
        const contract = connection.contract;
        const result = await contract.evaluateTransaction('queryAllLandProfiles');
        const allLands = JSON.parse(result.toString());
        const filteredLands = allLands.filter(land => parseFloat(land.Record.giaTriDat) >= parseFloat(minGiaTri) && parseFloat(land.Record.giaTriDat) <= parseFloat(maxGiaTri));
        res.status(200).json({ success: true, data: filteredLands });
    } catch (error) {
        console.error(`Lỗi khi lấy danh sách đất theo khoảng giá trị: ${error}`);
        res.status(500).json({ success: false, message: `Lỗi khi lấy danh sách đất theo khoảng giá trị: ${error.message}` });
    } finally {
        if (gateway) {
            try {
                gateway.disconnect(); 
            } catch (err) {
                console.error('Lỗi khi ngắt kết nối gateway:', err);
            }
        }
    }
}

async function getLandProfilesByType(req, res) {
    let gateway;
    try {
        const { loaiDat } = req.params;
        const connection = await connectToNetwork(contractName);
        gateway = connection.gateway;
        const contract = connection.contract;
        const result = await contract.evaluateTransaction('queryAllLandProfiles');
        const allLands = JSON.parse(result.toString());
        const filteredLands = allLands.filter(land => land.Record.loaiDat === loaiDat);
        res.status(200).json({ success: true, data: filteredLands });
    } catch (error) {
        console.error(`Lỗi khi lấy danh sách đất theo loại đất: ${error}`);
        res.status(500).json({ success: false, message: `Lỗi khi lấy danh sách đất theo loại đất: ${error.message}` });
    } finally {
        if (gateway) {
            try {
                gateway.disconnect(); 
            } catch (err) {
                console.error('Lỗi khi ngắt kết nối gateway:', err);
            }
        }
    }
}

async function importCSVLandProfiles(req, res) {
    let gateway;
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'Vui lòng tải lên tệp CSV' });
        }
        const csvData = req.file.buffer.toString('utf-8');
        const lines = csvData.split('\n');  
        const header = lines[0].trim().split(',');
        const expectedHeader = ['maSo','chuSoHuu','diaChi','dienTich','loaiDat','soGiayTo','ngayCapGiayTo','giaTriDat'];
        if (header.length !== expectedHeader.length || !header.every((val, index) => val === expectedHeader[index])) {
            return res.status(400).json({ success: false, message: 'Định dạng CSV không hợp lệ' });
        }
        const connection = await connectToNetwork(contractName, true);
        gateway = connection.gateway;
        const contract = connection.contract;
        for (let i = 1; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line) continue;
            const [maSo, chuSoHuu, diaChi, dienTich, loaiDat, soGiayTo, ngayCapGiayTo, giaTriDat] = line.split(',');
            await contract.submitTransaction(
                'createLandProfile',
                maSo, chuSoHuu, diaChi, dienTich.toString(),
                loaiDat, soGiayTo, ngayCapGiayTo, giaTriDat.toString()
            );
        }
        res.status(200).json({ success: true, message: 'Đã nhập dữ liệu đất từ CSV thành công' });
    } catch (error) {
        console.error(`Lỗi khi nhập dữ liệu đất từ CSV: ${error}`);
        res.status(500).json({ success: false, message: `Lỗi khi nhập dữ liệu đất từ CSV: ${error.message}` });
    } finally {
        if (gateway) {
            try {
                gateway.disconnect(); 
            } catch (err) {
                console.error('Lỗi khi ngắt kết nối gateway:', err);
            }
        }
    }
}

async function exportCSVLandProfiles(req, res) {
    let gateway;
    try {
        const connection = await connectToNetwork(contractName);
        gateway = connection.gateway;
        const contract = connection.contract;
        const result = await contract.evaluateTransaction('queryAllLandProfiles');
        const allLands = JSON.parse(result.toString());
        let csvContent = 'maSo,chuSoHuu,diaChi,dienTich,loaiDat,soGiayTo,ngayCapGiayTo,giaTriDat,trangThai,createdAt,updatedAt\n';
        allLands.forEach(land => {
            const r = land.Record;
            csvContent += `${r.maSo},${r.chuSoHuu},${r.diaChi},${r.dienTich},${r.loaiDat},${r.soGiayTo},${r.ngayCapGiayTo},${r.giaTriDat},${r.trangThai},${r.createdAt},${r.updatedAt || ''}\n`;
        });
        res.setHeader('Content-disposition', 'attachment; filename=land_profiles.csv');
        res.set('Content-Type', 'text/csv');
        res.status(200).send(csvContent);
    } catch (error) {
        console.error(`Lỗi khi xuất dữ liệu đất ra CSV: ${error}`);
        res.status(500).json({ success: false, message: `Lỗi khi xuất dữ liệu đất ra CSV: ${error.message}` });
    } finally {
        if (gateway) {
            try {
                gateway.disconnect(); 
            } catch (err) {
                console.error('Lỗi khi ngắt kết nối gateway:', err);
            }
        }
    }
}

async function getLandTypeStatistics(req, res) {
    let gateway;
    try {
        const connection = await connectToNetwork(contractName);
        gateway = connection.gateway;
        const contract = connection.contract;
        const result = await contract.evaluateTransaction('queryAllLandProfiles');
        const allLands = JSON.parse(result.toString());
        const stats = {};
        allLands.forEach(land => {
            const type = land.Record.loaiDat;
            stats[type] = (stats[type] || 0) + 1;
        });
        res.status(200).json({ success: true, data: stats });
    } catch (error) {
        console.error(`Lỗi khi lấy thống kê loại đất: ${error}`);
        res.status(500).json({ success: false, message: `Lỗi khi lấy thống kê loại đất: ${error.message}` });
    } finally {
        if (gateway) {
            try {
                gateway.disconnect(); 
            } catch (err) {
                console.error('Lỗi khi ngắt kết nối gateway:', err);
            }
        }
    }
}

async function getLandStatusStatistics(req, res) {
    let gateway;
    try {
        const connection = await connectToNetwork(contractName);
        gateway = connection.gateway;   
        const contract = connection.contract;
        const result = await contract.evaluateTransaction('queryAllLandProfiles');
        const allLands = JSON.parse(result.toString());
        const stats = {};
        allLands.forEach(land => {
            const status = land.Record.trangThai;
            stats[status] = (stats[status] || 0) + 1;
        });
        res.status(200).json({ success: true, data: stats });
    } catch (error) {
        console.error(`Lỗi khi lấy thống kê trạng thái đất: ${error}`);
        res.status(500).json({ success: false, message: `Lỗi khi lấy thống kê trạng thái đất: ${error.message}` });
    } finally {
        if (gateway) {
            try {
                gateway.disconnect(); 
            } catch (err) {
                console.error('Lỗi khi ngắt kết nối gateway:', err);
            }
        }
    }
}

async function getAllLandProfilesSummary(req, res) {
    let gateway;
    try {
        const connection = await connectToNetwork(contractName);
        gateway = connection.gateway;
        const contract = connection.contract;
        const result = await contract.evaluateTransaction('queryAllLandProfiles');
        const allLands = JSON.parse(result.toString());
        summary = {
            tongSoDat: allLands.length,
            tongGiaTriDat: allLands.reduce((sum, land) => sum + parseFloat(land.Record.giaTriDat), 0),  
            tongDienTich: allLands.reduce((sum, land) => sum + parseFloat(land.Record.dienTich), 0)
        };
        res.status(200).json({ success: true, data: summary });
    } catch (error) {
        console.error(`Lỗi khi thống kê hồ sơ đất đai: ${error}`);
        res.status(500).json({ success: false, message: `Lỗi khi thống kê hồ sơ đất đai: ${error.message}` });
    } finally {
        if (gateway) {
            try {
                gateway.disconnect(); 
            } catch (err) {
                console.error('Lỗi khi ngắt kết nối gateway:', err);
            }
        }
    }
}

module.exports = { 
    initLedger, 
    getAllLandProfiles, 
    getLandProfileById,
    createLandProfile, 
    updateLandProfile, 
    deleteLandProfile, 
    getUserLandProfiles, 
    getLandProfilesByStatus, 
    getLandProfilesByRange, 
    getLandProfilesByType,
    importCSVLandProfiles, 
    exportCSVLandProfiles,
    getLandTypeStatistics,
    getLandStatusStatistics,
    getAllLandProfilesSummary
};