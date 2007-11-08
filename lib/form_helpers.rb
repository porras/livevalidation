module ActionView
  module Helpers
    module FormHelper
      def text_field_with_live_validations(object_name, method, options = {})
        live = options.delete(:live)
        live = true if live.nil?
        text_field_without_live_validations(object_name, method, options = {}) +
        ( live ? live_validations_for(object_name, method) : '' )
      end

      def live_validations_for(object_name, method)
        script_tags(live_validation(object_name, method))
      end
      
      alias_method_chain :text_field, :live_validations
      
      private
      
      def live_validation(object_name, method)
        if validations = self.instance_variable_get("@#{object_name.to_s}").class.live_validations[method] rescue false
          field_name = "#{object_name}_#{method}"
          initialize_validator(field_name) +
          validations.map do |type, configuration|
            live_validation_code(field_name, type, configuration)
          end.join(';')
        else
          ''
        end
      end
      
      def initialize_validator(field_name)
        "var #{field_name} = new LiveValidation('#{field_name}');"
      end
      
      def live_validation_code(field_name, type, configuration)
        "#{field_name}.add(#{ActiveRecord::Validations::VALIDATION_METHODS[type]}" + ( configuration ? ", #{configuration.to_json}" : '') + ')'
      end
      
      def script_tags(js_code = '')
         ( js_code.blank? ? '' : "<script>#{js_code}</script>" )
      end
    end
  end
end
