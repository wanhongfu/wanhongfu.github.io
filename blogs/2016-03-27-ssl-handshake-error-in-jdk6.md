### JDK6中，SSL连接失败"SSL peer shut down incorrectly"问题的解决

先上代码:
	
	URL testUrl = new URL("https://abc.com/a");
	URLConnection conn = testUrl.openConnection();
	
	SSLContext sslContext = SSLContext.getInstance("TLS");
	//省略SSLContext初始化服务器证书代码
	
	conn.setSSLSocketFactory(sslContext.getSocketFactory());
	conn.setConnectTimeout(getConnectTimeout());
	conn.setReadTimeout(getReadTimeout());
	
    BufferedReader in = new BufferedReader(new InputStreamReader(conn.getInputStream(), Constants.ENCODING_UTF_8));
    //省略内容读取代码

以上代码在JDK7及以上运行应该都可以正常读取服务器的内容，但在JDK6下，有可能会碰到如下错误:

	ERROR: Remote host closed connection during handshake
	javax.net.ssl.SSLHandshakeException: Remote host closed connection during handshake
	        at com.sun.net.ssl.internal.ssl.SSLSocketImpl.readRecord(SSLSocketImpl.java:882)
	        at com.sun.net.ssl.internal.ssl.SSLSocketImpl.performInitialHandshake(SSLSocketImpl.java:1203)
	        at com.sun.net.ssl.internal.ssl.SSLSocketImpl.startHandshake(SSLSocketImpl.java:1230)
	        at com.sun.net.ssl.internal.ssl.SSLSocketImpl.startHandshake(SSLSocketImpl.java:1214)
	        at sun.net.www.protocol.https.HttpsClient.afterConnect(HttpsClient.java:434)
	        at sun.net.www.protocol.https.AbstractDelegateHttpsURLConnection.connect(AbstractDelegateHttpsURLConnection.java:166)
	        at sun.net.www.protocol.http.HttpURLConnection.getInputStream(HttpURLConnection.java:1195)
	        at sun.net.www.protocol.https.HttpsURLConnectionImpl.getInputStream(HttpsURLConnectionImpl.java:234)
	        ...
	Caused by: java.io.EOFException: SSL peer shut down incorrectly
        at com.sun.net.ssl.internal.ssl.InputRecord.read(InputRecord.java:333)
        at com.sun.net.ssl.internal.ssl.SSLSocketImpl.readRecord(SSLSocketImpl.java:863)
        ... 28 more

在jvm启动参数里加上如下选项开启SSL相关诊断日志:
	
	-Djavax.net.debug="ssl,handshake,record"	

在输出的SSL诊断日志中会包含如下信息:

	WRITE: TLSv1 Handshake, length = 75
	WRITE: SSLv2 client hello message, length = 101
	received EOFException: error
	handling exception: javax.net.ssl.SSLHandshakeException: Remote host closed connection during handshake
	SEND TLSv1 ALERT:  fatal, description = handshake_failure
	WRITE: TLSv1 Alert, length = 2
	called closeSocket()
	ERROR: Remote host closed connection during handshake
	javax.net.ssl.SSLHandshakeException: Remote host closed connection during handshake
	        at com.sun.net.ssl.internal.ssl.SSLSocketImpl.readRecord(SSLSocketImpl.java:882)
	        .....
	Caused by: java.io.EOFException: SSL peer shut down incorrectly
	        at com.sun.net.ssl.internal.ssl.InputRecord.read(InputRecord.java:333)
	        ...
	called close()
	called closeInternal(true)

其中，`TLSv1`为Https的安全协议，由代码`SSLContext.getInstance("TLS")`指定；
而`SSLv2`为协议版本，通常由代码`SSLSocket.setEnabledCipherSuites(String[] suites)`指定，但我们代码并未指定该协议版本，该情况下在JDK6中会使用默认的版本`SSLv2`，从而导致以上的错误(点[这里](http://stackoverflow.com/questions/4682957/why-does-javas-sslsocket-send-a-version-2-client-hello/4686924#4686924)查看为什么出错)。
查阅文档后发现，协议版本除了通过`SSLSocket.setEnabledCipherSuites`来指定外，还可通过jvm参数来指定:

	-Dhttps.protocols="TLSv1"

在增加上述配置后, SSL诊断日志如下:

	WRITE: TLSv1 Handshake, length = 48
	WRITE: TLSv1 Application Data, length = 320
	READ: TLSv1 Application Data, length = 3520
	called close()
	called closeInternal(true)
	SEND TLSv1 ALERT:  warning, description = close_notify
	WRITE: TLSv1 Alert, length = 32
	called closeSocket(selfInitiated)
