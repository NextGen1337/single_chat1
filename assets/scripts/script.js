$(document).ready(function() {
	const input = $('.js-input'),
		  chatList = $('.js-msgList'),
		  overlay = $('.js-overlay'),
		  stickerModal = $('.js-stickerModal');

	let msgNumber = 1;
 	let stickerPack = [
  		{
  			name: 'boss',
  			url: './assets/image/stickers/orehus_stiker.png'
  		},
  		{
  			name: 'crab',
  			url: './assets/image/stickers/orehus_stiker.png'
  		},
  		{
  			name: 'hi',
  			url: './assets/image/stickers/orehus_stiker.png'
  		},
  		{
  			name: 'rainbow',
  			url: './assets/image/stickers/orehus_stiker.png'
  		},
  		{
  			name: 'orehus',
  			url: './assets/image/stickers/orehus_stiker.png'
  		}
  	];

    moment.locale('ru');
    input.focus();

	$('.js-send').click(function() {
		onMessageSend();
	});

	$('.js-openStickerModal').click(function() {
		overlay.addClass('-active');
		stickerModal.addClass('-active');
	})

	overlay.click(function() {
		hideStickerModal();
	})

	$(document).on('keydown', function(e) {
		if (e.which === 13) {
			onMessageSend();
		} else if (e.which === 27 && overlay.hasClass('-active')) {
			hideStickerModal();
		}
	})

	chatList.on('click', '.chat__delete', function() {
		$(this).parent().parent().remove();
	})

	function onMessageSend() {
		const newMessage = input.val();

		if (!newMessage.match("^\\s*$")) {
			addMessageToChat(newMessage);
		}
		input.val('');
		input.focus();
	}

	function addMessageToChat(message) {
		chatList.append(
			'<li class="' + preparePositionClass() + '">' +
				'<div class="chat__msg">' + 
					message + ' ' + 
					'<div class="chat__delete"></div>' +
				'</div>' +
				'<div class="chat__time">' +
					moment().format('LT') + 
				'</div>' +
			'</li>'
		);

		onAfterMessageSent();
	}

	function addStickerToChat(imageUrl) {
		chatList.append(
			'<li class="' + preparePositionClass() + '">' +
				'<div class="chat__image">' + 
					'<img src="' + imageUrl + '">' +
				'</div>' +
				'<div class="chat__time">' +
					moment().format('LT') + 
				'</div>' +
			'</li>'
		);

		$('.chat__image').click(function(event) {
			overlay.addClass('-active');
			$(".image-viewer").removeClass("hidden");
			$("#image-viewer-container").attr('src',
			$(event.target).attr('src'));
		});
		onAfterMessageSent();
	}

	stickerPack.forEach(function(sticker) {
		$('.sticker-modal__list').append(
			"<li>" +
			`<img src="${sticker.url}" alt="Какой-то стикер">` +
			"</li>");
	});
	
	$('.sticker-modal__list li img').click(function (event) {
		addStickerToChat($(event.target).attr("src"));
		stickerModal.removeClass('-active');
		overlay.removeClass('-active');
	});

	function preparePositionClass() {
		let msgPositionClass = '';

		if (msgNumber % 2 == 0) {
			msgPositionClass = '-to-right';
		} else {
			msgPositionClass = '-to-left';
		}

		return msgPositionClass;
	}

	function onAfterMessageSent() {
		chatList.animate({ scrollTop: chatList.prop("scrollHeight")}, 100);
		msgNumber++;
		input.focus();
	}

	function hideStickerModal() {
		overlay.removeClass('-active');
		stickerModal.removeClass('-active');
	}

	$('.image-viewer').click(function() {
		overlay.removeClass('hidden');
	})

	$("#file-input").change(function() {
		if (this.files && this.files[0]) { //Если выбран файл
			let reader = new FileReader(); // Создаеётся объект

			reader.onload = function(e) {
				addStickerToChat(e.target.result)
			}


			reader.readAsDataURL(this.files[0]);
		}
	});
});