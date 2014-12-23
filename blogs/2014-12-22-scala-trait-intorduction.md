Scala Trait
-------
***

Trait是Scala里的一个新的语言特性,和Java里的interface有点接近,但又类似于Class, trait可以有属性和方法实现. 本文简单的比较了下Scala里trait和class的不同点.

###1. Scala Trait的主构造函数不能包含任何参数声明

例如以下为错误代码:

		trait Student(age: Int) {		
		}

上面的代码是想在构造trait里传递参数给实例,但想想trait是类似于Java里的interface,怎么可能可以指定构造参数? 但问题总是有解决办法的,要想在trait里达到该目的,Scala为我们提供了抽象 `val`, 代码如下:
  
		trait Student {
			val age: Int
		}
		
		new Student {
			val age = 15
		}

###2. Trait 的 `super`  

在trait里, `super` 是动态绑定的(dynamic bound), 其行为要看该trait被织入(mixed into)的具体类才能决定, 假设我们有如下代码:

		abstract class StringSource {
			def getContent(): String
		}
		
		class BasicStringSource(val content: String) extends StringSource {
			def getContent() = {
			  println(s"In BasicStringSource, content is '$content'")
			  content
			}
		} 


以下我们定义了抽象的字符串源类, 接着我们定义了一个基本的字符串源的实现类 `BasicStringSource`, 接下来我们再定义三个继承抽象类 `StringSource` 的字符串操作的 trait.

		trait Uppercase extends StringSource {
			abstract override def getContent(): String = {
				val content = super.getContent().toUpperCase
				println(s"In Uppercase, content is '$content'")
				content
			}
		}
		
		trait Reverse extends StringSource {
			abstract override def getContent(): String = {
				val content = super.getContent().reverse
				println(s"In Reverse, content is '$content'")
				content
			}
		}
		
		trait Pad extends StringSource {
			abstract override def getContent(): String = {
				val content = super.getContent().padTo(20, '*')
				println(s"In Pad, content is '$content'")
				content
			}
		}

我们分别定义了 `Uppercase`, `Reverse`, `Pad` 三个trait实现对 `StringSource` 中的抽象函数 `getContent()` 进行 _override_, 注意这里的 **abstract override** 是必须的. 为了便于观察,每个实现函数中我都添加了 `println` 语句, 我们再用以下代码来进行测试

		val source1 = new BasicStringSource("Hello World") with Uppercase with Reverse with Pad
		println(source1.getContent)

输出结果为

	>In BasicStringSource, content is 'Hello World'
	>In Uppercase, content is 'HELLO WORLD'
	>In Reverse, content is 'DLROW OLLEH'
	>In Pad, content is 'DLROW OLLEH*********'
	>DLROW OLLEH*********

由结果可知, 对象 `source1` 的声明顺序是 `BasicStringSource -> Uppercase -> Reverse -> Pad`, 但根据以上输出可知

*  `Pad` 的 `super.getContent` 指向并调用的是 `Reverse` 的 `getContent`
*  `Reverse` 的 `super.getContent` 再调用 `Uppercase` 的 `getContent`
*  `Uppercase` 的 `super.getContent` 再调用 `BasicStringSource` 的 `getContent`,  此时便有了第一行输出.
*  `BasicStringSource` 的 `getContent` 返回到 `Uppercase` 的 `getContent` , 便有了第二行输出, 依此类推...   

所以 trait 的 `getContent` 函数的调用顺序为 `Pad -> Reverse -> Uppercase -> BasicStringSource`, 但由于 `super`, 最终执行顺序又和声明顺序相同.


 _(END)_ 
 
*** 
 _post @ 2014-10-20 by wanhong_
