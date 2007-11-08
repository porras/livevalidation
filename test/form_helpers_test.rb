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
    render_form(:text, :name)
  end

  def without_live
    @resource = Resource.new
    render :inline => "<% form_for(:resource, :url => resources_path) do |f| %><%= f.text_field :name, :live => false %><% end %>" 
  end

  def name
    @resource = Resource.new
    render_form(:text, :name)
  end
  
  def amount
    @resource = Resource.new
    render_form(:text, :amount)
  end

  def rescue_action(e)
    raise e
  end
  
  private
  
  def render_form(type, method)
    render :inline => "<% form_for(:resource, :url => resources_path) do |f| %><%= f.#{type}_field :#{method} %><% end %>"    
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
    check_form_item :type => 'text', :name => 'name'
  end

  def test_without_live
    Resource.class_eval do
      validates_presence_of :name
    end
    get :without_live
    check_form_item :type => 'text', :name => 'name'
  end

  def test_presence
    Resource.class_eval do
      validates_presence_of :name
    end
    get :name
    check_form_item :type => 'text', :name => 'name', :script => "var resource_name = new LiveValidation('resource_name');resource_name.add(Validate.Presence, {validMessage: \"\"})"
  end

  def test_presence_with_message
    Resource.class_eval do
      validates_presence_of :name, :message => 'is required'
    end
    get :name
    check_form_item :type => 'text', :name => 'name', :script => "var resource_name = new LiveValidation('resource_name');resource_name.add(Validate.Presence, {validMessage: \"\", failureMessage: \"is required\"})"
  end

  def test_numericality
    Resource.class_eval do
      validates_numericality_of :amount
    end
    get :amount
    check_form_item :type => 'text', :name => 'amount', :script => "var resource_amount = new LiveValidation('resource_amount');resource_amount.add(Validate.Numericality, {validMessage: \"\"})"
  end

  def test_numericality_only_integer
    Resource.class_eval do
      validates_numericality_of :amount, :only_integer => true
    end
    get :amount
    check_form_item :type => 'text', :name => 'amount', :script => "var resource_amount = new LiveValidation('resource_amount');resource_amount.add(Validate.Numericality, {onlyInteger: true, validMessage: \"\"})"
  end
  
  private

  def check_form_item(options = {})
    assert_response :ok
    assert_select 'form[action="/resources"]' do
      assert_select "input[type='#{options[:type]}'][id='resource_#{options[:name]}']"
      if options[:script]
        assert_select 'script', options[:script]
      else
        assert_select 'script', 0
      end
    end
  end

end
