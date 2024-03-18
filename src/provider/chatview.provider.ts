import * as vscode from 'vscode';
import path from 'path';

export class ChatViewProvider implements vscode.WebviewViewProvider {
  constructor(private readonly _extensionUri: vscode.Uri) {}

  async resolveWebviewView(
    webviewView: vscode.WebviewView,
    context: vscode.WebviewViewResolveContext,
    _token: vscode.CancellationToken
  ) {
    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [vscode.Uri.joinPath(this._extensionUri, 'out')]
    };

    webviewView.webview.html = getWebviewContent(
      webviewView.webview,
      this._extensionUri.fsPath
    );

    const session = await vscode.authentication.getSession('github',['read:user'], { createIfNone: true });
    if (session) {
      webviewView.webview.postMessage({ username: session.account.label });
    }
  }
}

export function getWebviewContent(
  webview: vscode.Webview,
  extensionPath: string
) {
  const scriptPathOnDisk = vscode.Uri.file(
    path.join(extensionPath, 'out', 'bundle.js')
  );

  const scriptUri = webview.asWebviewUri(scriptPathOnDisk);

  return `<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta http-equiv="Content-Security-Policy" content="default-src 'none'; script-src ${webview.cspSource} 'unsafe-inline'; style-src 'unsafe-inline'; connect-src http://localhost:3000 https://code-whisper-api-949cfdbef458.herokuapp.com; img-src vscode-resource:;">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Chat</title>
  </head>
  <body>
    <div id="root"></div>
    <script src="${scriptUri}"></script>
  </body>
  </html>`;
}
