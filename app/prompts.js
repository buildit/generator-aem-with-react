let options = require('./options')

function validateFilename( input ) {
  if( input ) {
     // TODO This regex probably needs to be checked
    let rg = /^[0-9a-zA-Z]+$/
    if( rg.test(input) )
      return true
    else
      return 'Component name can only include alphanumeric characters'
  } else {
    return 'You need to provide a name'
  }
}

function validateProjectName( input ) {
  if( input ) {
     // TODO This regex probably needs to be checked
    let rg = /^[0-9a-zA-Z\-]+$/
    if( rg.test(input) )
      return true
    else
      return 'Project name can only include alphanumeric characters and a hyphen'
  } else {
    return 'You need to provide a name'
  }
}

module.exports = [
  {
    type: 'input',
    name: 'projectName',
    message: 'What is the project name?',
    default: options.getProjectName(),
    validate: validateProjectName
  },
  {
    type: 'list',
    name: 'siteType',
    message: 'What site is your component for?',
    choices: options.getSiteTypes(),
    default: options.getSiteTypes()[0]
  },
  {
    type: 'list',
    name: 'componentType',
    message: 'What is the type of your new component?',
    choices: options.getComponentTypes(),
    default: 'Atom'
  },
  {
    type: 'input',
    name: 'componentName',
    message: 'What is the name of your new component?',
    default: '',
    validate: validateFilename
  },
  {
    type: 'confirm',
    name: 'acceptsOthers',
    message: 'Does it accept other components?',
    default: false
  },
  {
    when: function(props) { return props.acceptsOthers },
    type: 'checkbox',
    name: 'acceptedTypes',
    message: 'Accepted component types',
    choices: options.getComponentTypes(),
  }
];
