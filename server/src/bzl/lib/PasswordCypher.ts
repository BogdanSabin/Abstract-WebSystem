import * as crypto from 'crypto';

export class PasswordCypher {
    private readonly cryptAlgo: string;
    private readonly key: string;
    private readonly iv: string;

    constructor(cryptAlgo: string, key: string, iv: string) {
        this.cryptAlgo = cryptAlgo;
        this.key = key;
        this.iv = iv;
    }

    encrypt(plainTtext: string): string {
        const cipher = crypto.createCipheriv(this.cryptAlgo, Buffer.from(this.key), this.iv);
        let encrypted = cipher.update(plainTtext);
        encrypted = Buffer.concat([encrypted, cipher.final()]);
        return encrypted.toString('hex');
    }

    decrypt(cipherText: string): string {
        const encryptedText = Buffer.from(cipherText, 'hex');
        const decipher = crypto.createDecipheriv(this.cryptAlgo, Buffer.from(this.key), this.iv);
        let decrypted = decipher.update(encryptedText);
        decrypted = Buffer.concat([decrypted, decipher.final()]);
        return decrypted.toString();
    }
}