window.onload = async function()
{
	const OrdersData = await fetch("http://localhost:80/api/Orders", {
		method: 'GET'
	});
	const Orders = await OrdersData.json();
	document.getElementsByClassName("text-up-order")[0].innerHTML = "Orders (" + Orders.length + ")";
	if (Orders.length === 0) // if no Orders
	{
		let rightColumnNull = document.getElementsByClassName("right-column-wo-header");
		rightColumnNull[0].classList.remove("display-none");
		rightColumnNull[0].innerHTML = "No orders";
		rightColumnNull[0].style.paddingTop = 25 + "%";
		rightColumnNull[0].style.paddingLeft = 47 + "%";
	}
	else
	{
		for (let i = 0; i < Orders.length; i++)
		{
			OrderGeneration(i, Orders);
		}
		let click = document.getElementsByClassName("order");
		let orderNum = document.getElementsByClassName("order-num");

		let hash = Number((location.search).substr(4));
		let startNum = 0;
		for (let h = 0; h < click.length; h++)
		{
			if (hash === Number(orderNum[h].innerText.substr(6)))
				startNum = h;
		}
		GenerateInfo(Orders, startNum, click, orderNum);
		for(let value = 0; value < orderNum.length; value++)
		{
			click[value].addEventListener("click", () => { GenerateInfo(Orders, value, click, orderNum); });
		}
		//generation block with no info for orders
		let orders1 = document.getElementsByClassName("orders");
		let order1 = document.createElement("div");
		order1.innerHTML = "Ничего не найдено";
		order1.classList.add("display-none");
		order1.classList.add("nothing-to-find-order");
		order1.style.textAlign = "center";
		orders1[0].appendChild(order1);
	}
}
//------orders generation-----------------------------------------------------------------------------------------------
function OrderGeneration(i, Orders)
{
	let orders = document.getElementsByClassName("orders");

	let order = document.createElement("div");
	order.classList.add("order");

	let leftNumDate = document.createElement("div");
	leftNumDate.classList.add("left-num-date");

	let orderNum = document.createElement("div");
	orderNum.classList.add("order-num");
	orderNum.innerHTML = "Order " + Orders[i].id;
	let orderDate = document.createElement("div");
	orderDate.classList.add("order-date");
	orderDate.innerHTML = Orders[i].summary.createdAt;

	let leftOrderInfo = document.createElement("div");
	leftOrderInfo.classList.add("left-order-info");

	let orderShipped = document.createElement("div");
	orderShipped.classList.add("order-shipped");
	orderShipped.innerHTML = "<p>" + Orders[i].summary.customer + "</p><p>Shipped: " + Orders[i].summary.shippedAt + "</p>";
	let status = document.createElement("div");
	status.classList.add("status");
	status.innerHTML =  Orders[i].summary.status;


	leftOrderInfo.appendChild(orderShipped);
	leftOrderInfo.appendChild(status);

	leftNumDate.appendChild(orderNum);
	leftNumDate.appendChild(orderDate);

	order.appendChild(leftNumDate);
	order.appendChild(leftOrderInfo);

	orders[0].appendChild(order);
}

