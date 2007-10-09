require 'test/unit'
require 'rubygems'
require 'active_record'
require 'action_controller'
require 'action_view'
require File.dirname(__FILE__) + '/../lib/live_validations'
require File.dirname(__FILE__) + '/../lib/form_helpers'
require File.dirname(__FILE__) + '/../test/resource'

class FormHelpersTest < Test::Unit::TestCase
  
  def setup
    Resource.class_eval do # reset live validations
      @live_validations = {}
    end
  end

  def test_truth
    assert true
  end

end
