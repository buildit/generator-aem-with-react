let mkdirp = require('mkdirp')
let generators = require('yeoman-generator')
let options = require('./options')

module.exports = generators.Base.extend({

  constructor: function() {
    // Calling the super constructor is important so our generator is correctly set up
    generators.Base.apply(this, arguments)

    // Set some default for the first time we run this
    this.config.defaults({
      projectName: 'demo'
    })
    let configuration = this.config.getAll()
    options.setProjectName( configuration.projectName )
  },

  // initializing: function() {
  // },

  prompting: function() {
    console.log('hello there')
    return this.prompt( require('./prompts') ).then(
      function ( props ) {
        console.log(props)
        this.projectName = props.projectName
        this.componentType = props.componentType
        this.componentName = props.componentName
        this.componentPath = options.getComponentPath(this.componentType)
        this.siteType = props.siteType
        this.destinationDir = options.getSourcePath(this.siteType)
        this.testDir = options.getTestPath(this.siteType)
        this.acceptedTypes = props.acceptsOthers?props.acceptedTypes:false
      }.bind(this) )
  },

  configuration: function() {
    this.config.set( 'projectName', this.projectName )
  },

  // default: function() {
  // },

  writing: function() {
    // Setup the destination folder
    this.destinationRoot(this.destinationDir)

    if( this.acceptedTypes !== false ) {
      this._writeDraggableComponent()
    } else {
      this._writeStandardComponent()
    }
    this._updateIndex()

    this.destinationRoot('../' + this.testDir)
    this._updateTest()
  },

  // conflicts: function() {
  // },

  // install: function() {
  // },

  end: function() {
    console.log('Component ' + this.componentName + ' created.')
  },

  // Update the storybook include file
  _updateStorybook: function() {
    // TODO
  },

  // This will add the new test to the test file in the relevant atomic directory
  _updateTest: function() {
    // First the javascript
    let targetComponentPath = this.destinationDir + '/components/' + this.componentPath
    console.log( 'Creating test for ' + this.componentName )
    mkdirp.sync(targetComponentPath)

    this.fs.copyTpl(
      this.templatePath('test.test.js'),
      this.destinationPath( targetComponentPath + '/' + this.componentName + '.test.js'),
      {
        componentName: this.componentName,
        componentSource: '../../../' + targetComponentPath + '/' + this.componentName + '/' + this.componentName
      }
    )
  },

  // This will add the new component to the index.js file in the relevant atomic directory
  _updateIndex: function() {
    // Get the current file
    let indexSourcePath = this.destinationPath( 'components/' + this.componentPath + '/index.js' )
    let indexContents = this.fs.read(indexSourcePath).split('const components = [');

    // Create the new content
    let newContent = [
      'import { default as ' + this.componentName + ' } from \'./' + this.componentName + '/' + this.componentName + '\'',
      'export { ' + this.componentName + ' }',
      indexContents[0],
      'const components = [',
      '  ' + this.componentName + ',',
      indexContents[1]
    ]

    // Join and write
    let newContentString = newContent.join('\n')
    this.fs.write(indexSourcePath, newContentString)
  },

  // Handle writing a component that can accept other components being dragged into it
  _writeDraggableComponent: function() {
    // First the javascript
    let targetComponentPath = 'components/' + this.componentPath + '/' + this.componentName
    console.log( 'Creating ' + targetComponentPath )
    mkdirp.sync(targetComponentPath)

    this.fs.copyTpl(
      this.templatePath('draggable/js/component.jsx'),
      this.destinationPath( targetComponentPath + '/' + this.componentName + '.jsx'),
      { componentName: this.componentName }
    )
    this.fs.copyTpl(
      this.templatePath('draggable/js/component.css'),
      this.destinationPath( targetComponentPath + '/' + this.componentName + '.css'),
      { componentName: this.componentName }
    )

    // Now the storybook
    mkdirp.sync(targetComponentPath + '/stories')
    this.fs.copyTpl(
      this.templatePath('storybook.js'),
      this.destinationPath( targetComponentPath + '/stories/' + this.componentName + '.js'),
      { componentName: this.componentName,
        componentType: this.componentType }
    )

    // Finally the JCR
    targetComponentPath = 'content/jcr_root/apps/' + this.projectName + '/components/' + this.componentName

    console.log( 'Creating ' + targetComponentPath )
    mkdirp.sync(targetComponentPath)

    this.fs.copy(
      this.templatePath('draggable/apps/_cq_editConfig.xml'),
      this.destinationPath( targetComponentPath + '/_cq_editConfig.xml')
    )
    this.fs.copyTpl(
      this.templatePath('draggable/apps/.content.xml'),
      this.destinationPath( targetComponentPath + '/.content.xml'),
      { componentName: this.componentName,
        componentType: 'React ' + this.componentType }
    )
    this.fs.copyTpl(
      this.templatePath('draggable/apps/component.jsx'),
      this.destinationPath( targetComponentPath + '/' + this.componentName + '.jsx'),
      { componentName: this.componentName }
    )
    this.fs.copyTpl(
      this.templatePath('draggable/apps/design_dialog.xml'),
      this.destinationPath( targetComponentPath + '/design_dialog.xml'),
      { componentName: this.componentName }
    )
  },

  // Handle writing a standard component
  _writeStandardComponent: function() {
    // First the javascript
    let targetComponentPath = 'components/' + this.componentPath + '/' + this.componentName
    console.log( 'Creating ' + targetComponentPath )
    mkdirp.sync(targetComponentPath)

    this.fs.copyTpl(
      this.templatePath('standard/js/component.jsx'),
      this.destinationPath( targetComponentPath + '/' + this.componentName + '.jsx'),
      { componentName: this.componentName }
    )
    this.fs.copyTpl(
      this.templatePath('standard/js/component.css'),
      this.destinationPath( targetComponentPath + '/' + this.componentName + '.css'),
      { componentName: this.componentName }
    )

    // Now the storybook
    mkdirp.sync(targetComponentPath + '/stories')
    this.fs.copyTpl(
      this.templatePath('storybook.js'),
      this.destinationPath( targetComponentPath + '/stories/' + this.componentName + '.js'),
      { componentName: this.componentName,
        componentType: this.componentType }
    )

    // Finally the JCR
    targetComponentPath = 'content/jcr_root/apps/' + this.projectName + '/components/' + this.componentName

    console.log( 'Creating ' + targetComponentPath )
    mkdirp.sync(targetComponentPath)

    this.fs.copyTpl(
      this.templatePath('standard/apps/.content.xml'),
      this.destinationPath( targetComponentPath + '/.content.xml'),
      { componentName: this.componentName,
        componentType: 'React ' + this.componentType }
    )
    this.fs.copyTpl(
      this.templatePath('standard/apps/component.jsx'),
      this.destinationPath( targetComponentPath + '/' + this.componentName + '.jsx'),
      { componentName: this.componentName }
    )
    this.fs.copyTpl(
      this.templatePath('standard/apps/dialog.xml'),
      this.destinationPath( targetComponentPath + '/dialog.xml'),
      { componentName: this.componentName }
    )
  }

})
