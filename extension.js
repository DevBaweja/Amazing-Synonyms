// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const fetch = require('node-fetch');

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
/**
 * @param {vscode.ExtensionContext} context
 */
const activate = context => {
    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "amazing-synonyms" is now active!');

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    let disposable = vscode.commands.registerCommand('amazing-synonyms.amaze-me', async () => {
        // The code you place here will be executed every time your command is executed

        // Display a message box to the user
        vscode.window.showInformationMessage('Be ready to be amazed!');
        // Getting Editor
        const editor = vscode.window.activeTextEditor;
        if (!editor) return;
        // Getting Selected Text
        const text = editor.document.getText(editor.selection);
        if (!text) {
            vscode.window.showInformationMessage('Please select text.');
            return;
        }
        // Getting Data
        const response = await fetch(`https://api.datamuse.com/words?ml=${text.replace(' ', '+')}`);
        const data = await response.json();
        const items = data.map(({ word }) => ({
            label: word,
        }));
        if (!items) return;
        // Creating Quick Pick
        const quickPick = vscode.window.createQuickPick();
        quickPick.items = items;
        quickPick.onDidChangeSelection(([item]) => {
            if (item) {
                editor.edit(edit => {
                    edit.replace(editor.selection, item.label);
                });
                vscode.window.showInformationMessage(`${text} has been changed to ${item.label}`);
                quickPick.dispose();
            }
        });
        quickPick.onDidHide(() => quickPick.dispose());
        quickPick.show();
    });

    context.subscriptions.push(disposable);
};

// this method is called when your extension is deactivated
const deactivate = () => {};

module.exports = {
    activate,
    deactivate,
};
