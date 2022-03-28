import fs from 'fs';
import path from 'path';
import { modules, Module } from './modules';

function getFiles (dir: string, options: { disallowList: string[], onFile: (p: string) => any }, _files: string[] = []){
  const files = fs.readdirSync(dir);
  for (let i in files) {
    if (options.disallowList.includes(files[i])) continue;
    const name = dir + '/' + files[i];
    if (fs.statSync(name).isDirectory()) {
      getFiles(name, options, _files);
    } else {
      _files.push(name);
      options.onFile(name);
    }
  }
  return _files;
}

interface InterpretFileOptions {
  mode: 'REMOVE' | 'COMMENT_OUT';
}

const MODULE_FILE_COMMAND_STRING = '!MODULE';
const MODULE_INLINE_COMMAND_STRING = ':MODULE';
const MODULE_COMMAND_STRING = 'MODULE';
const MODULE_END_COMMAND_STRING = 'END_MODULE';

const interpretFile = (p: string, fileType: string, activeModules: Module[], options: InterpretFileOptions) => {
  try {
    const file = fs.readFileSync(p, 'utf8');
    const lines = file.split('\n');

    const newFile = lines.reduce<{ lines: string[], delete: boolean, dirty: boolean, activeRemovalFeature: string | null, clearNewLine: boolean, commentMode: 'DEFAULT' | 'JSX' | null }>((meta, line, index) => {
      if (meta.delete) return meta;
      if(index == 0 && line.includes(MODULE_FILE_COMMAND_STRING)) {
        const feature = line.match(`(?<=${MODULE_FILE_COMMAND_STRING}\\s?)[a-z-]+`)?.[0];
        if (feature && !activeModules.some(e => e.value == feature)) {
          return {
            ...meta,
            dirty: true,
            delete: true,
          }
        }
        if (options.mode == 'REMOVE') {
          return { ...meta, dirty: true };
        }
      }

      if (meta.activeRemovalFeature) {
        
        if (!line.includes(`${MODULE_END_COMMAND_STRING} ${meta.activeRemovalFeature}`)) {
          if (options.mode == 'REMOVE') return { ...meta, dirty: true };
          // if (meta.commentMode == 'JSX') {
          //   meta.lines.push(line);
          //   return meta;
          // }
          const emptyLine = line.trim().length == 0;
          meta.lines.push(emptyLine ? line : `// ${line}`);
          return meta;
        }

        // if (meta.commentMode == 'JSX') meta.lines.push('*/}');
        // if (options.mode == 'COMMENT_OUT') meta.lines.push(line);

        return {
          ...meta,
          activeRemovalFeature: null,
          clearNewLine: options.mode != 'COMMENT_OUT',
        }
      }

      if (line.includes(MODULE_INLINE_COMMAND_STRING)) {
        const feature = line.match(`(?<=${MODULE_INLINE_COMMAND_STRING}\\s?)[a-z-]+`)?.[0];
        if (!feature) {
          console.error(`Inline module could not be determined!\nLine: ${line.trim()}`);
        }
        if (feature && !activeModules.some(e => e.value == feature)) {

          return {
            ...meta,
            dirty: true,
          }
        }

        if (options.mode == 'REMOVE') {
          meta.lines.push(line.replace(new RegExp(`(?<=${MODULE_INLINE_COMMAND_STRING}\\s?)[a-z-]+`), ''));
          return { ...meta, dirty: true };
        }
      } else if (line.includes(MODULE_COMMAND_STRING)) {
        const feature = line.match(`(?<=${MODULE_COMMAND_STRING}\\s?)[a-z-]+`)?.[0];
        if (!feature) {
          console.error(`Module could not be determined!\nLine: ${line}`);
        }
        if (feature && !activeModules.some(e => e.value == feature)) {
          // if (options.mode == 'COMMENT_OUT') meta.lines.push(`// # ${line.slice(3)}`);
          // const getCommentMode = () => {
          //   if (options.mode == 'REMOVE') return null;
          //   if (fileType == 'tsx' && line.trim().startsWith('{/*')) return 'JSX';
          //   return 'DEFAULT';
          // }

          // const commentMode = getCommentMode();

          // if (commentMode == 'JSX') meta.lines.push('{/*');

          return {
            ...meta,
            dirty: true,
            activeRemovalFeature: feature,
            // commentMode: 'DEFAULT',
          }
        }

        if (options.mode == 'REMOVE') return { ...meta, dirty: true };
      } else if (line.includes(MODULE_END_COMMAND_STRING)) {
        if (options.mode == 'REMOVE') return { ...meta, dirty: true };
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
    }, { lines: [], delete: false, dirty: false, activeRemovalFeature: null, clearNewLine: false, commentMode: null });

    const originalLineCount = lines.length;

    if (newFile.dirty) {
      console.log(newFile);
      console.log(file.split('\n'));
    }

    return {
      originalLineCount: lines.length,
      ...newFile,
    }

  } catch (err) {
    console.error(err);
    return null;
  }
}

export const interpret = (modules: Module[], options: InterpretFileOptions) => {

  const disallowList = ['node_modules', 'lib', 'dist', '.next', 'generated', 'tsconfig.tsbuildinfo', 'cli'];
  const onFile = (p: string) => {
    const ext = p.split('.').slice(-1)[0];
    switch(ext) {
      case 'tsx':
      case 'ts':
      case 'prisma':
        interpretFile(p, ext, modules, options);
      break;
    }
  }

  console.log(__dirname);

  getFiles(path.join(process.cwd(), 'packages'), {
    disallowList,
    onFile,
  });

  getFiles(path.join(process.cwd(), 'apps'), {
    disallowList,
    onFile,
  });


}