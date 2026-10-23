import {registerHooks} from 'node:module';
import {existsSync,readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import ts from 'typescript';
const sourceRoot=new URL('../src/',import.meta.url);
registerHooks({
 resolve(specifier,context,next){
  if(specifier.startsWith('@/'))return{url:new URL(specifier.slice(2)+'.ts',sourceRoot).href,shortCircuit:true};
  if(specifier.startsWith('.')&&context.parentURL?.startsWith(sourceRoot.href)){
   const u=new URL(specifier+'.ts',context.parentURL);if(existsSync(fileURLToPath(u)))return{url:u.href,shortCircuit:true};
  }
  return next(specifier,context);
 },
 load(url,context,next){
  if(url.startsWith(sourceRoot.href)&&url.endsWith('.ts'))return{format:'module',source:ts.transpileModule(readFileSync(fileURLToPath(url),'utf8'),{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}}).outputText,shortCircuit:true};
  return next(url,context);
 }
});
