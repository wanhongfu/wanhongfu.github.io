### React中Component的创建方式

在React v0.13之前，我们可能都是按如下方式去创建一个Component:

	var TextComponent = React.createClass({
		render: function() {
			return <p> {this.props.children} </p>
		}
	});
	
	React.render(<TextComponent>Hello World!</TextComponent>, document.body);
	

在v0.13发布后，我们可以利用ES2015的`Class`关键字来声明一个Component:

	class TextComponent extends React.Component {
		render() {
	    	return <p>{this.props.children}</p>;
	    }
	};
	
	React.render(<TextComponent>Hello World</TextComponent>, document.body);
	
在v0.14发布之后，又增加了另一种称之为函数式的创建方式:
	
	const TextComponent = (props) => <p>{this.props.children}</p>;
	
	React.render(<TextComponent>Hello World</TextComponent>, document.body);
	
这种组件Facebook的react-v0.14的release notes中称之为`Functional Stateless Component`, 通常都是指那些功能比较简单且没有状态(`state`)、只需传递props即可的组件，引用官方的一句话:

>This pattern is designed to encourage the creation of these simple components that should comprise large portions of your apps. In the future, we’ll also be able to make performance optimizations specific to these components by avoiding unnecessary checks and memory allocations.

大意就是官方鼓励这样去创建这种比较简单无状态的组件，未来React会对这种组件进行性能上的专门优化。