module ActiveRecord
  module Validations
    LIVE_VALIDATIONS_OPTIONS = {
      :failureMessage => :message,
      :pattern => :with
    }
    # more complicated mappings in map_configuration method
    
    VALIDATION_METHODS = {
      :presence => "Validate.Presence",
      :numericality => "Validate.Numericality",
      :format => "Validate.Format",
      :length => "Validate.Length"
    }
    
    
    module ClassMethods
      
      VALIDATION_METHODS.keys.each do |type|
        define_method "validates_#{type}_of_with_live_validations".to_sym do |*attr_names|
          send "validates_#{type}_of_without_live_validations".to_sym, *attr_names
          define_validations(type, attr_names)
        end
        alias_method_chain "validates_#{type}_of".to_sym, :live_validations
      end

      def live_validations
        @live_validations ||= {}
      end

      private
      
      def define_validations(validation_type, attr_names)
        configuration = map_configuration(attr_names.pop, validation_type) if attr_names.last.is_a?(Hash)
        attr_names.each do |attr_name|
          add_live_validation(attr_name, validation_type, configuration)
        end
      end

      def add_live_validation(attr_name, type, configuration = {})
        @live_validations ||= {}
        @live_validations[attr_name] ||= {}
        @live_validations[attr_name][type] = configuration
      end
      
      def map_configuration(configuration, type = nil)
        LIVE_VALIDATIONS_OPTIONS.each do |live, rails|
          configuration[live] = configuration.delete(rails)
        end
        configuration[:notANumberMessage] = configuration.delete(:failureMessage) if type == :numericality
        if type == :length and range = ( configuration.delete(:in) || configuration.delete(:within) )
          configuration[:minimum] = range.begin
          configuration[:maximum] = range.end
        end
        configuration.reject {|k, v| v.nil? }
      end
    end
  end
end