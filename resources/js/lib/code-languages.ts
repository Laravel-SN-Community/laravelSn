import type { LanguageFn } from 'highlight.js';
import bash from 'highlight.js/lib/languages/bash';
import css from 'highlight.js/lib/languages/css';
import javascript from 'highlight.js/lib/languages/javascript';
import json from 'highlight.js/lib/languages/json';
import php from 'highlight.js/lib/languages/php';
import phpTemplate from 'highlight.js/lib/languages/php-template';
import plaintext from 'highlight.js/lib/languages/plaintext';
import sql from 'highlight.js/lib/languages/sql';
import typescript from 'highlight.js/lib/languages/typescript';
import xml from 'highlight.js/lib/languages/xml';
import yaml from 'highlight.js/lib/languages/yaml';

export const codeLanguages: Record<string, LanguageFn> = {
    php,
    'php-template': phpTemplate,
    javascript,
    typescript,
    bash,
    json,
    sql,
    xml,
    css,
    yaml,
    plaintext,
};

export const codeLanguageAliases: Record<string, string> = {
    js: 'javascript',
    ts: 'typescript',
    tsx: 'typescript',
    jsx: 'javascript',
    html: 'xml',
    blade: 'php-template',
    sh: 'bash',
    shell: 'bash',
    zsh: 'bash',
    yml: 'yaml',
    text: 'plaintext',
    txt: 'plaintext',
};

export const codeLanguageLabels: Record<string, string> = {
    php: 'PHP',
    'php-template': 'Blade',
    javascript: 'JavaScript',
    typescript: 'TypeScript',
    bash: 'Bash',
    json: 'JSON',
    sql: 'SQL',
    xml: 'HTML',
    css: 'CSS',
    yaml: 'YAML',
    plaintext: 'Texte',
};
