require 'test/unit'

require 'rubygems'
gem 'rails', '<= 2.3.0' #tests aren't passing in 2.3.2 (but it seems to work)

require 'active_record'
require 'action_controller'
require 'action_controller/test_process'
require 'action_view'

require File.dirname(__FILE__) + '/../lib/live_validations'
require File.dirname(__FILE__) + '/../lib/form_helpers'
require File.dirname(__FILE__) + '/../test/resource'