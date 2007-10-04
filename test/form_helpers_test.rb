require 'test/unit'
require 'rubygems'
require 'active_record'
require File.dirname(__FILE__) + '/../lib/live_validations'
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
