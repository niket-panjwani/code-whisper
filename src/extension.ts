import * as vscode from 'vscode';
import { ChatViewProvider } from './provider/chatview.provider';

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(
      'codeWhisperChat.chat',
      new ChatViewProvider(context.extensionUri),
      {
        webviewOptions: {
          retainContextWhenHidden: true
        }
      }
    )
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('code-whisper.showCodeWhisperChat', () => {
      vscode.commands.executeCommand('workbench.view.extension.codeWhisperChat');
    })
  );
}

export function deactivate() {}