async function GenerateInfo(Orders, value, click, orderNum)
{
	
	// let click = document.getElementsByClassName("order");
	// let orderNum = document.getElementsByClassName("order-num");
	// for(let value = 0; value < orderNum.length; value++)
	// {
	// 		function OrdersClick()
	// 		{
				if(document.getElementsByClassName("nothing-to-find-item-pc"))
				{
					while(document.getElementsByClassName("nothing-to-find-item-pc")[0])
						document.getElementsByClassName("nothing-to-find-item-pc")[0].remove();
				}

				let i = 0;
				let numPr = 0;
				for (let c = 0; c < Orders.length; c++)
				{
					if(Orders[c].id === Number(orderNum[value].innerText.substr(6)))
					{
						numPr = Orders[c].id;
						i = c;
						break;
					}
				}

				//default filters when we switch between orders
				let edit = document.getElementsByClassName("edit-ship");
				edit[0].classList.remove("display-none");
				let display = document.getElementsByClassName("display-ship");
				display[0].classList.add("display-none");
				let edit2 = document.getElementsByClassName("edit-cust");
				edit2[0].classList.remove("display-none");
				let display2 = document.getElementsByClassName("display-cust");
				display2[0].classList.add("display-none");

				clickSortProducts = 1;
				clickSortUnitPrice = 1;
				clickSortQuantity = 1;
				clickSortTotalPrice = 1;

				input = document.getElementById("search-items-pc");
				input.value = "";
				input = document.getElementById("search-items-phone");
				input.value = "";

				ShippingAdress();
				history.pushState({}, document.title, window.location.pathname + `?id=${Orders[i].id}`);

				//selection orders
				click[value].classList.add("back-gr-clr-border");
				for (let x = 0; x <= value; x++)
				{
					if (x === value)
					{
						for (let y = value + 1; y < Orders.length; y++)
						{
							if(click[y])
							{
								click[y].classList.remove("back-gr-clr-border");
							}
						}
						break;
					}
					click[x].classList.remove("back-gr-clr-border");
				}

				//order info generation----------------------------------------------------------------------------------------------
				document.getElementsByClassName("right-column-wo-header")[0].classList.remove("display-none");
				document.getElementsByClassName("left-price")[0].innerHTML = "Order " + Orders[i].id;
				const ProductsData = await fetch(`http://localhost:80/api/Orders/${numPr}/products`, {
					method: 'GET'
				});
				const Prod = await ProductsData.json();

				if(Prod.length == 0)
				{
					let twoBlockItem = document.getElementsByClassName("two-blocks-items-1")[0];
					let twoBlockItem2 = document.getElementsByClassName("two-blocks-items-2")[0];
					let noInfoItem = document.createElement("div");
					noInfoItem.innerHTML = "Ничего не найдено";
					noInfoItem.classList.add("nothing-to-find-item-pc");
					noInfoItem.style.textAlign = "center";
					let noInfoItem2 = document.createElement("div");
					noInfoItem2.innerHTML = "Ничего не найдено";
					noInfoItem2.classList.add("nothing-to-find-item-pc");
					noInfoItem2.style.textAlign = "center";
					twoBlockItem.appendChild(noInfoItem);
					twoBlockItem2.appendChild(noInfoItem2);
				}

				let totalPrice = 0;
				for(let l = 0; l < Prod.length; l++)
				{
					totalPrice += Number(Prod[l].totalPrice);
				}
				document.getElementsByClassName("price")[0].innerHTML = totalPrice + "<br><p class='eur'>EUR</p>";
				document.getElementsByClassName("ordered-shipped")[0].innerHTML = 
				"Customer: " + Orders[i].summary.customer + "<br>" + 
				"Ordered: " + Orders[i].summary.createdAt + "<br>" + 
				"Shipped: " + Orders[i].summary.shippedAt;				

				//'shipTo' generation(for PC - [0], and phones - [1])----------
				document.getElementsByClassName("name")[0].innerHTML = "<input class='input-info input-ship' maxlength='15' readonly value='" + Orders[i].shipTo.name + "'/>";
				document.getElementsByClassName("street")[0].innerHTML = "<input id='cust-address' class='input-info input-ship' maxlength='30' readonly value='" + Orders[i].shipTo.address + "'/>";
				document.getElementsByClassName("zip-code")[0].innerHTML = "<input class='input-info input-ship' maxlength='10' readonly value='" + Orders[i].shipTo.ZIP + "'/>";
				document.getElementsByClassName("region")[0].innerHTML = "<input id='cust-region' class='input-info input-ship' maxlength='15' readonly value='" + Orders[i].shipTo.region + "'/>";
				document.getElementsByClassName("country")[0].innerHTML = "<input id='cust-country' class='input-info input-ship' maxlength='15' readonly value='" + Orders[i].shipTo.country + "'/>";
				document.getElementsByClassName("name")[1].innerHTML = "<input class='input-info input-ship-phone' maxlength='15' readonly value='" + Orders[i].shipTo.name + "'/>";
				document.getElementsByClassName("street")[1].innerHTML = "<input class='input-info input-ship-phone' maxlength='30' readonly value='" + Orders[i].shipTo.address + "'/>";
				document.getElementsByClassName("zip-code")[1].innerHTML = "<input class='input-info input-ship-phone' maxlength='10' readonly value='" + Orders[i].shipTo.ZIP + "'/>";
				document.getElementsByClassName("region")[1].innerHTML = "<input class='input-info input-ship-phone' maxlength='15' readonly value='" + Orders[i].shipTo.region + "'/>";
				document.getElementsByClassName("country")[1].innerHTML = "<input class='input-info input-ship-phone' maxlength='15' readonly value='" + Orders[i].shipTo.country + "'/>";

				document.getElementsByClassName("first-name")[0].innerHTML = "<input class='input-info input-cust' maxlength='15' readonly value='" + Orders[i].customerInfo.firstName + "'/>";
				document.getElementsByClassName("last-name")[0].innerHTML = "<input class='input-info input-cust' maxlength='20' readonly value='" + Orders[i].customerInfo.lastName + "'/>";
				document.getElementsByClassName("address")[0].innerHTML = "<input class='input-info input-cust' maxlength='30' readonly value='" + Orders[i].customerInfo.address + "'/>";
				document.getElementsByClassName("phone")[0].innerHTML = "<input class='input-info input-cust' maxlength='20' readonly value='" + Orders[i].customerInfo.phone + "'/>";
				document.getElementsByClassName("email")[0].innerHTML = "<input class='input-info input-cust' maxlength='30' readonly value='" + Orders[i].customerInfo.email + "'/>";
				document.getElementsByClassName("first-name")[1].innerHTML = "<input class='input-info input-cust-phone' maxlength='15' readonly value='" + Orders[i].customerInfo.firstName + "'/>";
				document.getElementsByClassName("last-name")[1].innerHTML = "<input class='input-info input-cust-phone' maxlength='20' readonly value='" + Orders[i].customerInfo.lastName + "'/>";
				document.getElementsByClassName("address")[1].innerHTML = "<input class='input-info input-cust-phone' maxlength='30' readonly value='" + Orders[i].customerInfo.address + "'/>";
				document.getElementsByClassName("phone")[1].innerHTML = "<input class='input-info input-cust-phone' maxlength='20' readonly value='" + Orders[i].customerInfo.phone + "'/>";
				document.getElementsByClassName("email")[1].innerHTML = "<input class='input-info input-cust-phone' maxlength='30' readonly value='" + Orders[i].customerInfo.email + "'/>";

				//items generation(products-1 - PC, products-2 - phones)--------------
				let arrayProducts = document.getElementsByClassName("products-1");
				if (arrayProducts.length != 0)
				{
					arrayProducts[0].remove(); //zeroing products, when changing orders
				}
				let arrayProducts2 = document.getElementsByClassName("products-2");
				if (arrayProducts2.length != 0)
				{
					arrayProducts2[0].remove();	//zeroing products, when changing orders
				}
				document.getElementsByClassName("line-items-1")[0].innerHTML = "Line items (" + Prod.length + ")";
				document.getElementsByClassName("line-items-2")[0].innerHTML = "Line items (" + Prod.length + ")";

				//generation head of items

				//PC
				let twoBlocks = document.getElementsByClassName("two-blocks-items-1");
				let products = document.createElement("div");
				products.classList.add("products-1");
				let header = document.createElement("div");
				header.classList.add("item-header-1");
				let product = document.createElement("div");
				product.classList.add("head-item-description-1");
				product.innerHTML = "Product <img src='svg/triangles.svg' class='sort-products'>";
				let unitPrice = document.createElement("div");
				unitPrice.classList.add("item-description-1");
				unitPrice.innerHTML = "Unit Price <img src='svg/triangles.svg' class='sort-price'>";
				let quantity = document.createElement("div");
				quantity.classList.add("item-description-1");
				quantity.innerHTML = "Quantity <img src='svg/triangles.svg' class='sort-quantity'>";
				let total = document.createElement("div");
				total.classList.add("item-description-1");
				total.innerHTML = "Total <img src='svg/triangles.svg' class='sort-total'>";
				let del = document.createElement("div");
				del.classList.add("item-description-1");
				header.appendChild(product);
				header.appendChild(unitPrice);
				header.appendChild(quantity);
				header.appendChild(total);
				header.appendChild(del);
				products.appendChild(header);

				//generation block with no info for items PC
				let noInfoItem = document.createElement("div");
				noInfoItem.innerHTML = "Ничего не найдено";
				noInfoItem.classList.add("display-none");
				noInfoItem.classList.add("nothing-to-find-item-pc");
				noInfoItem.style.textAlign = "center";
				products.appendChild(noInfoItem);

				//phones
				let twoBlock2 = document.getElementsByClassName("two-blocks-items-2");
				let products2 = document.createElement("div");
				products2.classList.add("products-2");
				let itemHeader2 = document.createElement("div");
				itemHeader2.classList.add("item-header-2");
				itemHeader2.innerHTML = "Product";
				products2.appendChild(itemHeader2);

				//generation block with no info for items phone
				let noInfoItem2 = document.createElement("div");
				noInfoItem2.innerHTML = "Ничего не найдено";
				noInfoItem2.classList.add("display-none");
				noInfoItem2.classList.add("nothing-to-find-item-phone");
				noInfoItem2.style.textAlign = "center";
				products2.appendChild(noInfoItem2);

				//generation items(for PC and phone)
				for(let d = 0; d < Prod.length; d++)
				{	
					//PC
					let items = document.createElement("div");
					items.classList.add("item-1");
					let headItem = document.createElement("div");
					headItem.classList.add("head-item-description-1");
					let itemPrice = document.createElement("div");
					itemPrice.classList.add("item-description-1");
					itemPrice.classList.add("item-price-sort");
					let itemQuantity = document.createElement("div");
					itemQuantity.classList.add("item-description-1");
					itemQuantity.classList.add("item-quantity-sort");
					let itemTotalPrice = document.createElement("div");
					itemTotalPrice.classList.add("item-description-1");
					itemTotalPrice.classList.add("item-total-price-sort");
					let delItem = document.createElement("div");
					delItem.classList.add("item-description-1");
					headItem.innerHTML = "<b>" + Prod[d].name + "</b><br>" + Prod[d].id;
					itemPrice.innerHTML = "<b>" + Prod[d].price + "</b> " + Prod[d].currency;
					itemQuantity.innerHTML = Prod[d].quantity;
					itemTotalPrice.innerHTML = "<b>" + Prod[d].totalPrice + "</b> " + Prod[d].currency;
					delItem.innerHTML = `<div style='align-items: center'><img title='удалить продукт' class='svg-delete-item item-delete-${Prod[d].id}' src='svg/delete-item.svg' onclick='deleteItem(this)'></div>`;
					items.appendChild(headItem);
					items.appendChild(itemPrice);
					items.appendChild(itemQuantity);
					items.appendChild(itemTotalPrice);
					items.appendChild(delItem);
					products.appendChild(items);
					twoBlocks[0].appendChild(products);

					//phones
					let item2 = document.createElement("div");
					item2.classList.add("item-2");
					let delItem2 = document.createElement("div");
					delItem2.classList.add("item-description-2");
					delItem2.innerHTML = `<div style='align-items: center'><img title='удалить продукт' class='svg-delete-item item-delete-${Prod[d].id}' src='svg/delete-item.svg' onclick='deleteItem(this)'></div>`;
					let itemDescription1 = document.createElement("div");
					itemDescription1.classList.add("item-description-2");
					itemDescription1.innerHTML = "<div><b>" + Prod[d].name + "</b></div>" + 
					"<div>" + Prod[d].id + "</div>";
					let itemDescription2 = document.createElement("div");
					itemDescription2.classList.add("item-description-2");
					itemDescription2.innerHTML = "<div>Unit Price:</div>" + "<div><b>" + Prod[d].price + "</b> " + 
					Prod[d].currency + "</div>";
					let itemDescription3 = document.createElement("div");
					itemDescription3.classList.add("item-description-2");
					itemDescription3.innerHTML = "<div>Quantity:</div>" + "<div>" + Prod[d].quantity + "</div>"
					let itemDescription4 = document.createElement("div");
					itemDescription4.classList.add("item-description-2");
					itemDescription4.innerHTML = "<div>Total:</div>" +  "<div><b>" + Prod[d].totalPrice + "</b> " + 
					Prod[d].currency + "</div>";
					item2.appendChild(delItem2);
					item2.appendChild(itemDescription1);
					item2.appendChild(itemDescription2);
					item2.appendChild(itemDescription3);
					item2.appendChild(itemDescription4);
					products2.appendChild(item2);
					twoBlock2[0].appendChild(products2);
				}
				if(document.getElementsByClassName("sort-products")[0])
				{
					document.getElementsByClassName("sort-products")[0].addEventListener("click", sortProducts);
				}
				if(document.getElementsByClassName("sort-price")[0])
				{
					document.getElementsByClassName("sort-price")[0].addEventListener("click", sortUnitPrice);
				}
				if(document.getElementsByClassName("sort-quantity")[0])
				{
					document.getElementsByClassName("sort-quantity")[0].addEventListener("click", sortQuantity);
				}
				if(document.getElementsByClassName("sort-total")[0])
				{
					document.getElementsByClassName("sort-total")[0].addEventListener("click", sortTotalPrice);
				}
				
	// 		}
	// 	click[value].addEventListener("click", OrdersClick);
	// }
}

