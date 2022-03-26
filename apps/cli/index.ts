import arg from 'arg';
import inquirer from 'inquirer';

function parseArgumentsIntoOptions(rawArgs: any) {
  const args = arg(
    {
      '--template': String,
      '--features': String,
      '-t': '--template',
      '-f': '--features',
    },
    {
      argv: rawArgs.slice(2),
    }
  );
  return {
    template: args._[0],
    features: args['--features']?.split(','),
  };
 }

async function promptForMissingOptions(options: any) {
 if (options.skipPrompts) {
   return {
     ...options,
     template: options.template,
   };
 }

 const getTemplate = () => {
   if (options.template) return options.template;
   const choices = [
    { name: 'SaaS', value: 'saas' },
    { name: 'Web3', value: 'web3' },
   ];
  return inquirer.prompt({
    type: 'list',
    name: 'template',
    message: 'Please choose which project template to use',
    choices,
  });
 }

  const getFeatures = (defaultChecked: string[] = []) => {
    if (options.features) return options.features;
    const choices = [
      { name: 'OAuth', value: 'oauth' },
      { name: 'Stripe', value: 'stripe' },
      { name: 'Queue system', value: 'queue-system' },
      { name: 'Web3', value: 'web3' },
    ].map(e => {
      if (!defaultChecked.includes(e.value)) return e;
      return {
        ...e,
        checked: true,
      }
    });

    return inquirer.prompt({
      type: 'checkbox',
      name: 'features',
      message: 'Please choose which project features to use',
      choices,
    });
  }

 const template = await getTemplate();
 const features = await getFeatures();

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
   template,
   features,
 };
}

export async function cli(args: any) {
 let options = parseArgumentsIntoOptions(args);
 options = await promptForMissingOptions(options);
 console.log(options);
}

cli(process.argv);

// Fix broken comments (Pull changes to commented feature)
// re-enable feature