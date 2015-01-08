基于AKKA的DDD/CQRS实现
=========================

最近读了一个关于用AKKA来实现DDD/CQRS(Domain-Driven Design/Command Query Responsibility Segregation)的系列文章,之前对DDD和CQRS也有些学习了解,感觉对于传统三层架构而言(`Action/Controller -> Service -> DAO`),由于DDD专注于领域分析与抽象,使用DDD架构建立起领域模型,更有利于提高系统复用性与独立性, 关于DDD可以进一步参阅Jdon.com上的[这篇文章](http://www.jdon.com/ddd.html).

DDD是好,但真正在项目中实施时,你会发觉有很多地方无法优雅的处理好,比如在DDD里领域模型中的`Entity`不单单是只具有Getter/Setter的贫血对象,它应该还具有与现实业务场景中实体对象相对应的行为,想想从面向对象分析与设计的角度而言,这无可厚非.但倘若这样的实体行为涉及与Repository交互的操作,该如何处理? 例如在[这篇文章里](http://www.udidahan.com/2008/02/29/how-to-create-fully-encapsulated-domain-models/)作者提到的游戏购物车问题,`TradeInCart`这个实体对象的`canAdd()`的方法参数居然要将`Service`和`Repository`传入,怎么看都不觉得是个优雅的作法.但仔细想想,如果不这样又该如何?这时领域事件(Domain Event)出现了,大致意思是我们的`Entity`不应该直接依赖任何`Service`和`Repository`,而是要在诸如`canAdd()`这样方法内通过领域事件([Domain Events](http://www.udidahan.com/2009/06/14/domain-events-salvation/))的形式来驱动其它相关服务.

在Domain Event提出后,便出现了Event Souring这个概念,即任何对`Entity`所抛出的事件都应该被存储,以达到通过事件来对`Entity`状态进行维护,但是Domain Event与Event Souring究竟如何落地? 答案便是CQRS架构.详细讨论可以参阅Jdon的[这篇文章](http://www.jdon.com/cqrs.html).

Akka是使用Scala开发的基于Actor模型的并发处理平台, 其核心思想Actors是一个轻量级的对象，只能通过发送消息与其实现交互,而且消息可以被持久化([akka-persistence-experimental](http://doc.akka.io/docs/akka/snapshot/scala/persistence.html))来实现Stateful Actor. 这不免让我感觉Akka是让CQRS\EventSouring落地的绝佳选择.

有兴趣的可以点击以下链接来参阅这三篇文章:

1. [Reactive DDD with Akka](http://pkaczor.blogspot.com/2014/04/reactive-ddd-with-akka.html)
2. [Reactive DDD with Akka - lesson 2](http://pkaczor.blogspot.com/2014/04/reactive-ddd-with-akka-lesson-2.html)
3. [Reactive DDD with Akka - lesson 3 (Projections)](http://pkaczor.blogspot.com/2014/06/reactive-ddd-with-akka-projections.html) 

