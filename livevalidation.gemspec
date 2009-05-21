# -*- encoding: utf-8 -*-

Gem::Specification.new do |s|
  s.name = %q{livevalidation}
  s.version = "0.0.0"

  s.required_rubygems_version = Gem::Requirement.new(">= 0") if s.respond_to? :required_rubygems_version=
  s.authors = ["Sergio Gil"]
  s.date = %q{2009-05-21}
  s.description = %q{Easy client side validation for your ActiveRecord models}
  s.email = %q{sgilperez@gmail.com}
  s.extra_rdoc_files = [
    "README"
  ]
  s.files = [
    "README",
     "Rakefile",
     "VERSION",
     "assets/javascripts/live_validation.js",
     "assets/stylesheets/live_validation.css",
     "init.rb",
     "install.rb",
     "lib/form_helpers.rb",
     "lib/live_validations.rb",
     "tasks/live_validation_tasks.rake",
     "test/form_helpers_test.rb",
     "test/live_validations_test.rb",
     "test/resource.rb",
     "test/test_helper.rb",
     "uninstall.rb"
  ]
  s.has_rdoc = true
  s.homepage = %q{http://github.com/porras/livevalidation}
  s.rdoc_options = ["--charset=UTF-8"]
  s.require_paths = ["lib"]
  s.rubygems_version = %q{1.3.2}
  s.summary = %q{Easy client side validation for your ActiveRecord models}
  s.test_files = [
    "test/form_helpers_test.rb",
     "test/live_validations_test.rb",
     "test/resource.rb",
     "test/test_helper.rb"
  ]

  if s.respond_to? :specification_version then
    current_version = Gem::Specification::CURRENT_SPECIFICATION_VERSION
    s.specification_version = 3

    if Gem::Version.new(Gem::RubyGemsVersion) >= Gem::Version.new('1.2.0') then
    else
    end
  else
  end
end
