import * as vscode from 'vscode';
import { ChatViewProvider } from './provider/chatview.provider';
import { authentication } from 'vscode';

export async function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.commands.registerCommand('extension.login', async () => {
      await authentication.getSession('github', ['read:user'], { createIfNone: true });
    })
  );

  checkSessionAndRegisterView(context);

  vscode.authentication.onDidChangeSessions(async e => {
    if (e.provider.id === 'github') {
      checkSessionAndRegisterView(context);
    }
  });
}

function registerChatView(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(
      'codeWhisperChat.chat',
      new ChatViewProvider(context.extensionUri, context),
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

async function checkSessionAndRegisterView(context: vscode.ExtensionContext) {
  const sessions = await vscode.authentication.getSession('github', ['read:user'], { createIfNone: true });
  if (sessions && sessions.id) {
    registerChatView(context);
  } else {
    vscode.commands.executeCommand('extension.login');
  }
}

export function deactivate() {}
