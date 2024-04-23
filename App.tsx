import "expo-dev-client";

import { SafeAreaView, Text, useWindowDimensions, View, Button, StatusBar, TextInput } from "react-native";
// import { WebView } from "react-native-webview";
// import Constants from "expo-constants";
// import { StyleSheet } from "react-native";
import * as FileSystem from "expo-file-system";
import PdfRendererView from "react-native-pdf-renderer";
import { useCallback, useEffect, useState } from "react";
import EncryptionUtils from "./EncryptionUtils";

const pdfSource = {
  uri: "https://arquisoft.github.io/slides/course1920/seminars/SemEn-07-ReactNative.pdf",
  // Insecure HTTPs
  // uri: "https://samples.leanpub.com/thereactnativebook-sample.pdf",
  // uri: "https://www.africau.edu/images/default/sample.pdf",
  cache: true,
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

  const downloadWithExpoFileSystem = useCallback(async () => {
    /** The URL where the PDF should be downloaded from. */
    const sourcePDFURL = pdfSource.uri;

    /** The path where the PDF will be stored locally. (Should be deleted in production). */
    const downloadedPath = FileSystem.documentDirectory + "file.pdf";

    /** The path where the encrypted PDF will be stored locally. */
    const encryptedPDFPath = FileSystem.documentDirectory + "file-encrypted.txt";

    /** The path where the decrypted PDF will be stored locally. */
    const decryptedPDFPath = FileSystem.documentDirectory + "file-decrypted.pdf";

    try {
      setDownloading(true);
      /**
       * Download the PDF file with any other library, like  "expo-file-system", "rn-fetch-blob" or "react-native-blob-util"
       */
      const response = await FileSystem.downloadAsync(sourcePDFURL, downloadedPath);

      /** Encrypt it. */
      await EncryptionUtils.encrypt(downloadedPath, encryptedPDFPath, KEY);

      /** Decrypt it. */
      await EncryptionUtils.decrypt(encryptedPDFPath, decryptedPDFPath, KEY);

      /*
       * Then, set the local file URI to state and pass to the PdfRendererView source prop.
       */
      setDownloadedSource(response.uri);
      setDecryptedSource(decryptedPDFPath);
    } catch (err) {
      console.warn(err);
    } finally {
      setDownloading(false);
    }
  }, []);

  useEffect(() => {
    downloadWithExpoFileSystem();
    // downloadWithBlobUtil();
  }, [downloadWithExpoFileSystem]);

  const renderPdfView = () => {
    if (downloading) {
      return <Text>Downloading...</Text>;
    }

    if (!toggle) {
      return <Text>Unmounted</Text>;
    }

    return (
      <>
        <Button title="Single Page" onPress={() => setSinglePage((prev) => !prev)} />
        <View style={{ flexDirection: "row", alignItems: "center", padding: 4 }}>
          <Text>Downloaded Path: </Text>
          <TextInput value={viewedSource} style={{ height: 40, borderWidth: 1, padding: 10, width: 200 }} />
        </View>

        <View style={{ flexDirection: "row", alignItems: "center", padding: 4 }}>
          <Text>Current Page: </Text>
          <TextInput value={currentPage.toString()} style={{ height: 40, borderWidth: 1, padding: 10, width: 200 }} />

          <Button
            title="View Downloaded"
            onPress={() => {
              setViewedSource(downloadedSource);
            }}
          />

          <Button
            title="View Decrypted"
            onPress={() => {
              setViewedSource(decryptedSource);
            }}
          />
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
