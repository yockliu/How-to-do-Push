# App中如何实现消息推送（上）

如今的手机每天都会被各种App的消息推送覆盖，消息推送也成了App增加自己曝光量的一种重要手段，我们的周末去哪儿也不例外。消息推送的技术也日渐成熟，各种平台纷纷出现，抢占这一业务，本文就从技术角度来吐槽吐槽。

首先介绍下消息推送，即Push的技术基础：

##什么叫Push？


真正的Push应该是只要一个Client设备连接到互联网中，什么也不做等在那里，Server端随时都可以将数据（消息是数据的一种）发送到这个Client上，就好像Server等在那里，Client随时可以访问Server一样。

* Client连接到Internet中
* Client什么也不做，就是等待
* Server随时通过Internet将数据发送到Client

##socket listen 方式

####Server

用Server端做个类比，当一个Web Server在互联网上部署好以后，任何一台电脑都可以通过互联网去访问Server：从Server获取数据、向Server提交数据。向Server提交数据实际就是Client Push数据到Server。在这个模式中，Server所做的事情就是等待，等待任意的Client主动来访问它，并且不需要和Client端保持连接。Server是如何做到这点的呢，实际上是通过listen的方式，具体来说是socket的listen，Server端不需要做额外的事情，只要告诉socket，你去listen吧，有Client请求过来就交给对应的程序去完成吧，就这么简单。

* Server连接到Internet中
* Server create socket & listen
* Client通过Internet访问Server，发送&接受数据
	
![Attachment-1](https://github.com/yockliu/How-to-do-Push/blob/master/public/1.png)

####Client

Client端的Push是否能做到这点呢，我们这里只考虑Client的设备是智能机的情况，主要就是Android、iOS，还有winPhone？大概吧。Android和iOS都是基于unix-like系统的，有完整的网络协议架构，所以使用socket完全没有问题，winPhone作为一个智能机来说，我想也是没有问题的。所以对于这些智能机来说，让一个socket去listen，等待互联网上的任意一台其他设备来访问是可行的，Server Push数据给Client只需要去连接Client的socket就可以了。

* Client连接到Internet中
* Client create socket & listen
* Server通过Internet访问Client，发送&接受数据
	
####实际无法这么做

事情是这么简单吗？显然不是，不然就不会有各个大小公司跳出来做平台了。

```
ps：首先我们要了解socket是什么，socket是基于tcp/ip协议的一个实现，而tcp/ip是整个互联网的协议基础。关于tcp/ip，socket具体内容不在这里赘述，不了解的可以去查相关资料。
```

Server端和Client端有一个很重要的区别，`Server端是有固定的公网ip的，而Client端的ip不是固定的，甚至不一定具有公网ip`。Client访问Server时，实际是通过ip找到Server进行访问的（域名？域名最终也是被解析成ip），有固定的公网ip才方便互联网上的其他设备来访问。而反过来Server想找某个Client时，由于Client的ip不固定，Server端是无法找到Client的。所以即使Client这里放了一个socket在listen，Server找不到Client，还是连接不上Client。

![Attachment-2](https://github.com/yockliu/How-to-do-Push/blob/master/public/2.png)

综上所述，Client是无法使用Server的这种模式去被动接受Push的。是否有办法让Server端知道Client的ip呢，比如每次Client更换ip以后将ip发给Server？这种方法显然是成本高且不可靠的。

##常见方法

所以，目前的Push技术实现基本都是Client主动连接Server，钻牛角尖来讲，现在的Push其实都是伪Push。下面简单讲两种方式：

####一、轮询法：

这种方法最简单，Client每过一段时间向Server请求一次数据。优缺点很明显。
	
* 优点：实现简单
* 缺点：间隔时间不好控制，并且对于客户端来说电量和流量消耗都很大。

####二、长连接法：

还是从socket入手（又是这货？）。

#####什么叫长连接
```
	我们的在进行http请求时，Client会发起一个socket连接，连接上Server后，开始发送并接收数据，数据传输结束后，就会将socket断开。
	如果我们让Client发起一个socket连接，连接上Server，并且一直保持这个连接不断开，这样就叫一个长连接。
```

Client使用一个socket用长连接的方式连接到Server，由于这个连接Server随时可以通过这个socket发送数据给Client。

* 优点：最有效，客户端设备消耗比第一种小（设备应该从系统层对socket的长连接做优化，socket链接维护成本从客户端来讲应该是小于频繁的http请求的）。
* 缺点：服务端压力大，每一个设备都需要一个socket连接。如果每个App都使用单独socket长连接，客户端设备的socket消耗也将很大。

####三、其他一些方式：
还有一些其他协议比如xmpp，其实也逃不过上面两种方式，只是做了一些封装。或者还有一种非互联网方式的做法，比如监听短信法，要push的时候，先发一条手机到目的手机，Client监听到了标的短信，然后向Server请求数据，不过像这类剑走偏锋的方法，限制条件也很多，不是很实用。

##总结一下
目前各个推送平台的实现都是基于长连接法的，如果App要自己实现推送，也是建议使用这种方式。但是如果每个App都用一个长连接，那么手机也吃不消了，所以又有一些其他技术来实现，我们下篇再讲。

====
ps：本想写一篇吐槽下各大平台的，结果貌似要分上下篇了。
