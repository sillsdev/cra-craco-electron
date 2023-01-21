# Getting Started with Create React App & Electron

This project builds a front end web app and an [electron app](https://www.electronjs.org/) for desktop use on Windows, Linux, and MacOs. It was bootstrapped with [Create React App](https://github.com/facebook/create-react-app). Create React App Configuration Override ([craco](https://craco.js.org/)) is used to enable the electron desktop app to access the local computer so the program can run without access to the Internet in remote locations.

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

### `npm run dev`

Runs the app in the development mode.\
Launches electron to view the app. Breakpoints can be set in the embedded browser on the Source tab.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm run pack` followed by `npm run dist`

Builds the app for production to the `dist` folder with the installer in the `dist` folder and an executable app in the `dist\win-unpacked` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

## `vsCode` development

The development environment allows setting break points in vs code and then using `F5` to start the debugger. Clicking the debug icon on the left, the developer can use a drop down menu to choose `Start & Debug` to debug the web app and `Electron: All` to debug the electron (desktop) app. `Start & Debug` is similar to the `npm start` command and `Electron: All` is similar to the `npm run dev` command. When you click `F5`, you will see a dialog about the `Background NPM` task. Once you see the message about he code being emitted (the blue or yellow message), click `Debug anyway` to continue.

## Coding hints

``` javascript
    const ipc = (window as any).electron
```

This is used in the render task to facilitate interprocess communication. It is possible to tell if the program is running on the web or as a desktop using this logic:

``` javascript
    if (ipc) {
        console.log(`desktop (electron)`)
    } else {
        console.log(`web`)
    }
```

The `public/preload.js` file defines the currently available interprocess functions. To add a function, normally it is added in this file and in the `public/ipcMethods.js`. Since the code in the `src` folder is minified and obfiscated, normally code is placed there. If a method would like to test if a local file exists:

```javascript
    if (await ipc?.exists('c:/myFolder/myFile.txt')) {
        console.log(`myFile exists`)
    }
```

>NOTE: all ipc methods are async.

This code will be a noop if running on the web. Information about various ways to interact with the local computer including creating native file open dialogs is available in the electron documentation.

## Settings files

You should create the files `.env.local` and `.env.development.local`. These files are described in the React documentation. This sample code uses a variable to define the application `title` that appears as the tab name. It is included in both the `.env.local`:

```ini
REACT_APP_SITE_TITLE=CRA Craco Electron
```

and also in the `.env.development.local`:

```ini
BROWSER=none
REACT_APP_SITE_TITLE=CRA Craco Electron
```

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
