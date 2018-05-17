;(function() {
	this.contextMenu = function() {
		_this = this;
		this.container = document.createElement('div');
		this.container.classList.add('context-menu');
		this.container.setAttribute('id', 'context-menu');

		this.visibleItems = 7;
		this.itemHeight = 30; // CSS value

		var defaultParams = {
			target: null,
			items: []
		}

		if (arguments[0] && typeof arguments[0] === "object") {
			this.menuParams = extendDefaults(defaultParams, arguments[0]);
		}
		else this.menuParams = defaults;

		buildMenu.call(this);

		this.list = document.querySelector('#context-menu .list');

		Array.prototype.map.call(document.querySelectorAll(this.menuParams.target), function(item) {
			item.addEventListener('contextmenu', function(event) {
				event = event || window.event;
				event.preventDefault();
				contextMenu.prototype.open.call(_this, event);
			});
		}.bind(this));

		document.addEventListener('click', clickOutMenu.bind(this));

		if(this.menuParams.items.length > this.visibleItems) {
			document.getElementById('top-arrow').addEventListener('click', topScroll.bind(this));
			document.getElementById('bottom-arrow').addEventListener('click', bottomScroll.bind(this));
		}
		document.querySelector('#context-menu .list').addEventListener('scroll', scrollHandle.bind(this));
	}

	// Public methods
	contextMenu.prototype.open = function(event) {
		event = event || window.event;
		event.preventDefault();

		var position = menuPosition.call(this, event);

		this.container.style.top = position.top + 'px';
		this.container.style.left = position.left + 'px';

		this.container.classList.add('opened');
		this.list.scrollTop = 0;
		document.querySelector('#context-menu #top-arrow').classList.remove('visible');
	}

	contextMenu.prototype.close = function(event) {
		event = event || window.event;
		event.preventDefault();
		this.container.classList.remove('opened');
	}

	// Private methods
	function buildMenu() {
		var _this = this;
		var list = document.createElement('ul');
		var li;

		list.classList.add('list');
		list.style.maxHeight = (this.itemHeight * this.visibleItems) + 'px';
		this.container.style.maxHeight = (this.itemHeight * this.visibleItems) + 20 + 'px'; // 20 - CSS offset (10 - top, 10 - bottom)

		this.menuParams.items.map(function(item, i) {
			li = document.createElement('li');
			li.innerHTML = item.title;
			if(item.disabled) {
				li.classList.add('disabled');
			}
			else {
				li.classList.add('enabled');
				if(item.subitems) {
					li.classList.add('sub');
					var subli;
					var	sublist = document.createElement('ul');
					sublist.style.top = (i * _this.itemHeight) + 10 + 'px'; // 10 - CSS offset container
					sublist.classList.add('sublist');
					item.subitems.map(function(subitem) {
						subli = document.createElement('li');
						subli.innerHTML = subitem.title;
						if(subitem.disabled) {
							subli.classList.add('disabled');
						}
						else {
							subli.classList.add('enabled');
							if(subitem.callback && typeof subitem.callback === 'function') {
								subli.onclick = function(event) {
									subitem.callback();
									contextMenu.prototype.close.call(_this, event);
								};
							}
							else {
								subli.onclick = function(event) {
									contextMenu.prototype.close.call(_this, event);
								}
							}
						}
						sublist.appendChild(subli);
					});

					li.appendChild(sublist);
				}
				else {
					if(item.callback && typeof item.callback === 'function') {
						li.onclick = function(event) {
							item.callback();
							contextMenu.prototype.close.call(_this, event);
						};
					}
					else {
						li.onclick = function(event) {
							contextMenu.prototype.close.call(_this, event);
						}
					}
				}
			}
			list.appendChild(li);
		});

		this.container.appendChild(list);

		if(this.menuParams.items.length > this.visibleItems) {
			var topArrow = document.createElement('div');
			topArrow.classList.add('arrow'); 		// Кожен клас додається окремо через IE,
			topArrow.classList.add('top-arrow');	// він бачить тільки перший аргумент
			topArrow.setAttribute('id', 'top-arrow');
			this.container.insertBefore(topArrow, this.container.childNodes[0]);

			var bottomArrow = document.createElement('div');
			bottomArrow.classList.add('arrow');
			bottomArrow.classList.add('bottom-arrow');
			bottomArrow.classList.add('visible');
			bottomArrow.setAttribute('id', 'bottom-arrow');
			this.container.appendChild(bottomArrow);
		}

		document.body.appendChild(this.container);
	}

	function clickOutMenu(event) {
		event = event || window.event;
		var targetElement = event.target;

		do {
			if (targetElement == this.container) return;
			targetElement = targetElement.parentNode;
		}
		while(targetElement);

		contextMenu.prototype.close.call(this, event);
	}

	function menuPosition(event) {
		var left, top;
		var windowWidth = document.documentElement.clientWidth;
		var windowHeight = document.documentElement.clientHeight;

		if((windowWidth - event.clientX) < this.list.offsetWidth) {
			left = event.clientX - this.list.offsetWidth;
		}
		else left = event.clientX;

		if((windowHeight - event.clientY) < this.container.offsetHeight) {
			top = event.clientY - this.container.offsetHeight;
		}
		else top = event.clientY;

		return {
			top: top,
			left: left
		}
	}

	function bottomScroll() {
		this.list.scrollTop = this.list.scrollTop + this.itemHeight;
	}

	function topScroll() {
		this.list.scrollTop = this.list.scrollTop - this.itemHeight;
	}

	function scrollHandle() {
		var maxScrollTop = this.list.scrollHeight - this.list.clientHeight;
		if(this.list.scrollTop === maxScrollTop) {
			document.getElementById('bottom-arrow').classList.remove('visible');
		}
		else {
			document.getElementById('bottom-arrow').classList.add('visible');
		}
		if(this.list.scrollTop === 0) {
			document.getElementById('top-arrow').classList.remove('visible');
		}
		else {
			document.getElementById('top-arrow').classList.add('visible');
		}

	}

	function extendDefaults(source, properties) {
		var property;
		for (property in properties) {
			if (properties.hasOwnProperty(property)) {
				source[property] = properties[property];
			}
		}
		return source;
	}
}());

var subItems = [
	{title: 'Квартири'},
	{title: 'Кімнати'},
	{title: 'Гаражі'},
	{title: 'Ділянки'},
	{title: 'Оренда'},
];

var menuItems = [
	{title: 'Всі розділи'},
	{title: 'Нерухомiсть', subitems: subItems},
	{title: 'Будiвництво (callback)', callback: function() {alert('ok')}},
	{title: 'Транспорт (disabled)', disabled: true},
	{title: 'Запчастини та СТО', subitems: subItems},
	{title: 'Робота та навчання'},
	{title: 'Меблі та освітлення'},
	{title: 'Техніка комп\'ютерна'},
	{title: 'Урочистості, краса, здоров\'я'},
	{title: 'Повiдомлення'},
	{title: 'Інше для побуту'},
	{title: 'Інші послуги'}
];

var menu = new contextMenu({
	target: 'body',
	items: menuItems
});
