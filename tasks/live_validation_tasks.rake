namespace :livevalidation do
  
  PLUGIN_ROOT = File.dirname(__FILE__) + '/../'
  
  desc 'Installs required javascript file to the public/javascripts directory.'
  task :install do
    FileUtils.cp Dir[PLUGIN_ROOT + '/assets/javascripts/*.js'], RAILS_ROOT + '/public/javascripts'
  end

  desc 'Removes the javascript for the plugin.'
  task :remove do
    FileUtils.rm %{live_validation.js}.collect { |f| RAILS_ROOT + "/public/javascripts/" + f  }
  end
  
end