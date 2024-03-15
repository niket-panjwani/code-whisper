import * as vscode from 'vscode';
import { getWebviewContent } from './webViewContent';

export function activate(context: vscode.ExtensionContext) {
  console.log('Congratulations, your extension "code-whisper" is now active!');
  let disposable = vscode.commands.registerCommand(
    'code-whisper.showCodeWhisperChat',
    () => {
      const panel = vscode.window.createWebviewPanel(
        'chatView', 
        'Chat', 
        vscode.ViewColumn.One, 
        {
          enableScripts: true
        }
      );

      panel.webview.html = getWebviewContent();
    }
  );

  context.subscriptions.push(disposable);
}

export function deactivate() {}
