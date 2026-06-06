// @lexical/code expects Prism on the global scope; Vite's ESM bundling doesn't preserve the IIFE assignment.
// This module must be imported before @mdxeditor/editor so the global is set before @lexical/code reads it.
import Prism from 'prismjs';

(globalThis as unknown as { Prism: typeof Prism }).Prism = Prism;
