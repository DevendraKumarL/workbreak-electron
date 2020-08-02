const { app, BrowserWindow } = require("electron")
const path = require("path")
const url = require("url")

let win = null;

function createAppWindow() {
	win = new BrowserWindow({ width: 1296, height: 800 })

	win.loadURL(url.format({
		pathname: path.join(__dirname, "index.html"),
		protocol: "file:",
		slashes: true
	}))

	win.on("closed", () => {
		win = null
		app.quit()
	})

	win.show()
}

app.on("ready", createAppWindow)

app.on("window-all-closed", () => {
	if (process.platform !== "darwin") {
		app.quit()
	}
})

app.on("activate", () => {
	if (win === null) {
		createAppWindow()
	}
})
