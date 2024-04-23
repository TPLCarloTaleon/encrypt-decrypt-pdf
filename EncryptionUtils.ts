import * as FileSystem from "expo-file-system";
import CryptoES from "crypto-es";

export async function encrypt(filePath: string, outputPath: string, password: string): Promise<void> {
  const startTime = Date.now();
  try {
    const fileContentBase64 = await FileSystem.readAsStringAsync(filePath, {
      encoding: FileSystem.EncodingType.Base64,
    });

    const encrypted = CryptoES.AES.encrypt(fileContentBase64, password);

    // console.log(encrypted, "\n---- ✅ encrypted ----\n\n");
    await FileSystem.writeAsStringAsync(outputPath, encrypted.toString(), { encoding: FileSystem.EncodingType.Base64 });
  } catch (error) {
    console.error("Encryption failed:", error);
  } finally {
    const endTime = Date.now();
    const timePassed = endTime - startTime;
    console.log(`Time passed in encrypt function: ${timePassed} milliseconds`);
  }
}

export async function decrypt(encryptedPath: string, outputPath: string, password: string): Promise<void> {
  const startTime = Date.now();
  try {
    const fileContentB64 = await FileSystem.readAsStringAsync(encryptedPath, {
      encoding: FileSystem.EncodingType.Base64,
    });

    const decryptedBytes = CryptoES.AES.decrypt(fileContentB64, password).toString(CryptoES.enc.Utf8);

    // console.log(decryptedBytes, "\n ----- 😭 decryptedBytes ------ \n\n");

    await FileSystem.writeAsStringAsync(outputPath, decryptedBytes, { encoding: FileSystem.EncodingType.Base64 });
  } catch (error) {
    console.error("Decryption failed:", error);
  } finally {
    const endTime = Date.now();
    const timePassed = endTime - startTime;
    console.log(`Time passed in decrypt function: ${timePassed} milliseconds`);
  }
}

export default { encrypt, decrypt };