//-----searching(function names speak for themselves)------------------------------------------------------------------------------------------------------

	async function searchOrders()
	{
		document.getElementsByClassName("nothing-to-find-order")[0].classList.add("display-none");
		for(let k = 0; k < document.getElementsByClassName("order").length; k++)
		{
			document.getElementsByClassName("order")[k].classList.add("display-none");
		}
		let preloader = document.getElementById("preloader");
		preloader.style.display = "block";
		const OrdersData = await fetch("http://localhost:80/api/Orders", {
			method: 'GET'
		});
		const Orders = await OrdersData.json();

		let input, filter, childOrders;
		input = document.getElementById("search-orders");
		filter = input.value.toUpperCase();
		childOrders = document.getElementsByClassName("order");
		let count = 0;

		while (childOrders[0]) {
			childOrders[0].remove();
		}

		//searching and generating orders
		for (let i = 0; i < Orders.length; i++)
		{
			if (Orders[i].summary.createdAt.toUpperCase().indexOf(filter) > -1 ||
				Orders[i].summary.customer.toUpperCase().indexOf(filter) > -1 ||
				Orders[i].summary.status.toUpperCase().indexOf(filter) > -1 ||
				Orders[i].summary.shippedAt.toUpperCase().indexOf(filter) > -1 ||
				String(Orders[i].id).indexOf(filter) > -1)
			{
				OrderGeneration(i, Orders);
				count++;
			}
		}

		let click = document.getElementsByClassName("order");
		let orderNum = document.getElementsByClassName("order-num");
		for(let value = 0; value < orderNum.length; value++)
		{
			click[value].addEventListener("click", () => { GenerateInfo(Orders, value, click, orderNum) });
		}
		if (count === 0)
		{
			let noOrder = document.getElementsByClassName("nothing-to-find-order");
			noOrder[0].classList.remove("display-none");
		}
		else
		{
			let noOrder = document.getElementsByClassName("nothing-to-find-order");
			noOrder[0].classList.add("display-none");		
		}
		document.getElementsByClassName("text-up-order")[0].innerHTML = "Orders (" + count + ")";

		preloader.style.display = "none";
	}

	
	async function serachItemsPC()
	{
		let input, filter, childItems;
		input = document.getElementById("search-items-pc");
		filter = input.value.toUpperCase();
		childItems = document.getElementsByClassName("item-1");
		let count = 0;

		//check the switched order
		let orderCheck = document.getElementsByClassName("order");
		let orderNum = document.getElementsByClassName("order-num");
		let num = Number(document.getElementsByClassName("left-price")[0].innerText.substr(6));
		const ProductsData = await fetch(`http://localhost:80/api/Orders/${num}/products`, {
			method: 'GET'
		});
		const Prod = await ProductsData.json();
		let items = document.getElementsByClassName("item-1");
		while (items[0]) {
			items[0].remove();
		}
		for(let d = 0; d < Prod.length; d++)
		{
			if (String(Prod[d].id).indexOf(filter) > -1 ||
				Prod[d].name.toUpperCase().indexOf(filter) > -1 ||
				String(Prod[d].price).indexOf(filter) > -1 ||
				String(Prod[d].currency).indexOf(filter) > -1 || 
				String(Prod[d].quantity).indexOf(filter) > -1 ||
				String(Prod[d].totalPrice).indexOf(filter) > -1)
			{
				let products = document.getElementsByClassName("products-1");
				let items = document.createElement("div");
				items.classList.add("item-1");
				let headItem = document.createElement("div");
				headItem.classList.add("head-item-description-1");
				let itemPrice = document.createElement("div");
				itemPrice.classList.add("item-description-1");
				itemPrice.classList.add("item-price-sort");
				let itemQuantity = document.createElement("div");
				itemQuantity.classList.add("item-description-1");
				itemQuantity.classList.add("item-quantity-sort");
				let itemTotalPrice = document.createElement("div");
				itemTotalPrice.classList.add("item-description-1");
				itemTotalPrice.classList.add("item-total-price-sort");
				let delItem = document.createElement("div");
				delItem.classList.add("item-description-1");
				headItem.innerHTML = "<b>" + Prod[d].name + "</b><br>" + Prod[d].id;
				itemPrice.innerHTML = "<b>" + Prod[d].price + "</b> " + Prod[d].currency;
				itemQuantity.innerHTML = Prod[d].quantity;
				itemTotalPrice.innerHTML = "<b>" + Prod[d].totalPrice + "</b> " + Prod[d].currency;
				delItem.innerHTML = `<div style='align-items: center'><img title='удалить продукт' class='svg-delete-item item-delete-${Prod[d].id}' src='svg/delete-item.svg' onclick='deleteItem(this)'></div>`;
				items.appendChild(headItem);
				items.appendChild(itemPrice);
				items.appendChild(itemQuantity);
				items.appendChild(itemTotalPrice);
				items.appendChild(delItem);
				products[0].appendChild(items);

				count++;
			}
		}

		if (count === 0)
		{
			let noItem = document.getElementsByClassName("nothing-to-find-item-pc");
			noItem[0].classList.remove("display-none");
		}
		else
		{
			let noItem = document.getElementsByClassName("nothing-to-find-item-pc");
			noItem[0].classList.add("display-none");		
		}
		document.getElementsByClassName("line-items-1")[0].innerHTML = "Line items (" + count + ")";

		//default filters when we searching
		document.getElementsByClassName("head-item-description-1")[0].innerHTML = "Product <img src='svg/triangles.svg' class='sort-products'>";
		document.getElementsByClassName("item-description-1")[0].innerHTML = "Unit Price <img src='svg/triangles.svg' class='sort-price'>";
		document.getElementsByClassName("item-description-1")[1].innerHTML = "Quantity <img src='svg/triangles.svg' class='sort-quantity'>";
		document.getElementsByClassName("item-description-1")[2].innerHTML = "Total <img src='svg/triangles.svg' class='sort-total'>";
		document.getElementsByClassName("sort-products")[0].addEventListener("click", sortProducts);
		document.getElementsByClassName("sort-price")[0].addEventListener("click", sortUnitPrice);
		document.getElementsByClassName("sort-quantity")[0].addEventListener("click", sortQuantity);
		document.getElementsByClassName("sort-total")[0].addEventListener("click", sortTotalPrice);
		clickSortProducts = 1;
		clickSortUnitPrice = 1;
		clickSortQuantity = 1;
		clickSortTotalPrice = 1;
	}


	async function searchItemsPhone()
	{
		let input, filter, childItems;
		input = document.getElementById("search-items-phone");
		filter = input.value.toUpperCase();
		childItems = document.getElementsByClassName("item-2");
		let count = 0;

		//check the switched order
		let orderCheck = document.getElementsByClassName("order");
		let orderNum = document.getElementsByClassName("order-num");
		let num = Number(document.getElementsByClassName("left-price")[0].innerText.substr(6));
		const ProductsData = await fetch(`http://localhost:80/api/Orders/${num}/products`, {
			method: 'GET'
		});
		const Prod = await ProductsData.json();
		//searching and generating items phone
		let items = document.getElementsByClassName("item-2");
		while (items[0]) {
			items[0].remove();
		}
		for(let d = 0; d < Prod.length; d++)
		{
			if (String(Prod[d].id).indexOf(filter) > -1 ||
				Prod[d].name.toUpperCase().indexOf(filter) > -1 ||
				String(Prod[d].price).indexOf(filter) > -1 ||
				String(Prod[d].currency).indexOf(filter) > -1 || 
				String(Prod[d].quantity).indexOf(filter) > -1 ||
				String(Prod[d].totalPrice).indexOf(filter) > -1)
			{
				let products2 = document.getElementsByClassName("products-2");
				let item2 = document.createElement("div");
				item2.classList.add("item-2");
				let itemDescription1 = document.createElement("div");
				itemDescription1.classList.add("item-description-2");
				itemDescription1.innerHTML = "<div><b>" + Prod[d].name + "</b></div>" + 
				"<div>" + Prod[d].id + "</div>";
				let itemDescription2 = document.createElement("div");
				itemDescription2.classList.add("item-description-2");
				itemDescription2.innerHTML = "<div>Unit Price:</div>" + "<div><b>" + Prod[d].price + "</b> " + 
				Prod[d].currency + "</div>";
				let itemDescription3 = document.createElement("div");
				itemDescription3.classList.add("item-description-2");
				itemDescription3.innerHTML = "<div>Quantity:</div>" + "<div>" + Prod[d].quantity + "</div>"
				let itemDescription4 = document.createElement("div");
				itemDescription4.classList.add("item-description-2");
				itemDescription4.innerHTML = "<div>Total:</div>" +  "<div><b>" + Prod[d].totalPrice + "</b> " + 
				Prod[d].currency + "</div>";
				item2.appendChild(itemDescription1);
				item2.appendChild(itemDescription2);
				item2.appendChild(itemDescription3);
				item2.appendChild(itemDescription4);
				products2[0].appendChild(item2);

				count++;
			}
		}
		if (count === 0)
		{
			let noItem = document.getElementsByClassName("nothing-to-find-item-phone");
			noItem[0].classList.remove("display-none");
		}
		else
		{
			let noItem = document.getElementsByClassName("nothing-to-find-item-phone");
			noItem[0].classList.add("display-none");		
		}
		document.getElementsByClassName("line-items-2")[0].innerHTML = "Line items (" + count + ")";
	}
document.getElementById("img-search").addEventListener("click", searchOrders);
document.getElementById("img-search-1").addEventListener("click", serachItemsPC);
document.getElementById("img-search-2").addEventListener("click", searchItemsPhone);


//----switch between 'Shipping address and Customer info-----------------------------------------------------------------------------------------------
function ShippingAdress()
{
	//PC
	let elem1 = document.getElementsByClassName("shopping");
	elem1[0].classList.remove("display-none");
	let elem2 = document.getElementsByClassName("customer");
	elem2[0].classList.add("display-none");
	let backGrClrCar = document.getElementsByClassName("svg-car");
	backGrClrCar[0].classList.add("back-gr-clr");
	let borderBttmCar = document.getElementsByClassName("border-svg-car");
	borderBttmCar[0].classList.add("brdr-bottom");
	let backGrClrMan = document.getElementsByClassName("svg-man");
	backGrClrMan[0].classList.remove("back-gr-clr");
	let borderBttmMan = document.getElementsByClassName("border-svg-man");
	borderBttmMan[0].classList.remove("brdr-bottom");

	//phones
	let elem11 = document.getElementsByClassName("shopping");
	elem11[1].classList.remove("display-none");
	let elem22 = document.getElementsByClassName("customer");
	elem22[1].classList.add("display-none");
	let backGrClrCar1 = document.getElementsByClassName("svg-car");
	backGrClrCar1[0].classList.add("back-gr-clr");
	let borderBttmCar1 = document.getElementsByClassName("border-svg-car");
	borderBttmCar1[0].classList.add("brdr-bottom");
	let backGrClrMan1 = document.getElementsByClassName("svg-man");
	backGrClrMan1[0].classList.remove("back-gr-clr");
	let borderBttmMan1 = document.getElementsByClassName("border-svg-man");
	borderBttmMan1[0].classList.remove("brdr-bottom");

	//special for map
	let elem3 = document.getElementsByClassName("map");
	elem3[0].classList.add("display-none");
	let backGrClrMap = document.getElementsByClassName("svg-map");
	backGrClrMap[0].classList.remove("back-gr-clr");
	let borderBttmMap = document.getElementsByClassName("border-svg-map");
	borderBttmMap[0].classList.remove("brdr-bottom");
}

