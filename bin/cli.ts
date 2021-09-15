import arg from 'arg';
import inquirer from 'inquirer';

function parseArgumentsIntoOptions(rawArgs: any) {
  const args = arg(
    {
      '--git': Boolean,
      '--yes': Boolean,
      '--install': Boolean,
      '-g': '--git',
      '-y': '--yes',
      '-i': '--install',
    },
    {
      argv: rawArgs.slice(2),
    }
  );
  return {
    skipPrompts: args['--yes'] || false,
    git: args['--git'] || false,
    template: args._[0],
    runInstall: args['--install'] || false,
  };
 }

async function promptForMissingOptions(options: any) {
 if (options.skipPrompts) {
   return {
     ...options,
     template: options.template,
   };
 }

 const questions = [];
 if (!options.template) {
   const choices = [
     { name: 'SaaS', value: 'saas' },
     { name: 'Web3', value: 'web3' },
    ];
   questions.push({
     type: 'list',
     name: 'template',
     message: 'Please choose which project template to use',
     choices,
   });
 }

 if (!options.features) {
   const choices = [
     { name: 'OAuth', value: 'oauth', checked: true },
     { name: 'Stripe', value: 'stripe', checked: true },
     { name: 'Queue system', value: 'queue-system', checked: true },
     { name: 'Web3', value: 'web3' },
    ];
   questions.push({
     type: 'checkbox',
     name: 'features',
     message: 'Please choose which project features to use',
     choices,
   });
 }

 if (!options.git) {
   questions.push({
     type: 'confirm',
     name: 'git',
     message: 'Initialize a git repository?',
     default: false,
   });
 }

 const answers = await inquirer.prompt(questions);
 return {
   ...options,
   template: options.template || answers.template,
   git: options.git || answers.git,
 };
}

export async function cli(args: any) {
 let options = parseArgumentsIntoOptions(args);
 options = await promptForMissingOptions(options);
 console.log(options);
}

cli(process.argv);