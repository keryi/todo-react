require 'webrick'
require 'json'
require 'sqlite3'

require_relative './todo.rb'

ActiveRecord::Base.establish_connection(adapter: 'sqlite3', database: 'db/development.sqlite3')

PORT = 8000
root = File.expand_path 'public/'

module WEBrick
  module HTTPServlet
    class ProcHandler
      alias do_PUT do_POST
    end
  end
end

server = WEBrick::HTTPServer.new Port: PORT, DocumentRoot: root
server.mount_proc '/todos.json' do |req, res|
  if req.request_method == 'POST'
    # Todo, raise error?
    todo = Todo.new title: req.query['title'], status: 0
    todo.save
  elsif req.request_method == 'PUT'
    todo = Todo.find_by id: req.query['id']
    puts "Update todo##{todo.id}"
    todo.update status: 1
    todo.save
  end

  res['Content-Type'] = 'application/json'
  res.body = Todo.where(status: 0).to_json
end

trap 'INT' do server.shutdown end
server.start