function CustomerInfo()
{
	//PC
	let elem1 = document.getElementsByClassName("shopping");
	elem1[0].classList.add("display-none");
	let elem2 = document.getElementsByClassName("customer");
	elem2[0].classList.remove("display-none");
	let backGrClrCar = document.getElementsByClassName("svg-car");
	backGrClrCar[0].classList.remove("back-gr-clr");
	let borderBttmCar = document.getElementsByClassName("border-svg-car");
	borderBttmCar[0].classList.remove("brdr-bottom");
	let backGrClrMan = document.getElementsByClassName("svg-man");
	backGrClrMan[0].classList.add("back-gr-clr");
	let borderBttmMan = document.getElementsByClassName("border-svg-man");
	borderBttmMan[0].classList.add("brdr-bottom");

	//phones
	let elem11 = document.getElementsByClassName("shopping");
	elem11[1].classList.add("display-none");
	let elem22 = document.getElementsByClassName("customer");
	elem22[1].classList.remove("display-none");
	let backGrClrCar1 = document.getElementsByClassName("svg-car");
	backGrClrCar1[0].classList.remove("back-gr-clr");
	let borderBttmCar1 = document.getElementsByClassName("border-svg-car");
	borderBttmCar1[0].classList.remove("brdr-bottom");
	let backGrClrMan1 = document.getElementsByClassName("svg-man");
	backGrClrMan1[0].classList.add("back-gr-clr");
	let borderBttmMan1 = document.getElementsByClassName("border-svg-man");
	borderBttmMan1[0].classList.add("brdr-bottom");

	//special for map
	let elem3 = document.getElementsByClassName("map");
	elem3[0].classList.add("display-none");
	let backGrClrMap = document.getElementsByClassName("svg-map");
	backGrClrMap[0].classList.remove("back-gr-clr");
	let borderBttmMap = document.getElementsByClassName("border-svg-map");
	borderBttmMap[0].classList.remove("brdr-bottom");

}

function MapClick()
{
	//PC
	let elem1 = document.getElementsByClassName("shopping");
	elem1[0].classList.add("display-none");
	let elem2 = document.getElementsByClassName("customer");
	elem2[0].classList.add("display-none");
	let backGrClrCar = document.getElementsByClassName("svg-car");
	backGrClrCar[0].classList.remove("back-gr-clr");
	let borderBttmCar = document.getElementsByClassName("border-svg-car");
	borderBttmCar[0].classList.remove("brdr-bottom");
	let backGrClrMan = document.getElementsByClassName("svg-man");
	backGrClrMan[0].classList.remove("back-gr-clr");
	let borderBttmMan = document.getElementsByClassName("border-svg-man");
	borderBttmMan[0].classList.remove("brdr-bottom");

	//phones
	let elem11 = document.getElementsByClassName("shopping");
	elem11[1].classList.add("display-none");
	let elem22 = document.getElementsByClassName("customer");
	elem22[1].classList.add("display-none");
	let backGrClrCar1 = document.getElementsByClassName("svg-car");
	backGrClrCar1[0].classList.remove("back-gr-clr");
	let borderBttmCar1 = document.getElementsByClassName("border-svg-car");
	borderBttmCar1[0].classList.remove("brdr-bottom");
	let backGrClrMan1 = document.getElementsByClassName("svg-man");
	backGrClrMan1[0].classList.remove("back-gr-clr");
	let borderBttmMan1 = document.getElementsByClassName("border-svg-man");
	borderBttmMan1[0].classList.remove("brdr-bottom");


	//special for map
	let elem3 = document.getElementsByClassName("map");
	elem3[0].classList.remove("display-none");
	let backGrClrMap = document.getElementsByClassName("svg-map");
	backGrClrMap[0].classList.add("back-gr-clr");
	let borderBttmMap = document.getElementsByClassName("border-svg-map");
	borderBttmMap[0].classList.add("brdr-bottom");
}
document.getElementsByClassName("border-svg-car")[0].addEventListener("click", ShippingAdress);
document.getElementsByClassName("border-svg-man")[0].addEventListener("click", CustomerInfo);
document.getElementsByClassName("border-svg-map")[0].addEventListener("click", MapClick);

//-----------genaration information for every order-------------------------------------------------------------------------------------------------


//media for sidebar: click appearance, when width of browser-window < 900px------------------------------------------------------------------------------------------
if (matchMedia) 
{
	let screen = window.matchMedia("(max-width: 900px)");
	screen.addListener(changes);
	changes(screen);
}
function changes(screen) 
{
	if (screen.matches)
	{
		//click on 3 blue lines(options) for appearance sidebar
		function ThreeBlueLines()
		{
			let leftColumn = document.getElementsByClassName("left-column");
			leftColumn[0].classList.add("left-column-width");
			leftColumn[0].style.position = "absolute";
			let leftFooter = document.getElementsByClassName("footer-left");
			leftFooter[0].classList.add("footer-width");
			let rightColumn = document.getElementsByClassName("right-column");
			rightColumn[0].classList.add("display-none");
		}
		//click on right-arrow for disappearance sidebar
		function RightArrow()
		{
			let leftColumn = document.getElementsByClassName("left-column");
			leftColumn[0].classList.remove("left-column-width");
			let leftFooter = document.getElementsByClassName("footer-left");
			leftFooter[0].classList.remove("footer-width");
			let rightColumn = document.getElementsByClassName("right-column");
			rightColumn[0].classList.remove("display-none");
		}
		document.getElementsByClassName("svg-text-lines")[0].addEventListener("click", ThreeBlueLines);
		document.getElementsByClassName("svg-right")[0].addEventListener("click", RightArrow);
	}
	else 
	{
		//return to norma, when width of browser-window > 900px
		let leftColumn = document.getElementsByClassName("left-column");
		leftColumn[0].classList.remove("left-column-width");
		leftColumn[0].style.position = "static";
		let leftFooter = document.getElementsByClassName("footer-left");
		leftFooter[0].classList.remove("footer-width");
		let rightColumn = document.getElementsByClassName("right-column");
		rightColumn[0].classList.remove("display-none");
	}
}

//-------sorting: bubble method--------------

//quantity of clicks:
var clickSortProducts = 1;
var clickSortUnitPrice = 1;
var clickSortQuantity = 1;
var clickSortTotalPrice = 1;


