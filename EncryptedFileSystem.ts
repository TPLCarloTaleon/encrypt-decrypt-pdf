import * as FileSystem from "expo-file-system";
import EncryptionUtils from "./EncryptionUtils";

// ===========================================================================
// Constants
// ===========================================================================

/** Temporary, this will be a secure key. */
const KEY = "Yzg1MDhmNDYzZjRlMWExOGJkNTk5MmVmNzFkOGQyNzk=";

const DOCUMENT_DIRECTORY = FileSystem.documentDirectory;

// ===========================================================================
// Functions
// ===========================================================================

/**
 * Downloads a file, encrypts it, and deletes the original.
 * This always assumes that the end of the url is the file extension.
 * @param sourceURL is the HTTP URL to download from.
 * @param outputPath is the path to save the file to.
 */
export async function download(
  sourceURL: string,
  fileId: string,
  options?: {
    /** For debugging purposes: True to prevent deleting. @defaultValue false. */
    _debugDontDelete: boolean;
  }
) {
  const parsedOptions: typeof options = {
    _debugDontDelete: false,
    ...options,
  };

  const fileExtension = sourceURL.substring(sourceURL.lastIndexOf("."));

  const rawPath = `${DOCUMENT_DIRECTORY}${fileId}-raw${fileExtension}`;

  const encryptedPath = `${DOCUMENT_DIRECTORY}${fileId}${fileExtension}`;

  // 1. Download the raw file.
  const response = await FileSystem.downloadAsync(sourceURL, rawPath);

  // 2. Encrypt it.
  await EncryptionUtils.encrypt(rawPath, encryptedPath, KEY);
  /** @todo Handle encryption errors. */

  // 3. Delete the raw file.
  if (!parsedOptions._debugDontDelete) await FileSystem.deleteAsync(rawPath);

  return {
    /** The downloaded path. Will not exist if debugDontDelete is on. */
    rawPath: response?.uri,
    /** The encrypted path. */
    encryptedPath: encryptedPath,
  };
}

/**
 * Checks if the file exists using the file ID.
 * @todo replace .pdf here.
 */
export async function checkExistsByFileId(fileId: string) {
  // ----------- 1. Check if encrypted file exists. -----------
  const encryptedFileInfo = await FileSystem.getInfoAsync(`${DOCUMENT_DIRECTORY}/${fileId}.pdf`);

  // Encrypted File does not exist.
  if (!encryptedFileInfo.exists) {
    // Throw an error. Usually, you can ask to try and download it again.
    throw Error("Please download the file first.");
  }

  return {
    path: encryptedFileInfo.uri,
    exists: encryptedFileInfo.exists,
  };
}
/**
 * Gets a decrypted version of a file based on the ID.
 *
 * The decrypted version gets cached for a short period of time only.
 * @todo replace .pdf here.
 */
export async function getDecryptedFileById(fileId: string) {
  // ----------- 1. Check if encrypted file exists. -----------
  const encryptedFileInfo = await FileSystem.getInfoAsync(`${DOCUMENT_DIRECTORY}/${fileId}.pdf`);

  // Encrypted File does not exist.
  if (!encryptedFileInfo.exists) {
    // Throw an error. Usually, you can ask to try and download it again.
    throw Error("Please download the file first.");
  }

  // ----------- 2. Check if decrypted file exists. -----------
  let decryptedFileInfo = await FileSystem.getInfoAsync(`${DOCUMENT_DIRECTORY}/${fileId}-decrypted.pdf`);

  // Decrypted File does not exist. (Not decrypted recently).
  if (!decryptedFileInfo.exists) {
    const fileExtension = encryptedFileInfo.uri.substring(encryptedFileInfo.uri.lastIndexOf("."));
    const outputPath = `${DOCUMENT_DIRECTORY}${fileId}-decrypted${fileExtension}`;

    await EncryptionUtils.decrypt(encryptedFileInfo.uri, outputPath, KEY);
    /** @todo Handle decryption errors. */
  }

  // ----------- 3. Return successfully. -----------

  // At this point, it should exist.
  // Return the path to the decrypted file.
  return decryptedFileInfo.uri;
}

/**
 * Removes all decrypted files.
 * This is useful to do if the user leaves the app, or loses focus of the app.
 * So that they can't replicate the data.
 *
 * @todo not implemented.
 */
export function clean() {}

export default { download, checkExistsByFileId, getDecryptedFileById, clean };
