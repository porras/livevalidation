require 'test/unit'
require 'rubygems'
require 'active_record'
require 'action_controller'
require 'action_controller/test_process'
require 'action_view'
require File.dirname(__FILE__) + '/../lib/live_validations'
require File.dirname(__FILE__) + '/../lib/form_helpers'
require File.dirname(__FILE__) + '/../test/resource'

class ResourcesController < ActionController::Base
  def without_instance_var
    render :inline => "<% form_for(:resource, :url => resources_path) do |f| %><%= f.text_field :name %><% end %>"
  end

  def rescue_action(e)
    raise e
  end
end

ActionController::Routing::Routes.draw do |map|
  map.resources :resources
  map.connect ':controller/:action/:id'
end

class FormHelpersTest < Test::Unit::TestCase
  
  def setup
    @controller = ResourcesController.new
    @request    = ActionController::TestRequest.new
    @response   = ActionController::TestResponse.new
    Resource.class_eval do # reset live validations
      @live_validations = {}
    end
  end

  def test_without_instance_var
    get :without_instance_var
    assert_response :ok
  end

end
