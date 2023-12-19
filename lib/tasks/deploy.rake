# fly launch --vm-memory 256
# fly deploy
# fly ssh consol
namespace :deploy do
  task :ssh do
    sh "fly ssh console"
  end

  task :launch do
    sh "fly launch --vm-memory 256"
  end

  task :now do
    sh "fly deploy"
  end

  task :status do
    sh "fly status"
  end
end

task :deploy do
  Rake::Task["deploy:now"].invoke
end
