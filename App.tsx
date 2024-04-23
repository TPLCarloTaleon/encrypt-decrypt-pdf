import "expo-dev-client";

import { SafeAreaView, Text, View, Button, StatusBar, TextInput, TouchableOpacity } from "react-native";
import PdfRendererView from "react-native-pdf-renderer";
import { useCallback, useEffect, useState } from "react";
import EncryptedFileSystem from "./EncryptedFileSystem";

/** Idealy this is actually data that's coming from the notes-service. */
const notesFileData = {
  /** This is the S3 URL or a temporary signed URL for the asset. */
  downloadURL: "https://arquisoft.github.io/slides/course1920/seminars/SemEn-07-ReactNative.pdf",
  /**
   * The file will be saved in this format:
   * - Downloaded (then deleted): `{fileId}-raw.{fileExtension}`
   * - Encrypted (will last for a long time): `{fileId}.{fileExtension}`
   * - Decrypted (will be cached temporarily for viewing): `{fileId}-decrypted.{fileExtension}`
   */
  fileId: "P3GAP-TaxonomyChapter1",
};

/** Temporary, this will be a secure key. */
const KEY = "Yzg1MDhmNDYzZjRlMWExOGJkNTk5MmVmNzFkOGQyNzk=";

export default function App() {
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [downloading, setDownloading] = useState(false);
  const [singlePage, setSinglePage] = useState(false);
  const [toggle, setToggle] = useState(true);

  const [viewedSource, setViewedSource] = useState<string>("");
  const [downloadedSource, setDownloadedSource] = useState<string>("");
  const [decryptedSource, setDecryptedSource] = useState<string>("");

  const downloadAndDisplay = useCallback(async () => {
    try {
      setDownloading(true);

      // ----------- 1. Download and Encrypt. -----------

      const encryptedFileInfo = await EncryptedFileSystem.checkExistsByFileId(notesFileData.fileId);

      if (!encryptedFileInfo.exists) {
        const { encryptedPath, rawPath } = await EncryptedFileSystem.download(
          notesFileData.downloadURL,
          notesFileData.fileId,
          { _debugDontDelete: true }
        );
        setDownloadedSource(rawPath);
      } else {
        // Already exists
        setDownloadedSource(encryptedFileInfo.path);
      }

      // ----------- 2. Decrypt and Show. -----------

      const decryptedPath = await EncryptedFileSystem.getDecryptedFileById(notesFileData.fileId);

      setDecryptedSource(decryptedPath);
    } catch (err) {
      console.warn(err);
    } finally {
      setDownloading(false);
    }
  }, []);

  useEffect(() => {
    downloadAndDisplay();
  }, [downloadAndDisplay]);

  const renderPdfView = () => {
    if (downloading) {
      return <Text>Downloading...</Text>;
    }

    if (!toggle) {
      return <Text>Unmounted</Text>;
    }

    return (
      <>
        <Button title={singlePage ? "Single Page" : "Multi-Page"} onPress={() => setSinglePage((prev) => !prev)} />

        <View style={{ flexDirection: "row", alignItems: "center", paddingHorizontal: 12, gap: 16 }}>
          <Text>Downloaded Path: </Text>
          <TextInput value={downloadedSource} style={{ height: 40, flex: 1, borderWidth: 1, padding: 10 }} />
          <TouchableOpacity
            style={{
              width: 150,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "pink",
              paddingVertical: 10,
            }}
            onPress={() => {
              setViewedSource(downloadedSource);
            }}
          >
            <Text>View Downloaded</Text>
          </TouchableOpacity>
        </View>

        <View style={{ flexDirection: "row", alignItems: "center", paddingHorizontal: 12, gap: 16 }}>
          <Text>Decrypted Path: </Text>
          <TextInput value={decryptedSource} style={{ height: 40, flex: 1, borderWidth: 1, padding: 10 }} />
          <TouchableOpacity
            style={{
              width: 150,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "pink",
              paddingVertical: 10,
            }}
            onPress={() => {
              setViewedSource(decryptedSource);
            }}
          >
            <Text>View Decrypted</Text>
          </TouchableOpacity>
        </View>

        <View style={{ flexDirection: "row", alignItems: "center", padding: 4 }}>
          <Text>Current Page: </Text>
          <TextInput value={currentPage.toString()} style={{ height: 40, borderWidth: 1, padding: 10, width: 200 }} />
        </View>

        <PdfRendererView
          style={{ backgroundColor: "gray" }}
          source={viewedSource}
          distanceBetweenPages={16}
          maxZoom={2}
          singlePage={singlePage}
          onPageChange={(current, total) => {
            console.log("onPageChange", { current, total });
            setCurrentPage(current);
            setTotalPages(total);
          }}
        />
        <View
          style={{
            position: "absolute",
            bottom: 16,
            left: 0,
            right: 0,
            alignItems: "center",
          }}
        >
          <Text
            style={{
              backgroundColor: "rgba(255,255,255,0.5)",
              color: "black",
              padding: 4,
              borderRadius: 4,
            }}
          >
            {currentPage + 1}/{totalPages}
          </Text>
        </View>
      </>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar translucent={false} />

      <Button title="Mount/Unmount" onPress={() => setToggle((prev) => !prev)} />

      {renderPdfView()}
    </SafeAreaView>
  );
}
//   //   return (
//   //     <SafeAreaView style={{ flex: 1 }}>
//   //       <Text>Carlo</Text>
//   //       <PdfRendererView
//   //         style={{ backgroundColor: "green" }}
//   //         // source={require("./thereactnativebook-sample.pdf")}
//   //         source="file:///thereactnativebook-sample.pdf"
//   //         distanceBetweenPages={16}
//   //         maxZoom={5}
//   //         onPageChange={(current, total) => {
//   //           console.log(current, total);
//   //         }}
//   //       />
//   //       {/* <WebView
//   //         style={{ height: 500, width: 600 }}
//   //         nestedScrollEnabled={true}
//   //         source={{
//   //           uri: "https://drive.google.com/viewerng/viewer?embedded=true&url=https://samples.leanpub.com/thereactnativebook-sample.pdf",
//   //         }}
//   //       /> */}
//   //       {/* <WebView
//   //         style={styles.container}
//   //         originWhitelist={["*"]}
//   //         source={{
//   //           html: `
//   //             <h1>
//   //             Test
//   //               <center>
//   //                 <iframe src="https://samples.leanpub.com/thereactnativebook-sample.pdf"
//   //             title="iframe Example 1" width="400" height="300">
//   // </iframe>
//   //             </h1>`,
//   //         }}
//   //       /> */}
//   //     </SafeAreaView>
//   //   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     marginTop: Constants.statusBarHeight,
//   },
// });
