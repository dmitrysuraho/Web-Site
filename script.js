//------orders generation-----------------------------------------------------------------------------------------------
function OrderGeneration(i)
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
	orderDate.innerHTML = Orders[i].OrderInfo.createdAt;

	let leftOrderInfo = document.createElement("div");
	leftOrderInfo.classList.add("left-order-info");

	let orderShipped = document.createElement("div");
	orderShipped.classList.add("order-shipped");
	orderShipped.innerHTML = "<p>" + Orders[i].OrderInfo.customer + "</p><p>Shipped: " + Orders[i].OrderInfo.shippedAt + "</p>";
	let status = document.createElement("div");
	status.classList.add("status");
	status.innerHTML =  Orders[i].OrderInfo.status;


	leftOrderInfo.appendChild(orderShipped);
	leftOrderInfo.appendChild(status);

	leftNumDate.appendChild(orderNum);
	leftNumDate.appendChild(orderDate);

	order.appendChild(leftNumDate);
	order.appendChild(leftOrderInfo);

	orders[0].appendChild(order);
}

function GenerateInfo()
{
	
	let click = document.getElementsByClassName("order");
	let orderNum = document.getElementsByClassName("order-num");
	for(let value = 0; value < orderNum.length; value++)
	{
			function OrdersClick()
			{
				let i = 0;
				for (let c = 0; c < Orders.length; c++)
				{
					if(Orders[c].id === orderNum[value].innerText.substr(6))
					{
						i = c;
						break;
					}
				}
//--------------------------------------------------------------------------------------------
				//default filters when we switch between orders
				clickSortProducts = 1;
				clickSortUnitPrice = 1;
				clickSortQuantity = 1;
				clickSortTotalPrice = 1;

				input = document.getElementById("search-items-pc");
				input.value = "";
				input = document.getElementById("search-items-phone");
				input.value = "";

				ShippingAdress();
//--------------------------------------------------------------------------------------------
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
				var totalPrice = 0;
				for(let l = 0; l < Orders[i].products.length; l++)
				{
					totalPrice += Number(Orders[i].products[l].totalPrice);
				}
				document.getElementsByClassName("price")[0].innerHTML = totalPrice + "<br><p class='eur'>EUR</p>";
				document.getElementsByClassName("ordered-shipped")[0].innerHTML = 
				"Customer: " + Orders[i].OrderInfo.customer + "<br>" + 
				"Ordered: " + Orders[i].OrderInfo.createdAt + "<br>" + 
				"Shipped: " + Orders[i].OrderInfo.shippedAt;

				//'shipTo' generation(for PC - [0], and phones - [1])----------
				document.getElementsByClassName("name")[0].innerHTML = Orders[i].ShipTo.name;
				document.getElementsByClassName("street")[0].innerHTML = Orders[i].ShipTo.Address;
				document.getElementsByClassName("zip-code")[0].innerHTML = Orders[i].ShipTo.ZIP;
				document.getElementsByClassName("region")[0].innerHTML = Orders[i].ShipTo.Region;
				document.getElementsByClassName("country")[0].innerHTML = Orders[i].ShipTo.Country;
				document.getElementsByClassName("name")[1].innerHTML = Orders[i].ShipTo.name;
				document.getElementsByClassName("street")[1].innerHTML = Orders[i].ShipTo.Address;
				document.getElementsByClassName("zip-code")[1].innerHTML = Orders[i].ShipTo.ZIP;
				document.getElementsByClassName("region")[1].innerHTML = Orders[i].ShipTo.Region;
				document.getElementsByClassName("country")[1].innerHTML = Orders[i].ShipTo.Country;

				document.getElementsByClassName("first-name")[0].innerHTML = Orders[i].CustomerInfo.firstName;
				document.getElementsByClassName("last-name")[0].innerHTML = Orders[i].CustomerInfo.lastName;
				document.getElementsByClassName("address")[0].innerHTML = Orders[i].CustomerInfo.address;
				document.getElementsByClassName("phone")[0].innerHTML = Orders[i].CustomerInfo.phone;
				document.getElementsByClassName("email")[0].innerHTML = Orders[i].CustomerInfo.email;
				document.getElementsByClassName("first-name")[1].innerHTML = Orders[i].CustomerInfo.firstName;
				document.getElementsByClassName("last-name")[1].innerHTML = Orders[i].CustomerInfo.lastName;
				document.getElementsByClassName("address")[1].innerHTML = Orders[i].CustomerInfo.address;
				document.getElementsByClassName("phone")[1].innerHTML = Orders[i].CustomerInfo.phone;
				document.getElementsByClassName("email")[1].innerHTML = Orders[i].CustomerInfo.email;

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
				document.getElementsByClassName("line-items-1")[0].innerHTML = "Line items (" + Orders[i].products.length + ")";
				document.getElementsByClassName("line-items-2")[0].innerHTML = "Line items (" + Orders[i].products.length + ")";

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
				header.appendChild(product);
				header.appendChild(unitPrice);
				header.appendChild(quantity);
				header.appendChild(total);
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
				for(let d = 0; d < Orders[i].products.length; d++)
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
					headItem.innerHTML = "<b>" + Orders[i].products[d].name + "</b><br>" + Orders[i].products[d].id;
					itemPrice.innerHTML = "<b>" + Orders[i].products[d].price + "</b> " + Orders[i].products[d].currency;
					itemQuantity.innerHTML = Orders[i].products[d].quantity;
					itemTotalPrice.innerHTML = "<b>" + Orders[i].products[d].totalPrice + "</b> " + Orders[i].products[d].currency;
					items.appendChild(headItem);
					items.appendChild(itemPrice);
					items.appendChild(itemQuantity);
					items.appendChild(itemTotalPrice);
					products.appendChild(items);
					twoBlocks[0].appendChild(products);

					//phones
					let item2 = document.createElement("div");
					item2.classList.add("item-2");
					let itemDescription1 = document.createElement("div");
					itemDescription1.classList.add("item-description-2");
					itemDescription1.innerHTML = "<div><b>" + Orders[i].products[d].name + "</b></div>" + 
					"<div>" + Orders[i].products[d].id + "</div>";
					let itemDescription2 = document.createElement("div");
					itemDescription2.classList.add("item-description-2");
					itemDescription2.innerHTML = "<div>Unit Price:</div>" + "<div><b>" + Orders[i].products[d].price + "</b> " + 
					Orders[i].products[d].currency + "</div>";
					let itemDescription3 = document.createElement("div");
					itemDescription3.classList.add("item-description-2");
					itemDescription3.innerHTML = "<div>Quantity:</div>" + "<div>" + Orders[i].products[d].quantity + "</div>"
					let itemDescription4 = document.createElement("div");
					itemDescription4.classList.add("item-description-2");
					itemDescription4.innerHTML = "<div>Total:</div>" +  "<div><b>" + Orders[i].products[d].totalPrice + "</b> " + 
					Orders[i].products[d].currency + "</div>";
					item2.appendChild(itemDescription1);
					item2.appendChild(itemDescription2);
					item2.appendChild(itemDescription3);
					item2.appendChild(itemDescription4);
					products2.appendChild(item2);
					twoBlock2[0].appendChild(products2);
				}
				document.getElementsByClassName("sort-products")[0].addEventListener("click", sortProducts);
				document.getElementsByClassName("sort-price")[0].addEventListener("click", sortUnitPrice);
				document.getElementsByClassName("sort-quantity")[0].addEventListener("click", sortQuantity);
				document.getElementsByClassName("sort-total")[0].addEventListener("click", sortTotalPrice);
			}
		click[value].addEventListener("click", OrdersClick);
	}
}

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
		OrderGeneration(i);
	}
	GenerateInfo();	
	//generation block with no info for orders
	let orders1 = document.getElementsByClassName("orders");
	let order1 = document.createElement("div");
	order1.innerHTML = "Ничего не найдено";
	order1.classList.add("display-none");
	order1.classList.add("nothing-to-find-order");
	order1.style.textAlign = "center";
	orders1[0].appendChild(order1);
}

