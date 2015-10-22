var msgpack = require('msgpack');

module.exports.packWithType = function(object, type){
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
