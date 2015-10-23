var msgpack = require('msgpack');

module.exports.packWithType = (object, type) =>{
  // 使用msgpack序列化
	var buffer = msgpack.pack(object);
	// 重新构建buffer—帧化buffer，格式|length(4byte)|type(1byte)|msgpackbody(var length)|
	var framedBuffer = new Buffer(buffer.length + 4 + 1);
	// 写包体长度到前4个字节
	framedBuffer.writeInt32BE(buffer.length, 0);
	// 写类型到帧化buffer的第5个字节
	framedBuffer.writeUInt8(type, 4);
	// 将包体复制到帧化buffer，从第6个字节开始
	buffer.copy(framedBuffer, 5);

	return framedBuffer;
}


module.exports.unpack = (framedBuffer) =>{
	// console.log(framedBuffer);
	var length = framedBuffer.readInt32BE(0); // 读出前4位byte[]转为int，表示字符长度
	// console.log(length); 1
	var type = framedBuffer.readUInt8(4); // 读出第5位byte，转为8bit integer类型.此时值固定为1，表示消息类型
	var unframedbuffer = framedBuffer.slice(5, 5 + length); // 从第6位到buffer最后一位的新buffer(byte数组)
	// console.log(unframedbuffer);
	var unpack = msgpack.unpack(unframedbuffer);
	// console.log(unpack);
	return {message: unpack, type: type};
}


module.exports.getIntegrityPackage = (buffer) =>{
	//长度
	var length = buffer.readInt32BE(0);
	//消息类型
	var type = buffer.readUInt8(4);
	//主体内容
	var content = buffer.slice(5);

	if(content.length == length){     //刚好一条完整消息
		var iContent = msgpack.unpack(content);
		return {integral: true, content: iContent, type: type, buffer: null};
	}else if(content.length > length){  //一条完整消息+另一条消息一部分
		var iBuffer = content.slice(0,length);  //主体的长度为length的buffer 为消息
		var iContent = msgpack.unpack(iBuffer);
		var newBuffer = content.slice(length);  //主体的下标length为下条消息的开始
		return {integral: true, content: iContent, type: type, buffer:newBuffer};
	}else{	//不够一条
		return {integral: false, content: null, buffer:buffer};
	}
}

module.exports.validateIntegrity = (chunk, buffers) => {
	if(buffers.length > 0){									//这里把上次存的buffer和chunk合并
		var cache = buffers.pop(); 						//其实永远都只有一个元素在数组里面
		var newBuffer = new Buffer(cache.length + chunk.length);
		cache.copy(newBuffer,0);
		chunks.copy(newBuffer,cache.length);
		buffers.splice(0,buffers.length);			//清了缓存
		chunk = newBuffer;
	}

	if(chunk.length < 5){
		return {
			integral:true,
			msg:null,
		}
	}

	var message = this.getIntegrityPackage(chunk);
	if(message.integral && message.buffer == null){//刚好一条哦
		console.log('integral message');
	}else if(message.integral && message.buffer){ //一条还送一点哦
		console.log('integral message with buffer');
		buffers.push(message.buffer);
	}else if(!message.integral){								//不够一条
		console.log('not a integral message');
		buffers.push(message.buffer)
	}

	return message;
}