//sorting by name of products:
function sortProducts() 
{
	let headProducts = document.getElementsByClassName("head-item-description-1");
	let headOther = document.getElementsByClassName("item-description-1");
	clickSortUnitPrice = 1;
	clickSortQuantity = 1;
	clickSortTotalPrice = 1;
	let items = Array.from(document.getElementsByClassName("item-1"));
	let headers = Array.from(document.querySelectorAll(".item-1 .head-item-description-1"));
	let temp;
	if (clickSortProducts == 1)
	{
		for (let i = 0; i < items.length - 1; i++)
		{
			 for (let j = 0; j < items.length - i - 1; j++)
			 {
		 		if (headers[j].innerText.toLowerCase() > headers[j + 1].innerText.toLowerCase()) 
				{
			 		temp = headers[j];
			 		headers[j] = headers[j + 1];
			 		headers[j + 1] = temp;
			 		temp = items[j];
			 		items[j] = items[j + 1];
			 		items[j + 1] = temp;
			 	}
			 }		
		}
		for (let x = 0; x < items.length; x++)
		{
			items[x].style.order = x;
		}
		headProducts[0].innerHTML = "Product <img src='svg/up-arrow.svg' class='sort-products'>";
		headOther[0].innerHTML = "Unit Price <img src='svg/triangles.svg' class='sort-price'>";
		headOther[1].innerHTML = "Quantity <img src='svg/triangles.svg' class='sort-quantity'>";
		headOther[2].innerHTML = "Total <img src='svg/triangles.svg' class='sort-total'>";
	}
	if (clickSortProducts == 2)
	{
		for (let i = 0; i < items.length - 1; i++)
		{
			 for (let j = 0; j < items.length - i - 1; j++)
			 {
		 		if (headers[j].innerText.toLowerCase() > headers[j + 1].innerText.toLowerCase()) 
		 		{
			 		temp = headers[j];
			 		headers[j] = headers[j + 1];
			 		headers[j + 1] = temp;
			 		temp = items[j];
			 		items[j] = items[j + 1];
			 		items[j + 1] = temp;
			 	}
			 }		
		}
		for (let x = 0; x < items.length; x++)
		{
			items[x].style.order = items.length - x;
		}
		headProducts[0].innerHTML = "Product <img src='svg/down-arrow.svg' class='sort-products'>";
	}
	if (clickSortProducts == 3)
	{
		for (let x = 0; x < items.length; x++)
		{
			items[x].style.order = x;
		}
		clickSortProducts = 0;
		headProducts[0].innerHTML = "Product <img src='svg/triangles.svg' class='sort-products'>";
	}
	clickSortProducts++;
	document.getElementsByClassName("sort-products")[0].addEventListener("click", sortProducts);
	document.getElementsByClassName("sort-price")[0].addEventListener("click", sortUnitPrice);
	document.getElementsByClassName("sort-quantity")[0].addEventListener("click", sortQuantity);
	document.getElementsByClassName("sort-total")[0].addEventListener("click", sortTotalPrice);
}
//sorting by unit price of products:
function sortUnitPrice() 
{
	let headProducts = document.getElementsByClassName("head-item-description-1");
	let headOther = document.getElementsByClassName("item-description-1");
	clickSortProducts = 1;
	clickSortQuantity = 1;
	clickSortTotalPrice = 1;
	let items = Array.from(document.getElementsByClassName("item-1"));
	let price = Array.from(document.querySelectorAll(".item-1 .item-price-sort  b"));
	let temp;
	if (clickSortUnitPrice == 1)
	{
		for (let i = 0; i < items.length - 1; i++)
		{
			 for (let j = 0; j < items.length - i - 1; j++)
			 {
		 		if (Number(price[j].innerText) > Number(price[j + 1].innerText))
				{
			 		temp = price[j];
			 		price[j] = price[j + 1];
			 		price[j + 1] = temp;
			 		temp = items[j];
			 		items[j] = items[j + 1];
			 		items[j + 1] = temp;
			 	}
			 }		
		}
		for (let x = 0; x < items.length; x++)
		{
			items[x].style.order = x;
		}
		headOther[0].innerHTML = "Unit Price <img src='svg/up-arrow.svg' class='sort-price'>";
		headProducts[0].innerHTML = "Product <img src='svg/triangles.svg' class='sort-products'>";
		headOther[1].innerHTML = "Quantity <img src='svg/triangles.svg' class='sort-quantity'>";
		headOther[2].innerHTML = "Total <img src='svg/triangles.svg' class='sort-total'>";
	}
	if (clickSortUnitPrice == 2)
	{
		for (let i = 0; i < items.length - 1; i++)
		{
			 for (let j = 0; j < items.length - i - 1; j++)
			 {
		 		if (Number(price[j].innerText) > Number(price[j + 1].innerText)) 
		 		{
			 		temp = price[j];
			 		price[j] = price[j + 1];
			 		price[j + 1] = temp;
			 		temp = items[j];
			 		items[j] = items[j + 1];
			 		items[j + 1] = temp;
			 	}
			 }		
		}
		for (let x = 0; x < items.length; x++)
		{
			items[x].style.order = items.length - x;
		}
		headOther[0].innerHTML = "Unit Price <img src='svg/down-arrow.svg' class='sort-price'>";
	}
	if (clickSortUnitPrice == 3)
	{
		for (let x = 0; x < items.length; x++)
		{
			items[x].style.order = x;
		}
		clickSortUnitPrice = 0;
		headOther[0].innerHTML = "Unit Price <img src='svg/triangles.svg' class='sort-price'>";
	}
	clickSortUnitPrice++;
	document.getElementsByClassName("sort-products")[0].addEventListener("click", sortProducts);
	document.getElementsByClassName("sort-price")[0].addEventListener("click", sortUnitPrice);
	document.getElementsByClassName("sort-quantity")[0].addEventListener("click", sortQuantity);
	document.getElementsByClassName("sort-total")[0].addEventListener("click", sortTotalPrice);
}
//sorting by quantoty of products:
function sortQuantity()
{
	let headProducts = document.getElementsByClassName("head-item-description-1");
	let headOther = document.getElementsByClassName("item-description-1");
	clickSortProducts = 1;
	clickSortUnitPrice = 1;
	clickSortTotalPrice = 1;
	let items = Array.from(document.getElementsByClassName("item-1"));
	let quantity = Array.from(document.querySelectorAll(".item-1 .item-quantity-sort"));
	let temp;
	if (clickSortQuantity == 1)
	{
		for (let i = 0; i < items.length - 1; i++)
		{
			 for (let j = 0; j < items.length - i - 1; j++)
			 {
		 		if (Number(quantity[j].innerText) > Number(quantity[j + 1].innerText))
				{
			 		temp = quantity[j];
			 		quantity[j] = quantity[j + 1];
			 		quantity[j + 1] = temp;
			 		temp = items[j];
			 		items[j] = items[j + 1];
			 		items[j + 1] = temp;
			 	}
			 }		
		}
		for (let x = 0; x < items.length; x++)
		{
			items[x].style.order = x;
		}
		headOther[1].innerHTML = "Quantity <img src='svg/up-arrow.svg' class='sort-quantity'>";
		headProducts[0].innerHTML = "Product <img src='svg/triangles.svg' class='sort-products'>";
		headOther[0].innerHTML = "Unit Price <img src='svg/triangles.svg' class='sort-price'>";
		headOther[2].innerHTML = "Total <img src='svg/triangles.svg' class='sort-total'>";
	}
	if (clickSortQuantity == 2)
	{
		for (let i = 0; i < items.length - 1; i++)
		{
			 for (let j = 0; j < items.length - i - 1; j++)
			 {
		 		if (Number(quantity[j].innerText) > Number(quantity[j + 1].innerText)) 
		 		{
			 		temp = quantity[j];
			 		quantity[j] = quantity[j + 1];
			 		quantity[j + 1] = temp;
			 		temp = items[j];
			 		items[j] = items[j + 1];
			 		items[j + 1] = temp;
			 	}
			 }		
		}
		for (let x = 0; x < items.length; x++)
		{
			items[x].style.order = items.length - x;
		}
		headOther[1].innerHTML = "Quantity <img src='svg/down-arrow.svg' class='sort-quantity'>";
	}
	if (clickSortQuantity == 3)
	{
		for (let x = 0; x < items.length; x++)
		{
			items[x].style.order = x;
		}
		clickSortQuantity = 0;
		headOther[1].innerHTML = "Quantity <img src='svg/triangles.svg' class='sort-quantity'>";
	}
	clickSortQuantity++;
	document.getElementsByClassName("sort-products")[0].addEventListener("click", sortProducts);
	document.getElementsByClassName("sort-price")[0].addEventListener("click", sortUnitPrice);
	document.getElementsByClassName("sort-quantity")[0].addEventListener("click", sortQuantity);
	document.getElementsByClassName("sort-total")[0].addEventListener("click", sortTotalPrice);
}
////sorting by total price of products:
function sortTotalPrice()
{
	let headProducts = document.getElementsByClassName("head-item-description-1");
	let headOther = document.getElementsByClassName("item-description-1");
	clickSortProducts = 1;
	clickSortUnitPrice = 1;
	clickSortQuantity = 1;
	let items = Array.from(document.getElementsByClassName("item-1"));
	let totalPrice = Array.from(document.querySelectorAll(".item-1 .item-total-price-sort b"));
	let temp;
	if (clickSortTotalPrice == 1)
	{
		for (let i = 0; i < items.length - 1; i++)
		{
			 for (let j = 0; j < items.length - i - 1; j++)
			 {
		 		if (Number(totalPrice[j].innerText) > Number(totalPrice[j + 1].innerText))
				{
			 		temp = totalPrice[j];
			 		totalPrice[j] = totalPrice[j + 1];
			 		totalPrice[j + 1] = temp;
			 		temp = items[j];
			 		items[j] = items[j + 1];
			 		items[j + 1] = temp;
			 	}
			 }		
		}
		for (let x = 0; x < items.length; x++)
		{
			items[x].style.order = x;
		}
		headOther[2].innerHTML = "Total <img src='svg/up-arrow.svg' class='sort-total'>";
		headOther[0].innerHTML = "Unit Price <img src='svg/triangles.svg' class='sort-price'>";
		headProducts[0].innerHTML = "Product <img src='svg/triangles.svg' class='sort-products'>";
		headOther[1].innerHTML = "Quantity <img src='svg/triangles.svg' class='sort-quantity'>";
	}
	if (clickSortTotalPrice == 2)
	{
		for (let i = 0; i < items.length - 1; i++)
		{
			 for (let j = 0; j < items.length - i - 1; j++)
			 {
		 		if (Number(totalPrice[j].innerText) > Number(totalPrice[j + 1].innerText)) 
		 		{
			 		temp = totalPrice[j];
			 		totalPrice[j] = totalPrice[j + 1];
			 		totalPrice[j + 1] = temp;
			 		temp = items[j];
			 		items[j] = items[j + 1];
			 		items[j + 1] = temp;
			 	}
			 }		
		}
		for (let x = 0; x < items.length; x++)
		{
			items[x].style.order = items.length - x;
		}
		headOther[2].innerHTML = "Total <img src='svg/down-arrow.svg' class='sort-total'>";
	}
	if (clickSortTotalPrice == 3)
	{
		for (let x = 0; x < items.length; x++)
		{
			items[x].style.order = x;
		}
		clickSortTotalPrice = 0;
		headOther[2].innerHTML = "Total <img src='svg/triangles.svg' class='sort-total'>";
	}
	clickSortTotalPrice++;
	document.getElementsByClassName("sort-products")[0].addEventListener("click", sortProducts);
	document.getElementsByClassName("sort-price")[0].addEventListener("click", sortUnitPrice);
	document.getElementsByClassName("sort-quantity")[0].addEventListener("click", sortQuantity);
	document.getElementsByClassName("sort-total")[0].addEventListener("click", sortTotalPrice);
}

