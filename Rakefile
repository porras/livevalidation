require 'rake'
require 'rake/testtask'
require 'rake/rdoctask'

desc 'Default: run unit tests.'
task :default => :test

desc 'Test the live_validation plugin.'
Rake::TestTask.new(:test) do |t|
  t.libs << 'lib'
  t.pattern = 'test/**/*_test.rb'
  t.verbose = true
end

desc 'Generate documentation for the live_validation plugin.'
Rake::RDocTask.new(:rdoc) do |rdoc|
  rdoc.rdoc_dir = 'rdoc'
  rdoc.title    = 'LiveValidation'
  rdoc.options << '--line-numbers' << '--inline-source'
  rdoc.rdoc_files.include('README')
  rdoc.rdoc_files.include('lib/**/*.rb')
end

begin
  require 'jeweler'
  Jeweler::Tasks.new do |gemspec|
    gemspec.name = "livevalidation"
    gemspec.summary = "Easy client side validation for your ActiveRecord models"
    gemspec.email = "sgilperez@gmail.com"
    gemspec.homepage = "http://github.com/porras/livevalidation"
    gemspec.description = "Easy client side validation for your ActiveRecord models"
    gemspec.authors = ["Sergio Gil"]
  end
rescue LoadError
end
