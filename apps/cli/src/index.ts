import arg from 'arg';
import inquirer from 'inquirer';
import { modules } from './modules';
import { interpret } from './interpreter';


function parseArgumentsIntoOptions(rawArgs: any) {
  const args = arg(
    {
      '--modules': String,
      '-m': '--modules',
    },
    {
      argv: rawArgs.slice(2),
    }
  );
  return {
    modules: args['--modules']?.split(','),
  };
 }

async function promptForMissingOptions(options: any) {
  if (options.skipPrompts) {
    return options;
  }

  const getModules = (defaultChecked: string[] = []) => {
    if (options.modules) return options.modules;
    const choices = modules.map(e => {
      if (!defaultChecked.includes(e.value)) return e;
      return {
        ...e,
        checked: true,
      }
    });

    return inquirer.prompt({
      type: 'checkbox',
      name: 'modules',
      message: 'Please choose which project modules to use',
      choices,
    });
  }

  const modulesResult = await getModules(['oauth', 'stripe', 'worker', 'web3', 'project']);

  //  if (!options.git) {
  //    questions.push({
  //      type: 'confirm',
  //      name: 'git',
  //      message: 'Initialize a git repository?',
  //      default: false,
  //    });
  //  }

  return {
    ...options,
    ...modulesResult,
  };
}

export async function cli(args: any) {
  let options = parseArgumentsIntoOptions(args);
  options = await promptForMissingOptions(options);

  if (!options.modules) return;

  const { confirm } = await inquirer.prompt({
    type: 'confirm',
    name: 'confirm',
    message: options.modules.length == modules.length
      ? `Are you sure you want to remove all module separation? You will not be able to automatically remove modules after this operation!`
      : `Are you sure you want to remove ${modules.length - options.modules.length} modules? You will not be able to reinstall the module automatically after this operation!`,
  });

  if (!confirm) return;
  
  interpret(modules.filter(e => options.modules!.includes(e.value)), { mode: 'REMOVE' });


  console.log(`All set!\n\nHappy coding!`);
}

cli(process.argv);