//-----searching(function names speak for themselves)------------------------------------------------------------------------------------------------------

	function searchOrders()
	{
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
			if (Orders[i].OrderInfo.createdAt.toUpperCase().indexOf(filter) > -1 ||
				Orders[i].OrderInfo.customer.toUpperCase().indexOf(filter) > -1 ||
				Orders[i].OrderInfo.status.toUpperCase().indexOf(filter) > -1 ||
				Orders[i].OrderInfo.shippedAt.toUpperCase().indexOf(filter) > -1)
			{
				OrderGeneration(i);
				count++;
			}
			GenerateInfo();
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
	}

	
	function serachItemsPC()
	{
		let input, filter, childItems;
		input = document.getElementById("search-items-pc");
		filter = input.value.toUpperCase();
		childItems = document.getElementsByClassName("item-1");
		let count = 0;

		//check the switched order
		let orderCheck = document.getElementsByClassName("order");
		let orderNum = document.getElementsByClassName("order-num");
		let num = Number(document.getElementsByClassName("left-price")[0].innerText.substr(6)) - 1;
		
		//searching and generating items PC
		let items = document.getElementsByClassName("item-1");
		while (items[0]) {
			items[0].remove();
		}
		for(let d = 0; d < Orders[num].products.length; d++)
		{
			if (Orders[num].products[d].id.toUpperCase().indexOf(filter) > -1 ||
				Orders[num].products[d].name.toUpperCase().indexOf(filter) > -1 ||
				Orders[num].products[d].price.toUpperCase().indexOf(filter) > -1 ||
				Orders[num].products[d].currency.toUpperCase().indexOf(filter) > -1 || 
				Orders[num].products[d].quantity.toUpperCase().indexOf(filter) > -1 ||
				Orders[num].products[d].totalPrice.toUpperCase().indexOf(filter) > -1)
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
				headItem.innerHTML = "<b>" + Orders[num].products[d].name + "</b><br>" + Orders[num].products[d].id;
				itemPrice.innerHTML = "<b>" + Orders[num].products[d].price + "</b> " + Orders[num].products[d].currency;
				itemQuantity.innerHTML = Orders[num].products[d].quantity;
				itemTotalPrice.innerHTML = "<b>" + Orders[num].products[d].totalPrice + "</b> " + Orders[num].products[d].currency;
				items.appendChild(headItem);
				items.appendChild(itemPrice);
				items.appendChild(itemQuantity);
				items.appendChild(itemTotalPrice);
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


	function searchItemsPhone()
	{
		let input, filter, childItems;
		input = document.getElementById("search-items-phone");
		filter = input.value.toUpperCase();
		childItems = document.getElementsByClassName("item-2");
		let count = 0;

		//check the switched order
		let orderCheck = document.getElementsByClassName("order");
		let orderNum = document.getElementsByClassName("order-num");
		let num = Number(document.getElementsByClassName("left-price")[0].innerText.substr(6)) - 1;

		//searching and generating items phone
		let items = document.getElementsByClassName("item-2");
		while (items[0]) {
			items[0].remove();
		}
		for(let d = 0; d < Orders[num].products.length; d++)
		{
			if (Orders[num].products[d].id.toUpperCase().indexOf(filter) > -1 ||
				Orders[num].products[d].name.toUpperCase().indexOf(filter) > -1 ||
				Orders[num].products[d].price.toUpperCase().indexOf(filter) > -1 ||
				Orders[num].products[d].currency.toUpperCase().indexOf(filter) > -1 || 
				Orders[num].products[d].quantity.toUpperCase().indexOf(filter) > -1 ||
				Orders[num].products[d].totalPrice.toUpperCase().indexOf(filter) > -1)
			{
				let products2 = document.getElementsByClassName("products-2");
				let item2 = document.createElement("div");
				item2.classList.add("item-2");
				let itemDescription1 = document.createElement("div");
				itemDescription1.classList.add("item-description-2");
				itemDescription1.innerHTML = "<div><b>" + Orders[num].products[d].name + "</b></div>" + 
				"<div>" + Orders[num].products[d].id + "</div>";
				let itemDescription2 = document.createElement("div");
				itemDescription2.classList.add("item-description-2");
				itemDescription2.innerHTML = "<div>Unit Price:</div>" + "<div><b>" + Orders[num].products[d].price + "</b> " + 
				Orders[num].products[d].currency + "</div>";
				let itemDescription3 = document.createElement("div");
				itemDescription3.classList.add("item-description-2");
				itemDescription3.innerHTML = "<div>Quantity:</div>" + "<div>" + Orders[num].products[d].quantity + "</div>"
				let itemDescription4 = document.createElement("div");
				itemDescription4.classList.add("item-description-2");
				itemDescription4.innerHTML = "<div>Total:</div>" +  "<div><b>" + Orders[num].products[d].totalPrice + "</b> " + 
				Orders[num].products[d].currency + "</div>";
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
}

document.getElementsByClassName("border-svg-car")[0].addEventListener("click", ShippingAdress);
document.getElementsByClassName("border-svg-man")[0].addEventListener("click", CustomerInfo);

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