function ShipEdit()
{
	let edit = document.getElementsByClassName("edit-ship");
	edit[0].classList.add("display-none");
	let display = document.getElementsByClassName("display-ship");
	display[0].classList.remove("display-none");
	let info = document.getElementsByClassName("input-ship");
	for(let i = 0; i < info.length; i++)
	{
		info[i].classList.remove("input-info");
		info[i].removeAttribute("readonly");
		info[i].classList.add("input-border");
	}
}
function CustEdit()
{
	let edit = document.getElementsByClassName("edit-cust");
	edit[0].classList.add("display-none");
	let display = document.getElementsByClassName("display-cust");
	display[0].classList.remove("display-none");
	let info = document.getElementsByClassName("input-cust");
	for(let i = 0; i < info.length; i++)
	{
		info[i].classList.remove("input-info");
		info[i].removeAttribute("readonly");
		info[i].classList.add("input-border");
	}
}
document.getElementsByClassName("edit-ship")[0].addEventListener("click", ShipEdit);
document.getElementsByClassName("edit-cust")[0].addEventListener("click", CustEdit);

async function ShipDisplay()
{
	let info = document.getElementsByClassName("input-ship");
	if(!isNaN(Number(info[2].value)))
	{
	let edit = document.getElementsByClassName("edit-ship");
	edit[0].classList.remove("display-none");
	let display = document.getElementsByClassName("display-ship");
	display[0].classList.add("display-none");
	for(let i = 0; i < info.length; i++)
	{
		info[i].classList.add("input-info");
		info[i].setAttribute("readonly", "");
		info[i].classList.remove("input-border");
	}
	let orders = document.getElementsByClassName("order");
	let orderNum = document.getElementsByClassName("order-num");
	let i = 0;
	for (let c = 0; c < orders.length; c++)
	{
		if (orders[c].className.includes("back-gr-clr-border"))
		{
			i = orderNum[c].innerText.substr(6);
			break;
		}
	}
	const OrderData = await fetch(`http://localhost:80/api/Orders/${i}`, {
		method: 'GET'
	});
	const DisplayOrder = await OrderData.json();
	DisplayOrder.summary.customer = info[0].value;
	DisplayOrder.customerInfo.firstName = info[0].value;
	DisplayOrder.customerInfo.address = info[1].value;
	DisplayOrder.shipTo.name = info[0].value;
	DisplayOrder.shipTo.address = info[1].value;
	DisplayOrder.shipTo.ZIP = info[2].value;
	DisplayOrder.shipTo.region = info[3].value;
	DisplayOrder.shipTo.country = info[4].value;
	await fetch(`http://localhost:80/api/Orders/${i}`, {
		method: 'PUT',
		headers: {
      		"Content-type": "application/json; charset=UTF-8"  
    	},
    	body: JSON.stringify(DisplayOrder)
	});
	window.location.reload();
	}
	else alert("Некорректный ZIP");
}
async function CustDisplay()
{
	let edit = document.getElementsByClassName("edit-cust");
	edit[0].classList.remove("display-none");
	let display = document.getElementsByClassName("display-cust");
	display[0].classList.add("display-none");
	let info = document.getElementsByClassName("input-cust");
	for(let i = 0; i < info.length; i++)
	{
		info[i].classList.add("input-info");
		info[i].setAttribute("readonly", "");
		info[i].classList.remove("input-border");
	}
	let orders = document.getElementsByClassName("order");
	let orderNum = document.getElementsByClassName("order-num");
	let i = 0;
	for (let c = 0; c < orders.length; c++)
	{
		if (orders[c].className.includes("back-gr-clr-border"))
		{
			i = orderNum[c].innerText.substr(6);
			break;
		}
	}
	const OrderData = await fetch(`http://localhost:80/api/Orders/${i}`, {
		method: 'GET'
	});
	const DisplayOrder = await OrderData.json();
	DisplayOrder.summary.customer = info[0].value;
	DisplayOrder.shipTo.name = info[0].value;
	DisplayOrder.shipTo.address = info[2].value;
	DisplayOrder.customerInfo.firstName = info[0].value;
	DisplayOrder.customerInfo.lastName = info[1].value;
	DisplayOrder.customerInfo.address = info[2].value;
	DisplayOrder.customerInfo.phone = info[3].value;
	DisplayOrder.customerInfo.email = info[4].value;
	await fetch(`http://localhost:80/api/Orders/${i}`, {
		method: 'PUT',
		headers: {
      		"Content-type": "application/json; charset=UTF-8"  
    	},
    	body: JSON.stringify(DisplayOrder)
	});
	window.location.reload();
}
document.getElementsByClassName("display-ship")[0].addEventListener("click", ShipDisplay);
document.getElementsByClassName("display-cust")[0].addEventListener("click", CustDisplay);

function ShipEditPhone()
{
	let edit = document.getElementsByClassName("edit-ship-phone");
	edit[0].classList.add("display-none");
	let display = document.getElementsByClassName("display-ship-phone");
	display[0].classList.remove("display-none");
	let info = document.getElementsByClassName("input-ship-phone");
	for(let i = 0; i < info.length; i++)
	{
		info[i].classList.remove("input-info");
		info[i].removeAttribute("readonly");
		info[i].classList.add("input-border");
	}
}
function CustEditPhone()
{
	let edit = document.getElementsByClassName("edit-cust-phone");
	edit[0].classList.add("display-none");
	let display = document.getElementsByClassName("display-cust-phone");
	display[0].classList.remove("display-none");
	let info = document.getElementsByClassName("input-cust-phone");
	for(let i = 0; i < info.length; i++)
	{
		info[i].classList.remove("input-info");
		info[i].removeAttribute("readonly");
		info[i].classList.add("input-border");
	}
}
document.getElementsByClassName("edit-ship-phone")[0].addEventListener("click", ShipEditPhone);
document.getElementsByClassName("edit-cust-phone")[0].addEventListener("click", CustEditPhone);

async function ShipDisplayPhone()
{
	let info = document.getElementsByClassName("input-ship-phone");
	if(!isNaN(Number(info[2].value)))
	{
	let edit = document.getElementsByClassName("edit-ship-phone");
	edit[0].classList.remove("display-none");
	let display = document.getElementsByClassName("display-ship-phone");
	display[0].classList.add("display-none");
	for(let i = 0; i < info.length; i++)
	{
		info[i].classList.add("input-info");
		info[i].setAttribute("readonly", "");
		info[i].classList.remove("input-border");
	}
	let orders = document.getElementsByClassName("order");
	let orderNum = document.getElementsByClassName("order-num");
	let i = 0;
	for (let c = 0; c < orders.length; c++)
	{
		if (orders[c].className.includes("back-gr-clr-border"))
		{
			i = orderNum[c].innerText.substr(6);
			break;
		}
	}
	const OrderData = await fetch(`http://localhost:80/api/Orders/${i}`, {
		method: 'GET'
	});
	const DisplayOrder = await OrderData.json();
	DisplayOrder.summary.customer = info[0].value;
	DisplayOrder.customerInfo.firstName = info[0].value;
	DisplayOrder.customerInfo.address = info[1].value;
	DisplayOrder.shipTo.name = info[0].value;
	DisplayOrder.shipTo.address = info[1].value;
	DisplayOrder.shipTo.ZIP = info[2].value;
	DisplayOrder.shipTo.region = info[3].value;
	DisplayOrder.shipTo.country = info[4].value;
	await fetch(`http://localhost:80/api/Orders/${i}`, {
		method: 'PUT',
		headers: {
      		"Content-type": "application/json; charset=UTF-8"  
    	},
    	body: JSON.stringify(DisplayOrder)
	});
	window.location.reload();
	}
	else alert("Некорректный ZIP");
}
async function CustDisplayPhone()
{
	let edit = document.getElementsByClassName("edit-cust-phone");
	edit[0].classList.remove("display-none");
	let display = document.getElementsByClassName("display-cust-phone");
	display[0].classList.add("display-none");
	let info = document.getElementsByClassName("input-cust-phone");
	for(let i = 0; i < info.length; i++)
	{
		info[i].classList.add("input-info");
		info[i].setAttribute("readonly", "");
		info[i].classList.remove("input-border");
	}
	let orders = document.getElementsByClassName("order");
	let orderNum = document.getElementsByClassName("order-num");
	let i = 0;
	for (let c = 0; c < orders.length; c++)
	{
		if (orders[c].className.includes("back-gr-clr-border"))
		{
			i = orderNum[c].innerText.substr(6);
			break;
		}
	}
	const OrderData = await fetch(`http://localhost:80/api/Orders/${i}`, {
		method: 'GET'
	});
	const DisplayOrder = await OrderData.json();
	DisplayOrder.summary.customer = info[0].value;
	DisplayOrder.shipTo.name = info[0].value;
	DisplayOrder.shipTo.address = info[2].value;
	DisplayOrder.customerInfo.firstName = info[0].value;
	DisplayOrder.customerInfo.lastName = info[1].value;
	DisplayOrder.customerInfo.address = info[2].value;
	DisplayOrder.customerInfo.phone = info[3].value;
	DisplayOrder.customerInfo.email = info[4].value;
	await fetch(`http://localhost:80/api/Orders/${i}`, {
		method: 'PUT',
		headers: {
      		"Content-type": "application/json; charset=UTF-8"  
    	},
    	body: JSON.stringify(DisplayOrder)
	});
	window.location.reload();
}
document.getElementsByClassName("display-ship-phone")[0].addEventListener("click", ShipDisplayPhone);
document.getElementsByClassName("display-cust-phone")[0].addEventListener("click", CustDisplayPhone);

