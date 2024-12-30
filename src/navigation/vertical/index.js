import dashboard from './dashboard'
import appsAndPages from './apps-and-pages'
import charts from './charts'
import forms from './forms'
import others from './others'
import uiElements from './ui-elements'

import products from './products'
import orders from './orders'
import events from './events'
import merchant from './merchant'
import support from './support'

export default [...dashboard, ...products, ...orders, ...events, ...merchant, ...support, ...appsAndPages, ...uiElements, ...forms, ...charts, ...others]
