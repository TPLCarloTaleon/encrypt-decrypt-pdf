## 🤔 Summary of Findings (SPIKE)



## 🏁 Getting Started

```sh
bun install
```

## 📕 Tutorial (Do this from scratch)

1. Create project
    ```sh
    bun create expo encrypt-decrypt-pdf
    cd encrypt-decrypt-pdf
    ```

2. Install deps
  
  ```sh
  bun expo install
    expo-crypto
    expto-filesystem
    react-native-pdf-renderer
    react-native-webview
  ```

3. [Add custom native code](https://docs.expo.dev/workflow/customizing/) (ios)

  ```sh
  # Create an OS-specific folder. https://docs.expo.dev/workflow/prebuild/
  bunex expo prebuild

  # Install the development build in the device. https://docs.expo.dev/guides/local-app-development/#local-app-compilation
  bunx expo run:ios
  ```

<!--  OLD -->
<!-- 2. Install deps
    ```sh
    bun expo install 
        expo-crypto # For encryption/decryption
        expo-filesystem # For files accessing
        react-native-pdf
        react-native-blob-util
    ```

1. React-Native-PDF [does not work in Expo Go](https://github.com/wonday/react-native-pdf?tab=readme-ov-file#supported-versions).

  There's two ways to do this:
  - [Development Build Method](https://ninza7.medium.com/how-to-read-pdf-files-using-react-native-expo-app-fa298aca2536)
  - [Prebuild method](https://github.com/expo/config-plugins/tree/master/packages/react-native-pdf) -Using  **Custom Dev Client** and **Expo Config Plugin**
    ```sh
    bun expo install
        expo-dev-client # For react-native-pdf to work in prebuild
        @config-plugins/react-native-pdf # For react-native-pdf to work in prebuild
        @config-plugins/react-native-blob-util  # For react-native-pdf to work in prebuild
    ```

    ```jsonc
    // app.json
    {
      "expo": {
        // ...
        "plugins": [
          "@config-plugins/react-native-blob-util",
          "@config-plugins/react-native-pdf"
        ]
      }
    }
    ```

    ```sh
    npm install --global eas-cli
    touch eas.json
    ```

    ```jsonc
    // eas.json
    {
      "cli": {
        "version": ">= 0.42.4"
      },
      "build": {
        "development-simulator": {
          "developmentClient": true,
          "distribution": "internal",
          "ios": {
            "simulator": true
          }
        }
      },
      "submit": {
        "production": {}
      }
    }
    ``` -->