//----popups-----
function ChooseNew()
{
	document.getElementsByClassName("choose-add")[0].classList.add("display-none");
	document.getElementsByClassName("add-new-customer")[0].classList.remove("display-none");
}
document.getElementsByClassName("add-new-button")[0].addEventListener("click", ChooseNew);

async function ChooseOld()
{
	document.getElementsByClassName("add-old-customer")[0].classList.remove("display-none");
	document.getElementsByClassName("choose-add")[0].classList.add("display-none");
	var listCastomers = document.getElementsByClassName("list-customers");
	const CustomersData = await fetch(`http://localhost:80/api/Customers`, {
		method: 'GET'
	});
	const Customers = await CustomersData.json();
	Customers.forEach(el => {
		var list = document.getElementsByClassName("list-customers")[0];
		var cust = document.createElement("div");
		cust.classList.add("cust");
		var name = document.createElement("div");
		name.classList.add("first-last-name");
		name.innerHTML = el.name;
		var radio = document.createElement("div");
		radio.classList.add("radio");
		radio.innerHTML = `<input type='radio' name='review_type' value='${el.idCustomer}' onclick='checkType(this)'>`
		cust.appendChild(name);
		cust.appendChild(radio);
		list.appendChild(cust);
	});
}
document.getElementsByClassName("add-old-button")[0].addEventListener("click", ChooseOld);

function OrderPopupOpen()
{
	document.getElementsByClassName("order-popup")[0].classList.remove("display-none");
}
document.getElementsByClassName("svg-add-order")[0].addEventListener("click", OrderPopupOpen);

async function OrderPopupAdd()
{
	let input = document.getElementsByClassName("input-add-order");
	if(!isNaN(Number(input[4].value)))
	{
	var date = new Date();
	order = {
        "summary": {
            "createdAt": `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`,
            "customer": input[1].value,
            "status": "Pending",
            "shippedAt": `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`,
            "totalPrice": 0,
            "currency": "EUR"
        },
        "shipTo": {
            "name": `${input[1].value} ${input[2].value}`,
            "address": input[3].value,
            "ZIP": input[4].value,
            "region": input[5].value,
            "country": input[6].value
        },
        "customerInfo": {
            "firstName": input[1].value,
            "lastName": input[2].value,
            "address": input[3].value,
            "phone": input[7].value,
            "email": input[8].value
        }
    };
	const Ord = await fetch(`http://localhost:80/api/Orders`, {
	credentials: 'same-origin', 
    method: 'POST',  
    headers: {
      "Content-type": "application/json; charset=UTF-8"  
    },  
    	body: JSON.stringify(order)
  	});
	window.location.reload();
	}
	else alert("Некорректный ZIP");
}
document.getElementsByClassName("add-order-button")[0].addEventListener("click", OrderPopupAdd);

var orderRadio;
function checkType(radio)
{
	orderRadio = radio;
}

async function OrderPopupNewAdd()
{
	if(orderRadio != undefined)
	{
		var date = new Date();
		await fetch(`http://localhost:80/api/CustomerOrder`, {
			credentials: 'same-origin', 
	   			method: 'POST',  
    			headers: {
     				"Content-type": "application/json; charset=UTF-8"  
    		},  
	   		body: JSON.stringify({
    			"idCustomer": orderRadio.value,
    			"createdAt": `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`,
           		"shippedAt": `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`,
           		"status": "Pending",
       	    	"currency": "EUR"
    		})
  		})
		.catch(err => alert(err));
		window.location.reload();
	}
	else alert("Некорректные данные");
}
document.getElementsByClassName("add2-order-button")[0].addEventListener("click", OrderPopupNewAdd);

async function DeleteOrder()
{
	let orders = document.getElementsByClassName("order");
	let orderNum = document.getElementsByClassName("order-num");
	let i = 0;
	for (let c = 0; c < orders.length; c++)
	{
		if (orders[c].className.includes("back-gr-clr-border"))
		{
			i = orderNum[c].innerText.substr(6);
			break;
		}
	}
	if (i == 0) alert("Выберите нужный заказ");
	else 
	{
		await fetch(`http://localhost:80/api/Orders/${i}`, {
			credentials: 'same-origin', 
   			method: 'DELETE',
   			headers: {
      			'Content-Type': 'application/json'
    		},
  		})
  		.catch(err => alert(err));
  		window.location.reload();
	}
	location.search = "";
}
document.getElementsByClassName("svg-delete-order")[0].addEventListener("click", DeleteOrder);

function OrderPopupClose()
{
	document.getElementsByClassName("order-popup")[0].classList.add("display-none");
	document.getElementsByClassName("add-new-customer")[0].classList.add("display-none");
	document.getElementsByClassName("choose-add")[0].classList.remove("display-none");
	window.location.reload();
}
document.getElementsByClassName("cancel-order-button")[0].addEventListener("click", OrderPopupClose);

function OrderPopupNewClose()
{
	document.getElementsByClassName("order-popup")[0].classList.add("display-none");
	document.getElementsByClassName("add-old-customer")[0].classList.add("display-none");
	document.getElementsByClassName("choose-add")[0].classList.remove("display-none");
	window.location.reload();
}
document.getElementsByClassName("cancel2-order-button")[0].addEventListener("click", OrderPopupNewClose);

async function ItemPopupOpen()
{
	document.getElementsByClassName("item-popup")[0].classList.remove("display-none");
	const ProductsData = await fetch(`http://localhost:80/api/products`, {
		method: 'GET'
	});
	const Products = await ProductsData.json();
	var list = document.getElementsByClassName("list-items")[0];
	Products.forEach(el => {
		var prod = document.createElement("div");
		prod.classList.add("product-item");
		var infoItem = document.createElement("div");
		infoItem.classList.add("info-item");
		var nameItem = document.createElement("div");
		nameItem.classList.add("name-item");
		nameItem.innerHTML = `<b>${el.name}</b>`;
		var priceItem = document.createElement("div");
		priceItem.classList.add("price-item");
		priceItem.innerHTML = `${el.price} ${el.currency}`;
		var radioItem = document.createElement("div");
		radioItem.classList.add("radio-item");
		radioItem.innerHTML = `<input type='radio' name='review_type2' value='${el.idProduct}' onclick='checkItem(this)'/>`;
		infoItem.appendChild(nameItem);
		infoItem.appendChild(priceItem);
		infoItem.appendChild(radioItem);
		prod.appendChild(infoItem);
		list.appendChild(prod);
	});
}
document.getElementsByClassName("svg-add-item")[0].addEventListener("click", ItemPopupOpen);
document.getElementsByClassName("svg-add-item")[1].addEventListener("click", ItemPopupOpen);

var itemRadio;
function checkItem(id)
{
	itemRadio = id;
}

async function ItemPopupAdd()
{
	var input = document.getElementsByClassName("input-enter-quantity")[0];
	if(input.value != "" && !isNaN(Number(input.value)) && itemRadio != undefined)
	{
		var orderNum = document.getElementsByClassName("order-num");
		var orders = document.getElementsByClassName("order");
		var id = 0;
		for (var i = 0; i < orderNum.length; i++)
		{
			if(orders[i].className.includes("back-gr-clr-border"))
			{
				id = Number(orderNum[i].innerText.substr(6));
				break;
			}
		}
		await fetch(`http://localhost:80/api/Orders/${id}/products`, {
			credentials: 'same-origin', 
			method: 'POST',  
			headers: {
				"Content-type": "application/json; charset=UTF-8"  
			},  
   			body: JSON.stringify({
				"idProduct": Number(itemRadio.value),
				"quantity": Number(input.value)
			})
		})
		.catch(err => alert(err));
		window.location.reload();
	}
	else alert("Некорректные данные");
}
document.getElementsByClassName("add-item-button")[0].addEventListener("click", ItemPopupAdd);

async function deleteItem(item)
{
	let orders = document.getElementsByClassName("order");
	let orderNum = document.getElementsByClassName("order-num");
	let i = 0;
	for (let c = 0; c < orders.length; c++)
	{
		if (orders[c].className.includes("back-gr-clr-border"))
		{
			i = orderNum[c].innerText.substr(6);
			break;
		}
	}
	var idProduct = Number(item.className.substr(28));
	await fetch(`http://localhost:80/api/Orders/${i}/products/${idProduct}`, {
		credentials: 'same-origin', 
   		method: 'DELETE',
   		headers: {
   			'Content-Type': 'application/json'
   		},
  	})
  	.catch(err => alert(err));
  	window.location.reload();
}

function ItemPopupClose()
{
	document.getElementsByClassName("item-popup")[0].classList.add("display-none");
	window.location.reload();
}
document.getElementsByClassName("cancel-item-button")[0].addEventListener("click", ItemPopupClose);

