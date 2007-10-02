require 'test/unit'
require 'rubygems'
require 'active_record'
require File.dirname(__FILE__) + '/../lib/live_validations'

ActiveRecord::Base.class_eval do
  alias_method :save, :valid?
  def self.columns() @columns ||= []; end
  
  def self.column(name, sql_type = nil, default = nil, null = true)
    columns << ActiveRecord::ConnectionAdapters::Column.new(name.to_s, default, sql_type, null)
  end
end

class Resource < ActiveRecord::Base
  column :id, :integer
  column :name, :string
  column :amount, :integer
end

class LiveValidationTest < Test::Unit::TestCase
  
  def setup
    Resource.class_eval do # reset live validations
      @live_validations = {}
    end
  end

  def test_live_validations_accessor
    assert_kind_of(Hash, Resource.live_validations)
  end
  
  def test_without_validations
    assert_equal({}, Resource.live_validations)
  end
  
  def test_presence
    Resource.class_eval do
      validates_presence_of :name, :message => "can't be blank"
    end
    assert_kind_of(Hash, Resource.live_validations[:name])
    assert_kind_of(Hash, Resource.live_validations[:name][:presence])
    assert_equal("can't be blank", Resource.live_validations[:name][:presence][:failureMessage])
  end
  
  def test_numericality
    Resource.class_eval do
      validates_numericality_of :amount, :message => "isn't a valid number"
    end
    assert_kind_of(Hash, Resource.live_validations[:amount])
    assert_kind_of(Hash, Resource.live_validations[:amount][:numericality])
    assert_equal("isn't a valid number", Resource.live_validations[:amount][:numericality][:notANumberMessage])
  end

  def test_format
    Resource.class_eval do
      validates_format_of :name, :with => /^\w+$/, :message => "only letters are accepted"
    end
    assert_kind_of(Hash, Resource.live_validations[:name])
    assert_kind_of(Hash, Resource.live_validations[:name][:format])
    assert_equal("only letters are accepted", Resource.live_validations[:name][:format][:failureMessage])
    assert_equal(/^\w+$/, Resource.live_validations[:name][:format][:pattern])
  end
  
end
