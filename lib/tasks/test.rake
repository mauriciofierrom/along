# frozen_string_literal: true

namespace :test do
  task rails: :environment do
    sh "bin/rails test:all"
  end

  task bun: :environment do
    sh "bun test --isolate"
  end

  task rspec: :environment do
    sh "rspec"
  end

  task cypress: :environment do
    server_pid = spawn(
      { "CYPRESS" => "1" },
      "bin/rails",
      "server",
      "-p",
      "5017",
      "--pid",
      "/tmp/server.pid",
      out: File::NULL,
      err: File::NULL,
    )

    begin
      sh("yarn wait-on http://localhost:5017")
      sh("yarn cypress run")
    ensure
      begin
        Process.kill("TERM", server_pid)
      rescue Errno::ESRCH
        # Server already exited
      end

      begin
        Process.wait(server_pid)
      rescue Errno::ECHILD
        # Process was already reaped
      end
    end
  end

  desc "Run all tests"
  task ci: [:rails, :rspec, :bun, :cypress]
end
