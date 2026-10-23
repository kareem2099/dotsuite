import assert from 'node:assert/strict';
import fs from 'node:fs';
import ts from 'typescript';
const source=fs.readFileSync(new URL('../src/lib/extension-callback.ts',import.meta.url),'utf8');
const output=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}}).outputText;
const {extensionCallback}=await import('data:text/javascript;base64,'+Buffer.from(output).toString('base64'));
for(const scheme of ['vscode','vscode-insiders','vscodium','cursor'])assert.equal(extensionCallback(`${scheme}://freerave.dotshare/auth`).hostname,'freerave.dotshare');
for(const value of ['https://attacker.example/auth','https://freerave.dotshare/auth','vscode://other.extension/auth','vscode://freerave.dotshare/other','vscode://user:password@freerave.dotshare/auth','vscode://freerave.dotshare:9000/auth','vscode://freerave.dotshare/auth#fragment'])assert.throws(()=>extensionCallback(value));
console.log('Extension callback allowlist: passed (4 accepted, 7 rejected).');