async function UpdateOrders()
{
	let preloader = document.getElementById("preloader");
	preloader.style.display = "block";
	let ord = document.getElementsByClassName("orders");
	while (ord[0].firstChild) {
  		ord[0].removeChild(ord[0].firstChild);
	}
	let preload = document.createElement("div");
	preload.id = "preloader";
	preload.innerHTML = '<div id="floatingBarsG"><div class="blockG" id="rotateG_01"></div><div class="blockG" id="rotateG_02"></div><div class="blockG" id="rotateG_03"></div><div class="blockG" id="rotateG_04"></div><div class="blockG" id="rotateG_05"></div><div class="blockG" id="rotateG_06"></div><div class="blockG" id="rotateG_07"></div><div class="blockG" id="rotateG_08"></div></div>';
	ord[0].appendChild(preload);
	const OrdersData = await fetch("http://localhost:80/api/Orders", {
		method: 'GET'
	});
	const Orders = await OrdersData.json();
	document.getElementsByClassName("text-up-order")[0].innerHTML = "Orders (" + Orders.length + ")";
	if (Orders.length === 0) // if no Orders
	{
		let rightColumnNull = document.getElementsByClassName("right-column-wo-header");
		rightColumnNull[0].classList.remove("display-none");
		rightColumnNull[0].innerHTML = "No orders";
		rightColumnNull[0].style.paddingTop = 25 + "%";
		rightColumnNull[0].style.paddingLeft = 47 + "%";
	}
	else
	{
		for (let i = 0; i < Orders.length; i++)
		{
			OrderGeneration(i, Orders);
		}
		let click = document.getElementsByClassName("order");
		let orderNum = document.getElementsByClassName("order-num");

		let hash = Number((location.search).substr(4));
		let startNum = 0;
		for (let h = 0; h < click.length; h++)
		{
			if (hash === Number(orderNum[h].innerText.substr(6)))
				startNum = h;
		}
		GenerateInfo(Orders, startNum, click, orderNum);
		for(let value = 0; value < orderNum.length; value++)
		{
			click[value].addEventListener("click", () => { GenerateInfo(Orders, value, click, orderNum) });
		}
		//generation block with no info for orders
		let orders1 = document.getElementsByClassName("orders");
		let order1 = document.createElement("div");
		order1.innerHTML = "Ничего не найдено";
		order1.classList.add("display-none");
		order1.classList.add("nothing-to-find-order");
		order1.style.textAlign = "center";
		orders1[0].appendChild(order1);
	}

	preload.style.display = "none";
}
document.getElementsByClassName("svg-update")[0].addEventListener("click", UpdateOrders);

async function UpdateItemsPC()
{
	let input, filter, childItems;
		input = document.getElementById("search-items-pc");
		filter = input.value.toUpperCase();
		childItems = document.getElementsByClassName("item-1");
		let count = 0;

		//check the switched order
		let orderCheck = document.getElementsByClassName("order");
		let orderNum = document.getElementsByClassName("order-num");
		let num = Number(document.getElementsByClassName("left-price")[0].innerText.substr(6));
		const ProductsData = await fetch(`http://localhost:80/api/Orders/${num}/products`, {
			method: 'GET'
		});
		const Prod = await ProductsData.json();
		let items = document.getElementsByClassName("item-1");
		while (items[0]) {
			items[0].remove();
		}
		for(let d = 0; d < Prod.length; d++)
		{
			let products = document.getElementsByClassName("products-1");
			let items = document.createElement("div");
			items.classList.add("item-1");
			let headItem = document.createElement("div");
			headItem.classList.add("head-item-description-1");
			let itemPrice = document.createElement("div");
			itemPrice.classList.add("item-description-1");
			itemPrice.classList.add("item-price-sort");
			let itemQuantity = document.createElement("div");
			itemQuantity.classList.add("item-description-1");
			itemQuantity.classList.add("item-quantity-sort");
			let itemTotalPrice = document.createElement("div");
			itemTotalPrice.classList.add("item-description-1");
			itemTotalPrice.classList.add("item-total-price-sort");
			let delItem = document.createElement("div");
			delItem.classList.add("item-description-1");
			headItem.innerHTML = "<b>" + Prod[d].name + "</b><br>" + Prod[d].id;
			itemPrice.innerHTML = "<b>" + Prod[d].price + "</b> " + Prod[d].currency;
			itemQuantity.innerHTML = Prod[d].quantity;
			itemTotalPrice.innerHTML = "<b>" + Prod[d].totalPrice + "</b> " + Prod[d].currency;
			delItem.innerHTML = `<div style='align-items: center'><img title='удалить продукт' class='svg-delete-item item-delete-${Prod[d].id}' src='svg/delete-item.svg' onclick='deleteItem(this)'></div>`;
			items.appendChild(headItem);
			items.appendChild(itemPrice);
			items.appendChild(itemQuantity);
			items.appendChild(itemTotalPrice);
			items.appendChild(delItem);
			products[0].appendChild(items);

			count++;
		}

		if (count === 0)
		{
			let noItem = document.getElementsByClassName("nothing-to-find-item-pc");
			noItem[0].classList.remove("display-none");
		}
		else
		{
			let noItem = document.getElementsByClassName("nothing-to-find-item-pc");
			noItem[0].classList.add("display-none");		
		}
		document.getElementsByClassName("line-items-1")[0].innerHTML = "Line items (" + count + ")";

		//default filters when we searching
		document.getElementsByClassName("head-item-description-1")[0].innerHTML = "Product <img src='svg/triangles.svg' class='sort-products'>";
		document.getElementsByClassName("item-description-1")[0].innerHTML = "Unit Price <img src='svg/triangles.svg' class='sort-price'>";
		document.getElementsByClassName("item-description-1")[1].innerHTML = "Quantity <img src='svg/triangles.svg' class='sort-quantity'>";
		document.getElementsByClassName("item-description-1")[2].innerHTML = "Total <img src='svg/triangles.svg' class='sort-total'>";
		document.getElementsByClassName("sort-products")[0].addEventListener("click", sortProducts);
		document.getElementsByClassName("sort-price")[0].addEventListener("click", sortUnitPrice);
		document.getElementsByClassName("sort-quantity")[0].addEventListener("click", sortQuantity);
		document.getElementsByClassName("sort-total")[0].addEventListener("click", sortTotalPrice);
		clickSortProducts = 1;
		clickSortUnitPrice = 1;
		clickSortQuantity = 1;
		clickSortTotalPrice = 1;

}
document.getElementsByClassName("svg-update-1")[0].addEventListener("click", UpdateItemsPC);

async function UpdateItemsPhone()
{
	let input, filter, childItems;
		input = document.getElementById("search-items-phone");
		filter = input.value.toUpperCase();
		childItems = document.getElementsByClassName("item-2");
		let count = 0;

		//check the switched order
		let orderCheck = document.getElementsByClassName("order");
		let orderNum = document.getElementsByClassName("order-num");
		let num = Number(document.getElementsByClassName("left-price")[0].innerText.substr(6));
		const ProductsData = await fetch(`http://localhost:80/api/Orders/${num}/products`, {
			method: 'GET'
		});
		const Prod = await ProductsData.json();
		//searching and generating items phone
		let items = document.getElementsByClassName("item-2");
		while (items[0]) {
			items[0].remove();
		}
		for(let d = 0; d < Prod.length; d++)
		{
			let products2 = document.getElementsByClassName("products-2");
			let item2 = document.createElement("div");
			item2.classList.add("item-2");
			let itemDescription1 = document.createElement("div");
			itemDescription1.classList.add("item-description-2");
			itemDescription1.innerHTML = "<div><b>" + Prod[d].name + "</b></div>" + 
			"<div>" + Prod[d].id + "</div>";
			let itemDescription2 = document.createElement("div");
			itemDescription2.classList.add("item-description-2");
			itemDescription2.innerHTML = "<div>Unit Price:</div>" + "<div><b>" + Prod[d].price + "</b> " + 
			Prod[d].currency + "</div>";
			let itemDescription3 = document.createElement("div");
			itemDescription3.classList.add("item-description-2");
			itemDescription3.innerHTML = "<div>Quantity:</div>" + "<div>" + Prod[d].quantity + "</div>"
			let itemDescription4 = document.createElement("div");
			itemDescription4.classList.add("item-description-2");
			itemDescription4.innerHTML = "<div>Total:</div>" +  "<div><b>" + Prod[d].totalPrice + "</b> " + 
			Prod[d].currency + "</div>";
			item2.appendChild(itemDescription1);
			item2.appendChild(itemDescription2);
			item2.appendChild(itemDescription3);
			item2.appendChild(itemDescription4);
			products2[0].appendChild(item2);

			count++;
		}
		if (count === 0)
		{
			let noItem = document.getElementsByClassName("nothing-to-find-item-phone");
			noItem[0].classList.remove("display-none");
		}
		else
		{
			let noItem = document.getElementsByClassName("nothing-to-find-item-phone");
			noItem[0].classList.add("display-none");		
		}
		document.getElementsByClassName("line-items-2")[0].innerHTML = "Line items (" + count + ")";

}
document.getElementsByClassName("svg-update-2")[0].addEventListener("click", UpdateItemsPhone);

function initMap() {
    var map = new google.maps.Map(document.getElementById('mapNEW'), {
		zoom: 10
    });
    var geocoder = new google.maps.Geocoder();

    document.getElementsByClassName("svg-map")[0].addEventListener('click', function() {
          geocodeAddress(geocoder, map);
    });
}

function geocodeAddress(geocoder, resultsMap) {

	var address = `${document.getElementById("cust-region").value}, ${document.getElementById("cust-address").value}`;
	geocoder.geocode({'address': address}, function(results, status) {
		if (status === 'OK') {
			resultsMap.setCenter(results[0].geometry.location);
			var marker = new google.maps.Marker({
				map: resultsMap,
				position: results[0].geometry.location
			});
		} 
		else 
		{
			alert('Geocode was not successful for the following reason: ' + status);
		}
	});
}