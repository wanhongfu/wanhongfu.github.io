 Maven与私服Apache Archiva配置的一些问题汇总
-------
***

* **Apache Archiva安装**

  这个很简单,请直接查看官网或到Google搜索,很多的.

* **Apache Archiva的Repository配置**

  在添加了Remote Repositories后, 要记得如果是使用代理访问互联网,首先要添加Network Proxies, 之后在Proxy Connectors里将添加的Remote Repositories与Network Proxies关联. 

* **Maven的Settings.xml的配置**

  有时我们在项目的POM与Settings.xml里加入了上面创建的Archiva Repository后,可是在跑Maven命令时Maven仍然会到它默认的仓库( http://repo.maven.apache.org/maven2 ) 去下载所依赖的Jar. 要实现一切下载都经由我们自己的私服Archiva,需要在Maven的Settings.xml增加如下配置: 

        <mirror>
          <id>MyOwnRepo</id>
          <mirrorOf>*</mirrorOf>
          <name>MyOwnRepo</name>
          <url>http://192.168.1.1/archiva/repository/internal</url>
        </mirror>
  	
  	这样所有的下载都只会经我们自己的Archiva了.

* **到这一步,如果再跑Maven命令时依赖的Jar仍然不能下载或下载出错或找不到包, 请尝试在mvn命令后增加 –U 参数.**

* **关于安装第三方jar到Artifact**

 从Artifact的官方上看到其实有很多种方法([请看这里](http://archiva.apache.org/docs/1.3.6/userguide/deploy.html)),最简单的就是从Archiva的web 页面上找到Upload Artifact这个功能. 我使用的方法是maven的 deploy:deploy-file 命令,这种方法时要注意的是如果你要安装的jar和pom是位于本地repository的目录下,这个命令就会出错 (Cannot deploy artifact from the local repository…), 解决方法:将要安装的jar和pom copy到其它目录再安装,只要不在本地仓库目录都应该可以.
 
 _(END)_ 
 
*** 
 _post @ 2013-06-06 by wanhong_