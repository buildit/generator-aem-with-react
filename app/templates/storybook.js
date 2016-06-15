import * as React from 'react'
import <%= componentName %> from '../<%= componentName %>'
import { storiesOf, action } from '@kadira/storybook'

storiesOf('<%= componentType %>: <%= componentName %>', module)
  .add('Primary', () => (
    <<%= componentName %> root={true}></<%= componentName %>>
  ))
