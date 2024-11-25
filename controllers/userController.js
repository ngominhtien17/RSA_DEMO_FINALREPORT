import crypto from 'crypto';
import User from '../models/User.js';


export const generateKeys = async (req, res) => {
    try {
        const { name, email } = req.body;

        const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
            modulusLength: 2048,
        });

        const user = new User({ name, email, publicKey, privateKey });
        await user.save();

        res.status(201).json({ message: 'Keys generated successfully', user });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const updateKeys = async (req, res) => {
    const { p, q } = req.body;
    if (!p || !q) {
        return res.status(400).json({ success: false, message: 'Thiếu P hoặc Q' });
    }
     try {
        // Tạo cặp khóa mới từ P và Q
        const { publicKey, privateKey } = generateKeyPairFromPQ(p, q);
         // Cập nhật khóa công khai và khóa riêng tư trong cơ sở dữ liệu
        await User.updateOne({ _id: req.user.id }, { publicKey, privateKey });
         res.json({ success: true, publicKey });
    } catch (error) {
        console.error('Lỗi khi cập nhật khóa:', error);
        res.status(500).json({ success: false, message: 'Lỗi máy chủ' });
    }
}

// Hàm tạo cặp khóa từ P và Q
function generateKeyPairFromPQ(p, q) {
    const primeP = BigInt(p);
    const primeQ = BigInt(q);
    const n = primeP * primeQ;
    const phi = (primeP - 1n) * (primeQ - 1n);
    const e = 65537n;

    if (gcd(e, phi) !== 1n) {
        throw new Error('e và phi(n) không phải là số nguyên tố cùng nhau');
    }

    // Tính d, khóa riêng tư
    const d = modInverse(e, phi);

    // Trả về cặp khóa
    return {
        publicKey: `PublicKey(n=${n}, e=${e})`,
        privateKey: `PrivateKey(n=${n}, d=${d})`
    };
}

// Hàm tính ước chung lớn nhất (GCD)
function gcd(a, b) {
    while (b !== 0n) {
        const temp = b;
        b = a % b;
        a = temp;
    }
    return a;
}

// Hàm tính nghịch đảo modulo
function modInverse(a, m) {
    let m0 = m, t, q;
    let x0 = 0n, x1 = 1n;

    if (m === 1n) return 0n;

    while (a > 1n) {
        q = a / m;
        t = m;
        m = a % m;
        a = t;
        t = x0;
        x0 = x1 - q * x0;
        x1 = t;
    }

    if (x1 < 0n) x1 += m0;

    return x1;
}
