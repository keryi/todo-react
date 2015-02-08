var TodoBox = React.createClass({
  getInitialState: function() {
    return { data: [] };
  },

  handleTodoSubmit: function(todo) {
    var todos = this.state.data;
    var newTodos = todos.concat([todo]);
    this.setState({ data: newTodos });

    $.ajax({
      url: this.props.url,
      type: 'POST',
      dataType: 'json',
      data: todo,
      success: function(data) {
        this.setState({ data: data })
      }.bind(this),
      error: function(xhr, status, err) {
        console.log(err);
      }.bind(this)
    });
  },

  getTodosFromServer: function() {
    $.ajax({
      url: this.props.url,
      type: 'GET',
      dataType: 'json',
      success: function(data) {
        this.setState({ data: data })
      }.bind(this),
      error: function(xhr, status, err) {
        console.log(err);
        return;
      }.bind(this)
    });
  },

  componentDidMount: function() {
    this.getTodosFromServer();
    setInterval(this.getTodosFromServer, this.props.pollInterval);
  },

	render: function() {
		return (
			<div className='TodoBox'>
				<h1>Todo <a href='#' onClick={this.getTodosFromServer}>refresh</a></h1>
        <TodoForm onTodoSubmit={this.handleTodoSubmit}/>
        <TodoList data={this.state.data}/>
			</div>
		);
	}
});

var TodoList = React.createClass({
	render: function() {
    var data = this.props.data;
    var todos = data.map(function(todo) {
      return (
        <Todo title={todo.title} id={todo.id} data={data} url='todos.json'/>
      );
    })
		return (
			<div className='TodoList'>
				<ul className='list-unstyled'>
					{todos}
				</ul>
			</div>
		);
	}
});

var Todo = React.createClass({
  updateTodo: function(e) {
    e.preventDefault();

    var todo = this.refs.id.getDOMNode();

    if (confirm('Check this todo?')) {
      $(todo).parents('.Todo').hide();
      $.ajax({
        url: this.props.url,
        type: 'PUT',
        data: { 'id': todo.value.trim() },
        success: function(data) {
          /* some flash message? */
        }.bind(this),
        error: function(xhr, status, err) {
          console.log(err);
        }.bind(this)
      });
    }
  },

	render: function() {
		return (
			<div className='Todo'>
        <div className='checkbox'>
          <label>
            <input type='checkbox' onClick={this.updateTodo} ref='id' value={this.props.id}/> {this.props.title}
          </label>
        </div>
      </div>
		);
	}
});

$('#todo-title').keypress(function(e) {
  if (e.which == 13) {
    $(this).parent('.form').submit();
    return false;
  }
});

var TodoForm = React.createClass({
  handleSubmit: function(e) {
    e.preventDefault();

    var title = this.refs.title.getDOMNode().value.trim();

    if (!title) {
      console.log("Title can't be blank");
      return;
    }

    this.props.onTodoSubmit({ title: title });

    this.refs.title.getDOMNode().value = "";
  },

  render: function() {
    return (
      <form className='TodoForm form' onSubmit={this.handleSubmit}>
        <div className='form-group'>
          <input type='text' className='form-control' ref='title' id='todo_title' placeholder='Write out what you want to do'/>
        </div>
      </form>
    );
  }
});

React.render(
	<TodoBox url='todos.json' pollInterval={30000}/>,
	document.getElementById('todo_box')
);