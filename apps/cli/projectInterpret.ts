import fs from 'fs';
import path from 'path';
import modules, { Module } from './modules';

function getFiles (dir: string, options: { disallowList: string[], onFile: (p: string) => any }, files_?: string[]){
  files_ = files_ || [];
  const files = fs.readdirSync(dir);
  for (let i in files) {
    if (options.disallowList.includes(files[i])) continue;
    const name = dir + '/' + files[i];
    if (fs.statSync(name).isDirectory()) {
      getFiles(name, options, files_);
    } else {
      files_.push(name);
      options.onFile(name);
    }
  }
  return files_;
}

interface InterpretFileOptions {
  mode: 'REMOVE' | 'COMMENT_OUT';
}

const MODULE_COMMAND_STRING = 'MODULE ';
const MODULE_END_COMMAND_STRING = 'END_MODULE ';

const interpretFile = (p: string, fileType: string, features: Module[], options: InterpretFileOptions) => {
  try {
    const file = fs.readFileSync(p, 'utf8')
    const lines = file.split('\n');

    const newFile = lines.reduce<{ lines: string[], dirty: boolean, activeRemovalFeature: string | null, clearNewLine: boolean, commentMode: 'DEFAULT' | 'JSX' | null }>((meta, line) => {

      if (meta.activeRemovalFeature) {
        
        if (!line.includes(`${MODULE_END_COMMAND_STRING}${meta.activeRemovalFeature}`)) {
          if (options.mode == 'REMOVE') return meta;
          if (meta.commentMode == 'JSX') {
            meta.lines.push(line);
            return meta;
          }
          const emptyLine = line.trim().length == 0;
          meta.lines.push(emptyLine ? line : `// ${line}`);
          return meta;
        }

        if (meta.commentMode == 'JSX') meta.lines.push('*/}');
        if (options.mode == 'COMMENT_OUT') meta.lines.push(line);

        return {
          ...meta,
          activeRemovalFeature: null,
          clearNewLine: options.mode != 'COMMENT_OUT',
        }
      }

      if (line.includes(MODULE_COMMAND_STRING)) {
        const feature = line.match(`/(?<=${MODULE_COMMAND_STRING})[a-z-]+/g`)?.[0];
        if (!feature) {
          console.error(`Feature could not be extracted!\nLine: ${line}`);
        }
        if (feature && !features.some(e => e.value == feature)) {
          if (options.mode == 'COMMENT_OUT') meta.lines.push(`// # ${line.slice(3)}`);
          const getCommentMode = () => {
            if (options.mode == 'REMOVE') return null;
            if (fileType == 'tsx' && line.trim().startsWith('{/*')) return 'JSX';
            return 'DEFAULT';
          }

          const commentMode = getCommentMode();

          if (commentMode == 'JSX') meta.lines.push('{/*');

          return {
            ...meta,
            dirty: true,
            activeRemovalFeature: feature,
            commentMode: getCommentMode(),
          }
        }

        if (options.mode == 'REMOVE') return meta;
      }

      if (meta.clearNewLine && line.trim().length == 0) {
        return {
          ...meta,
          clearNewLine: false,
        }
      }

      if (options.mode == 'REMOVE' && line.startsWith(MODULE_END_COMMAND_STRING)) return meta;

      meta.lines.push(line);
      return meta;
    }, { lines: [], dirty: false, activeRemovalFeature: null, clearNewLine: false, commentMode: null })

    console.log(newFile);
    console.log(file.split('\n'));


  } catch (err) {
    console.error(err);
  }
}

export const interpret = (features: Module[], options: InterpretFileOptions) => {

  getFiles(path.join(process.cwd(), 'packages'), {
    disallowList: ['node_modules', 'lib', '.next'],
    onFile(p) {
      const ext = p.split('.').slice(-1)[0];
      switch(ext) {
        case 'tsx':
        case 'ts':
        case 'prisma':
          interpretFile(p, ext, features, options);
        break;
      }
    }
  })


}

interpret(modules.slice(0, 1), { mode: 'REMOVE' });