require 'webrick'
require 'json'

PORT = 8000
todos = JSON.parse File.read 'public/todos.json'
root = File.expand_path 'public/'

module WEBrick
  module HTTPServlet
    class ProcHandler
      alias do_DELETE do_POST
    end
  end
end

server = WEBrick::HTTPServer.new Port: PORT, DocumentRoot: root
server.mount_proc '/todos.json' do |req, res|
  if req.request_method == 'POST'
    req.query['id'] = todos.map { |todo| todo['id'].to_i }.sort.last + 1
    todos << req.query
    File.write 'public/todos.json', todos.to_json
  elsif req.request_method == 'DELETE'
    id = req.query['id']
    newTodos = []
    puts "[DELETED] todo with id=#{id}, size=#{id.length}"
    p todos
    todos.each do |todo|
      puts "[LOOP] #{todo.inspect}"
      unless id == todo['id'].to_s
        newTodos << todo
      else
        puts "[DELETED] todo with id=#{id}, size=#{id.length}"
      end
    end
    File.write 'public/todos.json', newTodos.to_json
    todos = newTodos
  end

  res['Content-Type'] = 'application/json'
  res.body = todos.to_json
end

trap 'INT' do server.shutdown end
server.start
