;(function() {
	this.contextMenu = function() {

		this.container = document.createElement('div');
		this.container.classList.add('context-menu');
		this.container.setAttribute('id', 'context-menu');

		var defaultParams = {
			target: null,
			items: []
		}

		if (arguments[0] && typeof arguments[0] === "object") {
			this.menuParams = extendDefaults(defaultParams, arguments[0]);
		}
		else this.menuParams = defaults;

		buildMenu.call(this);

		Array.prototype.map.call(document.querySelectorAll(this.menuParams.target), function(item) {
			item.addEventListener('contextmenu', contextMenu.prototype.open.bind(this));
		}.bind(this));
		document.addEventListener('click', clickOutMenu.bind(this));
	}

	// Public methods
	contextMenu.prototype.open = function(event) {
		event.preventDefault();

		this.container.style.top = event.clientY + 'px';
		this.container.style.left = event.clientX + 'px';

		this.container.classList.add('opened');
	}

	contextMenu.prototype.close = function() {
		event.preventDefault();
		this.container.classList.remove('opened');
	}

	// Private methods
	function buildMenu() {

		var list = document.createElement('ul');
		list.classList.add('list');

		this.menuParams.items.map(function(item) {
			var li = document.createElement('li');
			li.innerHTML = item.title;
			list.appendChild(li);
		});

		this.container.appendChild(list);
		document.body.appendChild(this.container);
	}

	function clickOutMenu() {
		var menuElement = document.getElementById('context-menu');
		var targetElement = event.target;

		do {
			if (targetElement == menuElement) return;
			targetElement = targetElement.parentNode;
		}
		while(targetElement);

		contextMenu.prototype.close.call(this);
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

var menuItems = [
	{title: 'Всі розділи'},
	{title: 'Нерухомiсть'},
	{title: 'Будiвництво та ремонт'},
	{title: 'Транспорт'},
	{title: 'Запчастини та СТО'},
	{title: 'Робота та навчання'},
	{title: 'Меблі та освітлення'},
	{title: 'Техніка комп\'ютерна'},
	{title: 'Урочистості, краса, здоров\'я'},
	{title: 'Повiдомлення'},
	{title: 'Інше для побуту'},
	{title: 'Інші послуги'}
]

var menu = new contextMenu({
	target: '.action-btn',
	items: menuItems
});
