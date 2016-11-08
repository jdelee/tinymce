define('tinymce.media.core.Service', [
	'tinymce.media.core.Data',
	'global!tinymce.util.Promise'
], function (Data, Promise) {

	var embedPromise = function (data, dataToHtml, handler) {
		var cache = {};
		return new Promise(function (res, rej) {
			var wrappedResolve = function (response) {
				if (response.html) {
					cache[data.source1] = response;
				}
				return res({
					url: data.source1,
					html: response.html ? response.html : dataToHtml(data)
				});
			};
			if (cache[data.source1]) {
				wrappedResolve(cache[data.source1]);
			} else {
				handler({url: data.source1}, wrappedResolve, rej);
			}
		});
	};

	var defaultPromise = function (data, dataToHtml) {
		return new Promise(function (res) {
			res({html: dataToHtml(data), url: data.source1});
		});
	};

	var loadedData = function (editor) {
		return function (data) {
			return Data.dataToHtml(editor, data);
		};
	};

	var getEmbedHtml = function (editor, data) {
		var embedHandler = editor.settings.media_embed_handler;

		return embedHandler ? embedPromise(data, loadedData(editor), embedHandler) : defaultPromise(data, loadedData(editor));
	};

	return {
		getEmbedHtml: getEmbedHtml
	};
});